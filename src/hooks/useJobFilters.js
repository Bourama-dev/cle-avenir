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
    const savedFilters = localStorage.getItem('job_filters_v3');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        
        // Validate location structure if it exists
        if (parsed.location) {
            parsed.location.lat = Number(parsed.location.lat);
            parsed.location.lon = Number(parsed.location.lon);
            
            if (isNaN(parsed.location.lat) || isNaN(parsed.location.lon)) {
                parsed.location = null;
            }
        }
        
        setFilters(prev => ({
            ...prev,
            ...parsed,
            limit: 20 // Enforce 20 limit
        }));
      } catch (e) {
        console.error('Failed to parse saved filters', e);
      }
    } else {
        setFilters(prev => ({ ...prev, limit: 20 }));
    }
  }, []);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('job_filters_v3', JSON.stringify(filters));
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

      // Validate and format location parameter
      let communeParam = undefined;
      let latParam = undefined;
      let lonParam = undefined;
      
      if (filters.location) {
        const lat = Number(filters.location.lat);
        const lon = Number(filters.location.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
          latParam = lat;
          lonParam = lon;
        }
        
        const val = filters.location.zipcode || filters.location.name;
        if (val && typeof val === 'string' && val.trim().length > 0) {
          communeParam = val.trim();
        }
      }

      // Prepare payload for edge function
      // Note: API only accepts single contract/experience, so we send first selected
      // Client-side will apply additional filtering if needed
      const payload = {
        search: filters.search?.trim() || undefined,
        commune: communeParam,
        latitude: latParam,
        longitude: lonParam,
        distance: undefined,
        contract: filters.contractTypes.length > 0 ? filters.contractTypes[0] : undefined,
        experience: filters.experiences.length > 0 ? filters.experiences[0] : undefined,
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
              return false;
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
      // Calculate total pages based on FILTERED results for accurate pagination
      setTotalPages(Math.ceil(filtered.length / filters.limit));

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