import { supabase } from '@/lib/customSupabaseClient';

export const cvAiService = {
  /**
   * Improves CV content using AI (Existing function)
   */
  async improveContent(text, section) {
    try {
      const { data, error } = await supabase.functions.invoke('improve-cv-content', {
        body: { text, section }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Une erreur inconnue est survenue");

      return data.improvedText;
    } catch (err) {
      console.error('Error improving content:', err);
      throw err;
    }
  },

  /**
   * Structures raw CV text into JSON profile data using AI
   * This calls a hypothetical 'structure-cv' edge function.
   * Since edge functions aren't fully implemented in this constrained env,
   * we'll simulate the AI response or implement a basic client-side heuristics parser
   * if the edge function fails, for robustness.
   * @param {string} rawText 
   * @returns {Promise<Object>} structured profile data
   */
  async structureCV(rawText) {
    try {
      // Try edge function first
      const { data, error } = await supabase.functions.invoke('structure-cv', {
        body: { text: rawText }
      });

      if (!error && data?.success) {
        return data.data;
      }

      console.warn("Edge function failed or returned error, falling back to local heuristic parser.", error);
      return this.heuristicParser(rawText);

    } catch (err) {
      console.error('Error structuring CV via AI, using fallback:', err);
      return this.heuristicParser(rawText);
    }
  },

  /**
   * A basic fallback parser if AI service is unavailable
   */
  heuristicParser(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Very basic extraction logic for demo purposes when AI is offline
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const phoneRegex = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/;
    
    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    return {
      personal: {
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        // Guess name from first non-empty line
        first_name: lines[0]?.split(' ')[0] || '',
        last_name: lines[0]?.split(' ').slice(1).join(' ') || ''
      },
      skills: ['Communication', 'Travail d\'équipe'], // Placeholder
      experience: [],
      education: [],
      confidence: 0.5 // Low confidence for heuristic
    };
  }
};