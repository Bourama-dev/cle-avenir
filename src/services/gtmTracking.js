/**
 * Service de tracking Google Tag Manager / gtag (GA4)
 * - SSR-safe
 * - Queue: si gtag pas prêt, on garde les events et on flush ensuite
 * - Debug option
 * - Normalisation data
 */

const DEBUG = false;

// Petite queue pour ne pas perdre les events si gtag charge après
const _queue = [];
let _flushed = false;

// Consent (optionnel) : si tu as un CMP, tu peux lier ça
// Exemple: window.__analytics_consent = true/false
function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  // par défaut: true si tu n'as pas de CMP
  if (window.__analytics_consent === undefined) return true;
  return window.__analytics_consent === true;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function getGtag() {
  if (!isBrowser()) return null;
  return typeof window.gtag === 'function' ? window.gtag : null;
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function sanitizeEventData(data) {
  // GA4 recommande des paramètres simples (string/number/bool)
  const out = {};
  Object.entries(data || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === 'number') out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else out[k] = String(v);
  });
  return out;
}

function enqueue(eventName, eventData) {
  _queue.push({ eventName, eventData, ts: Date.now() });
}

function flushQueue() {
  if (_flushed) return;
  const gtag = getGtag();
  if (!gtag) return;

  _flushed = true;
  while (_queue.length) {
    const e = _queue.shift();
    try {
      gtag('event', e.eventName, e.eventData);
    } catch {
      // si ça échoue, on abandonne silencieusement
    }
  }
}

/**
 * Track un événement personnalisé
 */
export function trackEvent(eventName, eventData = {}) {
  if (!isBrowser()) return;

  // Respect consent si présent
  if (!hasAnalyticsConsent()) return;

  const gtag = getGtag();
  const payload = sanitizeEventData(eventData);

  if (gtag) {
    try {
      gtag('event', eventName, payload);
      if (DEBUG) console.log('[GTM]', eventName, payload);
    } catch (e) {
      if (DEBUG) console.warn('[GTM] send failed, queueing', e);
      enqueue(eventName, payload);
    }
  } else {
    // gtag pas prêt => queue
    enqueue(eventName, payload);
    // tentative de flush un peu plus tard
    setTimeout(flushQueue, 500);
  }
}

/**
 * Track le début du test
 */
export function trackTestStart() {
  trackEvent('career_test_start', {
    category: 'engagement',
    label: 'career_test'
  });
}

/**
 * Track une réponse au test
 */
export function trackTestAnswer(questionId, answerId) {
  trackEvent('career_test_answer', {
    category: 'engagement',
    label: `question_${questionId}`,
    question_id: String(questionId),
    answer_id: String(answerId)
  });
}

/**
 * Track la complétion du test
 * testDuration: secondes (number)
 */
export function trackTestComplete(testDuration) {
  trackEvent('career_test_complete', {
    category: 'engagement',
    label: 'career_test',
    value: safeNumber(testDuration)
  });
}

/**
 * Track la visualisation des résultats
 */
export function trackResultsView(topCareer, percentage) {
  trackEvent('career_results_view', {
    category: 'engagement',
    label: String(topCareer || 'unknown'),
    value: safeNumber(percentage)
  });
}

/**
 * Track un clic sur un métier
 */
export function trackCareerClick(careerName) {
  trackEvent('career_click', {
    category: 'engagement',
    label: String(careerName || 'unknown')
  });
}

/**
 * Track une inscription
 */
export function trackSignup(source = 'test_results') {
  // GA4 recommande 'sign_up' (event standard)
  trackEvent('sign_up', {
    category: 'conversion',
    method: String(source)
  });
}

/**
 * Track une connexion
 */
export function trackLogin(source = 'test_results') {
  // GA4 recommande 'login' (event standard)
  trackEvent('login', {
    category: 'engagement',
    method: String(source)
  });
}

/**
 * Track une vue de page
 * ⚠️ si tu utilises GA4 avec GTM, souvent la page_view est déjà auto-trackée.
 * Utilise ça seulement si tu as désactivé l’auto pageview.
 */
let _lastPagePath = null;
export function trackPageView(pageName, pageTitle) {
  const path = String(pageName || window.location?.pathname || '/');
  if (_lastPagePath === path) return; // dédup simple
  _lastPagePath = path;

  trackEvent('page_view', {
    page_path: path,
    page_title: String(pageTitle || document.title || ''),
  });
}

/**
 * Track une exception/erreur
 */
export function trackException(description, fatal = false) {
  trackEvent('exception', {
    description: String(description || 'unknown_error'),
    fatal: !!fatal
  });
}

// Optionnel: exposer flush si tu veux l’appeler après chargement GTM
export function flushGtmQueue() {
  if (!isBrowser()) return;
  flushQueue();
}