import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';

export class DeleteFoodLogUseCase {
  constructor(private foodLogRepository: IFoodLogRepository) {}

  async execute(logId: string, userId: string): Promise<boolean> {
    if (!logId || !userId) throw new Error('Log ID and User ID are required');
    return this.foodLogRepository.delete(logId, userId);
  }
}
