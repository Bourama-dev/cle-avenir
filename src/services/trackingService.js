import { supabase } from '@/lib/customSupabaseClient';

// --- Analytics Tracking Functions ---
// Restored to support existing pages like ResourcesPage.jsx

export const trackEvent = (action, params = {}) => {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: action,
        ...params
      });
    }
    // Optional: Log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event:', action, params);
    }
  } catch (error) {
    console.warn('Tracking error:', error);
  }
};

export const trackPageView = (path, title) => {
  try {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: path,
        page_title: title
      });
    }
    if (import.meta.env.DEV) {
      console.log('[Analytics] PageView:', path, title);
    }
  } catch (error) {
    console.warn('Tracking error:', error);
  }
};

// --- Monthly Progress & Goals Service ---
// Used by TrackingPage.jsx and other progress tracking features

export const TrackingService = {
  /**
   * Get the monthly report for the current month.
   * If it doesn't exist, it creates a default initial report for the user.
   */
  async getCurrentReport(userId) {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();

    try {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('user_id', userId)
        .gte('report_month', firstDayOfMonth)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) return data;

      // Create default report if none exists
      return await this.createDefaultReport(userId, firstDayOfMonth);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      return null;
    }
  },

  async createDefaultReport(userId, monthDate) {
    const defaultReport = {
      user_id: userId,
      report_month: monthDate,
      progress_percentage: 15,
      engagement_score: 'B+',
      coach_name: 'Sarah',
      coach_feedback: "Bienvenue dans votre suivi Premium+ ! Nous commençons tout juste. Ce premier mois est consacré à l'analyse de votre profil et à la définition de vos objectifs prioritaires. Votre motivation est palpable, continuez ainsi !",
      achievements: [
        "Création du compte Premium+",
        "Premier contact établi",
        "Analyse initiale du profil"
      ],
      improvements: [
        "Compléter le dossier de compétences",
        "Définir 3 pistes professionnelles"
      ],
      next_month_focus: [
        "Validation du projet professionnel",
        "Identification des financements possibles"
      ],
      kpis: {
        applications_sent: 0,
        interviews: 0,
        networking_contacts: 0,
        courses_completed: 1
      },
      activity_data: [
        { name: 'Sem 1', value: 30 },
        { name: 'Sem 2', value: 45 },
        { name: 'Sem 3', value: 20 },
        { name: 'Sem 4', value: 60 },
      ]
    };

    const { data, error } = await supabase
      .from('monthly_reports')
      .insert(defaultReport)
      .select()
      .single();

    if (error) {
      console.error('Error creating default report:', error);
      return null;
    }
    return data;
  },

  async getGoals(userId) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    // If no goals, create defaults
    if (!data || data.length === 0) {
      await this.createDefaultGoals(userId);
      return this.getGoals(userId);
    }

    return data;
  },

  async createDefaultGoals(userId) {
    const defaultGoals = [
      {
        user_id: userId,
        title: "Compléter le test de personnalité",
        description: "Répondez aux questions pour identifier vos forces et vos axes d'amélioration.",
        status: "completed",
        priority: "high",
        completed: true,
        category: "analysis"
      },
      {
        user_id: userId,
        title: "Lister 5 compétences transférables",
        description: "Identifiez les compétences acquises qui peuvent s'appliquer à d'autres métiers.",
        status: "pending",
        priority: "high",
        completed: false,
        category: "analysis"
      },
      {
        user_id: userId,
        title: "Rechercher 2 formations certifiantes",
        description: "Explorez les formations éligibles au CPF pour monter en compétences.",
        status: "pending",
        priority: "medium",
        completed: false,
        category: "research"
      }
    ];

    await supabase.from('goals').insert(defaultGoals);
  },

  async updateGoalStatus(goalId, completed) {
    const { data, error } = await supabase
      .from('goals')
      .update({ 
        completed, 
        status: completed ? 'completed' : 'pending',
        updated_at: new Date()
      })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};