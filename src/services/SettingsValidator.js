/**
 * SettingsValidator.js
 * Validates settings based on their category and specific rules.
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

export const SettingsValidator = {
  validateGeneralSettings: (settings) => {
    const errors = {};
    if (!settings.site_name || settings.site_name.length < 3) {
      errors.site_name = "Site name must be at least 3 characters.";
    }
    if (settings.logo_url && !urlRegex.test(settings.logo_url)) {
      errors.logo_url = "Invalid Logo URL.";
    }
    return errors;
  },

  validateEmailConfig: (settings) => {
    const errors = {};
    if (!settings.smtp_host) errors.smtp_host = "SMTP Host is required.";
    if (!settings.smtp_port) errors.smtp_port = "SMTP Port is required.";
    if (!settings.smtp_from_email || !emailRegex.test(settings.smtp_from_email)) {
      errors.smtp_from_email = "Invalid sender email address.";
    }
    return errors;
  },

  validateSecuritySettings: (settings) => {
    const errors = {};
    if (settings.password_min_length < 8) {
      errors.password_min_length = "Password length must be at least 8.";
    }
    return errors;
  },

  validatePaymentSettings: (settings) => {
    const errors = {};
    if (settings.stripe_public_key && !settings.stripe_public_key.startsWith('pk_')) {
      errors.stripe_public_key = "Invalid Stripe Public Key (should start with pk_).";
    }
    if (settings.stripe_secret_key && !settings.stripe_secret_key.startsWith('sk_')) {
      errors.stripe_secret_key = "Invalid Stripe Secret Key (should start with sk_).";
    }
    return errors;
  },

  // Generic validator that dispatches to specific ones
  validate: (category, settings) => {
    switch (category) {
      case 'general': return SettingsValidator.validateGeneralSettings(settings);
      case 'email': return SettingsValidator.validateEmailConfig(settings);
      case 'security': return SettingsValidator.validateSecuritySettings(settings);
      case 'payment': return SettingsValidator.validatePaymentSettings(settings);
      default: return {};
    }
  }
};