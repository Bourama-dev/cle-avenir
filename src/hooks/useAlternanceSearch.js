import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const PAGE_SIZE = 20;

const useAlternanceSearch = ({ location, romeCodes, distance }) => {
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAlternance = useCallback(async (pageNum = 1) => {
    const lat = location?.lat ? Number(location.lat) : null;
    const lon = location?.lon ? Number(location.lon) : null;
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      setJobs([]);
      setRecruiters([]);
      setTotal(0);
      setTotalPages(0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        latitude: lat,
        longitude: lon,
        radius: distance ?? 30,
        page: pageNum,
        limit: PAGE_SIZE,
      };
      if (romeCodes) payload.romes = romeCodes;

      const { data, error: fnError } = await supabase.functions.invoke('get-alternance', {
        body: payload,
      });

      if (fnError) throw new Error(fnError.message);
      if (!data) throw new Error('Aucune donnée reçue');

      if (data._debug) {
        console.group('[get-alternance] Debug — structure brute de l\'API LBA');
        console.log('First raw job:', data._debug.firstRawJob);
        console.log('First normalised job:', data._debug.firstNormalisedJob);
        console.groupEnd();
      }

      if (data.warning) {
        setError(data.warning);
        setJobs([]);
        setRecruiters([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      setJobs(data.jobs ?? []);
      setRecruiters(data.recruiters ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? Math.ceil((data.total ?? 0) / PAGE_SIZE));
      setPage(pageNum);

    } catch (err) {
      console.error('[useAlternanceSearch]', err);
      setError('Impossible de charger les offres en alternance. Veuillez réessayer.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [location?.lat, location?.lon, romeCodes, distance]);

  useEffect(() => {
    setPage(1);
    fetchAlternance(1);
  }, [fetchAlternance]);

  const goToPage = useCallback((p) => fetchAlternance(p), [fetchAlternance]);

  return {
    jobs,
    recruiters,
    loading,
    error,
    total,
    page,
    totalPages,
    goToPage,
    refetch: () => fetchAlternance(page),
  };
};

export default useAlternanceSearch;
