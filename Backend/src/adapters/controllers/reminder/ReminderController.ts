import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { GetReminderSettingsUseCase } from '../../../useCases/reminder/GetReminderSettingsUseCase';
import { UpdateReminderSettingsUseCase } from '../../../useCases/reminder/UpdateReminderSettingsUseCase';
import { GetDailyHealthTipUseCase } from '../../../useCases/reminder/GetDailyHealthTipUseCase';
import { TriggerScheduledRemindersUseCase } from '../../../useCases/reminder/TriggerScheduledRemindersUseCase';
import { TipCategory } from '../../../domain/entities/DailyTip';

export class ReminderController {
  constructor(
    private getReminderSettingsUseCase: GetReminderSettingsUseCase,
    private updateReminderSettingsUseCase: UpdateReminderSettingsUseCase,
    private getDailyHealthTipUseCase: GetDailyHealthTipUseCase,
    private triggerScheduledRemindersUseCase: TriggerScheduledRemindersUseCase
  ) {}

  getSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const settings = await this.getReminderSettingsUseCase.execute(userId);
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const updatedSettings = await this.updateReminderSettingsUseCase.execute(userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Reminder settings updated successfully',
        data: updatedSettings,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getDailyTip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const category = req.query.category as TipCategory | undefined;
      const tip = await this.getDailyHealthTipUseCase.execute(category);

      res.status(200).json({
        success: true,
        data: tip,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  triggerCheck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.triggerScheduledRemindersUseCase.execute();
      res.status(200).json({
        success: true,
        message: 'Scheduled reminders check triggered manually',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
