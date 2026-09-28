import { supabase } from '@/lib/customSupabaseClient';
import { interviewService } from './interviewService';

// AI-driven interview: the recruiter adapts every question to the job offer
// and to the candidate's previous answers (follow-ups), then an evaluator
// produces a per-competency report. Both go through the existing
// `chat-advisor` edge function, using `context.systemInstruction` to supply
// our own prompts. Any AI failure falls back to the static question bank and
// the local heuristic scoring so the interview never gets stuck.

export const COMPETENCIES = [
  { key: 'communication', label: 'Communication' },
  { key: 'structure', label: 'Structure des réponses' },
  { key: 'pertinence', label: 'Pertinence pour le poste' },
  { key: 'motivation', label: 'Motivation' },
  { key: 'confiance', label: 'Confiance' },
];

export const LEVELS = {
  stage: 'Stage / alternance',
  junior: 'Junior (0-2 ans)',
  confirme: 'Confirmé (3-7 ans)',
  senior: 'Senior (8 ans et +)',
};

const MAX_OFFER_CHARS = 4000;

export const clampScore = (value, fallback = 50) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, n));
};

export const extractTag = (text, tag) => {
  const match = text?.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? match[1].trim() : null;
};

export async function callAdvisor({ message, history = [], systemInstruction, userId }) {
  const { data, error } = await supabase.functions.invoke('chat-advisor', {
    body: {
      message,
      history,
      userId,
      mode: 'interview_coach',
      context: { systemInstruction },
    },
  });
  if (error) throw error;
  if (!data?.reply) throw new Error('Empty AI reply');
  return data.reply;
}

function describeJob(config) {
  const lines = [
    `Poste visé : ${config.jobTitle || 'non précisé'}`,
    config.company ? `Entreprise : ${config.company}` : null,
    `Niveau du candidat : ${LEVELS[config.level] || config.level || 'non précisé'}`,
    `Type d'entretien : ${interviewService.types[config.focus]?.name || 'Entretien complet'}`,
  ].filter(Boolean);
  if (config.jobOffer?.trim()) {
    lines.push(`Offre d'emploi (extrait) :\n"""\n${config.jobOffer.trim().slice(0, MAX_OFFER_CHARS)}\n"""`);
  }
  return lines.join('\n');
}

function buildInterviewerPrompt(config) {
  return `RÔLE: Tu es Cléo, recruteuse expérimentée. Tu mènes un entretien d'embauche oral réaliste avec ${config.firstName || 'le candidat'}.
LANGUE: FRANÇAIS UNIQUEMENT. Vouvoie le candidat, comme dans un vrai entretien.

CONTEXTE DU POSTE:
${describeJob(config)}

DÉROULÉ: ${config.questionCount} questions au total. Pose UNE seule question à la fois, courte et naturelle à l'oral (max 2 phrases).
- Appuie-toi sur les missions et compétences de l'offre quand elle est fournie.
- Progresse: présentation/motivation → expérience et compétences clés du poste → mise en situation → question piège ou comportementale.
- RELANCE comme un vrai recruteur: si la réponse précédente est vague, trop courte ou sans exemple concret, creuse-la (« Pouvez-vous me donner un exemple précis ? ») au lieu de changer de sujet.
- N'utilise jamais d'outil de recherche: tu mènes un entretien, tu ne donnes pas d'information.

FORMAT DE RÉPONSE STRICT (aucun texte hors balises):
<ANALYSIS>1 phrase de feedback constructif sur la réponse précédente. Au début: "Début de l'entretien."</ANALYSIS>
<SCORE>Entier 0-100 évaluant la réponse précédente. 0 au début.</SCORE>
<QUESTION>Ta prochaine question.</QUESTION>`;
}

function buildEvaluatorPrompt(config) {
  return `RÔLE: Tu es un coach expert en recrutement. Tu évalues un entretien d'embauche simulé, de façon honnête, précise et bienveillante.
LANGUE: FRANÇAIS UNIQUEMENT. Tutoie le candidat dans tes conseils.
N'utilise aucun outil de recherche.

CONTEXTE DU POSTE:
${describeJob(config)}

Réponds UNIQUEMENT avec un objet JSON valide (sans bloc de code, sans texte autour) de la forme:
{
  "overall": <entier 0-100>,
  "summary": "<2 phrases de bilan global>",
  "competencies": {
    "communication": <0-100>,
    "structure": <0-100>,
    "pertinence": <0-100>,
    "motivation": <0-100>,
    "confiance": <0-100>
  },
  "strengths": ["<point fort concret>", "..."],
  "improvements": ["<axe d'amélioration concret>", "..."],
  "answers": [
    { "score": <0-100>, "feedback": "<1-2 phrases>", "better_answer": "<piste de meilleure réponse, 1-2 phrases>" }
  ]
}
"answers" contient exactement une entrée par question, dans l'ordre. 2 à 4 éléments dans "strengths" et "improvements".
Sois exigeant: une réponse vague ou sans exemple ne dépasse pas 55.`;
}

const START_MESSAGE = "L'entretien commence. Accueille brièvement le candidat et pose la première question.";

// Conversation so far, up to (and including) the question that was just
// answered — its answer is sent separately as the new message. Starts with a
// user turn because chat-advisor drops a leading assistant message.
function toHistory(turns) {
  const history = [{ role: 'user', content: START_MESSAGE }];
  turns.forEach((t, i) => {
    history.push({ role: 'assistant', content: `<QUESTION>${t.question}</QUESTION>` });
    if (i < turns.length - 1) history.push({ role: 'user', content: t.answer });
  });
  return history;
}

