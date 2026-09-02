import { FoodItem } from '../../entities/FoodItem';

export interface IFoodRepository {
  search(query: string, category?: string, limit?: number): Promise<FoodItem[]>;
  findById(id: string): Promise<FoodItem | null>;
  findByName(name: string): Promise<FoodItem | null>;
  create(food: FoodItem): Promise<FoodItem>;
  count(): Promise<number>;
}
