import { Router, Request, Response } from 'express';
import { sendResponse } from '../../shared/utils/apiResponse';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  return sendResponse({
    res,
    statusCode: 200,
    message: 'AI Health & Nutrition Backend API is healthy and operational',
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'AI Health & Nutrition System Backend',
      version: '1.0.0',
    },
  });
});

export default router;
