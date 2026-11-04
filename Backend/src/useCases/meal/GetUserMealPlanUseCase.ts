import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { IHealthProfileRepository } from '../../domain/interfaces/repositories/IHealthProfileRepository';
import { GenerateMealPlanUseCase } from './GenerateMealPlanUseCase';
import { MealPlan } from '../../domain/entities/Meal';
import { IAllergyValidationService } from '../../domain/interfaces/services/IAllergyValidationService';
import { AllergyValidationService } from '../../framework/services/allergy/AllergyValidationService';

export class GetUserMealPlanUseCase {
  private allergyValidator: IAllergyValidationService;

  constructor(
    private mealPlanRepository: IMealPlanRepository,
    private generateMealPlanUseCase: GenerateMealPlanUseCase,
    private healthProfileRepository?: IHealthProfileRepository,
    allergyValidator?: IAllergyValidationService
  ) {
    this.allergyValidator = allergyValidator || new AllergyValidationService();
  }

  async execute(userId: string): Promise<MealPlan> {
    const existing = await this.mealPlanRepository.findByUserId(userId);

    // If healthProfileRepository is provided, verify against user's latest saved allergies
    if (this.healthProfileRepository) {
      const profile = await this.healthProfileRepository.findByUserId(userId);
      const currentAllergies = profile?.foodAllergies || [];

      if (existing) {
        // 1. Check if the saved allergy list has changed (user added or removed allergies)
        const savedAllergies = existing.excludedAllergies || [];
        const hasAllergyListChanged =
          savedAllergies.length !== currentAllergies.length ||
          !savedAllergies.every((a) => currentAllergies.includes(a)) ||
          !currentAllergies.every((a) => savedAllergies.includes(a));

        if (hasAllergyListChanged) {
          console.log(`[MEAL PLAN REGENERATE] User ${userId} modified food allergies. Regenerating fresh meal plan.`);
          return await this.generateMealPlanUseCase.execute(userId);
        }

        // 2. Validate every single meal in the weekly schedule against current allergies
        let hasViolation = false;
        if (Array.isArray(existing.weeklySchedule)) {
          for (const dayItem of existing.weeklySchedule) {
            const slots = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
            for (const slot of slots) {
              const meal = dayItem.meals?.[slot];
              if (meal) {
                const check = this.allergyValidator.validateMeal(meal, currentAllergies);
                if (!check.isValid) {
                  hasViolation = true;
                  console.warn(
                    `[MEAL PLAN REGENERATE] Existing meal plan violates current allergy (${check.reason}). Regenerating.`
                  );
                  break;
                }
              }
            }
            if (hasViolation) break;
          }
        }

        if (hasViolation) {
          return await this.generateMealPlanUseCase.execute(userId);
        }

        return existing;
      }
    } else if (existing) {
      return existing;
    }

    // If no plan exists, generate one automatically
    return await this.generateMealPlanUseCase.execute(userId);
  }
}
