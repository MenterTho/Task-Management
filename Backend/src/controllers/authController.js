const AuthService = require('../services/AuthService');

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const user = await AuthService.register({ email, password, name });
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user
      });
    } catch (err) {
      res.status(err.message === 'Email already exists' ? 400 : 500).json({
        status: 'error',  
        message: err.message || 'Registration failed'
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'];
      const io = req.app.get('io');
      const result = await AuthService.login({ email, password,  deviceInfo: userAgent, io });
      res.json({
        status: 'success',
        message: 'User logged in successfully',
        data: result
      });
    } catch (err) {
      res.status(err.message === 'Invalid email or password' ? 401 : 500).json({
        status: 'error',
        message: err.message || 'Login failed'
      });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const io = req.app.get('io');
      const result = await AuthService.logout({ refreshToken, io });
      res.json({
        status: 'success',
        message: 'User logged out successfully',
        data: result
      });
    } catch (err) {
      res.status(err.message === 'Session not found' ? 404 : 500).json({
        status: 'error',
        message: err.message || 'Logout failed'
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const { userId } = req.user;
      const result = await AuthService.refreshToken({ refreshToken, userId });
      res.json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (err) {
      res.status(err.message.includes('not found') || err.message.includes('expired') ? 401 : 500).json({
        status: 'error',
        message: err.message || 'Token refresh failed'
      });
    }
  }
};

module.exports = AuthController;