import { supabase } from '@/lib/customSupabaseClient';

const EMAIL_TYPES = new Set([
  'subscription_confirmation',
  'invoice',
  'partnership_confirmation',
  'contact_confirmation',
  'welcome',
  'support_notification' // Added new type
]);

const isEmail = (v) => {
  const s = String(v || '').trim();
  // Basic email format validation, no domain restriction
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
};

const isUrl = (v) => {
  try { new URL(String(v)); return true; } catch { return false; }
};

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Si tu veux “ne jamais bloquer l’UI”, laisse true.
// Mais même si on ne bloque pas, on NE renvoie pas success=true si ça a échoué.
const SILENT_FAIL = true;

export class EmailService {
  static async sendConfirmationEmail(email, planName, amount) {
    return this.sendEmail(email, 'subscription_confirmation', {
      planName,
      amount
    });
  }

  static async sendInvoiceEmail(email, invoiceUrl, planName, amount) {
    return this.sendEmail(email, 'invoice', {
      invoiceUrl,
      planName,
      amount
    });
  }

  static async sendPartnershipConfirmation(email, organizationName) {
    return this.sendEmail(email, 'partnership_confirmation', {
      organizationName
    });
  }

  static async sendContactConfirmation(email, name) {
    return this.sendEmail(email, 'contact_confirmation', {
      name
    });
  }

  // New method for support request
  static async sendSupportNotification(ticketData) {
    // Send to admin
    return this.sendEmail('contact@cleavenir.com', 'support_notification', {
      user_email: ticketData.email,
      user_name: ticketData.name,
      subject: ticketData.subject,
      message: ticketData.message,
      ticket_id: ticketData.id
    });
  }

  static async sendEmail(to, type, data = {}) {
    try {
      // ---- Validations
      if (!EMAIL_TYPES.has(type)) {
        throw new Error(`Type email invalide: ${type}`);
      }

      const toClean = String(to || '').trim();
      if (!isEmail(toClean)) {
        throw new Error('Email destinataire invalide');
      }

      // Normalisation data minimale par type
      const payload = { ...data };

      if (type === 'invoice') {
        if (!isUrl(payload.invoiceUrl)) throw new Error('invoiceUrl invalide');
        payload.amount = toNumber(payload.amount);
        if (payload.amount == null) throw new Error('amount invalide');
        payload.planName = String(payload.planName || '').trim();
      }

      if (type === 'subscription_confirmation') {
        payload.amount = toNumber(payload.amount);
        if (payload.amount == null) throw new Error('amount invalide');
        payload.planName = String(payload.planName || '').trim();
      }

      if (type === 'partnership_confirmation') {
        payload.organizationName = String(payload.organizationName || '').trim();
      }

      if (type === 'contact_confirmation') {
        payload.name = String(payload.name || '').trim();
      }
      
      if (type === 'support_notification') {
        payload.subject = String(payload.subject || '').trim();
        payload.message = String(payload.message || '').trim();
      }

      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: { to: toClean, type, data: payload }
      });

      if (error) {
        console.error('[EmailService] send-email error:', error);

        // silent fail optionnel, mais on ne ment pas
        if (SILENT_FAIL) {
          return { success: false, silent: true, error: error.message || 'Erreur envoi email' };
        }
        throw new Error(error.message || 'Erreur envoi email');
      }

      return result || { success: true };
    } catch (error) {
      console.error('[EmailService] exception:', error);

      if (SILENT_FAIL) {
        return { success: false, silent: true, error: error.message || 'Erreur email' };
      }

      return { success: false, error: error.message || error };
    }
  }
}