import { IFoodRepository } from '../../domain/interfaces/repositories/IFoodRepository';
import { FoodItem, FoodItemProps } from '../../domain/entities/FoodItem';
import { FoodModel, IFoodDocument } from '../../framework/database/models/FoodModel';

export class MongoFoodRepository implements IFoodRepository {
  private mapDocumentToEntity(doc: IFoodDocument): FoodItem {
    const props: FoodItemProps = {
      id: doc._id.toString(),
      name: doc.name,
      category: doc.category,
      brand: doc.brand,
      servingSize: doc.servingSize,
      servingUnit: doc.servingUnit,
      servingOptions: doc.servingOptions,
      calories: doc.calories,
      protein: doc.protein,
      carbohydrates: doc.carbohydrates,
      fat: doc.fat,
      fiber: doc.fiber,
      sugar: doc.sugar,
      sodium: doc.sodium,
      vitaminsAndMinerals: doc.vitaminsAndMinerals,
      dataSource: doc.dataSource,
      imageUrl: doc.imageUrl,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return new FoodItem(props);
  }

  async search(query: string, category?: string, limit: number = 20): Promise<FoodItem[]> {
    const filter: any = {};

    if (query && query.trim() !== '') {
      filter.$or = [
        { name: { $regex: query.trim(), $options: 'i' } },
        { category: { $regex: query.trim(), $options: 'i' } },
        { brand: { $regex: query.trim(), $options: 'i' } },
      ];
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: category.trim(), $options: 'i' };
    }

    const docs = await FoodModel.find(filter).limit(limit).exec();
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findById(id: string): Promise<FoodItem | null> {
    const doc = await FoodModel.findById(id).exec();
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findByName(name: string): Promise<FoodItem | null> {
    const doc = await FoodModel.findOne({
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
    }).exec();
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async create(food: FoodItem): Promise<FoodItem> {
    const created = await FoodModel.create({
      name: food.name,
      category: food.category,
      brand: food.brand,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      servingOptions: food.servingOptions,
      calories: food.calories,
      protein: food.protein,
      carbohydrates: food.carbohydrates,
      fat: food.fat,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
      vitaminsAndMinerals: food.vitaminsAndMinerals,
      dataSource: food.dataSource,
      imageUrl: food.imageUrl,
      isVerified: food.isVerified,
    });
    return this.mapDocumentToEntity(created);
  }

  async count(): Promise<number> {
    return FoodModel.countDocuments().exec();
  }
}
