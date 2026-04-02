export const validateCVData = (data) => {
  const errors = {};
  const warnings = {};

  // Personal Info Validation
  if (!data?.personal_info?.name) {
    errors.name = 'Le nom est requis';
  }
  
  if (data?.personal_info?.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.personal_info.email)) {
      errors.email = 'Format d\'email invalide';
    }
  } else {
    warnings.email = 'Email manquant';
  }

  if (data?.personal_info?.phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(data.personal_info.phone)) {
      warnings.phone = 'Format de téléphone potentiellement invalide';
    }
  }

  // Arrays Validation
  if (!data?.experiences || data.experiences.length === 0) {
    warnings.experiences = 'Aucune expérience détectée';
  } else {
    data.experiences.forEach((exp, idx) => {
      if (!exp.position) errors[`exp_${idx}_position`] = 'Le titre du poste est requis';
      if (!exp.company) errors[`exp_${idx}_company`] = 'L\'entreprise est requise';
      // Basic date check
      if (exp.start_date && exp.end_date) {
        if (new Date(exp.start_date) > new Date(exp.end_date)) {
          errors[`exp_${idx}_dates`] = 'La date de début doit être antérieure à la date de fin';
        }
      }
    });
  }

  if (!data?.education || data.education.length === 0) {
    warnings.education = 'Aucune formation détectée';
  }

  if (!data?.skills || data.skills.length === 0) {
    warnings.skills = 'Aucune compétence détectée';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};