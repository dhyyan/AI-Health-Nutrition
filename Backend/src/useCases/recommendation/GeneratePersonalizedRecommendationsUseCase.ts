import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import {
  PersonalizedRecommendations,
  GoalPlan,
  HealthProfileComparison,
  LifestyleSuggestion,
  PortionGuidance,
  RecommendedFoodChoice,
  ProfileMetricComparison,
  FoodAlternativeComparison,
} from '../../domain/entities/Recommendation';
import { HealthProfile, HealthGoal } from '../../domain/entities/HealthProfile';

export class GeneratePersonalizedRecommendationsUseCase {
  constructor(
    private healthProfileRepository: IHealthProfileRepository,
    private foodLogRepository: IFoodLogRepository
  ) {}

  async execute(userId: string): Promise<PersonalizedRecommendations> {
    // 1. Fetch Health Profile
    const profile = await this.healthProfileRepository.findByUserId(userId);

    // Default stats if profile is missing
    const weightKg = profile?.weightKg || 70;
    const heightCm = profile?.heightCm || 170;
    const age = profile?.age || 25;
    const gender = profile?.gender || 'male';
    const goal: HealthGoal = profile?.goal || 'maintenance';
    const activityLevel = profile?.activityLevel || 'moderate';
    const sleepHours = profile?.sleepHours || 7;
    const bmi = profile?.bmi || 22.5;
    const bmiCategory = profile?.bmiCategory || 'Normal';

    // 2. Calculate BMR (Mifflin-St Jeor Equation)
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr = gender === 'female' ? bmr - 161 : bmr + 5;

    // Activity multiplier
    let activityMultiplier = 1.55; // moderate
    if (activityLevel === 'sedentary') activityMultiplier = 1.2;
    if (activityLevel === 'active') activityMultiplier = 1.75;

    const tdee = Math.round(bmr * activityMultiplier);

    // 3. Compute Target Macros based on Goal
    let targetCalories = tdee;
    let targetProtein = Math.round(weightKg * 1.6);
    let targetCarbs = Math.round((tdee * 0.5) / 4);
    let targetFat = Math.round((tdee * 0.25) / 9);

    if (goal === 'weight_loss') {
      targetCalories = Math.max(1200, tdee - 500);
      targetProtein = Math.round(weightKg * 1.8);
      targetCarbs = Math.round((targetCalories * 0.4) / 4);
      targetFat = Math.round((targetCalories * 0.3) / 9);
    } else if (goal === 'weight_gain') {
      targetCalories = tdee + 400;
      targetProtein = Math.round(weightKg * 1.7);
      targetCarbs = Math.round((targetCalories * 0.55) / 4);
      targetFat = Math.round((targetCalories * 0.25) / 9);
    } else if (goal === 'muscle_gain') {
      targetCalories = tdee + 250;
      targetProtein = Math.round(weightKg * 2.2); // Protein priority
      targetCarbs = Math.round((targetCalories * 0.45) / 4);
      targetFat = Math.round((targetCalories * 0.25) / 9);
    }

    // Target Water Intake (35ml per kg body weight + extra for active)
    let targetWaterMl = Math.round(weightKg * 35);
    if (activityLevel === 'active') targetWaterMl += 500;

    // 4. Fetch Today's Food Logs for Intake Comparison
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const todayLogs = await this.foodLogRepository.findByUserIdAndDateRange(userId, startOfDay, endOfDay);

    const actualCalories = Math.round(todayLogs.reduce((acc, log) => acc + log.calories, 0));
    const actualProtein = parseFloat(todayLogs.reduce((acc, log) => acc + log.protein, 0).toFixed(1));
    const actualCarbs = parseFloat(todayLogs.reduce((acc, log) => acc + log.carbohydrates, 0).toFixed(1));
    const actualFat = parseFloat(todayLogs.reduce((acc, log) => acc + log.fat, 0).toFixed(1));

    // 5. Generate Goal Plan Details
    const goalPlan = this.generateGoalPlan(
      goal,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      profile
    );

    // 6. Generate Health Profile Comparison
    const healthComparison = this.generateHealthComparison(
      bmi,
      bmiCategory,
      goal,
      actualCalories,
      targetCalories,
      actualProtein,
      targetProtein,
      actualCarbs,
      targetCarbs,
      actualFat,
      targetFat
    );

    // 7. Generate Lifestyle Suggestions
    const lifestyleSuggestions = this.generateLifestyleSuggestions(
      activityLevel,
      sleepHours,
      targetWaterMl
    );

    // 8. Generate Portion Guidance
    const portionGuidance = this.generatePortionGuidance();

    // 9. Generate Top Sample Alternatives
    const topAlternatives = this.generateTopAlternatives(goal);

    const MEDICAL_DISCLAIMER =
      'This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.';

    return {
      userId,
      goalPlan,
      healthComparison,
      lifestyleSuggestions,
      portionGuidance,
      topAlternatives,
      disclaimer: MEDICAL_DISCLAIMER,
      generatedAt: new Date(),
    };
  }

