import { useCallback } from 'react';
import { TIERS } from '@/constants/subscriptionTiers';

// CléAvenir is fully free — every account has full access to every feature.
export function useSubscriptionAccess() {
  const hasAccess = useCallback(() => true, []);

  return {
    currentTier: TIERS.PREMIUM_PLUS,
    isPremium: true,
    isPremiumPlus: true,
    loading: false,
    hasAccess
  };
}