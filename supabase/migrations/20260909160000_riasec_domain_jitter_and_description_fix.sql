-- Two more issues found on a third round of live testing:
--
-- 1) Jobs that fall back to the same ROME-code-family default (e.g. every
--    unmatched "I%" — Installation et maintenance — job) still share the
--    *exact same* riasec_profile, so for a user profile that happens to
--    align with that shared default, all of them score identically (e.g.
--    92% for six different maintenance/technicien jobs). The per-domain
--    fallback from 20260909130000 shrank the tied clusters (903 -> a few
--    hundred at most) but didn't eliminate exact ties within one domain.
--    Fix: apply a small, deterministic per-job jitter (derived from the
--    job code, so it's stable across regenerations) on top of the domain
--    baseline, breaking ties while staying anchored to the right sector.
--
-- 2) infer_domain() returns the literal string 'Secteur professionnel' as
--    its catch-all default, and the description generator from
--    20260909120000/140000 wraps it as "... métier du secteur {domain}...",
--    producing "... métier du secteur Secteur professionnel." for every job
--    that hit that catch-all. Fix: phrase the fallback without repeating
--    "secteur".

BEGIN;

CREATE OR REPLACE FUNCTION jitter_riasec(base JSONB, seed TEXT)
RETURNS JSONB AS $$
DECLARE
  h BIGINT := ('x' || substr(md5(COALESCE(seed, '')), 1, 8))::bit(32)::bigint;
BEGIN
  RETURN jsonb_build_object(
    'R', GREATEST(0, (base->>'R')::int + ((h % 9) - 4)),
    'I', GREATEST(0, (base->>'I')::int + (((h / 9) % 9) - 4)),
    'A', GREATEST(0, (base->>'A')::int + (((h / 81) % 9) - 4)),
    'S', GREATEST(0, (base->>'S')::int + (((h / 729) % 9) - 4)),
    'E', GREATEST(0, (base->>'E')::int + (((h / 6561) % 9) - 4)),
    'C', GREATEST(0, (base->>'C')::int + (((h / 59049) % 9) - 4))
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

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
  text_to_analyze := LOWER(COALESCE(job_libelle, ''));

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
    RETURN jitter_riasec(default_riasec_by_rome_code(job_code), job_code);
  ELSE
    RETURN jitter_riasec(
      jsonb_build_object(
        'R', ROUND(r_score::NUMERIC / total_matches * 100)::INT,
        'I', ROUND(i_score::NUMERIC / total_matches * 100)::INT,
        'A', ROUND(a_score::NUMERIC / total_matches * 100)::INT,
        'S', ROUND(s_score::NUMERIC / total_matches * 100)::INT,
        'E', ROUND(e_score::NUMERIC / total_matches * 100)::INT,
        'C', ROUND(c_score::NUMERIC / total_matches * 100)::INT
      ),
      job_code
    );
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Regenerate riasec_profile for every non-curated job with the jittered version
UPDATE public.rome_metiers
SET
  riasec_profile = generate_riasec_profile(code, libelle, COALESCE(description, '')),
  updated_at = NOW()
WHERE adjusted_weights IS NULL;

-- Fix the "... métier du secteur Secteur professionnel." duplication
UPDATE public.rome_metiers
SET
  description = TRIM(libelle) ||
    CASE
      WHEN niveau_etudes IS NOT NULL AND niveau_etudes <> ''
        THEN ' — un métier accessible avec un niveau ' || niveau_etudes || '.'
      ELSE ' — un métier professionnel.'
    END,
  updated_at = NOW()
WHERE domain = 'Secteur professionnel'
  AND description LIKE '%métier du secteur Secteur professionnel%';

COMMIT;
