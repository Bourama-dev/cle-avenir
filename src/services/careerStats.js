import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetches statistics for a given ROME code
 */
export async function getCareerStats(romeCode) {
  try {
    const { data, error } = await supabase
      .from('career_statistics')
      .select('*')
      .eq('rome_code', romeCode)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[careerStats] Error fetching stats:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('[careerStats] Exception in getCareerStats:', error);
    return { data: null, error };
  }
}

/**
 * Tracks career display
 */
export async function incrementShown(romeCode) {
  try {
    const { error } = await supabase.rpc('increment_shown', { code: romeCode });
    if (error) {
      console.error('[careerStats] Error in increment_shown:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[careerStats] Exception in incrementShown:', error);
    return false;
  }
}

/**
 * Tracks user actions on careers
 */
export async function incrementAction(romeCode, actionType) {
  if (!['clicked', 'liked', 'chosen'].includes(actionType)) {
    console.error('[careerStats] Invalid action type:', actionType);
    return false;
  }
  
  try {
    const { error } = await supabase.rpc('increment_action', { 
      code: romeCode, 
      action: actionType 
    });
    
    if (error) {
      console.error(`[careerStats] Error in increment_action (${actionType}):`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[careerStats] Exception in incrementAction (${actionType}):`, error);
    return false;
  }
}