import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  foodItemId?: mongoose.Types.ObjectId;
  foodName: string;
  mealType: string;
  servingSize: number;
  servingUnit: string;
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
  loggedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FoodLogSchema = new Schema<IFoodLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    foodItemId: { type: Schema.Types.ObjectId, ref: 'Food' },
    foodName: { type: String, required: true },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
      default: 'snack',
    },
    servingSize: { type: Number, required: true },
    servingUnit: { type: String, required: true, default: 'g' },
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
    loggedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

FoodLogSchema.index({ userId: 1, loggedAt: -1 });

export const FoodLogModel = mongoose.model<IFoodLogDocument>('FoodLog', FoodLogSchema);
