import api from './api';
import {
  FoodItem,
  NutritionAnalysisResult,
  CreateFoodLogRequest,
  FoodLogItem,
} from '../types/nutrition.types';

export const searchFoods = async (query: string, limit: number = 20): Promise<FoodItem[]> => {
  const response = await api.get('/nutrition/search', {
    params: { query, limit },
  });
  return response.data.data;
};

export const getFoodDetails = async (id: string): Promise<FoodItem> => {
  const response = await api.get(`/nutrition/food/${id}`);
  return response.data.data;
};

export const analyzeNutrition = async (
  foodId: string | undefined,
  foodName: string,
  servingSize: number,
  servingUnit: string
): Promise<NutritionAnalysisResult> => {
  const response = await api.post('/nutrition/analyze', {
    foodId,
    foodName,
    servingSize,
    servingUnit,
  });
  return response.data.data;
};

export const createFoodLog = async (logData: CreateFoodLogRequest): Promise<FoodLogItem> => {
  const response = await api.post('/nutrition/logs', logData);
  return response.data.data;
};

export const getUserFoodLogs = async (date?: string): Promise<FoodLogItem[]> => {
  const response = await api.get('/nutrition/logs', {
    params: { date },
  });
  return response.data.data;
};

export const deleteFoodLog = async (id: string): Promise<boolean> => {
  const response = await api.delete(`/nutrition/logs/${id}`);
  return response.data.success;
};
