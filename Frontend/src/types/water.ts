export interface WaterIntakeRecord {
  id: string;
  userId: string;
  amountMl: number;
  date: string;
  timestamp: string;
  notes?: string;
}

export interface DailyWaterSummary {
  date: string;
  totalConsumedMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  remainingMl: number;
  records: WaterIntakeRecord[];
}

export interface WaterHistoryDay {
  date: string;
  totalConsumedMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  isGoalMet: boolean;
}

export interface LogWaterDTO {
  amountMl: number;
  date?: string;
  notes?: string;
}

export interface UpdateWaterGoalDTO {
  dailyGoalMl: number;
  date?: string;
}
