import { supabase } from '@/lib/customSupabaseClient';

/**
 * Utility service for generating secure establishment credentials
 */
export const EstablishmentCodeGenerator = {
  /**
   * Generates a unique 8-character alphanumeric UAI code
   * Format: 7 digits + 1 letter (standard UAI format) or generic 8-char alphanumeric
   * We'll use 8-char alphanumeric (uppercase) to be flexible but distinct
   */
  generateUAICode: () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  /**
   * Generates a secure temporary password
   * Requirements: 12+ chars, uppercase, lowercase, numbers, special chars
   */
  generateTemporaryPassword: (length = 14) => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}';
    
    const allChars = uppercase + lowercase + numbers + special;
    
    // Ensure at least one of each
    let password = [
      uppercase[Math.floor(Math.random() * uppercase.length)],
      lowercase[Math.floor(Math.random() * lowercase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special[Math.floor(Math.random() * special.length)]
    ];
    
    // Fill the rest
    for (let i = 4; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    
    // Shuffle
    return password.sort(() => Math.random() - 0.5).join('');
  },

  /**
   * Checks if a UAI code is unique in the database
   * @param {string} code - The code to check
   * @returns {Promise<boolean>} - True if unique, False if exists
   */
  validateUAIUniqueness: async (code) => {
    if (!code) return false;
    
    try {
      // Check in educational_institutions (using 'code' or 'uai' column)
      // We check both columns just in case of schema variations
      const { data, error } = await supabase
        .from('educational_institutions')
        .select('id')
        .or(`establishment_code.eq.${code},uai.eq.${code}`)
        .maybeSingle();

      if (error) {
        console.error('Error validating UAI uniqueness:', error);
        return false; // Fail safe
      }

      return !data; // If no data found, it is unique
    } catch (err) {
      console.error('Exception in validateUAIUniqueness:', err);
      return false;
    }
  },

  /**
   * Generates a guaranteed unique UAI code by retrying if collision occurs
   * @param {number} maxRetries - Maximum attempts
   * @returns {Promise<string|null>} - The unique code or null if failed
   */
  generateUniqueUAICode: async (maxRetries = 5) => {
    let attempt = 0;
    while (attempt < maxRetries) {
      const code = EstablishmentCodeGenerator.generateUAICode();
      const isUnique = await EstablishmentCodeGenerator.validateUAIUniqueness(code);
      if (isUnique) {
        return code;
      }
      attempt++;
    }
    console.error('Failed to generate unique UAI code after retries');
    return null;
  }
};