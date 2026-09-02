import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { UserResponseDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class GetAuthenticatedUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User account not found.', 404);
    }

    if (user.status === 'blocked') {
      throw new AppError('Your account has been blocked.', 403);
    }

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}
