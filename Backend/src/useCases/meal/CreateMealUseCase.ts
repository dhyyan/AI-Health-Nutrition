import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { Meal, CreateMealDTO } from '../../domain/entities/Meal';

export class CreateMealUseCase {
  constructor(private mealRepository: IMealRepository) {}

  async execute(mealData: CreateMealDTO): Promise<Meal> {
    if (!mealData.name || !mealData.name.trim()) {
      throw new Error('Meal name is required');
    }
    if (!mealData.mealType) {
      throw new Error('Meal type (breakfast, lunch, dinner, snack) is required');
    }
    if (!mealData.suitableGoals || mealData.suitableGoals.length === 0) {
      throw new Error('At least one suitable health goal must be selected');
    }

    return await this.mealRepository.create({
      ...mealData,
      allergens: mealData.allergens || [],
      fiber: mealData.fiber || 0,
      ingredients: mealData.ingredients || [],
    });
  }
}
