import { supabase } from '@/lib/customSupabaseClient';

export const cleoService = {
  async sendMessage(message, context = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('User must be authenticated to use Cleo');
      }

      // Call Edge Function for chat
      const { data, error } = await supabase.functions.invoke('chat-advisor', {
        body: { 
          message, 
          context,
          userId: session.user.id 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Cleo chat error:', error);
      throw error;
    }
  },

  async getHistory(sessionId) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },

  async createSession(title = 'New Conversation') {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ 
          user_id: user.id, 
          title,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }
};