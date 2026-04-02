import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useTestResults() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestResults = useCallback(async () => {
    if (!user) {
      setTestResult(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setTestResult(data);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError(err.message || 'Impossible de charger les résultats du test.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTestResults();
  }, [fetchTestResults]);

  return {
    testResult,
    loading,
    error,
    refetch: fetchTestResults
  };
}