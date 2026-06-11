import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CLEO_FREE_LIMIT = 5;
const CLEO_CREDITS_KEY = 'cleo_free_credits_used';

const PlanLimitationContext = createContext();

export const PlanLimitationProvider = ({ children }) => {
  const { subscriptionTier } = useAuth();

  const userPlan = useMemo(() => {
    switch (subscriptionTier) {
      case 'premium':      return 'Premium';
      case 'premium_plus': return 'Premium+';
      default:             return 'Découverte';
    }
  }, [subscriptionTier]);

  const isPremium = userPlan === 'Premium' || userPlan === 'Premium+';

  // ── Cleo credits (plan gratuit uniquement) ─────────────────────────────────
  const [cleoCreditsUsed, setCleoCreditsUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(CLEO_CREDITS_KEY) || '0', 10); }
    catch { return 0; }
  });

  const cleoCreditsRemaining = isPremium
    ? Infinity
    : Math.max(0, CLEO_FREE_LIMIT - cleoCreditsUsed);

  const hasCleoCredits = useCallback(
    () => isPremium || cleoCreditsUsed < CLEO_FREE_LIMIT,
    [isPremium, cleoCreditsUsed]
  );

  const consumeCleoCredit = useCallback(() => {
    if (isPremium) return;
    const next = cleoCreditsUsed + 1;
    setCleoCreditsUsed(next);
    try { localStorage.setItem(CLEO_CREDITS_KEY, String(next)); } catch {}
  }, [isPremium, cleoCreditsUsed]);

  const canViewAllResults  = useCallback(() => isPremium, [isPremium]);
  const getVisibleMetierCount = useCallback(() => isPremium ? Infinity : 3, [isPremium]);

  const value = {
    userPlan,
    isPremium,
    canViewAllResults,
    getVisibleMetierCount,
    cleoCreditsRemaining,
    cleoCreditsUsed,
    cleoFreeLimit: CLEO_FREE_LIMIT,
    hasCleoCredits,
    consumeCleoCredit,
  };

  return (
    <PlanLimitationContext.Provider value={value}>
      {children}
    </PlanLimitationContext.Provider>
  );
};

export const usePlanLimitation = () => {
  const context = useContext(PlanLimitationContext);
  if (context === undefined) {
    throw new Error('usePlanLimitation must be used within a PlanLimitationProvider');
  }
  return context;
};
