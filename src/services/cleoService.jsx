import { supabase } from '@/lib/customSupabaseClient';
import { profilingService } from '@/services/profilingService';

export const cleoService = {

  // ── Session management ─────────────────────────────────────────────────────

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

  // ── Conversation history (for the floating widget) ─────────────────────────

  /**
   * Get the last N messages from the most recent active session.
   */
  async getConversationHistory(userId, limit = 20) {
    if (!userId) return [];
    try {
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!sessions || sessions.length === 0) return [];

      const { data } = await supabase
        .from('chat_messages')
        .select('id, role, content, created_at')
        .eq('session_id', sessions[0].id)
        .order('created_at', { ascending: true })
        .limit(limit);

      return data || [];
    } catch {
      return [];
    }
  },

  /**
   * Persist a user/assistant message pair in the latest session.
   * No-op if sendMessage() already handled persistence.
   */
  async saveConversation(userId, userMessage, cleoResponse) {
    // sendMessage() already persists both sides; this is a compat shim.
    return;
  },

  // ── Context & intent helpers ───────────────────────────────────────────────

  /**
   * Fetch the user's profile to build conversation context.
   */
  async buildContext(userId) {
    if (!userId) return {};
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, main_goal, job_title, education_level, riasec_profile, skills, location, interests, constraints')
        .eq('id', userId)
        .maybeSingle();

      return { profile: profile || {} };
    } catch {
      return {};
    }
  },

  /**
   * Lightweight client-side intent detection (no AI call needed).
   */
  analyzeIntent(text) {
    if (!text) return 'general_question';
    const t = text.toLowerCase();

    if (/métier|emploi|travail|job|carrière|profession|poste|secteur/.test(t)) return 'metier_search';
    if (/formation|études|diplôme|bts|licence|master|parcoursup|université/.test(t)) return 'formation_search';
    if (/salaire|rémunération|paye|revenu|smic/.test(t)) return 'salary_question';
    if (/test|riasec|orientation|profil|questionnaire/.test(t)) return 'test_recommendation';
    if (/entretien|cv|lettre de motivation|recruteur/.test(t)) return 'interview_prep';
    if (/alternance|apprentissage|stage/.test(t)) return 'alternance_search';
    if (/faq|aide|comment|qu'est-ce que|cléavenir|plateforme/.test(t)) return 'platform_help';

    return 'general_question';
  },

  // ── Core messaging ─────────────────────────────────────────────────────────

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

    // 2. Build system instruction
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

    if (mode === 'interview_coach') {
      const jobTarget = context?.profile?.job_title || context?.profile?.main_goal || "le poste visé";
      systemInstruction = `
        ROLE: Tu es une recruteuse experte pour une simulation d'entretien d'embauche.
        CONTEXTE: Le candidat passe un entretien pour le poste de : ${jobTarget}.
        LANGUE: FRANÇAIS UNIQUEMENT (FRENCH ONLY).

        OBJECTIF: Mener un entretien réaliste et adaptatif. Pose une seule question à la fois.

        FORMAT DE RÉPONSE STRICT (Utilise exactement ces balises XML pour ta réponse) :

        <ANALYSIS>
        (Donne 1 ou 2 phrases de feedback précis sur la réponse précédente du candidat. Si c'est le début, dis simplement "Prêt à commencer".)
        </ANALYSIS>

        <SCORE>
        (Un nombre entier de 0 à 100 évaluant la qualité de la réponse. Mets 0 si c'est le début.)
        </SCORE>

        <QUESTION>
        (Ta prochaine question d'entretien.)
        </QUESTION>

        IMPORTANT: Ne mets aucun texte en dehors de ces balises. Tout doit être en français.
      `;
    } else {
      if (mode === 'career_advisor') systemInstruction += " Agis comme une conseillère d'orientation expérimentée.";
      if (mode === 'learning_coach') systemInstruction += " Agis comme un tuteur pédagogique patient.";
    }

    // 3. Call edge function
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

    // 4. Handle profile updates from AI extraction
    let finalReply = data.reply;
    let didUpdateProfile = false;
    let updatedFields = [];

    if (data.profileUpdates && userId) {
      console.log('🧠 Cléo extracted profile data:', data.profileUpdates);
      try {
        await profilingService.updateProfile(userId, data.profileUpdates, "Extrait de la conversation Cléo");
        didUpdateProfile = true;
        updatedFields = Object.keys(data.profileUpdates);
      } catch (err) {
        console.error('Failed to auto-update profile:', err);
      }
    }

    // 5. Persist AI response
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
      updatedFields,
      suggestions: data.suggestions || ['Approfondir ce point', 'Donner un exemple', 'Passer à la suite']
    };
  },

  /**
   * Simple one-call chat method for the floating widget.
   * Manages sessions automatically — creates one if none exists for this user.
   */
  async chat(userId, message, history = [], mode = 'career_advisor') {
    let sessionId = null;

    if (userId) {
      try {
        const { data: sessions } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          sessionId = sessions[0].id;
        } else {
          const session = await this.createSession(userId, 'Conversation Cléo');
          sessionId = session.id;
        }
      } catch {
        // Proceed without session (messages won't be persisted)
      }
    }

    const context = userId ? await this.buildContext(userId) : {};
    return this.sendMessage(userId, sessionId, message, history, context, mode);
  },
};
