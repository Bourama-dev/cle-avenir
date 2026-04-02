import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const PlanLimitationContext = createContext();

export const PlanLimitationProvider = ({ children }) => {
  const { subscriptionTier } = useAuth(); // Usually 'free', 'premium', 'premium_plus'

  const userPlan = useMemo(() => {
    switch (subscriptionTier) {
      case 'premium':
        return 'Premium';
      case 'premium_plus':
        return 'Premium+';
      case 'free':
      default:
        return 'Découverte';
    }
  }, [subscriptionTier]);

  const isPremium = useMemo(() => {
    return userPlan === 'Premium' || userPlan === 'Premium+';
  }, [userPlan]);

  const canViewAllResults = () => {
    return isPremium;
  };

  const getVisibleMetierCount = () => {
    return isPremium ? Infinity : 3;
  };

  const value = {
    userPlan,
    isPremium,
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