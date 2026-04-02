import { supabase } from '@/lib/customSupabaseClient';

export const profileService = {
  /**
   * Fetch full user profile
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle infinite recursion specifically (Postgres error 42P17)
        if (error.code === '42P17') {
          console.error('Infinite recursion detected in RLS policies for profiles table.');
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Update profile fields
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === '42P17') {
          console.error('Infinite recursion detected during profile update.');
          throw new Error("Erreur de configuration système (RLS). Veuillez contacter le support.");
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Upload avatar image
   */
  async uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new url
    await this.updateProfile(userId, { avatar_url: publicUrl });
    
    return publicUrl;
  },

  /**
   * Upload CV/Resume
   */
  async uploadResume(userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-cv-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);
    
    await this.updateProfile(userId, { resume_url: publicUrl });
    
    return publicUrl;
  }
};