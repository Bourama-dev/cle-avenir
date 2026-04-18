import { supabase } from '@/lib/customSupabaseClient';

/**
 * TTS Service — Priority order:
 *  1. ElevenLabs via Supabase Edge Function (ultra-realistic, needs ELEVENLABS_API_KEY)
 *  2. Web Speech API with best French voice (Google neural in Chrome)
 */

// ── ElevenLabs ──────────────────────────────────────────────────────────────
let _elevenLabsAvailable = null; // null = not yet tested

async function tryElevenLabs(text, onEnd) {
  try {
    // Use fetch directly to get raw binary audio (supabase.functions.invoke parses JSON by default)
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabase.supabaseUrl;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabase.supabaseKey;

    const res = await fetch(`${supabaseUrl}/functions/v1/tts-elevenlabs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      _elevenLabsAvailable = false;
      return false;
    }

    const arrayBuffer = await res.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      _elevenLabsAvailable = false;
      return false;
    }

    // data is an ArrayBuffer from the edge function
    const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    _currentAudio = audio;

    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        _currentAudio = null;
        if (onEnd) onEnd();
        resolve(true);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        _currentAudio = null;
        _elevenLabsAvailable = false;
        resolve(false);
      };
      audio.play().catch(() => {
        _elevenLabsAvailable = false;
        resolve(false);
      });
    });
  } catch {
    _elevenLabsAvailable = false;
    return false;
  }
}

// ── Web Speech API ───────────────────────────────────────────────────────────

const FEMALE_NAME_HINTS = [
  'hortense', 'julie', 'denise', 'amélie', 'pauline',
  'claire', 'marie', 'elsa', 'emma', 'sophie', 'léa',
  'female', 'femme', 'woman',
];

function pickBestFrenchVoice(voices) {
  const fr = voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
  if (!fr.length) return null;
  const google = fr.find(v => v.name.toLowerCase().includes('google'));
  if (google) return google;
  const msNeural = fr.find(v =>
    v.name.toLowerCase().includes('microsoft') &&
    (v.name.toLowerCase().includes('neural') || v.name.toLowerCase().includes('online'))
  );
  if (msNeural) return msNeural;
  const msFemale = fr.find(v => {
    const lc = v.name.toLowerCase();
    return lc.includes('microsoft') && FEMALE_NAME_HINTS.some(h => lc.includes(h));
  });
  if (msFemale) return msFemale;
  const femaleHint = fr.find(v => FEMALE_NAME_HINTS.some(h => v.name.toLowerCase().includes(h)));
  if (femaleHint) return femaleHint;
  return fr[0];
}

let _cachedVoice = null;
let _voicesLoaded = false;
let _currentAudio = null;

function loadVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { _voicesLoaded = true; resolve(voices); return; }
    window.speechSynthesis.onvoiceschanged = () => {
      const v = window.speechSynthesis.getVoices();
      _voicesLoaded = true;
      resolve(v);
    };
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000);
  });
}

export const textToSpeechService = {
  isAvailable() {
    return 'speechSynthesis' in window || true; // always available (ElevenLabs or Web Speech)
  },

  async getVoice() {
    if (_cachedVoice) return _cachedVoice;
    const voices = await loadVoices();
    _cachedVoice = pickBestFrenchVoice(voices);
    return _cachedVoice;
  },

  async getFrenchVoices() {
    const voices = await loadVoices();
    return voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
  },

  async speak(text, options = {}) {
    if (!text?.trim()) return;

    if (options.onStart) options.onStart();

    // 1. Try ElevenLabs (ultra-realistic)
    if (_elevenLabsAvailable !== false) {
      const success = await tryElevenLabs(text, options.onEnd);
      if (success) return;
    }

    // 2. Fallback: Web Speech API
    return new Promise(async (resolve, reject) => {
      if (!('speechSynthesis' in window)) { if (options.onEnd) options.onEnd(); resolve(); return; }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang    = options.lang    ?? 'fr-FR';
      utterance.pitch   = options.pitch   ?? 1.05;
      utterance.rate    = options.rate    ?? 0.95;
      utterance.volume  = options.volume  ?? 1;

      const voice = await this.getVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => { if (options.onEnd) options.onEnd(); resolve(); };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') reject(e); else resolve();
      };

      window.speechSynthesis.speak(utterance);

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

  stop() {
    // Stop ElevenLabs audio if playing
    if (_currentAudio) {
      _currentAudio.pause();
      _currentAudio.currentTime = 0;
      _currentAudio = null;
    }
    // Stop Web Speech API
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  },

  pause()  { if ('speechSynthesis' in window) window.speechSynthesis.pause(); },
  resume() { if ('speechSynthesis' in window) window.speechSynthesis.resume(); },
};
