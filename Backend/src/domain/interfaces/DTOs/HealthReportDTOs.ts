export interface DailyReportDTO {
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

export interface PeriodReportDTO {
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

export interface HealthTrendsDTO {
  dates: string[];
  calories: number[];
  protein: number[];
  carbohydrates: number[];
  fat: number[];
  waterMl: number[];
  weightKg: (number | null)[];
  bmi: (number | null)[];
}

export interface LogWeightBmiDTO {
  weightKg: number;
  heightCm?: number;
  date?: string;
}

export interface PdfReportOptionsDTO {
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  date?: string;
  startDate?: string;
  endDate?: string;
}
