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

  async updateSession(sessionId, updates) {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw error;
    return data;
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

    // 2. Call edge function. Instructions for the model are built server
    //    side (chat-advisor); only the reply-length preference is sent along.
    const { data, error } = await supabase.functions.invoke('chat-advisor', {
      body: {
        message,
        history: history.slice(-10),
        userId,
        context: { profile: context?.profile, risks: context?.risks, responseStyle: context?.responseStyle },
        mode
      }
    });

    if (error) throw error;

    // 3. Parse interview XML and handle profile updates
    let finalReply = data.reply || '';
    let interviewData = null;
    let didUpdateProfile = false;
    let updatedFields = [];

    if (mode === 'interview_coach' && finalReply) {
      const extract = (tag) => {
        const m = finalReply.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        return m ? m[1].trim() : null;
      };
      const analysis = extract('ANALYSIS');
      const scoreRaw = extract('SCORE');
      const question = extract('QUESTION');
      const score = scoreRaw !== null ? Math.min(100, Math.max(0, parseInt(scoreRaw, 10) || 0)) : null;

      if (question) {
        interviewData = { analysis, score, question };
        // Build a clean human-readable reply from the parsed parts
        const parts = [];
        if (analysis && analysis !== 'Prêt à commencer') parts.push(`*${analysis}*`);
        if (score !== null && score > 0) parts.push(`Score : ${score}/100`);
        parts.push(question);
        finalReply = parts.join('\n\n');
      }
    }

    const ALLOWED_PROFILE_FIELDS = new Set([
      'first_name', 'last_name', 'job_title', 'main_goal', 'education_level',
      'location', 'skills', 'interests', 'constraints',
    ]);

    if (data.profileUpdates && userId) {
      const safe = Object.fromEntries(
        Object.entries(data.profileUpdates).filter(([k]) => ALLOWED_PROFILE_FIELDS.has(k))
      );
      if (Object.keys(safe).length > 0) {
        console.log('🧠 Cléo extracted profile data:', safe);
        try {
          await profilingService.updateProfile(userId, safe, "Extrait de la conversation Cléo");
          didUpdateProfile = true;
          updatedFields = Object.keys(safe);
        } catch (err) {
          console.error('Failed to auto-update profile:', err);
        }
      }
    }

    // 4. Persist AI response
    if (finalReply && userId && sessionId) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: finalReply,
      });
    }

    return {
      ...data,
      reply: finalReply,
      didUpdateProfile,
      updatedFields,
      interviewData,
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

  async searchMetiers(query) {
    try {
      const { data, error } = await supabase
        .from('rome_metiers')
        .select('code, libelle, description')
        .ilike('libelle', `%${query}%`)
        .limit(5);
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  async searchFormations(query) {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('id, titre, etablissement, niveau')
        .ilike('titre', `%${query}%`)
        .limit(5);
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  async getBlogArticles() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },
};
