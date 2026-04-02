import { supabase } from '@/lib/customSupabaseClient';

/**
 * Reinforces career dimensions based on the user's vector
 */
export async function reinforceCareer(romeCode, userVector) {
  if (!romeCode || !userVector) {
    console.warn('[reinforceCareer] Missing romeCode or userVector');
    return false;
  }
  
  try {
    // Rely on the database RPC to handle the increment and capping (0.2 max, 2% increment)
    // We pass the normalized user vector (either RIASEC or full dimensions)
    const { error } = await supabase.rpc('reinforce_career_dimensions', {
      code: romeCode,
      user_vector: userVector
    });
    
    if (error) {
      console.error('[reinforceCareer] Error calling reinforce_career_dimensions:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('[reinforceCareer] Exception during reinforcement:', error);
    return false;
  }
}