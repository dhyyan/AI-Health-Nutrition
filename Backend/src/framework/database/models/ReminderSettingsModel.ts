import mongoose, { Schema, Document } from 'mongoose';

export interface IReminderSettingsDocument extends Document {
  userId: mongoose.Types.ObjectId;
  meals: {
    enabled: boolean;
    breakfastTime: string;
    lunchTime: string;
    dinnerTime: string;
    snackTime: string;
  };
  water: {
    enabled: boolean;
    intervalMinutes: number;
    startTime: string;
    endTime: string;
  };
  exercise: {
    enabled: boolean;
    time: string;
    days: string[];
    activityName: string;
  };
  sleep: {
    enabled: boolean;
    bedtime: string;
    wakeTime: string;
    reminderMinutesBefore: number;
  };
  dailyTip: {
    enabled: boolean;
    preferredTime: string;
    preferredCategory?: string;
  };
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSettingsSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    meals: {
      enabled: { type: Boolean, default: true },
      breakfastTime: { type: String, default: '08:00' },
      lunchTime: { type: String, default: '13:00' },
      dinnerTime: { type: String, default: '19:30' },
      snackTime: { type: String, default: '16:30' },
    },
    water: {
      enabled: { type: Boolean, default: true },
      intervalMinutes: { type: Number, default: 60 },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '22:00' },
    },
    exercise: {
      enabled: { type: Boolean, default: true },
      time: { type: String, default: '17:30' },
      days: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      activityName: { type: String, default: 'Daily Workout & Cardio' },
    },
    sleep: {
      enabled: { type: Boolean, default: true },
      bedtime: { type: String, default: '22:30' },
      wakeTime: { type: String, default: '06:30' },
      reminderMinutesBefore: { type: Number, default: 30 },
    },
    dailyTip: {
      enabled: { type: Boolean, default: true },
      preferredTime: { type: String, default: '09:00' },
      preferredCategory: { type: String, default: 'general' },
    },
    browserNotificationsEnabled: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ReminderSettingsModel = mongoose.model<IReminderSettingsDocument>(
  'ReminderSettings',
  ReminderSettingsSchema
);
