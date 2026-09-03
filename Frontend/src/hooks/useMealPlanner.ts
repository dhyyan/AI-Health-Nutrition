import { useState, useEffect, useCallback } from 'react';
import { WeeklyMealPlan, MealType } from '../types/meal.types';
import { getUserMealPlan, generateFreshMealPlan, swapMealSlot } from '../services/mealApi';

export const useMealPlanner = () => {
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [swappingSlot, setSwappingSlot] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserMealPlan();
      setMealPlan(data);
    } catch (err: any) {
      console.error('Failed to fetch meal plan:', err);
      setError(err?.response?.data?.message || 'Failed to load meal plan.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerateFreshPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const freshData = await generateFreshMealPlan();
      setMealPlan(freshData);
    } catch (err: any) {
      console.error('Failed to generate fresh meal plan:', err);
      setError(err?.response?.data?.message || 'Failed to generate new meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapSlot = async (day: string, slotType: MealType, replacementMealId?: string) => {
    try {
      setSwappingSlot(`${day}-${slotType}`);
      const updated = await swapMealSlot(day, slotType, replacementMealId);
      setMealPlan(updated);
    } catch (err: any) {
      console.error('Failed to swap meal slot:', err);
      alert(err?.response?.data?.message || 'Failed to swap meal slot.');
    } finally {
      setSwappingSlot(null);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    mealPlan,
    selectedDay,
    setSelectedDay,
    loading,
    error,
    swappingSlot,
    handleGenerateFreshPlan,
    handleSwapSlot,
    refreshPlan: fetchPlan,
  };
};
