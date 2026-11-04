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
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';
import { IAiService } from '../../domain/interfaces/services/IAiService';
import { GeminiAiService } from '../../framework/services/ai/GeminiAiService';

export class GeneratePersonalizedRecommendationsUseCase {
  private allergyValidator: IAllergyValidationService;
  private aiService: IAiService;

  constructor(
    private healthProfileRepository: IHealthProfileRepository,
    private foodLogRepository: IFoodLogRepository,
    allergyValidator?: IAllergyValidationService,
    aiService?: IAiService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
    this.aiService = aiService || new GeminiAiService();
  }

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
    const userAllergies: string[] = profile?.foodAllergies || [];
    const dietaryPreference = profile?.dietaryPreference || 'Non-Vegetarian';

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

    // 5. Generate Goal Plan Details (AI Prevention + Backend Enforcement)
    const goalPlan = await this.generateGoalPlan(
      goal,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      userAllergies,
      dietaryPreference
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

    // 8. Generate Portion Guidance tailored to allergies
    const portionGuidance = this.generatePortionGuidance(userAllergies);

    // 9. Generate Top Sample Alternatives tailored to allergies
    const topAlternatives = this.generateTopAlternatives(goal, userAllergies);

    const MEDICAL_DISCLAIMER =
      'This application provides general health and nutrition information for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.';

    const allergenSafetyNotice =
      userAllergies.length > 0
        ? `All recommendations have been verified and strictly exclude: ${userAllergies.join(', ')}.`
        : 'No food allergies specified in medical profile.';

    return {
      userId,
      goalPlan,
      healthComparison,
      lifestyleSuggestions,
      portionGuidance,
      topAlternatives,
      disclaimer: MEDICAL_DISCLAIMER,
      generatedAt: new Date(),
      excludedAllergies: userAllergies,
      allergenSafetyNotice,
    };
  }

