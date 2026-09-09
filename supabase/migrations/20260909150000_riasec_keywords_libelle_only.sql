-- 20260909140000 fixed the "main"/"domaine" substring collision, but exposed
-- a second feedback loop: the synthesized description text ("... — un métier
-- du secteur Service & Social, accessible avec...") embeds the coarse domain
-- label, and words from that label (e.g. "service" in "Service & Social",
-- "gestion" in "Commerce & Gestion") match the very RIASEC keyword lists
-- they're fed into — so Astronome/Astrophysicien/Mathématicien picked up a
-- spurious Social signal from the word "Service" in their own generated
-- description, and Steward/Hôtesse de train picked up a spurious
-- Conventionnel signal from "Gestion" in "Commerce & Gestion".
--
-- Since non-curated jobs never had a real source description (it was empty,
-- hence the synthesized filler), feeding that filler back into keyword
-- matching is inherently circular. Base the keyword match on the job title
-- (libelle) only.

BEGIN;

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
  -- job_description is intentionally ignored: for non-curated jobs it is a
  -- synthesized filler derived from the coarse domain label, and feeding
  -- that back in creates a circular signal (see migration comment above).
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

UPDATE public.rome_metiers
SET
  riasec_profile = generate_riasec_profile(code, libelle, COALESCE(description, '')),
  updated_at = NOW()
WHERE adjusted_weights IS NULL;

COMMIT;
