import { supabase } from '@/lib/customSupabaseClient';

export const cleoEngine = {
  // 1. Analyze Profile Coherence
  async analyzeCoherence(userProfile) {
    const analysis = {
      score: 0,
      issues: [],
      strengths: [],
      maturity: 'exploratory'
    };

    // Basic heuristic analysis
    if (!userProfile.main_goal) {
      analysis.issues.push("Objectif principal non défini");
    } else {
      analysis.score += 20;
    }

    if (userProfile.skills && userProfile.skills.length > 5) {
      analysis.score += 20;
      analysis.strengths.push("Base de compétences solide");
    } else {
      analysis.issues.push("Compétences peu renseignées");
    }

    // Detect maturity based on specificity
    if (userProfile.job_title && userProfile.constraints?.salary_expectations) {
      analysis.maturity = 'specifying';
      analysis.score += 30;
    } else if (userProfile.job_title) {
      analysis.maturity = 'crystallizing';
      analysis.score += 15;
    }

    // Save analysis
    await supabase.from('cleo_user_analysis').upsert({
      user_id: userProfile.id,
      maturity_level: analysis.maturity,
      coherence_score: analysis.score,
      last_updated: new Date()
    });

    return analysis;
  },

  // 2. Generate Action Plan based on Analysis
  async generateActionPlan(userId, analysis) {
    const steps = [];

    if (analysis.maturity === 'exploratory') {
      steps.push({ text: "Passer le test de personnalité approfondi", type: "test", deadline_days: 2 });
      steps.push({ text: "Explorer 3 secteurs d'activité", type: "exploration", deadline_days: 7 });
    } else if (analysis.maturity === 'specifying') {
      steps.push({ text: "Valider les pré-requis pour le poste visé", type: "validation", deadline_days: 3 });
      steps.push({ text: "Mettre à jour le CV avec les mots-clés du secteur", type: "cv", deadline_days: 5 });
    } else {
      steps.push({ text: "Définir un objectif professionnel clair", type: "goal", deadline_days: 1 });
    }

    // Persist
    const { data } = await supabase.from('cleo_action_plans').insert({
      user_id: userId,
      title: "Plan d'action immédiat",
      type: analysis.maturity,
      steps: steps,
      status: 'active'
    }).select().single();

    return data;
  },

  // 3. Risk Detection System
  detectRisks(interactionHistory) {
    const risks = [];
    const recentMsgs = interactionHistory.slice(-5);
    
    // Simple keyword detection for demo purposes
    const hesitationWords = ['peut-être', 'je ne sais pas', 'peur', 'difficile', 'plus tard', 'hésite'];
    const hesitationCount = recentMsgs.filter(m => 
      m.role === 'user' && hesitationWords.some(w => m.content.toLowerCase().includes(w))
    ).length;

    if (hesitationCount >= 2) {
      risks.push({ type: 'decision_paralysis', level: 'medium', label: 'Paralysie décisionnelle détectée' });
    }

    return risks;
  },

  // 4. Market Reality Check (Mock integration)
  async checkMarketReality(jobTitle) {
    // In real app, query ROME/France Travail API here
    // Returning mock data for UI visualization
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    return {
      score,
      trend: score > 75 ? 'up' : 'stable',
      demand: score > 80 ? 'very_high' : 'medium',
      message: score > 80 
        ? "Ce métier est en forte tension. C'est le moment idéal."
        : "Marché stable, la différenciation sera clé."
    };
  }
};