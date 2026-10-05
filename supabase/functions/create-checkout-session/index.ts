import { createClient } from '@supabase/supabase-js';
import { corsFor, json, getAuthedUser } from '../_shared/auth.ts';

const TAG = '[create-checkout-session]';
const SITE_URL = Deno.env.get('SITE_URL') || 'https://www.cleavenir.com';
const VALID_MODES = ['payment', 'subscription'] as const;
type Mode = typeof VALID_MODES[number];

// Allowed prices: STRIPE_PRICE_IDS = "price_a:payment,price_b:subscription" (":mode" optional).
// Falls back to the price ids currently shipped in src/constants/subscriptionTiers.js.
const DEFAULT_PRICES = 'price_1SdCxGLKwUP9TofOQHRacfQa:payment,price_1SdD0DLKwUP9TofOTw3qPFXl:subscription';

function allowedPrices(): Map<string, Mode | null> {
  const map = new Map<string, Mode | null>();
  for (const entry of (Deno.env.get('STRIPE_PRICE_IDS') || DEFAULT_PRICES).split(',')) {
    const [id, m] = entry.trim().split(':');
    if (!id) continue;
    map.set(id, (VALID_MODES as readonly string[]).includes(m) ? (m as Mode) : null);
  }
  return map;
}

/** Returns a safe base URL (origin + path, no query/hash) if its origin is allowed, else the site URL. */
function safeReturnUrl(raw: unknown): string {
  try {
    const u = new URL(String(raw));
    const probe = new Request('http://probe', { headers: { origin: u.origin } });
    if ((u.protocol === 'https:' || u.protocol === 'http:') &&
        corsFor(probe)['Access-Control-Allow-Origin'] === u.origin) {
      return u.origin + u.pathname;
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
    if (!user || !user.email) return json({ error: 'Non authentifié' }, 401, cors);

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!stripeSecret || !supabaseUrl || !supabaseKey) {
      console.error(`${TAG} missing server configuration`);
      return json({ error: 'Erreur serveur interne' }, 500, cors);
    }

    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* handled below */ }
    const priceId = typeof body.price_id === 'string' ? body.price_id : '';

    const prices = allowedPrices();
    if (!priceId || !prices.has(priceId)) {
      return json({ error: 'Paramètres invalides' }, 400, cors);
    }
    const mode = prices.get(priceId) ?? (body.mode ?? 'subscription');
    if (!(VALID_MODES as readonly unknown[]).includes(mode)) {
      return json({ error: 'Paramètres invalides' }, 400, cors);
    }

    const base = safeReturnUrl(body.return_url);
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data: profile, error: profileError } = await sb
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) {
      console.error(`${TAG} profile lookup failed:`, profileError.message);
      return json({ error: 'Erreur serveur interne' }, 500, cors);
    }

    let stripeCustomerId: string | null = profile?.stripe_customer_id ?? null;

    if (!stripeCustomerId) {
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecret}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email,
          'metadata[user_id]': user.id,
        }).toString(),
      });
      if (!customerResponse.ok) {
        console.error(`${TAG} Stripe customer creation failed:`, customerResponse.status, await customerResponse.text());
        return json({ error: 'Erreur de paiement' }, 502, cors);
      }
      stripeCustomerId = (await customerResponse.json()).id as string;

      const { error: updateError } = await sb
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);
      if (updateError) console.error(`${TAG} failed to save Stripe customer id:`, updateError.message);
    }

    const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: stripeCustomerId,
        mode: mode as string,
        'payment_method_types[0]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        success_url: `${base}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: base,
        'customer_update[address]': 'auto',
        'customer_update[name]': 'auto',
      }).toString(),
    });
    if (!checkoutResponse.ok) {
      console.error(`${TAG} Stripe checkout failed:`, checkoutResponse.status, await checkoutResponse.text());
      return json({ error: 'Erreur de paiement' }, 502, cors);
    }

    const session = await checkoutResponse.json();
    return json({ url: session.url, session_id: session.id }, 200, cors);
  } catch (error) {
    console.error(`${TAG} unexpected error:`, error);
    return json({ error: 'Erreur serveur interne' }, 500, cors);
  }
});
