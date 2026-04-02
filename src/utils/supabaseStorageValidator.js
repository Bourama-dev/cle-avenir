import { supabase } from '@/lib/customSupabaseClient';

/**
 * Validates if a bucket exists and is accessible
 * @param {string} bucketName 
 * @returns {Promise<boolean>}
 */
export const checkBucketExists = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error(`Bucket validation error for ${bucketName}:`, error.message);
      return false;
    }
    return !!data;
  } catch (err) {
    console.error(`Exception checking bucket ${bucketName}:`, err);
    return false;
  }
};

/**
 * Validates bucket permissions (placeholder for actual permission check, typically done by attempting an operation)
 * @param {string} bucketName 
 * @returns {Promise<boolean>}
 */
export const validateBucketPermissions = async (bucketName) => {
  try {
    // Attempting to list files with limit 1 as a lightweight permission check
    const { error } = await supabase.storage.from(bucketName).list('', { limit: 1 });
    if (error) {
      console.error(`Permission validation error for ${bucketName}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Exception checking permissions for ${bucketName}:`, err);
    return false;
  }
};

/**
 * Generates correct public URL for different bucket types
 * @param {string} bucketName 
 * @param {string} path 
 * @returns {string|null}
 */
export const generatePublicUrl = (bucketName, path) => {
  if (!bucketName || !path) return null;
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data?.publicUrl || null;
};