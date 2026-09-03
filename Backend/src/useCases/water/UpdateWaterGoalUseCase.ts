import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { DailyWaterSummary } from '../../domain/entities/WaterIntake';

export interface UpdateWaterGoalDTO {
  userId: string;
  dailyGoalMl: number;
  date?: string;
}

export class UpdateWaterGoalUseCase {
  constructor(private waterIntakeRepository: IWaterIntakeRepository) {}

  async execute(dto: UpdateWaterGoalDTO): Promise<DailyWaterSummary> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    if (!dto.dailyGoalMl || dto.dailyGoalMl < 500 || dto.dailyGoalMl > 10000) {
      throw new Error('Daily water goal must be between 500 ml and 10,000 ml');
    }

    await this.waterIntakeRepository.updateWaterGoal(dto.userId, dto.dailyGoalMl);

    const dateStr = dto.date || new Date().toISOString().split('T')[0];
    return this.waterIntakeRepository.getDailySummary(dto.userId, dateStr);
  }
}
