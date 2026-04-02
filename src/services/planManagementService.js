import { supabase } from '@/lib/customSupabaseClient';

export const planManagementService = {
  async getActivePlan(userId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error getting active plan:', error);
      return { success: false, error, data: null };
    }
  },

  async getPlanDetails(planId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error getting plan details:', error);
      return { success: false, error };
    }
  },

  async createPlanFromMetier(userId, metierCode, metierName) {
    try {
      const activeRes = await this.getActivePlan(userId);
      if (activeRes.data) {
        return { success: false, error: 'ACTIVE_PLAN_EXISTS', activePlan: activeRes.data };
      }

      const defaultMilestones = [
        { id: 1, title: 'Découverte du métier', completed: false },
        { id: 2, title: 'Recherche de formations', completed: false },
        { id: 3, title: 'Création du CV et Lettre de motivation', completed: false },
        { id: 4, title: 'Candidatures spontanées', completed: false }
      ];

      const { data, error } = await supabase
        .from('personalized_plans')
        .insert({
          user_id: userId,
          status: 'active',
          selected_metier_code: metierCode,
          selected_metier_name: metierName,
          milestones: defaultMilestones,
          progress_percentage: 0
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error creating plan:', error);
      return { success: false, error };
    }
  },

  async archivePlan(planId) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error archiving plan:', error);
      return { success: false, error };
    }
  },

  async replacePlan(userId, newMetierCode, newMetierName) {
    try {
      const activeRes = await this.getActivePlan(userId);
      if (activeRes.data) {
        await this.archivePlan(activeRes.data.id);
      }
      return await this.createPlanFromMetier(userId, newMetierCode, newMetierName);
    } catch (error) {
      console.error('[planManagementService] Error replacing plan:', error);
      return { success: false, error };
    }
  },

  async updatePlanProgress(planId, progressPercentage) {
    try {
      const { data, error } = await supabase
        .from('personalized_plans')
        .update({ progress_percentage: progressPercentage, updated_at: new Date().toISOString() })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error updating progress:', error);
      return { success: false, error };
    }
  },

  async addMilestone(planId, milestone) {
    try {
      const { data: plan } = await this.getPlanDetails(planId);
      if (!plan) throw new Error('Plan not found');

      const milestones = plan.milestones || [];
      const newMilestone = { 
        ...milestone, 
        id: Date.now(), 
        completed: false 
      };

      const { data, error } = await supabase
        .from('personalized_plans')
        .update({ 
          milestones: [...milestones, newMilestone],
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error adding milestone:', error);
      return { success: false, error };
    }
  },

  async completeMilestone(planId, milestoneId) {
    try {
      const { data: plan } = await this.getPlanDetails(planId);
      if (!plan) throw new Error('Plan not found');

      const milestones = plan.milestones || [];
      const updatedMilestones = milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: true } : m
      );

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);

      const { data, error } = await supabase
        .from('personalized_plans')
        .update({ 
          milestones: updatedMilestones,
          progress_percentage: progressPercentage,
          status: progressPercentage === 100 ? 'completed' : plan.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('[planManagementService] Error completing milestone:', error);
      return { success: false, error };
    }
  }
};