import { supabase } from '@/lib/customSupabaseClient';

/**
 * Simple debug logger for auth events
 * @param {string} context - The context or location of the log
 * @param {any} data - Optional data to log
 */
export const debugAuth = (context, data) => {
  // Only log in development
  if (import.meta.env.DEV) {
    console.groupCollapsed(`🔐 [Auth Debug] ${context}`);
    if (data) console.log('Data:', data);
    console.groupEnd();
  }
};

/**
 * Utility functions for debugging authentication flow.
 * NOTE: These should only be used in development.
 */
export const AuthDebug = {
  /**
   * Logs current session details
   */
  async checkSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    console.group('Auth Debug - Session');
    if (error) console.error('Error:', error);
    else console.log('Session:', session);
    console.groupEnd();
    return session;
  },

  /**
   * Simulates email confirmation in dev environment
   * (Note: Real email confirmation requires clicking the actual email link)
   * This simply forces a user update which might trigger observers.
   */
  async simulateConfirmationCheck() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current User Status:', user?.email_confirmed_at ? 'Confirmed' : 'Pending');
    return user;
  },
  
  /**
   * Helper to manually construct the callback URL for testing
   */
  getCallbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }
};