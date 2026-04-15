import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Fetches a legal document from the database by its slug.
 * Falls back to null if not found (pages use their hardcoded JSX fallback).
 */
export function useLegalDocument(slug) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('legal_documents')
          .select('content, created_at')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();
        if (!cancelled) setContent(data ?? null);
      } catch {
        if (!cancelled) setContent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [slug]);

  return { content, loading };
}
