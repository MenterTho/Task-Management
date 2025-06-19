const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.put('/:id', authenticateToken, UserController.updateUser);
router.get('/', authenticateToken, isAdmin, UserController.getAllUsers);
router.delete('/:id', authenticateToken, isAdmin, UserController.deleteUser);

module.exports = router;