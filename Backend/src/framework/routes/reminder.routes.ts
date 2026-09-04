import { Router } from 'express';
import { authenticateJwt } from '../../adapters/middlewares/auth.middleware';
import { ReminderSettingsRepository } from '../../adapters/repositories/ReminderSettingsRepository';
import { DailyTipRepository } from '../../adapters/repositories/DailyTipRepository';
import { NotificationRepository } from '../../adapters/repositories/NotificationRepository';
import { GetReminderSettingsUseCase } from '../../useCases/reminder/GetReminderSettingsUseCase';
import { UpdateReminderSettingsUseCase } from '../../useCases/reminder/UpdateReminderSettingsUseCase';
import { GetDailyHealthTipUseCase } from '../../useCases/reminder/GetDailyHealthTipUseCase';
import { TriggerScheduledRemindersUseCase } from '../../useCases/reminder/TriggerScheduledRemindersUseCase';
import { ReminderController } from '../../adapters/controllers/reminder/ReminderController';

const router = Router();

const reminderSettingsRepository = new ReminderSettingsRepository();
const dailyTipRepository = new DailyTipRepository();
const notificationRepository = new NotificationRepository();

const getReminderSettingsUseCase = new GetReminderSettingsUseCase(reminderSettingsRepository);
const updateReminderSettingsUseCase = new UpdateReminderSettingsUseCase(reminderSettingsRepository);
const getDailyHealthTipUseCase = new GetDailyHealthTipUseCase(dailyTipRepository);
const triggerScheduledRemindersUseCase = new TriggerScheduledRemindersUseCase(
  reminderSettingsRepository,
  notificationRepository,
  dailyTipRepository
);

const controller = new ReminderController(
  getReminderSettingsUseCase,
  updateReminderSettingsUseCase,
  getDailyHealthTipUseCase,
  triggerScheduledRemindersUseCase
);

router.use(authenticateJwt);

router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
router.get('/tip/daily', controller.getDailyTip);
router.post('/trigger-check', controller.triggerCheck);

export default router;
