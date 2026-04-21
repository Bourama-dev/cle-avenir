import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch REAL job offers from database
 * Integrates with France Travail API data and local job_offers table
 */
export const realJobDataService = {
  /**
   * Get all job offers from local database
   */
  async getAllJobOffers(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from('job_offers')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { offers: data || [], total: count || 0 };
    } catch (error) {
      console.error('Error fetching job offers:', error);
      return { offers: [], total: 0 };
    }
  },

  /**
   * Get job offers for a specific career (ROME code)
   */
  async getJobsForCareer(romeCode, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('rome_code', romeCode)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
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
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,company.ilike.%${query}%,description.ilike.%${query}%`);
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
      // Get user's interests and skills
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('interests, skills, sector')
        .eq('id', userId)
        .single();

      if (!userProfile) return [];

      // Search for matching jobs
      let query = supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active');

      if (userProfile.sector) {
        query = query.ilike('domain', `%${userProfile.sector}%`);
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
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .order('application_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching popular job offers:', error);
      return [];
    }
  },

  /**
   * Get recent job offers
   */
  async getRecentJobOffers(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent job offers:', error);
      return [];
    }
  },

  /**
   * Sync jobs from France Travail API (if implemented)
   * This would be called by a background job
   */
  async syncJobsFromFranceTravail(limit = 100) {
    try {
      console.log('Syncing jobs from France Travail API...');
      // TODO: Implement France Travail API integration
      // This would fetch real jobs from France Travail and store them in job_offers table
      return { synced: 0, message: 'France Travail API integration pending' };
    } catch (error) {
      console.error('Error syncing jobs from France Travail:', error);
      return { synced: 0, error: error.message };
    }
  }
};
