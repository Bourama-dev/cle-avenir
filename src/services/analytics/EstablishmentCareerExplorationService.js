import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentCareerExplorationService = {
  async getExplorationMetrics(establishmentId) {
    return {
      totalExplorations: 3400,
      avgTimePerCareer: '5m'
    };
  },
  async getMostExploredCareers(establishmentId) {
    return [
      { career: 'Ingénieur IA', views: 340 },
      { career: 'Architecte', views: 280 }
    ];
  },
  async getExplorationVsRecommendation(establishmentId) {
    return [];
  },
  async identifyInterestPatterns(establishmentId) {
    return [];
  }
};