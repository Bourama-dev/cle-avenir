import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from '@/services/CacheService';
import { calculateDistance } from '@/services/LocationFilterService';
import { isValidUUID } from '@/lib/utils';

const useJobFilters = () => {
  // Enhanced filter state structure
  const [filters, setFilters] = useState({
    search: '',
    location: null, // object: { name, zipcode, lat, lon }
    radius: null, // number (km) or null for unlimited
    contractTypes: [],
    experiences: [],
    teletravauxOnly: false,
    page: 1,
    limit: 20 // Default limit 20
  });

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); 
  const [filteredCount, setFilteredCount] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem('job_filters_v4');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);

        if (parsed.location) {
          const lat = Number(parsed.location.lat);
          const lon = Number(parsed.location.lon);
          // Discard location if coordinates are invalid OR if it lacks an inseeCode
          // (old Nominatim-based locations had no inseeCode and sent city names to FT API)
          if (isNaN(lat) || isNaN(lon) || !parsed.location.inseeCode) {
            parsed.location = null;
            parsed.radius = null;
          } else {
            parsed.location.lat = lat;
            parsed.location.lon = lon;
          }
        }

        setFilters(prev => ({ ...prev, ...parsed, limit: 20 }));
      } catch (e) {
        console.error('Failed to parse saved filters', e);
      }
    } else {
      setFilters(prev => ({ ...prev, limit: 20 }));
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('job_filters_v4', JSON.stringify(filters));
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      location: null,
      radius: null,
      contractTypes: [],
      experiences: [],
      teletravauxOnly: false,
      page: 1,
      limit: 20
    });
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
      setFilters(prev => ({
          ...prev,
          ...newFilters,
          page: 1 // Reset to page 1 on filter change
      }));
  }, []);

  const updateFilter = useCallback((key, value) => {
    if (key === 'location' && value) {
        value.lat = Number(value.lat);
        value.lon = Number(value.lon);
        if (isNaN(value.lat) || isNaN(value.lon)) {
            console.warn('Invalid location coordinates provided to updateFilter');
        }
    }

    // Use handleFilterChange logic effectively by creating object
    handleFilterChange({ [key]: value });
  }, [handleFilterChange]);

  const setPage = useCallback((newPage) => {
    setFilters(prev => ({
        ...prev,
        page: newPage
    }));
  }, []);

  const setSearchQuery = useCallback((query) => {
      handleFilterChange({ search: query });
  }, [handleFilterChange]);

  const fetchJobs = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      // Location: send pre-resolved INSEE code as dedicated field so the edge function
      // never runs resolveInseeCode on an already-resolved value (which would query
      // geo.api.gouv.fr with an INSEE code as if it were a postal code).
      let inseeCodeParam = undefined;
      let communeParam   = undefined;  // fallback for postal code / city name

      if (filters.location) {
        if (filters.location.inseeCode) {
          inseeCodeParam = filters.location.inseeCode;
        } else if (filters.location.zipcode) {
          communeParam = filters.location.zipcode;
        } else if (filters.location.name) {
          communeParam = filters.location.name;
        }
      }

      const hasLocation = Boolean(inseeCodeParam || communeParam);

      const payload = {
        search: filters.search?.trim() || undefined,
        inseeCode: inseeCodeParam,                                   // direct INSEE — highest priority
        commune:   inseeCodeParam ? undefined : communeParam,        // postal/name — only if no inseeCode
        distance:  (hasLocation && filters.radius) ? filters.radius : undefined,
        contracts: filters.contractTypes.length > 0 ? filters.contractTypes : undefined,
        experiences: filters.experiences.length > 0 ? filters.experiences : undefined,
        teletravauxOnly: filters.teletravauxOnly,
        page: filters.page,
        limit: filters.limit,
        sort: 1
      };

      const cacheKey = CacheService.generateKey(`jobs_search_v3_${filters.page}_${filters.limit}`, payload);
      
      let data;
      
      const { data: apiData, error: apiError } = await supabase.functions.invoke('get-jobs', {
        body: payload
      });

      if (apiError) {
        console.error('Edge Function Error:', apiError);
        throw new Error(apiError.message || 'Erreur lors de la récupération des offres');
      }
      
      if (!apiData) {
          throw new Error('Aucune donnée reçue du serveur');
      }

      data = apiData;

      // === DIAGNOSTIC — visible dans DevTools > Console ===
      console.group('[get-jobs] Réponse brute');
      console.log('warning:', data?.warning);
      console.log('total:', data?.meta?.total);
      console.log('resultats count:', data?.data?.resultats?.length ?? 0);
      console.log('full response:', JSON.stringify(data).slice(0, 500));
      console.groupEnd();

      // Detect warnings returned as HTTP 200
      if (data?.warning) {
        console.warn('[useJobFilters] get-jobs warning:', data.warning);
        const w = data.warning;
        setJobs([]);
        setFilteredJobs([]);
        setTotalCount(0);
        setFilteredCount(0);
        setTotalPages(0);
        if (w === 'credentials_missing') {
          setError('credentials_missing');
        } else if (w === 'auth_failed') {
          setError('auth_failed');
        } else if (w && w.startsWith('api_error_')) {
          setError(w); // e.g. 'api_error_401', 'api_error_403'
        } else {
          setError('api_unavailable');
        }
        return;
      }

      const mappedJobs = (data?.data?.resultats || []).map(job => {
        let jobLat = job.lieuTravail?.latitude ? Number(job.lieuTravail.latitude) : null;
        let jobLon = job.lieuTravail?.longitude ? Number(job.lieuTravail.longitude) : null;

        return {
          id: job.id,
          title: job.intitule,
          company: job.entreprise?.nom || 'Entreprise confidentielle',
          company_logo: job.entreprise?.logo,
          location: job.lieuTravail?.libelle,
          latitude: jobLat,
          longitude: jobLon,
          contract_type: job.typeContratLibelle,
          salary_range: job.salaire?.libelle,
          experience_level: job.experienceLibelle,
          description: job.description,
          published_at: job.dateCreation,
          url: job.origineOffre?.urlOrigine,
          is_remote: job.teletravail || false,
          sector: job.romeCode,
          skills: job.competences?.map(c => c.libelle) || [],
          contract_duration: job.dureeTravailLibelleConverti || job.dureeTravailLibelle,
          applicant_count: Math.floor(Math.random() * 20)
        };
      });

      // Calculate distances
      const userLat = filters.location?.lat ? Number(filters.location.lat) : null;
      const userLon = filters.location?.lon ? Number(filters.location.lon) : null;
      
      let jobsWithDistance = mappedJobs;
      if (userLat !== null && userLon !== null) {
          jobsWithDistance = mappedJobs.map(job => {
              let dist = null;
              if (job.latitude && job.longitude) {
                  dist = calculateDistance(
                      userLat, 
                      userLon, 
                      job.latitude, 
                      job.longitude
                  );
              }
              return { ...job, distanceToUser: dist };
          });
      }

      const totalResults = data?.meta?.total || jobsWithDistance.length;
      setTotalCount(totalResults);

      // Apply Radius Filter Client-Side
      const userRadius = filters.radius ? Number(filters.radius) : null;
      let filtered = jobsWithDistance;

      if (userRadius !== null && userLat !== null && userLon !== null) {
          filtered = jobsWithDistance.filter(job => {
              if (job.distanceToUser !== null) {
                  return job.distanceToUser <= userRadius;
              }
              return true; // keep jobs without coordinates rather than hiding them
          });
      }

      if (isLoadMore) {
          setJobs(prev => [...prev, ...jobsWithDistance]);
          setFilteredJobs(prev => [...prev, ...filtered]);
      } else {
          setJobs(jobsWithDistance);
          setFilteredJobs(filtered);
      }

      setFilteredCount(filtered.length);
      // Base pagination on total server results to avoid cutting off pages when radius filter is active
      setTotalPages(Math.ceil(totalResults / filters.limit));

    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError("Impossible de charger les offres. Veuillez réessayer.");
      if (!isLoadMore) {
        setJobs([]);
        setFilteredJobs([]);
        setTotalCount(0);
        setFilteredCount(0);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return {
    filters,
    searchQuery: filters.search,
    setSearchQuery,
    updateFilter,
    handleFilterChange,
    resetFilters,
    jobs: filteredJobs, 
    allJobs: jobs, 
    loading,
    error,
    fetchJobs,
    totalCount, 
    filteredCount, 
    totalPages,
    setPage,
    hasMore: false
  };
};

export default useJobFilters;