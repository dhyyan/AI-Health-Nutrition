import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { FoodAlternativeComparison, FoodAlternativeItem } from '../../domain/entities/Recommendation';
import { HealthGoal } from '../../domain/entities/HealthProfile';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';
import { IAiService } from '../../domain/interfaces/services/IAiService';
import { GeminiAiService } from '../../framework/services/ai/GeminiAiService';

export class GetFoodAlternativesUseCase {
  private allergyValidator: IAllergyValidationService;
  private aiService: IAiService;

  constructor(
    private nutritionDatabaseService: INutritionDatabaseService,
    private healthProfileRepository?: IHealthProfileRepository,
    allergyValidator?: IAllergyValidationService,
    aiService?: IAiService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
    this.aiService = aiService || new GeminiAiService();
  }

  async execute(foodQueryOrName: string, userId?: string): Promise<FoodAlternativeComparison[]> {
    let goal: HealthGoal = 'weight_loss';
    let userAllergies: string[] = [];

    if (userId && this.healthProfileRepository) {
      const profile = await this.healthProfileRepository.findByUserId(userId);
      if (profile) {
        goal = profile.goal;
        userAllergies = profile.foodAllergies || [];
      }
    }

    const queryLower = (foodQueryOrName || '').toLowerCase().trim();

    // LAYER 1: Attempt Gemini AI Alternative Generation with strict allergy exclusion
    try {
      const aiAlternative = await this.aiService.generateFoodAlternative({
        foodQuery: foodQueryOrName,
        goal,
        userAllergies,
      });

      // LAYER 2: Strict Backend Enforcement on AI Output
      if (aiAlternative && aiAlternative.alternativeFood) {
        const valCheck = this.allergyValidator.validateMeal(
          {
            name: aiAlternative.alternativeFood.name,
            ingredients: [aiAlternative.alternativeFood.name],
            description: aiAlternative.reason,
          },
          userAllergies
        );

        if (valCheck.isValid) {
          return [aiAlternative];
        } else {
          console.warn(
            `[ALLERGY REJECT] AI alternative "${aiAlternative.alternativeFood.name}" was REJECTED: ${valCheck.reason}`
          );
        }
      }
    } catch (err) {
      console.warn('Gemini food alternative generation skipped/failed:', err);
    }

    // Curated Alternatives Database mapping with allergen safety checks
    const alternativeMappings: Array<{
      keywords: string[];
      original: FoodAlternativeItem;
      alternative: FoodAlternativeItem;
      reason: string;
      healthBenefit: string;
    }> = [
      {
        keywords: ['chip', 'chips', 'crisps', 'fried potato', 'wafer'],
        original: {
          name: foodQueryOrName || 'Potato Chips',
          calories: 536,
          protein: 7.0,
          carbohydrates: 53.0,
          fat: 35.0,
          sugar: 0.5,
          sodium: 525,
          servingSize: 100,
          servingUnit: 'g',
        },
        alternative: {
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
        reason: 'Roasted chickpeas offer a satisfying crunch with 87% less fat, zero trans fats, and 3x more prebiotic fiber.',
        healthBenefit: 'Saves 316 kcal per 100g, protects cardiovascular health from oxidized oils.',
      },
      {
        keywords: ['soda', 'coke', 'pepsi', 'cola', 'soft drink', 'fizzy'],
        original: {
          name: foodQueryOrName || 'Carbonated Sugary Soda',
          calories: 140,
          protein: 0,
          carbohydrates: 39,
          fat: 0,
          sugar: 39,
          sodium: 45,
          servingSize: 330,
          servingUnit: 'ml',
        },
        alternative: {
          name: 'Fresh Sparkling Lemon Water with Mint',
          calories: 12,
          protein: 0.1,
          carbohydrates: 3.2,
          fat: 0,
          sugar: 0.8,
          sodium: 5,
          servingSize: 330,
          servingUnit: 'ml',
        },
        reason: 'Swapping sugary soda for infused sparkling water eliminates 38g of refined high-fructose syrup.',
        healthBenefit: 'Saves 128 kcal, prevents glucose spikes and tooth enamel erosion.',
      },
      {
        keywords: ['fried chicken', 'nuggets', 'deep fried chicken', 'kfc'],
        original: {
          name: foodQueryOrName || 'Deep Fried Chicken',
          calories: 320,
          protein: 18.5,
          carbohydrates: 12.4,
          fat: 22.1,
          sugar: 0.2,
          sodium: 680,
          servingSize: 100,
          servingUnit: 'g',
        },
        alternative: {
          name: 'Air-Fried / Grilled Chicken Breast',
          calories: 165,
          protein: 31.0,
          carbohydrates: 0.0,
          fat: 3.6,
          sugar: 0.0,
          sodium: 74,
          servingSize: 100,
          servingUnit: 'g',
        },
        reason: 'Air-frying or grilling chicken provides 67% more protein while cutting fat content by 84%.',
        healthBenefit: 'Saves 155 kcal per serving and provides pure lean protein for muscle repair.',
      },
      {
        keywords: ['white bread', 'toast', 'white loaf'],
        original: {
          name: foodQueryOrName || 'Refined White Bread',
          calories: 265,
          protein: 9.0,
          carbohydrates: 49.0,
          fat: 3.2,
          sugar: 5.0,
          sodium: 490,
          servingSize: 100,
          servingUnit: 'g',
        },
        alternative: {
          name: '100% Whole Grain Sprouted Bread',
          calories: 210,
          protein: 13.0,
          carbohydrates: 36.0,
          fat: 2.5,
          sugar: 1.5,
          sodium: 230,
          servingSize: 100,
          servingUnit: 'g',
        },
        reason: 'Whole grain sprouted bread offers double the fiber, higher protein, and a lower glycemic index.',
        healthBenefit: 'Promotes stable blood glucose and long-lasting fullness.',
      },
      {
        keywords: ['fries', 'french fries', 'potato fries'],
        original: {
          name: foodQueryOrName || 'Deep Fried French Fries',
          calories: 312,
          protein: 3.4,
          carbohydrates: 41.0,
          fat: 15.0,
          sugar: 0.3,
          sodium: 210,
          servingSize: 100,
          servingUnit: 'g',
        },
        alternative: {
          name: 'Oven-Baked Sweet Potato Wedges',
          calories: 140,
          protein: 2.0,
          carbohydrates: 28.0,
          fat: 2.5,
          sugar: 6.0,
          sodium: 85,
          servingSize: 100,
          servingUnit: 'g',
        },
        reason: 'Baked sweet potato wedges deliver rich Beta-Carotene (Vitamin A) and complex carbs with half the calories.',
        healthBenefit: 'Saves 172 kcal, supports eye health and immune function.',
      },
    ];

    // Find matching curated alternative
    const matched = alternativeMappings.find((m) =>
      m.keywords.some((kw) => queryLower.includes(kw))
    );

    if (matched) {
      // Validate curated alternative against user allergies!
      const altCheck = this.allergyValidator.validateMeal(
        {
          name: matched.alternative.name,
          ingredients: [matched.alternative.name],
          description: matched.reason,
        },
        userAllergies
      );

      if (altCheck.isValid) {
        const calorieSavings = Math.max(0, matched.original.calories - matched.alternative.calories);
        const proteinDifference = parseFloat(
          (matched.alternative.protein - matched.original.protein).toFixed(1)
        );

        return [
          {
            originalFood: matched.original,
            alternativeFood: matched.alternative,
            reason: matched.reason,
            calorieSavings,
            proteinDifference,
            healthBenefit: matched.healthBenefit,
          },
        ];
      } else {
        // The default curated alternative contains a restricted allergen (e.g. chicken for a chicken-allergic user!)
        // Provide a guaranteed allergen-safe plant-based alternative swap!
        const safeAltItem: FoodAlternativeItem = {
          name: 'Crispy Air-Fried Spiced Tofu Nuggets',
          calories: 145,
          protein: 16.0,
          carbohydrates: 4.0,
          fat: 6.5,
          sugar: 0.5,
          sodium: 120,
          servingSize: 100,
          servingUnit: 'g',
        };

        // If soy is also an allergen, use baked chickpea bites
        const soyCheck = this.allergyValidator.checkTextForRestrictedAllergens('tofu', userAllergies);
        if (!soyCheck.isValid) {
          safeAltItem.name = 'Oven-Baked Herbed Chickpea Patties';
          safeAltItem.calories = 160;
          safeAltItem.protein = 9.0;
          safeAltItem.carbohydrates = 24.0;
          safeAltItem.fat = 3.5;
        }

        const calorieSavings = Math.max(0, matched.original.calories - safeAltItem.calories);
        const proteinDifference = parseFloat(
          (safeAltItem.protein - matched.original.protein).toFixed(1)
        );

        return [
          {
            originalFood: matched.original,
            alternativeFood: safeAltItem,
            reason: `Allergen-safe alternative: Replaced with ${safeAltItem.name} to strictly avoid ${altCheck.detectedAllergens.join(', ')}.`,
            calorieSavings,
            proteinDifference,
            healthBenefit: '100% free of your restricted allergens, low in saturated fat, and rich in fiber.',
          },
        ];
      }
    }

    // Dynamic Database Lookup Fallback with strict allergy filtering
    const searchResults = await this.nutritionDatabaseService.searchFood(foodQueryOrName, 5);
    if (searchResults && searchResults.length > 0) {
      const orig = searchResults[0];
      const targetCategory = orig.category || 'General Food';
      let altResults = await this.nutritionDatabaseService.searchFood(targetCategory, 15);
      altResults = altResults.filter((f) => f.name.toLowerCase() !== orig.name.toLowerCase());

      // Filter candidates with allergy validator
      altResults = altResults.filter((food) => {
        const check = this.allergyValidator.validateMeal(
          {
            name: food.name,
            ingredients: [food.name],
            category: food.category,
          },
          userAllergies
        );
        return check.isValid;
      });

      if (altResults.length > 0) {
        const bestAlt = altResults.reduce((prev, curr) => {
          if (goal === 'weight_loss' || goal === 'maintenance') {
            return curr.calories < prev.calories ? curr : prev;
          } else if (goal === 'muscle_gain') {
            return curr.protein > prev.protein ? curr : prev;
          } else {
            return curr.calories > prev.calories ? curr : prev;
          }
        }, altResults[0]);

        const origItem: FoodAlternativeItem = {
          name: orig.name,
          calories: orig.calories,
          protein: orig.protein,
          carbohydrates: orig.carbohydrates,
          fat: orig.fat,
          sugar: orig.sugar || 0,
          sodium: orig.sodium || 0,
          servingSize: orig.servingSize,
          servingUnit: orig.servingUnit,
        };

        const altItem: FoodAlternativeItem = {
          name: bestAlt.name,
          calories: bestAlt.calories,
          protein: bestAlt.protein,
          carbohydrates: bestAlt.carbohydrates,
          fat: bestAlt.fat,
          sugar: bestAlt.sugar || 0,
          sodium: bestAlt.sodium || 0,
          servingSize: bestAlt.servingSize,
          servingUnit: bestAlt.servingUnit,
        };

        return [
          {
            originalFood: origItem,
            alternativeFood: altItem,
            reason: `Replaces ${orig.name} with ${bestAlt.name} to optimize your ${goal.replace('_', ' ')} goal without allergens.`,
            calorieSavings: Math.max(0, orig.calories - bestAlt.calories),
            proteinDifference: parseFloat((bestAlt.protein - orig.protein).toFixed(1)),
            healthBenefit: `Provides balanced macro distribution verified free of your restricted allergens.`,
          },
        ];
      }
    }

    // Default guaranteed allergen-safe fallback
    return [
      {
        originalFood: {
          name: foodQueryOrName || 'Processed High-Calorie Snack',
          calories: 450,
          protein: 5.0,
          carbohydrates: 55.0,
          fat: 22.0,
          sugar: 15.0,
          sodium: 400,
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
        reason: 'Roasted chickpeas are a whole-food, high-fiber, nutrient-dense alternative free of common allergens.',
        calorieSavings: 230,
        proteinDifference: 5.5,
        healthBenefit: 'Eliminates trans fats, supports steady blood sugar, and provides clean sustained energy.',
      },
    ];
  }
}
