-- Migration: 0005_rome_metiers_table
-- Description: Creates rome_metiers table with all necessary fields for ROME data synchronization

CREATE TABLE IF NOT EXISTS public.rome_metiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    libelle TEXT NOT NULL,
    description TEXT,
    definition TEXT,
    riasecMajeur TEXT,
    riasecMineur TEXT,
    adjusted_weights JSONB,
    riasec_vector JSONB,
    debouches TEXT,
    salaire TEXT,
    niveau_etudes TEXT,
    -- Enriched fields from migrations
    riasec_profile JSONB DEFAULT '{}'::jsonb,
    values JSONB DEFAULT '[]'::jsonb,
    required_skills JSONB DEFAULT '[]'::jsonb,
    domain TEXT,
    salary_range JSONB DEFAULT '{"min": 0, "max": 0, "currency": "EUR"}'::jsonb,
    job_market_demand INTEGER DEFAULT 50,
    growth_rate INTEGER DEFAULT 0,
    experience_required INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rome_metiers_code ON public.rome_metiers(code);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_libelle ON public.rome_metiers(libelle);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_is_active ON public.rome_metiers(is_active);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_domain ON public.rome_metiers(domain);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_riasec ON public.rome_metiers USING gin (riasec_profile);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_skills ON public.rome_metiers USING gin (required_skills);
CREATE INDEX IF NOT EXISTS idx_rome_metiers_values ON public.rome_metiers USING gin (values);

-- Add comments
COMMENT ON TABLE public.rome_metiers IS 'ROME occupations data synchronized from France Travail API - contains all French job occupations with RIASEC matching data';
COMMENT ON COLUMN public.rome_metiers.code IS 'Unique ROME code identifier (e.g. M1805)';
COMMENT ON COLUMN public.rome_metiers.libelle IS 'Official job title from ROME nomenclature';
COMMENT ON COLUMN public.rome_metiers.riasecMajeur IS 'Primary RIASEC profile character';
COMMENT ON COLUMN public.rome_metiers.riasecMineur IS 'Secondary RIASEC profile character';

-- Enable RLS if needed
ALTER TABLE public.rome_metiers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read rome_metiers" ON public.rome_metiers FOR SELECT USING (true);
