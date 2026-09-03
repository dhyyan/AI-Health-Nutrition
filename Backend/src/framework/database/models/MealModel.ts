import mongoose, { Schema, Document } from 'mongoose';
import { MealType, DietaryPreference } from '../../../domain/entities/Meal';
import { HealthGoal } from '../../../domain/entities/HealthProfile';

export interface IMealDocument extends Document {
  name: string;
  mealType: MealType;
  category: string;
  dietaryPreference: DietaryPreference;
  suitableGoals: HealthGoal[];
  allergens: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  servingSize: number;
  servingUnit: string;
  ingredients: string[];
  instructions?: string;
  imageUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      index: true,
    },
    category: { type: String, required: true, default: 'General Meal' },
    dietaryPreference: {
      type: String,
      required: true,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Pescatarian'],
      default: 'Non-Vegetarian',
      index: true,
    },
    suitableGoals: {
      type: [String],
      required: true,
      enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'],
      index: true,
    },
    allergens: { type: [String], default: [] },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 },
    fat: { type: Number, required: true, min: 0 },
    fiber: { type: Number, default: 0 },
    servingSize: { type: Number, required: true, default: 100 },
    servingUnit: { type: String, required: true, default: 'g' },
    ingredients: { type: [String], required: true, default: [] },
    instructions: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

MealSchema.index({ name: 'text', ingredients: 'text' });

export const MealModel = mongoose.model<IMealDocument>('Meal', MealSchema);
