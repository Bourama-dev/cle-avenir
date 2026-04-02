import { supabase } from '@/lib/customSupabaseClient';

export const coverLetterSaveService = {
  async saveCoverLetter(userId, title, content, templateId = 'cl_template_1') {
    if (!userId) throw new Error("User ID is required");
    if (!title || !title.trim()) throw new Error("Title is required");

    try {
      const payload = {
        user_id: userId,
        title: title.trim(),
        content: content,
        template_id: templateId,
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('user_cover_letters')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id, data };
    } catch (error) {
      console.error('Error saving cover letter:', error);
      throw new Error(error.message || 'Failed to save cover letter');
    }
  },

  async loadCoverLetter(letterId, userId) {
    if (!letterId) throw new Error("Cover letter ID is required");
    if (!userId) throw new Error("User ID is required");

    try {
      const { data, error } = await supabase
        .from('user_cover_letters')
        .select('*')
        .eq('id', letterId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Cover letter not found");

      return { success: true, data };
    } catch (error) {
      console.error('Error loading cover letter:', error);
      throw new Error(error.message || 'Failed to load cover letter');
    }
  },

  async listUserCoverLetters(userId) {
    if (!userId) throw new Error("User ID is required");

    try {
      const { data, error } = await supabase
        .from('user_cover_letters')
        .select('id, title, template_id, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error listing cover letters:', error);
      throw new Error(error.message || 'Failed to list cover letters');
    }
  },

  async updateCoverLetter(letterId, userId, updates) {
    if (!letterId) throw new Error("Cover letter ID is required");
    if (!userId) throw new Error("User ID is required");

    try {
      const payload = {
        ...updates,
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('user_cover_letters')
        .update(payload)
        .eq('id', letterId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating cover letter:', error);
      throw new Error(error.message || 'Failed to update cover letter');
    }
  },

  async deleteCoverLetter(letterId, userId) {
    if (!letterId) throw new Error("Cover letter ID is required");
    if (!userId) throw new Error("User ID is required");

    try {
      const { error } = await supabase
        .from('user_cover_letters')
        .delete()
        .eq('id', letterId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      throw new Error(error.message || 'Failed to delete cover letter');
    }
  },

  async duplicateCoverLetter(letterId, userId) {
    if (!letterId) throw new Error("Cover letter ID is required");
    if (!userId) throw new Error("User ID is required");

    try {
      // Load the original cover letter
      const { data: original } = await this.loadCoverLetter(letterId, userId);
      
      // Create a copy with a new title
      const newTitle = `${original.title} (Copie)`;
      const result = await this.saveCoverLetter(
        userId,
        newTitle,
        original.content,
        original.template_id
      );

      return result;
    } catch (error) {
      console.error('Error duplicating cover letter:', error);
      throw new Error(error.message || 'Failed to duplicate cover letter');
    }
  }
};