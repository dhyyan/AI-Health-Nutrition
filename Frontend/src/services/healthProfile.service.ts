import api from './api';
import { HealthProfile, User, UserProfileResponse } from '../types';

export interface UpdateHealthProfilePayload {
  name?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  bloodGroup?: string;
  goal?: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance';
  foodAllergies?: string[];
  medicalHistory?: string[];
  activityLevel?: 'sedentary' | 'moderate' | 'active';
  sleepHours?: number;
  dietaryPreference?: string;
  hasDiabetes?: boolean;
  diabetesStatus?: string;
}

export const healthProfileService = {
  async getProfile(): Promise<UserProfileResponse> {
    const response = await api.get('/user/profile');
    return response.data.data;
  },

  async updateProfile(payload: UpdateHealthProfilePayload): Promise<UserProfileResponse> {
    const response = await api.put('/user/profile', payload);
    return response.data.data;
  },

  async uploadProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('picture', file);
    const response = await api.post('/user/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
