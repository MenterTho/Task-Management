const UserService = require('../services/userService');

const UserController = {
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { userId, role } = req.user;
      const updateData = req.body;
      const user = await UserService.updateUser({ id, userId, role, updateData });
      res.json(user);
    } catch (err) {
      res.status(err.message === 'Not authorized' ? 403 : err.message === 'User not found' ? 404 : 500).json({ error: err.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser({ id });
      res.json(result);
    } catch (err) {
      res.status(err.message === 'User not found' ? 404 : 500).json({ error: err.message });
    }
  }
};

module.exports = UserController;