import { supabase } from '@/lib/customSupabaseClient';
import { embeddingService } from './embeddingService';

export const semanticMatchingService = {
  
  /**
   * Main orchestration function:
   * 1. Generates embeddings for answers
   * 2. Aggregates them into a user profile vector
   * 3. Calls matching endpoint
   */
  async matchCareersForUser(answers, userId, testId) {
    try {
      // 1. Extract texts from answers
      // Supports updated answer structure: { questionId, choices: [{text...}] }
      const texts = [];
      
      answers.forEach(a => {
        if (a.choices && Array.isArray(a.choices)) {
          // Multiple choices
          a.choices.forEach(c => {
            if (c.text) texts.push(c.text);
          });
        } else if (a.choiceText) {
          // Legacy/Single backward compatibility
          texts.push(a.choiceText);
        } else if (a.answerText) {
          // Alternative format
          texts.push(a.answerText);
        }
      });
      
      if (texts.length === 0) throw new Error("No answer text provided for analysis");

      // 2. Generate Embeddings
      const embeddings = await embeddingService.generateEmbeddings(texts);

      // 3. Aggregate (Average Pooling)
      const aggregatedEmbedding = this.aggregateEmbeddings(embeddings);

      // 4. Save User Profile (optional/parallel)
      if (userId) {
        this.saveUserProfile(userId, testId, aggregatedEmbedding, texts.length);
      }

      // 5. Match Careers
      const { data, error } = await supabase.functions.invoke('semantic-match-careers', {
        body: { userProfileEmbedding: aggregatedEmbedding }
      });

      if (error) throw error;

      return data.topCareers;

    } catch (err) {
      console.error("Semantic matching workflow failed:", err);
      // Fallback or rethrow? Usually return empty array or basic fallback.
      throw err;
    }
  },

  aggregateEmbeddings(embeddings) {
    if (!embeddings || embeddings.length === 0) return [];
    
    const dim = embeddings[0].length;
    const count = embeddings.length;
    const result = new Array(dim).fill(0);

    for (const emb of embeddings) {
      for (let i = 0; i < dim; i++) {
        result[i] += emb[i];
      }
    }

    // Average
    for (let i = 0; i < dim; i++) {
      result[i] = result[i] / count;
    }

    return result;
  },

  async saveUserProfile(userId, testId, embedding, count) {
    // Fire and forget save
    try {
      await supabase.from('user_profiles').insert({
        user_id: userId,
        test_id: testId,
        aggregated_embedding: JSON.stringify(embedding), // Ensure string format for vector
        answer_count: count
      });
    } catch (e) {
      console.warn("Failed to save user profile vector", e);
    }
  }
};