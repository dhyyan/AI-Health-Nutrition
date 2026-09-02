import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IPasswordService } from '../../domain/interfaces/services/IPasswordService';
import { IEmailService } from '../../domain/interfaces/services/IEmailService';
import { RegisterUserDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { User } from '../../domain/entities/User';
import { AppError } from '../../shared/errors/AppError';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private emailService: IEmailService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<{ message: string; email: string; otp: string }> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      if (existing.isVerified) {
        throw new AppError('An account with this email address already exists.', 400);
      } else {
        // User exists but unverified: regenerate OTP and resend
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        existing.passwordHash = await this.passwordService.hash(dto.password);
        existing.verificationOtp = otp;
        existing.otpExpiresAt = otpExpiresAt;

        await this.userRepository.update(existing);
        await this.emailService.sendOTP(existing.email, otp, existing.name);

        return {
          message: 'Account pending verification. A new verification OTP has been sent to your email.',
          email: existing.email,
          otp,
        };
      }
    }

    const passwordHash = await this.passwordService.hash(dto.password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name: dto.name,
      email: dto.email,
      passwordHash,
      isVerified: false,
      verificationOtp: otp,
      otpExpiresAt,
      status: 'active',
      role: 'user',
    });

    const savedUser = await this.userRepository.create(newUser);
    await this.emailService.sendOTP(savedUser.email, otp, savedUser.name);

    return {
      message: 'Registration successful! Please check your email for the 6-digit verification code.',
      email: savedUser.email,
      otp,
    };
  }
}
