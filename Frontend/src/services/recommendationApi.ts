import api from './api';
import {
  PersonalizedRecommendations,
  FoodAlternativeComparison,
} from '../types/recommendation.types';

export const getPersonalizedRecommendations = async (): Promise<PersonalizedRecommendations> => {
  const response = await api.get('/recommendations');
  return response.data.data;
};

export const getFoodAlternatives = async (
  foodNameQuery: string
): Promise<FoodAlternativeComparison[]> => {
  const response = await api.get('/recommendations/alternatives', {
    params: { food: foodNameQuery },
  });
  return response.data.data;
};
