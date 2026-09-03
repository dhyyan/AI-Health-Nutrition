import mongoose, { Schema, Document } from 'mongoose';
import { HealthGoal } from '../../../domain/entities/HealthProfile';
import { DietaryPreference } from '../../../domain/entities/Meal';

export interface IMealPlanDocument extends Document {
  userId: mongoose.Types.ObjectId;
  startDate: string;
  goal: HealthGoal;
  dietaryPreference: DietaryPreference;
  excludedAllergies: string[];
  weeklySchedule: any[];
  generatedAt: Date;
  updatedAt: Date;
}

const MealPlanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    startDate: { type: String, required: true },
    goal: { type: String, required: true },
    dietaryPreference: { type: String, required: true },
    excludedAllergies: { type: [String], default: [] },
    weeklySchedule: { type: Schema.Types.Mixed, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const MealPlanModel = mongoose.model<IMealPlanDocument>('MealPlan', MealPlanSchema);
