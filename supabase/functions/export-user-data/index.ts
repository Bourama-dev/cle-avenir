import { createClient } from '@supabase/supabase-js';
import { corsFor, json, getAuthedUser } from '../_shared/auth.ts';

const MAX_ROWS = 5000;

// [table, column holding the user id]. Technical logs and quota counters are not personal
// content and are left out; messages received from other people are not exported.
const USER_TABLES: Array<[string, string]> = [
  ['action_plans', 'user_id'], ['blog_comments', 'user_id'], ['bug_reports', 'user_id'],
  ['chat_sessions', 'user_id'], ['cleo_action_plans', 'user_id'], ['cleo_conversations', 'user_id'],
  ['cleo_memories', 'user_id'], ['cleo_user_analysis', 'user_id'], ['consent_logs', 'user_id'],
  ['conversation_history', 'user_id'], ['data_download_logs', 'user_id'], ['direct_messages', 'sender_id'],
  ['feedback', 'user_id'], ['game_sessions', 'user_id'], ['goals', 'user_id'],
  ['interview_sessions', 'user_id'], ['job_applications', 'candidate_id'], ['learning_paths', 'user_id'],
  ['match_results', 'user_id'], ['monthly_reports', 'user_id'], ['notification_preferences', 'user_id'],
  ['notifications', 'user_id'], ['organizations', 'user_id'], ['parental_consent_requests', 'user_id'],
  ['payment_history', 'user_id'], ['personalized_plans', 'user_id'], ['plans_personnalises', 'user_id'],
  ['profile_versions', 'user_id'], ['saved_formations', 'user_id'], ['saved_jobs', 'user_id'],
  ['saved_metiers', 'user_id'], ['support_requests', 'user_id'], ['test_metier_feedback', 'user_id'],
  ['test_results', 'user_id'], ['user_activities', 'user_id'], ['user_answers', 'user_id'],
  ['user_career_goals', 'user_id'], ['user_cookie_preferences', 'user_id'], ['user_cover_letters', 'user_id'],
  ['user_cvs', 'user_id'], ['user_diploma_goals', 'user_id'], ['user_diplomas', 'user_id'],
  ['user_events', 'user_id'], ['user_formations', 'user_id'], ['user_games', 'user_id'],
  ['user_gamification', 'user_id'], ['user_interests', 'user_id'], ['user_preferences', 'user_id'],
  ['user_profiles', 'user_id'], ['user_progression', 'user_id'], ['user_skills', 'user_id'],
  ['user_skills_progress', 'user_id'], ['user_subscriptions', 'user_id'], ['user_test_progress', 'user_id'],
  ['user_test_results', 'user_id'],
];

// Secrets that must never leave the database, even in the owner's own export.
const OMIT_FIELDS: Record<string, string[]> = { parental_consent_requests: ['token'] };

Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST' && req.method !== 'GET') return json({ error: 'Method not allowed' }, 405, cors);

  try {
    // Identity comes from the verified JWT only: a user id in the request is ignored.
    const user = await getAuthedUser(req);
    if (!user) return json({ error: 'Non authentifié' }, 401, cors);

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const unavailable: string[] = [];
    const data: Record<string, unknown[]> = {};

    const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).maybeSingle();

    await Promise.all(USER_TABLES.map(async ([table, column]) => {
      const { data: rows, error } = await admin.from(table).select('*').eq(column, user.id).limit(MAX_ROWS);
      if (error) { unavailable.push(table); return; }
      const omit = OMIT_FIELDS[table];
      data[table] = omit
        ? (rows ?? []).map((r: Record<string, unknown>) => Object.fromEntries(Object.entries(r).filter(([k]) => !omit.includes(k))))
        : (rows ?? []);
    }));

    const sessionIds = (data.chat_sessions as { id: string }[] | undefined)?.map((s) => s.id) ?? [];
    if (sessionIds.length > 0) {
      const { data: msgs, error } = await admin.from('chat_messages').select('*').in('session_id', sessionIds).limit(MAX_ROWS);
      if (error) unavailable.push('chat_messages'); else data.chat_messages = msgs ?? [];
    }

    for (const key of Object.keys(data)) if (data[key].length === 0) delete data[key];

    const exportData = {
      format_version: 1,
      generated_at: new Date().toISOString(),
      legal_basis: 'Export réalisé au titre du droit à la portabilité (art. 20 RGPD) et du droit d\'accès (art. 15 RGPD).',
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        providers: user.app_metadata?.providers ?? (user.app_metadata?.provider ? [user.app_metadata.provider] : []),
      },
      profile: profile ?? null,
      data,
      tables_unavailable: unavailable.sort(),
      notes: [
        'Les messages que d\'autres personnes vous ont envoyés ne sont pas inclus (données de tiers).',
        `Chaque table est limitée à ${MAX_ROWS} lignes.`,
      ],
    };

    const body = JSON.stringify(exportData);
    // Best-effort audit trail; failure to log must not block the user's export.
    await Promise.allSettled([
      admin.from('data_download_logs').insert({ user_id: user.id, data_size: body.length }),
      admin.from('rgpd_audit_logs').insert({ action: 'DATA_EXPORT', user_id: user.id, details: { type: 'full_export', size: body.length, tables: Object.keys(data).length } }),
    ]);

    return new Response(body, { headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[export-user-data] error:', err);
    return json({ error: 'Export impossible pour le moment' }, 500, cors);
  }
});
