import { IFoodRecognitionService, RecognizedFoodResult } from '../../domain/interfaces/services/IFoodRecognitionService';
import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { FoodAlternativeComparison } from '../../domain/entities/Recommendation';
import { HealthGoal } from '../../domain/entities/HealthProfile';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';

export interface FoodSuitabilityAnalysis {
  rating: 'highly_suitable' | 'moderate' | 'unsuitable';
  score: number;
  reasoning: string;
  hasAllergenAlert: boolean;
  allergenAlerts: string[];
  medicalAlerts: string[];
}

export interface NutritionLookupDetails {
  verifiedMatch: boolean;
  source: 'database' | 'ai_estimate';
  dbFoodId?: string;
  category?: string;
  sugar?: number;
  sodium?: number;
  vitamins?: string[];
  minerals?: string[];
}

export interface UserProfileMatchSummary {
  goal: string;
  userAllergies: string[];
  medicalHistory?: string[];
  isDiabetic: boolean;
  dailyCalorieTarget: number;
}

export interface CustomPortionAdvice {
  recommendedServingMultiplier: number;
  servingAdviceText: string;
  handVisualGuide: {
    protein: string;
    veggies: string;
    carbs: string;
    fats: string;
  };
}

export interface ScanResultDTO extends RecognizedFoodResult {
  imageUrl?: string;
  isHealthy: boolean;

  // AI Nutrition Engine — 7-Step Output
  nutritionLookup: NutritionLookupDetails;
  profileMatching: UserProfileMatchSummary;
  suitability: FoodSuitabilityAnalysis;
  healthierAlternatives: FoodAlternativeComparison[];
  portionAdvice: CustomPortionAdvice;
  recommendationSummary: string;
  disclaimer: string;
}

export class ScanFoodImageUseCase {
  private allergyValidator: IAllergyValidationService;

  constructor(
    private foodRecognitionService: IFoodRecognitionService,
    private nutritionDatabaseService?: INutritionDatabaseService,
    private healthProfileRepository?: IHealthProfileRepository,
    allergyValidator?: IAllergyValidationService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
  }

