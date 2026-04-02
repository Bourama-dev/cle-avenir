import { supabase } from '@/lib/customSupabaseClient';
import { EventLogger } from '@/services/eventLoggerService';
import { EVENT_TYPES } from '@/constants/eventTypes';

export const ESTABLISHMENT_COLUMNS = 'id, name, type, address, website, email, phone, code, status, email_count, student_count, created_at, updated_at, last_access, uai, city, postal_code, region, sector, description, logo_url, contact_email, activation_password';

const EstablishmentService = {
  async getEstablishments({ page = 1, limit = 10, filters = {}, sort = { column: 'created_at', direction: 'desc' } } = {}) {
    try {
      let query = supabase.from('educational_institutions').select(ESTABLISHMENT_COLUMNS, { count: 'exact' });

      if (filters.search) query = query.ilike('name', `%${filters.search}%`);
      if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'active') query = query.eq('status', 'active');
        else query = query.neq('status', 'active');
      }

      query = query.order(sort.column, { ascending: sort.direction === 'asc' });
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      return { data: data || [], count };
    } catch (error) {
      console.error('Error in getEstablishments:', error);
      return { data: [], count: 0, error };
    }
  },

  async getStats() {
    try {
      const { count: total } = await supabase.from('educational_institutions').select('id', { count: 'exact', head: true });
      const { count: active } = await supabase.from('educational_institutions').select('id', { count: 'exact', head: true }).eq('status', 'active');
      const inactive = (total || 0) - (active || 0);
      return { total: total || 0, active: active || 0, inactive };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, active: 0, inactive: 0 };
    }
  },

  async getEstablishmentById(id) {
    try {
      const { data, error } = await supabase.from('educational_institutions').select(ESTABLISHMENT_COLUMNS).eq('id', id).maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const [emails, students, programs, logs] = await Promise.all([
        supabase.from('institution_emails').select('email').eq('institution_id', id),
        supabase.from('institution_members').select('count', { count: 'exact', head: true }).eq('institution_id', id).eq('role', 'student'),
        supabase.from('institution_programs').select('count', { count: 'exact', head: true }).eq('institution_id', id),
        supabase.from('establishment_activity_logs').select('*').eq('establishment_id', id).order('created_at', { ascending: false }).limit(10)
      ]);

      return {
        ...data,
        emails: emails.data?.map(e => e.email) || [],
        stats: { studentCount: students.count || 0, formationCount: programs.count || 0, loginCount: 0, activationRate: 0 },
        logs: logs.data || []
      };
    } catch (error) {
      console.error(`Error fetching establishment ${id}:`, error);
      throw error;
    }
  },

  async createEstablishment(establishmentData) {
    try {
      const { emails, ...mainData } = establishmentData;
      const { data, error } = await supabase.from('educational_institutions').insert([mainData]).select(ESTABLISHMENT_COLUMNS).single();
      if (error) throw error;

      if (emails && emails.length > 0) {
        const emailInserts = emails.map(email => ({ institution_id: data.id, email: email }));
        await supabase.from('institution_emails').insert(emailInserts);
      }

      await EventLogger.logSchoolEvent(EVENT_TYPES.SCHOOL_CREATED, data.id, data.name);
      return data;
    } catch (error) {
      console.error('Error creating establishment:', error);
      throw error;
    }
  },

  async updateEstablishment(id, updates) {
    try {
      const { emails, ...mainData } = updates;
      const allowedFields = ['name', 'type', 'address', 'website', 'email', 'phone', 'code', 'status', 'email_count', 'uai', 'city', 'postal_code', 'region', 'description', 'contact_email', 'code_updated_at', 'paused_at'];
      const cleanUpdates = {};
      Object.keys(mainData).forEach(key => { if (allowedFields.includes(key)) cleanUpdates[key] = mainData[key]; });

      const { data, error } = await supabase.from('educational_institutions').update(cleanUpdates).eq('id', id).select(ESTABLISHMENT_COLUMNS).maybeSingle();
      if (error) throw error;

      if (emails) {
         await supabase.from('institution_emails').delete().eq('institution_id', id);
         if (emails.length > 0) {
            const emailInserts = emails.map(email => ({ institution_id: id, email: email }));
            await supabase.from('institution_emails').insert(emailInserts);
         }
      }
      return data;
    } catch (error) {
      console.error('Error updating establishment:', error);
      throw error;
    }
  },

  async deleteEstablishment(id) {
    try {
      const { data: est } = await supabase.from('educational_institutions').select('name').eq('id', id).maybeSingle();
      const { error } = await supabase.from('educational_institutions').delete().eq('id', id);
      if (error) throw error;
      await EventLogger.logSchoolEvent('school_deleted', id, est?.name || 'Unknown School');
      return true;
    } catch (error) {
      console.error('Error deleting establishment:', error);
      throw error;
    }
  },

  async getDashboardStats(id) {
    try {
      const { data, error } = await supabase.from('educational_institutions').select('student_count, email_count').eq('id', id).single();
      if (error) throw error;
      const { count: programCount } = await supabase.from('institution_programs').select('*', { count: 'exact', head: true }).eq('institution_id', id);
      return { totalUsers: data.student_count || 0, activeTests: programCount || 0, completionRate: 0, departmentCount: 0 };
    } catch (e) {
      console.error('Stats error', e);
      return { totalUsers: 0 };
    }
  },

  async getActivityLogs(id, limit = 5) {
     const { data, error } = await supabase.from('establishment_activity_logs').select('*').eq('establishment_id', id).order('created_at', { ascending: false }).limit(limit);
     if (error) return [];
     return data;
  },

  // Mock methods for new dashboard tabs
  async getEstablishmentStudents(id) {
    return [
      { id: 1, name: 'Jean Dupont', email: 'jean@example.com', class: 'Terminal S', level: 'Terminale', status: 'Actif', enrollment_date: '2023-09-01', tests_completed: 2, dominant_profile: 'Analytique' },
      { id: 2, name: 'Marie Martin', email: 'marie@example.com', class: 'Terminal ES', level: 'Terminale', status: 'Actif', enrollment_date: '2023-09-01', tests_completed: 1, dominant_profile: 'Créatif' }
    ];
  },

  async getEstablishmentClasses(id) {
    return [
      { id: 1, name: 'Terminal S', level: 'Terminale', student_count: 35, teacher: 'M. Dubois', status: 'Active' },
      { id: 2, name: 'Terminal ES', level: 'Terminale', student_count: 32, teacher: 'Mme. Leroy', status: 'Active' }
    ];
  },

  async getEstablishmentTeachers(id) {
    return [
      { id: 1, name: 'M. Dubois', email: 'dubois@school.com', subjects: 'Mathématiques', classes: 4, status: 'Actif' },
      { id: 2, name: 'Mme. Leroy', email: 'leroy@school.com', subjects: 'Histoire', classes: 3, status: 'Actif' }
    ];
  },

  async getEstablishmentTestResults(id) {
    return {
      byProfile: [{ name: 'Analytique', value: 45 }, { name: 'Créatif', value: 30 }, { name: 'Social', value: 25 }],
      byClass: [{ name: 'Term S', value: 90 }, { name: 'Term ES', value: 85 }],
      byLevel: [{ name: 'Seconde', value: 50 }, { name: 'Première', value: 70 }, { name: 'Terminale', value: 90 }]
    };
  },

  async getEstablishmentRecommendations(id) {
    return {
      topCareers: [{ name: 'Développeur Web', value: 15 }, { name: 'Infirmier', value: 12 }, { name: 'Designer', value: 10 }],
      byProfile: [{ name: 'Analytique', value: 40 }, { name: 'Créatif', value: 35 }],
      byClass: [{ name: 'Term S', value: 50 }, { name: 'Term ES', value: 45 }]
    };
  },

  async getEstablishmentStatistics(id) {
    return {
      totalStudents: 1500,
      activeStudents: 1420,
      classes: 45,
      teachers: 80,
      completedTests: 1200,
      recommendations: 3600,
      completionRate: 85,
      satisfactionRate: 92
    };
  }
};

export { EstablishmentService, EstablishmentService as establishmentService };