import api from './api';
import { ReminderSettings, DailyHealthTip, TipCategory } from '../types/reminder';

export const getReminderSettings = async (): Promise<ReminderSettings> => {
  const response = await api.get('/reminders/settings');
  return response.data.data;
};

export const updateReminderSettings = async (
  payload: Partial<ReminderSettings>
): Promise<ReminderSettings> => {
  const response = await api.put('/reminders/settings', payload);
  return response.data.data;
};

export const getDailyHealthTip = async (category?: TipCategory): Promise<DailyHealthTip | null> => {
  const response = await api.get('/reminders/tip/daily', { params: { category } });
  return response.data.data;
};

export const triggerReminderCheck = async (): Promise<{ processedCount: number; notificationsTriggered: number }> => {
  const response = await api.post('/reminders/trigger-check');
  return response.data.data;
};
