import { IWaterIntakeRepository } from '../../domain/interfaces/repositories/IWaterIntakeRepository';
import { WaterIntake, UserWaterGoal, DailyWaterSummary, WaterHistoryDay } from '../../domain/entities/WaterIntake';
import { WaterIntakeModel, IWaterIntakeDocument } from '../../framework/database/models/WaterIntakeModel';
import { WaterGoalModel } from '../../framework/database/models/WaterGoalModel';
import { HealthProfileModel } from '../../framework/database/models/HealthProfileModel';

export class WaterIntakeRepository implements IWaterIntakeRepository {
  private mapToDomain(doc: IWaterIntakeDocument): WaterIntake {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      amountMl: doc.amountMl,
      date: doc.date,
      timestamp: doc.timestamp || doc.createdAt,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async logIntake(userId: string, amountMl: number, date: string, notes?: string): Promise<WaterIntake> {
    const doc = await WaterIntakeModel.create({
      userId,
      amountMl,
      date,
      timestamp: new Date(),
      notes: notes || '',
    });
    return this.mapToDomain(doc);
  }

  async deleteIntake(userId: string, intakeId: string): Promise<boolean> {
    const res = await WaterIntakeModel.findOneAndDelete({ _id: intakeId, userId });
    return res !== null;
  }

  async getDailyIntakeRecords(userId: string, date: string): Promise<WaterIntake[]> {
    const docs = await WaterIntakeModel.find({ userId, date }).sort({ timestamp: -1 });
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async getWaterGoal(userId: string): Promise<number> {
    const customGoal = await WaterGoalModel.findOne({ userId });
    if (customGoal && customGoal.dailyGoalMl) {
      return customGoal.dailyGoalMl;
    }

    // Dynamic Default Calculation based on Health Profile (Weight in kg * 35 ml)
    const healthProfile = await HealthProfileModel.findOne({ userId });
    if (healthProfile && healthProfile.weightKg) {
      const calculated = Math.round(healthProfile.weightKg * 35);
      // Ensure bounds between 1500 ml and 4500 ml
      return Math.min(Math.max(calculated, 1500), 4500);
    }

    return 2500; // Standard Default Goal (2.5 Liters)
  }

  async updateWaterGoal(userId: string, dailyGoalMl: number): Promise<UserWaterGoal> {
    const doc = await WaterGoalModel.findOneAndUpdate(
      { userId },
      { userId, dailyGoalMl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      userId: doc.userId.toString(),
      dailyGoalMl: doc.dailyGoalMl,
      updatedAt: doc.updatedAt,
    };
  }

  async getDailySummary(userId: string, date: string): Promise<DailyWaterSummary> {
    const records = await this.getDailyIntakeRecords(userId, date);
    const dailyGoalMl = await this.getWaterGoal(userId);
    const totalConsumedMl = records.reduce((sum, item) => sum + item.amountMl, 0);
    const progressPercentage = dailyGoalMl > 0 ? Math.min(Math.round((totalConsumedMl / dailyGoalMl) * 100), 100) : 0;
    const remainingMl = Math.max(dailyGoalMl - totalConsumedMl, 0);

    return {
      date,
      totalConsumedMl,
      dailyGoalMl,
      progressPercentage,
      remainingMl,
      records,
    };
  }

  async getWaterHistory(userId: string, days: number = 7): Promise<WaterHistoryDay[]> {
    const dailyGoalMl = await this.getWaterGoal(userId);
    const history: WaterHistoryDay[] = [];

    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const records = await WaterIntakeModel.find({ userId, date: dateStr });
      const totalConsumedMl = records.reduce((sum, item) => sum + item.amountMl, 0);
      const progressPercentage = dailyGoalMl > 0 ? Math.min(Math.round((totalConsumedMl / dailyGoalMl) * 100), 100) : 0;

      history.push({
        date: dateStr,
        totalConsumedMl,
        dailyGoalMl,
        progressPercentage,
        isGoalMet: totalConsumedMl >= dailyGoalMl,
      });
    }

    return history;
  }
}
