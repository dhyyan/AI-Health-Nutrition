import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import healthRoutes from './framework/routes/health.routes';
import authRoutes from './framework/routes/auth.routes';
import adminRoutes from './framework/routes/admin.routes';
import userRoutes from './framework/routes/user.routes';
import nutritionRoutes from './framework/routes/nutrition.routes';
import recommendationRoutes from './framework/routes/recommendation.routes';
import mealRoutes from './framework/routes/meal.routes';
import waterRoutes from './framework/routes/water.routes';
import notificationRoutes from './framework/routes/notification.routes';
import reportRoutes from './framework/routes/report.routes';
import { globalErrorHandler } from './adapters/middlewares/error.middleware';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Middleware
app.use(globalErrorHandler);

export default app;
