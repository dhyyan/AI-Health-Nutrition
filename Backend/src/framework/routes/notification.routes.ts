import { Router } from 'express';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { NotificationRepository } from '../../adapters/repositories/NotificationRepository';
import { CreateNotificationUseCase } from '../../usecases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '../../usecases/notification/GetNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../../usecases/notification/MarkNotificationReadUseCase';
import { DeleteNotificationUseCase } from '../../usecases/notification/DeleteNotificationUseCase';
import { NotificationController } from '../../adapters/controllers/notification/NotificationController';

const router = Router();

const notificationRepository = new NotificationRepository();
const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepository);
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);

const controller = new NotificationController(
  createNotificationUseCase,
  getNotificationsUseCase,
  markNotificationReadUseCase,
  deleteNotificationUseCase
);

router.use(authenticateJwt);

router.get('/', controller.getNotifications);
router.post('/', controller.createNotification);
router.patch('/read-all', controller.markAllAsRead);
router.patch('/:id/read', controller.markAsRead);
router.delete('/:id', controller.deleteNotification);

export default router;
