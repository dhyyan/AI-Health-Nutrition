import { DailyTip, TipCategory } from '../../entities/DailyTip';

export interface IDailyTipRepository {
  getTodayTip(category?: TipCategory): Promise<DailyTip | null>;
  getAllTips(): Promise<DailyTip[]>;
  seedTips(tips: Partial<DailyTip>[]): Promise<void>;
}
