import React, { createContext, useContext } from 'react';

const PlanLimitationContext = createContext();

// CléAvenir is fully free — every account has unrestricted access.
export const PlanLimitationProvider = ({ children }) => {
  const canViewAllResults = () => true;

  const getVisibleMetierCount = () => Infinity;

  const value = {
    userPlan: 'Premium+',
    isPremium: true,
    canViewAllResults,
    getVisibleMetierCount
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