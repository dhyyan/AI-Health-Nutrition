import { MicronutrientInfo, ServingSizeOption } from '../../entities/FoodItem';
import { MealType } from '../../entities/FoodLog';

export interface SearchFoodQueryDTO {
  query: string;
  category?: string;
  limit?: number;
}

export interface AnalyzeNutritionDTO {
  foodId?: string;
  foodName?: string;
  servingSize: number;
  servingUnit: string;
}

export interface NutritionAnalysisResultDTO {
  foodId?: string;
  foodName: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  servingOptions: ServingSizeOption[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminsAndMinerals: MicronutrientInfo[];
  dataSource: string;
  imageUrl?: string;
  isVerified: boolean;
}

export interface CreateFoodLogDTO {
  foodItemId?: string;
  foodName: string;
  mealType: MealType;
  servingSize: number;
  servingUnit: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
}

export interface FoodLogResponseDTO {
  id: string;
  userId: string;
  foodItemId?: string;
  foodName: string;
  mealType: MealType;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminsAndMinerals: MicronutrientInfo[];
  loggedAt: string;
}
