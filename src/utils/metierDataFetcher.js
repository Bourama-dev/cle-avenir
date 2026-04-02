import { useState, useCallback } from 'react';
import { metierService } from '@/services/metierService';

/**
 * Custom hook to consistently fetch metier data with error handling and caching
 */
export const useMetierDataFetcher = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetierWithErrorHandling = useCallback(async (code) => {
    if (!code) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await metierService.getMetierByRomeCode(code);
      setData(result);
      return result;
    } catch (err) {
      const isRateLimit = err?.message?.includes('Trop de requêtes') || err?.status === 429;
      const errorMessage = isRateLimit
        ? "Trop de requêtes. Veuillez réessayer dans quelques secondes."
        : "Erreur lors du chargement des données. Veuillez réessayer.";
      
      const formattedError = new Error(errorMessage);
      formattedError.status = err?.status || (isRateLimit ? 429 : 500);
      formattedError.originalError = err;
      
      setError(formattedError);
      throw formattedError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    retry: fetchMetierWithErrorHandling,
    fetchMetierWithErrorHandling
  };
};