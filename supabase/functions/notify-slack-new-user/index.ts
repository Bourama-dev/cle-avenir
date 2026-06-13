import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_NOUVELLE_UTILISATEUR");
  if (!webhookUrl) {
    console.error("[notify-slack] SLACK_WEBHOOK_NOUVELLE_UTILISATEUR not set");
    return new Response("Webhook not configured", { status: 500 });
  }

  let body: { user_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { user_id } = body;
  if (!user_id) return new Response("Missing user_id", { status: 400 });

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
    return new Response("Profile not found", { status: 404 });
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
    `:bust_in_silhouette: *Nom :* ${profile.first_name || "—"} ${profile.last_name || "—"}\n` +
    `:email: *Email :* ${profile.email || "—"}\n` +
    `:birthday: *Âge :* ${profile.age_range || "—"}\n` +
    `:briefcase: *Statut :* ${profile.user_status || "—"}\n` +
    `:mortar_board: *Niveau d'études :* ${profile.education_level || "—"}\n` +
    `:round_pushpin: *Localisation :* ${location}\n` +
    `:star: *Abonnement :* ${profile.subscription_tier || "free"}\n` +
    `:calendar: *Inscrit le :* ${date}`;

  const slackRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!slackRes.ok) {
    const errText = await slackRes.text();
    console.error("[notify-slack] Slack error:", slackRes.status, errText);
    return new Response(`Slack error: ${errText}`, { status: 502 });
  }

  console.log("[notify-slack] Notification sent for user:", user_id);
  return new Response("OK", { status: 200 });
});
