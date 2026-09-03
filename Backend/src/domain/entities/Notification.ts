export type NotificationType =
  | 'water_reminder'
  | 'meal_reminder'
  | 'exercise_reminder'
  | 'sleep_reminder'
  | 'health_tip'
  | 'health_alert'
  | 'system';

export interface AppNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateNotificationDTO {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
}
