export interface MicronutrientInfo {
  name: string;
  amount: number;
  unit: string;
  dailyValuePercentage?: number;
}

export interface ServingSizeOption {
  amount: number;
  unit: string;
  label?: string;
}

export interface FoodItem {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  servingOptions?: ServingSizeOption[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminsAndMinerals: MicronutrientInfo[];
  dataSource?: string;
  imageUrl?: string;
  isVerified?: boolean;
}

export interface NutritionAnalysisResult {
  foodId?: string;
  foodName: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  servingOptions?: ServingSizeOption[];
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

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface CreateFoodLogRequest {
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

export interface FoodLogItem {
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
