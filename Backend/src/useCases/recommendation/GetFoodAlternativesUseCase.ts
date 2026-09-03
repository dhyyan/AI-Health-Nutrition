import { INutritionDatabaseService } from '../../domain/interfaces/services/INutritionDatabaseService';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { FoodAlternativeComparison, FoodAlternativeItem } from '../../domain/entities/Recommendation';
import { HealthGoal } from '../../domain/entities/HealthProfile';

export class GetFoodAlternativesUseCase {
  constructor(
    private nutritionDatabaseService: INutritionDatabaseService,
    private healthProfileRepository?: IHealthProfileRepository
  ) {}

  async execute(foodQueryOrName: string, userId?: string): Promise<FoodAlternativeComparison[]> {
    let goal: HealthGoal = 'weight_loss';
    if (userId && this.healthProfileRepository) {
      const profile = await this.healthProfileRepository.findByUserId(userId);
      if (profile) goal = profile.goal;
    }

    const queryLower = foodQueryOrName.toLowerCase().trim();

    // Standard Curated Alternatives Database mapping
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
        reason: 'Roasted Makhana offers crunchy texture with 99% less saturated fat and 189 fewer calories per 100g.',
        healthBenefit: 'Saves ~190 kcal, protects blood vessels from oxidized trans fats.',
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
        reason: 'Swapping sugary soda for infused sparkling water eliminates 38g of refined sugar.',
        healthBenefit: 'Saves 128 kcal, prevents insulin spikes and dental erosion.',
      },
      {
        keywords: ['fried chicken', 'nuggets', 'deep fried', 'kfc'],
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
        keywords: ['fries', 'french fries', 'fries'],
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
        healthBenefit: 'Saves 172 kcal, supports eye health and immune immunity.',
      },
    ];

    // Find matching curated alternative
    const matched = alternativeMappings.find((m) =>
      m.keywords.some((kw) => queryLower.includes(kw))
    );

    if (matched) {
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
    }

    // Dynamic Database Lookup Fallback
    const searchResults = await this.nutritionDatabaseService.searchFood(foodQueryOrName, 5);
    if (searchResults && searchResults.length > 0) {
      const orig = searchResults[0];
      // Search for a healthier alternative in same or similar category
      const targetCategory = orig.category || 'General Food';
      let altResults = await this.nutritionDatabaseService.searchFood(targetCategory, 10);
      altResults = altResults.filter((f) => f.name.toLowerCase() !== orig.name.toLowerCase());

      if (altResults.length > 0) {
        // Pick food with lower calories or higher protein
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
            reason: `Replaces ${orig.name} with ${bestAlt.name} to optimize your ${goal.replace('_', ' ')} goal.`,
            calorieSavings: Math.max(0, orig.calories - bestAlt.calories),
            proteinDifference: parseFloat((bestAlt.protein - orig.protein).toFixed(1)),
            healthBenefit: `Provides balanced macro distribution tailored to your target health profile.`,
          },
        ];
      }
    }

    // Default fallback if unknown food query
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
        reason: 'Roasted Makhana is a low-fat, high-fiber alternative that controls calorie intake.',
        calorieSavings: 103,
        proteinDifference: 4.7,
        healthBenefit: 'Reduces trans fat intake and boosts mineral intake.',
      },
    ];
  }
}
