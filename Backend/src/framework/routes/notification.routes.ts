import { Router } from 'express';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { NotificationRepository } from '../../adapters/repositories/NotificationRepository';
import { CreateNotificationUseCase } from '../../useCases/notification/CreateNotificationUseCase';
import { GetNotificationsUseCase } from '../../useCases/notification/GetNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../../useCases/notification/MarkNotificationReadUseCase';
import { DeleteNotificationUseCase } from '../../useCases/notification/DeleteNotificationUseCase';
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
