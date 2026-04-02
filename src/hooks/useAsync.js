import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      console.error("Async Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du chargement des données.",
      });
      throw error;
    }
  }, [asyncFunction, toast]);

  // Retry wrapper
  const retry = useCallback((...args) => {
     execute(...args);
  }, [execute]);

  return { execute, status, value, error, isLoading: status === 'pending', retry };
};