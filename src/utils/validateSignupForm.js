export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, message: "L'email est requis." };
  if (!emailRegex.test(email)) return { isValid: false, message: "Format d'email invalide." };
  return { isValid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: "Le mot de passe est requis.", strength: 0 };
  
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;

  if (password.length < 8) return { isValid: false, message: "8 caractères minimum requis.", strength };
  if (strength < 60) return { isValid: false, message: "Le mot de passe est trop faible (ajoutez majuscules, chiffres, symboles).", strength };

  return { isValid: true, message: "", strength };
};

export const validatePhone = (phone) => {
  if (!phone) return { isValid: true, message: "" }; // Optional
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (!phoneRegex.test(phone)) return { isValid: false, message: "Format de téléphone invalide." };
  return { isValid: true, message: "" };
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `Le champ ${fieldName} est requis.` };
  }
  return { isValid: true, message: "" };
};

export const validateStep1 = (data) => {
  const errors = {};
  if (!validateRequired(data.firstName, "Prénom").isValid) errors.firstName = "Le prénom est requis.";
  if (!validateRequired(data.lastName, "Nom").isValid) errors.lastName = "Le nom est requis.";
  
  const emailVal = validateEmail(data.email);
  if (!emailVal.isValid) errors.email = emailVal.message;

  if (!data.dateOfBirth) errors.dateOfBirth = "La date de naissance est requise.";

  const passVal = validatePassword(data.password);
  if (!passVal.isValid) errors.password = passVal.message;

  if (data.password !== data.confirmPassword) errors.confirmPassword = "Les mots de passe ne correspondent pas.";

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep2 = (data) => {
  const errors = {};
  const phoneVal = validatePhone(data.phone);
  if (!phoneVal.isValid) errors.phone = phoneVal.message;
  // Address fields are optional in this requirements set, but if provided could be validated here.
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep3 = (data) => {
  const errors = {};
  if (!validateRequired(data.professionalStatus, "Statut").isValid) errors.professionalStatus = "Veuillez sélectionner un statut.";
  // Conditional validation based on status could be added here
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep4 = (data) => {
  const errors = {};
  if (!data.interests || data.interests.length === 0) errors.interests = "Sélectionnez au moins un domaine d'intérêt.";
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep5 = (data) => {
  // Goals are optional
  const errors = {};
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep6 = (data) => {
  const errors = {};
  if (!data.acceptPrivacy) errors.acceptPrivacy = "Vous devez accepter la politique de confidentialité.";
  if (!data.acceptDataProcessing) errors.acceptDataProcessing = "Le consentement au traitement des données est requis.";
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStep7 = (data) => {
    // Final review step doesn't strictly have new inputs to validate,
    // but we check if we have everything essential.
    const errors = {};
    if (!data.acceptTerms) errors.acceptTerms = "Veuillez accepter les conditions générales d'utilisation.";
    return { isValid: Object.keys(errors).length === 0, errors };
}