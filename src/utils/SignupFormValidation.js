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

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `Ce champ est requis.` };
  }
  return { isValid: true, message: "" };
};

export const validatePhone = (phone) => {
  if (!phone) return { isValid: true, message: "" };
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (!phoneRegex.test(phone)) return { isValid: false, message: "Format de téléphone invalide." };
  return { isValid: true, message: "" };
};

export const validateDateOfBirth = (date) => {
  if (!date) return { isValid: false, message: "La date de naissance est requise." };
  
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 16) return { isValid: false, message: "Vous devez avoir au moins 16 ans." };
  return { isValid: true, message: "" };
};

export const validateEstablishmentCode = (code) => {
  if (!code) return { isValid: true, message: "" }; // Optional
  const formatRegex = /^[A-Z0-9-]{3,20}$/i;
  if (!formatRegex.test(code.trim())) {
    return { isValid: false, message: "Format invalide (Alphanumérique uniquement)" };
  }
  return { isValid: true, message: "" };
};

export const validateStep = (step, data) => {
  const errors = {};
  
  switch(step) {
    case 1: // Identifiants
      const emailVal = validateEmail(data.email);
      if (!emailVal.isValid) errors.email = emailVal.message;
      
      const passVal = validatePassword(data.password);
      if (!passVal.isValid) errors.password = passVal.message;
      
      if (data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "Les mots de passe ne correspondent pas.";
      }
      break;

    case 2: // Informations Personnelles
      if (!data.firstName?.trim()) errors.firstName = "Le prénom est requis.";
      if (!data.lastName?.trim()) errors.lastName = "Le nom est requis.";
      
      const dobVal = validateDateOfBirth(data.dateOfBirth);
      if (!dobVal.isValid) errors.dateOfBirth = dobVal.message;
      
      const phoneVal = validatePhone(data.phone);
      if (!phoneVal.isValid) errors.phone = phoneVal.message;
      break;

    case 3: // Localisation
      if (!data.address?.trim()) errors.address = "L'adresse est requise.";
      if (!data.city?.trim()) errors.city = "La ville est requise.";
      if (!data.postalCode?.trim()) errors.postalCode = "Le code postal est requis.";
      if (!data.country?.trim()) errors.country = "Le pays est requis.";
      break;

    case 4: // Profil Professionnel
      if (!data.status) errors.status = "Veuillez sélectionner votre situation.";
      if (!data.educationLevel) errors.educationLevel = "Veuillez sélectionner votre niveau d'études.";
      if (!data.interests || data.interests.length === 0) errors.interests = "Sélectionnez au moins un centre d'intérêt.";
      break;

    case 5: // Compétences & Objectifs
      if (!data.careerGoals?.trim()) errors.careerGoals = "Vos objectifs sont requis.";
      // Skills are optional but recommended
      if (!data.salaryRange || !Array.isArray(data.salaryRange) || data.salaryRange.length !== 2) {
        errors.salaryRange = "Veuillez indiquer une fourchette de salaire.";
      }
      
      // Establishment code validation (Optional)
      if (data.establishmentCode) {
        const codeVal = validateEstablishmentCode(data.establishmentCode);
        if (!codeVal.isValid) errors.establishmentCode = codeVal.message;
      }
      break;

    case 6: // Préférences
      if (!data.workPreferences?.remote) errors.remote = "Veuillez indiquer votre préférence de télétravail.";
      break;

    case 7: // Validation
      if (!data.termsAccepted) errors.termsAccepted = "Vous devez accepter les conditions générales.";
      break;

    default:
      break;
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};