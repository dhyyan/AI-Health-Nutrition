import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { MealPlan, MealType, Meal } from '../../domain/entities/Meal';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';

export class SwapMealOptionUseCase {
  private allergyValidator: IAllergyValidationService;

  constructor(
    private mealRepository: IMealRepository,
    private mealPlanRepository: IMealPlanRepository,
    private healthProfileRepository?: IHealthProfileRepository,
    allergyValidator?: IAllergyValidationService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
  }

  async execute(
    userId: string,
    dayName: string,
    slotType: MealType,
    replacementMealId?: string
  ): Promise<MealPlan> {
    const mealPlan = await this.mealPlanRepository.findByUserId(userId);
    if (!mealPlan) {
      throw new Error('Meal plan not found. Please generate a meal plan first.');
    }

    // Retrieve latest user allergies from health profile if available
    let userAllergies = mealPlan.excludedAllergies || [];
    if (this.healthProfileRepository) {
      const profile = await this.healthProfileRepository.findByUserId(userId);
      if (profile && Array.isArray(profile.foodAllergies)) {
        userAllergies = profile.foodAllergies;
      }
    }

    const daySchedule = mealPlan.weeklySchedule.find(
      (d) => d.day.toLowerCase() === dayName.toLowerCase()
    );
    if (!daySchedule) {
      throw new Error(`Schedule for ${dayName} not found.`);
    }

    const currentMealId = daySchedule.meals[slotType]?.id;

    let newMeal: Meal | null = null;

    if (replacementMealId) {
      newMeal = await this.mealRepository.findById(replacementMealId);
      if (!newMeal) {
        throw new Error('Replacement meal not found in database.');
      }

      // STRICT LAYER 2 ALLERGY VALIDATION ON REQUESTED REPLACEMENT MEAL
      const validation = this.allergyValidator.validateMeal(newMeal, userAllergies);
      if (!validation.isValid) {
        throw new Error(
          `Cannot swap to "${newMeal.name}": it violates your medical profile by containing restricted allergen (${validation.detectedAllergens.join(', ')}).`
        );
      }
    } else {
      // Pick an alternative suitable for slot that is strictly allergen-free
      const rawOptions = await this.mealRepository.findSuitableMealsForSlot(
        slotType,
        mealPlan.goal,
        mealPlan.dietaryPreference,
        userAllergies
      );

      const validOptions = this.allergyValidator.filterMeals(rawOptions, userAllergies).valid;
      const candidates = validOptions.filter((m) => m.id !== currentMealId);

      if (candidates.length > 0) {
        newMeal = candidates[Math.floor(Math.random() * candidates.length)];
      } else if (validOptions.length > 0) {
        newMeal = validOptions[0];
      } else {
        // Safe allergen-free fallback
        const fallback = this.allergyValidator.getSafeFallbackMeal(
          slotType,
          mealPlan.goal,
          mealPlan.dietaryPreference,
          userAllergies
        );
        newMeal = {
          id: `fallback-${slotType}-${Date.now()}`,
          name: fallback.name,
          mealType: slotType,
          category: fallback.category || 'Nutrient-Dense Wholesome Choice',
          dietaryPreference: mealPlan.dietaryPreference,
          suitableGoals: [mealPlan.goal],
          allergens: [],
          calories: fallback.calories || 350,
          protein: fallback.protein || 15,
          carbohydrates: fallback.carbohydrates || 50,
          fat: fallback.fat || 8,
          fiber: fallback.fiber || 6,
          servingSize: fallback.servingSize || 250,
          servingUnit: fallback.servingUnit || 'g',
          ingredients: fallback.ingredients || ['Wholesome Whole Foods'],
          instructions: fallback.instructions || 'Prepare fresh ingredients thoroughly and serve warm.',
          isVerified: true,
        };
      }
    }

    if (!newMeal) {
      throw new Error('No safe alternative meal found in database for swapping.');
    }

    // Replace meal slot
    daySchedule.meals[slotType] = newMeal;

    // Recalculate totals
    const { breakfast, lunch, dinner, snack } = daySchedule.meals;
    daySchedule.meals.totalCalories =
      breakfast.calories + lunch.calories + dinner.calories + snack.calories;
    daySchedule.meals.totalProtein = parseFloat(
      (breakfast.protein + lunch.protein + dinner.protein + snack.protein).toFixed(1)
    );
    daySchedule.meals.totalCarbs = parseFloat(
      (
        breakfast.carbohydrates +
        lunch.carbohydrates +
        dinner.carbohydrates +
        snack.carbohydrates
      ).toFixed(1)
    );
    daySchedule.meals.totalFat = parseFloat(
      (breakfast.fat + lunch.fat + dinner.fat + snack.fat).toFixed(1)
    );

    // Update excludedAllergies on mealPlan entity to reflect latest state
    mealPlan.excludedAllergies = userAllergies;

    return await this.mealPlanRepository.createOrUpdate(mealPlan);
  }
}
