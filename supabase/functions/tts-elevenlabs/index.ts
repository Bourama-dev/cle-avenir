import { corsFor, getAuthedUser } from '../_shared/auth.ts';

const MAX_TEXT = 1000;

// High-quality French female voice (ElevenLabs built-in)
const DEFAULT_VOICE_ID = 'ThT5KcBeYPX3keUQqHPh'; // Sarah — natural French-compatible voice
const ALLOWED_VOICES = new Set([DEFAULT_VOICE_ID]); // frontend sends no voice_id
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';

Deno.serve(async (req) => {
  const CORS = corsFor(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const user = await getAuthedUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ElevenLabs not configured' }), {
      status: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, voice_id = DEFAULT_VOICE_ID } = await req.json();
    if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT) {
      return new Response(JSON.stringify({ error: 'Invalid text' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (typeof voice_id !== 'string' || !ALLOWED_VOICES.has(voice_id)) {
      return new Response(JSON.stringify({ error: 'Invalid voice' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(`${ELEVENLABS_API}/${voice_id}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          // Lower stability + higher style = more natural prosodic variation
          // (less flat/monotone "AI voice"); ElevenLabs' own guidance is that
          // stability near 1.0 sounds robotic, while ~0.35-0.45 keeps speech
          // coherent but expressive.
          stability: 0.4,
          similarity_boost: 0.85,
          style: 0.45,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[tts-elevenlabs] API error:', res.status, err);
      return new Response(JSON.stringify({ error: 'ElevenLabs API error' }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Return audio directly
    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        ...CORS,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[tts-elevenlabs] Error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
