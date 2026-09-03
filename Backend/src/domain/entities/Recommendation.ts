import { HealthGoal, BMICategory } from './HealthProfile';

export interface RecommendedFoodChoice {
  name: string;
  category: string;
  description: string;
  calories: number;
  protein: number;
  reason: string;
  tags?: string[];
}

export interface GoalPlan {
  goal: HealthGoal;
  title: string;
  description: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  recommendedFoods: RecommendedFoodChoice[];
  avoidFoods: string[];
  activityAdvice: string[];
}

export interface LifestyleSuggestion {
  activity: {
    level: string;
    advice: string;
    recommendedMinutes: number;
  };
  hydration: {
    targetMl: number;
    advice: string;
  };
  sleep: {
    targetHours: number;
    currentHours: number;
    advice: string;
  };
  eatingHabits: string[];
  disclaimer: string;
}

export interface HandPortionRule {
  category: string;
  handVisual: string;
  portionSize: string;
  example: string;
}

export interface CategoryPortionGuidance {
  category: string;
  servingAdvice: string;
  recommendedGram: number;
  tip: string;
}

export interface PortionGuidance {
  handGuide: HandPortionRule[];
  exactCategoryPortions: CategoryPortionGuidance[];
}

export interface FoodAlternativeItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  sodium: number;
  servingSize: number;
  servingUnit: string;
}

export interface FoodAlternativeComparison {
  originalFood: FoodAlternativeItem;
  alternativeFood: FoodAlternativeItem;
  reason: string;
  calorieSavings: number;
  proteinDifference: number;
  healthBenefit: string;
}

export interface ProfileMetricComparison {
  name: string;
  unit: string;
  actual: number;
  target: number;
  percentage: number;
  status: 'under' | 'optimal' | 'over';
  message: string;
}

export interface HealthProfileComparison {
  bmi: number;
  bmiCategory: BMICategory;
  goal: HealthGoal;
  metrics: ProfileMetricComparison[];
  overallScore: number;
  summaryNotes: string[];
}

export interface PersonalizedRecommendations {
  userId: string;
  goalPlan: GoalPlan;
  healthComparison: HealthProfileComparison;
  lifestyleSuggestions: LifestyleSuggestion;
  portionGuidance: PortionGuidance;
  topAlternatives: FoodAlternativeComparison[];
  disclaimer: string;
  generatedAt: Date;
}
