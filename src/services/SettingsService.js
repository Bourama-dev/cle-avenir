import { supabase } from '@/lib/customSupabaseClient';
import { AuditLoggingService } from './AuditLoggingService';
import { SettingsValidator } from './SettingsValidator';

/**
 * SettingsService.js
 * Handles CRUD operations for system_settings.
 */

// Default settings structure
export const DEFAULT_SETTINGS = {
  // General
  site_name: 'Cleavenir',
  site_description: 'Plateforme d\'orientation scolaire et professionnelle',
  logo_url: '',
  favicon_url: '',
  
  // Email
  smtp_host: 'smtp.example.com',
  smtp_port: '587',
  smtp_user: '',
  smtp_password: '',
  smtp_from_email: 'noreply@cleavenir.com',
  
  // Security
  password_min_length: 8,
  password_require_special_chars: true,
  password_require_numbers: true,
  two_factor_enabled: false,
  
  // Payment
  stripe_public_key: '',
  stripe_secret_key: '',
  currency: 'EUR',
  
  // Theme
  theme_primary_color: '#3b82f6', // blue-500
  theme_secondary_color: '#64748b', // slate-500
  theme_font_family: 'Inter',
  
  // Features
  feature_toggles: {
    blog: true,
    qa_module: true,
    beta_features: false
  }
};

export const SettingsService = {
  getSettings: async () => {
    try {
      // Fetch all rows
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) throw error;
      
      // Convert rows [ { key: 'site_name', value: '"Name"' } ] to object { site_name: "Name" }
      // Assuming 'value' column is jsonb and stores the raw value directly
      const settingsObj = {};
      
      data.forEach(row => {
        settingsObj[row.key] = row.value;
      });

      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_SETTINGS, ...settingsObj };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: async (settingsToUpdate) => {
    // settingsToUpdate is an object like { site_name: "New Name", theme_primary: "..." }
    const results = { success: true, errors: [] };
    
    // We update each key individually or in batch. Supabase doesn't have a generic "upsert object" for key-value rows easily without a loop or stored proc.
    // For safety and audit, we'll loop. In a real heavy app, we might optimize.
    
    // First, fetch old settings for audit
    const currentSettings = await SettingsService.getSettings();

    for (const [key, value] of Object.entries(settingsToUpdate)) {
      try {
        // Skip if value hasn't changed (deep comparison for objects if needed, simple here)
        if (JSON.stringify(currentSettings[key]) === JSON.stringify(value)) continue;

        const { error } = await supabase
          .from('system_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;

        // Log change
        await AuditLoggingService.logSettingChange('UPDATE', key, currentSettings[key], value);

      } catch (err) {
        console.error(`Failed to update ${key}:`, err);
        results.success = false;
        results.errors.push(`Failed to update ${key}: ${err.message}`);
      }
    }

    return results;
  },

  resetToDefaults: async () => {
    return await SettingsService.updateSettings(DEFAULT_SETTINGS);
  },

  importSettings: async (jsonData) => {
    // Validate schema roughly
    if (typeof jsonData !== 'object') throw new Error("Invalid JSON format");
    
    return await SettingsService.updateSettings(jsonData);
  }
};