function fallbackQuestion(config, index) {
  const bank = interviewService.types[config.focus]?.questions?.length
    ? interviewService.types[config.focus].questions
    : [
        ...interviewService.types.pitch.questions,
        ...interviewService.types.recruiter.questions,
        ...interviewService.types.motivation.questions,
        ...interviewService.types.technical.questions,
      ];
  return bank[index % bank.length];
}

export const aiInterviewService = {
  /**
   * First question of the interview.
   * @returns {Promise<{question: string, aiPowered: boolean}>}
   */
  async startInterview(config, userId) {
    try {
      const reply = await callAdvisor({
        message: START_MESSAGE,
        systemInstruction: buildInterviewerPrompt(config),
        userId,
      });
      const question = extractTag(reply, 'QUESTION');
      if (!question) throw new Error('Malformed AI reply');
      return { question, aiPowered: true };
    } catch (error) {
      console.warn('[aiInterview] start fallback:', error);
      return { question: fallbackQuestion(config, 0), aiPowered: false };
    }
  },

  /**
   * Sends the latest answer and gets the next (possibly follow-up) question.
   * @param turns previous turns including the one just answered: [{question, answer}]
   * @returns {Promise<{analysis: string, score: number, question: string|null, aiPowered: boolean}>}
   */
  async nextTurn(config, turns, userId, aiPowered = true) {
    const nextIndex = turns.length;
    const isLast = nextIndex >= config.questionCount;
    const lastAnswer = turns[turns.length - 1]?.answer || '';

    if (aiPowered) {
      try {
        const remaining = config.questionCount - nextIndex;
        const reply = await callAdvisor({
          message: `${lastAnswer}\n\n[Consigne: ${isLast
            ? "c'était la dernière réponse. Dans <QUESTION>, remercie simplement le candidat et clôture l'entretien."
            : `il reste ${remaining} question(s). Relance si la réponse est vague, sinon passe au sujet suivant.`}]`,
          history: toHistory(turns),
          systemInstruction: buildInterviewerPrompt(config),
          userId,
        });
        const question = extractTag(reply, 'QUESTION');
        if (!question) throw new Error('Malformed AI reply');
        return {
          analysis: extractTag(reply, 'ANALYSIS') || '',
          score: clampScore(extractTag(reply, 'SCORE')),
          question: isLast ? null : question,
          closing: isLast ? question : null,
          aiPowered: true,
        };
      } catch (error) {
        console.warn('[aiInterview] turn fallback:', error);
      }
    }

    const local = interviewService.analyzeAnswer(lastAnswer);
    return {
      analysis: local.feedback,
      score: Math.round((local.clarity + local.confidence) / 2),
      question: isLast ? null : fallbackQuestion(config, nextIndex),
      closing: null,
      aiPowered: false,
    };
  },

  /**
   * Full end-of-interview report.
   * @returns {Promise<object>} report (see buildEvaluatorPrompt), with `aiPowered`
   */
  async generateReport(config, turns, userId) {
    const transcript = turns
      .map((t, i) => `Q${i + 1}: ${t.question}\nR${i + 1}: ${t.answer}`)
      .join('\n\n');

    try {
      const reply = await callAdvisor({
        message: `Voici la transcription de l'entretien:\n\n${transcript}`,
        systemInstruction: buildEvaluatorPrompt(config),
        userId,
      });
      const jsonText = reply.slice(reply.indexOf('{'), reply.lastIndexOf('}') + 1);
      const parsed = JSON.parse(jsonText);
      const competencies = {};
      COMPETENCIES.forEach(({ key }) => { competencies[key] = clampScore(parsed.competencies?.[key]); });
      return {
        aiPowered: true,
        overall: clampScore(parsed.overall),
        summary: parsed.summary || '',
        competencies,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 4) : [],
        answers: turns.map((t, i) => ({
          question: t.question,
          answer: t.answer,
          score: clampScore(parsed.answers?.[i]?.score, t.score ?? 50),
          feedback: parsed.answers?.[i]?.feedback || t.analysis || '',
          betterAnswer: parsed.answers?.[i]?.better_answer || '',
        })),
      };
    } catch (error) {
      console.warn('[aiInterview] report fallback:', error);
      return this.localReport(turns);
    }
  },

  localReport(turns) {
    const analyses = turns.map((t) => interviewService.analyzeAnswer(t.answer));
    const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
    const clarity = avg(analyses.map((a) => a.clarity));
    const confidence = avg(analyses.map((a) => a.confidence));
    const overall = Math.round((clarity + confidence) / 2);
    return {
      aiPowered: false,
      overall,
      summary: "Analyse simplifiée (l'IA n'était pas disponible) basée sur la longueur et l'assurance de tes réponses.",
      competencies: {
        communication: clarity,
        structure: clarity,
        pertinence: overall,
        motivation: overall,
        confiance: confidence,
      },
      strengths: confidence >= 75 ? ['Tu t\'exprimes avec assurance.'] : [],
      improvements: [
        'Structure tes réponses avec la méthode STAR : Situation, Tâche, Action, Résultat.',
        'Appuie chaque affirmation sur un exemple concret et chiffré.',
      ],
      answers: turns.map((t, i) => ({
        question: t.question,
        answer: t.answer,
        score: Math.round((analyses[i].clarity + analyses[i].confidence) / 2),
        feedback: analyses[i].feedback,
        betterAnswer: '',
      })),
    };
  },
};
