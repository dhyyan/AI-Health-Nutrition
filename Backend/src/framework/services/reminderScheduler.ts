import { ReminderSettingsRepository } from '../../adapters/repositories/ReminderSettingsRepository';
import { NotificationRepository } from '../../adapters/repositories/NotificationRepository';
import { DailyTipRepository } from '../../adapters/repositories/DailyTipRepository';
import { TriggerScheduledRemindersUseCase } from '../../usecases/reminder/TriggerScheduledRemindersUseCase';

export class ReminderSchedulerService {
  private timer: NodeJS.Timeout | null = null;

  startScheduler(): void {
    if (this.timer) return;

    const reminderSettingsRepository = new ReminderSettingsRepository();
    const notificationRepository = new NotificationRepository();
    const dailyTipRepository = new DailyTipRepository();

    const triggerUseCase = new TriggerScheduledRemindersUseCase(
      reminderSettingsRepository,
      notificationRepository,
      dailyTipRepository
    );

    console.log('⏰ Reminder Scheduler Background Worker started (Running interval checks every 60s)');

    // Run interval check every 60 seconds
    this.timer = setInterval(async () => {
      try {
        await triggerUseCase.execute();
      } catch (err) {
        console.error('❌ Error executing scheduled reminder background job:', err);
      }
    }, 60000);
  }

  stopScheduler(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('🛑 Reminder Scheduler Background Worker stopped');
    }
  }
}

export const reminderScheduler = new ReminderSchedulerService();
