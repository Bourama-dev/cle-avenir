import { supabase } from '@/lib/customSupabaseClient';
import { handleStorageError } from '@/services/storageErrorHandler';

export const storageService = {
  async uploadBlogImage(file) {
    try {
      console.log('Starting image upload process...', { fileName: file?.name, size: file?.size });
      
      if (!file) throw new Error('Aucun fichier fourni.');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const bucketName = 'blog-images';
      const filePath = `blog-covers/${fileName}`;

      console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error details:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, generating public URL...');

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const finalUrl = publicUrlData.publicUrl;
      console.log('Generated public URL:', finalUrl);
      
      return finalUrl;
    } catch (error) {
      handleStorageError(error, 'uploadBlogImage');
    }
  },

  async deleteBlogImage(imageUrl) {
    try {
      if (!imageUrl) return;
      
      console.log('Attempting to delete image:', imageUrl);
      
      // Extract file path from URL
      const bucketName = 'blog-images';
      const urlParts = imageUrl.split(`/${bucketName}/`);
      if (urlParts.length !== 2) {
        console.warn('Could not parse image URL for deletion:', imageUrl);
        return;
      }
      
      const filePath = urlParts[1];
      console.log(`Deleting from bucket: ${bucketName}, path: ${filePath}`);
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
        
      if (error) throw error;
      
      console.log('Image deleted successfully.');
    } catch (error) {
      handleStorageError(error, 'deleteBlogImage');
    }
  }
};