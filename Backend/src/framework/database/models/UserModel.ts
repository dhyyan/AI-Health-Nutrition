import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationOtp?: string | null;
  otpExpiresAt?: Date | null;
  resetPasswordOtp?: string | null;
  resetPasswordExpiresAt?: Date | null;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationOtp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    resetPasswordOtp: { type: String, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
