export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface IJwtService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
}
