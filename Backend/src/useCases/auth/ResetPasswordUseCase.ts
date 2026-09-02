import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IPasswordService } from '../../domain/interfaces/services/IPasswordService';
import { ResetPasswordDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class ResetPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid reset request.', 400);
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== dto.otp.trim()) {
      throw new AppError('Invalid password reset code.', 400);
    }

    if (user.resetPasswordExpiresAt && new Date() > user.resetPasswordExpiresAt) {
      throw new AppError('Password reset code has expired. Please request a new one.', 400);
    }

    const newHash = await this.passwordService.hash(dto.newPassword);
    user.passwordHash = newHash;
    user.resetPasswordOtp = null;
    user.resetPasswordExpiresAt = null;

    await this.userRepository.update(user);

    return {
      message: 'Password reset successful! You can now log in with your new password.',
    };
  }
}
