import mongoose from 'mongoose';
import { CONFIG } from '../../shared/constants/config';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI && CONFIG.NODE_ENV === 'production') {
      console.warn('⚠️ MONGODB_URI environment variable is not set in Render Environment!');
    }
    const conn = await mongoose.connect(CONFIG.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Mongoose Connection Error: ${(error as Error).message}`);
  }
};
