import jwt from 'jsonwebtoken';
import { IJwtService, TokenPayload } from '../../../domain/interfaces/services/IJwtService';
import { CONFIG } from '../../../shared/constants/config';

export class JwtService implements IJwtService {
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }
}
