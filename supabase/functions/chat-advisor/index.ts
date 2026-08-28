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

// ── Site-data tools (function calling) ────────────────────────────────────────
// Lets Cléo look up real, current site content instead of relying only on the
// static "SITE CONTEXT" blurb and the user's own profile.
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_metiers',
      description: "Recherche des métiers dans la base ROME de CléAvenir (1500+ métiers officiels) par mot-clé (intitulé, description, secteur). Utilise ceci dès qu'on te demande des infos sur un métier, un secteur, ou des débouchés.",
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Mot-clé de recherche (ex: "développeur", "infirmier", "marketing")' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_metier_detail',
      description: "Récupère la fiche complète d'un métier ROME à partir de son code (ex: M1810). Utilise ceci après search_metiers pour approfondir un métier précis.",
      parameters: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'Code ROME du métier, ex: M1810' },
        },
        required: ['code'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_formations',
      description: "Recherche des formations réelles (titre, organisme, ville, coût, niveau requis, débouchés) dans la base CléAvenir. Utilise ceci dès qu'on te demande des formations, écoles, ou comment se former à un métier.",
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Mot-clé (intitulé de formation ou métier visé)' },
          city: { type: 'string', description: 'Ville ou région pour filtrer (optionnel)' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_articles',
      description: "Recherche dans les articles de blog/actualités publiés sur CléAvenir (conseils carrière, marché de l'emploi, actualités formation). Utilise ceci si l'utilisateur demande des conseils, actualités, ou du contenu éditorial du site.",
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Mot-clé ou thème recherché' },
        },
        required: ['query'],
      },
    },
  },
] as const;

