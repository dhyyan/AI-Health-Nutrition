import { Meal, CreateMealDTO, UpdateMealDTO, MealType, DietaryPreference } from '../../entities/Meal';
import { HealthGoal } from '../../entities/HealthProfile';

export interface MealFilterOptions {
  mealType?: MealType;
  goal?: HealthGoal;
  dietaryPreference?: DietaryPreference;
  excludeAllergens?: string[];
  search?: string;
  limit?: number;
}

export interface IMealRepository {
  create(meal: CreateMealDTO): Promise<Meal>;
  findById(id: string): Promise<Meal | null>;
  findAll(options?: MealFilterOptions): Promise<Meal[]>;
  update(id: string, meal: UpdateMealDTO): Promise<Meal | null>;
  delete(id: string): Promise<boolean>;
  findSuitableMealsForSlot(
    mealType: MealType,
    goal: HealthGoal,
    dietaryPreference: DietaryPreference,
    excludeAllergens: string[]
  ): Promise<Meal[]>;
}
