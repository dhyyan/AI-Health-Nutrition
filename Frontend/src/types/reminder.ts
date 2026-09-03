export interface MealReminderSchedule {
  enabled: boolean;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  snackTime: string;
}

export interface WaterReminderSchedule {
  enabled: boolean;
  intervalMinutes: number;
  startTime: string;
  endTime: string;
}

export interface ExerciseReminderSchedule {
  enabled: boolean;
  time: string;
  days: string[];
  activityName: string;
}

export interface SleepReminderSchedule {
  enabled: boolean;
  bedtime: string;
  wakeTime: string;
  reminderMinutesBefore: number;
}

export interface DailyHealthTipSchedule {
  enabled: boolean;
  preferredTime: string;
  preferredCategory?: string;
}

export interface ReminderSettings {
  id?: string;
  userId?: string;
  meals: MealReminderSchedule;
  water: WaterReminderSchedule;
  exercise: ExerciseReminderSchedule;
  sleep: SleepReminderSchedule;
  dailyTip: DailyHealthTipSchedule;
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
}

export type TipCategory = 'general' | 'nutrition' | 'fitness' | 'hydration' | 'mindfulness';

export interface DailyHealthTip {
  id?: string;
  category: TipCategory;
  title: string;
  content: string;
  actionableStep?: string;
  sourceOrTag?: string;
}
