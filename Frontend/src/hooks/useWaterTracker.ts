import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyWaterSummary, WaterHistoryDay } from '../types/water';
import {
  getWaterSummary,
  logWaterIntake,
  deleteWaterIntake,
  updateWaterGoal,
  getWaterHistory,
} from '../services/waterApi';
import { useNotifications } from '../context/NotificationContext';

export const useWaterTracker = (selectedDate?: string) => {
  const { addNotification } = useNotifications();
  const [summary, setSummary] = useState<DailyWaterSummary | null>(null);
  const [history, setHistory] = useState<WaterHistoryDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reminder State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [reminderInterval, setReminderInterval] = useState<number>(() => {
    const saved = localStorage.getItem('water_reminder_interval');
    return saved ? parseInt(saved, 10) : 60; // Default: 60 minutes
  });
  const [isReminderEnabled, setIsReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('water_reminder_enabled') === 'true';
  });

  const [showBlockedModal, setShowBlockedModal] = useState<boolean>(false);

  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync latest permission status on focus or window check
  const checkPermissionStatus = useCallback(() => {
    if (typeof Notification !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('focus', checkPermissionStatus);
    return () => window.removeEventListener('focus', checkPermissionStatus);
  }, [checkPermissionStatus]);

  // Fetch summary data
  const fetchSummary = useCallback(async (dateStr?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWaterSummary(dateStr || selectedDate);
      setSummary(data);
    } catch (err: any) {
      console.error('Error fetching water summary:', err);
      setError(err.response?.data?.message || 'Failed to load water summary');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Fetch history data
  const fetchHistory = useCallback(async (days: number = 7) => {
    try {
      setHistoryLoading(true);
      const data = await getWaterHistory(days);
      setHistory(data);
    } catch (err: any) {
      console.error('Error fetching water history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchHistory(7);
  }, [fetchSummary, fetchHistory]);

  // Add Water Intake
  const addIntake = async (amountMl: number, notes?: string) => {
    try {
      setError(null);
      const updatedSummary = await logWaterIntake({ amountMl, date: selectedDate, notes });
      setSummary(updatedSummary);
      fetchHistory(7); // Refresh trend chart

      // Dispatch positive milestone notification if goal achieved
      if (updatedSummary.progressPercentage >= 100 && summary && summary.progressPercentage < 100) {
        addNotification(
          '🎉 Goal Achieved!',
          `Awesome job! You reached your daily target of ${updatedSummary.dailyGoalMl} ml.`,
          'water_reminder',
          '/water'
        );
      }
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to log water intake';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Remove Water Intake
  const removeIntake = async (intakeId: string) => {
    try {
      setError(null);
      const updatedSummary = await deleteWaterIntake(intakeId, selectedDate);
      setSummary(updatedSummary);
      fetchHistory(7);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete water intake';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Change Goal
  const changeGoal = async (dailyGoalMl: number) => {
    try {
      setError(null);
      const updatedSummary = await updateWaterGoal({ dailyGoalMl, date: selectedDate });
      setSummary(updatedSummary);
      fetchHistory(7);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update water goal';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Browser Notification Request
  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported on this browser.');
      return false;
    }

    if (Notification.permission === 'denied') {
      setShowBlockedModal(true);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setIsReminderEnabled(true);
        localStorage.setItem('water_reminder_enabled', 'true');
        addNotification(
          '🔔 Notifications Enabled',
          'You will now receive hydration popups and alerts.',
          'system',
          '/water'
        );
        return true;
      } else if (permission === 'denied') {
        setShowBlockedModal(true);
      }
      return false;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return false;
    }
  };

  const triggerTestNotification = () => {
    addNotification(
      '💧 Hydration Alert',
      'Time to drink a glass of water! Stay hydrated for maximum energy and wellness.',
      'water_reminder',
      '/water'
    );

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('💧 Hydration Reminder - NutriAI', {
        body: 'Time to drink a glass of water! Stay hydrated for maximum energy and wellness.',
        icon: '/favicon.ico',
      });
    }
  };

  const toggleReminder = (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      setIsReminderEnabled(enabled);
      localStorage.setItem('water_reminder_enabled', enabled ? 'true' : 'false');
    }
  };

  const setReminderTimeInterval = (minutes: number) => {
    setReminderInterval(minutes);
    localStorage.setItem('water_reminder_interval', minutes.toString());
  };

  // Reminder Interval Effect
  useEffect(() => {
    if (reminderTimerRef.current) {
      clearInterval(reminderTimerRef.current);
    }

    if (isReminderEnabled && reminderInterval > 0) {
      const intervalMs = reminderInterval * 60 * 1000;
      reminderTimerRef.current = setInterval(() => {
        // Dispatch to Notification Center + Top Right Toast
        addNotification(
          '💧 Hydration Reminder',
          "Hey there! It's time to drink a glass of water. Keep your daily goal on track! 💧",
          'water_reminder',
          '/water'
        );

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('💧 Hydration Reminder - NutriAI', {
            body: "Hey there! It's time to drink water. Keep your daily hydration goal on track! 💧",
            icon: '/favicon.ico',
          });
        }
      }, intervalMs);
    }

    return () => {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
      }
    };
  }, [isReminderEnabled, notificationPermission, reminderInterval, addNotification]);

  return {
    summary,
    history,
    loading,
    historyLoading,
    error,
    addIntake,
    removeIntake,
    changeGoal,
    fetchSummary,
    fetchHistory,
    notificationPermission,
    isReminderEnabled,
    reminderInterval,
    showBlockedModal,
    setShowBlockedModal,
    requestNotificationPermission,
    triggerTestNotification,
    toggleReminder,
    setReminderTimeInterval,
  };
};
