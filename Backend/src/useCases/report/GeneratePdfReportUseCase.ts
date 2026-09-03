import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { GetDailyReportUseCase } from './GetDailyReportUseCase';
import { GetWeeklyReportUseCase } from './GetWeeklyReportUseCase';
import { GetMonthlyReportUseCase } from './GetMonthlyReportUseCase';
import { PdfReportService, PdfReportData } from '../../framework/services/pdf/PdfReportService';
import { PdfReportOptionsDTO } from '../../domain/interfaces/DTOs/HealthReportDTOs';

export class GeneratePdfReportUseCase {
  constructor(
    private userRepository: IUserRepository,
    private getDailyReportUseCase: GetDailyReportUseCase,
    private getWeeklyReportUseCase: GetWeeklyReportUseCase,
    private getMonthlyReportUseCase: GetMonthlyReportUseCase
  ) {}

  async execute(userId: string, options: PdfReportOptionsDTO): Promise<Buffer> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const period = options.period || 'daily';
    const nowStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    let pdfData: PdfReportData;

    if (period === 'daily') {
      const dailyReport = await this.getDailyReportUseCase.execute(userId, options.date);
      pdfData = {
        title: 'Daily Health & Nutrition Report',
        userName: user.name,
        userEmail: user.email,
        generatedAt: nowStr,
        periodText: `Daily Summary for ${dailyReport.date}`,
        metrics: {
          weightKg: dailyReport.currentWeightKg,
          heightCm: 170, // default if not in dto
          bmi: dailyReport.currentBmi,
          bmiCategory: dailyReport.bmiCategory,
          totalCalories: dailyReport.totalCalories,
          totalWaterMl: dailyReport.totalWaterMl,
          totalProteinG: dailyReport.totalProtein,
          totalCarbsG: dailyReport.totalCarbohydrates,
          totalFatG: dailyReport.totalFat,
        },
        foodLogs: dailyReport.foodLogs,
      };
    } else if (period === 'weekly') {
      const weeklyReport = await this.getWeeklyReportUseCase.execute(userId);
      pdfData = {
        title: 'Weekly Progress & Trend Report',
        userName: user.name,
        userEmail: user.email,
        generatedAt: nowStr,
        periodText: `7-Day Period (${weeklyReport.startDate} to ${weeklyReport.endDate})`,
        metrics: {
          weightKg: weeklyReport.endWeightKg,
          heightCm: 170,
          bmi: weeklyReport.latestBmi,
          bmiCategory: weeklyReport.bmiCategory,
          totalCalories: weeklyReport.totalCalories,
          avgCalories: weeklyReport.avgCalories,
          totalWaterMl: weeklyReport.totalWaterMl,
          avgWaterMl: weeklyReport.avgWaterMl,
          totalProteinG: weeklyReport.avgProtein * 7,
          totalCarbsG: weeklyReport.avgCarbohydrates * 7,
          totalFatG: weeklyReport.avgFat * 7,
        },
        dailyLogs: weeklyReport.dailySummaries.map((d) => ({
          date: d.date,
          calories: d.calories,
          protein: d.protein,
          carbs: d.carbohydrates,
          fat: d.fat,
          waterMl: d.waterMl,
          weightKg: d.weightKg,
          bmi: d.bmi,
        })),
      };
    } else {
      const monthlyReport = await this.getMonthlyReportUseCase.execute(userId);
      pdfData = {
        title: 'Monthly Comprehensive Health Report',
        userName: user.name,
        userEmail: user.email,
        generatedAt: nowStr,
        periodText: `30-Day Period (${monthlyReport.startDate} to ${monthlyReport.endDate})`,
        metrics: {
          weightKg: monthlyReport.endWeightKg,
          heightCm: 170,
          bmi: monthlyReport.latestBmi,
          bmiCategory: monthlyReport.bmiCategory,
          totalCalories: monthlyReport.totalCalories,
          avgCalories: monthlyReport.avgCalories,
          totalWaterMl: monthlyReport.totalWaterMl,
          avgWaterMl: monthlyReport.avgWaterMl,
          totalProteinG: monthlyReport.avgProtein * 30,
          totalCarbsG: monthlyReport.avgCarbohydrates * 30,
          totalFatG: monthlyReport.avgFat * 30,
        },
        dailyLogs: monthlyReport.dailySummaries.map((d) => ({
          date: d.date,
          calories: d.calories,
          protein: d.protein,
          carbs: d.carbohydrates,
          fat: d.fat,
          waterMl: d.waterMl,
          weightKg: d.weightKg,
          bmi: d.bmi,
        })),
      };
    }

    return await PdfReportService.generateReportBuffer(pdfData);
  }
}
