import api from './api';
import { AppNotification, NotificationType } from '../types/notification';

export const getNotifications = async (limit: number = 30): Promise<{ notifications: AppNotification[]; unreadCount: number }> => {
  const response = await api.get('/notifications', { params: { limit } });
  return response.data.data;
};

export const createNotification = async (payload: {
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
}): Promise<AppNotification> => {
  const response = await api.post('/notifications', payload);
  return response.data.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
