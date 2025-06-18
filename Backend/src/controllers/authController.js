const AuthService = require('../services/authService');

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const user = await AuthService.register({ email, password, name });
      res.status(201).json(user);
    } catch (err) {
      res.status(err.message === 'Email already exists' ? 400 : 500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const deviceInfo = { deviceType: req.headers['user-agent'] };
      const io = req.app.get('io');
      const result = await AuthService.login({ email, password, deviceInfo, io });
      res.json(result);
    } catch (err) {
      res.status(err.message === 'Invalid email or password' ? 401 : 500).json({ error: err.message });
    }
  },

  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const io = req.app.get('io');
      const result = await AuthService.logout({ refreshToken, io });
      res.json(result);
    } catch (err) {
      res.status(err.message === 'Session not found' ? 404 : 500).json({ error: err.message });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const { userId } = req.user;
      const result = await AuthService.refreshToken({ refreshToken, userId });
      res.json(result);
    } catch (err) {
      res.status(err.message.includes('not found') || err.message.includes('expired') ? 401 : 500).json({ error: err.message });
    }
  }
};

module.exports = AuthController;