import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { DailyWaterSummary } from '../../domain/entities/WaterIntake';

export interface LogWaterIntakeDTO {
  userId: string;
  amountMl: number;
  date?: string; // YYYY-MM-DD
  notes?: string;
}

export class LogWaterIntakeUseCase {
  constructor(private waterIntakeRepository: IWaterIntakeRepository) {}

  async execute(dto: LogWaterIntakeDTO): Promise<DailyWaterSummary> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    if (!dto.amountMl || dto.amountMl <= 0) {
      throw new Error('Valid water amount in ml is required');
    }

    const dateStr = dto.date || new Date().toISOString().split('T')[0];

    await this.waterIntakeRepository.logIntake(dto.userId, dto.amountMl, dateStr, dto.notes);

    return this.waterIntakeRepository.getDailySummary(dto.userId, dateStr);
  }
}
