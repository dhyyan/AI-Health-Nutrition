import { useState, useEffect, useCallback } from 'react';
import { ReminderSettings, DailyHealthTip, TipCategory } from '../types/reminder';
import {
  getReminderSettings,
  updateReminderSettings,
  getDailyHealthTip,
  triggerReminderCheck,
} from '../services/reminderApi';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const useReminders = () => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyHealthTip | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getReminderSettings();
      setSettings(data);
    } catch (err: any) {
      console.error('Error fetching reminder settings:', err);
      setError(err?.response?.data?.message || 'Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTip = useCallback(async (category?: TipCategory) => {
    try {
      const tipData = await getDailyHealthTip(category);
      setDailyTip(tipData);
    } catch (err) {
      console.error('Error fetching daily health tip:', err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchTip();
  }, [fetchSettings, fetchTip]);

  const saveSettings = async (updatedFields: Partial<ReminderSettings>) => {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      const savedData = await updateReminderSettings(updatedFields);
      setSettings(savedData);
      await addNotification(
        '⚙️ Settings Saved',
        'Your notification schedules and reminder preferences have been updated.',
        'system'
      );
      return savedData;
    } catch (err: any) {
      console.error('Error updating reminder settings:', err);
      setError(err?.response?.data?.message || 'Failed to save reminder settings');
    } finally {
      setSaving(false);
    }
  };

  const testTrigger = async () => {
    try {
      const result = await triggerReminderCheck();
      await addNotification(
        '🔔 Reminder Trigger Check Completed',
        `Evaluated active schedules. ${result.notificationsTriggered} notification(s) dispatched.`,
        'system'
      );
      return result;
    } catch (err) {
      console.error('Error triggering reminder test check:', err);
    }
  };

  return {
    settings,
    dailyTip,
    loading,
    saving,
    error,
    saveSettings,
    fetchSettings,
    fetchTip,
    testTrigger,
  };
};
