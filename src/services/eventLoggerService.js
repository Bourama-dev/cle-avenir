import { supabase } from '@/lib/customSupabaseClient';
import { EVENT_TYPES } from '@/constants/eventTypes';

/**
 * Service to handle centralized event logging across the application.
 * Uses Supabase Edge Functions or direct table inserts securely.
 */
export class EventLogger {
  
  /**
   * Generic internal method to log events
   * Prioritizes direct RPC/Function if available, or direct insert for speed if allowed
   */
  static async logEvent(eventType, actorUserId = null, schoolId = null, metadata = {}) {
    // Validation: Ensure schoolId is valid if provided
    if (schoolId) {
       // Optional: We could verify existence here, but it adds latency. 
       // The DB FK constraint handles strict referential integrity.
       // We'll trust the caller provided a valid UUID format at least.
       const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
       if (!uuidRegex.test(schoolId)) {
         console.warn(`[EventLogger] Invalid schoolId format: ${schoolId}. Logging without schoolId.`);
         schoolId = null;
       }
    }

    try {
      // Use the database function 'log_event' if available for centralized handling
      const { data, error } = await supabase.rpc('log_event', {
        p_event_type: eventType,
        p_actor_user_id: actorUserId,
        p_school_id: schoolId,
        p_metadata: metadata
      });

      if (error) {
        console.warn('[EventLogger] RPC log_event failed, trying direct insert:', error.message);
        // Fallback to direct insert
        const { error: insertError } = await supabase.from('event_log').insert({
          event_type: eventType,
          actor_user_id: actorUserId,
          school_id: schoolId,
          metadata: metadata,
          created_at: new Date().toISOString()
        });
        
        if (insertError) throw insertError;
      }
      return data;
    } catch (err) {
      console.error(`[EventLogger] Failed to log ${eventType}:`, err);
      // Don't throw, we don't want to break the app flow for logging
      return null;
    }
  }

  /**
   * Log school-related administrative events
   * Note: schoolId is explicitly required here for school events
   */
  static async logSchoolEvent(eventType, schoolId, schoolName, seats = null, durationDays = null, licenseType = null, metadata = {}) {
    if (!schoolId) {
        console.error('[EventLogger] logSchoolEvent called without schoolId');
        return null;
    }

    const eventMetadata = {
      school_name: schoolName,
      seats,
      duration_days: durationDays,
      license_type: licenseType,
      ...metadata
    };

    return this.logEvent(eventType, null, schoolId, eventMetadata);
  }

  /**
   * Log a new user signup
   */
  static async logUserSignup(userId, email, plan = 'free', source = 'direct') {
    return this.logEvent(EVENT_TYPES.USER_SIGNUP, userId, null, {
      email_domain: email.split('@')[1],
      plan,
      source
    });
  }

  /**
   * Log a completed test
   */
  static async logTestCompleted(userId, testId, score, durationSeconds, completionRate = 100) {
    return this.logEvent(EVENT_TYPES.TEST_COMPLETED, userId, null, {
      test_id: testId,
      score,
      duration_seconds: durationSeconds,
      completion_rate: completionRate
    });
  }

  /**
   * Log a payment transaction
   */
  static async logPayment(userId, provider, amount, currency, plan, status, reason = null, transactionId = null) {
    const eventType = status === 'succeeded' ? EVENT_TYPES.PAYMENT_SUCCEEDED : EVENT_TYPES.PAYMENT_FAILED;
    return this.logEvent(eventType, userId, null, {
      provider,
      amount,
      currency,
      plan,
      reason,
      transaction_id: transactionId
    });
  }

  /**
   * Log a generic error
   */
  static async logError(component, errorMessage, stackTrace = null) {
    console.error(`[EventLogger] Error in ${component}:`, errorMessage);
    return this.logEvent(EVENT_TYPES.ERROR_OCCURRED, null, null, {
        component,
        error_message: errorMessage,
        stack_trace: stackTrace
    });
  }

  // --- Retrieval Methods ---

  /**
   * Get events for a specific establishment
   */
  static async getEstablishmentEvents(schoolId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('event_log')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[EventLogger] Error fetching establishment events:', error);
      return [];
    }
  }

  /**
   * Get all events (Admin only usually)
   */
  static async getAllEvents(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('event_log')
        .select(`
          *,
          educational_institutions (name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[EventLogger] Error fetching all events:', error);
      return [];
    }
  }

  /**
   * Get events by type
   */
  static async getEventsByType(eventType, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('event_log')
        .select('*')
        .eq('event_type', eventType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[EventLogger] Error fetching events by type:', error);
      return [];
    }
  }
}