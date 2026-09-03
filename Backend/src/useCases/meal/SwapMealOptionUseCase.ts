import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { MealPlan, MealType, Meal } from '../../domain/entities/Meal';

export class SwapMealOptionUseCase {
  constructor(
    private mealRepository: IMealRepository,
    private mealPlanRepository: IMealPlanRepository
  ) {}

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
    } else {
      // Pick a random alternative suitable for slot
      const options = await this.mealRepository.findSuitableMealsForSlot(
        slotType,
        mealPlan.goal,
        mealPlan.dietaryPreference,
        mealPlan.excludedAllergies
      );

      const candidates = options.filter((m) => m.id !== currentMealId);
      if (candidates.length > 0) {
        newMeal = candidates[Math.floor(Math.random() * candidates.length)];
      } else if (options.length > 0) {
        newMeal = options[0];
      }
    }

    if (!newMeal) {
      throw new Error('No alternative suitable meal found in database for swapping.');
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

    return await this.mealPlanRepository.createOrUpdate(mealPlan);
  }
}
