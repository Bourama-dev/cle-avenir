import { supabase } from '@/lib/customSupabaseClient';

export const institutionService = {
  /**
   * Generates a unique institution code
   * Format: INST-XXXXX-XXXXX (12 chars total entropy)
   */
  generateCode: () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1 to avoid confusion
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `INST-${result.substring(0, 5)}-${result.substring(5)}`;
  },

  /**
   * Creates a new institution
   */
  createInstitution: async (data) => {
    const { data: institution, error } = await supabase
      .from('institutions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return institution;
  },

  /**
   * Validates a code for signup
   */
  validateCode: async (code) => {
    if (!code) return { valid: false, message: 'Code manquant' };

    const { data, error } = await supabase
      .from('institution_codes')
      .select('*, institutions(name)')
      .eq('code', code)
      .single();

    if (error || !data) return { valid: false, message: 'Code invalide' };
    
    if (data.status !== 'active') return { valid: false, message: 'Ce code n\'est plus actif' };
    
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, message: 'Ce code a expiré' };
    }

    if (data.max_uses > 0 && data.usage_count >= data.max_uses) {
      return { valid: false, message: 'Ce code a atteint sa limite d\'utilisation' };
    }

    return { valid: true, institution: data.institutions, codeData: data };
  },

  /**
   * Links a user to an institution using a validated code
   */
  linkUserToInstitution: async (userId, code) => {
    const validation = await institutionService.validateCode(code);
    if (!validation.valid) throw new Error(validation.message);

    const { codeData } = validation;

    // 1. Create Link
    const { error: linkError } = await supabase
      .from('user_institution_links')
      .insert({
        user_id: userId,
        institution_id: codeData.institution_id,
        code_used: code
      });

    if (linkError) {
      // Ignore duplicate key errors (user already linked)
      if (linkError.code !== '23505') throw linkError;
    }

    // 2. Increment Usage
    const newCount = (codeData.usage_count || 0) + 1;
    const updates = { usage_count: newCount };
    
    // Check if max usage reached
    if (codeData.max_uses > 0 && newCount >= codeData.max_uses) {
      updates.status = 'used';
    }

    await supabase
      .from('institution_codes')
      .update(updates)
      .eq('id', codeData.id);

    return { success: true, institutionName: validation.institution.name };
  },

};