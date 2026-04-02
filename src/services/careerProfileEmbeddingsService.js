import { supabase } from '@/lib/customSupabaseClient';
import { semanticMatchingService } from './semanticMatchingService';
import { embeddingsCacheService } from './embeddingsCacheService';

/**
 * Manages fetching and embedding ROME career profiles
 */
export const careerProfileEmbeddingsService = {

  /**
   * Gets embeddings for a specific career code, generating if missing
   */
  async getCareerEmbedding(romeCode, careerData = null) {
    const cacheKey = `career_${romeCode}_v1`;
    
    // 1. Try Cache
    const cached = await embeddingsCacheService.getCachedEmbedding(cacheKey);
    if (cached) return cached.embedding;

    // 2. Fetch Data if not provided
    let data = careerData;
    if (!data) {
       const { data: rome, error } = await supabase
        .from('rome_metiers')
        .select('libelle, definition, description, competencesMobilisees')
        .eq('code', romeCode)
        .single();
       
       if (error || !rome) return null;
       data = rome;
    }

    // 3. Construct text representation
    // We combine title, definition, and key competencies
    const competencies = Array.isArray(data.competencesMobilisees) 
      ? data.competencesMobilisees.slice(0, 5).join(", ") 
      : "";
      
    const textToEmbed = `Métier: ${data.libelle}. Description: ${data.definition || data.description}. Compétences clés: ${competencies}.`;

    // 4. Generate
    const embedding = await semanticMatchingService.generateEmbedding(textToEmbed);

    // 5. Cache
    await embeddingsCacheService.setCachedEmbedding(cacheKey, embedding);

    return embedding;
  },

  /**
   * Gets or generates embeddings for a batch of popular careers
   * This is used for the comparison analysis
   */
  async getPopularCareerEmbeddings(limit = 20) {
    // Fetch a subset of careers to compare against
    const { data: careers } = await supabase
      .from('rome_metiers')
      .select('code, libelle, definition')
      .limit(limit);

    if (!careers) return [];

    const results = [];
    
    // Process in parallel (batches of 5 to respect rate limits roughly)
    for (let i = 0; i < careers.length; i += 5) {
      const batch = careers.slice(i, i + 5);
      const promises = batch.map(async (c) => {
        try {
          const emb = await this.getCareerEmbedding(c.code, c);
          return { ...c, embedding: emb };
        } catch (e) {
          console.warn(`Failed to embed career ${c.code}`, e);
          return null;
        }
      });
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults.filter(Boolean));
    }

    return results;
  }
};