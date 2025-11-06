import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDatabase } from './config/database';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import calculationsRoutes from './routes/calculations.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// CORS configuration
// Support both Docker (port 3000) and local dev (port 5173)
const allowedOrigins = [
  config.corsOrigin,
  'http://localhost:5173', // Vite dev server (local development)
  'http://localhost:3000', // Docker frontend
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
connectDatabase();

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: 'Calculation Tree API',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/calculations', calculationsRoutes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