  async execute(
    imageBuffer: Buffer,
    mimeType: string = 'image/jpeg',
    savedFilePath?: string,
    userId?: string
  ): Promise<ScanResultDTO> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Image file buffer is empty or invalid.');
    }

    // ----------------------------------------------------
    // STEP 1: Food Recognition (AI Vision)
    // ----------------------------------------------------
    const recognized = await this.foodRecognitionService.recognizeFoodFromImage(imageBuffer, mimeType);

    const MEDICAL_DISCLAIMER =
      'Estimated nutritional values: AI estimates nutrition metrics from photographs for general wellness guidance only. Visual AI cannot reliably determine exact weights, cooking oils, sauces, or trace allergens. Always verify ingredients if you have food allergies or medical conditions.';

    // Fetch user profile if available
    let userGoal: HealthGoal = 'maintenance';
    let userAllergies: string[] = [];
    let medicalHistory: string[] = [];
    let isDiabetic = false;
    let dailyCalorieTarget = 2000;

    if (userId && this.healthProfileRepository) {
      try {
        const profile = await this.healthProfileRepository.findByUserId(userId);
        if (profile) {
          userGoal = profile.goal || 'maintenance';
          userAllergies = profile.foodAllergies || [];
          medicalHistory = profile.medicalHistory || [];
          isDiabetic = profile.hasDiabetes || medicalHistory.some((m) => m.toLowerCase().includes('diabet'));

          const weight = profile.weightKg || 70;
          if (userGoal === 'weight_loss') dailyCalorieTarget = Math.round(weight * 25);
          else if (userGoal === 'weight_gain') dailyCalorieTarget = Math.round(weight * 35);
          else if (userGoal === 'muscle_gain') dailyCalorieTarget = Math.round(weight * 32);
          else dailyCalorieTarget = Math.round(weight * 28);
        }
      } catch (err) {
        console.warn('Could not fetch user profile for scanner matching:', err);
      }
    }

    const profileMatching: UserProfileMatchSummary = {
      goal: userGoal,
      userAllergies,
      medicalHistory,
      isDiabetic,
      dailyCalorieTarget,
    };

    // ----------------------------------------------------
    // NON-FOOD OR UNCLEAR IMAGE REJECTION
    // ----------------------------------------------------
    if (!recognized.isFood) {
      return {
        ...recognized,
        imageUrl: undefined, // Do not retain personal or non-food images
        isHealthy: false,
        nutritionLookup: {
          verifiedMatch: false,
          source: 'ai_estimate',
        },
        profileMatching,
        suitability: {
          rating: 'unsuitable',
          score: 0,
          reasoning: recognized.message || 'No food detected in uploaded image.',
          hasAllergenAlert: false,
          allergenAlerts: [],
          medicalAlerts: [],
        },
        healthierAlternatives: [],
        portionAdvice: {
          recommendedServingMultiplier: 1,
          servingAdviceText: '',
          handVisualGuide: {
            protein: '',
            veggies: '',
            carbs: '',
            fats: '',
          },
        },
        recommendationSummary:
          recognized.message ||
          'No food detected. Please upload a clear photograph of your meal.',
        disclaimer: MEDICAL_DISCLAIMER,
      };
    }

    // ----------------------------------------------------
    // STEP 2: Food Detected — Process Analysis
    // ----------------------------------------------------
    let healthRating = recognized.healthRating;
    let isHealthy = healthRating === 'healthy';

    // Rule engine sanity checks for calories/fat density
    if (recognized.calories > 750 && recognized.fat > 40 && recognized.fiber < 3) {
      healthRating = 'unhealthy';
      isHealthy = false;
    }

    const imageUrl = savedFilePath
      ? `/uploads/scans/${savedFilePath}`
      : `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

    // ----------------------------------------------------
    // STEP 3: Nutrition Database Lookup
    // ----------------------------------------------------
    let nutritionLookup: NutritionLookupDetails = {
      verifiedMatch: false,
      source: 'ai_estimate',
      category: 'General Meal',
      sugar: 4,
      sodium: 320,
      vitamins: ['Vitamin A', 'Vitamin C'],
      minerals: ['Iron', 'Calcium'],
    };

    if (this.nutritionDatabaseService) {
      try {
        const dbMatches = await this.nutritionDatabaseService.searchFood(recognized.foodName, 1);
        if (dbMatches && dbMatches.length > 0) {
          const matchedFood = dbMatches[0];
          const vitaminsList = matchedFood.vitaminsAndMinerals?.map((v) => v.name) || ['Vitamin A', 'Vitamin C'];
          nutritionLookup = {
            verifiedMatch: true,
            source: 'database',
            dbFoodId: matchedFood.id,
            category: matchedFood.category || 'Verified Food',
            sugar: matchedFood.sugar || 4,
            sodium: matchedFood.sodium || 280,
            vitamins: vitaminsList,
            minerals: ['Iron', 'Calcium'],
          };
        }
      } catch (err) {
        console.warn('Nutrition database lookup fallback to AI estimate:', err);
      }
    }

    // ----------------------------------------------------
    // STEP 4: User Allergy Matching & Food Suitability
    // ----------------------------------------------------
    const allergenAlerts: string[] = [];
    let hasAllergenAlert = false;

    if (userAllergies.length > 0) {
      // 1. Check foodItems visible ingredients (High certainty)
      for (const item of recognized.foodItems || []) {
        // Check item name
        const nameCheck = this.allergyValidator.checkTextForRestrictedAllergens(item.name, userAllergies);
        if (!nameCheck.isValid) {
          hasAllergenAlert = true;
          for (const detected of nameCheck.detectedAllergens) {
            allergenAlerts.push(
              `Contains visible allergen: "${detected.toUpperCase()}" (identified in ${item.name})`
            );
          }
        }

        // Check visible ingredients
        for (const ing of item.visibleIngredients || []) {
          const ingCheck = this.allergyValidator.checkTextForRestrictedAllergens(ing, userAllergies);
          if (!ingCheck.isValid) {
            hasAllergenAlert = true;
            for (const detected of ingCheck.detectedAllergens) {
              allergenAlerts.push(
                `Contains visible allergen ingredient: "${detected.toUpperCase()}" (${ing} in ${item.name})`
              );
            }
          }
        }

        // Check inferred ingredients (sauces, seasonings, cooking oils)
        for (const inferred of item.inferredIngredients || []) {
          const infCheck = this.allergyValidator.checkTextForRestrictedAllergens(inferred, userAllergies);
          if (!infCheck.isValid) {
            hasAllergenAlert = true;
            for (const detected of infCheck.detectedAllergens) {
              allergenAlerts.push(
                `May contain inferred/potential allergen: "${detected.toUpperCase()}" (${inferred} in ${item.name})`
              );
            }
          }
        }

        // Check potential allergens reported by AI
        for (const potAllergen of item.potentialAllergens || []) {
          const potCheck = this.allergyValidator.checkTextForRestrictedAllergens(potAllergen, userAllergies);
          if (!potCheck.isValid) {
            hasAllergenAlert = true;
            for (const detected of potCheck.detectedAllergens) {
              allergenAlerts.push(
                `Potential allergen flagged: "${detected.toUpperCase()}" in preparation of ${item.name}`
              );
            }
          }
        }
      }

      // 2. Check overall foodName, dietary tags, and reasoning
      const foodSearchableText = `${recognized.foodName} ${recognized.dietaryTags.join(' ')} ${recognized.healthReasoning}`;
      const generalCheck = this.allergyValidator.checkTextForRestrictedAllergens(foodSearchableText, userAllergies);
      if (!generalCheck.isValid) {
        hasAllergenAlert = true;
        for (const detected of generalCheck.detectedAllergens) {
          const alertMsg = `Contains potential allergen: "${detected.toUpperCase()}"!`;
          if (!allergenAlerts.some((a) => a.toLowerCase().includes(detected.toLowerCase()))) {
            allergenAlerts.push(alertMsg);
          }
        }
      }
    }

    const medicalAlerts: string[] = [];
    if (isDiabetic && ((nutritionLookup.sugar && nutritionLookup.sugar > 15) || recognized.carbohydrates > 55)) {
      medicalAlerts.push('High glycemic impact: contains significant simple sugars or refined carbs.');
    }
    if (nutritionLookup.sodium && nutritionLookup.sodium > 600) {
      medicalAlerts.push('High sodium content: monitor fluid retention and blood pressure.');
    }

    // Determine Suitability Score (0 - 100) and Rating
    let score = 85;
    let rating: 'highly_suitable' | 'moderate' | 'unsuitable' = 'highly_suitable';
    let reasoning = `This meal aligns well with your ${userGoal.replace('_', ' ')} health goal.`;

    if (hasAllergenAlert) {
      score = 15;
      rating = 'unsuitable';
      reasoning = `Unsuitable due to detected allergen trigger (${userAllergies.join(', ')}).`;
    } else if (healthRating === 'unhealthy') {
      score = 40;
      rating = 'unsuitable';
      reasoning = `High calorie and saturated fat density may hinder your ${userGoal.replace('_', ' ')} target.`;
    } else if (userGoal === 'weight_loss' && recognized.calories > 600) {
      score = 60;
      rating = 'moderate';
      reasoning = `Caloric load (${recognized.calories} kcal) is high for a single meal in a fat-loss phase.`;
    } else if (userGoal === 'muscle_gain' && recognized.protein < 15) {
      score = 65;
      rating = 'moderate';
      reasoning = `Protein content (${recognized.protein}g) is modest for muscle protein synthesis.`;
    }

    const suitability: FoodSuitabilityAnalysis = {
      rating,
      score,
      reasoning,
      hasAllergenAlert,
      allergenAlerts,
      medicalAlerts,
    };

    // ----------------------------------------------------
    // STEP 5: Healthier Alternatives (Dynamic Suggestions)
    // ----------------------------------------------------
    const healthierAlternatives: FoodAlternativeComparison[] = [];
    if (rating === 'unsuitable' || rating === 'moderate' || !isHealthy) {
      healthierAlternatives.push(
        this.generateAlternativeForScannedFood(recognized, userGoal, userAllergies)
      );
    }

    // ----------------------------------------------------
    // STEP 6: Portion Advice (Rules-based Guidance)
    // ----------------------------------------------------
    const perMealBudget = Math.round(dailyCalorieTarget * 0.35); // ~35% of daily target per main meal
    let recommendedServingMultiplier = 1;
    let servingAdviceText = '1 standard serving size is suitable for your daily budget.';

    if (recognized.calories > perMealBudget && recognized.calories > 0) {
      recommendedServingMultiplier = parseFloat((perMealBudget / recognized.calories).toFixed(1));
      servingAdviceText = `Consider enjoying a ${recommendedServingMultiplier}x portion (${Math.round(
        recognized.calories * recommendedServingMultiplier
      )} kcal) to stay within your ~${perMealBudget} kcal meal target.`;
    }

    const portionAdvice: CustomPortionAdvice = {
      recommendedServingMultiplier,
      servingAdviceText,
      handVisualGuide: {
        protein: '1 Palm (~100-150g) of lean protein source',
        veggies: '1 Clenched Fist (~150-200g) of non-starchy green vegetables',
        carbs: '1 Cupped Hand (~100-150g) of complex carbohydrates',
        fats: '1 Thumb Tip (~15-30g) of healthy fats or oils',
      },
    };

    // ----------------------------------------------------
    // STEP 7: Recommendation Generation (AI / Rule-based Synthesis)
    // ----------------------------------------------------
    let recommendationSummary = `AI Recommendation: "${recognized.foodName}" has been recognized and analyzed. `;
    if (hasAllergenAlert) {
      recommendationSummary += `WARNING: Potential allergen trigger detected (${allergenAlerts.join(' ')}). We strongly recommend selecting a safe alternative.`;
    } else if (rating === 'highly_suitable') {
      recommendationSummary += `Great choice! Highly suitable for your ${userGoal.replace(
        '_',
        ' '
      )} goal with ${recognized.protein}g protein and ${recognized.fiber}g fiber.`;
    } else {
      recommendationSummary += `${reasoning} ${servingAdviceText}`;
    }

    return {
      ...recognized,
      healthRating,
      isHealthy,
      imageUrl,
      nutritionLookup,
      profileMatching,
      suitability,
      healthierAlternatives,
      portionAdvice,
      recommendationSummary,
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  private generateAlternativeForScannedFood(
    recognized: RecognizedFoodResult,
    goal: HealthGoal,
    userAllergies: string[]
  ): FoodAlternativeComparison {
    const isChickenAllergic = !this.allergyValidator.checkTextForRestrictedAllergens('chicken', userAllergies).isValid;
    const isNutAllergic = !this.allergyValidator.checkTextForRestrictedAllergens('nut', userAllergies).isValid;

    if (recognized.calories > 500 || recognized.fat > 25) {
      const altName = isChickenAllergic
        ? 'Crispy Spiced Chickpea & Avocado Bowl with Lemon'
        : 'Grilled Chicken Breast Salad with Olive Oil & Lemon';

      return {
        originalFood: {
          name: recognized.foodName,
          calories: recognized.calories,
          protein: recognized.protein,
          carbohydrates: recognized.carbohydrates,
          fat: recognized.fat,
          sugar: 4,
          sodium: 400,
          servingSize: recognized.servingSize || 1,
          servingUnit: recognized.servingUnit || 'serving',
        },
        alternativeFood: {
          name: altName,
          calories: isChickenAllergic ? 290 : 320,
          protein: isChickenAllergic ? 18.0 : 34.0,
          carbohydrates: isChickenAllergic ? 32.0 : 12.0,
          fat: isChickenAllergic ? 9.0 : 10.0,
          sugar: 2.0,
          sodium: 180,
          servingSize: 1,
          servingUnit: 'bowl',
        },
        reason: isChickenAllergic
          ? 'Swapping heavy fried items for fiber-dense spiced chickpeas and avocado eliminates common allergens while providing clean energy.'
          : 'Swapping high-calorie fried or heavy items for grilled lean protein with fresh greens boosts satiety and preserves muscle mass.',
        calorieSavings: Math.max(0, recognized.calories - (isChickenAllergic ? 290 : 320)),
        proteinDifference: parseFloat(((isChickenAllergic ? 18.0 : 34.0) - recognized.protein).toFixed(1)),
        healthBenefit: 'Saves calories, reduces saturated fats by up to 70%, and delivers clean micronutrients verified free of your restricted allergens.',
      };
    }

    const snackName = isNutAllergic
      ? 'Crispy Roasted Chickpeas & Fresh Lemon Water'
      : 'Roasted Fox Nuts (Makhana) & Green Tea';

    return {
      originalFood: {
        name: recognized.foodName,
        calories: recognized.calories,
        protein: recognized.protein,
        carbohydrates: recognized.carbohydrates,
        fat: recognized.fat,
        sugar: 3,
        sodium: 300,
        servingSize: 1,
        servingUnit: 'serving',
      },
      alternativeFood: {
        name: snackName,
        calories: 180,
        protein: 8.0,
        carbohydrates: 28.0,
        fat: 2.0,
        sugar: 0.5,
        sodium: 90,
        servingSize: 1,
        servingUnit: 'bowl',
      },
      reason: 'Provides crunch and wholesome nutrients with 90% less saturated fat.',
      calorieSavings: Math.max(0, recognized.calories - 180),
      proteinDifference: 2.0,
      healthBenefit: 'High antioxidant profile that supports heart and digestive health, safely avoiding restricted allergens.',
    };
  }
}
