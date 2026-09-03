import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { LogWaterIntakeUseCase } from '../../../useCases/water/LogWaterIntakeUseCase';
import { DeleteWaterIntakeUseCase } from '../../../useCases/water/DeleteWaterIntakeUseCase';
import { GetWaterSummaryUseCase } from '../../../useCases/water/GetWaterSummaryUseCase';
import { UpdateWaterGoalUseCase } from '../../../useCases/water/UpdateWaterGoalUseCase';
import { GetWaterHistoryUseCase } from '../../../useCases/water/GetWaterHistoryUseCase';

export class WaterIntakeController {
  constructor(
    private logWaterIntakeUseCase: LogWaterIntakeUseCase,
    private deleteWaterIntakeUseCase: DeleteWaterIntakeUseCase,
    private getWaterSummaryUseCase: GetWaterSummaryUseCase,
    private updateWaterGoalUseCase: UpdateWaterGoalUseCase,
    private getWaterHistoryUseCase: GetWaterHistoryUseCase
  ) {}

  getTodaySummary = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const summary = await this.getWaterSummaryUseCase.execute(userId, dateStr);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Water summary fetched successfully',
        data: summary,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch water summary',
      });
    }
  };

  logIntake = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const { amountMl, date, notes } = req.body;
      const summary = await this.logWaterIntakeUseCase.execute({
        userId,
        amountMl: Number(amountMl),
        date,
        notes,
      });

      return sendResponse({
        res,
        statusCode: 201,
        message: 'Water intake logged successfully',
        data: summary,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to log water intake',
      });
    }
  };

  deleteIntake = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const { intakeId } = req.params;
      const dateStr = (req.query.date as string) || new Date().toISOString().split('T')[0];

      const summary = await this.deleteWaterIntakeUseCase.execute({
        userId,
        intakeId,
        date: dateStr,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Water intake entry deleted',
        data: summary,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to delete water intake entry',
      });
    }
  };

  updateGoal = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const { dailyGoalMl, date } = req.body;
      const summary = await this.updateWaterGoalUseCase.execute({
        userId,
        dailyGoalMl: Number(dailyGoalMl),
        date,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Daily water goal updated successfully',
        data: summary,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to update daily water goal',
      });
    }
  };

  getHistory = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const days = req.query.days ? Number(req.query.days) : 7;
      const history = await this.getWaterHistoryUseCase.execute(userId, days);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Water history fetched successfully',
        data: history,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch water history',
      });
    }
  };
}
