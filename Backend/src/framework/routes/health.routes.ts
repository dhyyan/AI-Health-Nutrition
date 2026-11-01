import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

const handleHealthCheck = (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  return res.status(200).json({
    status: 'UP',
    message: 'NutriAI Backend API is healthy and active.',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbStatus,
    service: 'AI Health & Nutrition System Backend',
    version: '1.0.0',
  });
};

// Health & UptimeBot Keep-Alive Routes
router.get('/health', handleHealthCheck);
router.get('/ping', handleHealthCheck);
router.get('/', handleHealthCheck);

export default router;
