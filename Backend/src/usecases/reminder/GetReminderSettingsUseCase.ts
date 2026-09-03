import { IReminderSettingsRepository } from '../../domain/interfaces/repositories/IReminderSettingsRepository';
import { ReminderSettings } from '../../domain/entities/ReminderSettings';

export class GetReminderSettingsUseCase {
  constructor(private reminderSettingsRepository: IReminderSettingsRepository) {}

  async execute(userId: string): Promise<ReminderSettings> {
    let settings = await this.reminderSettingsRepository.findByUserId(userId);
    if (!settings) {
      settings = await this.reminderSettingsRepository.createDefault(userId);
    }
    return settings;
  }
}
