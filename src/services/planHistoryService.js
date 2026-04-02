import { supabase } from '@/lib/customSupabaseClient';
import { planManagementService } from './planManagementService';

export const planHistoryService = {
  async getAllPlans(userId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planHistoryService] Error getting all plans:', error);
      return { success: false, error, data: [] };
    }
  },

  async getArchivedPlans(userId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'archived')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planHistoryService] Error getting archived plans:', error);
      return { success: false, error, data: [] };
    }
  },

  async restorePlan(userId, planId) {
    try {
      // First, archive current active plan if any
      const activeRes = await planManagementService.getActivePlan(userId);
      if (activeRes.data) {
        await planManagementService.archivePlan(activeRes.data.id);
      }

      // Then restore the selected one
      const { data, error } = await supabase
        .from('personalized_plans')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planHistoryService] Error restoring plan:', error);
      return { success: false, error };
    }
  },

  async deletePlan(planId) {
    try {
      const { error } = await supabase
        .from('personalized_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('[planHistoryService] Error deleting plan:', error);
      return { success: false, error };
    }
  },

  async exportPlan(planId) {
    // In a real scenario, this might generate a PDF using a library like jsPDF.
    // For this implementation, we will fetch the data and return a JSON structure 
    // that the UI can download as a file or open in a new window.
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      
      const planDataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([planDataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `plan_personnalise_${data.selected_metier_code}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error('[planHistoryService] Error exporting plan:', error);
      return { success: false, error };
    }
  }
};