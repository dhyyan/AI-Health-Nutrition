import { FoodLog } from '../../entities/FoodLog';

export interface IFoodLogRepository {
  create(log: FoodLog): Promise<FoodLog>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<FoodLog[]>;
  findByUserId(userId: string, limit?: number): Promise<FoodLog[]>;
  findById(id: string): Promise<FoodLog | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
