import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentActivationService = {
  // --- Core Generators ---
  
  // Generate code: CODE-XXXX-XXXX
  generateEstablishmentCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CODE-${part1}-${part2}`;
  },

  // Generate password: 12 chars mixed
  generateActivationPassword() {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const all = upper + lower + numbers;
    
    let password = '';
    // Ensure at least one of each
    password += upper.charAt(Math.floor(Math.random() * upper.length));
    password += lower.charAt(Math.floor(Math.random() * lower.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    
    for (let i = 0; i < 9; i++) {
      password += all.charAt(Math.floor(Math.random() * all.length));
    }
    
    // Shuffle
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  },

  // --- Security Utils ---

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },
  
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  maskPassword(password) {
    if (!password) return '••••••••';
    if (password.length <= 4) return '••••';
    return password.substring(0, 2) + '••••••' + password.substring(password.length - 2);
  },

  formatCode(code) {
    return code || '----';
  },

  // --- Validations ---

  validateEmailDomain(email) {
    if (!email) return false;
    const domain = email.split('@')[1];
    return domain === 'ac-versailles.fr'; // Specific requirement
  },

  validateEstablishmentCode(code) {
    const regex = /^CODE-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(code);
  },

  validateActivationPassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password && password.length >= 8 && hasUpper && hasLower && hasNumber;
  },

  // --- Database Operations ---

  async getEstablishmentByCode(code) {
    // Ensure no joins are used here
    const { data, error } = await supabase
      .from('educational_institutions')
      .select('id, name, city')
      .eq('establishment_code', code)
      // Removed check for non-existent column 'activation_status'
      .single();
    
    if (error) throw error;
    return data;
  },

  async recordLoginAttempt(establishmentId, email, success, failureReason = null) {
    // Fixed: Use existing table establishment_activity_logs instead of missing establishment_login_logs
    const { error } = await supabase
      .from('establishment_activity_logs')
      .insert({
        establishment_id: establishmentId,
        action: 'LOGIN_ATTEMPT',
        details: {
            email,
            success,
            failure_reason: failureReason,
            user_agent: navigator.userAgent
        },
        created_at: new Date().toISOString()
      });
      
    if (error) console.error("Failed to log login attempt:", error);
  },

  async getLoginHistory(establishmentId) {
    // Fixed: Use existing table establishment_activity_logs
    const { data, error } = await supabase
      .from('establishment_activity_logs')
      .select('*')
      .eq('establishment_id', establishmentId)
      .eq('action', 'LOGIN_ATTEMPT')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  },
  
  async activateEstablishment(id, initialCode, initialPasswordHash, creatorId) {
    const { error } = await supabase
      .from('educational_institutions')
      .update({
        establishment_code: initialCode,
        activation_password: initialPasswordHash,
        // Removed update to non-existent column 'activation_status'
        updated_at: new Date()
      })
      .eq('id', id);

    if (error) throw error;

    // Log history
    await Promise.all([
      supabase.from('establishment_code_history').insert({
        establishment_id: id,
        code: initialCode,
        created_by: creatorId
      }),
      supabase.from('establishment_password_history').insert({
        establishment_id: id,
        password_hash: initialPasswordHash,
        created_by: creatorId
      })
    ]);
  }
};