import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { MealPlan, DailyScheduleItem, Meal, DietaryPreference } from '../../domain/entities/Meal';
import { HealthGoal } from '../../domain/entities/HealthProfile';

export class GenerateMealPlanUseCase {
  constructor(
    private mealRepository: IMealRepository,
    private mealPlanRepository: IMealPlanRepository,
    private healthProfileRepository: IHealthProfileRepository
  ) {}

  async execute(userId: string): Promise<MealPlan> {
    const profile = await this.healthProfileRepository.findByUserId(userId);

    const goal: HealthGoal = profile?.goal || 'weight_loss';
    const dietaryPref: DietaryPreference =
      (profile?.dietaryPreference as DietaryPreference) || 'Non-Vegetarian';
    const excludedAllergies: string[] = profile?.foodAllergies || [];

    // Query available options for each meal type
    const breakfastOptions = await this.mealRepository.findSuitableMealsForSlot(
      'breakfast',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const lunchOptions = await this.mealRepository.findSuitableMealsForSlot(
      'lunch',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const dinnerOptions = await this.mealRepository.findSuitableMealsForSlot(
      'dinner',
      goal,
      dietaryPref,
      excludedAllergies
    );
    const snackOptions = await this.mealRepository.findSuitableMealsForSlot(
      'snack',
      goal,
      dietaryPref,
      excludedAllergies
    );

    // Fallbacks if database is sparse
    const defaultMeal = (name: string, type: any, cal: number, p: number, c: number, f: number): Meal => ({
      name,
      mealType: type,
      category: 'Balanced Healthy Choice',
      dietaryPreference: dietaryPref,
      suitableGoals: [goal],
      allergens: [],
      calories: cal,
      protein: p,
      carbohydrates: c,
      fat: f,
      fiber: 4,
      servingSize: 250,
      servingUnit: 'g',
      ingredients: ['Whole Foods', 'Fresh Seasonings'],
      instructions: 'Prepare fresh ingredients, cook thoroughly, and serve warm.',
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklySchedule: DailyScheduleItem[] = [];

    for (let i = 0; i < days.length; i++) {
      const dayName = days[i];

      const bMeal =
        breakfastOptions[i % Math.max(1, breakfastOptions.length)] ||
        defaultMeal('Oatmeal with Fresh Berries & Almonds', 'breakfast', 350, 12, 55, 8);

      const lMeal =
        lunchOptions[i % Math.max(1, lunchOptions.length)] ||
        defaultMeal('Grilled Protein & Quinoa Salad Bowl', 'lunch', 550, 38, 50, 14);

      const dMeal =
        dinnerOptions[i % Math.max(1, dinnerOptions.length)] ||
        defaultMeal('Steamed Fish / Tofu with Roasted Veggies', 'dinner', 480, 34, 30, 12);

      const sMeal =
        snackOptions[i % Math.max(1, snackOptions.length)] ||
        defaultMeal('Greek Yogurt with Honey & Walnuts', 'snack', 200, 15, 18, 6);

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
