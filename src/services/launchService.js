import { supabase } from '@/lib/customSupabaseClient';

export const LaunchService = {
  // Checklist
  async getChecklist() {
    return await supabase.from('launch_checklist').select('*').order('category');
  },
  
  async toggleChecklistItem(id, is_completed, userId) {
    return await supabase.from('launch_checklist').update({
      is_completed,
      completed_at: is_completed ? new Date() : null,
      completed_by: is_completed ? userId : null
    }).eq('id', id);
  },

  // Risks
  async getRisks() {
    return await supabase.from('launch_risks').select('*').order('impact');
  },

  async addRisk(risk) {
    return await supabase.from('launch_risks').insert(risk);
  },
  
  async updateRiskStatus(id, status) {
    return await supabase.from('launch_risks').update({ status }).eq('id', id);
  },

  // Sign-offs
  async getSignoffs() {
    return await supabase.from('launch_signoffs').select('*');
  },

  async signOff(id, status, comments) {
    return await supabase.from('launch_signoffs').update({
      status,
      comments,
      signed_at: new Date()
    }).eq('id', id);
  },

  // Calculator
  calculateReadiness(checklist, risks, signoffs) {
    if (!checklist.length) return 0;
    
    const completedItems = checklist.filter(i => i.is_completed).length;
    const checklistScore = (completedItems / checklist.length) * 60; // 60% weight
    
    const mitigatedRisks = risks.filter(r => r.status !== 'Open').length;
    const totalRisks = risks.length || 1;
    const riskScore = (mitigatedRisks / totalRisks) * 20; // 20% weight
    
    const approvedSignoffs = signoffs.filter(s => s.status === 'Approved').length;
    const totalSignoffs = signoffs.length || 1;
    const signoffScore = (approvedSignoffs / totalSignoffs) * 20; // 20% weight
    
    return Math.round(checklistScore + riskScore + signoffScore);
  }
};