import mongoose, { Schema, Document } from 'mongoose';

export interface IWeightBmiLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: string;
  date: string; // YYYY-MM-DD
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WeightBmiLogSchema = new Schema<IWeightBmiLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    bmi: { type: Number, required: true },
    bmiCategory: { type: String, required: true },
    date: { type: String, required: true, index: true },
    recordedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

WeightBmiLogSchema.index({ userId: 1, date: -1 });

export const WeightBmiLogModel = mongoose.model<IWeightBmiLogDocument>('WeightBmiLog', WeightBmiLogSchema);
