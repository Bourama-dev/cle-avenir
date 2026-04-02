-- Migration: 0004_metiers_table
-- Description: Creates advanced_metiers table with RIASEC scores and metadata for matching algorithm

CREATE TABLE IF NOT EXISTS public.advanced_metiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    sector TEXT,
    r_score INTEGER DEFAULT 0,
    i_score INTEGER DEFAULT 0,
    a_score INTEGER DEFAULT 0,
    s_score INTEGER DEFAULT 0,
    e_score INTEGER DEFAULT 0,
    c_score INTEGER DEFAULT 0,
    salary_min INTEGER,
    salary_max INTEGER,
    demand_level TEXT DEFAULT 'moyenne',
    growth_trend TEXT DEFAULT 'stable',
    hybrid_profiles TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_advanced_metiers_code ON public.advanced_metiers(code);
CREATE INDEX IF NOT EXISTS idx_advanced_metiers_name ON public.advanced_metiers(name);
CREATE INDEX IF NOT EXISTS idx_advanced_metiers_is_active ON public.advanced_metiers(is_active);

-- Insert sample data
INSERT INTO public.advanced_metiers (code, name, description, sector, r_score, i_score, a_score, s_score, e_score, c_score, salary_min, salary_max, demand_level, growth_trend, hybrid_profiles)
VALUES 
('J1102', 'Infirmier', 'Soins aux patients et accompagnement médical', 'Santé', 50, 60, 20, 90, 30, 40, 2000, 3000, 'très_élevée', 'croissant', ARRAY['S', 'I']),
('M1805', 'Développeur Web', 'Création et maintenance de sites et applications web', 'Informatique', 60, 85, 50, 20, 40, 70, 2500, 4500, 'élevée', 'croissant', ARRAY['I', 'C']),
('K1104', 'Psychologue', 'Écoute, analyse et accompagnement psychologique', 'Santé', 10, 80, 50, 95, 40, 30, 2000, 3500, 'moyenne', 'stable', ARRAY['S', 'I']),
('F1101', 'Architecte', 'Conception et supervision de la construction de bâtiments', 'BTP', 70, 75, 90, 30, 60, 50, 2500, 5000, 'moyenne', 'stable', ARRAY['A', 'I']),
('M1302', 'Entrepreneur', 'Création et gestion de projets d''entreprise', 'Business', 30, 70, 60, 50, 95, 40, 2000, 10000, 'élevée', 'croissant', ARRAY['E', 'I']),
('M1203', 'Comptable', 'Gestion des finances et de la comptabilité d''entreprise', 'Finance', 40, 60, 10, 30, 50, 95, 2200, 4000, 'élevée', 'stable', ARRAY['C', 'I'])
ON CONFLICT (code) DO NOTHING;