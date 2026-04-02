import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentProgressionService = {
  async getFunnelData(establishmentId) {
    return [
      { step: 'Inscription', count: 1000 },
      { step: 'Test', count: 850 },
      { step: 'Profil', count: 800 },
      { step: 'Recommandations', count: 600 },
      { step: 'Exploration', count: 400 }
    ];
  },
  async getGlobalProgressionRate(establishmentId) {
    return 40;
  },
  async identifyBlockedUsers(establishmentId) {
    return [];
  },
  async generateRecommendations(establishmentId) {
    return [];
  }
};