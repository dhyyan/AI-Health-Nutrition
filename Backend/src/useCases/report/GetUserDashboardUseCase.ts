import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { UserDashboardDTO, DashboardRecommendationItem } from '../../domain/interfaces/DTOs/HealthReportDTOs';
import { GeneratePersonalizedRecommendationsUseCase } from '../recommendation/GeneratePersonalizedRecommendationsUseCase';
import { FoodLog } from '../../domain/entities/FoodLog';

export class GetUserDashboardUseCase {
  constructor(
    private userRepository: IUserRepository,
    private healthProfileRepository: IHealthProfileRepository,
    private foodLogRepository: IFoodLogRepository,
    private waterIntakeRepository: IWaterIntakeRepository,
    private weightBmiLogRepository: IWeightBmiLogRepository,
    private generateRecommendationsUseCase: GeneratePersonalizedRecommendationsUseCase
  ) {}

  async execute(userId: string, dateStr?: string): Promise<UserDashboardDTO> {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const formattedDate = targetDate.toISOString().split('T')[0];

    const startDate = new Date(formattedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedDate);
    endDate.setHours(23, 59, 59, 999);

    // 1. Fetch User details & Health Profile
    const user = await this.userRepository.findById(userId);
    const healthProfile = await this.healthProfileRepository.findByUserId(userId);
    const latestWeightLog = await this.weightBmiLogRepository.getLatest(userId);

    const weightKg = latestWeightLog?.weightKg || healthProfile?.weightKg || 70;
    const heightCm = healthProfile?.heightCm || 170;
    const bmi = latestWeightLog?.bmi || healthProfile?.bmi || 22.5;
    const bmiCategory = latestWeightLog?.bmiCategory || healthProfile?.bmiCategory || 'Normal';
    const age = healthProfile?.age || 25;
    const gender = healthProfile?.gender || 'male';
    const goal = healthProfile?.goal || 'maintenance';
    const activityLevel = healthProfile?.activityLevel || 'moderate';

    // Calculate Ideal Weight Range (BMI 18.5 - 24.9)
    const heightMeters = heightCm / 100;
    const minIdealWeight = Math.round(18.5 * heightMeters * heightMeters);
    const maxIdealWeight = Math.round(24.9 * heightMeters * heightMeters);
    const idealWeightRange = `${minIdealWeight} kg - ${maxIdealWeight} kg`;

    // 2. Compute Calorie & Macro Targets (Mifflin-St Jeor)
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr = gender === 'female' ? bmr - 161 : bmr + 5;

    let activityMultiplier = 1.55;
    if (activityLevel === 'sedentary') activityMultiplier = 1.2;
    if (activityLevel === 'active') activityMultiplier = 1.75;

    const tdee = Math.round(bmr * activityMultiplier);

    let caloriesTarget = tdee;
    let proteinTarget = Math.round(weightKg * 1.6);
    let carbsTarget = Math.round((tdee * 0.5) / 4);
    let fatTarget = Math.round((tdee * 0.25) / 9);
    let fiberTarget = gender === 'female' ? 25 : 38;

    if (goal === 'weight_loss') {
      caloriesTarget = Math.max(1200, tdee - 500);
      proteinTarget = Math.round(weightKg * 1.8);
      carbsTarget = Math.round((caloriesTarget * 0.4) / 4);
      fatTarget = Math.round((caloriesTarget * 0.3) / 9);
    } else if (goal === 'weight_gain') {
      caloriesTarget = tdee + 400;
      proteinTarget = Math.round(weightKg * 1.7);
      carbsTarget = Math.round((caloriesTarget * 0.55) / 4);
      fatTarget = Math.round((caloriesTarget * 0.25) / 9);
    } else if (goal === 'muscle_gain') {
      caloriesTarget = tdee + 250;
      proteinTarget = Math.round(weightKg * 2.2);
      carbsTarget = Math.round((caloriesTarget * 0.45) / 4);
      fatTarget = Math.round((caloriesTarget * 0.25) / 9);
    }

    // 3. Fetch Food Logs for Date & Recent Food History
    const foodLogsForDate = await this.foodLogRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    const recentFoodLogs = await this.foodLogRepository.findByUserId(userId, 10);

    let caloriesConsumed = 0;
    let proteinConsumed = 0;
    let carbsConsumed = 0;
    let fatConsumed = 0;
    let fiberConsumed = 0;

    const mealTypesLogged = new Set<string>();

    foodLogsForDate.forEach((log) => {
      caloriesConsumed += log.calories || 0;
      proteinConsumed += log.protein || 0;
      carbsConsumed += log.carbohydrates || 0;
      fatConsumed += log.fat || 0;
      fiberConsumed += log.fiber || 0;
      if (log.mealType) mealTypesLogged.add(log.mealType.toLowerCase());
    });

    caloriesConsumed = Math.round(caloriesConsumed);
    proteinConsumed = Math.round(proteinConsumed * 10) / 10;
    carbsConsumed = Math.round(carbsConsumed * 10) / 10;
    fatConsumed = Math.round(fatConsumed * 10) / 10;
    fiberConsumed = Math.round(fiberConsumed * 10) / 10;

    const caloriesRemaining = Math.max(0, caloriesTarget - caloriesConsumed);

    // 4. Fetch Water Intake
    const waterSummary = await this.waterIntakeRepository.getDailySummary(userId, formattedDate);
    const waterGoalMl = (await this.waterIntakeRepository.getWaterGoal(userId)) || Math.round(weightKg * 35);
    const waterConsumedMl = waterSummary?.totalConsumedMl || 0;
    const waterProgressPercentage = Math.min(100, Math.round((waterConsumedMl / waterGoalMl) * 100));

    // 5. Calculate Health Score (0 - 100)
    // A. Nutrition Score (max 35)
    let nutritionScore = 15;
    if (caloriesConsumed > 0) {
      const calRatio = caloriesConsumed / caloriesTarget;
      if (calRatio >= 0.9 && calRatio <= 1.1) nutritionScore = 35;
      else if (calRatio >= 0.75 && calRatio <= 1.25) nutritionScore = 28;
      else if (calRatio >= 0.5 && calRatio <= 1.5) nutritionScore = 20;
      else nutritionScore = 12;
    }

    // B. Water Score (max 25)
    const waterScore = Math.min(25, Math.round((waterConsumedMl / waterGoalMl) * 25));

    // C. BMI Score (max 25)
    let bmiScore = 25;
    if (bmiCategory === 'Normal') bmiScore = 25;
    else if (bmiCategory === 'Overweight') bmiScore = 20;
    else if (bmiCategory === 'Underweight') bmiScore = 18;
    else bmiScore = 14; // Obese or others

    // D. Consistency Score (max 15)
    let consistencyScore = 0;
    const uniqueMealsCount = mealTypesLogged.size;
    if (uniqueMealsCount >= 3) consistencyScore = 15;
    else if (uniqueMealsCount === 2) consistencyScore = 10;
    else if (uniqueMealsCount === 1) consistencyScore = 5;

    const totalHealthScore = Math.min(100, nutritionScore + waterScore + bmiScore + consistencyScore);
    let statusLabel = 'Good';
    if (totalHealthScore >= 85) statusLabel = 'Excellent';
    else if (totalHealthScore >= 70) statusLabel = 'Good';
    else if (totalHealthScore >= 50) statusLabel = 'Fair';
    else statusLabel = 'Needs Attention';

    // 6. Macro Distribution Ratios
    const totalMacroEnergy = proteinConsumed * 4 + carbsConsumed * 4 + fatConsumed * 9;
    const proteinRatio = totalMacroEnergy > 0 ? Math.round(((proteinConsumed * 4) / totalMacroEnergy) * 100) : 30;
    const carbsRatio = totalMacroEnergy > 0 ? Math.round(((carbsConsumed * 4) / totalMacroEnergy) * 100) : 50;
    const fatRatio = totalMacroEnergy > 0 ? Math.round(((fatConsumed * 9) / totalMacroEnergy) * 100) : 20;

    // 7. Generate Personalized AI Suggestions
    let fullRecommendations;
    try {
      fullRecommendations = await this.generateRecommendationsUseCase.execute(userId);
    } catch {
      fullRecommendations = null;
    }

    const aiRecommendations: DashboardRecommendationItem[] = [];

    // Hydration suggestion
    if (waterProgressPercentage < 80) {
      aiRecommendations.push({
        id: 'rec-water-1',
        category: 'water',
        title: 'Hydration Target',
        suggestion: `You have reached ${waterProgressPercentage}% of your hydration goal. Drink ${Math.max(
          250,
          waterGoalMl - waterConsumedMl
        )} ml more water today to stay hydrated.`,
        tag: 'Hydration Alert',
        impactLevel: 'high',
      });
    } else {
      aiRecommendations.push({
        id: 'rec-water-2',
        category: 'water',
        title: 'Great Hydration!',
        suggestion: `Awesome work! You are maintaining proper fluid balance today at ${waterProgressPercentage}% of target.`,
        tag: 'Optimal Hydration',
        impactLevel: 'medium',
      });
    }

    // Nutrition & Protein suggestion
    if (proteinConsumed < proteinTarget * 0.7) {
      aiRecommendations.push({
        id: 'rec-prot-1',
        category: 'nutrition',
        title: 'Boost Protein Intake',
        suggestion: `Your protein is currently ${Math.round(
          proteinTarget - proteinConsumed
        )}g below your target of ${proteinTarget}g. Add chicken breast, eggs, tofu, or Greek yogurt to your next meal.`,
        tag: 'Muscle & Repair',
        impactLevel: 'high',
      });
    } else {
      aiRecommendations.push({
        id: 'rec-prot-2',
        category: 'nutrition',
        title: 'Calorie Alignment',
        suggestion: `Targeting ${caloriesTarget} kcal for your ${goal.replace('_', ' ')} goal. Keep meals balanced with lean proteins and complex carbohydrates.`,
        tag: 'Goal Alignment',
        impactLevel: 'medium',
      });
    }

    // Lifestyle/Activity suggestion
    if (fullRecommendations?.lifestyleSuggestions?.activity?.advice) {
      aiRecommendations.push({
        id: 'rec-act-1',
        category: 'activity',
        title: 'Daily Movement Advice',
        suggestion: fullRecommendations.lifestyleSuggestions.activity.advice,
        tag: 'Active Lifestyle',
        impactLevel: 'general',
      });
    }

    const MEDICAL_DISCLAIMER =
      'This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.';

    return {
      date: formattedDate,
      userProfile: {
        name: user?.name || 'Health Enthusiast',
        email: user?.email || '',
        avatarUrl: user?.profilePicture || undefined,
        goal,
        weightKg,
        heightCm,
        bmi,
        bmiCategory,
        idealWeightRange,
      },
      dailySummary: {
        caloriesConsumed,
        caloriesTarget,
        caloriesRemaining,
        waterConsumedMl,
        waterGoalMl,
        waterProgressPercentage,
      },
      healthScore: {
        totalScore: totalHealthScore,
        statusLabel,
        nutritionScore,
        waterScore,
        bmiScore,
        consistencyScore,
      },
      macros: {
        calories: {
          consumed: caloriesConsumed,
          target: caloriesTarget,
          remaining: caloriesRemaining,
          unit: 'kcal',
          percentage: caloriesTarget > 0 ? Math.min(100, Math.round((caloriesConsumed / caloriesTarget) * 100)) : 0,
        },
        protein: {
          consumed: proteinConsumed,
          target: proteinTarget,
          unit: 'g',
          percentage: proteinTarget > 0 ? Math.min(100, Math.round((proteinConsumed / proteinTarget) * 100)) : 0,
        },
        carbohydrates: {
          consumed: carbsConsumed,
          target: carbsTarget,
          unit: 'g',
          percentage: carbsTarget > 0 ? Math.min(100, Math.round((carbsConsumed / carbsTarget) * 100)) : 0,
        },
        fat: {
          consumed: fatConsumed,
          target: fatTarget,
          unit: 'g',
          percentage: fatTarget > 0 ? Math.min(100, Math.round((fatConsumed / fatTarget) * 100)) : 0,
        },
        fiber: {
          consumed: fiberConsumed,
          target: fiberTarget,
          unit: 'g',
          percentage: fiberTarget > 0 ? Math.min(100, Math.round((fiberConsumed / fiberTarget) * 100)) : 0,
        },
        macroPercentages: {
          proteinRatio,
          carbsRatio,
          fatRatio,
        },
      },
      aiRecommendations,
      recentFoodHistory: recentFoodLogs.map((log: FoodLog) => ({
        id: log.id!,
        foodName: log.foodName,
        mealType: log.mealType,
        servingSize: log.servingSize,
        servingUnit: log.servingUnit,
        calories: log.calories,
        protein: log.protein,
        carbohydrates: log.carbohydrates,
        fat: log.fat,
        isAiScanned: !!log.foodItemId,
        createdAt: log.createdAt,
      })),
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }
}
