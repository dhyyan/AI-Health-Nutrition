import { UserRole, UserStatus } from '../../entities/User';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailOtpDTO {
  email: string;
  otp: string;
}

export interface ResendOtpDTO {
  email: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  status: UserStatus;
  createdAt?: Date;
}

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
}
