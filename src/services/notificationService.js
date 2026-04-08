import { supabase } from '@/lib/customSupabaseClient';

export const notificationService = {
  async createNotification(userId, notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
          action_url: notificationData.actionUrl || null,
          action_label: notificationData.actionLabel || null,
          expires_at: notificationData.expiresAt || null,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[notificationService] Error creating notification:', error);
      return { success: false, error };
    }
  },

  async getNotifications(userId, limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data, count };
    } catch (error) {
      console.error('[notificationService] Error getting notifications:', error);
      return { success: false, error, data: [] };
    }
  },

  async getUnreadNotifications(userId) {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data, count };
    } catch (error) {
      console.error('[notificationService] Error getting unread notifications:', error);
      return { success: false, error, data: [], count: 0 };
    }
  },

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[notificationService] Error marking as read:', error);
      return { success: false, error };
    }
  },

  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[notificationService] Error marking all as read:', error);
      return { success: false, error };
    }
  },

  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[notificationService] Error deleting notification:', error);
      return { success: false, error };
    }
  },

  async deleteAllNotifications(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[notificationService] Error deleting all notifications:', error);
      return { success: false, error };
    }
  },

  async getNotificationPreferences(userId) {
    try {
      let { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      // If no preferences exist, create default ones
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('notification_preferences')
          .insert({ user_id: userId })
          .select()
          .single();
          
        if (insertError) throw insertError;
        data = newData;
      }

      return { success: true, data };
    } catch (error) {
      console.error('[notificationService] Error getting preferences:', error);
      return { success: false, error, data: null };
    }
  },

  async updateNotificationPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[notificationService] Error updating preferences:', error);
      return { success: false, error };
    }
  },

  async sendEmailNotification(userId, notificationData) {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          user_id: userId,
          subject: notificationData.title || notificationData.subject,
          message: notificationData.message || notificationData.body,
          template: notificationData.template || 'default',
          data: notificationData.data || {}
        }
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[notificationService] Error sending email:', error);
      return { success: false, error };
    }
  },

  async sendPushNotification(userId, notificationData) {
    // Web Push nécessite un service worker — fonctionnalité future
    console.log(`[notificationService] Push notification queued for user ${userId}`);
    return { success: true };
  }
};