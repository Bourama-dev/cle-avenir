import { supabase } from '@/lib/customSupabaseClient';

export const cvStorageService = {
  async uploadCVFile(userId, file) {
    if (!userId || !file) throw new Error("userId and file are required");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('cv-uploads')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('cv-uploads')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicUrlData.publicUrl,
      fileName: file.name
    };
  }
};