  private async generateGoalPlan(
    goal: HealthGoal,
    targetCalories: number,
    targetProtein: number,
    targetCarbs: number,
    targetFat: number,
    userAllergies: string[],
    dietaryPreference: string
  ): Promise<GoalPlan> {
    let title = 'Balanced Maintenance Plan';
    let description =
      'Designed to maintain your current body weight, promote metabolic health, and ensure overall balanced nutrition.';
    let avoidFoods: string[] = [];
    let activityAdvice: string[] = [];

    if (goal === 'weight_loss') {
      title = 'Calorie-Controlled Fat Loss Plan';
      description =
        'Focuses on lower-calorie, high-volume foods that keep you full while maintaining a moderate calorie deficit to promote sustainable weight loss.';
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
      avoidFoods = ['Excessive refined sugar', 'Trans-fat heavy fried foods'];
      activityAdvice = [
        'Maintain a balanced weekly routine: 150 minutes of moderate activity + 2 strength workouts.',
      ];
    }

    // Append allergy notice to avoid list if active allergies exist
    if (userAllergies.length > 0) {
      avoidFoods.unshift(
        `CRITICAL ALLERGY ALERT: Strictly avoid all foods, sauces, broths, and dressings containing ${userAllergies.join(', ')}.`
      );
    }

    // Comprehensive Candidate Food Database by Goal
    const curatedGoalFoods: Record<HealthGoal, RecommendedFoodChoice[]> = {
      weight_loss: [
        {
          name: 'Grilled Chicken Breast',
          category: 'Lean Poultry',
          description: 'High in protein and low in calories; promotes satiety and preserves lean muscle mass.',
          calories: 165,
          protein: 31.0,
          reason: 'High satiety per calorie with minimal fat.',
          tags: ['High Protein', 'Low Calorie'],
        },
        {
          name: 'Steamed Atlantic Cod Fillet',
          category: 'Lean Seafood',
          description: 'Ultra-lean white fish supplying clean amino acids, iodine, and B-vitamins.',
          calories: 105,
          protein: 23.0,
          reason: 'Pure protein with virtually zero carbohydrate and minimal fat.',
          tags: ['Lean Protein', 'Low Calorie'],
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
          name: 'Crisp Red Apple',
          category: 'Fruit',
          description: 'Contains natural fructose and pectin fiber to curb sweet cravings.',
          calories: 52,
          protein: 0.3,
          reason: 'Slowly digested fiber prevents insulin spikes.',
          tags: ['High Fiber', 'Natural Sweet'],
        },
        {
          name: 'Spiced Black Bean & Bell Pepper Salad',
          category: 'Plant Protein & Fiber',
          description: 'Hearty legumes providing sustained satiety, folate, and prebiotic fiber.',
          calories: 140,
          protein: 8.5,
          reason: 'High-volume plant protein that stabilizes glycemic response.',
          tags: ['High Fiber', 'Plant Protein'],
        },
        {
          name: 'Steamed Broccoli Florets with Lemon Olive Drizzle',
          category: 'Cruciferous Vegetables',
          description: 'Rich in Sulforaphane, Vitamin C, and filling dietary fiber.',
          calories: 55,
          protein: 3.7,
          reason: 'Promotes liver detox pathways and suppresses hunger hormones.',
          tags: ['Antioxidant', 'Low Calorie'],
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
          name: 'Oven-Baked Lemon Herb Tofu',
          category: 'Plant Protein',
          description: 'Clean soy curd seasoned with garlic, thyme, and lemon juice.',
          calories: 130,
          protein: 14.0,
          reason: 'Low-calorie complete plant protein promoting fat loss.',
          tags: ['Plant Protein', 'Gluten Free'],
        },
      ],
      weight_gain: [
        {
          name: 'Fresh Hass Avocado',
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
          name: 'Toasted Pumpkin & Sunflower Seeds',
          category: 'Nut-Free Seeds',
          description: 'Mineral-dense superfood rich in zinc, magnesium, and healthy plant fats.',
          calories: 175,
          protein: 8.5,
          reason: 'Calorie-rich seed snack safe from common tree nut and peanut allergies.',
          tags: ['Nut-Free', 'Healthy Fats'],
        },
        {
          name: 'Hearty Chickpea & Coconut Sweet Potato Stew',
          category: 'Complex Carbs & Fats',
          description: 'Warm slow-cooked chickpeas and sweet potato in rich coconut milk broth.',
          calories: 320,
          protein: 11.0,
          reason: 'Energy-dense whole food stew supporting healthy surplus calories.',
          tags: ['Calorie Dense', 'Vegan'],
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
          name: 'Grass-Fed Beef Tenderloin',
          category: 'Red Meat',
          description: 'Rich in bioavailable heme iron, zinc, and muscle-building protein.',
          calories: 250,
          protein: 26.0,
          reason: 'Nutrient-dense animal protein for healthy mass accumulation.',
          tags: ['Iron Rich', 'High Protein'],
        },
        {
          name: 'Steamed Sweet Potato with Olive Oil',
          category: 'Complex Carbohydrates',
          description: 'Slow-burning starchy carbohydrate loaded with beta-carotene.',
          calories: 180,
          protein: 3.0,
          reason: 'Replenishes glycogen stores with gentle, clean digestion.',
          tags: ['Complex Carbs', 'Energy'],
        },
      ],
      muscle_gain: [
        {
          name: 'Grilled Chicken Breast',
          category: 'Poultry',
          description: 'Pure lean protein boasting complete essential amino acids.',
          calories: 165,
          protein: 31.0,
          reason: 'High leucine content directly stimulates muscle protein synthesis.',
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
          name: 'Dal Tadka (Yellow Split Lentils)',
          category: 'Plant Protein',
          description: 'Rich in plant-based amino acids, iron, and folate.',
          calories: 118,
          protein: 6.2,
          reason: 'Great vegetarian protein foundation packed with minerals.',
          tags: ['Plant Protein', 'Folate'],
        },
        {
          name: 'Organic Hemp Hearts & Quinoa Bowl',
          category: 'Complete Plant Protein',
          description: 'Delivers all 9 essential amino acids with magnesium and Omega-3.',
          calories: 220,
          protein: 12.0,
          reason: 'Hypoallergenic complete protein supporting muscle hypertrophy.',
          tags: ['Hypoallergenic', 'Complete Protein'],
        },
        {
          name: 'Grilled Firm Tofu Cutlets',
          category: 'Plant Protein',
          description: 'Pressed firm tofu grilled with tamari and garlic.',
          calories: 150,
          protein: 16.0,
          reason: 'Lean vegetarian protein promoting muscle repair.',
          tags: ['Plant Protein', 'High Protein'],
        },
        {
          name: 'Steamed Edamame Pods',
          category: 'Plant Protein',
          description: 'Young green soybeans rich in isoflavones and complete protein.',
          calories: 120,
          protein: 11.0,
          reason: 'Convenient whole food protein snack for gym recovery.',
          tags: ['Plant Protein', 'Snack'],
        },
        {
          name: 'Pan-Seared Atlantic Salmon',
          category: 'Fish & Seafood',
          description: 'Rich in Omega-3 fatty acids and complete essential amino acids.',
          calories: 206,
          protein: 22.1,
          reason: 'Reduces exercise-induced muscle inflammation.',
          tags: ['Omega-3', 'Muscle Recovery'],
        },
      ],
      maintenance: [
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
          name: 'Rolled Oats with Cinnamon',
          category: 'Complex Carbs',
          description: 'Soluble beta-glucan fiber maintains healthy blood sugar levels.',
          calories: 71,
          protein: 2.5,
          reason: 'Provides smooth, long-lasting morning energy.',
          tags: ['Fiber', 'Heart Health'],
        },
        {
          name: 'Steamed Brown Rice & Lentil Pilaf',
          category: 'Grain & Legume Blend',
          description: 'Classic synergistic blend creating complete plant proteins.',
          calories: 160,
          protein: 6.8,
          reason: 'Balanced sustained energy for everyday metabolic vitality.',
          tags: ['Balanced Macros', 'Fiber'],
        },
        {
          name: 'Fresh Mixed Garden Salad with Olive Oil',
          category: 'Vegetables',
          description: 'Crisp cucumbers, radishes, greens, and extra virgin olive oil.',
          calories: 90,
          protein: 1.5,
          reason: 'Essential micronutrients and polyphenols for longevity.',
          tags: ['Antioxidant', 'Hydration'],
        },
        {
          name: 'Grilled Herb Chicken Tenderloin',
          category: 'Lean Poultry',
          description: 'Tender chicken breast grilled with rosemary and sea salt.',
          calories: 140,
          protein: 26.0,
          reason: 'Clean protein maintaining lean tissue and immune health.',
          tags: ['Lean Protein', 'Balanced'],
        },
      ],
    };

