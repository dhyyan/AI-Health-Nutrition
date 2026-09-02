import { Gender, BMICategory, HealthGoal, ActivityLevel } from '../../entities/HealthProfile';

export interface UpdateHealthProfileDTO {
  name?: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bloodGroup?: string;
  goal?: HealthGoal;
  foodAllergies?: string[];
  medicalHistory?: string[];
  activityLevel?: ActivityLevel;
  sleepHours?: number;
  dietaryPreference?: string;
  hasDiabetes?: boolean;
  diabetesStatus?: string;
}

export interface UserProfileSummaryDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string | null;
}

export interface HealthProfileDetailsDTO {
  id?: string;
  userId: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bloodGroup: string;
  bmi: number;
  bmiCategory: BMICategory;
  goal: HealthGoal;
  foodAllergies: string[];
  medicalHistory: string[];
  activityLevel: ActivityLevel;
  sleepHours: number;
  dietaryPreference: string;
  hasDiabetes: boolean;
  diabetesStatus: string;
  updatedAt?: Date;
}

export interface HealthProfileResponseDTO {
  user: UserProfileSummaryDTO;
  profile: HealthProfileDetailsDTO | null;
}