  private generateGoalPlan(
    goal: HealthGoal,
    targetCalories: number,
    targetProtein: number,
    targetCarbs: number,
    targetFat: number,
    profile: HealthProfile | null
  ): GoalPlan {
    let title = 'Balanced Maintenance Plan';
    let description =
      'Designed to maintain your current body weight, promote metabolic health, and ensure overall balanced nutrition.';
    let recommendedFoods: RecommendedFoodChoice[] = [];
    let avoidFoods: string[] = [];
    let activityAdvice: string[] = [];

    if (goal === 'weight_loss') {
      title = 'Calorie-Controlled Fat Loss Plan';
      description =
        'Focuses on lower-calorie, high-volume foods that keep you full while maintaining a moderate calorie deficit to promote sustainable weight loss.';
      recommendedFoods = [
        {
          name: 'Grilled Chicken Breast',
          category: 'Lean Protein',
          description: 'High in protein and low in calories; promotes satiety and preserves lean muscle mass.',
          calories: 165,
          protein: 31.0,
          reason: 'High satiety per calorie with minimal fat.',
          tags: ['High Protein', 'Low Calorie'],
        },
        {
          name: 'Raw Spinach & Leafy Greens',
          category: 'Vegetables',
          description: 'Extremely nutrient-dense and high in fiber with minimal caloric burden.',
          calories: 23,
          protein: 2.9,
          reason: 'Adds volume and essential vitamins without adding caloric bulk.',
          tags: ['High Fiber', 'Micronutrients'],
        },
        {
          name: 'Plain Low-Fat Greek Yogurt',
          category: 'Dairy',
          description: 'Rich in probiotics and slow-digesting casein protein.',
          calories: 73,
          protein: 10.0,
          reason: 'Great protein-packed snack option that controls hunger pangs.',
          tags: ['Probiotic', 'Lean Protein'],
        },
        {
          name: 'Fresh Red Apple',
          category: 'Fruit',
          description: 'Contains natural fructose and pectin fiber to curb sweet cravings.',
          calories: 52,
          protein: 0.3,
          reason: 'Slowly digested fiber prevents insulin spikes.',
          tags: ['High Fiber', 'Natural Sweet'],
        },
      ];
      avoidFoods = [
        'Sugary Carbonated Beverages & Energy Drinks',
        'Deep-fried snacks & Potato Chips',
        'Refined bakery goods, Pastries & White Bread',
        'High-sugar processed sauces and salad dressings',
      ];
      activityAdvice = [
        'Perform 30–45 minutes of moderate aerobic cardio (brisk walking, cycling, or jogging) 4–5 times a week.',
        'Aim for 8,000 – 10,000 daily steps to elevate Non-Exercise Activity Thermogenesis (NEAT).',
        'Include 2–3 sessions of moderate resistance training to preserve lean muscle tissue.',
      ];
    } else if (goal === 'weight_gain') {
      title = 'Nutrient-Dense Healthy Weight Gain Plan';
      description =
        'Prioritizes energy-dense, wholesome meal choices to help you achieve a healthy caloric surplus without digestive distress.';
      recommendedFoods = [
        {
          name: 'Avocado (Hass)',
          category: 'Healthy Fats',
          description: 'Loaded with heart-healthy monounsaturated fats, potassium, and dietary fiber.',
          calories: 160,
          protein: 2.0,
          reason: 'Concentrated clean calories that expand energy intake easily.',
          tags: ['Healthy Fats', 'High Calorie'],
        },
        {
          name: 'Raw Almonds & Walnuts',
          category: 'Nuts & Seeds',
          description: 'Nutrient powerhouse rich in healthy fats, Vitamin E, and minerals.',
          calories: 164,
          protein: 6.0,
          reason: 'Easy calorie-dense snacking between main meals.',
          tags: ['Nutrient Dense', 'Snack'],
        },
        {
          name: 'Paneer Tikka (Grilled Cottage Cheese)',
          category: 'Proteins & Dairy',
          description: 'High in calcium, protein, and healthy milk fats.',
          calories: 240,
          protein: 14.5,
          reason: 'Sustained energy and protein for healthy mass build-up.',
          tags: ['Protein Rich', 'Calorie Dense'],
        },
        {
          name: 'Pan-Seared Atlantic Salmon',
          category: 'Seafood',
          description: 'Abundant in Omega-3 fatty acids and complete essential amino acids.',
          calories: 206,
          protein: 22.1,
          reason: 'Clean high-calorie protein source boosting cardiovascular health.',
          tags: ['Omega-3', 'High Protein'],
        },
      ];
      avoidFoods = [
        'Empty-calorie sugary snacks that lack micronutrients',
        'Skipping meals or long fasting windows',
        'Excessive low-calorie drinks right before meals',
      ];
      activityAdvice = [
        'Focus on progressive resistance training 3–4 days a week to channel extra calories into muscle mass.',
        'Keep cardio sessions light (15–20 minutes) to avoid burning excessive calories needed for weight gain.',
        'Ensure adequate rest and recovery between heavy workouts.',
      ];
    } else if (goal === 'muscle_gain') {
      title = 'High-Protein Hypertrophy Diet';
      description =
        'Optimized to maximize muscle protein synthesis (MPS) with protein-rich food options and balanced complex carbohydrates.';
      recommendedFoods = [
        {
          name: 'Grilled Chicken Breast',
          category: 'Poultry',
          description: 'Pure lean protein boasting complete essential amino acids.',
          calories: 165,
          protein: 31.0,
          reason: 'High leucine content directly stimulates muscle synthesis.',
          tags: ['High Protein', 'Lean Muscle'],
        },
        {
          name: 'Whole Eggs (Boiled)',
          category: 'Proteins',
          description: 'Highest bioavailable protein rating with essential healthy fats and choline.',
          calories: 78,
          protein: 6.3,
          reason: 'Complete amino acid profile for muscle recovery.',
          tags: ['Bioavailable Protein', 'Choline'],
        },
        {
          name: 'Steamed Brown Rice',
          category: 'Complex Carbs',
          description: 'Complex carbohydrate source supplying sustained glycogen replenishment.',
          calories: 112,
          protein: 2.6,
          reason: 'Replenishes muscle glycogen for intense training workouts.',
          tags: ['Glycogen Support', 'Complex Carbs'],
        },
        {
          name: 'Dal Tadka (Yellow Lentils)',
          category: 'Plant Protein',
          description: 'Rich in plant-based amino acids, iron, and folate.',
          calories: 118,
          protein: 6.2,
          reason: 'Great vegetarian protein foundation packed with minerals.',
          tags: ['Plant Protein', 'Folate'],
        },
      ];
      avoidFoods = [
        'Alcohol, which severely impairs muscle protein synthesis and recovery',
        'Ultra-processed fast foods high in trans fats',
        'Low-protein meal replacements',
      ];
      activityAdvice = [
        'Engage in hyper-targeted strength and resistance training 4–5 days per week.',
        'Prioritize major compound movements (Squats, Deadlifts, Bench Press, Rows).',
        'Consume 20–30g protein within 1–2 hours after intense training.',
      ];
    } else {
      recommendedFoods = [
        {
          name: 'Atlantic Salmon Fillet',
          category: 'Seafood',
          description: 'Provides clean protein and essential Omega-3 fatty acids.',
          calories: 206,
          protein: 22.1,
          reason: 'Supports cognitive and cardiovascular endurance.',
          tags: ['Healthy Fats', 'Protein'],
        },
        {
          name: 'Rolled Oats',
          category: 'Complex Carbs',
          description: 'Soluble beta-glucan fiber maintains healthy blood sugar levels.',
          calories: 71,
          protein: 2.5,
          reason: 'Provides smooth, long-lasting morning energy.',
          tags: ['Fiber', 'Heart Health'],
        },
      ];
      avoidFoods = ['Excessive refined sugar', 'Trans-fat heavy fried foods'];
      activityAdvice = [
        'Maintain a balanced weekly routine: 150 minutes of moderate activity + 2 strength workouts.',
      ];
    }

    return {
      goal,
      title,
      description,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      recommendedFoods,
      avoidFoods,
      activityAdvice,
    };
  }

