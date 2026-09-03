export type ArticleCategory = 
  | 'healthy_food' 
  | 'disease_prevention' 
  | 'exercise_guide' 
  | 'nutrition_awareness' 
  | 'lifestyle_tips';

export interface ExerciseStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface Article {
  id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}
