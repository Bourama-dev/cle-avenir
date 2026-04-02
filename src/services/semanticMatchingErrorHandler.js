import { supabase } from '@/lib/customSupabaseClient';

export const ErrorTypes = {
  EMBEDDING_GENERATION: 'EMBEDDING_GENERATION',
  CACHE_ACCESS: 'CACHE_ACCESS',
  API_ERROR: 'API_ERROR',
  SIMILARITY_CALCULATION: 'SIMILARITY_CALCULATION',
  NETWORK_ERROR: 'NETWORK_ERROR'
};

class SemanticMatchingError extends Error {
  constructor(type, message, originalError = null, context = {}) {
    super(message);
    this.name = 'SemanticMatchingError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export const SemanticMatchingErrorHandler = {
  /**
   * Logs error to Supabase and Console
   */
  async logError(error) {
    console.error(`[SemanticMatching] ${error.type}:`, error.message, error.context);

    try {
      // Attempt to log to DB if possible
      await supabase.from('error_logs').insert({
        message: error.message,
        stack: error.stack,
        component_stack: error.type, // Reusing field
        severity: 'warning',
        created_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    } catch (logError) {
      console.warn('Failed to log semantic error to DB:', logError);
    }
  },

  /**
   * Wrapper for async functions to handle errors automatically
   */
  async withErrorHandling(operation, context, fallbackValue = null) {
    try {
      return await operation();
    } catch (err) {
      const errorType = err.message.includes('fetch') ? ErrorTypes.NETWORK_ERROR : ErrorTypes.API_ERROR;
      const semanticError = new SemanticMatchingError(
        errorType, 
        err.message || "Unknown semantic operation error", 
        err, 
        context
      );
      
      await this.logError(semanticError);
      
      if (fallbackValue !== null) {
        return fallbackValue;
      }
      throw semanticError;
    }
  },

  /**
   * Exponential backoff retry logic
   */
  async retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        const delay = baseDelay * Math.pow(2, i);
        console.log(`[SemanticMatching] Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
};