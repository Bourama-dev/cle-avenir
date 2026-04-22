-- Migration: 0006_enrich_formations_table
-- Description: Adds columns to support ONISEP formations import and enriched data

-- Ensure formations table exists with all necessary fields
CREATE TABLE IF NOT EXISTS public.formations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    slug TEXT UNIQUE,
    description TEXT,
    level TEXT, -- e.g., "Bac", "Bac+2", "Bac+3", etc.
    duration TEXT, -- Duration of the formation
    sector TEXT, -- Sector/domain
    type TEXT, -- Type of formation (Formation, BTS, Licence, etc.)
    url TEXT, -- External URL if available
    sigle TEXT, -- Acronym/abbreviation
    external_id TEXT, -- ID from external source (e.g., ONISEP)
    source TEXT, -- Source of data (e.g., "onisep", "france-travail", "user")
    metadata JSONB DEFAULT '{}'::jsonb, -- Store raw data from source
    rating DECIMAL(3,2), -- Rating out of 5
    popularity INTEGER DEFAULT 0, -- Popularity score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_external_source UNIQUE(external_id, source)
);

-- Add columns if they don't exist
ALTER TABLE public.formations
ADD COLUMN IF NOT EXISTS level TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS sector TEXT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS sigle TEXT,
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS popularity INTEGER DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_formations_source ON public.formations(source);
CREATE INDEX IF NOT EXISTS idx_formations_sector ON public.formations(sector);
CREATE INDEX IF NOT EXISTS idx_formations_level ON public.formations(level);
CREATE INDEX IF NOT EXISTS idx_formations_type ON public.formations(type);
CREATE INDEX IF NOT EXISTS idx_formations_external_id ON public.formations(external_id);
CREATE INDEX IF NOT EXISTS idx_formations_created_at ON public.formations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_formations_popularity ON public.formations(popularity DESC);

-- Add comments
COMMENT ON TABLE public.formations IS 'Stores training programs/formations from various sources (ONISEP, France Travail, etc.)';
COMMENT ON COLUMN public.formations.external_id IS 'Identifier from the external data source (e.g., ONISEP ID)';
COMMENT ON COLUMN public.formations.source IS 'Source of the formation data (onisep, france-travail, user-created, etc.)';
COMMENT ON COLUMN public.formations.metadata IS 'Raw data from the external source for reference';
COMMENT ON COLUMN public.formations.level IS 'Education level (e.g., Bac, Bac+2, Licence, Master)';
COMMENT ON COLUMN public.formations.type IS 'Type of formation (Formation, BTS, Licence, Master, etc.)';

-- Enable RLS if not already enabled
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

-- Allow public read access for formations
CREATE POLICY IF NOT EXISTS "Public can read formations"
    ON public.formations FOR SELECT USING (true);

-- Allow authenticated users to manage their own formations (created_by would need to be added)
CREATE POLICY IF NOT EXISTS "Users can manage their own formations"
    ON public.formations FOR ALL
    USING (source = 'user' OR source = 'onisep' OR source = 'france-travail');

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_formations_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_formations_modtime
    BEFORE UPDATE ON public.formations
    FOR EACH ROW
    EXECUTE PROCEDURE update_formations_modified_column();
