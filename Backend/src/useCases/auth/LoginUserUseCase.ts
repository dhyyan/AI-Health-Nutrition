import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IPasswordService } from '../../domain/interfaces/services/IPasswordService';
import { IJwtService } from '../../domain/interfaces/services/IJwtService';
import { LoginUserDTO, AuthResponseDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private jwtService: IJwtService
  ) {}

  async execute(dto: LoginUserDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid email address or password.', 401);
    }

    const isMatch = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email address or password.', 401);
    }

    if (user.role === 'admin') {
      throw new AppError('Admin accounts cannot log in through the user portal. Please use the Admin Console (/admin/login).', 403);
    }

    if (user.status === 'blocked') {
      throw new AppError('Your account has been blocked by the administrator.', 403);
    }

    if (!user.isVerified) {
      throw new AppError('Account is not verified. Please verify your email before logging in.', 403);
    }

    const token = this.jwtService.generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        createdAt: user.createdAt,
      },
    };
  }
}
