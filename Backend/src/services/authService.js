const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User} = require('../models/userModel');
const { Session} = require('../models/auth/sessionModel');
const redisClient = require('../configs/redis');
const UAParser = require('ua-parser-js');

class AuthService {
  static async register({ email, password, name }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role: 'member' });
    await user.save();

    console.log(`User registered: ${email}`);
    return { _id: user._id, email: user.email, name: user.name };
  }

  static async login({ email, password, deviceInfo, io }) {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    const parser = new UAParser(deviceInfo.deviceType);
    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      deviceInfo: {
        deviceType: parser.getDevice().type || 'unknown',
        os: parser.getOS().name || 'unknown',
        browser: parser.getBrowser().name || 'unknown'
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await session.save();

    user.lastActive = new Date();
    await user.save();

    console.log(`User logged in: ${email} from ${session.deviceInfo.browser} on ${session.deviceInfo.os}`);
    io.emit('userStatus', { userId: user._id, online: true });

    return { accessToken, refreshToken, user: { _id: user._id, email: user.email, name: user.name } };
  }

  static async logout({ refreshToken, io }) {
    const session = await Session.findOneAndDelete({ refreshToken });
    if (!session) throw new Error('Session not found');

    await redisClient.del(`user:${session.userId}:online`);
    io.emit('userStatus', { userId: session.userId, online: false });

    console.log(`User logged out: ${session.userId}`);
    return { message: 'Logged out successfully' };
  }

  static async refreshToken({ refreshToken, userId }) {
    const session = await Session.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session.save();

    console.log(`Token refreshed for user: ${userId}`);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

module.exports = AuthService;