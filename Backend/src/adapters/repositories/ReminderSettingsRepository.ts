import { IReminderSettingsRepository } from '../../domain/interfaces/repositories/IReminderSettingsRepository';
import { ReminderSettings, UpdateReminderSettingsDTO } from '../../domain/entities/ReminderSettings';
import { ReminderSettingsModel, IReminderSettingsDocument } from '../../framework/database/models/ReminderSettingsModel';

export class ReminderSettingsRepository implements IReminderSettingsRepository {
  private mapDocumentToEntity(doc: IReminderSettingsDocument): ReminderSettings {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      meals: {
        enabled: doc.meals.enabled,
        breakfastTime: doc.meals.breakfastTime,
        lunchTime: doc.meals.lunchTime,
        dinnerTime: doc.meals.dinnerTime,
        snackTime: doc.meals.snackTime,
      },
      water: {
        enabled: doc.water.enabled,
        intervalMinutes: doc.water.intervalMinutes,
        startTime: doc.water.startTime,
        endTime: doc.water.endTime,
      },
      exercise: {
        enabled: doc.exercise.enabled,
        time: doc.exercise.time,
        days: doc.exercise.days || [],
        activityName: doc.exercise.activityName,
      },
      sleep: {
        enabled: doc.sleep.enabled,
        bedtime: doc.sleep.bedtime,
        wakeTime: doc.sleep.wakeTime,
        reminderMinutesBefore: doc.sleep.reminderMinutesBefore,
      },
      dailyTip: {
        enabled: doc.dailyTip.enabled,
        preferredTime: doc.dailyTip.preferredTime,
        preferredCategory: doc.dailyTip.preferredCategory,
      },
      browserNotificationsEnabled: doc.browserNotificationsEnabled,
      soundEnabled: doc.soundEnabled,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<ReminderSettings | null> {
    const doc = await ReminderSettingsModel.findOne({ userId });
    return doc ? this.mapDocumentToEntity(doc) : null;
  }

  async createDefault(userId: string): Promise<ReminderSettings> {
    const doc = await ReminderSettingsModel.create({
      userId,
      meals: {
        enabled: true,
        breakfastTime: '08:00',
        lunchTime: '13:00',
        dinnerTime: '19:30',
        snackTime: '16:30',
      },
      water: {
        enabled: true,
        intervalMinutes: 60,
        startTime: '08:00',
        endTime: '22:00',
      },
      exercise: {
        enabled: true,
        time: '17:30',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        activityName: 'Daily Workout & Cardio',
      },
      sleep: {
        enabled: true,
        bedtime: '22:30',
        wakeTime: '06:30',
        reminderMinutesBefore: 30,
      },
      dailyTip: {
        enabled: true,
        preferredTime: '09:00',
        preferredCategory: 'general',
      },
      browserNotificationsEnabled: true,
      soundEnabled: true,
    });
    return this.mapDocumentToEntity(doc);
  }

  async updateByUserId(userId: string, settingsData: UpdateReminderSettingsDTO): Promise<ReminderSettings> {
    let doc = await ReminderSettingsModel.findOne({ userId });
    if (!doc) {
      doc = new ReminderSettingsModel({ userId, ...settingsData });
    } else {
      if (settingsData.meals) doc.meals = { ...doc.meals, ...settingsData.meals };
      if (settingsData.water) doc.water = { ...doc.water, ...settingsData.water };
      if (settingsData.exercise) doc.exercise = { ...doc.exercise, ...settingsData.exercise };
      if (settingsData.sleep) doc.sleep = { ...doc.sleep, ...settingsData.sleep };
      if (settingsData.dailyTip) doc.dailyTip = { ...doc.dailyTip, ...settingsData.dailyTip };
      if (settingsData.browserNotificationsEnabled !== undefined) {
        doc.browserNotificationsEnabled = settingsData.browserNotificationsEnabled;
      }
      if (settingsData.soundEnabled !== undefined) {
        doc.soundEnabled = settingsData.soundEnabled;
      }
    }
    await doc.save();
    return this.mapDocumentToEntity(doc);
  }

  async findAllActiveSettings(): Promise<ReminderSettings[]> {
    const docs = await ReminderSettingsModel.find({});
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }
}
