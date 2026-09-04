import api from './api';

export interface DailyReportData {
  date: string;
  foodLogs: Array<{
    id: string;
    foodName: string;
    mealType: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  totalFiber: number;
  totalWaterMl: number;
  waterGoalMl: number;
  currentWeightKg: number;
  currentBmi: number;
  bmiCategory: string;
  targetCalories: number;
}

export interface DaySummaryItem {
  date: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  waterMl: number;
  weightKg?: number;
  bmi?: number;
}

export interface PeriodReportData {
  period: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  dailySummaries: DaySummaryItem[];
  avgCalories: number;
  avgProtein: number;
  avgCarbohydrates: number;
  avgFat: number;
  avgWaterMl: number;
  totalWaterMl: number;
  totalCalories: number;
  startWeightKg: number;
  endWeightKg: number;
  weightChangeKg: number;
  latestBmi: number;
  bmiCategory: string;
  activeDaysCount: number;
}

export interface HealthTrendsData {
  dates: string[];
  calories: number[];
  protein: number[];
  carbohydrates: number[];
  fat: number[];
  waterMl: number[];
  weightKg: (number | null)[];
  bmi: (number | null)[];
}

export interface UserDashboardData {
  userProfile?: any;
  dailySummary?: any;
  healthScore?: any;
  macros?: any;
  aiRecommendations?: any[];
  recentFoodHistory?: any[];
  disclaimer?: string;
}

export interface LogWeightBmiPayload {
  weightKg: number;
  heightCm?: number;
  date?: string;
}

export const reportApi = {
  getDashboard: async (date?: string): Promise<UserDashboardData> => {
    const response = await api.get('/reports/dashboard', { params: { date } });
    return response.data.data;
  },

  getDailyReport: async (date?: string): Promise<DailyReportData> => {
    const response = await api.get('/reports/daily', { params: { date } });
    return response.data.data;
  },

  getWeeklyReport: async (): Promise<PeriodReportData> => {
    const response = await api.get('/reports/weekly');
    return response.data.data;
  },

  getMonthlyReport: async (): Promise<PeriodReportData> => {
    const response = await api.get('/reports/monthly');
    return response.data.data;
  },

  getTrends: async (period: string = '30d'): Promise<HealthTrendsData> => {
    const response = await api.get('/reports/trends', { params: { period } });
    return response.data.data;
  },

  logWeightBmi: async (payload: LogWeightBmiPayload) => {
    const response = await api.post('/reports/weight-bmi', payload);
    return response.data.data;
  },

  downloadPdfReport: async (period: 'daily' | 'weekly' | 'monthly', date?: string) => {
    const response = await api.get('/reports/download-pdf', {
      params: { period, date },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `nutriai-${period}-health-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};
