// CléAvenir is fully free — every account sees the full, unblurred results.
export const filterMetiersByPlan = (metiers) => {
  if (!metiers || !Array.isArray(metiers)) return { full: [], blurred: [] };

  return {
    full: metiers,
    blurred: []
  };
};

export const getUnlockMessage = () => null;

export const canViewFullDetails = () => true;