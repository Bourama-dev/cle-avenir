export const isEUUser = (country) => {
  const euCountries = [
    'France', 'Germany', 'Italy', 'Spain', 'Belgium', 'Netherlands', 'Portugal', 
    'Sweden', 'Austria', 'Denmark', 'Finland', 'Ireland', 'Poland', 'Greece', 
    'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Slovakia', 'Croatia', 
    'Lithuania', 'Latvia', 'Slovenia', 'Estonia', 'Cyprus', 'Luxembourg', 'Malta',
    'FR', 'DE', 'IT', 'ES', 'BE', 'NL', 'PT', 'SE', 'AT', 'DK', 'FI', 'IE', 'PL', 
    'GR', 'CZ', 'HU', 'RO', 'BG', 'SK', 'HR', 'LT', 'LV', 'SI', 'EE', 'CY', 'LU', 'MT'
  ];
  // Default to France/EU if not specified or 'France' is selected
  return !country || country === 'France' || euCountries.includes(country);
};

export const getConsentRequirements = (country) => {
  const isEU = isEUUser(country);
  return {
    essential: true, // Always required
    marketing: true, // Explicit opt-in required generally
    analytics: isEU, // Strict opt-in for EU
  };
};

export const validateConsent = (consentData, country) => {
  const requirements = getConsentRequirements(country);
  
  if (requirements.essential && !consentData.essential) {
    return { 
      valid: false, 
      error: "Le consentement au traitement des données essentielles est requis pour créer un compte." 
    };
  }
  
  return { valid: true };
};