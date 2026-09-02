import bcrypt from 'bcryptjs';
import { IPasswordService } from '../../../domain/interfaces/services/IPasswordService';

export class PasswordService implements IPasswordService {
  private saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}
