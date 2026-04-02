import { supabase } from '@/lib/customSupabaseClient';

export const MonitoringService = {
  isInitialized: false,

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    
    // Global error handler for uncaught exceptions
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError(event.error || new Error(event.message), {
          type: 'uncaught_exception',
          filename: event.filename,
          lineno: event.lineno
        });
      });

      // Global handler for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.logError(event.reason || new Error('Unhandled Rejection'), {
          type: 'unhandled_rejection'
        });
      });
    }
  },

  async logError(error, context = {}) {
    if (!error) return;

    const errorLog = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      component_stack: context.componentStack,
      url: window.location.href,
      user_agent: navigator.userAgent,
      severity: context.severity || 'error',
      resolved: false,
      user_id: context.userId || null 
    };

    // Log to console in dev
    if (import.meta.env.DEV) {
      console.error('[MonitoringService]', errorLog);
    }

    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([errorLog]);

      if (dbError && import.meta.env.DEV) {
        console.warn('Failed to log error to Supabase:', dbError);
      }
    } catch (e) {
      console.warn('Failed to log error (exception):', e);
    }
  },

  async logEvent(eventType, metadata = {}) {
    try {
      // Use RPC if available, otherwise fallback to direct insert if table exists
      const { error } = await supabase.rpc('log_event', {
        p_event_type: eventType,
        p_metadata: metadata,
        p_actor_user_id: metadata.userId || null, 
        p_school_id: metadata.schoolId || null
      });

      if (error) {
        if (import.meta.env.DEV) console.warn('RPC log_event failed, trying direct insert', error);
        
        await supabase
          .from('user_events') 
          .insert([{
            event_type: eventType,
            event_data: metadata,
            url: window.location.href,
            created_at: new Date().toISOString()
          }]);
      }
    } catch (e) {
      console.warn('Error logging event:', e);
    }
  },

  async logPerformanceMetric(name, value, rating) {
    try {
      const { error } = await supabase
        .from('performance_metrics')
        .insert([{
          metric_name: name,
          value,
          rating,
          url: window.location.href,
          user_agent: navigator.userAgent
        }]);

      if (error && import.meta.env.DEV) {
        console.warn('Failed to log performance metric:', error);
      }
    } catch (e) {
      console.warn('Exception logging performance metric:', e);
    }
  }
};