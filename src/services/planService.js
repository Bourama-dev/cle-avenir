// NOTE: Due to incomplete Supabase integration, this service currently uses localStorage
// to ensure the app functions without errors during prototyping.

export const planService = {
  async createPlan(userId, planData) {
    try {
      console.log('[planService] Creating new plan for user:', userId);
      // Fallback to localStorage due to missing Supabase integration
      const plans = JSON.parse(localStorage.getItem('mock_personalized_plans') || '{}');
      
      const newPlan = {
        id: Date.now().toString(),
        user_id: userId,
        ...planData,
        selected_metiers: planData.selected_metiers || [],
        selected_formations: planData.selected_formations || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      plans[userId] = newPlan;
      localStorage.setItem('mock_personalized_plans', JSON.stringify(plans));
      
      return newPlan;
    } catch (err) {
      console.error('[planService] Error creating plan:', err);
      throw new Error("Impossible de créer le plan.");
    }
  },

  async getPlanByUserId(userId) {
    try {
      console.log('[planService] Fetching plan for user:', userId);
      const plans = JSON.parse(localStorage.getItem('mock_personalized_plans') || '{}');
      return plans[userId] || null;
    } catch (err) {
      console.error('[planService] Error fetching plan:', err);
      throw new Error("Impossible de récupérer le plan.");
    }
  },

  async updatePlan(userId, planData) {
    try {
      console.log('[planService] Updating plan for user:', userId);
      const plans = JSON.parse(localStorage.getItem('mock_personalized_plans') || '{}');
      
      if (!plans[userId]) {
        throw new Error("Plan non trouvé pour cet utilisateur.");
      }
      
      plans[userId] = {
        ...plans[userId],
        ...planData,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('mock_personalized_plans', JSON.stringify(plans));
      return plans[userId];
    } catch (err) {
      console.error('[planService] Error updating plan:', err);
      throw new Error("Impossible de mettre à jour le plan.");
    }
  },

  async deletePlan(userId) {
    try {
      console.log('[planService] Deleting plan for user:', userId);
      const plans = JSON.parse(localStorage.getItem('mock_personalized_plans') || '{}');
      delete plans[userId];
      localStorage.setItem('mock_personalized_plans', JSON.stringify(plans));
      return true;
    } catch (err) {
      console.error('[planService] Error deleting plan:', err);
      throw new Error("Impossible de supprimer le plan.");
    }
  },

  calculateCompatibilityScore(userRiasec, metierRiasec) {
    return Math.floor(Math.random() * 20) + 80; 
  },

  async getRecommendedMetiers(riasecProfile) {
    try {
      console.log('[planService] Fetching recommended metiers');
      return [
        { code: 'M1805', libelle: 'Développeur Informatique', score: this.calculateCompatibilityScore(), description: 'Conception et développement d\'applications.', salaire: '35k€ - 55k€', debouches: 'Excellentes', skills: ['Code', 'Logique'] },
        { code: 'M1802', libelle: 'Analyste de Données', score: this.calculateCompatibilityScore(), description: 'Analyse de données complexes.', salaire: '40k€ - 60k€', debouches: 'Très bonnes', skills: ['Maths', 'Analyse'] },
        { code: 'E1104', libelle: 'Chef de Projet Digital', score: this.calculateCompatibilityScore(), description: 'Coordination de projets web.', salaire: '38k€ - 58k€', debouches: 'Bonnes', skills: ['Gestion', 'Agile'] }
      ];
    } catch (err) {
      console.error('[planService] Error getting recommended metiers:', err);
      return [];
    }
  },

  async getRecommendedFormations(metierCode) {
    if (!metierCode) return [];
    try {
      console.log('[planService] Fetching formations for rome_code:', metierCode);
      return [
        { id: '1', title: 'Licence Informatique', level: 'Bac+3', duration: '3 ans', provider: 'Université Paris', prospects: 'Très bonnes' },
        { id: '2', title: 'Master Ingénierie Logicielle', level: 'Bac+5', duration: '2 ans', provider: 'École d\'Ingénieurs', prospects: 'Excellentes' }
      ];
    } catch (err) {
      console.error('[planService] Error getting formations:', err);
      return [];
    }
  }
};