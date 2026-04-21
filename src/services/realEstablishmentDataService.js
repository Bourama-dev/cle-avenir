import { supabase } from '@/lib/customSupabaseClient';

export const realEstablishmentDataService = {
  /**
   * Get actual students linked to an establishment.
   * Optimized: single JOIN query instead of 3 sequential queries.
   */
  async getEstablishmentStudents(institutionId, limit = 50, offset = 0) {
    try {
      // Single JOIN query: user_institution_links → profiles
      const { data: links, error: linkError, count } = await supabase
        .from('user_institution_links')
        .select(
          `user_id,
           profiles!inner(id, first_name, last_name, email, avatar_url, education_level)`,
          { count: 'exact' }
        )
        .eq('institution_id', institutionId)
        .range(offset, offset + limit - 1);

      if (linkError) throw linkError;
      if (!links || links.length === 0) return { students: [], total: count || 0 };

      const userIds = links.map(l => l.user_id);

      // Fetch test results in parallel (one query for all users)
      const { data: testResults, error: testError } = await supabase
        .from('user_test_results')
        .select('user_id, dominant_profile, completed_at, total_score')
        .in('user_id', userIds)
        .order('completed_at', { ascending: false });

      if (testError) throw testError;

      // Build a Map for fast lookup: userId → latest test result
      const latestTestMap = new Map();
      const testCountMap = new Map();
      (testResults || []).forEach(t => {
        testCountMap.set(t.user_id, (testCountMap.get(t.user_id) || 0) + 1);
        if (!latestTestMap.has(t.user_id)) {
          latestTestMap.set(t.user_id, t);
        }
      });

      const students = links.map(link => {
        const profile = link.profiles;
        const latestTest = latestTestMap.get(link.user_id);
        const testsCount = testCountMap.get(link.user_id) || 0;

        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Étudiant',
          email: profile.email || 'N/A',
          avatar_url: profile.avatar_url,
          tests_completed: testsCount,
          dominant_profile: latestTest?.dominant_profile || 'Non évalué',
          last_test_date: latestTest?.completed_at || null,
          last_score: latestTest?.total_score || null,
          status: testsCount > 0 ? 'Actif' : 'Inscrit',
        };
      });

      return { students, total: count || 0 };
    } catch (error) {
      console.error('Error fetching establishment students:', error);
      return { students: [], total: 0 };
    }
  },

  /**
   * Get actual staff members at an establishment
   */
  async getEstablishmentStaff(institutionId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('institution_staff')
        .select('id, first_name, last_name, email, role, created_at')
        .eq('institution_id', institutionId)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(staff => ({
        id: staff.id,
        name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim(),
        email: staff.email,
        role: staff.role,
        status: 'Actif',
      }));
    } catch (error) {
      console.error('Error fetching establishment staff:', error);
      return [];
    }
  },

  /**
   * Get institution programs/classes
   */
  async getInstitutionPrograms(institutionId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('institution_programs')
        .select(
          `id, name, level, formation_id, created_at,
           formations(name)`
        )
        .eq('institution_id', institutionId)
        .limit(limit);

      if (error) throw error;

      return (data || []).map(prog => ({
        id: prog.id,
        name: prog.name,
        level: prog.level,
        formation_name: prog.formations?.name || 'Formation',
        status: 'Active',
      }));
    } catch (error) {
      console.error('Error fetching institution programs:', error);
      return [];
    }
  },

  /**
   * Get establishment statistics from actual data.
   * Optimized: all count queries run in parallel with Promise.all.
   */
  async getEstablishmentStatistics(institutionId) {
    try {
      // Run all count queries in parallel
      const [
        { count: totalStudents },
        { count: programCount },
        { count: staffCount },
        { data: userLinks },
      ] = await Promise.all([
        supabase
          .from('user_institution_links')
          .select('*', { count: 'exact', head: true })
          .eq('institution_id', institutionId),
        supabase
          .from('institution_programs')
          .select('*', { count: 'exact', head: true })
          .eq('institution_id', institutionId),
        supabase
          .from('institution_staff')
          .select('*', { count: 'exact', head: true })
          .eq('institution_id', institutionId),
        supabase
          .from('user_institution_links')
          .select('user_id')
          .eq('institution_id', institutionId),
      ]);

      const userIds = (userLinks || []).map(l => l.user_id);

      // Get completed tests count (needs userIds from previous query)
      let completedTests = 0;
      if (userIds.length > 0) {
        const { count } = await supabase
          .from('user_test_results')
          .select('*', { count: 'exact', head: true })
          .in('user_id', userIds);
        completedTests = count || 0;
      }

      const total = totalStudents || 0;
      const completionRate = total > 0 ? Math.round((completedTests / total) * 100) : 0;

      return {
        totalStudents: total,
        activeStudents: completedTests,
        completedTests,
        completionRate,
        programCount: programCount || 0,
        staffCount: staffCount || 0,
      };
    } catch (error) {
      console.error('Error fetching establishment statistics:', error);
      return {
        totalStudents: 0,
        activeStudents: 0,
        completedTests: 0,
        completionRate: 0,
        programCount: 0,
        staffCount: 0,
      };
    }
  },

  /**
   * Get student test recommendations/results.
   * Optimized: fetches user IDs and test results in two parallel-ready queries.
   */
  async getStudentRecommendations(institutionId, limit = 10) {
    try {
      const { data: userLinks } = await supabase
        .from('user_institution_links')
        .select('user_id')
        .eq('institution_id', institutionId);

      const userIds = (userLinks || []).map(l => l.user_id);
      if (userIds.length === 0) return [];

      const { data, error } = await supabase
        .from('user_test_results')
        .select('user_id, dominant_profile, recommended_metiers')
        .in('user_id', userIds)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching student recommendations:', error);
      return [];
    }
  },

  /**
   * Get institution details
   */
  async getInstitutionDetails(institutionId) {
    try {
      const { data, error } = await supabase
        .from('educational_institutions')
        .select('*')
        .eq('id', institutionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching institution ${institutionId}:`, error);
      return null;
    }
  },
};
