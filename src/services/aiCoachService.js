import { supabase } from '@/lib/customSupabaseClient';

export const AICoachService = {
  
  // Create or get active session
  async getOrCreateSession(userId) {
    // Check for existing recent session (e.g., last 24h) or create new
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (sessions && sessions.length > 0) {
      return sessions[0];
    }

    const { data: newSession, error: createError } = await supabase
      .from('chat_sessions')
      .insert({ user_id: userId, title: 'Session de coaching' })
      .select()
      .single();

    if (createError) throw createError;
    return newSession;
  },

  // Get message history
  async getMessages(sessionId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Send message to AI
  async sendMessage(userId, sessionId, content, history = []) {
    // 1. Store User Message
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: content
    });

    // 2. Call Edge Function
    const { data, error } = await supabase.functions.invoke('chat-advisor', {
      body: { 
        message: content, 
        history: history, 
        user_id: userId 
      }
    });

    if (error) throw error;

    // 3. Store AI Response
    if (data?.reply) {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: data.reply
      });
    }

    return data?.reply;
  }
};