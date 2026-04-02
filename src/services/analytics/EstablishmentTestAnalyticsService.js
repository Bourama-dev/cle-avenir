import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentTestAnalyticsService = {
  async getTestMetrics(establishmentId) {
    return {
      totalCompleted: 850,
      inProgress: 120,
      notStarted: 230,
      completionRate: 70,
      abandonmentRate: 10,
      avgCompletionTimeMinutes: 25
    };
  },
  async getProgressionByClass(establishmentId) {
    return [
      { class: 'Terminale S', completion: 85 },
      { class: 'Première L', completion: 60 }
    ];
  },
  async getCompletionEvolution(establishmentId) {
    return [];
  },
  async getTestDetails(establishmentId) {
    return [];
  },
  async identifyNonStarters(establishmentId) {
    return [];
  },
  async generateRecommendations(establishmentId) {
    return [{ id: 1, title: 'Relancer les élèves inactifs', urgency: 'high' }];
  }
};