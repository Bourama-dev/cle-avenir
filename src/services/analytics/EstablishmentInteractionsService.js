import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentInteractionsService = {
  async getInteractionMetrics(establishmentId) {
    return {
      total: 12500,
      types: [
        { type: 'Cics', count: 8000 },
        { type: 'Recherches', count: 3000 },
        { type: 'Favoris', count: 1500 }
      ]
    };
  },
  async getRecentInteractions(establishmentId) {
    return [];
  },
  async identifyHighlyInteractiveUsers(establishmentId) {
    return [];
  }
};