import { PersonalizedRecommendations, FoodAlternativeComparison } from '../../entities/Recommendation';

export interface IGenerateRecommendationsUseCase {
  execute(userId: string): Promise<PersonalizedRecommendations>;
}

export interface IGetFoodAlternativesUseCase {
  execute(foodNameOrId: string, userId?: string): Promise<FoodAlternativeComparison[]>;
}
