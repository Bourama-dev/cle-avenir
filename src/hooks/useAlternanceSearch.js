import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const PAGE_SIZE = 20;
const FETCH_ALL_LIMIT = 100;

// La Bonne Alternance has no free-text search, so keywords are matched client-side
// (accent/case-insensitive, every word must appear in title/company/description).
const norm = (v) => String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const matchesKeywords = (item, tokens) => {
  if (!tokens.length) return true;
  const hay = norm([
    item.title, item.name, item.description, item.naf_text, item.city,
    item.company?.name, item.company?.sector,
  ].filter(Boolean).join(' '));
  return tokens.every((t) => hay.includes(t));
};

const useAlternanceSearch = ({ location, romeCodes, distance, keywords }) => {
  const tokens = norm(keywords).split(/\s+/).filter((t) => t.length > 1);
  const tokensKey = tokens.join(' ');
  const allCache = useRef({ key: null, jobs: [], recruiters: [] });
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
      const searching = tokens.length > 0;
      const invoke = async (page, limit) => {
        const payload = { latitude: lat, longitude: lon, radius: distance ?? 30, page, limit };
        if (romeCodes) payload.romes = romeCodes;
        const { data: d, error: e } = await supabase.functions.invoke('get-alternance', { body: payload });
        if (e) throw new Error(e.message);
        if (!d) throw new Error('Aucune donnée reçue');
        return d;
      };

      if (searching) {
        // Fetch every page once per location/sector/radius, then filter + paginate locally.
        const cacheKey = [lat, lon, romeCodes, distance].join('|');
        if (allCache.current.key !== cacheKey) {
          const first = await invoke(1, FETCH_ALL_LIMIT);
          if (first.warning) { setError(first.warning); setJobs([]); setRecruiters([]); setTotal(0); setTotalPages(0); return; }
          let all = first.jobs ?? [];
          const pages = first.totalPages ?? 1;
          for (let p = 2; p <= pages; p++) {
            const more = await invoke(p, FETCH_ALL_LIMIT);
            all = all.concat(more.jobs ?? []);
          }
          allCache.current = { key: cacheKey, jobs: all, recruiters: first.recruiters ?? [] };
        }
        const matched = allCache.current.jobs.filter((j) => matchesKeywords(j, tokens));
        setJobs(matched.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE));
        setRecruiters(allCache.current.recruiters.filter((r) => matchesKeywords(r, tokens)));
        setTotal(matched.length);
        setTotalPages(Math.ceil(matched.length / PAGE_SIZE));
        setPage(pageNum);
        return;
      }

      const data = await invoke(pageNum, PAGE_SIZE);

      if (data._debug) {
        console.group('[get-alternance] Debug — structure brute de l\'API LBA');
        console.log('First raw job:', data._debug.firstRawJob);
        console.log('First normalised job:', data._debug.firstNormalisedJob);
        console.log('First raw recruiter:', data._debug.firstRawRecruiter);
        console.log('First normalised recruiter:', data._debug.firstNormalisedRecruiter);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lon, romeCodes, distance, tokensKey]);

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
