import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentResourcesService = {
  async getResourceMetrics(establishmentId) {
    return {
      totalConsulted: 1500,
      byType: [
        { type: 'Articles', count: 800 },
        { type: 'Vidéos', count: 500 },
        { type: 'Guides', count: 200 }
      ],
      avgTime: '3m'
    };
  },
  async getPopularResources(establishmentId) {
    return [];
  },
  async getConsultationEvolution(establishmentId) {
    return [];
  }
};