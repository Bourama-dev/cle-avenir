import { supabase } from '@/lib/customSupabaseClient';

export const CareerFamilyAnalysisService = {
  async getFamilyDistribution(establishmentId) {
    return [
      { name: 'Informatique & Numérique', count: 150, percentage: 30, avgScore: 85 },
      { name: 'Santé & Social', count: 120, percentage: 24, avgScore: 78 },
      { name: 'Commerce & Vente', count: 90, percentage: 18, avgScore: 72 },
      { name: 'Ingénierie', count: 80, percentage: 16, avgScore: 81 },
      { name: 'Arts & Design', count: 60, percentage: 12, avgScore: 75 }
    ];
  },
  
  async getFamilyStats(familyId) {
    return {
      userCount: 150,
      averageScore: 85,
      associatedCareers: ['Développeur Web', 'Data Scientist', 'Chef de Projet IT'],
      acceptanceRate: 68,
      rejectionRate: 15
    };
  },

  async getTopCareersPerFamily() {
    return {
      'Informatique & Numérique': ['Développeur Web', 'Data Scientist'],
      'Santé & Social': ['Infirmier', 'Médecin Généraliste']
    };
  },

  async getFamilyEvolution() {
    return [
      { date: 'Jan', 'Informatique & Numérique': 40, 'Santé & Social': 30 },
      { date: 'Fév', 'Informatique & Numérique': 45, 'Santé & Social': 35 },
      { date: 'Mar', 'Informatique & Numérique': 55, 'Santé & Social': 40 }
    ];
  },

  async generateFamilyRecommendations() {
    return [
      { id: 1, title: 'Renforcer l\'orientation Numérique', description: 'Forte appétence détectée pour les métiers de la tech.', urgency: 'medium' }
    ];
  }
};