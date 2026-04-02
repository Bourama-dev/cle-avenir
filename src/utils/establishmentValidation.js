export const validateEstablishmentForm = (email, password) => {
  const errors = {};
  
  // Basic Email Validation (no domain restriction)
  if (!email) {
    errors.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format d'email invalide";
  }

  // Basic Password Validation
  if (!password) {
    errors.password = "Le mot de passe est requis";
  } else if (password.length < 6) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  // Basic email format validation (no domain restriction)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateDomain = (email) => {
  // Domain restrictions removed as per requirements.
  // This function now always returns true.
  return true; 
};