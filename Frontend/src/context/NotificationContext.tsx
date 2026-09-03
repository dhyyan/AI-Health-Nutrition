import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification, NotificationType, ToastItem } from '../types/notification';
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as apiDeleteNotification,
} from '../services/notificationApi';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  activeToasts: ToastItem[];
  loading: boolean;
  addNotification: (title: string, message: string, type?: NotificationType, actionUrl?: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  dismissToast: (toastId: string) => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeToasts, setActiveToasts] = useState<ToastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await getNotifications(30);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = async (
    title: string,
    message: string,
    type: NotificationType = 'system',
    actionUrl?: string
  ) => {
    const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);

    // Create toast pop-up item
    const newToast: ToastItem = {
      id: toastId,
      title,
      message,
      type,
      createdAt: new Date(),
    };
    setActiveToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Persist to backend if authenticated
    if (isAuthenticated) {
      try {
        const created = await createNotification({ title, message, type, actionUrl });
        setNotifications((prev) => [created, ...prev]);
        setUnreadCount((prev) => prev + 1);
      } catch (err) {
        console.error('Error creating notification in backend:', err);
        // Fallback local memory entity
        const localNotification: AppNotification = {
          id: toastId,
          userId: 'local',
          title,
          message,
          type,
          isRead: false,
          actionUrl,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [localNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    } else {
      const localNotification: AppNotification = {
        id: toastId,
        userId: 'local',
        title,
        message,
        type,
        isRead: false,
        actionUrl,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [localNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    if (isAuthenticated) {
      try {
        await markNotificationAsRead(id);
      } catch (err) {
        console.error('Error marking notification read:', err);
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    if (isAuthenticated) {
      try {
        await markAllNotificationsAsRead();
      } catch (err) {
        console.error('Error marking all notifications read:', err);
      }
    }
  };

  const deleteNotification = async (id: string) => {
    const target = notifications.find((item) => item.id === id);
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    if (isAuthenticated) {
      try {
        await apiDeleteNotification(id);
      } catch (err) {
        console.error('Error deleting notification:', err);
      }
    }
  };

  const dismissToast = (toastId: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToasts,
        loading,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        dismissToast,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
