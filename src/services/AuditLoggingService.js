import { supabase } from '@/lib/customSupabaseClient';

/**
 * AuditLoggingService.js
 * Logs administrative actions to the audit_logs table.
 */
export const AuditLoggingService = {
  logSettingChange: async (action, settingKey, oldValue, newValue, details = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('audit_logs').insert({
        action: `SETTINGS_${action.toUpperCase()}`,
        actor_id: user.id,
        resource: 'system_settings',
        resource_id: settingKey,
        details: {
          old_value: oldValue,
          new_value: newValue,
          ...details
        },
        user_agent: navigator.userAgent
      });

      if (error) console.error("Failed to log audit event:", error);
    } catch (err) {
      console.error("Audit logging exception:", err);
    }
  }
};