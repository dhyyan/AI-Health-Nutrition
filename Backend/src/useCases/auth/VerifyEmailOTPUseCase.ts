import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IJwtService } from '../../domain/interfaces/services/IJwtService';
import { VerifyEmailOtpDTO, AuthResponseDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class VerifyEmailOTPUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJwtService
  ) {}

  async execute(dto: VerifyEmailOtpDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('User account not found.', 404);
    }

    if (user.isVerified) {
      throw new AppError('Account is already verified. Please log in directly.', 400);
    }

    if (!user.verificationOtp || user.verificationOtp !== dto.otp.trim()) {
      throw new AppError('Invalid verification code. Please check your email and try again.', 400);
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new AppError('Verification code has expired. Please request a new OTP.', 400);
    }

    user.isVerified = true;
    user.verificationOtp = null;
    user.otpExpiresAt = null;

    const updatedUser = await this.userRepository.update(user);

    const token = this.jwtService.generateToken({
      userId: updatedUser.id!,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return {
      token,
      user: {
        id: updatedUser.id!,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt,
      },
    };
  }
}
