import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './framework/routes/health.routes';
import authRoutes from './framework/routes/auth.routes';
import adminRoutes from './framework/routes/admin.routes';
import { globalErrorHandler } from './adapters/middlewares/error.middleware';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// Global Error Middleware
app.use(globalErrorHandler);

export default app;
