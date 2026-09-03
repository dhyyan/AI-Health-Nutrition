import { IDailyTipRepository } from '../../domain/interfaces/repositories/IDailyTipRepository';
import { DailyTip, TipCategory } from '../../domain/entities/DailyTip';

export class GetDailyHealthTipUseCase {
  constructor(private dailyTipRepository: IDailyTipRepository) {}

  async execute(category?: TipCategory): Promise<DailyTip | null> {
    return await this.dailyTipRepository.getTodayTip(category);
  }
}