    // LAYER 1: Attempt Gemini AI Generation with strict allergy exclusion prompt
    let aiFoods: RecommendedFoodChoice[] | null = null;
    try {
      aiFoods = await this.aiService.generatePriorityFoods({
        goal,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFat,
        userAllergies,
        dietaryPreference,
      });
    } catch (err) {
      console.warn('Gemini priority foods generation skipped/failed:', err);
    }

    // LAYER 2: Strict Backend Enforcement
    const validatedFoods: RecommendedFoodChoice[] = [];

    // If AI generated foods, run each through backend validation
    if (aiFoods && Array.isArray(aiFoods)) {
      for (const food of aiFoods) {
        const check = this.allergyValidator.validateMeal(food, userAllergies);
        if (check.isValid) {
          validatedFoods.push(food);
        } else {
          console.warn(`[ALLERGY REJECT] AI recommended "${food.name}" was REJECTED: ${check.reason}`);
        }
      }
    }

    // If we need more foods to reach 4 recommendations, draw from curated pool
    if (validatedFoods.length < 4) {
      const pool = curatedGoalFoods[goal] || curatedGoalFoods.maintenance;
      // Filter curated pool strictly through allergyValidator
      const { valid: safePool } = this.allergyValidator.filterMeals(pool, userAllergies);

      for (const safeFood of safePool) {
        if (validatedFoods.length >= 4) break;
        if (!validatedFoods.some((f) => f.name.toLowerCase() === safeFood.name.toLowerCase())) {
          validatedFoods.push(safeFood);
        }
      }
    }

