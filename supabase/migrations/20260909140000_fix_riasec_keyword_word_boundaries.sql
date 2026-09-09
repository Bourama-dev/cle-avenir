-- Two follow-up problems found while validating 20260909130000:
--
-- 1) 20260909120000_improve_generic_job_descriptions.sql (which replaces the
--    "<job> - Professionnel spécialisé dans ce domaine" placeholder) was
--    committed but never actually applied to this database, so descriptions
--    still contained the word "domaine".
-- 2) generate_riasec_profile()'s keyword regexes used bare substrings
--    (e.g. 'main' for Réaliste) with no word boundaries, so "domaine"
--    silently matched 'main' and injected a spurious Réaliste signal into
--    almost every job that still had the placeholder description — which,
--    combined with (1), meant most of the 903 jobs fixed by the previous
--    migration got a false, systematic R boost undermining the fix.
--
-- This migration applies the pending description fix, rewrites the keyword
-- matching with word boundaries (\y) so no keyword can match as a substring
-- of an unrelated word, and regenerates riasec_profile for every job whose
-- profile isn't a manually curated one (those set adjusted_weights, which
-- the app already prefers over riasec_profile, so regenerating the latter
-- for them is harmless).

BEGIN;

-- 1) Apply the previously-pending description fix
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

-- 2) Rewrite generate_riasec_profile with word-boundary-safe keyword matching
CREATE OR REPLACE FUNCTION generate_riasec_profile(job_code TEXT, job_libelle TEXT, job_description TEXT)
RETURNS JSONB AS $$
DECLARE
  text_to_analyze TEXT;
  r_score INT := 0;
  i_score INT := 0;
  a_score INT := 0;
  s_score INT := 0;
  e_score INT := 0;
  c_score INT := 0;
  total_matches INT := 0;
BEGIN
  text_to_analyze := LOWER(COALESCE(job_libelle, '') || ' ' || COALESCE(job_description, ''));

  IF text_to_analyze ~ '\y(manuel|main|mécanicien|construction|ouvrier|technique|réparation|électricien|plomberie|bâtiment|chantier|travaux|conducteur|conductrice|livreur|livreuse|chauffeur|transport)\y' THEN
    r_score := r_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ '\y(recherche|analyse|scientifique|informatique|développeur|programmation|data|ingénieur|système|réseau|code|logiciel|algorithme|mathémati\w*|physi\w*|astro\w*|chimi\w*|biolog\w*|laboratoire|chercheur)\y' THEN
    i_score := i_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ '\y(design|créatif|art|dessin|graphique|musique|création|artiste|animation|web|visual|esthétique|photographe|illustrat\w*|scénograph\w*|décor|costume|spectacle)\y' THEN
    a_score := a_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ '\y(social|aide|soin|santé|infirmier|coach|accompagnement|éducation|travail social|communication|relation|service|client|personne|interaction|steward|hôtesse|hôte|accueil|voyageur)\y' THEN
    s_score := s_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ '\y(vente|commercial|entrepreneuriat|direction|manager|leadership|négociation|business|chef|responsable|directeur|client)\y' THEN
    e_score := e_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ '\y(organisation|administratif|comptabilité|gestion|réglementation|contrôle|respect|ordre|administration|procédure|processus)\y' THEN
    c_score := c_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF total_matches = 0 THEN
    RETURN default_riasec_by_rome_code(job_code);
  ELSE
    RETURN jsonb_build_object(
      'R', ROUND(r_score::NUMERIC / total_matches * 100)::INT,
      'I', ROUND(i_score::NUMERIC / total_matches * 100)::INT,
      'A', ROUND(a_score::NUMERIC / total_matches * 100)::INT,
      'S', ROUND(s_score::NUMERIC / total_matches * 100)::INT,
      'E', ROUND(e_score::NUMERIC / total_matches * 100)::INT,
      'C', ROUND(c_score::NUMERIC / total_matches * 100)::INT
    );
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3) Regenerate riasec_profile for every non-curated job (curated jobs carry
--    adjusted_weights, which the app already prefers, so this is harmless for them)
UPDATE public.rome_metiers
SET
  riasec_profile = generate_riasec_profile(code, libelle, COALESCE(description, '')),
  updated_at = NOW()
WHERE adjusted_weights IS NULL;

COMMIT;
