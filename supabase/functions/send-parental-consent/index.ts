import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token, parentEmail, childFirstName } = await req.json();

    if (!token || !parentEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://www.cleavenir.com';
    const consentUrl = `${siteUrl}/parental-consent/${token}`;
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (!resendKey) {
      console.warn('[send-parental-consent] RESEND_API_KEY not configured — email skipped');
      return new Response(JSON.stringify({ sent: false, reason: 'no_api_key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const childName = childFirstName || 'votre enfant';

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:#4f46e5;padding:32px;text-align:center;">
      <div style="font-size:32px;margin-bottom:12px;">🔐</div>
      <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">Autorisation parentale requise</h1>
      <p style="color:#c7d2fe;margin:8px 0 0;font-size:14px;">CléAvenir — Orientation professionnelle</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#374151;line-height:1.6;margin-top:0;">Bonjour,</p>

      <p style="color:#374151;line-height:1.6;">
        <strong>${childName}</strong> souhaite créer un compte sur <strong>CléAvenir</strong>,
        une plateforme d'orientation professionnelle gratuite. Conformément au <strong>RGPD (Article 8)</strong>
        et à la loi française, votre autorisation est requise car ${childName} a moins de 15 ans.
      </p>

      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #e2e8f0;">
        <p style="margin:0 0 12px;font-weight:700;color:#1e293b;font-size:15px;">Données qui seront traitées :</p>
        <ul style="color:#64748b;margin:0;padding-left:20px;line-height:2;">
          <li>Prénom, nom, date de naissance</li>
          <li>Région et ville de résidence</li>
          <li>Niveau d'études et centres d'intérêt</li>
          <li>Résultats du test d'orientation</li>
        </ul>
        <p style="margin:12px 0 0;color:#94a3b8;font-size:13px;">
          Ces données ne sont jamais vendues à des tiers et sont hébergées en Europe (Supabase, Frankfurt).
        </p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${consentUrl}"
           style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;
                  padding:16px 40px;border-radius:10px;font-weight:700;font-size:16px;
                  box-shadow:0 4px 12px rgba(79,70,229,0.3);">
          Donner mon autorisation →
        </a>
      </div>

      <div style="background:#fef3c7;border-radius:8px;padding:16px;margin-bottom:24px;border-left:4px solid #f59e0b;">
        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
          ⏱️ Ce lien est valable <strong>7 jours</strong>.<br>
          Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
        </p>
      </div>

      <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:0;">
        Des questions ? Contactez notre DPO :
        <a href="mailto:dpo@cleavenir.com" style="color:#4f46e5;">dpo@cleavenir.com</a><br>
        <a href="${siteUrl}/privacy" style="color:#4f46e5;">Politique de confidentialité</a> —
        <a href="${siteUrl}/terms" style="color:#4f46e5;">Conditions d'utilisation</a>
      </p>
    </div>

    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        CléAvenir — Orientation professionnelle | <a href="${siteUrl}" style="color:#4f46e5;">www.cleavenir.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CléAvenir <noreply@cleavenir.com>',
        to: [parentEmail],
        subject: `Autorisation parentale requise pour ${childName} — CléAvenir`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[send-parental-consent] Resend error:', body);
      return new Response(JSON.stringify({ sent: false, reason: 'resend_error' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[send-parental-consent] Unexpected error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
