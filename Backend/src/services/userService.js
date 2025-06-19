const User = require('../models/userModel');
const Session = require('../models/auth/sessionModel');
const Workspace = require('../models/workspaceModel');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const redisClient = require('../configs/redis');

class UserService {
  static async updateUser({ id, userId, role, updateData }) {
    if (id !== userId && role !== 'admin') {
      throw new Error('Not authorized');
    }

    const updatedData = { ...updateData, updatedAt: new Date() };
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');
    if (!user) throw new Error('User not found');

    return user;
  }

  static async getAllUsers() {
    const cacheKey = 'users:all';
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const users = await User.find().select('-password');
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(users));
    return users;
  }

  static async deleteUser({ id }) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('User not found');

    await Session.deleteMany({ userId: id });
    await Workspace.deleteMany({ owner: id });
    await Workspace.updateMany({ members: id }, { $pull: { members: id } });
    await Project.deleteMany({ owner: id });
    await Project.updateMany({ members: id }, { $pull: { members: id } });
    await Task.updateMany({ assignees: id }, { $pull: { assignees: id } });
    await redisClient.del(`user:${id}:online`);

    console.log(`User deleted: ${user.email}`);
    return { message: 'User deleted successfully' };
  }
}

module.exports = UserService;