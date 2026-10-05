import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsFor, json, getAuthedUser, secretMatches } from "../_shared/auth.ts";

// Escape Slack mrkdwn control characters in user-supplied text
const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

Deno.serve(async (req: Request) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_NOUVELLE_UTILISATEUR");
  if (!webhookUrl) {
    console.error("[notify-slack] SLACK_WEBHOOK_NOUVELLE_UTILISATEUR not set");
    return json({ error: "Service not configured" }, 500, cors);
  }

  let body: { user_id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, cors);
  }

  const { user_id } = body ?? {};
  if (!user_id || typeof user_id !== "string") return json({ error: "Missing user_id" }, 400, cors);

  // Auth: trusted secret (cron/webhook) OR the user's own JWT for their own id
  const secretOk = secretMatches(req.headers.get("x-cron-secret"), Deno.env.get("CRON_SECRET"));
  if (!secretOk) {
    const user = await getAuthedUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401, cors);
    if (user.id !== user_id) return json({ error: "Forbidden" }, 403, cors);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, email, age_range, user_status, education_level, city, region, subscription_tier, completed_at"
    )
    .eq("id", user_id)
    .single();

  if (error || !profile) {
    console.error("[notify-slack] Profile fetch error:", error);
    return json({ error: "Not found" }, 404, cors);
  }

  const location =
    [profile.city, profile.region].filter(Boolean).join(", ") || "—";

  const date = new Date(profile.completed_at ?? new Date()).toLocaleString(
    "fr-FR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    }
  );

  const text =
    `*Nouvel utilisateur inscrit sur CléAvenir* :tada:\n\n` +
    `:bust_in_silhouette: *Nom :* ${esc(profile.first_name || "—")} ${esc(profile.last_name || "—")}\n` +
    `:email: *Email :* ${esc(profile.email || "—")}\n` +
    `:birthday: *Âge :* ${esc(profile.age_range || "—")}\n` +
    `:briefcase: *Statut :* ${esc(profile.user_status || "—")}\n` +
    `:mortar_board: *Niveau d'études :* ${esc(profile.education_level || "—")}\n` +
    `:round_pushpin: *Localisation :* ${esc(location)}\n` +
    `:star: *Abonnement :* ${esc(profile.subscription_tier || "free")}\n` +
    `:calendar: *Inscrit le :* ${date}`;

  const slackRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!slackRes.ok) {
    const errText = await slackRes.text();
    console.error("[notify-slack] Slack error:", slackRes.status, errText);
    return json({ error: "Notification failed" }, 502, cors);
  }

  console.log("[notify-slack] Notification sent for user:", user_id);
  return json({ ok: true }, 200, cors);
});
