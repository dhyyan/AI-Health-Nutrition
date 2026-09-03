import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';
import { AppNotification, CreateNotificationDTO } from '../../domain/entities/Notification';

export class CreateNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(dto: CreateNotificationDTO): Promise<AppNotification> {
    if (!dto.userId) {
      throw new Error('User ID is required');
    }
    if (!dto.title || !dto.message) {
      throw new Error('Title and message are required');
    }

    return this.notificationRepository.create(dto);
  }
}
