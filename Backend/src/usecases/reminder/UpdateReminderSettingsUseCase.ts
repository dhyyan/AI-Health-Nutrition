import { IReminderSettingsRepository } from '../../domain/interfaces/repositories/IReminderSettingsRepository';
import { ReminderSettings, UpdateReminderSettingsDTO } from '../../domain/entities/ReminderSettings';

export class UpdateReminderSettingsUseCase {
  constructor(private reminderSettingsRepository: IReminderSettingsRepository) {}

  async execute(userId: string, dto: UpdateReminderSettingsDTO): Promise<ReminderSettings> {
    const existing = await this.reminderSettingsRepository.findByUserId(userId);
    if (!existing) {
      await this.reminderSettingsRepository.createDefault(userId);
    }
    return await this.reminderSettingsRepository.updateByUserId(userId, dto);
  }
}
