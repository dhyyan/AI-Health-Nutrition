import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IPasswordService } from '../../domain/interfaces/services/IPasswordService';
import { IJwtService } from '../../domain/interfaces/services/IJwtService';
import { AdminLoginDTO } from '../../domain/interfaces/DTOs/AdminDTOs';
import { AuthResponseDTO } from '../../domain/interfaces/DTOs/AuthDTOs';
import { AppError } from '../../shared/errors/AppError';

export class AdminLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private jwtService: IJwtService
  ) {}

  async execute(dto: AdminLoginDTO): Promise<AuthResponseDTO> {
    if (!dto.email || !dto.password) {
      throw new AppError('Email and password are required.', 400);
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid admin email or password.', 401);
    }

    if (user.role !== 'admin') {
      throw new AppError('Access denied: Account does not have administrator privileges.', 403);
    }

    const isMatch = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid admin email or password.', 401);
    }

    if (user.status === 'blocked') {
      throw new AppError('Admin account is currently disabled.', 403);
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
