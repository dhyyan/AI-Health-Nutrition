import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { HealthTrendsDTO } from '../../domain/interfaces/DTOs/HealthReportDTOs';

export class GetHealthTrendsUseCase {
  constructor(
    private foodLogRepository: IFoodLogRepository,
    private waterIntakeRepository: IWaterIntakeRepository,
    private weightBmiLogRepository: IWeightBmiLogRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string, periodParam: string = '30d'): Promise<HealthTrendsDTO> {
    let days = 30;
    if (periodParam === '7d') days = 7;
    else if (periodParam === '90d') days = 90;
    else if (periodParam === '1y' || periodParam === '365d') days = 365;

    const endDateObj = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(endDateObj.getDate() - (days - 1));

    const startDateStr = startDateObj.toISOString().split('T')[0];
    const endDateStr = endDateObj.toISOString().split('T')[0];

    // Fetch data
    const foodLogs = await this.foodLogRepository.findByUserIdAndDateRange(
      userId,
      new Date(startDateStr + 'T00:00:00.000Z'),
      new Date(endDateStr + 'T23:59:59.999Z')
    );

    const waterHistory = await this.waterIntakeRepository.getWaterHistory(userId, days);
    const weightHistory = await this.weightBmiLogRepository.getHistory(userId, startDateStr, endDateStr);
    const healthProfile = await this.healthProfileRepository.findByUserId(userId);

    const dates: string[] = [];
    const caloriesMap = new Map<string, number>();
    const proteinMap = new Map<string, number>();
    const carbsMap = new Map<string, number>();
    const fatMap = new Map<string, number>();
    const waterMap = new Map<string, number>();
    const weightMap = new Map<string, number>();
    const bmiMap = new Map<string, number>();

    // Build day keys
    for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
      const dStr = d.toISOString().split('T')[0];
      dates.push(dStr);
      caloriesMap.set(dStr, 0);
      proteinMap.set(dStr, 0);
      carbsMap.set(dStr, 0);
      fatMap.set(dStr, 0);
      waterMap.set(dStr, 0);
    }

    // Fill food logs
    foodLogs.forEach((log) => {
      const dStr = new Date(log.loggedAt).toISOString().split('T')[0];
      if (caloriesMap.has(dStr)) {
        caloriesMap.set(dStr, (caloriesMap.get(dStr) || 0) + (log.calories || 0));
        proteinMap.set(dStr, (proteinMap.get(dStr) || 0) + (log.protein || 0));
        carbsMap.set(dStr, (carbsMap.get(dStr) || 0) + (log.carbohydrates || 0));
        fatMap.set(dStr, (fatMap.get(dStr) || 0) + (log.fat || 0));
      }
    });

    // Fill water history
    waterHistory.forEach((w) => {
      if (waterMap.has(w.date)) {
        waterMap.set(w.date, w.totalConsumedMl);
      }
    });

    // Fill weight & BMI history
    weightHistory.forEach((w) => {
      weightMap.set(w.date, w.weightKg);
      bmiMap.set(w.date, w.bmi);
    });

    // Forward-fill weight & BMI if sparse so charts display smooth trends
    let lastWeight = healthProfile?.weightKg || 70;
    let lastBmi = healthProfile?.bmi || 22.5;

    const calories: number[] = [];
    const protein: number[] = [];
    const carbs: number[] = [];
    const fat: number[] = [];
    const water: number[] = [];
    const weight: (number | null)[] = [];
    const bmi: (number | null)[] = [];

    dates.forEach((d) => {
      calories.push(Math.round(caloriesMap.get(d) || 0));
      protein.push(Math.round((proteinMap.get(d) || 0) * 10) / 10);
      carbs.push(Math.round((carbsMap.get(d) || 0) * 10) / 10);
      fat.push(Math.round((fatMap.get(d) || 0) * 10) / 10);
      water.push(waterMap.get(d) || 0);

      if (weightMap.has(d)) {
        lastWeight = weightMap.get(d)!;
      }
      if (bmiMap.has(d)) {
        lastBmi = bmiMap.get(d)!;
      }

      weight.push(lastWeight);
      bmi.push(lastBmi);
    });

    return {
      dates,
      calories,
      protein,
      carbohydrates: carbs,
      fat,
      waterMl: water,
      weightKg: weight,
      bmi,
    };
  }
}
