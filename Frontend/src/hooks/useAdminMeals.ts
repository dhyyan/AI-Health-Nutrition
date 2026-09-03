import { useState, useEffect, useCallback } from 'react';
import { Meal, CreateMealDTO, MealFilterParams } from '../types/meal.types';
import { getAllMeals, createMeal, updateMeal, deleteMeal } from '../services/mealApi';

export const useAdminMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MealFilterParams>({});

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMeals(filters);
      setMeals(data);
    } catch (err: any) {
      console.error('Failed to fetch admin meals:', err);
      setError(err?.response?.data?.message || 'Failed to fetch meals.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleCreateMeal = async (data: CreateMealDTO) => {
    try {
      await createMeal(data);
      setIsModalOpen(false);
      fetchMeals();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create meal.');
    }
  };

  const handleUpdateMeal = async (id: string, data: Partial<CreateMealDTO>) => {
    try {
      await updateMeal(id, data);
      setIsModalOpen(false);
      setEditingMeal(null);
      fetchMeals();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update meal.');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this meal option from the database?')) {
      return;
    }
    try {
      await deleteMeal(id);
      fetchMeals();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete meal.');
    }
  };

  const openCreateModal = () => {
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  return {
    meals,
    loading,
    error,
    filters,
    setFilters,
    isModalOpen,
    setIsModalOpen,
    editingMeal,
    openCreateModal,
    openEditModal,
    handleCreateMeal,
    handleUpdateMeal,
    handleDeleteMeal,
    refreshMeals: fetchMeals,
  };
};
