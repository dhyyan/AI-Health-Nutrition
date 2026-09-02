import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodDocument extends Document {
  name: string;
  category: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  servingOptions: Array<{ amount: number; unit: string; label?: string }>;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitaminsAndMinerals: Array<{
    name: string;
    amount: number;
    unit: string;
    dailyValuePercentage?: number;
  }>;
  dataSource: string;
  imageUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFoodDocument>(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: '' },
    servingSize: { type: Number, required: true, default: 100 },
    servingUnit: { type: String, required: true, default: 'g' },
    servingOptions: [
      {
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        label: { type: String },
      },
    ],
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    vitaminsAndMinerals: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        dailyValuePercentage: { type: Number },
      },
    ],
    dataSource: { type: String, default: 'Verified Database' },
    imageUrl: { type: String, default: '' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FoodSchema.index({ name: 'text', category: 'text', brand: 'text' });

export const FoodModel = mongoose.model<IFoodDocument>('Food', FoodSchema);
