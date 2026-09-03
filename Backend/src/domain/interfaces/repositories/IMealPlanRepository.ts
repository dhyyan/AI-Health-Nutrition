import { MealPlan } from '../../entities/Meal';

export interface IMealPlanRepository {
  createOrUpdate(mealPlan: MealPlan): Promise<MealPlan>;
  findByUserId(userId: string): Promise<MealPlan | null>;
  deleteByUserId(userId: string): Promise<boolean>;
}
