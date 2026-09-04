import mongoose from 'mongoose';
import { IFoodLogRepository } from '../../domain/interfaces/repositories/IFoodLogRepository';
import { FoodLog, FoodLogProps, MealType } from '../../domain/entities/FoodLog';
import { FoodLogModel, IFoodLogDocument } from '../../framework/database/models/FoodLogModel';

export class MongoFoodLogRepository implements IFoodLogRepository {
  private mapDocumentToEntity(doc: IFoodLogDocument): FoodLog {
    const props: FoodLogProps = {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      foodItemId: doc.foodItemId ? doc.foodItemId.toString() : undefined,
      foodName: doc.foodName,
      mealType: doc.mealType as MealType,
      servingSize: doc.servingSize,
      servingUnit: doc.servingUnit,
      calories: doc.calories,
      protein: doc.protein,
      carbohydrates: doc.carbohydrates,
      fat: doc.fat,
      fiber: doc.fiber,
      sugar: doc.sugar,
      sodium: doc.sodium,
      vitaminsAndMinerals: doc.vitaminsAndMinerals,
      loggedAt: doc.loggedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return new FoodLog(props);
  }

  async create(log: FoodLog): Promise<FoodLog> {
    const doc = await FoodLogModel.create({
      userId: new mongoose.Types.ObjectId(log.userId),
      foodItemId: log.foodItemId ? new mongoose.Types.ObjectId(log.foodItemId) : undefined,
      foodName: log.foodName,
      mealType: log.mealType,
      servingSize: log.servingSize,
      servingUnit: log.servingUnit,
      calories: log.calories,
      protein: log.protein,
      carbohydrates: log.carbohydrates,
      fat: log.fat,
      fiber: log.fiber,
      sugar: log.sugar,
      sodium: log.sodium,
      vitaminsAndMinerals: log.vitaminsAndMinerals,
      loggedAt: log.loggedAt,
    });
    return this.mapDocumentToEntity(doc);
  }

  async findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<FoodLog[]> {
    const docs = await FoodLogModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      loggedAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ loggedAt: -1 })
      .exec();

    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findByUserId(userId: string, limit: number = 10): Promise<FoodLog[]> {
    const docs = await FoodLogModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ loggedAt: -1 })
      .limit(limit)
      .exec();

    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findById(id: string): Promise<FoodLog | null> {
    const doc = await FoodLogModel.findById(id).exec();
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await FoodLogModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    }).exec();
    return result.deletedCount > 0;
  }
}
