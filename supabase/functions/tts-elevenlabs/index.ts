const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

// High-quality French female voice (ElevenLabs built-in)
const DEFAULT_VOICE_ID = 'ThT5KcBeYPX3keUQqHPh'; // Sarah — natural French-compatible voice
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1/text-to-speech';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ElevenLabs not configured' }), {
      status: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, voice_id = DEFAULT_VOICE_ID } = await req.json();
    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing text' }), {
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
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[tts-elevenlabs] API error:', res.status, err);
      return new Response(JSON.stringify({ error: 'ElevenLabs API error' }), {
        status: res.status,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Return audio directly
    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        ...CORS,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
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
