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

export interface HealthScoreBreakdown {
  totalScore: number; // 0 - 100
  statusLabel: string; // "Excellent" | "Good" | "Fair" | "Needs Attention"
  nutritionScore: number; // max 35
  waterScore: number; // max 25
  bmiScore: number; // max 25
  consistencyScore: number; // max 15
}

export interface MacroItemSummary {
  consumed: number;
  target: number;
  unit: string;
  percentage: number;
}

export interface MacroNutrientSummary {
  calories: MacroItemSummary & { remaining: number };
  protein: MacroItemSummary;
  carbohydrates: MacroItemSummary;
  fat: MacroItemSummary;
  fiber: MacroItemSummary;
  macroPercentages: {
    proteinRatio: number; // e.g. 25% of energy
    carbsRatio: number; // e.g. 50% of energy
    fatRatio: number; // e.g. 25% of energy
  };
}

export interface DashboardRecommendationItem {
  id: string;
  category: 'nutrition' | 'water' | 'activity' | 'lifestyle';
  title: string;
  suggestion: string;
  tag: string;
  impactLevel: 'high' | 'medium' | 'general';
}

export interface UserDashboardDTO {
  date: string;
  userProfile: {
    name: string;
    email: string;
    avatarUrl?: string;
    goal: string;
    weightKg: number;
    heightCm: number;
    bmi: number;
    bmiCategory: string;
    idealWeightRange: string;
  };
  dailySummary: {
    caloriesConsumed: number;
    caloriesTarget: number;
    caloriesRemaining: number;
    waterConsumedMl: number;
    waterGoalMl: number;
    waterProgressPercentage: number;
  };
  healthScore: HealthScoreBreakdown;
  macros: MacroNutrientSummary;
  aiRecommendations: DashboardRecommendationItem[];
  recentFoodHistory: Array<{
    id: string;
    foodName: string;
    mealType: string;
    servingSize: number;
    servingUnit: string;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    isAiScanned?: boolean;
    createdAt?: Date | string;
  }>;
  disclaimer: string;
}

