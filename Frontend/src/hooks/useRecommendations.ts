import { useState, useEffect, useCallback } from 'react';
import {
  PersonalizedRecommendations,
  FoodAlternativeComparison,
} from '../types/recommendation.types';
import {
  getPersonalizedRecommendations,
  getFoodAlternatives,
} from '../services/recommendationApi';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [alternatives, setAlternatives] = useState<FoodAlternativeComparison[]>([]);
  const [alternativesLoading, setAlternativesLoading] = useState<boolean>(false);
  const [alternativesError, setAlternativesError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPersonalizedRecommendations();
      setRecommendations(data);
      if (data.topAlternatives) {
        setAlternatives(data.topAlternatives);
      }
    } catch (err: any) {
      console.error('Failed to fetch recommendations:', err);
      setError(err?.response?.data?.message || 'Failed to load personalized recommendations.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlternatives = useCallback(async (foodQuery: string) => {
    if (!foodQuery || foodQuery.trim().length === 0) return;
    try {
      setAlternativesLoading(true);
      setAlternativesError(null);
      const data = await getFoodAlternatives(foodQuery);
      setAlternatives(data);
    } catch (err: any) {
      console.error('Failed to fetch food alternatives:', err);
      setAlternativesError(err?.response?.data?.message || 'Failed to fetch food alternatives.');
    } finally {
      setAlternativesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: fetchRecommendations,
    alternatives,
    alternativesLoading,
    alternativesError,
    fetchAlternatives,
  };
};
