import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { CreateNotificationUseCase } from '../../../usecases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '../../../usecases/notification/GetNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../../../usecases/notification/MarkNotificationReadUseCase';
import { DeleteNotificationUseCase } from '../../../usecases/notification/DeleteNotificationUseCase';

export class NotificationController {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase,
    private getNotificationsUseCase: GetNotificationsUseCase,
    private markNotificationReadUseCase: MarkNotificationReadUseCase,
    private deleteNotificationUseCase: DeleteNotificationUseCase
  ) {}

  getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;
      const result = await this.getNotificationsUseCase.execute(userId, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  createNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { title, message, type, actionUrl } = req.body;
      const notification = await this.createNotificationUseCase.execute({
        userId,
        title,
        message,
        type: type || 'system',
        actionUrl,
      });

      res.status(201).json({
        success: true,
        data: notification,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      await this.markNotificationReadUseCase.execute(userId, id);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      await this.markNotificationReadUseCase.execute(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteNotification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      await this.deleteNotificationUseCase.execute(userId, id);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
