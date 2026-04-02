import { supabase } from '@/lib/customSupabaseClient';
import { gamificationService } from './gamificationService';

export const interviewService = {
  types: {
    pitch: {
      id: 'pitch',
      name: 'Pitch Élévateur',
      description: 'Présente-toi en 2 minutes de manière percutante.',
      duration: '2 min',
      questionCount: 1,
      questions: [
        "Bonjour ! Je suis ravi de vous rencontrer. Pouvez-vous vous présenter en quelques minutes ?"
      ]
    },
    recruiter: {
      id: 'recruiter',
      name: 'Entretien RH',
      description: 'Questions classiques des recruteurs pour tester ta motivation.',
      duration: '15 min',
      questionCount: 3,
      questions: [
        "Pourquoi voulez-vous rejoindre notre entreprise ?",
        "Quels sont vos principaux points forts et points faibles ?",
        "Où vous voyez-vous dans 5 ans ?"
      ]
    },
    technical: {
      id: 'technical',
      name: 'Entretien Technique',
      description: 'Valide tes compétences techniques et ta résolution de problèmes.',
      duration: '20 min',
      questionCount: 3,
      questions: [
        "Décrivez un défi technique complexe que vous avez résolu.",
        "Comment restez-vous à jour avec les nouvelles technologies ?",
        "Expliquez un concept technique complexe à un non-initié."
      ]
    },
    motivation: {
      id: 'motivation',
      name: 'Entretien de Motivation',
      description: 'Pourquoi ce poste ? Pourquoi toi ? Convaincs-nous.',
      duration: '10 min',
      questionCount: 3,
      questions: [
        "Qu'est-ce qui vous motive le plus dans le travail ?",
        "Racontez une situation où vous avez fait preuve d'initiative.",
        "Pourquoi devrions-nous vous embaucher vous plutôt qu'un autre ?"
      ]
    }
  },

  async createInterviewSession(userId, type) {
    try {
      const interviewType = this.types[type];
      if (!interviewType) throw new Error('Invalid interview type');

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: userId,
          type: type,
          status: 'created',
          questions_count: interviewType.questionCount,
          current_question_index: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating interview session:', error);
      throw error;
    }
  },

  async saveAnswer(sessionId, questionIndex, userAnswer) {
    try {
      // Basic Analysis
      const analysis = this.analyzeAnswer(userAnswer);

      const { data, error } = await supabase
        .from('interview_answers')
        .insert({
          session_id: sessionId,
          question_index: questionIndex,
          user_answer: userAnswer,
          clarity_score: analysis.clarity,
          confidence_score: analysis.confidence
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update session progress
      await supabase
        .from('interview_sessions')
        .update({ 
          current_question_index: questionIndex + 1,
          status: 'in_progress' 
        })
        .eq('id', sessionId);

      return { ...data, analysis };
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
    }
  },

  async completeInterviewSession(sessionId, userId) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      // Gamification Integration
      if (gamificationService && userId) {
        await gamificationService.addXP(userId, 200, 'interview_completed');
        
        // Check for badge (naive implementation, just giving it here for demo)
        await gamificationService.addBadge(userId, 'interview_master');
      }

      return data;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  },

  analyzeAnswer(text) {
    if (!text) return { clarity: 0, confidence: 0, feedback: "Aucune réponse détectée." };

    const wordCount = text.trim().split(/\s+/).length;
    
    // Naive Clarity Score based on length (too short = bad, too long = maybe rambling)
    let clarity = 0;
    if (wordCount > 10 && wordCount < 200) clarity = 85;
    else if (wordCount <= 10) clarity = 40;
    else clarity = 70;

    // Naive Confidence Score based on keyword matching
    const confidenceKeywords = ['je suis sûr', 'je sais', 'expert', 'réussi', 'succès', 'maîtrise', 'certainement', 'absolument'];
    const hesitationWords = ['euh', 'hm', 'genre', 'je crois', 'peut-être', 'je pense que'];
    
    let confidence = 75; // base
    const lowerText = text.toLowerCase();
    
    confidenceKeywords.forEach(word => {
      if (lowerText.includes(word)) confidence += 5;
    });

    hesitationWords.forEach(word => {
      if (lowerText.includes(word)) confidence -= 5;
    });

    confidence = Math.max(0, Math.min(100, confidence));

    return {
      clarity,
      confidence,
      feedback: this.generateFeedback(clarity, confidence)
    };
  },

  generateFeedback(clarity, confidence) {
    if (clarity > 80 && confidence > 80) return "Excellent ! Réponse claire et assurée.";
    if (clarity < 50) return "Essaie de développer davantage ta réponse.";
    if (confidence < 60) return "Attention aux mots d'hésitation, sois plus affirmatif.";
    return "Bonne réponse, continue comme ça !";
  },

  async getInterviewHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  },

  async getSessionDetails(sessionId) {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;

      const { data: answers, error: answersError } = await supabase
        .from('interview_answers')
        .select('*')
        .eq('session_id', sessionId)
        .order('question_index', { ascending: true });

      if (answersError) throw answersError;

      return { session, answers };
    } catch (error) {
      console.error('Error fetching session details:', error);
      return null;
    }
  }
};