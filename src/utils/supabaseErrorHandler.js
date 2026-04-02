/**
 * Utility for standardized Supabase error handling and retry logic
 */

export const parseSupabaseError = (error) => {
  if (!error) return "Une erreur inconnue est survenue.";

  // Network errors
  if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
    return "Erreur de connexion réseau. Veuillez vérifier votre connexion internet.";
  }
  if (error.code === 'PGRST000' || error.message?.includes('timeout')) {
    return "Le délai d'attente de la requête a expiré. Veuillez réessayer plus tard.";
  }

  // Database/Query errors
  if (error.code === '23505') {
    return "Cet enregistrement existe déjà (conflit de duplication).";
  }
  if (error.code === '23503') {
    return "Violation de contrainte de clé étrangère. Données liées introuvables.";
  }
  if (error.code === 'PGRST116') {
    return "Données introuvables ou accès refusé.";
  }
  if (error.code === '42P01') {
    return "Table ou ressource introuvable.";
  }

  // Auth errors
  if (error.status === 401 || error.code === 'PGRST301') {
    return "Vous n'êtes pas autorisé à effectuer cette action. Veuillez vous connecter.";
  }

  return error.message || "Erreur lors de la communication avec le serveur.";
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a Supabase query with exponential backoff retry logic
 * @param {Function} queryFn - Function that returns a Supabase query promise
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} baseDelay - Base delay in milliseconds
 */
export const withRetry = async (queryFn, maxRetries = 3, baseDelay = 1000) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await queryFn();
      
      // Supabase returns { data, error }, we need to check error explicitly
      if (result && result.error) {
        throw result.error;
      }
      
      return result;
    } catch (error) {
      attempt++;
      
      // Don't retry on certain errors (like unauthorized or not found)
      if (error.status === 401 || error.code === 'PGRST116' || error.code === '23505') {
        throw error;
      }

      if (attempt >= maxRetries) {
        console.error(`[Supabase Error] Max retries (${maxRetries}) reached:`, error);
        throw error;
      }
      
      const waitTime = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`[Supabase Retry] Attempt ${attempt} failed. Retrying in ${waitTime}ms...`, error.message);
      await delay(waitTime);
    }
  }
};