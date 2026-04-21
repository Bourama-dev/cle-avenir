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

// ── Create Stripe Checkout Session ──────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeSecret) {
      console.error('[create-checkout-session] STRIPE_SECRET_KEY not configured');
      return json({ error: 'Configuration manquante: STRIPE_SECRET_KEY' }, 500);
    }
    if (!supabaseUrl || !supabaseKey) {
      console.error('[create-checkout-session] Supabase credentials missing');
      return json({ error: 'Configuration manquante: Supabase' }, 500);
    }

    const body = await req.json();
    const { price_id, mode, return_url, user_id } = body;

    if (!price_id || !return_url || !user_id) {
      console.warn('[create-checkout-session] Missing required fields:', { price_id, return_url, user_id });
      return json({ error: 'Paramètres manquants: price_id, return_url, user_id' }, 400);
    }

    const sb = createClient(supabaseUrl, supabaseKey);

    // Get user profile to find or create Stripe customer
    const { data: profile, error: profileError } = await sb
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .eq('id', user_id)
      .single();

    if (profileError || !profile?.email) {
      console.error('[create-checkout-session] Profile not found:', user_id);
      return json({ error: 'Utilisateur non trouvé' }, 404);
    }

    let stripeCustomerId = profile.stripe_customer_id;

    // If no Stripe customer, create one
    if (!stripeCustomerId) {
      console.log(`[create-checkout-session] Creating Stripe customer for ${profile.email}`);

      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecret}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: profile.email,
          metadata: JSON.stringify({ user_id }),
        }).toString(),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('[create-checkout-session] Stripe customer creation error:', errorText);
        return json({ error: 'Erreur lors de la création du client Stripe' }, 500);
      }

      const customer = await customerResponse.json();
      stripeCustomerId = customer.id;

      // Save customer ID to profile
      const { error: updateError } = await sb
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user_id);

      if (updateError) {
        console.warn('[create-checkout-session] Failed to save Stripe customer ID:', updateError);
        // Don't fail here, continue with checkout
      }
    }

    // Create checkout session
    const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        customer: stripeCustomerId,
        mode: mode || 'subscription',
        payment_method_types: 'card',
        line_items_data_0_price: price_id,
        line_items_data_0_quantity: '1',
        success_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: return_url,
        customer_update: JSON.stringify({
          address: 'auto',
          name: 'auto',
        }),
      }).toString(),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error('[create-checkout-session] Stripe checkout error:', errorText);
      return json({ error: `Erreur Stripe: ${checkoutResponse.status}` }, 500);
    }

    const session = await checkoutResponse.json();

    console.log('[create-checkout-session] Checkout session created:', session.id);
    return json({ url: session.url, session_id: session.id });

  } catch (error) {
    console.error('[create-checkout-session] Unexpected error:', error);
    return json({ error: `Erreur serveur interne: ${error}` }, 500);
  }
});
