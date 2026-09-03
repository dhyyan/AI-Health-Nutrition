import { IWeightBmiLogRepository } from '../../domain/interfaces/repositories/IWeightBmiLogRepository';
import { WeightBmiLog } from '../../domain/entities/WeightBmiLog';
import { WeightBmiLogModel, IWeightBmiLogDocument } from '../../framework/database/models/WeightBmiLogModel';
import mongoose from 'mongoose';

export class WeightBmiLogRepository implements IWeightBmiLogRepository {
  private mapToDomain(doc: IWeightBmiLogDocument): WeightBmiLog {
    return new WeightBmiLog({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      weightKg: doc.weightKg,
      heightCm: doc.heightCm,
      bmi: doc.bmi,
      bmiCategory: doc.bmiCategory,
      date: doc.date,
      recordedAt: doc.recordedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async createOrUpdateLog(log: WeightBmiLog): Promise<WeightBmiLog> {
    const filter = {
      userId: new mongoose.Types.ObjectId(log.userId),
      date: log.date,
    };

    const update = {
      weightKg: log.weightKg,
      heightCm: log.heightCm,
      bmi: log.bmi,
      bmiCategory: log.bmiCategory,
      recordedAt: log.recordedAt || new Date(),
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const updatedDoc = await WeightBmiLogModel.findOneAndUpdate(filter, update, options);

    return this.mapToDomain(updatedDoc!);
  }

  async getHistory(userId: string, startDate?: string, endDate?: string): Promise<WeightBmiLog[]> {
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const docs = await WeightBmiLogModel.find(query).sort({ date: 1 });
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async getLatest(userId: string): Promise<WeightBmiLog | null> {
    const doc = await WeightBmiLogModel.findOne({ userId: new mongoose.Types.ObjectId(userId) }).sort({ date: -1, createdAt: -1 });
    return doc ? this.mapToDomain(doc) : null;
  }
}
