import { ReminderSettings, UpdateReminderSettingsDTO } from '../../entities/ReminderSettings';

export interface IReminderSettingsRepository {
  findByUserId(userId: string): Promise<ReminderSettings | null>;
  createDefault(userId: string): Promise<ReminderSettings>;
  updateByUserId(userId: string, settingsData: UpdateReminderSettingsDTO): Promise<ReminderSettings>;
  findAllActiveSettings(): Promise<ReminderSettings[]>;
}
