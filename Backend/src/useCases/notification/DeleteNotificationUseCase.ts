import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(userId: string, notificationId: string): Promise<boolean> {
    if (!userId || !notificationId) {
      throw new Error('User ID and Notification ID are required');
    }

    return this.notificationRepository.delete(userId, notificationId);
  }
}
