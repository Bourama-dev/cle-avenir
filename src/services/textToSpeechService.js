/**
 * Service TTS — priorise les voix françaises neurales (Google, Microsoft)
 * pour une expérience proche d'un modèle ML naturel, sans coût.
 *
 * Ordre de priorité des voix :
 *   1. Google français (Chrome) — voix neurale, très naturelle
 *   2. Microsoft Hortense / Julie / Denise (Edge/Windows) — neural
 *   3. Pauline (macOS) — bonne qualité
 *   4. N'importe quelle voix française féminine (name heuristics)
 *   5. N'importe quelle voix française
 */

const FEMALE_NAME_HINTS = [
  'hortense', 'julie', 'denise', 'amélie', 'pauline',
  'claire', 'marie', 'elsa', 'emma', 'sophie', 'léa',
  'female', 'femme', 'woman',
];

function pickBestFrenchVoice(voices) {
  const fr = voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
  if (!fr.length) return null;

  // 1. Google français (neural, most natural on Chrome)
  const google = fr.find(v => v.name.toLowerCase().includes('google'));
  if (google) return google;

  // 2. Microsoft neural voices (Edge / Windows)
  const msNeural = fr.find(v =>
    v.name.toLowerCase().includes('microsoft') &&
    (v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('online'))
  );
  if (msNeural) return msNeural;

  // 3. Any Microsoft feminine voice
  const msFemale = fr.find(v => {
    const lc = v.name.toLowerCase();
    return lc.includes('microsoft') && FEMALE_NAME_HINTS.some(h => lc.includes(h));
  });
  if (msFemale) return msFemale;

  // 4. Any feminine-sounding voice by name heuristics
  const femaleHint = fr.find(v =>
    FEMALE_NAME_HINTS.some(h => v.name.toLowerCase().includes(h))
  );
  if (femaleHint) return femaleHint;

  // 5. First available French voice
  return fr[0];
}

let _cachedVoice = null;
let _voicesLoaded = false;

function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      _voicesLoaded = true;
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      const v = window.speechSynthesis.getVoices();
      _voicesLoaded = true;
      resolve(v);
    };
    // Fallback timeout
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000);
  });
}

export const textToSpeechService = {
  isAvailable() {
    return 'speechSynthesis' in window;
  },

  async getVoice() {
    if (_cachedVoice) return _cachedVoice;
    const voices = await loadVoices();
    _cachedVoice = pickBestFrenchVoice(voices);
    return _cachedVoice;
  },

  /** Returns list of available French voices (for debug / user picker) */
  async getFrenchVoices() {
    const voices = await loadVoices();
    return voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
  },

  async speak(text, options = {}) {
    return new Promise(async (resolve, reject) => {
      if (!this.isAvailable()) {
        reject('Text to speech not supported');
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang    = options.lang    ?? 'fr-FR';
      utterance.pitch   = options.pitch   ?? 1.05;   // légèrement plus aigu = féminin
      utterance.rate    = options.rate    ?? 0.95;   // légèrement plus lent = plus naturel
      utterance.volume  = options.volume  ?? 1;

      // Pick best voice
      const voice = await this.getVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => { if (options.onStart) options.onStart(); };
      utterance.onend   = () => { if (options.onEnd) options.onEnd(); resolve(); };
      utterance.onerror = (e) => {
        console.error('TTS error', e);
        // Don't reject on 'interrupted' — it's expected when we cancel
        if (e.error !== 'interrupted') reject(e);
        else resolve();
      };

      window.speechSynthesis.speak(utterance);

      // Chrome bug: long texts sometimes freeze. Keepalive workaround.
      const keepalive = setInterval(() => {
        if (!window.speechSynthesis.speaking) { clearInterval(keepalive); return; }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);

      utterance.onend = () => {
        clearInterval(keepalive);
        if (options.onEnd) options.onEnd();
        resolve();
      };
    });
  },

  stop()   { if (this.isAvailable()) window.speechSynthesis.cancel(); },
  pause()  { if (this.isAvailable()) window.speechSynthesis.pause(); },
  resume() { if (this.isAvailable()) window.speechSynthesis.resume(); },
};
