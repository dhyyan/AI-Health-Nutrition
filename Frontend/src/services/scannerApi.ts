import api from './api';

export interface FoodAlternativeComparisonItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  servingSize?: number;
  servingUnit?: string;
}

export interface FoodAlternativeComparisonData {
  originalFood: FoodAlternativeComparisonItem;
  alternativeFood: FoodAlternativeComparisonItem;
  reason: string;
  calorieSavings: number;
  proteinDifference: number;
  healthBenefit: string;
}

export interface ScanResultData {
  foodName: string;
  confidence: number;
  portionEstimate: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  healthRating: 'healthy' | 'unhealthy' | 'moderate';
  healthReasoning: string;
  dietaryTags: string[];
  healthTips: string[];
  isHealthy: boolean;
  imageUrl?: string;

  // AI Nutrition Engine 7-Step Output
  nutritionLookup?: {
    verifiedMatch: boolean;
    source: 'database' | 'ai_estimate';
    dbFoodId?: string;
    category?: string;
    sugar?: number;
    sodium?: number;
    vitamins?: string[];
    minerals?: string[];
  };
  profileMatching?: {
    goal: string;
    userAllergies: string[];
    medicalHistory?: string[];
    isDiabetic: boolean;
    dailyCalorieTarget: number;
  };
  suitability?: {
    rating: 'highly_suitable' | 'moderate' | 'unsuitable';
    score: number;
    reasoning: string;
    hasAllergenAlert: boolean;
    allergenAlerts: string[];
    medicalAlerts: string[];
  };
  healthierAlternatives?: FoodAlternativeComparisonData[];
  portionAdvice?: {
    recommendedServingMultiplier: number;
    servingAdviceText: string;
    handVisualGuide: {
      protein: string;
      veggies: string;
      carbs: string;
      fats: string;
    };
  };
  recommendationSummary?: string;
  disclaimer?: string;
}

export const scannerApi = {
  scanFoodImage: async (image: File | Blob): Promise<ScanResultData> => {
    const formData = new FormData();
    if (image instanceof File) {
      formData.append('image', image);
    } else {
      formData.append('image', image, 'captured-food.jpg');
    }

    const response = await api.post('/nutrition/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  scanBase64Image: async (base64Data: string): Promise<ScanResultData> => {
    const response = await api.post('/nutrition/scan', { imageBase64: base64Data });
    return response.data.data;
  },
};
