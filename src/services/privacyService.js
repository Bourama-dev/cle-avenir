import { supabase } from '@/lib/customSupabaseClient';

export const PrivacyService = {
  /**
   * Log a user's consent action for legal audit trails
   */
  async logConsent(userId, type, agreed, preferences = {}) {
    try {
      const { error } = await supabase.from('consent_logs').insert({
        user_id: userId,
        consent_type: type,
        agreed,
        preferences,
        user_agent: navigator.userAgent
      });
      
      if (error) throw error;
      
      // Also update profile current settings
      if (userId) {
        await supabase.from('profiles').update({
          privacy_settings: preferences,
          updated_at: new Date()
        }).eq('id', userId);
      }
      
      return true;
    } catch (err) {
      console.error('Error logging consent:', err);
      return false;
    }
  },

  /**
   * Request data export (Portability)
   */
  async requestDataExport(userId) {
    try {
      // Create a support request of type 'data_export'
      const { error } = await supabase.from('support_requests').insert({
        user_id: userId,
        subject: '[RGPD] Demande de portabilité des données',
        message: 'L\'utilisateur demande un export complet de ses données personnelles au format structuré (JSON/CSV).',
        type: 'data_privacy',
        status: 'pending',
        name: 'Automated Request',
        email: 'user@system.local' // Placeholder, backend handles notification
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Request account deletion (Right to be forgotten)
   */
  async requestDeletion(userId, reason) {
    try {
      const { error } = await supabase.from('support_requests').insert({
        user_id: userId,
        subject: '[RGPD] Demande de suppression de compte',
        message: `DEMANDE DE SUPPRESSION DÉFINITIVE.\nMotif: ${reason}`,
        type: 'data_privacy',
        status: 'urgent',
        name: 'Automated Request',
        email: 'user@system.local'
      });
      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};