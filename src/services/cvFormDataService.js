import { supabase } from '@/lib/customSupabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { isValidUUID } from '@/utils/uuidValidator';
import { TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';

export const cvFormDataService = {
  /**
   * Fetches user profile data to pre-fill CV forms
   */
  async fetchUserData(userId) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("L'identifiant utilisateur n'est pas un UUID valide.");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        throw error;
      }
      
      const formattedData = {
         fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
         email: data.email || '',
         phone: data.phone || '',
         address: data.location || '',
         summary: data.bio || data.motivation || '',
         experience: data.experience || [],
         education: data.education || [],
         skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''),
         qualities: []
      };
      
      return { success: true, data: formattedData };
    } catch (error) {
      console.error('[cvFormDataService] fetchUserData error:', error);
      return { success: false, error: error.message || 'Failed to fetch user data' };
    }
  },

  /**
   * Saves or updates CV form data
   */
  async saveUserData(userId, formData, cvId = null, templateId = null) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("L'identifiant utilisateur n'est pas un UUID valide.");
      if (cvId && !isValidUUID(cvId)) throw new Error("L'identifiant du CV n'est pas un UUID valide.");
      
      const finalTemplateId = (templateId && isValidUUID(templateId)) ? templateId : TEMPLATE_UUIDS.template1;
      
      let result;
      if (cvId) {
        const { data, error } = await supabase
          .from('user_cvs')
          .update({ 
            data: formData, 
            template_id: finalTemplateId, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', cvId)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('user_cvs')
          .insert({
            id: uuidv4(),
            user_id: userId,
            title: formData.fullName ? `CV de ${formData.fullName}` : 'Nouveau CV',
            data: formData,
            template_id: finalTemplateId,
            is_active: false
          })
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      return { success: true, data: result };
    } catch (error) {
      console.error('[cvFormDataService] saveUserData error:', error);
      return { success: false, error: error.message || 'Failed to save user CV data' };
    }
  },

  /**
   * Updates specific user profile data
   */
  async updateUserData(userId, data) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("Invalid User UUID");
      
      const { data: result, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('[cvFormDataService] updateUserData error:', error);
      return { success: false, error: error.message || 'Failed to update user data' };
    }
  },

  /**
   * Deletes specific user data (e.g., all CVs)
   */
  async deleteUserData(userId, dataType) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("Invalid User UUID");
      
      if (dataType === 'cvs') {
        const { error } = await supabase
          .from('user_cvs')
          .delete()
          .eq('user_id', userId);
          
        if (error) throw error;
      }
      return { success: true };
    } catch (error) {
      console.error('[cvFormDataService] deleteUserData error:', error);
      return { success: false, error: error.message || `Failed to delete ${dataType}` };
    }
  },

  /**
   * Fetches all CVs for a user
   */
  async fetchUserCVs(userId) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("Invalid User UUID");
      
      const { data, error } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('[cvFormDataService] fetchUserCVs error:', error);
      return { success: false, error: error.message || 'Failed to fetch user CVs' };
    }
  },

  /**
   * Saves newly uploaded/extracted CV data
   */
  async saveCVData(userId, extractedData, fileUrl = null, fileName = null, makeActive = true) {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!isValidUUID(userId)) throw new Error("Invalid User UUID");

      if (makeActive) {
        await supabase.from('user_cvs').update({ is_active: false }).eq('user_id', userId);
      }

      const { data, error } = await supabase.from('user_cvs').insert({
        id: uuidv4(),
        user_id: userId,
        extracted_data: extractedData,
        data: extractedData,
        file_url: fileUrl,
        file_name: fileName,
        title: fileName || 'Nouveau CV',
        is_active: makeActive,
        template_id: TEMPLATE_UUIDS.template1,
        updated_at: new Date().toISOString()
      }).select().single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[cvFormDataService] saveCVData error:', error);
      return { success: false, error: error.message || 'Failed to save CV data' };
    }
  },

  /**
   * Updates an existing uploaded CV
   */
  async updateCVData(cvId, extractedData) {
    try {
      if (!cvId) throw new Error("CV ID is required");
      if (!isValidUUID(cvId)) throw new Error("Invalid CV UUID");
      
      const { data, error } = await supabase
        .from('user_cvs')
        .update({ 
          extracted_data: extractedData, 
          data: extractedData, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', cvId)
        .select()
        .single();
        
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[cvFormDataService] updateCVData error:', error);
      return { success: false, error: error.message || 'Failed to update CV data' };
    }
  },

  /**
   * Deletes a specific CV
   */
  async deleteCV(cvId) {
    try {
      if (!cvId) throw new Error("CV ID is required");
      if (!isValidUUID(cvId)) throw new Error("Invalid CV UUID");
      
      const { error } = await supabase.from('user_cvs').delete().eq('id', cvId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[cvFormDataService] deleteCV error:', error);
      return { success: false, error: error.message || 'Failed to delete CV' };
    }
  },

  /**
   * Sets a specific CV as active
   */
  async setActiveCV(userId, cvId) {
    try {
      if (!userId || !cvId) throw new Error("User ID and CV ID are required");
      if (!isValidUUID(userId) || !isValidUUID(cvId)) throw new Error("Invalid UUIDs provided");
      
      await supabase.from('user_cvs').update({ is_active: false }).eq('user_id', userId);
      const { data, error } = await supabase.from('user_cvs').update({ is_active: true }).eq('id', cvId).select().single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[cvFormDataService] setActiveCV error:', error);
      return { success: false, error: error.message || 'Failed to set active CV' };
    }
  }
};