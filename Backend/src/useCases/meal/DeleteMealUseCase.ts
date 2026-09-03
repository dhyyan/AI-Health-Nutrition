import { IMealRepository } from '../../domain/interfaces/repositories/IMealRepository';

export class DeleteMealUseCase {
  constructor(private mealRepository: IMealRepository) {}

  async execute(id: string): Promise<boolean> {
    const existing = await this.mealRepository.findById(id);
    if (!existing) {
      throw new Error('Meal item not found');
    }
    return await this.mealRepository.delete(id);
  }
}
