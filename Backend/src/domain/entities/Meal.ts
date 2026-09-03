import { HealthGoal } from './HealthProfile';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Pescatarian';

export interface Meal {
  id?: string;
  name: string;
  mealType: MealType;
  category: string; // e.g. High Protein, Low Calorie, Quick Prep, Fiber Rich
  dietaryPreference: DietaryPreference;
  suitableGoals: HealthGoal[];
  allergens: string[]; // e.g. ['Dairy', 'Nuts', 'Gluten', 'Seafood', 'Eggs', 'Soy']
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
  createdAt?: Date;
  updatedAt?: Date;
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
  day: string; // 'Monday', 'Tuesday', ..., 'Sunday'
  dateStr?: string; // YYYY-MM-DD
  meals: DailyMealSlot;
}

export interface MealPlan {
  id?: string;
  userId: string;
  startDate: string;
  goal: HealthGoal;
  dietaryPreference: DietaryPreference;
  excludedAllergies: string[];
  weeklySchedule: DailyScheduleItem[];
  generatedAt: Date;
  updatedAt?: Date;
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

export interface UpdateMealDTO extends Partial<CreateMealDTO> {}
