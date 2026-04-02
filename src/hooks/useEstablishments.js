import { useState, useEffect, useCallback, useRef } from 'react';
import { EstablishmentService } from '@/services/establishmentService';
import { useToast } from '@/components/ui/use-toast';

const CACHE_KEY = 'establishments_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEstablishments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', type: 'all', region: 'all', sector: 'all', status: 'all' });
  const [sort, setSort] = useState({ column: 'created_at', direction: 'desc' });
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [retryCount, setRetryCount] = useState(0);
  
  const { toast } = useToast();
  const abortControllerRef = useRef(null);

  const loadFromCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data: cachedData, total, stats: cachedStats } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          console.log('Loading establishments from cache');
          setData(cachedData);
          setPagination(prev => ({ ...prev, total }));
          setStats(cachedStats);
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to load cache', e);
    }
    return false;
  };

  const fetchEstablishments = useCallback(async (isRetry = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    // If it's a fresh load (not retry/pagination), try cache first to show something
    if (!isRetry && pagination.page === 1 && !filters.search) {
       loadFromCache();
    }

    try {
      console.log('useEstablishments: Fetching data...');
      
      // Parallel fetch for data and stats
      const [result, statsData] = await Promise.all([
        EstablishmentService.getEstablishments({
          page: pagination.page,
          limit: pagination.limit,
          filters,
          sort
        }),
        EstablishmentService.getStats()
      ]);

      if (result.error) {
        throw result.error;
      }

      // Success
      setData(result.data || []);
      setPagination(prev => ({ ...prev, total: result.count || 0 }));
      setStats(statsData);
      setRetryCount(0); // Reset retry on success

      // Update cache
      if (pagination.page === 1 && !filters.search) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: result.data,
          total: result.count,
          stats: statsData
        }));
      }

      console.log('useEstablishments: Data loaded successfully');

    } catch (err) {
      if (err.name === 'AbortError') return;

      console.error("useEstablishments: Failed to fetch:", err);
      setError(err);
      
      // Retry logic
      if (retryCount < 3 && !isRetry) {
        const timeout = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${timeout}ms... (Attempt ${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchEstablishments(true);
        }, timeout);
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger la liste des établissements. Veuillez vérifier votre connexion."
        });
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sort, retryCount, toast]);

  useEffect(() => {
    fetchEstablishments();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [pagination.page, pagination.limit, filters, sort]); // Intentionally exclude fetchEstablishments to avoid loops

  const createEstablishment = async (establishmentData) => {
    try {
      await EstablishmentService.createEstablishment(establishmentData);
      toast({ title: "Succès", description: "Établissement créé avec succès." });
      fetchEstablishments();
      return true;
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erreur", description: "Erreur lors de la création." });
      return false;
    }
  };

  const updateEstablishment = async (id, updates) => {
    try {
      await EstablishmentService.updateEstablishment(id, updates);
      toast({ title: "Succès", description: "Établissement mis à jour." });
      fetchEstablishments();
      return true;
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erreur", description: "Erreur lors de la mise à jour." });
      return false;
    }
  };

  const deleteEstablishment = async (id) => {
    try {
      await EstablishmentService.deleteEstablishment(id);
      toast({ title: "Succès", description: "Établissement supprimé." });
      fetchEstablishments();
      return true;
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Erreur", description: "Erreur lors de la suppression." });
      return false;
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (column) => {
    setSort(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const setLimit = (limit) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const manualRefresh = () => {
    setRetryCount(0);
    fetchEstablishments();
  };

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    sort,
    stats,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    refresh: manualRefresh,
    setLimit
  };
};