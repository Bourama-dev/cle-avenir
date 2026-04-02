import { supabase } from '@/lib/customSupabaseClient';

export const embeddingService = {
  /**
   * Generates embeddings for a list of texts
   * @param {string[]} texts - Array of strings to embed
   * @returns {Promise<number[][]>} Array of vectors
   */
  async generateEmbeddings(texts) {
    if (!texts || texts.length === 0) return [];
    
    // Simple batching could be added here if texts array is huge
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: { texts }
      });

      if (error) throw new Error(error.message);
      
      return data.embeddings;
    } catch (err) {
      console.error('Embedding generation failed:', err);
      // Fallback or rethrow
      throw err;
    }
  },

  /**
   * Helper to compute SHA-256 (matches backend)
   */
  async hashText(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};