import { supabase } from '@/lib/customSupabaseClient';
import { interviewService } from './interviewService';

// AI-driven interview: the recruiter adapts every question to the job offer
// and to the candidate's previous answers (follow-ups), then an evaluator
// produces a per-competency report. Prompts and the usage quota live server
// side, in the `interview_simulator` mode of the chat-advisor edge function:
// the client only sends the job context and the answers. Each interview gets
// a credit id from `start` that later calls must present. Any AI failure
// falls back to the static question bank and the local heuristic scoring so
// the interview never gets stuck.

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

export const clampScore = (value, fallback = 50) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, n));
};

export const extractTag = (text, tag) => {
  const match = text?.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return match ? match[1].trim() : null;
};

/** Thrown by startInterview when the user has no interview left. */
export class InterviewQuotaError extends Error {
  constructor(quota) {
    super("Limite d'entretiens IA atteinte");
    this.name = 'InterviewQuotaError';
    this.quota = quota;
  }
}

export const PERIOD_LABELS = { day: "aujourd'hui", month: 'ce mois-ci', total: '' };

/** User-facing sentence for an exhausted quota. */
export function quotaMessage(quota) {
  if (!quota) return "Tu as atteint ta limite d'entretiens IA.";
  const when = quota.resetAt
    ? ` Prochain entretien disponible le ${new Date(quota.resetAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}.`
    : '';
  const used = quota.limit === 1 ? 'ton entretien IA' : `tes ${quota.limit} entretiens IA`;
  return `Tu as utilisé ${used} ${PERIOD_LABELS[quota.period] ?? ''}.${when}`.replace(/\s+\./g, '.');
}

function toServerConfig(config) {
  return {
    jobTitle: config.jobTitle,
    company: config.company,
    level: config.level,
    jobOffer: config.jobOffer,
    focusLabel: interviewService.types[config.focus]?.name || 'Entretien complet',
    questionCount: config.questionCount,
    firstName: config.firstName,
  };
}

async function callSimulator(action, payload = {}) {
  const { data, error } = await supabase.functions.invoke('chat-advisor', {
    body: { mode: 'interview_simulator', action, ...payload },
  });
  if (error) throw error;
  if (data?.error) {
    const err = new Error(data.message || data.error);
    err.code = data.error;
    err.quota = data.quota;
    throw err;
  }
  return data;
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
  /** Current usage: {limit, used, remaining, period, tier, resetAt}, or null if unknown. */
  async getQuota() {
    try {
      return (await callSimulator('status')).quota || null;
    } catch (error) {
      console.warn('[aiInterview] quota status unavailable:', error);
      return null;
    }
  },

  /**
   * First question of the interview. Consumes one interview from the quota.
   * @throws {InterviewQuotaError} when the user has no interview left
   * @returns {Promise<{question: string, aiPowered: boolean, creditId: string|null, quota: object|null}>}
   */
  async startInterview(config) {
    try {
      const data = await callSimulator('start', { config: toServerConfig(config) });
      const question = extractTag(data.reply, 'QUESTION');
      if (!question) throw new Error('Malformed AI reply');
      return { question, aiPowered: true, creditId: data.creditId, quota: data.quota || null };
    } catch (error) {
      if (error.code === 'quota_exceeded') throw new InterviewQuotaError(error.quota);
      console.warn('[aiInterview] start fallback:', error);
      return { question: fallbackQuestion(config, 0), aiPowered: false, creditId: null, quota: null };
    }
  },

  /**
   * Sends the latest answer and gets the next (possibly follow-up) question.
   * @param turns previous turns including the one just answered: [{question, answer}]
   * @returns {Promise<{analysis: string, score: number, question: string|null, aiPowered: boolean}>}
   */
  async nextTurn(config, turns, creditId, aiPowered = true) {
    const nextIndex = turns.length;
    const isLast = nextIndex >= config.questionCount;
    const lastAnswer = turns[turns.length - 1]?.answer || '';

    if (aiPowered && creditId) {
      try {
        const { reply } = await callSimulator('turn', {
          config: toServerConfig(config),
          creditId,
          turns: turns.map(({ question, answer }) => ({ question, answer })),
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
   * @returns {Promise<object>} report (see evaluatorPrompt in chat-advisor/interview.ts), with `aiPowered`
   */
  async generateReport(config, turns, creditId) {
    if (!creditId) return this.localReport(turns);
    try {
      const { reply } = await callSimulator('report', {
        config: toServerConfig(config),
        creditId,
        turns: turns.map(({ question, answer }) => ({ question, answer })),
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
