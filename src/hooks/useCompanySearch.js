import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const PAGE_SIZE = 20;

const useCompanySearch = ({ location, romeCodes, contract, distance }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);   // null | 'credentials_missing' | 'auth_failed' | 'not_subscribed' | string
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Abort controller ref to cancel in-flight requests on param change
  const abortRef = useRef(null);

  const fetchCompanies = useCallback(async (pageNum = 1) => {
    // Require valid coordinates
    const lat = location?.lat ? Number(location.lat) : null;
    const lon = location?.lon ? Number(location.lon) : null;
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      setCompanies([]);
      setTotal(0);
      setTotalPages(0);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();

    setLoading(true);
    setError(null);

    try {
      const payload = {
        latitude: lat,
        longitude: lon,
        distance: distance ?? 30,
        page: pageNum,
        page_size: PAGE_SIZE,
      };
      if (romeCodes) payload.rome_codes = romeCodes;
      if (contract && contract !== 'all') payload.contract = contract;

      const { data, error: fnError } = await supabase.functions.invoke('get-companies', {
        body: payload,
      });

      if (fnError) throw new Error(fnError.message);
      if (!data) throw new Error('Aucune donnée reçue');

      if (data.warning) {
        setError(data.warning);
        setCompanies([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      setCompanies(data.companies ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(Math.ceil((data.total ?? 0) / PAGE_SIZE));
      setPage(pageNum);

    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.error('[useCompanySearch]', err);
      setError('Impossible de charger les entreprises. Veuillez réessayer.');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [location?.lat, location?.lon, romeCodes, contract, distance]);

  // Auto-fetch when params change, reset to page 1
  useEffect(() => {
    setPage(1);
    fetchCompanies(1);
  }, [fetchCompanies]);

  const goToPage = useCallback((p) => {
    fetchCompanies(p);
  }, [fetchCompanies]);

  return { companies, loading, error, total, page, totalPages, goToPage, refetch: () => fetchCompanies(page) };
};

export default useCompanySearch;
