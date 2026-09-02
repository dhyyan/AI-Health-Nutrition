import { FoodItem } from '../../entities/FoodItem';

export interface INutritionDatabaseService {
  searchFood(query: string, limit?: number): Promise<FoodItem[]>;
  getFoodById(id: string): Promise<FoodItem | null>;
  getFoodByName(name: string): Promise<FoodItem | null>;
}
