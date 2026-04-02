import { supabase } from '@/lib/customSupabaseClient';

export const rgpdAdminService = {
  async updateRgpdPolicy(adminId, policyText, version) {
    try {
      const { data, error } = await supabase
        .from('rgpd_policies')
        .insert([{
          policy: policyText,
          updated_by: adminId,
          version: version
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      await supabase.from('rgpd_audit_logs').insert([{
        action: 'RGPD_POLICY_UPDATE',
        user_id: adminId,
        details: { version }
      }]);
      
      return data;
    } catch (error) {
      console.error('Error updating RGPD policy:', error);
      throw error;
    }
  },

  async updateCookiePolicy(adminId, policyText, version) {
    try {
      const { data, error } = await supabase
        .from('cookie_policies')
        .insert([{
          policy: policyText,
          updated_by: adminId,
          version: version
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cookie policy:', error);
      throw error;
    }
  },

  async getRgpdStatistics(adminId) {
    try {
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      const { count: usersWithConsent } = await supabase
        .from('user_cookie_preferences')
        .select('*', { count: 'exact', head: true })
        .eq('analytics', true);
        
      const { count: dataDownloads } = await supabase
        .from('data_download_logs')
        .select('*', { count: 'exact', head: true });
        
      const consentRate = totalUsers ? Math.round((usersWithConsent / totalUsers) * 100) : 0;
      
      return {
        totalUsers: totalUsers || 0,
        consentRate,
        dataDownloads: dataDownloads || 0,
        complianceScore: 98 // Placeholder for calculated logic
      };
    } catch (error) {
      console.error('Error getting RGPD stats:', error);
      throw error;
    }
  },

  async getAuditLogs(adminId, filters = {}) {
    try {
      let query = supabase.from('rgpd_audit_logs').select(`
        *,
        profiles:user_id(first_name, last_name, email)
      `).order('timestamp', { ascending: false });
      
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.limit) query = query.limit(filters.limit);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting audit logs:', error);
      throw error;
    }
  },

  async notifyUsersOfPolicyUpdate(policyType, message) {
    try {
      // Logic to insert into notifications table for all users
      // This is simulated here
      return true;
    } catch (error) {
      console.error('Error notifying users:', error);
      throw error;
    }
  }
};