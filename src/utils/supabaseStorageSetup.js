import { supabase } from '@/lib/customSupabaseClient';

/**
 * Checks if the 'cv-uploads' bucket exists and is accessible.
 * @returns {Promise<{status: 'ok' | 'missing' | 'rls_error' | 'error', message: string}>}
 */
export const checkCvUploadBucketStatus = async () => {
  try {
    // Attempt to list the root directory with a limit of 1 to verify access
    const { error } = await supabase.storage.from('cv-uploads').list('', { limit: 1 });

    if (error) {
      const errMsg = error.message?.toLowerCase() || '';
      const errName = error.error?.toLowerCase() || '';
      
      if (
        errMsg.includes('bucket not found') || 
        errName.includes('bucket not found') || 
        error.statusCode === 404 || 
        error.statusCode === 400
      ) {
        return { 
          status: 'missing', 
          message: "Le bucket 'cv-uploads' n'existe pas dans Supabase. Veuillez le créer." 
        };
      }
      
      if (
        error.statusCode === 403 || 
        errMsg.includes('row-level security') || 
        errMsg.includes('permission denied')
      ) {
        return { 
          status: 'rls_error', 
          message: "Erreur de permissions (RLS). Le bucket existe mais vos politiques de sécurité bloquent l'accès." 
        };
      }

      return { status: 'error', message: error.message };
    }

    return { status: 'ok', message: "Bucket configuré et accessible." };
  } catch (err) {
    return { status: 'error', message: err.message || "Erreur réseau lors de la vérification du bucket." };
  }
};