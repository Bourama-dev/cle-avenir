import { supabase } from '@/lib/customSupabaseClient';

/**
 * Generates embeddings for text using Qwen/Qwen3-Embedding-8B via Supabase Edge Function
 * @param {string|string[]} text - Text to embed
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
export async function generateEmbeddings(text) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-embeddings', {
      body: { text }
    });

    if (error) throw error;
    return data.data;
  } catch (err) {
    console.error('Embedding generation failed:', err);
    throw err;
  }
}

/**
 * Ranks a list of candidate strings against a query string semantically.
 * @param {string} query - The search query
 * @param {string[]} candidates - List of text to search against
 * @returns {Promise<{candidate: string, similarity_score: number}[]>} Ranked results
 */
export async function semanticMatch(query, candidates) {
  try {
    // Validate locally before sending to save network calls
    if (!query) throw new Error("Query is required");
    if (!candidates || candidates.length === 0) return [];

    const { data, error } = await supabase.functions.invoke('semantic-match', {
      body: { query, candidates }
    });

    if (error) throw error;
    return data.matches;
  } catch (err) {
    console.error('Semantic match failed:', err);
    throw err;
  }
}

/**
 * Health check for the inference service
 */
export async function checkInferenceHealth() {
  const start = Date.now();
  try {
    // Test with a tiny embedding
    await generateEmbeddings("test");
    return { 
      status: 'healthy', 
      latency: Date.now() - start,
      provider: 'Nebius / HuggingFace' 
    };
  } catch (err) {
    return { 
      status: 'unhealthy', 
      error: err.message,
      provider: 'Nebius / HuggingFace' 
    };
  }
}