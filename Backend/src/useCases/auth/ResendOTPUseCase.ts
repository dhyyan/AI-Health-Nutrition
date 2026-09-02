import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IEmailService } from '../../domain/interfaces/services/IEmailService';
import { ResendOtpDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class ResendOTPUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: ResendOtpDTO): Promise<{ message: string; email: string; otp: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('User account not found.', 404);
    }

    if (user.isVerified) {
      throw new AppError('Account is already verified.', 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOtp = otp;
    user.otpExpiresAt = otpExpiresAt;

    await this.userRepository.update(user);
    await this.emailService.sendOTP(user.email, otp, user.name);

    return {
      message: 'A fresh verification OTP has been sent to your email address.',
      email: user.email,
      otp,
    };
  }
}
