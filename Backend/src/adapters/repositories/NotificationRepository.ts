import mongoose from 'mongoose';
import { INotificationRepository } from '../../domain/interfaces/repositories/INotificationRepository';
import { AppNotification, CreateNotificationDTO } from '../../domain/entities/Notification';
import { NotificationModel, INotificationDocument } from '../../framework/database/models/NotificationModel';

export class NotificationRepository implements INotificationRepository {
  private mapDocumentToEntity(doc: INotificationDocument): AppNotification {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      title: doc.title,
      message: doc.message,
      type: doc.type,
      isRead: doc.isRead,
      actionUrl: doc.actionUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(dto: CreateNotificationDTO): Promise<AppNotification> {
    const created = await NotificationModel.create({
      userId: new mongoose.Types.ObjectId(dto.userId),
      title: dto.title,
      message: dto.message,
      type: dto.type,
      actionUrl: dto.actionUrl || '',
      isRead: false,
    });
    return this.mapDocumentToEntity(created);
  }

  async findByUserId(userId: string, limit: number = 30): Promise<AppNotification[]> {
    const docs = await NotificationModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async markAsRead(userId: string, notificationId: string): Promise<AppNotification | null> {
    const updated = await NotificationModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true }
    ).exec();

    return updated ? this.mapDocumentToEntity(updated) : null;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    await NotificationModel.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { isRead: true }
    ).exec();
    return true;
  }

  async delete(userId: string, notificationId: string): Promise<boolean> {
    const result = await NotificationModel.deleteOne({
      _id: new mongoose.Types.ObjectId(notificationId),
      userId: new mongoose.Types.ObjectId(userId),
    }).exec();
    return result.deletedCount > 0;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    }).exec();
  }
}
