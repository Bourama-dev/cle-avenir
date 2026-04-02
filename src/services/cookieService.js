import { supabase } from '@/lib/customSupabaseClient';

const LOCAL_STORAGE_KEY = 'cleavenir_cookie_prefs';

export const cookieService = {
  async saveCookiePreferences(userId, preferences) {
    const defaultPrefs = { essential: true, analytics: false, marketing: false, social: false };
    const mergedPrefs = { ...defaultPrefs, ...preferences, essential: true }; // Enforce essential
    
    // Save to local storage for quick access
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedPrefs));

    // If logged in, save to db
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_cookie_preferences')
          .upsert({
            user_id: userId,
            essential: mergedPrefs.essential,
            analytics: mergedPrefs.analytics,
            marketing: mergedPrefs.marketing,
            social: mergedPrefs.social,
            timestamp: new Date().toISOString()
          });
        
        if (error) throw error;
        
        await supabase.from('rgpd_audit_logs').insert([{
          action: 'COOKIE_PREFERENCES_UPDATE',
          user_id: userId,
          details: mergedPrefs
        }]);

      } catch (err) {
        console.error('Failed to save cookie preferences to DB:', err);
        throw err;
      }
    }
    return mergedPrefs;
  },

  async getCookiePreferences(userId) {
    let prefs = { essential: true, analytics: false, marketing: false, social: false };
    
    // Check local storage first
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      prefs = JSON.parse(local);
    }
    
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('user_cookie_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (data && !error) {
          prefs = { ...prefs, ...data };
          // Sync local storage with DB if DB exists
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
        }
      } catch (err) {
        // Ignore single fetch errors
      }
    }
    return prefs;
  },

  initializeCookieConsent() {
    return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  },

  async updateGlobalCookiePolicy(adminId, policyText, version) {
    try {
      const { data, error } = await supabase
        .from('cookie_policies')
        .insert([{
          policy: policyText,
          updated_by: adminId,
          version: version
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      await supabase.from('rgpd_audit_logs').insert([{
        action: 'GLOBAL_COOKIE_POLICY_UPDATE',
        user_id: adminId,
        details: { version }
      }]);
      
      return data;
    } catch (error) {
      console.error('Error updating global cookie policy:', error);
      throw error;
    }
  }
};