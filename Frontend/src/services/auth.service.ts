import api from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(data: RegisterPayload) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async verifyOtp(data: VerifyOtpPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/verify-otp', data);
    return res.data.data;
  },

  async resendOtp(email: string) {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(data: ResetPasswordPayload) {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};
