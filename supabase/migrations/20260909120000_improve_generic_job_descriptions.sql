-- The generic fallback set by 0006_enrich_rome_metiers.sql ("<libelle> -
-- Professionnel spécialisé dans ce domaine") is uninformative boilerplate
-- that renders identically on every job card without curated content.
-- Replace it with a fallback that at least surfaces the domain and required
-- education level we already infer, so the description carries real signal.

UPDATE public.rome_metiers
SET
  description = TRIM(
    libelle || ' — un métier du secteur ' ||
    COALESCE(NULLIF(domain, ''), 'professionnel') ||
    CASE
      WHEN niveau_etudes IS NOT NULL AND niveau_etudes <> ''
        THEN ', accessible avec un niveau ' || niveau_etudes || '.'
      ELSE '.'
    END
  ),
  updated_at = NOW()
WHERE description = libelle || ' - Professionnel spécialisé dans ce domaine';
