-- Migration: Add advanced matching columns to rome_metiers
-- Description: Enriches rome_metiers with structured data for advanced multi-level matching

ALTER TABLE public.rome_metiers 
ADD COLUMN IF NOT EXISTS riasec_profile JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS values JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS required_skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS domain TEXT,
ADD COLUMN IF NOT EXISTS salary_range JSONB DEFAULT '{"min": 0, "max": 0, "currency": "EUR"}'::jsonb,
ADD COLUMN IF NOT EXISTS job_market_demand INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS growth_rate INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS experience_required INTEGER DEFAULT 0;

-- Create indexes for new columns to speed up matching queries
CREATE INDEX IF NOT EXISTS idx_rome_metiers_domain ON public.rome_metiers(domain);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_riasec ON public.rome_metiers USING gin (riasec_profile);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_skills ON public.rome_metiers USING gin (required_skills);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_values ON public.rome_metiers USING gin (values);

-- Update comment on table
COMMENT ON TABLE public.rome_metiers IS 'Stores ROME occupations with enriched data for advanced RIASEC matching algorithm';

-- Add a comment to the riasec_profile column
COMMENT ON COLUMN public.rome_metiers.riasec_profile IS 'Object containing R, I, A, S, E, C scores from 0-100';