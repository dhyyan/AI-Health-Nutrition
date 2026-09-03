import { IMealPlanRepository } from '../../domain/interfaces/repositories/IMealPlanRepository';
import { MealPlan } from '../../domain/entities/Meal';
import { MealPlanModel, IMealPlanDocument } from '../../framework/database/models/MealPlanModel';

export class MongoMealPlanRepository implements IMealPlanRepository {
  private mapDocumentToEntity(doc: IMealPlanDocument): MealPlan {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      startDate: doc.startDate,
      goal: doc.goal,
      dietaryPreference: doc.dietaryPreference,
      excludedAllergies: doc.excludedAllergies || [],
      weeklySchedule: doc.weeklySchedule || [],
      generatedAt: doc.generatedAt,
      updatedAt: doc.updatedAt,
    };
  }

  async createOrUpdate(mealPlan: MealPlan): Promise<MealPlan> {
    const filter = { userId: mealPlan.userId };
    const updateData = {
      startDate: mealPlan.startDate,
      goal: mealPlan.goal,
      dietaryPreference: mealPlan.dietaryPreference,
      excludedAllergies: mealPlan.excludedAllergies,
      weeklySchedule: mealPlan.weeklySchedule,
      generatedAt: new Date(),
    };

    const doc = await MealPlanModel.findOneAndUpdate(filter, updateData, {
      new: true,
      upsert: true,
    });

    return this.mapDocumentToEntity(doc);
  }

  async findByUserId(userId: string): Promise<MealPlan | null> {
    const doc = await MealPlanModel.findOne({ userId });
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const res = await MealPlanModel.deleteOne({ userId });
    return res.deletedCount > 0;
  }
}
