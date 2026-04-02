import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to handle notification operations
 */
export const NotificationService = {
  /**
   * Create a new notification
   * @param {Object} notification - { user_id, type, title, message, data }
   */
  createNotification: async (notification) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          read: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  },

  /**
   * Get unread notifications for a user
   * @param {string} userId 
   */
  getUnreadNotifications: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId 
   */
  markAsRead: async (notificationId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a notification
   * @param {string} notificationId 
   */
  deleteNotification: async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error };
    }
  }
};