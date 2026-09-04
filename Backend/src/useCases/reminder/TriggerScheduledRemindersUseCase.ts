import { IReminderSettingsRepository } from '../../domain/interfaces/repositories/IReminderSettingsRepository';
import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';
import { IDailyTipRepository } from '../../domain/interfaces/repositories/IDailyTipRepository';

export class TriggerScheduledRemindersUseCase {
  constructor(
    private reminderSettingsRepository: IReminderSettingsRepository,
    private notificationRepository: INotificationRepository,
    private dailyTipRepository: IDailyTipRepository
  ) {}

  async execute(): Promise<{ processedCount: number; notificationsTriggered: number }> {
    const allSettings = await this.reminderSettingsRepository.findAllActiveSettings();
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayNames[now.getDay()];

    let notificationsTriggered = 0;

    for (const settings of allSettings) {
      const { userId } = settings;

      // 1. Meal Reminders
      if (settings.meals?.enabled) {
        const { breakfastTime, lunchTime, dinnerTime, snackTime } = settings.meals;
        if (currentTimeStr === breakfastTime) {
          await this.notificationRepository.create({
            userId,
            title: '🍳 Breakfast Time!',
            message: 'Time to fuel your morning with a healthy, protein-rich breakfast.',
            type: 'meal_reminder',
            actionUrl: '/meals',
          });
          notificationsTriggered++;
        } else if (currentTimeStr === lunchTime) {
          await this.notificationRepository.create({
            userId,
            title: '🥗 Lunch Break Reminder',
            message: 'Remember to pause and enjoy a balanced lunch to sustain afternoon energy.',
            type: 'meal_reminder',
            actionUrl: '/meals',
          });
          notificationsTriggered++;
        } else if (currentTimeStr === dinnerTime) {
          await this.notificationRepository.create({
            userId,
            title: '🍲 Dinner Reminder',
            message: 'Time for dinner. Focus on lean proteins and fiber-rich vegetables.',
            type: 'meal_reminder',
            actionUrl: '/meals',
          });
          notificationsTriggered++;
        } else if (currentTimeStr === snackTime) {
          await this.notificationRepository.create({
            userId,
            title: '🍎 Healthy Snack Alert',
            message: 'Consider a light nutrient-dense snack like fruit, nuts, or Greek yogurt.',
            type: 'meal_reminder',
            actionUrl: '/meals',
          });
          notificationsTriggered++;
        }
      }

      // 2. Water Reminders (checked on interval windows)
      if (settings.water?.enabled) {
        const { startTime, endTime, intervalMinutes } = settings.water;
        if (currentTimeStr >= startTime && currentTimeStr <= endTime) {
          const [startH, startM] = startTime.split(':').map(Number);
          const currentTotalM = now.getHours() * 60 + now.getMinutes();
          const startTotalM = startH * 60 + startM;
          const elapsed = currentTotalM - startTotalM;

          if (elapsed > 0 && elapsed % (intervalMinutes || 60) === 0) {
            await this.notificationRepository.create({
              userId,
              title: '💧 Stay Hydrated!',
              message: 'Take a moment to drink a glass of fresh water and stay energized.',
              type: 'water_reminder',
              actionUrl: '/water',
            });
            notificationsTriggered++;
          }
        }
      }

      // 3. Exercise Reminders
      if (settings.exercise?.enabled) {
        const { time, days, activityName } = settings.exercise;
        if (currentTimeStr === time && (days.length === 0 || days.includes(currentDayName))) {
          await this.notificationRepository.create({
            userId,
            title: '🏃 Workout & Activity Reminder',
            message: `Time for your planned activity: ${activityName || 'Daily Workout'}. Keep moving!`,
            type: 'exercise_reminder',
            actionUrl: '/dashboard',
          });
          notificationsTriggered++;
        }
      }

      // 4. Sleep Reminders
      if (settings.sleep?.enabled) {
        const { bedtime, reminderMinutesBefore } = settings.sleep;
        if (bedtime) {
          const [bedH, bedM] = bedtime.split(':').map(Number);
          const bedDate = new Date(now);
          bedDate.setHours(bedH, bedM, 0, 0);

          const reminderTime = new Date(bedDate.getTime() - (reminderMinutesBefore || 30) * 60 * 1000);
          const remHours = String(reminderTime.getHours()).padStart(2, '0');
          const remMins = String(reminderTime.getMinutes()).padStart(2, '0');
          const remTimeStr = `${remHours}:${remMins}`;

          if (currentTimeStr === remTimeStr) {
            await this.notificationRepository.create({
              userId,
              title: '🌙 Wind Down for Sleep',
              message: `Your bedtime is set for ${bedtime}. Start winding down and power off screens!`,
              type: 'sleep_reminder',
              actionUrl: '/dashboard',
            });
            notificationsTriggered++;
          }
        }
      }

      // 5. Daily Health Tips
      if (settings.dailyTip?.enabled) {
        const { preferredTime, preferredCategory } = settings.dailyTip;
        if (currentTimeStr === preferredTime) {
          const tip = await this.dailyTipRepository.getTodayTip(preferredCategory as any);
          if (tip) {
            await this.notificationRepository.create({
              userId,
              title: `💡 Daily Wellness Tip: ${tip.title}`,
              message: tip.content,
              type: 'health_tip',
              actionUrl: '/dashboard',
            });
            notificationsTriggered++;
          }
        }
      }
    }

    return {
      processedCount: allSettings.length,
      notificationsTriggered,
    };
  }
}
