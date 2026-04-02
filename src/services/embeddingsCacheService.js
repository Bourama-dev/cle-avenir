import { supabase } from '@/lib/customSupabaseClient';

/**
 * Direct database access for managing the embeddings cache
 * Note: Insertion is primarily handled by the edge function, 
 * but this service provides management capabilities.
 */
export const embeddingsCacheService = {
  
  /**
   * Generate SHA-256 hash for text key
   */
  async hashText(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Check if text exists in cache
   */
  async getCachedEmbedding(text) {
    try {
      const hash = await this.hashText(text);
      const { data, error } = await supabase
        .from('embeddings_cache')
        .select('embedding, created_at')
        .eq('text_hash', hash)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
      return data;
    } catch (err) {
      console.warn("Cache lookup failed:", err);
      return null;
    }
  },

  /**
   * Store embedding in cache manually (if needed outside edge function)
   */
  async setCachedEmbedding(text, embedding, modelVersion = 'Qwen/Qwen3-Embedding-8B') {
    try {
      const hash = await this.hashText(text);
      const { error } = await supabase
        .from('embeddings_cache')
        .upsert({
          text_hash: hash,
          text_content: text,
          embedding: embedding,
          model_version: modelVersion,
          created_at: new Date().toISOString()
        }, { onConflict: 'text_hash' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Cache set failed:", err);
      return false;
    }
  },

  /**
   * Clear embeddings older than X days
   */
  async clearOldCache(days = 30) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    try {
      const { error } = await supabase
        .from('embeddings_cache')
        .delete()
        .lt('created_at', date.toISOString());

      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Cache cleanup failed:", err);
      return false;
    }
  }
};