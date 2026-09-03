import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { GenerateMealPlanUseCase } from './GenerateMealPlanUseCase';
import { MealPlan } from '../../domain/entities/Meal';

export class GetUserMealPlanUseCase {
  constructor(
    private mealPlanRepository: IMealPlanRepository,
    private generateMealPlanUseCase: GenerateMealPlanUseCase
  ) {}

  async execute(userId: string): Promise<MealPlan> {
    const existing = await this.mealPlanRepository.findByUserId(userId);
    if (existing) {
      return existing;
    }
    // If no plan exists, generate one automatically
    return await this.generateMealPlanUseCase.execute(userId);
  }
}
