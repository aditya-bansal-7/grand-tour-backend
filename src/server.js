require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Start Server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Handle Unhandled Rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
