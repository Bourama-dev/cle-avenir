import { supabase } from '@/lib/customSupabaseClient';

/**
 * Generates the full public URL for a blog image.
 * Handles both relative paths from Supabase storage and absolute URLs.
 * 
 * @param {string} imagePath - The image path or URL from the database
 * @returns {string|null} - The full public URL or null if no path provided
 */
export const getPublicBlogImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return it directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, construct the Supabase storage public URL
  const { data } = supabase.storage.from('blog-images').getPublicUrl(imagePath);
  return data?.publicUrl || null;
};