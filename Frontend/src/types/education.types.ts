export type ArticleCategory =
  | 'healthy_food'
  | 'disease_prevention'
  | 'exercise_guide'
  | 'nutrition_awareness'
  | 'lifestyle_tips';

export type FaqCategory = 'General' | 'Nutrition' | 'Exercise' | 'Disease Prevention' | 'App Usage';

export interface ExerciseStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  readTimeMinutes: number;
  imageUrl?: string;
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  exerciseSteps?: ExerciseStep[];
  isPublished: boolean;
  isFeatured?: boolean;
  medicalDisclaimer?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order?: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleFilterParams {
  category?: ArticleCategory;
  search?: string;
  isPublishedOnly?: boolean;
}

export interface FaqFilterParams {
  category?: FaqCategory;
  search?: string;
  isPublishedOnly?: boolean;
}

export interface CreateArticleDTO {
  title: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  readTimeMinutes?: number;
  imageUrl?: string;
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  exerciseSteps?: ExerciseStep[];
  isPublished?: boolean;
  isFeatured?: boolean;
  medicalDisclaimer?: string;
}

export interface CreateFaqDTO {
  question: string;
  answer: string;
  category: FaqCategory;
  order?: number;
  isPublished?: boolean;
}
