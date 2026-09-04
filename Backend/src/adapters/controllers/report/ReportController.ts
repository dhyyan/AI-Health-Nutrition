import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../../shared/utils/apiResponse';
import { GetDailyReportUseCase } from '../../../useCases/report/GetDailyReportUseCase';
import { GetUserDashboardUseCase } from '../../../useCases/report/GetUserDashboardUseCase';
import { GetWeeklyReportUseCase } from '../../../useCases/report/GetWeeklyReportUseCase';
import { GetMonthlyReportUseCase } from '../../../useCases/report/GetMonthlyReportUseCase';
import { GetHealthTrendsUseCase } from '../../../useCases/report/GetHealthTrendsUseCase';
import { LogWeightBmiUseCase } from '../../../useCases/report/LogWeightBmiUseCase';
import { GeneratePdfReportUseCase } from '../../../useCases/report/GeneratePdfReportUseCase';

export class ReportController {
  constructor(
    private getDailyReportUseCase: GetDailyReportUseCase,
    private getWeeklyReportUseCase: GetWeeklyReportUseCase,
    private getMonthlyReportUseCase: GetMonthlyReportUseCase,
    private getHealthTrendsUseCase: GetHealthTrendsUseCase,
    private logWeightBmiUseCase: LogWeightBmiUseCase,
    private generatePdfReportUseCase: GeneratePdfReportUseCase,
    private getUserDashboardUseCase?: GetUserDashboardUseCase
  ) {}

  getDashboard = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      if (!this.getUserDashboardUseCase) {
        return sendResponse({ res, statusCode: 500, message: 'User Dashboard UseCase not injected' });
      }

      const dateStr = req.query.date as string | undefined;
      const dashboard = await this.getUserDashboardUseCase.execute(userId, dateStr);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'User dashboard fetched successfully',
        data: dashboard,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch user dashboard',
      });
    }
  };

  getDailyReport = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const dateStr = req.query.date as string | undefined;
      const report = await this.getDailyReportUseCase.execute(userId, dateStr);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Daily health report fetched successfully',
        data: report,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch daily health report',
      });
    }
  };

  getWeeklyReport = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const report = await this.getWeeklyReportUseCase.execute(userId);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Weekly health report fetched successfully',
        data: report,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch weekly health report',
      });
    }
  };

  getMonthlyReport = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const report = await this.getMonthlyReportUseCase.execute(userId);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Monthly health report fetched successfully',
        data: report,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch monthly health report',
      });
    }
  };

  getTrends = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const period = (req.query.period as string) || '30d';
      const trends = await this.getHealthTrendsUseCase.execute(userId, period);

      return sendResponse({
        res,
        statusCode: 200,
        message: 'Health trends fetched successfully',
        data: trends,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to fetch health trends',
      });
    }
  };

  logWeightBmi = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendResponse({ res, statusCode: 401, message: 'Unauthorized' });
      }

      const result = await this.logWeightBmiUseCase.execute(userId, req.body);

      return sendResponse({
        res,
        statusCode: 201,
        message: 'Weight & BMI logged successfully',
        data: result,
      });
    } catch (error: any) {
      return sendResponse({
        res,
        statusCode: 400,
        message: error.message || 'Failed to log weight & BMI',
      });
    }
  };

  downloadPdfReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'daily';
      const date = req.query.date as string | undefined;

      const pdfBuffer = await this.generatePdfReportUseCase.execute(userId, { period, date });

      const fileName = `nutriai-${period}-health-report-${new Date().toISOString().split('T')[0]}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.end(pdfBuffer);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to generate PDF report' });
    }
  };
}
