export type FaqCategory = 'General' | 'Nutrition' | 'Exercise' | 'Disease Prevention' | 'App Usage';

export interface Faq {
  id?: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order?: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
