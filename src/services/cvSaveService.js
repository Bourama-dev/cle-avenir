import { supabase } from '@/lib/customSupabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { isValidUUID } from '@/utils/uuidValidator';
import { TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';

export const cvSaveService = {
  async saveCv(userId, title, formData, templateId = TEMPLATE_UUIDS.template1) {
    if (!userId) throw new Error("User ID is required");
    if (!isValidUUID(userId)) throw new Error("L'identifiant utilisateur (User ID) n'est pas un UUID valide.");
    if (!title || !title.trim()) throw new Error("Title is required");

    // Ensure templateId is a valid UUID, otherwise fallback to default valid UUID
    const finalTemplateId = isValidUUID(templateId) ? templateId : TEMPLATE_UUIDS.template1;

    try {
      const payload = {
        id: uuidv4(),
        user_id: userId,
        title: title.trim(),
        data: {
          ...formData,
          qualities: formData.qualities || []
        },
        template_id: finalTemplateId,
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('user_cvs')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id, data };
    } catch (error) {
      console.error('Error saving CV:', error);
      throw error;
    }
  },

  async loadCv(cvId, userId) {
    if (!cvId) throw new Error("CV ID is required");
    if (!isValidUUID(cvId)) throw new Error("L'identifiant du CV n'est pas un UUID valide.");
    if (!userId) throw new Error("User ID is required");

    try {
      const { data, error } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('id', cvId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error("CV not found");

      return { success: true, data };
    } catch (error) {
      console.error('Error loading CV:', error);
      throw error;
    }
  },

  async listUserCvs(userId) {
    if (!userId) throw new Error("User ID is required");
    if (!isValidUUID(userId)) throw new Error("L'identifiant utilisateur n'est pas valide.");

    try {
      const { data, error } = await supabase
        .from('user_cvs')
        .select('id, title, template_id, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error listing CVs:', error);
      throw error;
    }
  },

  async updateCv(cvId, userId, updates) {
    if (!cvId) throw new Error("CV ID is required");
    if (!isValidUUID(cvId)) throw new Error("L'identifiant du CV n'est pas un UUID valide.");
    if (!userId) throw new Error("User ID is required");
    if (!isValidUUID(userId)) throw new Error("L'identifiant utilisateur n'est pas valide.");

    const finalTemplateId = updates.template_id && isValidUUID(updates.template_id) 
      ? updates.template_id 
      : (updates.template_id ? TEMPLATE_UUIDS.template1 : undefined);

    try {
      const payload = {
        ...updates,
        ...(finalTemplateId && { template_id: finalTemplateId }),
        data: updates.data ? { ...updates.data, qualities: updates.data.qualities || [] } : undefined,
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('user_cvs')
        .update(payload)
        .eq('id', cvId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating CV:', error);
      throw error;
    }
  },

  async deleteCv(cvId, userId) {
    if (!cvId) throw new Error("CV ID is required");
    if (!isValidUUID(cvId)) throw new Error("L'identifiant du CV n'est pas valide.");
    if (!userId) throw new Error("User ID is required");

    try {
      const { error } = await supabase
        .from('user_cvs')
        .delete()
        .eq('id', cvId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  },

  async duplicateCv(cvId, userId) {
    if (!cvId) throw new Error("CV ID is required");
    if (!isValidUUID(cvId)) throw new Error("L'identifiant du CV n'est pas valide.");
    if (!userId) throw new Error("User ID is required");

    try {
      const { data: original } = await this.loadCv(cvId, userId);
      
      const newTitle = `${original.title} (Copie)`;
      const result = await this.saveCv(
        userId,
        newTitle,
        original.data,
        original.template_id
      );

      return result;
    } catch (error) {
      console.error('Error duplicating CV:', error);
      throw error;
    }
  }
};