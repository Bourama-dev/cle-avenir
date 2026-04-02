/**
 * Parses Supabase storage errors and returns user-friendly messages
 * @param {Error|object} error 
 * @returns {string}
 */
export const parseStorageError = (error) => {
  if (!error) return "Une erreur inconnue s'est produite lors du téléchargement.";
  
  const status = error.statusCode || error.status;
  const message = error.message?.toLowerCase() || '';

  if (status === 404 || message.includes('not found')) {
    return "Le dossier ou le fichier de destination n'a pas été trouvé (Erreur 404).";
  }
  
  if (status === 403 || message.includes('unauthorized') || message.includes('permission denied')) {
    return "Vous n'avez pas les permissions nécessaires pour uploader ce fichier (Erreur 403).";
  }
  
  if (status === 400 || message.includes('mime type')) {
    return "Le type de fichier n'est pas supporté (Erreur 400).";
  }

  if (message.includes('payload too large')) {
    return "Le fichier est trop volumineux.";
  }

  return `Erreur de stockage: ${error.message || "Échec de l'opération"}`;
};

/**
 * Logs storage errors for debugging
 * @param {string} context 
 * @param {Error|object} error 
 */
export const logStorageError = (context, error) => {
  console.error(`[Storage Error - ${context}]:`, {
    message: error.message,
    status: error.statusCode || error.status,
    details: error,
    timestamp: new Date().toISOString()
  });
};

/**
 * Centralized error handler for storage operations
 * @param {Error|object} error 
 * @param {string} context 
 * @throws {Error} Throws a standardized error with a user-friendly message
 */
export const handleStorageError = (error, context = 'Storage Operation') => {
  logStorageError(context, error);
  const friendlyMessage = parseStorageError(error);
  throw new Error(friendlyMessage);
};