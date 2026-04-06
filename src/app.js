require('express-async-errors'); // Simplifies async error handling
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// API Routes
app.use('/api/auth', authRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running successfully' });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
