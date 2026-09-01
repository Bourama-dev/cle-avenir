import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Creates a real Supabase Auth account for an establishment staff member and
// links it via establishment_users (role admin/teacher). Replaces the old
// create_establishment_staff RPC, which wrote to establishment_staff with an
// admin-generated password and never produced a session RLS could use.
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { establishment_id, email, role } = await req.json();
    if (!establishment_id || !email) {
      return new Response(JSON.stringify({ error: 'Missing establishment_id or email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Scoped to the caller's own JWT — used only to check who is calling.
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: isAdmin, error: adminCheckError } = await callerClient.rpc('is_admin');
    if (adminCheckError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Service-role client — the only one allowed to create auth users / bypass RLS.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const staffRole = role === 'teacher' ? 'teacher' : 'admin';
    const siteUrl = Deno.env.get('SITE_URL') || 'https://www.cleavenir.com';

    const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/establishment/set-password`,
      data: { role: 'establishment_staff' },
    });

    if (inviteError || !invited?.user) {
      console.error('[create-establishment-staff] invite error:', inviteError);
      return new Response(JSON.stringify({ error: inviteError?.message || 'Invite failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { error: linkError } = await adminClient
      .from('establishment_users')
      .insert({
        establishment_id,
        user_id: invited.user.id,
        role: staffRole,
        status: 'active',
      });

    if (linkError) {
      console.error('[create-establishment-staff] link error:', linkError);
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: invited.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[create-establishment-staff] Unexpected error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
