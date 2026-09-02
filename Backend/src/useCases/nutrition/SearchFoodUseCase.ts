import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { FoodItem } from '../../domain/entities/FoodItem';

export class SearchFoodUseCase {
  constructor(private nutritionDatabaseService: INutritionDatabaseService) {}

  async execute(query: string, limit?: number): Promise<FoodItem[]> {
    const cleanQuery = (query || '').trim();
    return this.nutritionDatabaseService.searchFood(cleanQuery, limit || 20);
  }
}
