import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { MealPlan, DailyScheduleItem, Meal, DietaryPreference } from '../../domain/entities/Meal';
import { HealthGoal } from '../../domain/entities/HealthProfile';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';

export class GenerateMealPlanUseCase {
  private allergyValidator: IAllergyValidationService;

  constructor(
    private mealRepository: IMealRepository,
    private mealPlanRepository: IMealPlanRepository,
    private healthProfileRepository: IHealthProfileRepository,
    allergyValidator?: IAllergyValidationService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
  }

  async execute(userId: string): Promise<MealPlan> {
    const profile = await this.healthProfileRepository.findByUserId(userId);

    const goal: HealthGoal = profile?.goal || 'weight_loss';
    const dietaryPref: DietaryPreference =
      (profile?.dietaryPreference as DietaryPreference) || 'Non-Vegetarian';
    const excludedAllergies: string[] = profile?.foodAllergies || [];

    // Query available options for each meal type (filtered for allergens in repository)
    const rawBreakfast = await this.mealRepository.findSuitableMealsForSlot(
      'breakfast',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const rawLunch = await this.mealRepository.findSuitableMealsForSlot(
      'lunch',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const rawDinner = await this.mealRepository.findSuitableMealsForSlot(
      'dinner',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const rawSnack = await this.mealRepository.findSuitableMealsForSlot(
      'snack',
      goal,
      dietaryPref,
      excludedAllergies
    );

    // Double-check with Layer 2 AllergyValidationService to guarantee 100% allergen-free
    const breakfastOptions = this.allergyValidator.filterMeals(rawBreakfast, excludedAllergies).valid;
    const lunchOptions = this.allergyValidator.filterMeals(rawLunch, excludedAllergies).valid;
    const dinnerOptions = this.allergyValidator.filterMeals(rawDinner, excludedAllergies).valid;
    const snackOptions = this.allergyValidator.filterMeals(rawSnack, excludedAllergies).valid;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklySchedule: DailyScheduleItem[] = [];

    const getSafeOrFallbackMeal = (
      options: Meal[],
      index: number,
      slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    ): Meal => {
      if (options.length > 0) {
        const candidate = options[index % options.length];
        const val = this.allergyValidator.validateMeal(candidate, excludedAllergies);
        if (val.isValid) {
          return candidate;
        }
      }

      // Generate a certified allergen-free fallback
      const fallback = this.allergyValidator.getSafeFallbackMeal(
        slot,
        goal,
        dietaryPref,
        excludedAllergies
      );

      return {
        id: `fallback-${slot}-${index}`,
        name: fallback.name,
        mealType: slot,
        category: fallback.category || 'Nutrient-Dense Wholesome Choice',
        dietaryPreference: dietaryPref,
        suitableGoals: [goal],
        allergens: [],
        calories: fallback.calories || 350,
        protein: fallback.protein || 15,
        carbohydrates: fallback.carbohydrates || 50,
        fat: fallback.fat || 8,
        fiber: fallback.fiber || 6,
        servingSize: fallback.servingSize || 250,
        servingUnit: fallback.servingUnit || 'g',
        ingredients: fallback.ingredients || ['Wholesome Allergen-Free Whole Foods'],
        instructions: fallback.instructions || 'Prepare fresh ingredients thoroughly and serve warm.',
        isVerified: true,
      };
    };

    for (let i = 0; i < days.length; i++) {
      const dayName = days[i];

      const bMeal = getSafeOrFallbackMeal(breakfastOptions, i, 'breakfast');
      const lMeal = getSafeOrFallbackMeal(lunchOptions, i, 'lunch');
      const dMeal = getSafeOrFallbackMeal(dinnerOptions, i, 'dinner');
      const sMeal = getSafeOrFallbackMeal(snackOptions, i, 'snack');

      const totalCalories = bMeal.calories + lMeal.calories + dMeal.calories + sMeal.calories;
      const totalProtein = parseFloat((bMeal.protein + lMeal.protein + dMeal.protein + sMeal.protein).toFixed(1));
      const totalCarbs = parseFloat((bMeal.carbohydrates + lMeal.carbohydrates + dMeal.carbohydrates + sMeal.carbohydrates).toFixed(1));
      const totalFat = parseFloat((bMeal.fat + lMeal.fat + dMeal.fat + sMeal.fat).toFixed(1));

      weeklySchedule.push({
        day: dayName,
        meals: {
          breakfast: bMeal,
          lunch: lMeal,
          dinner: dMeal,
          snack: sMeal,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
        },
      });
    }

    // Safety verification check: verify every single meal in the generated schedule
    for (const scheduleItem of weeklySchedule) {
      const slots: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = ['breakfast', 'lunch', 'dinner', 'snack'];
      for (const slot of slots) {
        const meal = scheduleItem.meals[slot];
        const check = this.allergyValidator.validateMeal(meal, excludedAllergies);
        if (!check.isValid) {
          console.warn(`[ALLERGY FIX] Meal "${meal.name}" on ${scheduleItem.day} (${slot}) violated allergy. Replacing.`);
          scheduleItem.meals[slot] = getSafeOrFallbackMeal([], 0, slot);
        }
      }
    }

    const mealPlan: MealPlan = {
      userId,
      startDate: new Date().toISOString().split('T')[0],
      goal,
      dietaryPreference: dietaryPref,
      excludedAllergies,
      weeklySchedule,
      generatedAt: new Date(),
    };

    return await this.mealPlanRepository.createOrUpdate(mealPlan);
  }
}
