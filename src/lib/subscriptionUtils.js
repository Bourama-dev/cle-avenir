/**
 * Utility functions for subscription management and display
 */

export const PLAN_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  PREMIUM_PLUS: 'premium_plus'
};

export const PLAN_DISPLAY_NAMES = {
  [PLAN_TYPES.FREE]: 'Gratuit',
  [PLAN_TYPES.PREMIUM]: 'Premium',
  [PLAN_TYPES.PREMIUM_PLUS]: 'Premium+'
};

/**
 * Returns the human-readable name for a subscription plan
 * @param {string} planType - The internal plan type (free, premium, premium_plus)
 * @returns {string} - The display name (Gratuit, Premium, Premium+)
 */
export const getDisplayPlanName = (planType) => {
  if (!planType) return PLAN_DISPLAY_NAMES[PLAN_TYPES.FREE];
  
  // Normalize input
  const normalizedType = planType.toLowerCase().trim();
  
  return PLAN_DISPLAY_NAMES[normalizedType] || 
         (normalizedType.includes('plus') ? 'Premium+' : 
          normalizedType.includes('premium') ? 'Premium' : 'Gratuit');
};

/**
 * CléAvenir is fully free — every account has access to every feature.
 * @returns {boolean}
 */
export const hasAccess = () => true;