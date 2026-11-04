export interface RecognizedFoodItem {
  name: string;
  estimatedQuantity: string;
  estimatedCalories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  confidence: 'high' | 'medium' | 'low' | string;
  visibleIngredients?: string[];
  inferredIngredients?: string[];
  potentialAllergens?: string[];
}

export interface TotalNutritionSummary {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
}

export interface RecognizedFoodResult {
  isFood: boolean;
  message?: string;
  isUnclear?: boolean;
  foodItems: RecognizedFoodItem[];
  totalNutrition: TotalNutritionSummary | null;
  analysis?: string;
  limitations?: string[];

  // Primary meal representation
  foodName: string;
  confidence: number;
  portionEstimate: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  healthRating: 'healthy' | 'unhealthy' | 'moderate';
  healthReasoning: string;
  dietaryTags: string[];
  healthTips: string[];
}

export interface IFoodRecognitionService {
  recognizeFoodFromImage(imageBuffer: Buffer, mimeType: string): Promise<RecognizedFoodResult>;
}
