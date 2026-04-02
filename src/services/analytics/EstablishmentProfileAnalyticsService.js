import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentProfileAnalyticsService = {
  async getProfileDistribution(establishmentId) {
    return [
      { profile: 'Analytique', count: 120, percentage: 30 },
      { profile: 'Créatif', count: 80, percentage: 20 },
      { profile: 'Social', count: 150, percentage: 37.5 },
      { profile: 'Réaliste', count: 50, percentage: 12.5 }
    ];
  },
  async getCommonProfiles(establishmentId) {
    return { most: 'Social', least: 'Réaliste' };
  },
  async getProfileEvolution(establishmentId) {
    return [];
  },
  async getRecommendationsByProfile(establishmentId) {
    return [];
  }
};