import mongoose, { Schema, Document } from 'mongoose';
import { TipCategory } from '../../../domain/entities/DailyTip';

export interface IDailyTipDocument extends Document {
  category: TipCategory;
  title: string;
  content: string;
  actionableStep?: string;
  sourceOrTag?: string;
  createdAt: Date;
}

const DailyTipSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['general', 'nutrition', 'fitness', 'hydration', 'mindfulness'],
      default: 'general',
      index: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    actionableStep: { type: String, default: '' },
    sourceOrTag: { type: String, default: 'AI Health Core' },
  },
  {
    timestamps: true,
  }
);

export const DailyTipModel = mongoose.model<IDailyTipDocument>('DailyTip', DailyTipSchema);
