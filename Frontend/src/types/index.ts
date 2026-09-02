export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  status: 'active' | 'blocked';
  profilePicture?: string | null;
  createdAt: string;
}

export interface HealthProfile {
  id?: string;
  userId?: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  goal: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance';
  foodAllergies: string[];
  medicalHistory?: string[];
  activityLevel?: 'sedentary' | 'moderate' | 'active';
  sleepHours?: number;
  dietaryPreference?: string;
  hasDiabetes?: boolean;
  diabetesStatus?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  user: User;
  profile: HealthProfile | null;
}

export interface DailySummary {
  caloriesConsumed: number;
  targetCalories: number;
  waterIntakeMl: number;
  waterTargetMl: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  healthScore: number;
}
