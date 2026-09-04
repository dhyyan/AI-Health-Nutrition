import { useState, useEffect, useCallback } from 'react';
import { reportApi, UserDashboardData } from '../services/reportApi';
import { logWaterIntake } from '../services/waterApi';

export const useDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWaterUpdating, setIsWaterUpdating] = useState<boolean>(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportApi.getDashboard(selectedDate);
      setDashboardData(data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const addQuickWater = async (amountMl: number = 250) => {
    if (isWaterUpdating) return;
    setIsWaterUpdating(true);
    try {
      await logWaterIntake({
        amountMl,
        date: selectedDate,
      });
      await fetchDashboard();
    } catch (err: any) {
      console.error('Failed to quick log water:', err);
    } finally {
      setIsWaterUpdating(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    dashboardData,
    loading,
    error,
    isWaterUpdating,
    refreshDashboard: fetchDashboard,
    addQuickWater,
  };
};
