import { supabase } from '@/lib/customSupabaseClient';

// A rate limiter class using a basic sliding window simulation
class RateLimiter {
  constructor(limit = 100, windowMs = 15 * 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = [];
  }

  isAllowed() {
    const now = Date.now();
    // Remove expired requests
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (this.requests.length >= this.limit) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

const apiRateLimiter = new RateLimiter();

export const auditService = {
  async logActivity(userId, action, details = {}) {
    try {
      // In a real scenario, IP address would be collected on the backend (Edge Function)
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: action,
          details: details,
          user_agent: navigator.userAgent
        });

      if (error) console.error('[auditService] Failed to log activity:', error);
    } catch (e) {
      console.error('[auditService] Unexpected error:', e);
    }
  },

  async logSecurityEvent(event, details = {}) {
    try {
      console.warn(`[SECURITY EVENT] ${event}`, details);
      // Store in dedicated security table or audit_logs with high severity
      const { error } = await supabase
        .from('compliance_incidents')
        .insert({
          title: event,
          description: JSON.stringify(details),
          severity: 'HIGH',
          status: 'OPEN'
        });
        
      if (error) console.error('[auditService] Failed to log security event:', error);
    } catch (e) {
      console.error('[auditService] Unexpected error:', e);
    }
  },

  async logError(error, context = {}) {
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert({
          message: error.message || String(error),
          stack: error.stack || null,
          url: window.location.href,
          user_agent: navigator.userAgent,
          severity: 'ERROR',
          resolved: false,
          component_stack: JSON.stringify(context)
        });

      if (dbError) console.error('[auditService] Failed to log error:', dbError);
    } catch (e) {
      console.error('[auditService] Cannot log error to DB:', e);
    }
  },

  async healthCheck() {
    if (!apiRateLimiter.isAllowed()) {
      return { status: 'DEGRADED', reason: 'RATE_LIMIT_EXCEEDED' };
    }

    try {
      const start = performance.now();
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      const latency = performance.now() - start;

      if (error) throw error;
      
      return { 
        status: 'OK', 
        database: 'CONNECTED',
        latency: `${Math.round(latency)}ms` 
      };
    } catch (err) {
      this.logSecurityEvent('HEALTH_CHECK_FAILED', { error: err.message });
      return { 
        status: 'UNHEALTHY', 
        database: 'DISCONNECTED',
        error: err.message 
      };
    }
  },

  checkRateLimit() {
    if (!apiRateLimiter.isAllowed()) {
      this.logSecurityEvent('RATE_LIMIT_BLOCKED', { url: window.location.href });
      throw new Error("Trop de requêtes. Veuillez patienter 15 minutes.");
    }
    return true;
  }
};