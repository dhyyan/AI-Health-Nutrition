import mongoose from 'mongoose';
import { CONFIG } from '../../shared/constants/config';

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(CONFIG.MONGODB_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Mongoose Connection Error: ${(error as Error).message}`);
    console.warn(`⚠️ App running in standalone mode (database connection pending MongoDB server launch)`);
  }
};