// deno-lint-ignore no-explicit-any
async function executeTool(sb: any, name: string, args: Record<string, unknown>): Promise<unknown> {
  if (!sb) return { error: 'Base de données indisponible' };

  try {
    if (name === 'search_metiers') {
      const q = String(args.query ?? '').trim();
      if (!q) return { error: 'query manquant' };
      const { data, error } = await sb
        .from('rome_metiers')
        .select('code, libelle, description, salaire, debouches, niveau_etudes')
        .or(`libelle.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5);
      if (error) return { error: error.message };
      return { results: data ?? [] };
    }

    if (name === 'get_metier_detail') {
      const code = String(args.code ?? '').trim();
      if (!code) return { error: 'code manquant' };
      const { data, error } = await sb
        .from('rome_metiers')
        .select('code, libelle, description, definition, salaire, debouches, niveau_etudes, required_skills, domain')
        .eq('code', code)
        .maybeSingle();
      if (error) return { error: error.message };
      return data ?? { error: 'Métier introuvable' };
    }

    if (name === 'search_formations') {
      const q = String(args.query ?? '').trim();
      if (!q) return { error: 'query manquant' };
      let query = sb
        .from('formations_enriched')
        .select('title, provider_name, description, cost, duration, required_education_level, location_city, region')
        .eq('is_active', true)
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(5);
      if (args.city) query = query.ilike('location_city', `%${String(args.city)}%`);
      const { data, error } = await query;
      if (error) return { error: error.message };
      return { results: data ?? [] };
    }

    if (name === 'search_articles') {
      const q = String(args.query ?? '').trim();
      if (!q) return { error: 'query manquant' };
      const { data, error } = await sb
        .from('blog_articles')
        .select('title, excerpt, slug, category, published_at')
        .eq('published', true)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,keywords.ilike.%${q}%`)
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) return { error: error.message };
      return { results: data ?? [] };
    }

    return { error: `Outil inconnu: ${name}` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

// ── OpenAI client (with tool-calling loop for site data lookups) ─────────────
// deno-lint-ignore no-explicit-any
async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  sb: any = null,
): Promise<string> {
  // deno-lint-ignore no-explicit-any
  const conversation: any[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
  ];

  for (let round = 0; round < 3; round++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: conversation,
        tools: TOOLS,
        tool_choice: 'auto',
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI ${res.status}: ${err}`);
    }
    const data = await res.json();
    const msg = data.choices?.[0]?.message;
    if (!msg) return '';

    if (msg.tool_calls?.length) {
      conversation.push(msg);
      for (const call of msg.tool_calls) {
        let args: Record<string, unknown> = {};
        try { args = JSON.parse(call.function.arguments || '{}'); } catch { /* ignore malformed args */ }
        const result = await executeTool(sb, call.function.name, args);
        conversation.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result).slice(0, 4000),
        });
      }
      continue; // let the model use the tool results
    }

    return msg.content ?? '';
  }

  return "Désolé, je n'ai pas réussi à terminer cette recherche. Peux-tu reformuler ?";
}

// ── Build rich Cléo system prompt ─────────────────────────────────────────────
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

OUTILS DE RECHERCHE (utilise-les activement, ne réponds JAMAIS "je ne sais pas" sans avoir essayé) :
- search_metiers : recherche des métiers réels par mot-clé
- get_metier_detail : fiche complète d'un métier (à partir de son code)
- search_formations : recherche des formations réelles (ville, coût, niveau requis)
- search_articles : recherche dans les articles/actualités publiés du site
Dès qu'une question porte sur un métier, une formation, un secteur ou un contenu du site, appelle l'outil correspondant avant de répondre plutôt que de deviner. Cite les informations trouvées (intitulé, code, ville, coût...) pour rester factuel.
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

// ── Profile extraction from conversation ─────────────────────────────────────
// Analyzes both the user message AND Cléo's reply to detect profile info.
// Returns null if nothing is found.
function extractProfileUpdates(
  userMessage: string,
  reply: string
): Record<string, unknown> | null {
  const combined = `${userMessage} ${reply}`;
  const lower = combined.toLowerCase();
  const updates: Record<string, unknown> = {};

  // ── Career goal ──────────────────────────────────────────────────────────
  const goalPatterns = [
    /(?:je vise|je veux devenir|je voudrais être|je souhaite devenir|je vise le poste de|mon objectif est d(?:e|')|je vise un poste de)\s+([^.!?,\n]{3,60})/i,
    /(?:mon projet(?:\s+professionnel)?\s+(?:est|:))\s+([^.!?,\n]{3,60})/i,
    /(?:objectif\s*(?:professionnel)?\s*:)\s*([^.!?,\n]{3,60})/i,
    /(?:devenir|être)\s+(développeur|médecin|infirmier|avocat|comptable|designer|architecte|ingénieur|professeur|enseignant|chef de projet|directeur|manager|commercial|marketing|data scientist|analyste)[^.!?,\n]{0,40}/i,
  ];
  for (const pattern of goalPatterns) {
    const match = combined.match(pattern);
    if (match) {
      updates.main_goal = match[1].trim();
      break;
    }
  }

  // ── Location ────────────────────────────────────────────────────────────
  const locationPatterns = [
    /(?:j'habite\s+(?:à|en)|je vis\s+(?:à|en)|je suis\s+(?:basé|situé)(?:e)?\s+(?:à|en)|je réside\s+(?:à|en))\s+([A-ZÀ-Ÿa-zà-ÿ][a-zà-ÿ\-]+(?:\s[A-ZÀ-Ÿ][a-zà-ÿ\-]+)?)/i,
    /(?:je suis de|originaire de|ma ville est)\s+([A-ZÀ-Ÿa-zà-ÿ][a-zà-ÿ\-]+(?:\s[A-ZÀ-Ÿ][a-zà-ÿ\-]+)?)/i,
  ];
  for (const pattern of locationPatterns) {
    const match = combined.match(pattern);
    if (match) {
      updates.location = match[1].trim();
      break;
    }
  }

  // ── Education level ──────────────────────────────────────────────────────
  if (/bac\s*\+\s*5|master\s*2|m2\b|doctorat|phd|grande\s+école/i.test(lower)) {
    updates.education_level = 'bac+5';
  } else if (/master\s*1|m1\b|bac\s*\+\s*4/i.test(lower)) {
    updates.education_level = 'bac+4';
  } else if (/licence|bachelor|bac\s*\+\s*3/i.test(lower)) {
    updates.education_level = 'bac+3';
  } else if (/\bbts\b|\bdut\b|\biut\b|bac\s*\+\s*2/i.test(lower)) {
    updates.education_level = 'bac+2';
  } else if (/\bbac\b|terminale\b/i.test(lower) && !/bac\s*\+/i.test(lower)) {
    updates.education_level = 'bac';
  } else if (/cap\b|bep\b/i.test(lower)) {
    updates.education_level = 'cap_bep';
  }

  // ── Salary expectations ──────────────────────────────────────────────────
  const salaryPatterns = [
    /(\d{1,3})\s*k\s*(?:€|euros?)/i,           // "35k€" or "35 k euros"
    /(\d{4,6})\s*(?:€|euros?)/i,                 // "35000€" or "35000 euros"
    /salaire\s+(?:de\s+|souhaité\s+)?(\d[\d\s]*)\s*(?:k|000)?\s*(?:€|euros?)/i,
  ];
  for (const pattern of salaryPatterns) {
    const match = combined.match(pattern);
    if (match) {
      let amount = parseInt(match[1].replace(/\s/g, ''));
      if (amount < 1000) amount *= 1000; // "35k" → 35000
      if (amount >= 15000 && amount <= 250000) {
        updates.constraints = { salary_expectations: amount };
        break;
      }
    }
  }

  // ── Technical skills (from user message only, not Cléo's response) ──────
  const skillKeywords: Record<string, string> = {
    python: 'Python', javascript: 'JavaScript', typescript: 'TypeScript',
    react: 'React', vue: 'Vue.js', angular: 'Angular',
    'node.js': 'Node.js', nodejs: 'Node.js',
    sql: 'SQL', postgresql: 'PostgreSQL', mysql: 'MySQL',
    java: 'Java', php: 'PHP', 'c#': 'C#', 'c++': 'C++',
    excel: 'Excel', powerpoint: 'PowerPoint', word: 'Word',
    photoshop: 'Photoshop', illustrator: 'Illustrator', figma: 'Figma',
    html: 'HTML', css: 'CSS',
    docker: 'Docker', git: 'Git', linux: 'Linux',
    marketing: 'Marketing', 'seo': 'SEO', 'crm': 'CRM',
    comptabilité: 'Comptabilité', gestion: 'Gestion', management: 'Management',
  };
  const userLower = userMessage.toLowerCase();
  const detectedSkills = Object.entries(skillKeywords)
    .filter(([keyword]) => userLower.includes(keyword))
    .map(([, label]) => label);
  if (detectedSkills.length > 0) {
    updates.skills = detectedSkills;
  }

  // ── Interests ────────────────────────────────────────────────────────────
  const interestMatch = userMessage.match(
    /(?:je m'intéresse|j'aime|je suis passionné par|ma passion est|j'adore)\s+([^.!?,\n]{3,50})/i
  );
  if (interestMatch) {
    updates.interests = [interestMatch[1].trim()];
  }

  return Object.keys(updates).length > 0 ? updates : null;
}

// ── Generate smart suggestions ────────────────────────────────────────────────
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

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  try {
    const anthropicKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const body = await req.json();
    const { message, history = [], userId, context = {}, mode = 'career_advisor' } = body;

    if (!message) return json({ error: 'Missing message' }, 400);

    // ── Enrich context with user data from DB ──────────────────────────────
    let enrichedContext = { ...context };

    // Created whenever the DB is reachable — used both for profile
    // enrichment (below, when logged in) and for the search_* tool calls
    // (always, so anonymous visitors can still ask about site content).
    const sb = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    if (userId && sb) {
      try {
        const { data: profile } = await sb
          .from('profiles')
          .select('first_name, last_name, main_goal, job_title, education_level, riasec_profile, skills, experience_level, location, interests, constraints')
          .eq('id', userId)
          .maybeSingle();
        if (profile) enrichedContext.profile = { ...enrichedContext.profile, ...profile };

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

    // ── Build messages for AI ──────────────────────────────────────────────
    const systemPrompt = context.systemInstruction ?? buildSystemPrompt(mode, enrichedContext);

    const historyMessages = (history as { role: string; content: string }[])
      .slice(-12)
      .filter(m => m.content?.trim())
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    const cleanHistory: { role: string; content: string }[] = [];
    for (const msg of historyMessages) {
      if (cleanHistory.length === 0 && msg.role === 'assistant') continue;
      const last = cleanHistory[cleanHistory.length - 1];
      if (last && last.role === msg.role) {
        last.content += '\n' + msg.content;
      } else {
        cleanHistory.push({ ...msg });
      }
    }

    const allMessages = [...cleanHistory, { role: 'user', content: message }];

    // ── Call AI ────────────────────────────────────────────────────────────
    let reply: string;

    if (!anthropicKey) {
      console.warn('[chat-advisor] OPENAI_API_KEY not set — returning fallback');
      reply = `Bonjour ! Je suis Cléo, votre coach de carrière. Pour activer mes capacités complètes, l'administrateur doit configurer la clé OPENAI_API_KEY dans les variables d'environnement Supabase. En attendant, explorez le catalogue de métiers et passez votre test d'orientation ! 🚀`;
    } else {
      reply = await callOpenAI(anthropicKey, systemPrompt, allMessages, sb);
    }

    // ── Extract profile updates from conversation ──────────────────────────
    const profileUpdates = extractProfileUpdates(message, reply);

    // ── Smart suggestions ──────────────────────────────────────────────────
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
