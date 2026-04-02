import { supabase } from '@/lib/customSupabaseClient';

/**
 * Validates an establishment code and checks its existence in the database.
 * @param {string} code - The establishment code to validate
 * @returns {Promise<{isValid: boolean, institution: object|null, message: string}>}
 */
export const verifyEstablishmentCode = async (code) => {
  if (!code || typeof code !== 'string') {
    return { isValid: false, institution: null, message: "Code vide" };
  }

  const cleanCode = code.trim().toUpperCase();

  // 1. Format Validation (Alphanumeric, 3-20 chars)
  const formatRegex = /^[A-Z0-9-]{3,20}$/;
  if (!formatRegex.test(cleanCode)) {
    return { 
      isValid: false, 
      institution: null, 
      message: "Format invalide (Lettres, chiffres et tirets uniquement)" 
    };
  }

  try {
    // 2. Check in 'institutions' table (matches profiles.institution_id FK)
    const { data: institutions, error } = await supabase
      .from('institutions')
      .select('id, name, city, uai, code')
      .or(`uai.eq.${cleanCode},code.eq.${cleanCode}`)
      .limit(1);

    if (error) throw error;

    if (institutions && institutions.length > 0) {
      return { 
        isValid: true, 
        institution: institutions[0], 
        message: "Établissement trouvé !" 
      };
    }

    // Optional: Fallback check in 'educational_institutions' if distinct
    const { data: eduInstitutions, error: eduError } = await supabase
      .from('educational_institutions')
      .select('id, name, city, uai, code')
      .or(`uai.eq.${cleanCode},code.eq.${cleanCode}`)
      .limit(1);

    if (eduError) throw eduError;

    if (eduInstitutions && eduInstitutions.length > 0) {
       return { 
        isValid: true, 
        institution: eduInstitutions[0], 
        message: "Établissement trouvé !" 
      };
    }

    return { 
      isValid: false, 
      institution: null, 
      message: "Aucun établissement trouvé avec ce code." 
    };

  } catch (err) {
    console.error("Error validating establishment code:", err);
    return { 
      isValid: false, 
      institution: null, 
      message: "Erreur de connexion lors de la vérification." 
    };
  }
};