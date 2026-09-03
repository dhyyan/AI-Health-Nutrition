import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { DailyReportDTO } from '../../domain/interfaces/DTOs/HealthReportDTOs';

export class GetDailyReportUseCase {
  constructor(
    private foodLogRepository: IFoodLogRepository,
    private waterIntakeRepository: IWaterIntakeRepository,
    private healthProfileRepository: IHealthProfileRepository,
    private weightBmiLogRepository: IWeightBmiLogRepository
  ) {}

  async execute(userId: string, dateStr?: string): Promise<DailyReportDTO> {
    const date = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = date.toISOString().split('T')[0];

    const startDate = new Date(formattedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedDate);
    endDate.setHours(23, 59, 59, 999);

    // Fetch food logs for the date
    const foodLogs = await this.foodLogRepository.findByUserIdAndDateRange(userId, startDate, endDate);

    // Fetch water intake summary & goal
    const waterSummary = await this.waterIntakeRepository.getDailySummary(userId, formattedDate);
    const waterGoalMl = await this.waterIntakeRepository.getWaterGoal(userId);

    // Fetch health profile & weight log
    const healthProfile = await this.healthProfileRepository.findByUserId(userId);
    const latestWeightLog = await this.weightBmiLogRepository.getLatest(userId);

    // Calculations
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;
    let totalFiber = 0;

    const mappedFoodLogs = foodLogs.map((log) => {
      totalCalories += log.calories || 0;
      totalProtein += log.protein || 0;
      totalCarbohydrates += log.carbohydrates || 0;
      totalFat += log.fat || 0;
      totalFiber += log.fiber || 0;

      return {
        id: log.id!,
        foodName: log.foodName,
        mealType: log.mealType,
        servingSize: log.servingSize,
        servingUnit: log.servingUnit,
        calories: log.calories,
        protein: log.protein,
        carbohydrates: log.carbohydrates,
        fat: log.fat,
      };
    });

    const currentWeight = latestWeightLog?.weightKg || healthProfile?.weightKg || 70;
    const currentBmi = latestWeightLog?.bmi || healthProfile?.bmi || 22.5;
    const bmiCategory = latestWeightLog?.bmiCategory || healthProfile?.bmiCategory || 'Normal';

    // Simple target calorie estimation
    let targetCalories = 2000;
    if (healthProfile) {
      if (healthProfile.goal === 'weight_loss') targetCalories = 1800;
      else if (healthProfile.goal === 'weight_gain' || healthProfile.goal === 'muscle_gain') targetCalories = 2500;
    }

    return {
      date: formattedDate,
      foodLogs: mappedFoodLogs,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbohydrates: Math.round(totalCarbohydrates * 10) / 10,
      totalFat: Math.round(totalFat * 10) / 10,
      totalFiber: Math.round(totalFiber * 10) / 10,
      totalWaterMl: waterSummary?.totalConsumedMl || 0,
      waterGoalMl: waterGoalMl || 2500,
      currentWeightKg: currentWeight,
      currentBmi,
      bmiCategory,
      targetCalories,
    };
  }
}
