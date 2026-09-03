export interface WaterIntake {
  id?: string;
  userId: string;
  amountMl: number;
  date: string; // YYYY-MM-DD format
  timestamp: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWaterGoal {
  userId: string;
  dailyGoalMl: number;
  updatedAt?: Date;
}

export interface DailyWaterSummary {
  date: string;
  totalConsumedMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  remainingMl: number;
  records: WaterIntake[];
}

export interface WaterHistoryDay {
  date: string;
  totalConsumedMl: number;
  dailyGoalMl: number;
  progressPercentage: number;
  isGoalMet: boolean;
}
