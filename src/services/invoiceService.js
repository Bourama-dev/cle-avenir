import { supabase } from '@/lib/customSupabaseClient';

export class InvoiceService {
  /**
   * Génère une facture via Edge Function.
   * IMPORTANT: ne jamais faire confiance à subscriptionData.email côté client.
   */
  static async generateInvoice(subscriptionData) {
    try {
      if (!subscriptionData?.planName) throw new Error('planName manquant');
      if (typeof subscriptionData?.amount !== 'number' || Number.isNaN(subscriptionData.amount)) {
        throw new Error('amount invalide');
      }

      // ✅ email récupéré depuis la session Supabase
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw new Error(userErr.message || 'Erreur auth');
      const email = userData?.user?.email;
      if (!email) throw new Error('Utilisateur non authentifié');

      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: {
          email, // tu peux même le supprimer côté serveur et le relire via JWT, mais là c’est déjà mieux
          planName: subscriptionData.planName,
          amount: subscriptionData.amount,
          date: new Date().toISOString()
        }
      });

      if (error) throw new Error(error.message || 'Erreur generate-invoice');
      if (!data?.invoiceUrl) throw new Error('invoiceUrl manquant');

      return {
        success: true,
        invoiceUrl: data.invoiceUrl
      };
    } catch (error) {
      console.error('Erreur facture:', error);

      // ❌ On ne ment pas avec un mock en prod
      return {
        success: false,
        error: error.message || 'Erreur génération facture',
        invoiceUrl: null
      };
    }
  }

  /**
   * Télécharge une facture (PDF) depuis une URL.
   * PRODUCTION ONLY: pas de mock handling
   */
  static async downloadInvoice(invoiceUrl, { filename } = {}) {
    try {
      if (!invoiceUrl) throw new Error('invoiceUrl manquant');

      const response = await fetch(invoiceUrl, { method: 'GET' });
      if (!response.ok) throw new Error(`Téléchargement échoué (${response.status})`);

      const contentType = response.headers.get('content-type') || '';
      const blob = await response.blob();

      // ✅ extension logique
      const isPdf = contentType.includes('application/pdf') || invoiceUrl.toLowerCase().includes('.pdf');
      const safeName = (filename || `facture-${Date.now()}`) + (isPdf ? '.pdf' : '');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, mocked: false };
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      alert('Erreur lors du téléchargement de la facture');
      return { success: false, error: error.message || 'Erreur téléchargement' };
    }
  }
}