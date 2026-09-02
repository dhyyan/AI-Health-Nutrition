import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { AdminQueryUsersDTO, AdminUserListResponseDTO } from '../../domain/interfaces/DTOs/AdminDTOs';

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: AdminQueryUsersDTO): Promise<AdminUserListResponseDTO> {
    const page = Math.max(1, dto.page || 1);
    const limit = Math.max(1, Math.min(100, dto.limit || 10));

    const filter = {
      search: dto.search,
      status: dto.status,
      role: dto.role,
    };

    const [allUsers, total] = await Promise.all([
      this.userRepository.findAll(filter),
      this.userRepository.count(filter),
    ]);

    const startIndex = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(startIndex, startIndex + limit);

    const formattedUsers = paginatedUsers.map((user) => ({
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      status: user.status,
      createdAt: user.createdAt,
    }));

    return {
      users: formattedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
