import { supabase } from '@/lib/customSupabaseClient';

export const useConsentLogger = () => {
  const logConsent = async (userId, type, agreed, preferences = {}) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase.from('consent_logs').insert({
        user_id: userId,
        consent_type: type,
        agreed,
        preferences,
        user_agent: window.navigator.userAgent,
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error logging consent:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Exception logging consent:', e);
      return false;
    }
  };

  return { logConsent };
};