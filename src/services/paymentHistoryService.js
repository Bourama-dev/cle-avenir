import { supabase } from '@/lib/customSupabaseClient';

export const paymentHistoryService = {
  async fetchPaymentHistory(userId) {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', userId)
      .order('payment_date', { ascending: false });
      
    if (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
    
    return data;
  },

  async addPaymentRecord(userId, planId, amount, stripePaymentId = null) {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount: amount,
        status: 'paid',
        stripe_payment_id: stripePaymentId
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding payment record:', error);
      return null;
    }
    return data;
  },

  async generateInvoiceUrl(paymentId) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { payment_id: paymentId }
      });
      if (error) throw error;
      if (data?.url) return data.url;
      throw new Error('URL manquante');
    } catch (err) {
      console.error('Erreur génération facture:', err);
      return null;
    }
  }
};