import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { WaterHistoryDay } from '../../domain/entities/WaterIntake';

export class GetWaterHistoryUseCase {
  constructor(private waterIntakeRepository: IWaterIntakeRepository) {}

  async execute(userId: string, days: number = 7): Promise<WaterHistoryDay[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const validDays = Math.min(Math.max(days, 3), 30);
    return this.waterIntakeRepository.getWaterHistory(userId, validDays);
  }
}
