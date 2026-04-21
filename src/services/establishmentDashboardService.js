import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service for fetching establishment dashboard data
 */
export const establishmentDashboardService = {
  /**
   * Get total students count for an establishment
   */
  async getStudentsCount(institutionId) {
    try {
      if (!institutionId) return 0;

      const { count, error } = await supabase
        .from('user_institution_links')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      if (error) {
        console.error('Error fetching students count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getStudentsCount:', error);
      return 0;
    }
  },

  /**
   * Get completed tests count and participation rate for an establishment
   */
  async getTestsStatistics(institutionId) {
    try {
      if (!institutionId) return { completedTests: 0, participationRate: 0 };

      // Get total students
      const { count: totalStudents } = await supabase
        .from('user_institution_links')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      // Get students who have completed tests
      const { count: testsCompleted } = await supabase
        .from('user_institution_links')
        .select('user_id', { count: 'exact', head: true })
        .eq('institution_id', institutionId)
        .not('user_id', 'is', null);

      // Get test results for these users
      const { data: users } = await supabase
        .from('user_institution_links')
        .select('user_id')
        .eq('institution_id', institutionId);

      const userIds = users?.map(u => u.user_id) || [];

      if (userIds.length === 0) {
        return { completedTests: 0, participationRate: 0 };
      }

      const { count: completedCount } = await supabase
        .from('user_test_results')
        .select('*', { count: 'exact', head: true })
        .in('user_id', userIds);

      const total = totalStudents || 0;
      const completed = completedCount || 0;
      const participationRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        completedTests: completed,
        participationRate
      };
    } catch (error) {
      console.error('Error in getTestsStatistics:', error);
      return { completedTests: 0, participationRate: 0 };
    }
  },

  /**
   * Get formations/programs count for an establishment
   */
  async getFormationsCount(institutionId) {
    try {
      if (!institutionId) return 0;

      const { count, error } = await supabase
        .from('institution_programs')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      if (error) {
        console.error('Error fetching formations count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getFormationsCount:', error);
      return 0;
    }
  },

  /**
   * Get list of students for an establishment with their test results
   */
  async getStudentsList(institutionId, limit = 50, offset = 0) {
    try {
      if (!institutionId) return { students: [], total: 0 };

      const { data: links, count: total, error: linksError } = await supabase
        .from('user_institution_links')
        .select('user_id', { count: 'exact' })
        .eq('institution_id', institutionId)
        .range(offset, offset + limit - 1);

      if (linksError) throw linksError;

      if (!links || links.length === 0) {
        return { students: [], total: total || 0 };
      }

      const userIds = links.map(l => l.user_id);

      // Fetch profile and test data for each user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Fetch test results
      const { data: testResults, error: testError } = await supabase
        .from('user_test_results')
        .select('user_id, dominant_profile, completed_at')
        .in('user_id', userIds)
        .order('completed_at', { ascending: false });

      if (testError) throw testError;

      // Merge data
      const students = profiles?.map(profile => {
        const tests = testResults?.filter(t => t.user_id === profile.id) || [];
        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Étudiant',
          email: profile.email || 'N/A',
          tests_completed: tests.length,
          dominant_profile: tests[0]?.dominant_profile || 'Non déterminé',
          last_test_date: tests[0]?.completed_at || null
        };
      }) || [];

      return { students, total: total || 0 };
    } catch (error) {
      console.error('Error in getStudentsList:', error);
      return { students: [], total: 0 };
    }
  },

  /**
   * Get recent activity logs for an establishment
   */
  async getActivityLogs(institutionId, limit = 5) {
    try {
      if (!institutionId) return [];

      const { data, error } = await supabase
        .from('establishment_activity_logs')
        .select('*')
        .eq('establishment_id', institutionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activity logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActivityLogs:', error);
      return [];
    }
  },

  /**
   * Get student engagement metrics
   */
  async getEngagementMetrics(institutionId) {
    try {
      if (!institutionId) return { totalStudents: 0, activeStudents: 0, engagementRate: 0 };

      const { count: totalStudents } = await supabase
        .from('user_institution_links')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      // Active students = those with at least one test result in the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: links } = await supabase
        .from('user_institution_links')
        .select('user_id')
        .eq('institution_id', institutionId);

      const userIds = links?.map(l => l.user_id) || [];

      const { count: activeCount } = await supabase
        .from('user_test_results')
        .select('*', { count: 'exact', head: true })
        .in('user_id', userIds)
        .gte('completed_at', thirtyDaysAgo);

      const total = totalStudents || 0;
      const active = activeCount || 0;
      const engagementRate = total > 0 ? Math.round((active / total) * 100) : 0;

      return {
        totalStudents: total,
        activeStudents: active,
        engagementRate
      };
    } catch (error) {
      console.error('Error in getEngagementMetrics:', error);
      return { totalStudents: 0, activeStudents: 0, engagementRate: 0 };
    }
  }
};
