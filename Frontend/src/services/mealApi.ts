import api from './api';
import { Meal, WeeklyMealPlan, CreateMealDTO, MealFilterParams, MealType } from '../types/meal.types';

// USER ENDPOINTS
export const getUserMealPlan = async (): Promise<WeeklyMealPlan> => {
  const response = await api.get('/meals/plan');
  return response.data.data;
};

export const generateFreshMealPlan = async (): Promise<WeeklyMealPlan> => {
  const response = await api.post('/meals/plan/generate');
  return response.data.data;
};

export const swapMealSlot = async (
  day: string,
  slotType: MealType,
  replacementMealId?: string
): Promise<WeeklyMealPlan> => {
  const response = await api.post('/meals/plan/swap', {
    day,
    slotType,
    replacementMealId,
  });
  return response.data.data;
};

// SEARCH & ADMIN ENDPOINTS
export const getAllMeals = async (params?: MealFilterParams): Promise<Meal[]> => {
  const response = await api.get('/meals', { params });
  return response.data.data;
};

export const createMeal = async (mealData: CreateMealDTO): Promise<Meal> => {
  const response = await api.post('/meals', mealData);
  return response.data.data;
};

export const updateMeal = async (id: string, mealData: Partial<CreateMealDTO>): Promise<Meal> => {
  const response = await api.put(`/meals/${id}`, mealData);
  return response.data.data;
};

export const deleteMeal = async (id: string): Promise<boolean> => {
  const response = await api.delete(`/meals/${id}`);
  return response.data.success;
};