  private generateHealthComparison(
    bmi: number,
    bmiCategory: any,
    goal: HealthGoal,
    actualCalories: number,
    targetCalories: number,
    actualProtein: number,
    targetProtein: number,
    actualCarbs: number,
    targetCarbs: number,
    actualFat: number,
    targetFat: number
  ): HealthProfileComparison {
    const calcMetric = (
      name: string,
      unit: string,
      actual: number,
      target: number
    ): ProfileMetricComparison => {
      const percentage = target > 0 ? Math.min(200, Math.round((actual / target) * 100)) : 0;
      let status: 'under' | 'optimal' | 'over' = 'optimal';
      let message = 'On track with daily recommendation';

      if (percentage < 85) {
        status = 'under';
        message = `Currently ${target - actual} ${unit} below your target goal.`;
      } else if (percentage > 115) {
        status = 'over';
        message = `Exceeded target by ${actual - target} ${unit}.`;
      } else {
        status = 'optimal';
        message = 'Well balanced within target range!';
      }

      return { name, unit, actual, target, percentage, status, message };
    };

    const metrics: ProfileMetricComparison[] = [
      calcMetric('Calories', 'kcal', actualCalories, targetCalories),
      calcMetric('Protein', 'g', actualProtein, targetProtein),
      calcMetric('Carbohydrates', 'g', actualCarbs, targetCarbs),
      calcMetric('Fats', 'g', actualFat, targetFat),
    ];

    // Compute Overall Score (0 - 100) based on target alignment
    const scores = metrics.map((m) => {
      const diff = Math.abs(100 - m.percentage);
      return Math.max(0, 100 - diff);
    });

    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    const summaryNotes: string[] = [];
    if (actualCalories === 0) {
      summaryNotes.push('No food logged today yet. Log your meals to view real-time progress comparisons!');
    } else {
      if (metrics[0].status === 'under' && goal === 'weight_gain') {
        summaryNotes.push('You are below your caloric surplus target for healthy weight gain.');
      } else if (metrics[0].status === 'over' && goal === 'weight_loss') {
        summaryNotes.push('Caloric intake exceeded the daily weight loss budget.');
      } else {
        summaryNotes.push('Your daily calorie intake is aligned with your active health profile.');
      }

      if (metrics[1].status === 'under') {
        summaryNotes.push('Consider adding a protein-dense food (like Greek yogurt or chicken) to hit your protein goal.');
      }
    }

    return {
      bmi,
      bmiCategory,
      goal,
      metrics,
      overallScore,
      summaryNotes,
    };
  }

