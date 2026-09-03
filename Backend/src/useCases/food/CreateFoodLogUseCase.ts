import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { FoodLog } from '../../domain/entities/FoodLog';
import { CreateFoodLogDTO, FoodLogResponseDTO } from '../../domain/interfaces/DTOs/NutritionDTOs';
import { AnalyzeNutritionUseCase } from '../nutrition/AnalyzeNutritionUseCase';

export class CreateFoodLogUseCase {
  constructor(
    private foodLogRepository: IFoodLogRepository,
    private nutritionDatabaseService: INutritionDatabaseService
  ) {}

  async execute(userId: string, dto: CreateFoodLogDTO): Promise<FoodLogResponseDTO> {
    if (!userId) throw new Error('User ID is required to log food');
    if (!dto.foodName && !dto.foodItemId) throw new Error('Food name or food item ID is required');

    let calories = dto.calories;
    let protein = dto.protein;
    let carbohydrates = dto.carbohydrates;
    let fat = dto.fat;
    let fiber = dto.fiber;
    let sugar = 0;
    let sodium = 0;
    let vitaminsAndMinerals: any[] = [];
    let foodItemId = dto.foodItemId;

    if (calories === undefined) {
      try {
        const analyzer = new AnalyzeNutritionUseCase(this.nutritionDatabaseService);
        const analysis = await analyzer.execute({
          foodId: dto.foodItemId,
          foodName: dto.foodName,
          servingSize: dto.servingSize,
          servingUnit: dto.servingUnit,
        });

        foodItemId = analysis.foodId;
        calories = analysis.calories;
        protein = analysis.protein;
        carbohydrates = analysis.carbohydrates;
        fat = analysis.fat;
        fiber = analysis.fiber;
        sugar = analysis.sugar;
        sodium = analysis.sodium;
        vitaminsAndMinerals = analysis.vitaminsAndMinerals;
      } catch (err) {
        // Fallback for custom / scanned food items not present in static database
        calories = Math.round(350 * (dto.servingSize || 1));
        protein = Math.round(15 * (dto.servingSize || 1) * 10) / 10;
        carbohydrates = Math.round(35 * (dto.servingSize || 1) * 10) / 10;
        fat = Math.round(12 * (dto.servingSize || 1) * 10) / 10;
        fiber = Math.round(4 * (dto.servingSize || 1) * 10) / 10;
      }
    }

    const foodLog = new FoodLog({
      userId,
      foodItemId,
      foodName: dto.foodName,
      mealType: dto.mealType || 'snack',
      servingSize: dto.servingSize || 1,
      servingUnit: dto.servingUnit || 'serving',
      calories: calories!,
      protein: protein || 0,
      carbohydrates: carbohydrates || 0,
      fat: fat || 0,
      fiber: fiber || 0,
      sugar,
      sodium,
      vitaminsAndMinerals,
      loggedAt: new Date(),
    });

    const savedLog = await this.foodLogRepository.create(foodLog);

    return {
      id: savedLog.id!,
      userId: savedLog.userId,
      foodItemId: savedLog.foodItemId,
      foodName: savedLog.foodName,
      mealType: savedLog.mealType,
      servingSize: savedLog.servingSize,
      servingUnit: savedLog.servingUnit,
      calories: savedLog.calories,
      protein: savedLog.protein,
      carbohydrates: savedLog.carbohydrates,
      fat: savedLog.fat,
      fiber: savedLog.fiber,
      sugar: savedLog.sugar,
      sodium: savedLog.sodium,
      vitaminsAndMinerals: savedLog.vitaminsAndMinerals,
      loggedAt: savedLog.loggedAt.toISOString(),
    };
  }
}
