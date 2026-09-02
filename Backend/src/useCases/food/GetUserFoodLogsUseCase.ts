import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { FoodLogResponseDTO } from '../../domain/interfaces/DTOs/NutritionDTOs';

export class GetUserFoodLogsUseCase {
  constructor(private foodLogRepository: IFoodLogRepository) {}

  async execute(userId: string, dateStr?: string): Promise<FoodLogResponseDTO[]> {
    if (!userId) throw new Error('User ID is required');

    let startDate: Date;
    let endDate: Date;

    if (dateStr) {
      const parsed = new Date(dateStr);
      startDate = new Date(parsed.setHours(0, 0, 0, 0));
      endDate = new Date(parsed.setHours(23, 59, 59, 999));
    } else {
      const now = new Date();
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
    }

    const logs = await this.foodLogRepository.findByUserIdAndDateRange(userId, startDate, endDate);

    return logs.map((log) => ({
      id: log.id!,
      userId: log.userId,
      foodItemId: log.foodItemId,
      foodName: log.foodName,
      mealType: log.mealType,
      servingSize: log.servingSize,
      servingUnit: log.servingUnit,
      calories: log.calories,
      protein: log.protein,
      carbohydrates: log.carbohydrates,
      fat: log.fat,
      fiber: log.fiber,
      sugar: log.sugar,
      sodium: log.sodium,
      vitaminsAndMinerals: log.vitaminsAndMinerals,
      loggedAt: log.loggedAt.toISOString(),
    }));
  }
}
