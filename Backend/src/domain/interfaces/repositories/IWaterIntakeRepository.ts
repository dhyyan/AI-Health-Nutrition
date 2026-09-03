import { WaterIntake, UserWaterGoal, DailyWaterSummary, WaterHistoryDay } from '../../entities/WaterIntake';

export interface IWaterIntakeRepository {
  logIntake(userId: string, amountMl: number, date: string, notes?: string): Promise<WaterIntake>;
  deleteIntake(userId: string, intakeId: string): Promise<boolean>;
  getDailyIntakeRecords(userId: string, date: string): Promise<WaterIntake[]>;
  getDailySummary(userId: string, date: string): Promise<DailyWaterSummary>;
  getWaterGoal(userId: string): Promise<number>;
  updateWaterGoal(userId: string, dailyGoalMl: number): Promise<UserWaterGoal>;
  getWaterHistory(userId: string, days?: number): Promise<WaterHistoryDay[]>;
}
