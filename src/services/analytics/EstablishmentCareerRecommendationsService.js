import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentCareerRecommendationsService = {
  async getRecommendationMetrics(establishmentId) {
    return {
      totalGenerated: 5000,
      accepted: 1200,
      refused: 300,
      pending: 3500,
      acceptanceRate: 24,
      refusalRate: 6
    };
  },
  async getPopularCareers(establishmentId) {
    return [
      { career: 'Développeur', accepted: 150 },
      { career: 'Médecin', accepted: 120 }
    ];
  },
  async getAcceptanceEvolution(establishmentId) {
    return [];
  },
  async getRecommendationDetails(establishmentId) {
    return [];
  }
};