-- 0006_enrich_rome_metiers.sql's generate_riasec_profile() falls back to the
-- exact same flat vector {"R":16,"I":16,"A":17,"S":17,"E":17,"C":17} whenever
-- a job's libelle/description doesn't hit any of its (narrow) keyword lists.
-- That hit 903 of 1584 jobs (57%) — including very different professions like
-- "Astronome", "Mathématicien", "Scénographe", "Steward / Hôtesse de train"
-- and "Conducteur livreur installateur". A near-uniform vector scores high
-- under cosine similarity against almost any user profile, so these jobs
-- always rank near the top and are indistinguishable from each other,
-- regardless of the user's actual RIASEC profile. Fix: widen the keyword
-- coverage, and replace the single universal fallback with a profile derived
-- from the job's ROME code family (which we already use for domain/education
-- inference), so unmatched jobs at least get a varied, sector-appropriate
-- default instead of an identical flat one.

BEGIN;

CREATE OR REPLACE FUNCTION default_riasec_by_rome_code(job_code TEXT)
RETURNS JSONB AS $$
DECLARE
  prefix2 TEXT := LEFT(COALESCE(job_code, ''), 2);
  prefix1 TEXT := LEFT(COALESCE(job_code, ''), 1);
BEGIN
  -- Subgroups that would be mis-classified by their top-level ROME letter alone
  IF prefix2 = 'K2' THEN -- Recherche (ex: Astronome, Mathématicien, Astrophysicien)
    RETURN '{"R":5,"I":55,"A":15,"S":10,"E":5,"C":10}'::JSONB;
  END IF;
  IF prefix2 = 'M18' THEN -- Informatique
    RETURN '{"R":5,"I":50,"A":10,"S":5,"E":10,"C":20}'::JSONB;
  END IF;
  IF prefix2 = 'M17' THEN -- Direction d'entreprise
    RETURN '{"R":5,"I":10,"A":5,"S":15,"E":50,"C":15}'::JSONB;
  END IF;

  RETURN CASE prefix1
    WHEN 'A' THEN '{"R":50,"I":25,"A":5,"S":5,"E":5,"C":10}'::JSONB   -- Agriculture, pêche, espaces naturels
    WHEN 'B' THEN '{"R":30,"I":10,"A":45,"S":5,"E":5,"C":5}'::JSONB   -- Arts et façonnage d'ouvrages d'art
    WHEN 'C' THEN '{"R":5,"I":10,"A":5,"S":10,"E":25,"C":45}'::JSONB  -- Banque, assurance, immobilier
    WHEN 'D' THEN '{"R":5,"I":5,"A":10,"S":25,"E":45,"C":10}'::JSONB  -- Commerce, vente, distribution
    WHEN 'E' THEN '{"R":5,"I":10,"A":45,"S":10,"E":25,"C":5}'::JSONB  -- Communication, media, multimédia
    WHEN 'F' THEN '{"R":50,"I":10,"A":5,"S":5,"E":5,"C":25}'::JSONB   -- Bâtiment, travaux publics
    WHEN 'G' THEN '{"R":5,"I":5,"A":10,"S":45,"E":25,"C":10}'::JSONB  -- Hôtellerie-restauration, tourisme, loisirs
    WHEN 'H' THEN '{"R":50,"I":10,"A":5,"S":5,"E":5,"C":25}'::JSONB   -- Industrie
    WHEN 'I' THEN '{"R":50,"I":25,"A":5,"S":5,"E":5,"C":10}'::JSONB   -- Installation et maintenance
    WHEN 'J' THEN '{"R":5,"I":25,"A":5,"S":50,"E":5,"C":10}'::JSONB   -- Santé
    WHEN 'K' THEN '{"R":5,"I":10,"A":5,"S":45,"E":10,"C":25}'::JSONB  -- Services à la personne et à la collectivité
    WHEN 'L' THEN '{"R":5,"I":5,"A":50,"S":25,"E":10,"C":5}'::JSONB   -- Spectacle
    WHEN 'M' THEN '{"R":5,"I":15,"A":5,"S":10,"E":30,"C":35}'::JSONB  -- Support à l'entreprise
    WHEN 'N' THEN '{"R":45,"I":5,"A":5,"S":10,"E":10,"C":25}'::JSONB  -- Transport et logistique
    ELSE '{"R":16,"I":16,"A":17,"S":17,"E":17,"C":17}'::JSONB
  END;
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
  text_to_analyze := LOWER(COALESCE(job_libelle, '') || ' ' || COALESCE(job_description, ''));

  IF text_to_analyze ~ 'manuel|main|mécanicien|construction|ouvrier|technique|réparation|électricien|plomberie|bâtiment|chantier|travaux|conducteur|conductrice|livreur|livreuse|chauffeur|transport' THEN
    r_score := r_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ 'recherche|analyse|scientifique|informatique|développeur|programmation|data|ingénieur|système|réseau|code|logiciel|algorithme|mathémati|physi|astro|chimi|biolog|laboratoire|chercheur' THEN
    i_score := i_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ 'design|créatif|art|dessin|graphique|musique|création|artiste|animation|web|visual|esthétique|photographe|illustrat|scénograph|décor|costume|spectacle' THEN
    a_score := a_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ 'social|aide|soin|santé|infirmier|coach|accompagnement|éducation|travail social|communication|relation|service|client|personne|interaction|steward|hôtesse|hôte|accueil|voyageur' THEN
    s_score := s_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ 'vente|commercial|entrepreneuriat|direction|manager|leadership|négociation|business|chef|responsable|directeur|client' THEN
    e_score := e_score + 1;
    total_matches := total_matches + 1;
  END IF;

  IF text_to_analyze ~ 'organisation|administratif|comptabilité|gestion|réglementation|contrôle|respect|ordre|administration|procédure|processus' THEN
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

-- Re-generate riasec_profile only for rows still stuck on the old universal
-- flat fallback (curated / already-differentiated rows are left untouched).
UPDATE public.rome_metiers
SET
  riasec_profile = generate_riasec_profile(code, libelle, COALESCE(description, '')),
  updated_at = NOW()
WHERE riasec_profile = '{"R": 16, "I": 16, "A": 17, "S": 17, "E": 17, "C": 17}'::jsonb;

COMMIT;
