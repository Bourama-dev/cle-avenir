// Usage limits shared by Cléo chat and the interview simulator.
//
// While CléAvenir is fully free, everyone gets the same anti-abuse limits.
// Per-plan limits are only enforced when the AI_TIER_LIMITS secret is "on"
// (i.e. once paid plans actually unlock access).

export const DAY_MS = 24 * 60 * 60 * 1000;

export type Tier = 'free' | 'premium' | 'premium_plus';

export interface LimitRule {
  limit: number;
  windowMs: number | null; // null = lifetime total
  period: 'day' | 'month' | 'total';
}

export const tierLimitsEnabled = () => Deno.env.get('AI_TIER_LIMITS') === 'on';

// deno-lint-ignore no-explicit-any
export async function getTier(sb: any, userId: string): Promise<Tier> {
  const { data } = await sb.from('profiles').select('subscription_tier').eq('id', userId).maybeSingle();
  const raw = String(data?.subscription_tier || 'free').toLowerCase();
  return raw === 'premium' || raw === 'premium_plus' ? raw : 'free'; // 'decouverte' and unknown = free
}

// ── Cléo chat ────────────────────────────────────────────────────────────────

const CHAT_ANTI_ABUSE: LimitRule = { limit: 60, windowMs: DAY_MS, period: 'day' };
const CHAT_ANONYMOUS: LimitRule = { limit: 20, windowMs: DAY_MS, period: 'day' };
const CHAT_TIER_LIMITS: Record<Tier, LimitRule> = {
  free: { limit: 10, windowMs: DAY_MS, period: 'day' },
  premium: { limit: 30, windowMs: DAY_MS, period: 'day' },
  premium_plus: { limit: 200, windowMs: DAY_MS, period: 'day' }, // "illimité" + anti-abuse
};

export const CHAT_LIMIT_REPLY =
  "Tu as atteint la limite de messages avec Cléo pour aujourd'hui. Reviens demain, je serai là ! " +
  'En attendant, tu peux explorer les fiches métiers et les formations du site.';

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Key identifying an anonymous visitor: salted hash of their IP, so no raw
 * IP address is ever stored.
 */
export async function anonymousKey(req: Request): Promise<string | null> {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
    || req.headers.get('x-real-ip') || '';
  if (!ip) return null;
  const salt = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  return `ip:${(await sha256(`${salt}|${ip}`)).slice(0, 32)}`;
}

/**
 * Records one Cléo message and says whether it is allowed. Fails open (logs
 * and allows) if the usage table is unreachable, so Cléo never goes down
 * because of the limiter.
 */
// deno-lint-ignore no-explicit-any
export async function consumeChatMessage(sb: any, userId: string | null, anonKey: string | null): Promise<boolean> {
  if (!sb || (!userId && !anonKey)) return true;
  try {
    let rule = userId ? CHAT_ANTI_ABUSE : CHAT_ANONYMOUS;
    if (userId && tierLimitsEnabled()) rule = CHAT_TIER_LIMITS[await getTier(sb, userId)];

    let query = sb.from('ai_usage_events').select('id', { count: 'exact', head: true }).eq('kind', 'chat');
    query = userId ? query.eq('user_id', userId) : query.eq('client_key', anonKey);
    if (rule.windowMs) query = query.gte('created_at', new Date(Date.now() - rule.windowMs).toISOString());
    const { count, error } = await query;
    if (error) throw error;
    if ((count ?? 0) >= rule.limit) return false;

    const { error: insertError } = await sb.from('ai_usage_events')
      .insert({ kind: 'chat', user_id: userId, client_key: userId ? null : anonKey });
    if (insertError) throw insertError;
    return true;
  } catch (err) {
    console.warn('[chat-advisor] chat limiter unavailable, allowing message:', err);
    return true;
  }
}

// ── Interview simulator ──────────────────────────────────────────────────────

const INTERVIEW_ANTI_ABUSE: LimitRule = { limit: 10, windowMs: DAY_MS, period: 'day' };
const INTERVIEW_TIER_LIMITS: Record<Tier, LimitRule> = {
  free: { limit: 1, windowMs: null, period: 'total' }, // one trial
  premium: { limit: 5, windowMs: null, period: 'total' }, // one-off purchase → pack of 5
  premium_plus: INTERVIEW_ANTI_ABUSE, // "illimité" + anti-abuse
};

// deno-lint-ignore no-explicit-any
export async function interviewRule(sb: any, userId: string): Promise<LimitRule & { tier: string }> {
  if (!tierLimitsEnabled()) return { tier: 'all', ...INTERVIEW_ANTI_ABUSE };
  const tier = await getTier(sb, userId);
  return { tier, ...INTERVIEW_TIER_LIMITS[tier] };
}
