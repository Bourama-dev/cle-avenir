import { createClient } from '@supabase/supabase-js';
import { corsFor, json, getAuthedUser } from '../_shared/auth.ts';

const TAG = '[create-portal-link]';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://www.cleavenir.com';

/** Returns the URL (without hash) if its origin is allowed, else the site URL. */
function safeReturnUrl(raw: unknown): string {
  try {
    const u = new URL(String(raw));
    const probe = new Request('http://probe', { headers: { origin: u.origin } });
    if ((u.protocol === 'https:' || u.protocol === 'http:') &&
        corsFor(probe)['Access-Control-Allow-Origin'] === u.origin) {
      return u.origin + u.pathname + u.search;
    }
  } catch { /* fall through */ }
  return SITE_URL;
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  try {
    const user = await getAuthedUser(req);
    if (!user) return json({ error: 'Non authentifié' }, 401, cors);

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!stripeSecret || !supabaseUrl || !supabaseKey) {
      console.error(`${TAG} missing server configuration`);
      return json({ error: 'Erreur serveur interne' }, 500, cors);
    }

    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* use fallback return url */ }
    const returnUrl = safeReturnUrl(body.return_url);

    const sb = createClient(supabaseUrl, supabaseKey);
    const { data: subscription, error: subError } = await sb
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      console.error(`${TAG} subscription lookup failed:`, subError.message);
      return json({ error: 'Erreur serveur interne' }, 500, cors);
    }
    if (!subscription?.stripe_customer_id) {
      return json({ error: "Pas d'abonnement trouvé" }, 404, cors);
    }

    const stripeResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: subscription.stripe_customer_id,
        return_url: returnUrl,
      }).toString(),
    });
    if (!stripeResponse.ok) {
      console.error(`${TAG} Stripe portal failed:`, stripeResponse.status, await stripeResponse.text());
      return json({ error: 'Erreur de paiement' }, 502, cors);
    }

    const portalSession = await stripeResponse.json();
    return json({ url: portalSession.url }, 200, cors);
  } catch (error) {
    console.error(`${TAG} unexpected error:`, error);
    return json({ error: 'Erreur serveur interne' }, 500, cors);
  }
});
