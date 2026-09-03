import { HealthGoal } from './recommendation.types';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Pescatarian';

export interface Meal {
  id?: string;
  name: string;
  mealType: MealType;
  category: string;
  dietaryPreference: DietaryPreference;
  suitableGoals: HealthGoal[];
  allergens: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  servingSize: number;
  servingUnit: string;
  ingredients: string[];
  instructions?: string;
  imageUrl?: string;
  isVerified?: boolean;
}

export interface DailyMealSlot {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface DailyScheduleItem {
  day: string;
  dateStr?: string;
  meals: DailyMealSlot;
}

export interface WeeklyMealPlan {
  id?: string;
  userId: string;
  startDate: string;
  goal: HealthGoal;
  dietaryPreference: DietaryPreference;
  excludedAllergies: string[];
  weeklySchedule: DailyScheduleItem[];
  generatedAt: string;
}

export interface CreateMealDTO {
  name: string;
  mealType: MealType;
  category: string;
  dietaryPreference: DietaryPreference;
  suitableGoals: HealthGoal[];
  allergens?: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  servingSize: number;
  servingUnit: string;
  ingredients: string[];
  instructions?: string;
  imageUrl?: string;
}

export interface MealFilterParams {
  mealType?: MealType;
  goal?: HealthGoal;
  dietaryPreference?: DietaryPreference;
  search?: string;
  excludeAllergens?: string;
}
