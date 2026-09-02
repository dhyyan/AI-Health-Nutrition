import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { AppError } from '../../shared/errors/AppError';

export class DeleteUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string, adminId: string): Promise<boolean> {
    if (userId === adminId) {
      throw new AppError('Action forbidden: Administrators cannot delete their own account.', 400);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Delete associated health profile first
    await this.healthProfileRepository.deleteByUserId(userId);

    // Delete user account
    const deleted = await this.userRepository.delete(userId);
    return deleted;
  }
}