    // Extreme fallback: If somehow pool is exhausted, generate safe fallback
    while (validatedFoods.length < 4) {
      const fallback = this.allergyValidator.getSafeFallbackMeal(
        'snack',
        goal,
        dietaryPreference,
        userAllergies
      );
      validatedFoods.push({
        name: fallback.name,
        category: fallback.category || 'Safe Whole Food',
        description: fallback.instructions || 'Wholesome allergen-free nutritional choice.',
        calories: fallback.calories || 200,
        protein: fallback.protein || 8,
        reason: 'Certified allergen-free wholesome meal tailored to your profile.',
        tags: ['Allergen Free', 'Clean Eating'],
      });
    }

    return {
      goal,
      title,
      description,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      recommendedFoods: validatedFoods.slice(0, 4),
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
        summaryNotes.push('Consider adding a protein-dense food to hit your daily protein goal.');
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

  private generatePortionGuidance(userAllergies: string[]): PortionGuidance {
    // Dynamically adjust protein examples based on user's active allergies
    let proteinExample = '1 Chicken breast, 2 eggs, or 1 piece of fish fillet';
    const isEggAllergic = !this.allergyValidator.checkTextForRestrictedAllergens('egg', userAllergies).isValid;
    const isChickenAllergic = !this.allergyValidator.checkTextForRestrictedAllergens('chicken', userAllergies).isValid;
    const isFishAllergic = !this.allergyValidator.checkTextForRestrictedAllergens('fish', userAllergies).isValid;

    if (isEggAllergic || isChickenAllergic || isFishAllergic) {
      const safeExamples: string[] = [];
      if (!isChickenAllergic) safeExamples.push('1 Chicken breast');
      if (!isFishAllergic) safeExamples.push('1 Salmon / Cod fillet');
      if (!isEggAllergic) safeExamples.push('2 Whole eggs');
      safeExamples.push('1 cup cooked lentils / chickpeas', '1 portion firm tofu / paneer');
      proteinExample = safeExamples.slice(0, 3).join(', ');
    }

    return {
      handGuide: [
        {
          category: 'Proteins',
          handVisual: 'Palm of your Hand',
          portionSize: '1 Palm (~100 - 150g)',
          example: proteinExample,
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
          category: 'Healthy Fats (Oils, Avocado, Seeds)',
          handVisual: 'Thumb Tip',
          portionSize: '1 Thumb (~15 - 30g)',
          example: '1 tbsp olive oil, sunflower seeds, or 1/4 avocado',
        },
      ],
      exactCategoryPortions: [
        {
          category: 'Lean Protein Choices',
          servingAdvice: '1 standard main portion',
          recommendedGram: 150,
          tip: 'Steam, bake, or pan-sear with minimal added oil.',
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
          category: 'Seeds & Healthy Fats',
          servingAdvice: '1 small handful',
          recommendedGram: 28,
          tip: 'Measure portions to control caloric intake.',
        },
      ],
    };
  }

  private generateTopAlternatives(goal: HealthGoal, userAllergies: string[]): FoodAlternativeComparison[] {
    const baseAlternatives: FoodAlternativeComparison[] = [
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
          name: 'Roasted Crunchy Chickpeas',
          calories: 220,
          protein: 10.5,
          carbohydrates: 34.0,
          fat: 4.5,
          sugar: 2.0,
          sodium: 110,
          servingSize: 100,
          servingUnit: 'g',
        },
        reason: 'Swapping potato chips for roasted chickpeas eliminates trans fats and cuts fat by 87% while boosting fiber and protein.',
        calorieSavings: 316,
        proteinDifference: 3.5,
        healthBenefit: 'Zero trans fats, rich in gut-healthy prebiotic fiber and plant minerals.',
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

    // Validate each alternative against userAllergies
    const safeAlternatives: FoodAlternativeComparison[] = [];
    for (const alt of baseAlternatives) {
      const check = this.allergyValidator.validateMeal(
        {
          name: alt.alternativeFood.name,
          ingredients: [alt.alternativeFood.name],
          description: alt.healthBenefit,
        },
        userAllergies
      );
      if (check.isValid) {
        safeAlternatives.push(alt);
      }
    }

    return safeAlternatives;
  }
}
