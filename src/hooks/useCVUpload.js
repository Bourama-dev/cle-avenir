import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { checkColumnExists } from '@/utils/schemaValidation';

export const useCVUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'missing_bucket', 'rls_error', 'validation', 'network', 'schema_error'

  const uploadCV = async (userId, file) => {
    setUploading(true);
    setUploadProgress(10);
    setError(null);
    setErrorType(null);

    try {
      if (!userId) {
        setErrorType('validation');
        throw new Error("Vous devez être connecté pour uploader un CV.");
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorType('validation');
        throw new Error("Le fichier est trop volumineux. La taille maximale est de 10 Mo.");
      }

      const fileExt = file.name.split('.').pop();
      if (fileExt.toLowerCase() !== 'pdf') {
        setErrorType('validation');
        throw new Error("Seuls les fichiers PDF sont acceptés.");
      }

      const fileName = `cv-${Date.now()}.${fileExt}`;
      // Pattern: {user_id}/{filename} for RLS
      const filePath = `${userId}/${fileName}`;

      setUploadProgress(40);

      // Upload to private bucket
      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        const errMsg = uploadError.message?.toLowerCase() || '';
        const errName = uploadError.error?.toLowerCase() || '';

        if (errMsg.includes('bucket not found') || errName.includes('bucket not found') || uploadError.statusCode === 404 || uploadError.statusCode === 400) {
          setErrorType('missing_bucket');
          throw new Error("Le bucket 'cv-uploads' est introuvable. Une configuration manuelle dans le tableau de bord Supabase est requise.");
        }
        if (uploadError.statusCode === 403 || errMsg.includes('row-level security') || errMsg.includes('permission denied')) {
          setErrorType('rls_error');
          throw new Error("Accès refusé par les politiques de sécurité (RLS). Vérifiez que les permissions INSERT/SELECT sont configurées.");
        }
        
        setErrorType('network');
        throw new Error(`Erreur lors de l'upload : ${uploadError.message}`);
      }

      setUploadProgress(80);

      // Generate a long-lived signed URL because the bucket is PRIVATE
      const { data, error: urlError } = await supabase.storage
        .from('cv-uploads')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year validity

      if (urlError || !data?.signedUrl) {
        setErrorType('network');
        throw new Error(`Erreur lors de la génération du lien sécurisé : ${urlError?.message || 'URL non retournée'}`);
      }

      const fileUrl = data.signedUrl;
      setUploadProgress(90);
      
      // Verify schema before updating profile to prevent unhandled PGRST204 errors
      const hasResumeUrlColumn = await checkColumnExists('profiles', 'resume_url');
      
      if (!hasResumeUrlColumn) {
         setErrorType('schema_error');
         throw new Error("Impossible de lier le CV au profil : la colonne 'resume_url' est manquante dans la base de données. Veuillez contacter le support technique ou lancer la migration.");
      }

      // Update profile with new signed URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: fileUrl, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile Update Error:', updateError);
        if (updateError.code === 'PGRST204') {
          setErrorType('schema_error');
          throw new Error("Impossible de lier le CV au profil : la colonne 'resume_url' est introuvable.");
        }
        setErrorType('network');
        throw new Error(`Erreur lors de la mise à jour de votre profil : ${updateError.message}`);
      }

      setUploadProgress(100);
      setUploading(false);
      return fileUrl;
    } catch (err) {
      console.error('Upload Process Exception Details:', err);
      setError(err.message || 'Une erreur inattendue est survenue lors du téléchargement.');
      setUploading(false);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
    setErrorType(null);
  };

  return { uploadCV, uploading, uploadProgress, error, errorType, clearError };
};