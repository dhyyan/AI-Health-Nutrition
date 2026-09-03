import mongoose, { Schema, Document } from 'mongoose';
import { FaqCategory } from '../../../domain/entities/Faq';

export interface IFaqDocument extends Document {
  question: string;
  answer: string;
  category: FaqCategory;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema: Schema = new Schema(
  {
    question: { type: String, required: true, trim: true, index: true },
    answer: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Nutrition', 'Exercise', 'Disease Prevention', 'App Usage'],
      default: 'General',
      index: true,
    },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

FaqSchema.index({ question: 'text', answer: 'text' });

export const FaqModel = mongoose.model<IFaqDocument>('Faq', FaqSchema);
