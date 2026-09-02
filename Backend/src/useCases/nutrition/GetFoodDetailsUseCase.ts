import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { FoodItem } from '../../domain/entities/FoodItem';

export class GetFoodDetailsUseCase {
  constructor(private nutritionDatabaseService: INutritionDatabaseService) {}

  async execute(id: string): Promise<FoodItem | null> {
    if (!id) throw new Error('Food ID is required');
    return this.nutritionDatabaseService.getFoodById(id);
  }
}
