import { supabase } from '@/lib/customSupabaseClient';

export const EstablishmentTestPerformanceService = {
  async getGlobalPerformance(establishmentId) {
    return {
      avgScore: 72,
      scoreDistribution: [
        { range: '0-20', count: 5 },
        { range: '21-40', count: 15 },
        { range: '41-60', count: 30 },
        { range: '61-80', count: 40 },
        { range: '81-100', count: 10 }
      ]
    };
  },
  async getScoresByDomain(establishmentId) {
    return [];
  },
  async getRadarChartData(establishmentId) {
    return [];
  },
  async identifyHighPerformers(establishmentId) {
    return [];
  }
};