import mongoose, { Schema, Document } from 'mongoose';
import { ArticleCategory } from '../../../domain/entities/Article';

export interface IArticleDocument extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  readTimeMinutes: number;
  imageUrl?: string;
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  exerciseSteps?: { stepNumber: number; title: string; description: string }[];
  isPublished: boolean;
  isFeatured?: boolean;
  medicalDisclaimer?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseStepSchema = new Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['healthy_food', 'disease_prevention', 'exercise_guide', 'nutrition_awareness', 'lifestyle_tips'],
      index: true,
    },
    readTimeMinutes: { type: Number, required: true, default: 3 },
    imageUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    exerciseSteps: { type: [ExerciseStepSchema], default: [] },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    medicalDisclaimer: { type: String, default: '' },
    createdBy: { type: String, default: 'Admin' },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

export const ArticleModel = mongoose.model<IArticleDocument>('Article', ArticleSchema);
