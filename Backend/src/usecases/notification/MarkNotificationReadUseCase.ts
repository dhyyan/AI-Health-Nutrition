import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';

export class MarkNotificationReadUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string, notificationId?: string): Promise<boolean> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (notificationId) {
      const updated = await this.notificationRepository.markAsRead(userId, notificationId);
      return !!updated;
    } else {
      return this.notificationRepository.markAllAsRead(userId);
    }
  }
}
