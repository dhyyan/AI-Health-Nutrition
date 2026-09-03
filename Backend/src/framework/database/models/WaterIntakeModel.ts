import mongoose, { Schema, Document } from 'mongoose';

export interface IWaterIntakeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  amountMl: number;
  date: string; // YYYY-MM-DD
  timestamp: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaterIntakeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amountMl: { type: Number, required: true, min: 1 },
    date: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient daily queries per user
WaterIntakeSchema.index({ userId: 1, date: 1 });

export const WaterIntakeModel = mongoose.model<IWaterIntakeDocument>('WaterIntake', WaterIntakeSchema);
