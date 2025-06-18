const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateRefreshToken } = require('../middleware/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticateRefreshToken, AuthController.logout);
router.post('/refresh-token', authenticateRefreshToken, AuthController.refreshToken);

module.exports = router;