import mongoose, { Schema, Document } from 'mongoose';

export interface IWaterGoalDocument extends Document {
  userId: mongoose.Types.ObjectId;
  dailyGoalMl: number;
  updatedAt: Date;
}

const WaterGoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    dailyGoalMl: { type: Number, required: true, default: 2500, min: 500, max: 10000 },
  },
  {
    timestamps: true,
  }
);

export const WaterGoalModel = mongoose.model<IWaterGoalDocument>('WaterGoal', WaterGoalSchema);
