import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { NotificationService } from '@/lib/notifications';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load notifications for the current user
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    const { data, error } = await NotificationService.getUnreadNotifications(user.id);
    
    if (data && !error) {
      setNotifications(data);
      setUnreadCount(data.length);
    }
    setLoading(false);
  }, [user]);

  // Initial load when user changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      // Background refresh - don't show loading state
      NotificationService.getUnreadNotifications(user.id).then(({ data, error }) => {
        if (data && !error) {
          setNotifications(data);
          setUnreadCount(data.length);
        }
      });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  // Actions
  const markAsRead = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));

    const { error } = await NotificationService.markAsRead(id);
    if (error) {
      // Revert if failed (simplified, typically would re-fetch)
      loadNotifications();
    }
  };

  const deleteNotification = async (id) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));

    const { error } = await NotificationService.deleteNotification(id);
    if (error) {
      loadNotifications();
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshNotifications: loadNotifications,
    markAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
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