  private generateLifestyleSuggestions(
    activityLevel: string,
    sleepHours: number,
    targetWaterMl: number
  ): LifestyleSuggestion {
    let activityAdvice =
      'Engage in at least 30 minutes of light-to-moderate movement daily, such as walking or stretching.';
    if (activityLevel === 'sedentary') {
      activityAdvice =
        'Break up long periods of sitting every hour with a 3-minute walk or light movement. Target at least 6,000 steps daily.';
    } else if (activityLevel === 'active') {
      activityAdvice =
        'Maintain your active lifestyle! Ensure proper dynamic warm-ups and post-workout recovery to prevent fatigue.';
    }

    let sleepAdvice = 'Your sleep duration of 7-9 hours is optimal for cellular repair and mental clarity.';
    if (sleepHours < 7) {
      sleepAdvice = `You reported ${sleepHours} hrs of sleep. Aim for 7–8 hours of restorative sleep to regulate hunger hormones (ghrelin and leptin).`;
    }

    return {
      activity: {
        level: activityLevel,
        advice: activityAdvice,
        recommendedMinutes: activityLevel === 'active' ? 45 : 30,
      },
      hydration: {
        targetMl: targetWaterMl,
        advice: `Drink approx ${(targetWaterMl / 1000).toFixed(1)} Liters of water throughout the day. Sip regularly rather than chugging large volumes at once.`,
      },
      sleep: {
        targetHours: 8,
        currentHours: sleepHours,
        advice: sleepAdvice,
      },
      eatingHabits: [
        'Practice mindful eating: chew food thoroughly and avoid screens during meals.',
        'Space meals every 3.5 to 4 hours to maintain stable blood sugar levels.',
        'Finish your final meal at least 2.5 hours before bedtime for optimal sleep quality.',
        'Prioritize fiber-rich whole foods to support gut health and smooth digestion.',
      ],
      disclaimer:
        'These lifestyle suggestions are general wellness recommendations and do not replace personalized professional advice.',
    };
  }

