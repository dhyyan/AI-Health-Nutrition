import { AppNotification, CreateNotificationDTO } from '../../entities/Notification';

export interface INotificationRepository {
  create(dto: CreateNotificationDTO): Promise<AppNotification>;
  findByUserId(userId: string, limit?: number): Promise<AppNotification[]>;
  markAsRead(userId: string, notificationId: string): Promise<AppNotification | null>;
  markAllAsRead(userId: string): Promise<boolean>;
  delete(userId: string, notificationId: string): Promise<boolean>;
  getUnreadCount(userId: string): Promise<number>;
}
