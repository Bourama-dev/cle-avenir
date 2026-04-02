/**
 * Password Generation and Validation Utilities
 */

/**
 * Generates a secure random password meeting strict criteria
 * @param {number} length - Length of the password (default 16)
 * @returns {string} Generated password
 */
export const generateSecurePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + special;

  // Ensure at least one of each required type
  let password = [
    uppercase[Math.floor(Math.random() * uppercase.length)],
    lowercase[Math.floor(Math.random() * lowercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle the password
  return password.sort(() => Math.random() - 0.5).join('');
};

/**
 * Generates a unique access code based on timestamp and random string
 * @returns {string} Generated access code (e.g., "AC-1234-XYZ")
 */
export const generateAccessCode = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AC-${timestamp}-${random}`;
};

/**
 * Validates a password against security criteria
 * @param {string} password - Password to validate
 * @returns {Object} Validation result { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 12) {
    errors.push("Minimum 12 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins 1 majuscule");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Au moins 1 minuscule");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Au moins 1 chiffre");
  }
  if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
    errors.push("Au moins 1 caractère spécial");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Copies text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};