  private generatePortionGuidance(): PortionGuidance {
    return {
      handGuide: [
        {
          category: 'Proteins (Meat, Eggs, Tofu, Paneer)',
          handVisual: 'Palm of your Hand',
          portionSize: '1 Palm (~100 - 150g)',
          example: '1 Chicken breast, 2 eggs, or 1 piece of fish fillet',
        },
        {
          category: 'Vegetables & Leafy Greens',
          handVisual: 'Clenched Fist',
          portionSize: '1 Fist (~150 - 200g)',
          example: 'Broccoli, spinach, green beans, or mixed salad',
        },
        {
          category: 'Carbohydrates (Rice, Oats, Pasta, Dal)',
          handVisual: 'Cupped Hand',
          portionSize: '1 Cupped Hand (~100 - 150g cooked)',
          example: 'Brown rice, quinoa, cooked dal, or sweet potato',
        },
        {
          category: 'Healthy Fats (Nuts, Oils, Butter, Avocado)',
          handVisual: 'Thumb Tip',
          portionSize: '1 Thumb (~15 - 30g)',
          example: '1 tbsp olive oil, a small handful of almonds, or 1/4 avocado',
        },
      ],
      exactCategoryPortions: [
        {
          category: 'Lean Poultry & Fish',
          servingAdvice: '1 standard main portion',
          recommendedGram: 150,
          tip: 'Pan-seared or grilled with minimal added butter.',
        },
        {
          category: 'Cooked Whole Grains',
          servingAdvice: '1 cup cooked serving',
          recommendedGram: 195,
          tip: 'Choose brown rice, quinoa, or whole-wheat options for high fiber.',
        },
        {
          category: 'Fresh Fruits',
          servingAdvice: '1 medium fruit piece',
          recommendedGram: 150,
          tip: 'Best eaten whole rather than juiced to retain dietary fiber.',
        },
        {
          category: 'Nuts & Seeds',
          servingAdvice: '1 small handful',
          recommendedGram: 28,
          tip: 'Great midday energy booster; measure portions to control caloric intake.',
        },
      ],
    };
  }

  private generateTopAlternatives(goal: HealthGoal): FoodAlternativeComparison[] {
    return [
      {
        originalFood: {
          name: 'Deep Fried Potato Chips',
          calories: 536,
          protein: 7.0,
          carbohydrates: 53.0,
          fat: 35.0,
          sugar: 0.5,
          sodium: 525,
          servingSize: 100,
          servingUnit: 'g',
        },
        alternativeFood: {
          name: 'Roasted Makhana (Fox Nuts)',
          calories: 347,
          protein: 9.7,
          carbohydrates: 64.0,
          fat: 0.1,
          sugar: 0.2,
          sodium: 120,
          servingSize: 100,
          servingUnit: 'g',
        },
        reason: 'Swapping potato chips for roasted makhana eliminates trans fats and significantly reduces calories while boosting fiber.',
        calorieSavings: 189,
        proteinDifference: 2.7,
        healthBenefit: '99% lower in saturated fat & rich in anti-aging antioxidants.',
      },
      {
        originalFood: {
          name: 'Sugary Carbonated Cola',
          calories: 140,
          protein: 0,
          carbohydrates: 39,
          fat: 0,
          sugar: 39,
          sodium: 45,
          servingSize: 330,
          servingUnit: 'ml',
        },
        alternativeFood: {
          name: 'Sparkling Lemon Water with Mint',
          calories: 12,
          protein: 0.1,
          carbohydrates: 3.2,
          fat: 0,
          sugar: 0.8,
          sodium: 5,
          servingSize: 330,
          servingUnit: 'ml',
        },
        reason: 'Replaces 39g of high-fructose corn syrup with natural vitamin C and hydration without glucose spikes.',
        calorieSavings: 128,
        proteinDifference: 0.1,
        healthBenefit: 'Zero refined sugars, prevents insulin resistance and dental decay.',
      },
    ];
  }
}
