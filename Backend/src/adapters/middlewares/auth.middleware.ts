import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../framework/services/jwt/JwtService';
import { AppError } from '../../shared/errors/AppError';

const jwtService = new JwtService();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token required.', 401));
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwtService.verifyToken(token);

  if (!decoded) {
    return next(new AppError('Invalid or expired authentication token.', 401));
  }

  req.user = decoded;
  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Access denied: Insufficient permissions.', 403));
    }
    next();
  };
};
