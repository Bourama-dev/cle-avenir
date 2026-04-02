import { supabase } from '@/lib/customSupabaseClient';
import { generateSecurePassword } from '@/utils/passwordGenerator';
import bcrypt from 'bcryptjs';

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

  /**
   * Creates a staff member with encrypted password
   */
  createStaff: async (institutionId, email, role = 'manager') => {
    // Generate temporary password
    const tempPassword = generateSecurePassword(12);
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(tempPassword, salt);

    const { data, error } = await supabase
      .from('institution_staff')
      .insert({
        institution_id: institutionId,
        email,
        role,
        encrypted_password: encryptedPassword,
        must_change_password: true,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    return { staff: data, temporaryPassword: tempPassword };
  },

  /**
   * Verifies staff credentials for custom login portal
   */
  loginStaff: async (email, password) => {
    const { data: staff, error } = await supabase
      .from('institution_staff')
      .select('*, institutions(*)')
      .eq('email', email)
      .single();

    if (error || !staff) throw new Error('Identifiants invalides');
    if (staff.status !== 'active') throw new Error('Compte désactivé');

    const isValid = await bcrypt.compare(password, staff.encrypted_password);
    if (!isValid) throw new Error('Identifiants invalides');

    // Update last login
    await supabase
      .from('institution_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id);

    return staff;
  }
};