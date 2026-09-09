-- Major finding while investigating job-matching data quality: rome_metiers
-- has had riasecmajeur/riasecmineur columns populated for 100% of the 1584
-- active jobs since the table's creation (0005_rome_metiers_table.sql) — a
-- real, well-distributed RIASEC classification (15+ major/minor combos,
-- 287 down to 19 occurrences, sanity-checked against dozens of jobs across
-- every domain: Comptable->C/E, Cariste->R/C, UX-UI Designer->A/E,
-- Aiguilleur du rail->C/R, Serveur->S/E, all textbook-correct). This was
-- never used: 0006_enrich_rome_metiers.sql instead built an independent
-- keyword+ROME-code-letter heuristic (generate_riasec_profile /
-- default_riasec_by_rome_code) that only 8 of 1584 jobs bypass via
-- hand-curated adjusted_weights. The heuristic is what all the previous
-- RIASEC data-quality migrations in this branch were patching.
--
-- This migration switches the fallback source to the curated columns:
-- riasec_profile is now built from riasecmajeur/riasecmineur (dominant
-- trait weighted heavily, secondary trait moderately) with the existing
-- per-job jitter still applied to break exact ties within a combo cluster.
-- The keyword+domain heuristic is kept as a safety-net fallback only for
-- the (currently zero) rows that might lack a riasecmajeur value.

BEGIN;

CREATE OR REPLACE FUNCTION riasec_profile_from_majeur_mineur(majeur TEXT, mineur TEXT)
RETURNS JSONB AS $$
DECLARE
  base JSONB := '{"R":5,"I":5,"A":5,"S":5,"E":5,"C":5}'::JSONB;
BEGIN
  IF majeur IS NULL OR majeur = '' OR majeur !~ '^[RIASEC]$' THEN
    RETURN NULL;
  END IF;
  base := jsonb_set(base, ARRAY[majeur], '55'::jsonb);
  IF mineur IS NOT NULL AND mineur <> '' AND mineur <> majeur AND mineur ~ '^[RIASEC]$' THEN
    base := jsonb_set(base, ARRAY[mineur], '30'::jsonb);
  END IF;
  RETURN base;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION compute_job_riasec_profile(
  job_code TEXT, job_libelle TEXT, job_description TEXT, job_majeur TEXT, job_mineur TEXT
)
RETURNS JSONB AS $$
DECLARE
  curated JSONB;
BEGIN
  curated := riasec_profile_from_majeur_mineur(job_majeur, job_mineur);
  IF curated IS NOT NULL THEN
    RETURN jitter_riasec(curated, job_code);
  END IF;
  -- Safety net for any job lacking a curated classification
  RETURN generate_riasec_profile(job_code, job_libelle, job_description);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

UPDATE public.rome_metiers
SET
  riasec_profile = compute_job_riasec_profile(code, libelle, COALESCE(description, ''), riasecmajeur, riasecmineur),
  updated_at = NOW()
WHERE adjusted_weights IS NULL;

COMMIT;
