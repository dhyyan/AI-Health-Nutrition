import { WeightBmiLog } from '../../entities/WeightBmiLog';

export interface IWeightBmiLogRepository {
  createOrUpdateLog(log: WeightBmiLog): Promise<WeightBmiLog>;
  getHistory(userId: string, startDate?: string, endDate?: string): Promise<WeightBmiLog[]>;
  getLatest(userId: string): Promise<WeightBmiLog | null>;
}
