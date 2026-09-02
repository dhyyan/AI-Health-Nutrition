import api from './api';
import { User, HealthProfile } from '../types';
import { LoginPayload, AuthResponse } from './auth.service';

export interface GetUsersParams {
  search?: string;
  status?: 'active' | 'blocked' | 'all';
  role?: 'user' | 'admin' | 'all';
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserProfileResponse {
  user: User;
  healthProfile: HealthProfile | null;
}

export const adminService = {
  async adminLogin(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/admin/login', data);
    return res.data.data;
  },

  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const cleanParams: Record<string, any> = {};
    if (params?.search) cleanParams.search = params.search;
    if (params?.status && params.status !== 'all') cleanParams.status = params.status;
    if (params?.role && params.role !== 'all') cleanParams.role = params.role;
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;

    const res = await api.get('/admin/users', { params: cleanParams });
    return res.data.data;
  },

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data.data;
  },

  async updateUserStatus(userId: string, status: 'active' | 'blocked'): Promise<User> {
    const res = await api.patch(`/admin/users/${userId}/status`, { status });
    return res.data.data;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },
};
