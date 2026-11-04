import { RecommendedFoodChoice, FoodAlternativeComparison } from '../../entities/Recommendation';

export interface AiRecommendationPromptOptions {
  goal: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  userAllergies: string[];
  dietaryPreference?: string;
  activityLevel?: string;
}

export interface AiAlternativePromptOptions {
  foodQuery: string;
  goal: string;
  userAllergies: string[];
}

export interface IAiService {
  /**
   * Generates goal-aligned priority food recommendations using Gemini AI,
   * enforcing Layer 1 strict allergen exclusion in the prompt.
   */
  generatePriorityFoods(
    options: AiRecommendationPromptOptions
  ): Promise<RecommendedFoodChoice[] | null>;

  /**
   * Generates a healthier food alternative using Gemini AI,
   * enforcing Layer 1 strict allergen exclusion in the prompt.
   */
  generateFoodAlternative(
    options: AiAlternativePromptOptions
  ): Promise<FoodAlternativeComparison | null>;
}

