export interface MealReminderSchedule {
  enabled: boolean;
  breakfastTime: string; // e.g. "08:00"
  lunchTime: string;     // e.g. "13:00"
  dinnerTime: string;    // e.g. "19:00"
  snackTime: string;     // e.g. "16:00"
}

export interface WaterReminderSchedule {
  enabled: boolean;
  intervalMinutes: number; // e.g. 60
  startTime: string;       // e.g. "08:00"
  endTime: string;         // e.g. "22:00"
}

export interface ExerciseReminderSchedule {
  enabled: boolean;
  time: string;           // e.g. "17:00"
  days: string[];         // e.g. ["Mon", "Wed", "Fri"]
  activityName: string;   // e.g. "Daily Workout / Jogging"
}

export interface SleepReminderSchedule {
  enabled: boolean;
  bedtime: string;        // e.g. "22:30"
  wakeTime: string;       // e.g. "06:30"
  reminderMinutesBefore: number; // e.g. 30
}

export interface DailyHealthTipSchedule {
  enabled: boolean;
  preferredTime: string;  // e.g. "09:00"
  preferredCategory?: string; // "general" | "nutrition" | "fitness" | "hydration" | "mindfulness"
}

export interface ReminderSettings {
  id?: string;
  userId: string;
  meals: MealReminderSchedule;
  water: WaterReminderSchedule;
  exercise: ExerciseReminderSchedule;
  sleep: SleepReminderSchedule;
  dailyTip: DailyHealthTipSchedule;
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateReminderSettingsDTO {
  meals?: Partial<MealReminderSchedule>;
  water?: Partial<WaterReminderSchedule>;
  exercise?: Partial<ExerciseReminderSchedule>;
  sleep?: Partial<SleepReminderSchedule>;
  dailyTip?: Partial<DailyHealthTipSchedule>;
  browserNotificationsEnabled?: boolean;
  soundEnabled?: boolean;
}
