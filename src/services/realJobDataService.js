import { supabase } from '@/lib/customSupabaseClient';
import { CacheService } from './CacheService';

const CACHE_TTL_JOBS = 5 * 60 * 1000; // 5 minutes

export const realJobDataService = {
  /**
   * Get all job offers from local database (with caching)
   */
  async getAllJobOffers(limit = 50, offset = 0) {
    const cacheKey = CacheService.generateKey('job_offers_all', { limit, offset });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error, count } = await supabase
        .from('job_offers')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const result = { offers: data || [], total: count || 0 };
      CacheService.set(cacheKey, result, CACHE_TTL_JOBS);
      return result;
    } catch (error) {
      console.error('Error fetching job offers:', error);
      return { offers: [], total: 0 };
    }
  },

  /**
   * Get job offers for a specific career (ROME code)
   */
  async getJobsForCareer(romeCode, limit = 20) {
    const cacheKey = CacheService.generateKey('jobs_career', { romeCode, limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('rome_code', romeCode)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_JOBS);
      return result;
    } catch (error) {
      console.error(`Error fetching jobs for career ${romeCode}:`, error);
      return [];
    }
  },

  /**
   * Search job offers by location, title, or company
   */
  async searchJobOffers(query, filters = {}, limit = 30) {
    try {
      let queryBuilder = supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active');

      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,company.ilike.%${query}%`
        );
      }

      if (filters.location) {
        queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
      }
      if (filters.contract_type) {
        queryBuilder = queryBuilder.eq('contract_type', filters.contract_type);
      }
      if (filters.experience_level) {
        queryBuilder = queryBuilder.eq('experience_level', filters.experience_level);
      }
      if (filters.min_salary) {
        queryBuilder = queryBuilder.gte('salary_min', filters.min_salary);
      }
      if (filters.rome_code) {
        queryBuilder = queryBuilder.eq('rome_code', filters.rome_code);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching job offers:', error);
      return [];
    }
  },

  /**
   * Get job offers by location
   */
  async getJobsByLocation(location, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .ilike('location', `%${location}%`)
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching jobs in ${location}:`, error);
      return [];
    }
  },

  /**
   * Get job offers by contract type
   */
  async getJobsByContractType(contractType, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .eq('contract_type', contractType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching ${contractType} jobs:`, error);
      return [];
    }
  },

  /**
   * Get a specific job offer details
   */
  async getJobOfferDetails(offerId) {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching job offer ${offerId}:`, error);
      return null;
    }
  },

  /**
   * Get job offers matching a user's skills/interests
   */
  async getRecommendedJobs(userId, limit = 15) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('interests, skills, sector')
        .eq('id', userId)
        .single();

      if (!userProfile) return [];

      let query = supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active');

      if (userProfile.sector) {
        query = query.ilike('sector', `%${userProfile.sector}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching recommended jobs for user ${userId}:`, error);
      return [];
    }
  },

  /**
   * Get top job offers by applications or views
   */
  async getPopularJobOffers(limit = 20) {
    const cacheKey = CacheService.generateKey('jobs_popular', { limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .order('application_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_JOBS);
      return result;
    } catch (error) {
      console.error('Error fetching popular job offers:', error);
      return [];
    }
  },

  /**
   * Get recent job offers (with caching)
   */
  async getRecentJobOffers(limit = 20) {
    const cacheKey = CacheService.generateKey('jobs_recent', { limit });
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const result = data || [];
      CacheService.set(cacheKey, result, CACHE_TTL_JOBS);
      return result;
    } catch (error) {
      console.error('Error fetching recent job offers:', error);
      return [];
    }
  },

  /**
   * Search France Travail jobs LIVE via Edge Function (real-time results)
   * Uses the get-jobs edge function which queries the France Travail API directly
   */
  async searchJobsLive(params = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('get-jobs', {
        body: {
          search: params.query || '',
          commune: params.commune || '',
          distance: params.distance || 10,
          contract: params.contractType || '',
          experience: params.experience || '',
          teletravauxOnly: params.remoteOnly || false,
          page: params.page || 1,
          limit: params.limit || 20,
          sort: params.sort || 1,
        },
      });

      if (error) throw new Error(error.message || 'Erreur get-jobs');
      if (data?.warning === 'credentials_missing') {
        return { offers: [], total: 0, source: 'local_fallback' };
      }

      const resultats = data?.data?.resultats || [];
      const total = data?.meta?.total || resultats.length;

      return {
        offers: resultats.map(this._normalizeFranceTravailJob),
        total,
        source: 'france_travail_live',
      };
    } catch (error) {
      console.error('Error searching France Travail live jobs:', error);
      return { offers: [], total: 0, source: 'error' };
    }
  },

  /**
   * Get live France Travail jobs for a specific ROME code
   */
  async getJobsForCareerLive(romeCode, limit = 10) {
    try {
      const { data, error } = await supabase.functions.invoke('get-rome-job-offers', {
        body: { code: romeCode, limit },
      });

      if (error) throw new Error(error.message || 'Erreur get-rome-job-offers');
      if (data?.warning === 'credentials_missing') return [];

      const resultats = data?.data || [];
      return resultats.map(this._normalizeFranceTravailJob);
    } catch (error) {
      console.error(`Error fetching live jobs for ${romeCode}:`, error);
      return [];
    }
  },

  /**
   * Trigger sync of France Travail jobs into the job_offers table
   * Calls the sync-france-travail-jobs edge function
   */
  async syncJobsFromFranceTravail(options = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('sync-france-travail-jobs', {
        body: {
          romeCodes: options.romeCodes || null,
          limitPerCode: options.limitPerCode || 20,
        },
      });

      if (error) throw new Error(error.message || 'Erreur sync-france-travail-jobs');
      if (data?.warning === 'credentials_missing') {
        return { synced: 0, message: 'France Travail credentials not configured' };
      }

      return {
        synced: data?.synced || 0,
        errors: data?.errors || 0,
        message: data?.message || 'Sync complete',
      };
    } catch (error) {
      console.error('Error syncing jobs from France Travail:', error);
      return { synced: 0, error: error.message };
    }
  },

  /**
   * Normalize a France Travail API job result to the local job_offers schema
   * @private
   */
  _normalizeFranceTravailJob(job) {
    return {
      id: job.id,
      external_id: job.id,
      source: 'france_travail_live',
      title: job.intitule || 'Offre sans titre',
      description: job.description || null,
      company: job.entreprise?.nom || null,
      location: job.lieuTravail?.libelle || null,
      rome_code: job.romeCode || null,
      rome_label: job.romeLibelle || null,
      contract_type: job.typeContrat || null,
      contract_type_label: job.typeContratLibelle || null,
      experience_label: job.experienceLibelle || null,
      salary_label: job.salaire?.libelle || null,
      sector: job.secteurActiviteLibelle || null,
      status: 'active',
      published_at: job.dateCreation || null,
    };
  },
};
