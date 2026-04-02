import { supabase } from '@/lib/customSupabaseClient';
import { profilingService } from '@/services/profilingService';

export const cleoService = {
  
  async createSession(userId, title = 'Nouvelle session') {
    const { data: newSession, error } = await supabase
      .from('chat_sessions')
      .insert({ 
        user_id: userId, 
        title: title,
        context_data: { userAgent: navigator.userAgent }
      })
      .select()
      .single();

    if (error) throw error;
    return newSession;
  },

  async getAllSessions(userId) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },

  async deleteSession(sessionId) {
    await supabase.from('chat_messages').delete().eq('session_id', sessionId);
    const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
    if (error) throw error;
  },

  async getHistory(sessionId) {
    if (!sessionId) return [];
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async sendMessage(userId, sessionId, message, history, context, mode = 'career_advisor') {
    // 1. Persist user message
    if (userId && sessionId) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'user',
        content: message
      });
      
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // 2. Prepare Context with Instructions for Conciseness & Formatting (ENFORCING FRENCH)
    let systemInstruction = `
      ROLE: Tu es Cléo, une coach de carrière experte, bienveillante et professionnelle.
      LANGUE: IMPÉRATIVEMENT FRANÇAIS (French). Tu ne dois jamais répondre en anglais.
      
      CONSIGNES DE RÉDACTION:
      1. Sois concise (max 150 mots par réponse).
      2. Utilise un formatage markdown clair : **gras** pour les termes importants, listes à puces pour énumérer.
      3. Ton style doit être encourageant mais direct et professionnel.
      4. N'utilise jamais d'astérisques bruts (* texte *), utilise le markdown standard.
      5. Mode actuel : ${mode}.
    `;

    // Special instruction for Interview Mode
    if (mode === 'interview_coach') {
      const jobTarget = context?.profile?.job_title || context?.profile?.main_goal || "le poste visé";
      
      systemInstruction = `
        ROLE: Tu es une recruteuse experte pour une simulation d'entretien d'embauche.
        CONTEXTE: Le candidat passe un entretien pour le poste de : ${jobTarget}.
        LANGUE: FRANÇAIS UNIQUEMENT (FRENCH ONLY).
        
        OBJECTIF: Mener un entretien réaliste et adaptatif. Pose une seule question à la fois.
        
        FORMAT DE RÉPONSE STRICT (Utilise exactement ces balises XML pour ta réponse) :

        <ANALYSIS>
        (Donne 1 ou 2 phrases de feedback précis sur la réponse précédente du candidat. Est-ce clair ? Structuré ? Pertinent ? Si c'est le début, dis simplement "Prêt à commencer".)
        </ANALYSIS>

        <SCORE>
        (Un nombre entier de 0 à 100 évaluant la qualité de la réponse. Mets 0 si c'est le début.)
        </SCORE>

        <QUESTION>
        (Ta prochaine question d'entretien. Si la réponse précédente était vague, pose une question de clarification (follow-up). Sinon, passe au sujet suivant.)
        </QUESTION>

        IMPORTANT: Ne mets aucun texte en dehors de ces balises. Tout doit être en français.
      `;
    } else {
       // Standard modes instructions adjustments
       if (mode === 'career_advisor') systemInstruction += " Agis comme une conseillère d'orientation expérimentée.";
       if (mode === 'learning_coach') systemInstruction += " Agis comme un tuteur pédagogique patient.";
    }

    // 3. Call Edge Function (The Brain)
    const { data, error } = await supabase.functions.invoke('chat-advisor', {
      body: { 
        message, 
        history: history.slice(-10), 
        userId, 
        context: { ...context, systemInstruction },
        mode
      }
    });

    if (error) throw error;

    // 4. Handle Auto-Profile Updates
    let finalReply = data.reply;
    let didUpdateProfile = false;

    if (data.profileUpdates) {
      console.log("🧠 Cléo extracted profile data:", data.profileUpdates);
      try {
        await profilingService.updateProfile(userId, data.profileUpdates, "Extrait de la conversation Cléo");
        didUpdateProfile = true;
      } catch (err) {
        console.error("Failed to auto-update profile:", err);
      }
    }

    // 5. Persist AI Response
    if (finalReply && userId && sessionId) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: finalReply,
      });
    }

    return { 
      ...data, 
      didUpdateProfile,
      suggestions: data.suggestions || ['Approfondir ce point', 'Donner un exemple', 'Passer à la suite']
    };
  }
};