import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// ── Create Stripe Customer Portal Session ──────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecret) {
      console.error('[create-portal-link] STRIPE_SECRET_KEY not configured');
      return json({ error: 'Configuration manquante: STRIPE_SECRET_KEY' }, 500);
    }
    if (!supabaseUrl || !supabaseKey) {
      console.error('[create-portal-link] Supabase credentials missing');
      return json({ error: 'Configuration manquante: Supabase' }, 500);
    }

    const { return_url } = await req.json();
    if (!return_url) {
      return json({ error: 'return_url manquante' }, 400);
    }

    // Get authenticated user from Authorization header
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return json({ error: 'Non authentifié' }, 401);
    }

    const sb = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const { data: { user }, error: userError } = await sb.auth.admin.getUserById(
      token.substring(0, 36) // Rough extraction - actual JWT parsing recommended
    ).catch(() => ({ data: { user: null }, error: 'Invalid token' }));

    // Better approach: verify token with Supabase
    const { data: { user: authUser }, error: authError } = await sb.auth.getUser(token);

    if (authError || !authUser?.email) {
      console.error('[create-portal-link] Auth error:', authError);
      return json({ error: 'Utilisateur non authentifié' }, 401);
    }

    // Get or find Stripe customer ID from subscriptions table
    const { data: subscription, error: subError } = await sb
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_email', authUser.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      console.error('[create-portal-link] Subscription lookup error:', subError);
      return json({ error: 'Erreur base de données' }, 500);
    }

    if (!subscription?.stripe_customer_id) {
      console.warn('[create-portal-link] No Stripe customer found for:', authUser.email);
      return json({ error: 'Pas d\'abonnement trouvé' }, 404);
    }

    // Create Stripe customer portal session
    const stripeResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: subscription.stripe_customer_id,
        return_url: return_url,
      }).toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('[create-portal-link] Stripe error:', stripeResponse.status, errorText);
      return json({ error: `Erreur Stripe: ${stripeResponse.status}` }, 500);
    }

    const portalSession = await stripeResponse.json();

    console.log('[create-portal-link] Portal session created:', portalSession.id);
    return json({ url: portalSession.url });

  } catch (error) {
    console.error('[create-portal-link] Unexpected error:', error);
    return json({ error: 'Erreur serveur interne' }, 500);
  }
});
