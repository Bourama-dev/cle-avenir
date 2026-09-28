// Hands a job offer over to the interview simulator (/interview).
// Kept in sessionStorage rather than router state so it survives the
// redirect through /login when the user isn't signed in yet.

const KEY = 'cleavenir_interview_prefill';
const MAX_OFFER_CHARS = 6000;

// Alternance / stage offers → the simulator's "Stage / alternance" level.
const guessLevel = (contractType) => (
  /altern|apprenti|professionnalisation|stage/i.test(contractType || '') ? 'stage' : null
);

// Some offer descriptions carry HTML; the simulator's textarea wants plain text.
const toPlainText = (value) => String(value || '')
  .replace(/<br\s*\/?>|<\/(p|li|div|h\d)>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

export const interviewPrefill = {
  save({ title, company, description, level, contractType } = {}) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        jobTitle: (title || '').trim().slice(0, 120),
        company: (company || '').trim().slice(0, 80),
        jobOffer: toPlainText(description).slice(0, MAX_OFFER_CHARS),
        level: level || guessLevel(contractType),
      }));
    } catch {
      // sessionStorage unavailable — the user just fills the form manually
    }
  },

  /** Returns the pending prefill, or null. */
  peek() {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clear() {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  },
};
