import { supabase } from '@/lib/customSupabaseClient';

/**
 * Service to fetch REAL establishment/institution data
 * Replaces mock student, class, and teacher data in establishmentService
 */
export const realEstablishmentDataService = {
  /**
   * Get actual students linked to an establishment
   */
  async getEstablishmentStudents(institutionId, limit = 50, offset = 0) {
    try {
      // Get user links to institution
      const { data: userLinks, error: linkError, count } = await supabase
        .from('user_institution_links')
        .select('user_id', { count: 'exact' })
        .eq('institution_id', institutionId)
        .range(offset, offset + limit - 1);

      if (linkError) throw linkError;

      const userIds = userLinks?.map(l => l.user_id) || [];

      if (userIds.length === 0) {
        return { students: [], total: count || 0 };
      }

      // Get student profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url, education_level')
        .in('id', userIds);

      if (profileError) throw profileError;

      // Get test results for each student
      const { data: testResults, error: testError } = await supabase
        .from('user_test_results')
        .select('user_id, dominant_profile, completed_at, total_score')
        .in('user_id', userIds)
        .order('completed_at', { ascending: false });

      if (testError) throw testError;

      // Merge data
      const students = profiles?.map(profile => {
        const userTests = testResults?.filter(t => t.user_id === profile.id) || [];
        const latestTest = userTests[0];

        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Étudiant',
          email: profile.email || 'N/A',
          avatar_url: profile.avatar_url,
          tests_completed: userTests.length,
          dominant_profile: latestTest?.dominant_profile || 'Non évalué',
          last_test_date: latestTest?.completed_at || null,
          last_score: latestTest?.total_score || null,
          status: userTests.length > 0 ? 'Actif' : 'Inscrit'
        };
      }) || [];

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

      return data?.map(staff => ({
        id: staff.id,
        name: `${staff.first_name} ${staff.last_name}`,
        email: staff.email,
        role: staff.role,
        status: 'Actif'
      })) || [];
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
        .select(`
          id,
          name,
          level,
          formation_id,
          created_at,
          formations(name)
        `)
        .eq('institution_id', institutionId)
        .limit(limit);

      if (error) throw error;

      return data?.map(prog => ({
        id: prog.id,
        name: prog.name,
        level: prog.level,
        formation_name: prog.formations?.name || 'Formation',
        status: 'Active'
      })) || [];
    } catch (error) {
      console.error('Error fetching institution programs:', error);
      return [];
    }
  },

  /**
   * Get establishment statistics from actual data
   */
  async getEstablishmentStatistics(institutionId) {
    try {
      // Get total students
      const { count: totalStudents } = await supabase
        .from('user_institution_links')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      // Get students with tests
      const { data: userLinks } = await supabase
        .from('user_institution_links')
        .select('user_id')
        .eq('institution_id', institutionId);

      const userIds = userLinks?.map(l => l.user_id) || [];

      const { count: completedTests } = await supabase
        .from('user_test_results')
        .select('*', { count: 'exact', head: true })
        .in('user_id', userIds);

      // Get number of programs
      const { count: programCount } = await supabase
        .from('institution_programs')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      // Get number of staff
      const { count: staffCount } = await supabase
        .from('institution_staff')
        .select('*', { count: 'exact', head: true })
        .eq('institution_id', institutionId);

      const total = totalStudents || 0;
      const completed = completedTests || 0;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        totalStudents: total,
        activeStudents: completed,
        completedTests: completed,
        completionRate,
        programCount: programCount || 0,
        staffCount: staffCount || 0
      };
    } catch (error) {
      console.error('Error fetching establishment statistics:', error);
      return {
        totalStudents: 0,
        activeStudents: 0,
        completedTests: 0,
        completionRate: 0,
        programCount: 0,
        staffCount: 0
      };
    }
  },

  /**
   * Get student test recommendations/results
   */
  async getStudentRecommendations(institutionId, limit = 10) {
    try {
      const { data: userLinks } = await supabase
        .from('user_institution_links')
        .select('user_id')
        .eq('institution_id', institutionId);

      const userIds = userLinks?.map(l => l.user_id) || [];

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
  }
};
