export const filterMetiersByPlan = (metiers, userPlan) => {
  if (!metiers || !Array.isArray(metiers)) return { full: [], blurred: [] };
  
  if (userPlan === 'premium') {
    return {
      full: metiers.slice(0, 10),
      blurred: []
    };
  }

  // Discovery plan
  return {
    full: metiers.slice(0, 3),
    blurred: metiers.slice(3, 8)
  };
};

export const getUnlockMessage = (plan) => {
  if (plan === 'premium') return null;
  return "Upgrade to Premium to unlock all your personalized career matches and detailed insights!";
};

export const canViewFullDetails = (plan, metierIndex) => {
  if (plan === 'premium') return true;
  return metierIndex < 3;
};