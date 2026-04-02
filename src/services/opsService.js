import { supabase } from '@/lib/customSupabaseClient';

export const OpsService = {
  // --- Health & Status ---
  async getSystemStatus() {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .order('service_name');
    return { data, error };
  },

  async runHealthCheck() {
    // Simulate checking services
    const updates = [
      { service_name: 'Database (Supabase)', status: 'operational', latency_ms: Math.floor(Math.random() * 50) + 20 },
      { service_name: 'Authentication', status: 'operational', latency_ms: Math.floor(Math.random() * 40) + 10 },
      { service_name: 'API Gateway', status: 'operational', latency_ms: Math.floor(Math.random() * 30) + 10 },
      { service_name: 'Storage (S3)', status: 'operational', latency_ms: Math.floor(Math.random() * 100) + 50 },
      { service_name: 'Paiements (Stripe)', status: Math.random() > 0.9 ? 'degraded' : 'operational', latency_ms: Math.floor(Math.random() * 100) + 50 },
    ];

    for (const update of updates) {
      await supabase
        .from('system_status')
        .update({ ...update, last_checked: new Date() })
        .eq('service_name', update.service_name);
    }
    return updates;
  },

  // --- Feedback & Features ---
  async submitFeedback(feedback) {
    return await supabase.from('feedback').insert(feedback);
  },

  async getFeedback(type = null) {
    let query = supabase.from('feedback').select('*, profiles(email, first_name)').order('created_at', { ascending: false });
    if (type) query = query.eq('type', type);
    return await query;
  },

  // --- Release Notes ---
  async getReleaseNotes(publishedOnly = true) {
    let query = supabase.from('release_notes').select('*').order('release_date', { ascending: false });
    if (publishedOnly) query = query.eq('is_published', true);
    return await query;
  },
  
  // --- Analytics (Mocked for privacy-compliant dashboard) ---
  async getUserAnalytics() {
    // In a real scenario, this would aggregate from a privacy-friendly source or anonymized DB queries
    return {
      activeUsers: 1250,
      newSignups: 45,
      retentionRate: 68,
      avgSession: '14m',
      topPages: ['/test', '/dashboard', '/metiers']
    };
  }
};