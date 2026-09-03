import { IMealRepository, MealFilterOptions } from '../../domain/interfaces/repositories/IMealRepository';
import { Meal } from '../../domain/entities/Meal';

export class GetAllMealsUseCase {
  constructor(private mealRepository: IMealRepository) {}

  async execute(options?: MealFilterOptions): Promise<Meal[]> {
    return await this.mealRepository.findAll(options);
  }
}
