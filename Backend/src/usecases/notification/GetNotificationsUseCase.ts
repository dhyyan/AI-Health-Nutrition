import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';
import { AppNotification } from '../../domain/entities/Notification';

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string, limit: number = 30): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const [notifications, unreadCount] = await Promise.all([
      this.notificationRepository.findByUserId(userId, limit),
      this.notificationRepository.getUnreadCount(userId),
    ]);

    return { notifications, unreadCount };
  }
}
