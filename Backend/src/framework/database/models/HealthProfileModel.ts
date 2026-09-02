import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  bloodGroup: string;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  goal: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance';
  foodAllergies: string[];
  medicalHistory: string[];
  activityLevel: 'sedentary' | 'moderate' | 'active';
  sleepHours: number;
  dietaryPreference: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthProfileSchema = new Schema<IHealthProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    bloodGroup: { type: String, default: 'Unknown' },
    bmi: { type: Number, required: true },
    bmiCategory: { type: String, enum: ['Underweight', 'Normal', 'Overweight', 'Obese'], required: true },
    goal: {
      type: String,
      enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance'],
      default: 'maintenance',
    },
    foodAllergies: [{ type: String }],
    medicalHistory: [{ type: String }],
    activityLevel: { type: String, enum: ['sedentary', 'moderate', 'active'], default: 'moderate' },
    sleepHours: { type: Number, default: 7 },
    dietaryPreference: { type: String, default: 'Non-Vegetarian' },
  },
  {
    timestamps: true,
  }
);

export const HealthProfileModel = mongoose.model<IHealthProfileDocument>('HealthProfile', HealthProfileSchema);
