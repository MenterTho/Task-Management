const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const redisClient = require('../configs/redis');
const { User } = require('../models/userModel');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        console.log(`New client connected: ${socket.id} (user: ${socket.userId})`);
      } catch (err) {
        console.error(`Invalid token for socket ${socket.id}: ${err.message}`);
        socket.disconnect();
      }
    } else {
      console.error(`No token provided for socket ${socket.id}`);
      socket.disconnect();
    }

    socket.on('joinUser', async (userId) => {
      if (userId !== socket.userId) {
        console.error(`Unauthorized joinUser attempt by ${socket.userId} for ${userId}`);
        return;
      }
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined room user:${userId}`);

      // Cập nhật trạng thái online
      await redisClient.setEx(`user:${userId}:online`, 3600, 'true');
      io.emit('userStatus', { userId, online: true });

      // Cập nhật lastActive
      await User.findByIdAndUpdate(userId, { lastActive: new Date() });
    });

    socket.on('joinWorkspace', ({ workspaceId }) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`Client ${socket.id} joined workspace ${workspaceId}`);
    });

    socket.on('joinProject', ({ projectId }) => {
      socket.join(`project:${projectId}`);
      console.log(`Client ${socket.id} joined project ${projectId}`);
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        await redisClient.del(`user:${socket.userId}:online`);
        io.emit('userStatus', { userId: socket.userId, online: false });
        console.log(`User ${socket.userId} disconnected`);
      } else {
        console.log(`Client ${socket.id} disconnected (no userId)`);
      }
    });
  });

  return io;
};