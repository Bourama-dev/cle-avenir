import { supabase } from '@/lib/customSupabaseClient';
import { NotificationService } from '@/lib/notifications';

/**
 * Service to generate weekly reports
 */
export const WeeklyReportService = {
  
  generateWeeklyReport: async (adminId) => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // 1. Fetch events from last 7 days
      const { data: events, error } = await supabase
        .from('event_logs')
        .select('event_type, user_id, created_at')
        .gte('created_at', oneWeekAgo.toISOString());

      if (error) throw error;

      // 2. Process Data
      const totalEvents = events.length;
      const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
      
      const eventBreakdown = events.reduce((acc, curr) => {
        acc[curr.event_type] = (acc[curr.event_type] || 0) + 1;
        return acc;
      }, {});

      const reportData = {
        period_start: oneWeekAgo.toISOString(),
        period_end: new Date().toISOString(),
        totalEvents,
        uniqueUsers,
        eventBreakdown,
        events: events.slice(0, 50) // Store sample of events to save space
      };

      // 3. Save Report
      const { data: savedReport, error: saveError } = await supabase
        .from('weekly_reports')
        .insert([{
          admin_id: adminId,
          report_data: reportData
        }])
        .select()
        .single();

      if (saveError) throw saveError;

      // 4. Notify Admin
      await NotificationService.createNotification({
        user_id: adminId,
        type: 'weekly_report',
        title: 'Rapport Hebdomadaire Disponible 📊',
        message: `Total événements: ${totalEvents}, Utilisateurs actifs: ${uniqueUsers}.`,
        data: { report_id: savedReport.id }
      });

      return { success: true, report: savedReport };

    } catch (error) {
      console.error('Error generating weekly report:', error);
      return { success: false, error };
    }
  }
};