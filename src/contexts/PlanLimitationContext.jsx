import React, { createContext, useContext, useState, useCallback } from 'react';

const CLEO_FREE_LIMIT = 5;
const CLEO_CREDITS_KEY = 'cleo_free_credits_used';

const PlanLimitationContext = createContext();

// CléAvenir is fully free — every account has unrestricted access.
export const PlanLimitationProvider = ({ children }) => {
  const [cleoCreditsUsed, setCleoCreditsUsed] = useState(() => {
    try { return parseInt(localStorage.getItem(CLEO_CREDITS_KEY) || '0', 10); }
    catch { return 0; }
  });

  const isPremiumPlus = true;

  const canViewAllResults = () => true;
  const getVisibleMetierCount = () => Infinity;
  const cleoCreditsRemaining = Infinity;
  const hasCleoCredits = useCallback(() => true, []);
  const consumeCleoCredit = useCallback(() => {}, []);

  const value = {
    userPlan: 'Premium+',
    isPremium: true,
    isPremiumPlus,
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
