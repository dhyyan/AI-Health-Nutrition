export type TipCategory = 'general' | 'nutrition' | 'fitness' | 'hydration' | 'mindfulness' | 'sleep';

export interface DailyTip {
  id?: string;
  category: TipCategory;
  title: string;
  content: string;
  actionableStep?: string;
  sourceOrTag?: string;
  createdAt?: Date;
}
