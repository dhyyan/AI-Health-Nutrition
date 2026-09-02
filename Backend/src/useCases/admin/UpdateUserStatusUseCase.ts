import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { UpdateUserStatusDTO, UserSummaryDTO } from '../../domain/interfaces/DTOs/AdminDTOs';
import { AppError } from '../../shared/errors/AppError';

export class UpdateUserStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: UpdateUserStatusDTO): Promise<UserSummaryDTO> {
    if (dto.userId === dto.adminId) {
      throw new AppError('Action forbidden: Administrators cannot modify their own status.', 400);
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (dto.status !== 'active' && dto.status !== 'blocked') {
      throw new AppError('Invalid status value. Allowed values are "active" or "blocked".', 400);
    }

    user.status = dto.status;
    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
    };
  }
}
