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

    const analyzer = new AnalyzeNutritionUseCase(this.nutritionDatabaseService);
    const analysis = await analyzer.execute({
      foodId: dto.foodItemId,
      foodName: dto.foodName,
      servingSize: dto.servingSize,
      servingUnit: dto.servingUnit,
    });

    const foodLog = new FoodLog({
      userId,
      foodItemId: analysis.foodId,
      foodName: analysis.foodName,
      mealType: dto.mealType || 'snack',
      servingSize: analysis.servingSize,
      servingUnit: analysis.servingUnit,
      calories: analysis.calories,
      protein: analysis.protein,
      carbohydrates: analysis.carbohydrates,
      fat: analysis.fat,
      fiber: analysis.fiber,
      sugar: analysis.sugar,
      sodium: analysis.sodium,
      vitaminsAndMinerals: analysis.vitaminsAndMinerals,
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
