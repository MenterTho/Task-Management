const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./configs/db');
const setupSocket = require('./configs/socket');
const userRoutes = require("./routes/appRoutes")

// Configure environment variables
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Lưu io để sử dụng trong controllers
app.set('io', io);

// Middleware setup
app.use(express.json());
app.use(morgan('combined')); 
app.use(express.static(path.join(__dirname, 'public'))); 

// Setup routes
userRoutes(app);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Setup WebSocket
setupSocket(io);

// Start server after connecting to MongoDB
const port = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB(); 
    server.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();