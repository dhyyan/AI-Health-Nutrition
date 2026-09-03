import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { PeriodReportDTO, DaySummaryItem } from '../../domain/interfaces/DTOs/HealthReportDTOs';

export class GetMonthlyReportUseCase {
  constructor(
    private foodLogRepository: IFoodLogRepository,
    private waterIntakeRepository: IWaterIntakeRepository,
    private healthProfileRepository: IHealthProfileRepository,
    private weightBmiLogRepository: IWeightBmiLogRepository
  ) {}

  async execute(userId: string): Promise<PeriodReportDTO> {
    const endDateObj = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(endDateObj.getDate() - 29);

    const startDate = startDateObj.toISOString().split('T')[0];
    const endDate = endDateObj.toISOString().split('T')[0];

    const foodLogs = await this.foodLogRepository.findByUserIdAndDateRange(
      userId,
      new Date(startDate + 'T00:00:00.000Z'),
      new Date(endDate + 'T23:59:59.999Z')
    );

    const waterHistory = await this.waterIntakeRepository.getWaterHistory(userId, 30);
    const weightHistory = await this.weightBmiLogRepository.getHistory(userId, startDate, endDate);
    const healthProfile = await this.healthProfileRepository.findByUserId(userId);

    const daysMap = new Map<string, DaySummaryItem>();

    // Initialize 30 days
    for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
      const dStr = d.toISOString().split('T')[0];
      daysMap.set(dStr, {
        date: dStr,
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        waterMl: 0,
      });
    }

    // Populate food logs
    foodLogs.forEach((log) => {
      const logDate = new Date(log.loggedAt).toISOString().split('T')[0];
      if (daysMap.has(logDate)) {
        const item = daysMap.get(logDate)!;
        item.calories += log.calories || 0;
        item.protein += log.protein || 0;
        item.carbohydrates += log.carbohydrates || 0;
        item.fat += log.fat || 0;
      }
    });

    // Populate water history
    waterHistory.forEach((w) => {
      if (daysMap.has(w.date)) {
        const item = daysMap.get(w.date)!;
        item.waterMl = w.totalConsumedMl;
      }
    });

    // Populate weight history
    weightHistory.forEach((w) => {
      if (daysMap.has(w.date)) {
        const item = daysMap.get(w.date)!;
        item.weightKg = w.weightKg;
        item.bmi = w.bmi;
      }
    });

    const dailySummaries = Array.from(daysMap.values());

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWater = 0;
    let activeDaysCount = 0;

    dailySummaries.forEach((d) => {
      totalCalories += d.calories;
      totalProtein += d.protein;
      totalCarbs += d.carbohydrates;
      totalFat += d.fat;
      totalWater += d.waterMl;
      if (d.calories > 0 || d.waterMl > 0) activeDaysCount++;
    });

    const count = dailySummaries.length || 30;
    const latestWeightLog = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
    const firstWeightLog = weightHistory.length > 0 ? weightHistory[0] : null;

    const startWeightKg = firstWeightLog?.weightKg || healthProfile?.weightKg || 70;
    const endWeightKg = latestWeightLog?.weightKg || healthProfile?.weightKg || 70;
    const weightChangeKg = Math.round((endWeightKg - startWeightKg) * 10) / 10;

    return {
      period: 'monthly',
      startDate,
      endDate,
      dailySummaries,
      avgCalories: Math.round(totalCalories / count),
      avgProtein: Math.round((totalProtein / count) * 10) / 10,
      avgCarbohydrates: Math.round((totalCarbs / count) * 10) / 10,
      avgFat: Math.round((totalFat / count) * 10) / 10,
      avgWaterMl: Math.round(totalWater / count),
      totalWaterMl: totalWater,
      totalCalories: Math.round(totalCalories),
      startWeightKg,
      endWeightKg,
      weightChangeKg,
      latestBmi: latestWeightLog?.bmi || healthProfile?.bmi || 22.5,
      bmiCategory: latestWeightLog?.bmiCategory || healthProfile?.bmiCategory || 'Normal',
      activeDaysCount,
    };
  }
}
