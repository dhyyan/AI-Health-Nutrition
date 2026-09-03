export interface RecognizedFoodResult {
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
