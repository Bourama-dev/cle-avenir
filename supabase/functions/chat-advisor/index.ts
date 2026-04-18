import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// ── OpenAI client (no SDK needed — just REST) ─────────────────────────────
async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ── Build rich Cléo system prompt ─────────────────────────────────────────
function buildSystemPrompt(mode: string, context: Record<string, unknown>): string {
  const profile = (context?.profile ?? {}) as Record<string, unknown>;
  const firstName = (profile.first_name as string) ?? 'l\'utilisateur';
  const jobTitle = (profile.main_goal as string) ?? (profile.job_title as string) ?? '';
  const riasec = (profile.riasec_profile as string[])?.join('') ?? '';
  const skills = ((profile.skills as string[]) ?? []).slice(0, 5).join(', ');
  const educationLevel = (profile.education_level as string) ?? '';
  const recommendations = (context?.recommendations as { code: string; libelle: string; match_score: number }[]) ?? [];
  const topMetiers = recommendations.slice(0, 3).map(r => `${r.libelle} (${r.code})`).join(', ');

  const siteContext = `
SITE CONTEXT (CléAvenir):
- CléAvenir est une plateforme d'orientation professionnelle française
- Elle propose: tests RIASEC, catalogue de 1584 métiers ROME, offres d'emploi France Travail, formations Parcoursup
- Elle accompagne les jeunes et adultes dans leur projet professionnel
- Données réelles: base ROME officielle, API France Travail, Parcoursup
`;

  const userContext = `
PROFIL UTILISATEUR:
- Prénom: ${firstName}
- Objectif professionnel: ${jobTitle || 'non défini'}
- Profil RIASEC: ${riasec || 'test non passé'}
- Compétences identifiées: ${skills || 'non renseigné'}
- Niveau d'études: ${educationLevel || 'non renseigné'}
- Métiers recommandés: ${topMetiers || 'aucune recommandation encore'}
`;

  if (mode === 'interview_coach') {
    const jobTarget = jobTitle || 'le poste visé';
    return `${siteContext}
RÔLE: Tu es une recruteuse experte RH qui mène une simulation d'entretien professionnelle.
CANDIDAT: ${firstName} — poste visé: ${jobTarget}
LANGUE: FRANÇAIS UNIQUEMENT.

OBJECTIF: Mener un entretien réaliste, adaptatif et bienveillant. Pose UNE seule question à la fois.
Les questions doivent progresser: motivation → expérience/formation → compétences → cas pratique → questions du candidat.
Adapte la difficulté selon le niveau: ${educationLevel || 'non précisé'}.

FORMAT DE RÉPONSE STRICT:
<ANALYSIS>
Feedback précis en 1-2 phrases sur la réponse précédente (clarté, structure, pertinence). Si début: "Prêt à commencer."
</ANALYSIS>
<SCORE>
Entier 0-100 évaluant la qualité de la réponse. 0 si début.
</SCORE>
<QUESTION>
Prochaine question d'entretien. Si réponse vague → question de clarification. Sinon → sujet suivant.
</QUESTION>

Tout doit être en français. Aucun texte hors des balises.`;
  }

  if (mode === 'learning_coach') {
    return `${siteContext}
${userContext}
RÔLE: Tu es Cléo, tutrice pédagogique bienveillante et experte en orientation.
LANGUE: FRANÇAIS UNIQUEMENT.
STYLE: Encourageant, pédagogique, concret. Maximum 150 mots. Markdown autorisé.
Aide ${firstName} à comprendre les formations, les métiers, les diplômes et les débouchés.
Propose des activités d'apprentissage concrètes issues de la plateforme CléAvenir.`;
  }

  // career_advisor (default)
  return `${siteContext}
${userContext}
RÔLE: Tu es Cléo, coach de carrière experte, bienveillante et directe. Tu travailles pour CléAvenir.
LANGUE: FRANÇAIS UNIQUEMENT. Ne réponds JAMAIS en anglais.

CAPACITÉS (utilise-les selon le besoin):
- Analyser le profil RIASEC et recommander des métiers adaptés
- Expliquer les formations, diplômes, les voies d'accès
- Guider sur la recherche d'emploi, le CV, l'entretien
- Répondre aux questions sur les offres d'emploi et formations en France

STYLE DE RÉPONSE:
- Concis (max 150 mots)
- Utilise **gras** pour les termes clés, listes à puces pour énumérer
- Personnalise avec le prénom et le contexte du profil
- Propose toujours une action concrète à la fin
- Ton chaleureux mais professionnel

MÉMOIRE CONVERSATIONNELLE: Tu te souviens de toute la conversation. Utilise le contexte précédent.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const anthropicKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const body = await req.json();
    const { message, history = [], userId, context = {}, mode = 'career_advisor' } = body;

    if (!message) return json({ error: 'Missing message' }, 400);

    // ── Enrich context with user data from DB ────────────────────────────────
    let enrichedContext = { ...context };

    if (userId && supabaseUrl && supabaseKey) {
      const sb = createClient(supabaseUrl, supabaseKey);
      try {
        // Fetch user profile
        const { data: profile } = await sb
          .from('profiles')
          .select('first_name, last_name, main_goal, job_title, education_level, riasec_profile, skills, experience_level')
          .eq('id', userId)
          .maybeSingle();
        if (profile) enrichedContext.profile = { ...enrichedContext.profile, ...profile };

        // Fetch user's top recommendations
        const { data: testResult } = await sb
          .from('test_results')
          .select('top_3_careers, riasec_profile')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (testResult?.top_3_careers) {
          enrichedContext.recommendations = testResult.top_3_careers;
        }
        if (testResult?.riasec_profile && !enrichedContext.profile?.riasec_profile) {
          enrichedContext.profile = { ...enrichedContext.profile, riasec_profile: testResult.riasec_profile };
        }
      } catch (dbErr) {
        console.warn('[chat-advisor] DB enrichment failed:', dbErr);
      }
    }

    // ── Build messages for Claude ─────────────────────────────────────────────
    const systemPrompt = context.systemInstruction ?? buildSystemPrompt(mode, enrichedContext);

    // Convert history (last 12 turns)
    const historyMessages = (history as { role: string; content: string }[])
      .slice(-12)
      .filter(m => m.content?.trim())
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    // Ensure alternating user/assistant (Claude requirement)
    const cleanHistory: { role: string; content: string }[] = [];
    for (const msg of historyMessages) {
      if (cleanHistory.length === 0 && msg.role === 'assistant') continue;
      const last = cleanHistory[cleanHistory.length - 1];
      if (last && last.role === msg.role) {
        last.content += '\n' + msg.content; // merge same-role consecutive
      } else {
        cleanHistory.push({ ...msg });
      }
    }

    const allMessages = [...cleanHistory, { role: 'user', content: message }];

    // ── Call Anthropic ────────────────────────────────────────────────────────
    let reply: string;

    if (!anthropicKey) {
      // Graceful fallback when key not configured
      console.warn('[chat-advisor] OPENAI_API_KEY not set — returning fallback');
      reply = `Bonjour ! Je suis Cléo, votre coach de carrière. Je suis là pour vous aider dans votre orientation professionnelle. Pour activer mes capacités complètes, l'administrateur doit configurer la clé OPENAI_API_KEY dans les variables d'environnement Supabase. En attendant, explorez le catalogue de métiers et passez votre test d'orientation ! 🚀`;
    } else {
      reply = await callOpenAI(anthropicKey, systemPrompt, allMessages);
    }

    // ── Extract profile updates from reply (simple pattern matching) ─────────
    let profileUpdates: Record<string, string> | null = null;
    const jobMatch = reply.match(/\bje vise\s+([^.!?\n]{3,50})/i)
      ?? reply.match(/\bobjectif\s*:\s*([^.!?\n]{3,50})/i);
    if (jobMatch) profileUpdates = { main_goal: jobMatch[1].trim() };

    // ── Generate smart suggestions ────────────────────────────────────────────
    const suggestions = generateSuggestions(mode, enrichedContext);

    return json({ reply, suggestions, profileUpdates });

  } catch (err) {
    console.error('[chat-advisor] Error:', err);
    return json({
      reply: 'Désolé, une erreur technique est survenue. Pouvez-vous réessayer dans quelques instants ?',
      suggestions: ['Réessayer', 'Voir les métiers', 'Passer le test'],
    });
  }
});

function generateSuggestions(mode: string, context: Record<string, unknown>): string[] {
  const profile = (context?.profile ?? {}) as Record<string, unknown>;
  const hasRiasec = !!(profile.riasec_profile);
  const hasGoal = !!(profile.main_goal ?? profile.job_title);

  if (mode === 'interview_coach') {
    return ['Continuer', 'Reformuler ma réponse', 'Question suivante'];
  }

  if (!hasRiasec) {
    return ['Passer le test RIASEC', 'Explorer les métiers', 'Que peut faire Cléo ?'];
  }

  if (!hasGoal) {
    return ['Définir mon projet pro', 'Voir mes recommandations', 'Explorer les formations'];
  }

  return ['Voir mes recommandations métiers', 'Trouver une formation', 'Préparer un entretien'];
}
