import 'express-async-errors';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { notFound, errorHandler } from './middlewares/error.middleware';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API is running successfully' });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
