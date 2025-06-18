const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const { User } = require('../models/userModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
      } catch (err) {
        socket.disconnect();
      }
    }

    socket.on('joinUser', async (userId) => {
      if (userId !== socket.userId) return;
      socket.join(`user:${userId}`);
      console.log(`User ${userId} connected`);

      // Cập nhật trạng thái online
      await redisClient.setEx(`user:${userId}:online`, 3600, 'true');
      io.emit('userStatus', { userId, online: true });

      // Cập nhật lastActive
      await User.findByIdAndUpdate(userId, { lastActive: new Date() });
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        await redisClient.del(`user:${socket.userId}:online`);
        io.emit('userStatus', { userId: socket.userId, online: false });
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};