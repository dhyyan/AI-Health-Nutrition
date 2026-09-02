import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IEmailService } from '../../domain/interfaces/services/IEmailService';
import { ForgotPasswordDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      // Security best practice: do not reveal if email exists or not
      return {
        message: 'If an account with this email exists, a password reset code has been sent.',
      };
    }

    if (user.status === 'blocked') {
      throw new AppError('Your account has been blocked by the administrator.', 403);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordExpiresAt = resetExpiresAt;

    await this.userRepository.update(user);
    await this.emailService.sendPasswordResetOTP(user.email, otp, user.name);

    return {
      message: 'Password reset OTP code has been sent to your email address.',
    };
  }
}
