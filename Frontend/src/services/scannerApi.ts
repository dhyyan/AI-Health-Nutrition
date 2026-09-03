import api from './api';

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
