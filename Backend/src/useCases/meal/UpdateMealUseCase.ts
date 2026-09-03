import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';
import { Meal, UpdateMealDTO } from '../../domain/entities/Meal';

export class UpdateMealUseCase {
  constructor(private mealRepository: IMealRepository) {}

  async execute(id: string, mealData: UpdateMealDTO): Promise<Meal | null> {
    const existing = await this.mealRepository.findById(id);
    if (!existing) {
      throw new Error('Meal item not found');
    }
    return await this.mealRepository.update(id, mealData);
  }
}
