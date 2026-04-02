import { supabase } from '@/lib/customSupabaseClient';

export const systemSettingsService = {
  async fetchSystemSettings() {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      const settings = {};
      data.forEach(row => {
        settings[row.key] = row.value;
      });

      return settings;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  },

  async updateSystemSettings(settingsObject) {
    try {
      const rowsToUpsert = Object.entries(settingsObject).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(rowsToUpsert, { onConflict: 'key' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  },

  subscribeToSettings(callback) {
    return supabase
      .channel('system_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
};