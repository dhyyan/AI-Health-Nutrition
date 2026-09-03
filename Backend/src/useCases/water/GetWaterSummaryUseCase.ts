import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { DailyWaterSummary } from '../../domain/entities/WaterIntake';

export class GetWaterSummaryUseCase {
  constructor(private waterIntakeRepository: IWaterIntakeRepository) {}

  async execute(userId: string, date?: string): Promise<DailyWaterSummary> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const dateStr = date || new Date().toISOString().split('T')[0];
    return this.waterIntakeRepository.getDailySummary(userId, dateStr);
  }
}
