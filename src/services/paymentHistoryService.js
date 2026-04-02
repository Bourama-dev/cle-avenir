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

  generateInvoiceUrl(paymentId) {
    // In a real app, this would call a backend endpoint to generate a PDF invoice
    // For now, we simulate this
    return `https://cleavenir.com/invoices/${paymentId}.pdf`;
  }
};