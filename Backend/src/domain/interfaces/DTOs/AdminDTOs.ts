import { UserRole, UserStatus } from '../../entities/User';
import { HealthProfileProps } from '../../entities/HealthProfile';

export interface AdminLoginDTO {
  email: string;
  password: string;
}

export interface AdminQueryUsersDTO {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface UserSummaryDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  status: UserStatus;
  createdAt?: Date;
}

export interface AdminUserListResponseDTO {
  users: UserSummaryDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserStatusDTO {
  userId: string;
  status: UserStatus;
  adminId: string;
}

export interface UserProfileDetailsDTO {
  user: UserSummaryDTO;
  healthProfile: HealthProfileProps | null;
}
