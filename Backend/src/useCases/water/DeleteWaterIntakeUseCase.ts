import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { DailyWaterSummary } from '../../domain/entities/WaterIntake';

export interface DeleteWaterIntakeDTO {
  userId: string;
  intakeId: string;
  date?: string;
}

export class DeleteWaterIntakeUseCase {
  constructor(private waterIntakeRepository: IWaterIntakeRepository) {}

  async execute(dto: DeleteWaterIntakeDTO): Promise<DailyWaterSummary> {
    if (!dto.userId || !dto.intakeId) {
      throw new Error('User ID and Intake ID are required');
    }

    const dateStr = dto.date || new Date().toISOString().split('T')[0];

    const deleted = await this.waterIntakeRepository.deleteIntake(dto.userId, dto.intakeId);
    if (!deleted) {
      throw new Error('Water intake log record not found or unauthorized');
    }

    return this.waterIntakeRepository.getDailySummary(dto.userId, dateStr);
  }
}
