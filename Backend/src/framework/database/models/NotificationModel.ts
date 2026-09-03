import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '../../../domain/entities/Notification';

export interface INotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['water_reminder', 'meal_reminder', 'health_alert', 'system'],
      default: 'system',
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    actionUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
