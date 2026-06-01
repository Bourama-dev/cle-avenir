-- Migration: 0006_enrich_rome_metiers
-- Description: Populate enrichment data for rome_metiers table with RIASEC profiles, salary, education levels, skills, and domains

BEGIN;

-- Function to generate basic RIASEC profile based on job keywords
CREATE OR REPLACE FUNCTION generate_riasec_profile(job_libelle TEXT, job_description TEXT)
RETURNS JSONB AS $$
DECLARE
  text_to_analyze TEXT;
  profile JSONB := '{"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}'::JSONB;
  r_score INT := 0;
  i_score INT := 0;
  a_score INT := 0;
  s_score INT := 0;
  e_score INT := 0;
  c_score INT := 0;
  total_matches INT := 0;
BEGIN
  text_to_analyze := LOWER(COALESCE(job_libelle, '') || ' ' || COALESCE(job_description, ''));

  -- Count R (Realistic) keywords
  IF text_to_analyze ~ 'manuel|main|mécanicien|construction|ouvrier|technique|réparation|électricien|plomberie|bâtiment|chantier|travaux' THEN
    r_score := r_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Count I (Investigative) keywords
  IF text_to_analyze ~ 'recherche|analyse|scientifique|informatique|développeur|programmation|data|ingénieur|système|réseau|code|logiciel|algorithme' THEN
    i_score := i_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Count A (Artistic) keywords
  IF text_to_analyze ~ 'design|créatif|art|dessin|graphique|musique|création|artiste|animation|web|visual|esthétique|photographe|illustrat' THEN
    a_score := a_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Count S (Social) keywords
  IF text_to_analyze ~ 'social|aide|soin|santé|infirmier|coach|accompagnement|éducation|travail social|communication|relation|service|client|personne|interaction' THEN
    s_score := s_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Count E (Enterprising) keywords
  IF text_to_analyze ~ 'vente|commercial|entrepreneuriat|direction|manager|leadership|négociation|business|chef|responsable|directeur|client' THEN
    e_score := e_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Count C (Conscientious) keywords
  IF text_to_analyze ~ 'organisation|administratif|comptabilité|gestion|réglementation|contrôle|respect|ordre|administration|procédure|processus' THEN
    c_score := c_score + 1;
    total_matches := total_matches + 1;
  END IF;

  -- Normalize to 100 if we have matches, otherwise return balanced profile
  IF total_matches = 0 THEN
    RETURN '{"R": 16, "I": 16, "A": 17, "S": 17, "E": 17, "C": 17}'::JSONB;
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

-- Function to extract education level from code pattern
CREATE OR REPLACE FUNCTION infer_education_level(job_code TEXT, job_libelle TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Technology codes typically require Bac+2/Bac+3
  IF job_code LIKE 'M18%' OR job_code LIKE 'M11%' THEN
    RETURN 'Bac+2 à Bac+3';
  END IF;

  -- Health/Medical codes typically require Bac+2/Bac+3
  IF job_code LIKE 'J%' THEN
    RETURN 'Bac+2 à Bac+3';
  END IF;

  -- Legal/Law codes require Master/higher
  IF job_code LIKE 'K19%' THEN
    RETURN 'Bac+5 (Master)';
  END IF;

  -- Education codes typically require Master
  IF job_libelle ILIKE '%professeur%' OR job_libelle ILIKE '%enseignant%' THEN
    RETURN 'Master';
  END IF;

  -- Management typically requires Bac+2 minimum
  IF job_libelle ILIKE '%manager%' OR job_libelle ILIKE '%directeur%' THEN
    RETURN 'Bac+2 à Bac+3';
  END IF;

  -- Default for technical/trades
  IF job_code LIKE 'F%' OR job_code LIKE 'H%' THEN
    RETURN 'CAP/BEP à Bac Pro';
  END IF;

  -- General default
  RETURN 'CAP/BEP à Bac+2';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to infer domain from code and keywords
CREATE OR REPLACE FUNCTION infer_domain(job_code TEXT, job_libelle TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Technology domain
  IF job_code LIKE 'M18%' OR job_code LIKE 'M11%' OR job_libelle ILIKE '%informatique%' OR job_libelle ILIKE '%développeur%' OR job_libelle ILIKE '%système%' OR job_libelle ILIKE '%réseau%' THEN
    RETURN 'Technologie & Digital';
  END IF;

  -- Health domain
  IF job_code LIKE 'J%' OR job_libelle ILIKE '%infirmier%' OR job_libelle ILIKE '%santé%' OR job_libelle ILIKE '%médecin%' THEN
    RETURN 'Santé & Soin';
  END IF;

  -- Business/Commerce domain
  IF job_code LIKE 'D%' OR job_code LIKE 'G%' OR job_libelle ILIKE '%commercial%' OR job_libelle ILIKE '%vente%' OR job_libelle ILIKE '%manager%' OR job_libelle ILIKE '%comptable%' THEN
    RETURN 'Commerce & Gestion';
  END IF;

  -- Construction domain
  IF job_code LIKE 'F%' OR job_libelle ILIKE '%construction%' OR job_libelle ILIKE '%bâtiment%' OR job_libelle ILIKE '%maçon%' OR job_libelle ILIKE '%charpent%' THEN
    RETURN 'Construction & BTP';
  END IF;

  -- Arts/Creative domain
  IF job_code LIKE 'E%' OR job_code LIKE 'L%' OR job_libelle ILIKE '%design%' OR job_libelle ILIKE '%graphique%' OR job_libelle ILIKE '%créat%' OR job_libelle ILIKE '%artist%' THEN
    RETURN 'Arts & Création';
  END IF;

  -- Service/Social domain
  IF job_code LIKE 'K%' OR job_libelle ILIKE '%social%' OR job_libelle ILIKE '%éducateur%' OR job_libelle ILIKE '%assistant%' THEN
    RETURN 'Service & Social';
  END IF;

  -- Manufacturing/Industrial domain
  IF job_code LIKE 'H%' THEN
    RETURN 'Production & Industrie';
  END IF;

  -- Default
  RETURN 'Secteur professionnel';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update rome_metiers with enrichment data
UPDATE public.rome_metiers
SET
  -- Generate basic RIASEC profiles for all jobs
  riasec_profile = generate_riasec_profile(libelle, COALESCE(description, '')),

  -- Set basic salary range (will be overridden for known jobs)
  salary_range = jsonb_build_object(
    'min', 23000,
    'max', 45000,
    'currency', 'EUR'
  ),

  -- Set job market demand based on domain
  job_market_demand = CASE
    WHEN libelle ILIKE '%informatique%' OR libelle ILIKE '%développeur%' OR libelle ILIKE '%infirmier%' THEN 75
    WHEN libelle ILIKE '%engineer%' OR libelle ILIKE '%data%' OR libelle ILIKE '%santé%' THEN 70
    ELSE 50
  END,

  -- Infer education level
  niveau_etudes = infer_education_level(code, libelle),

  -- Infer domain
  domain = infer_domain(code, libelle),

  -- Set required skills (basic)
  required_skills = jsonb_build_array('Communication', 'Organisation'),

  -- Set description if missing (use libelle as fallback)
  description = COALESCE(NULLIF(description, ''), libelle || ' - Professionnel spécialisé dans ce domaine'),

  -- Mark as active
  is_active = TRUE,

  -- Update timestamp
  updated_at = NOW()
WHERE is_active IS NULL OR is_active = FALSE OR riasec_profile = '{}'::JSONB;

-- Now update specific jobs with manually curated enrichment data
-- M1805 - Développeur Informatique
UPDATE public.rome_metiers
SET
  libelle = 'Développeur Informatique',
  description = 'Conçoit et programme des applications, sites web ou logiciels selon les besoins des utilisateurs.',
  riasec_profile = '{"R": 20, "I": 90, "A": 60, "S": 30, "E": 50, "C": 80}'::JSONB,
  riasecmajeur = 'I',
  riasecmineur = 'A',
  adjusted_weights = '{"R": 20, "I": 90, "A": 60, "S": 30, "E": 50, "C": 80}'::JSONB,
  salaire = '35k€ - 65k€',
  salary_range = '{"min": 35000, "max": 65000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+3 à Bac+5',
  debouches = 'Très Élevée',
  domain = 'Technologie & Digital',
  job_market_demand = 85,
  growth_rate = 12,
  required_skills = '["Programmation", "Analyse", "Problem-solving", "Communication écrite"]'::JSONB,
  updated_at = NOW()
WHERE code = 'M1805';

-- M1801 - Administrateur Systèmes et Réseaux
UPDATE public.rome_metiers
SET
  libelle = 'Administrateur Systèmes et Réseaux',
  description = 'Gère et maintient l\'infrastructure informatique et les réseaux de l\'entreprise pour garantir leur bon fonctionnement.',
  riasec_profile = '{"R": 40, "I": 80, "A": 20, "S": 30, "E": 40, "C": 90}'::JSONB,
  riasecmajeur = 'I',
  riasecmineur = 'C',
  adjusted_weights = '{"R": 40, "I": 80, "A": 20, "S": 30, "E": 40, "C": 90}'::JSONB,
  salaire = '30k€ - 55k€',
  salary_range = '{"min": 30000, "max": 55000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+2 à Bac+5',
  debouches = 'Élevée',
  domain = 'Technologie & Digital',
  job_market_demand = 75,
  growth_rate = 8,
  required_skills = '["Administration systèmes", "Réseaux", "Sécurité IT", "Rigueur"]'::JSONB,
  updated_at = NOW()
WHERE code = 'M1801';

-- J1506 - Infirmier
UPDATE public.rome_metiers
SET
  libelle = 'Infirmier en Soins Généraux',
  description = 'Dispense des soins de nature préventive, curative ou palliative pour promouvoir la santé des patients.',
  riasec_profile = '{"R": 70, "I": 60, "A": 20, "S": 95, "E": 40, "C": 60}'::JSONB,
  riasecmajeur = 'S',
  riasecmineur = 'R',
  adjusted_weights = '{"R": 70, "I": 60, "A": 20, "S": 95, "E": 40, "C": 60}'::JSONB,
  salaire = '25k€ - 45k€',
  salary_range = '{"min": 25000, "max": 45000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+3 (DE)',
  debouches = 'Critique',
  domain = 'Santé & Soin',
  job_market_demand = 95,
  growth_rate = 15,
  required_skills = '["Soins médicaux", "Empathie", "Relation patient", "Rigueur"]'::JSONB,
  updated_at = NOW()
WHERE code = 'J1506';

-- D1401 - Commercial
UPDATE public.rome_metiers
SET
  libelle = 'Commercial / Attaché Commercial',
  description = 'Développe le chiffre d\'affaires en proposant des produits ou services à des clients ou prospects.',
  riasec_profile = '{"R": 30, "I": 40, "A": 30, "S": 70, "E": 95, "C": 50}'::JSONB,
  riasecmajeur = 'E',
  riasecmineur = 'S',
  adjusted_weights = '{"R": 30, "I": 40, "A": 30, "S": 70, "E": 95, "C": 50}'::JSONB,
  salaire = '25k€ - 60k€',
  salary_range = '{"min": 25000, "max": 60000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+2',
  debouches = 'Très Élevée',
  domain = 'Commerce & Gestion',
  job_market_demand = 80,
  growth_rate = 6,
  required_skills = '["Vente", "Négociation", "Relation client", "Communication"]'::JSONB,
  updated_at = NOW()
WHERE code = 'D1401';

-- M1203 - Comptable
UPDATE public.rome_metiers
SET
  libelle = 'Comptable / Expert Comptable',
  description = 'Enregistre et centralise les données commerciales, industrielles ou financières.',
  riasec_profile = '{"R": 10, "I": 60, "A": 10, "S": 30, "E": 70, "C": 95}'::JSONB,
  riasecmajeur = 'C',
  riasecmineur = 'I',
  adjusted_weights = '{"R": 10, "I": 60, "A": 10, "S": 30, "E": 70, "C": 95}'::JSONB,
  salaire = '28k€ - 50k€',
  salary_range = '{"min": 28000, "max": 50000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+2 à Bac+5',
  debouches = 'Très Forte',
  domain = 'Commerce & Gestion',
  job_market_demand = 75,
  growth_rate = 4,
  required_skills = '["Comptabilité", "Finance", "Rigueur", "Organisation"]'::JSONB,
  updated_at = NOW()
WHERE code = 'M1203';

-- E1104 - Designer Web
UPDATE public.rome_metiers
SET
  libelle = 'Designer Web / UI Designer',
  description = 'Imagine et réalise l\'identité visuelle de sites internet et d\'interfaces digitales.',
  riasec_profile = '{"R": 20, "I": 50, "A": 90, "S": 40, "E": 60, "C": 40}'::JSONB,
  riasecmajeur = 'A',
  riasecmineur = 'I',
  adjusted_weights = '{"R": 20, "I": 50, "A": 90, "S": 40, "E": 60, "C": 40}'::JSONB,
  salaire = '28k€ - 50k€',
  salary_range = '{"min": 28000, "max": 50000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+3',
  debouches = 'Moyenne',
  domain = 'Arts & Création',
  job_market_demand = 70,
  growth_rate = 10,
  required_skills = '["Design Web", "UI/UX", "Créativité", "Communication visuelle"]'::JSONB,
  updated_at = NOW()
WHERE code = 'E1104';

-- F1601 - Maçon
UPDATE public.rome_metiers
SET
  libelle = 'Maçon / Chef de chantier',
  description = 'Réalise le gros œuvre des bâtiments et gère l\'avancement des constructions sur le terrain.',
  riasec_profile = '{"R": 95, "I": 40, "A": 30, "S": 30, "E": 60, "C": 50}'::JSONB,
  riasecmajeur = 'R',
  riasecmineur = 'E',
  adjusted_weights = '{"R": 95, "I": 40, "A": 30, "S": 30, "E": 60, "C": 50}'::JSONB,
  salaire = '22k€ - 40k€',
  salary_range = '{"min": 22000, "max": 40000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'CAP/BEP à Bac Pro',
  debouches = 'Forte',
  domain = 'Construction & BTP',
  job_market_demand = 72,
  growth_rate = 7,
  required_skills = '["Maçonnerie", "Lecture plans", "Gestion équipe", "Sécurité"]'::JSONB,
  updated_at = NOW()
WHERE code = 'F1601';

-- K1201 - Éducateur Spécialisé
UPDATE public.rome_metiers
SET
  libelle = 'Éducateur Spécialisé',
  description = 'Accompagne des enfants ou des adultes en difficulté pour faciliter leur insertion sociale et leur autonomie.',
  riasec_profile = '{"R": 40, "I": 50, "A": 50, "S": 95, "E": 60, "C": 30}'::JSONB,
  riasecmajeur = 'S',
  riasecmineur = 'A',
  adjusted_weights = '{"R": 40, "I": 50, "A": 50, "S": 95, "E": 60, "C": 30}'::JSONB,
  salaire = '22k€ - 35k€',
  salary_range = '{"min": 22000, "max": 35000, "currency": "EUR"}'::JSONB,
  niveau_etudes = 'Bac+3 (DEES)',
  debouches = 'Forte',
  domain = 'Service & Social',
  job_market_demand = 78,
  growth_rate = 8,
  required_skills = '["Pédagogie", "Empathie", "Écoute", "Créativité"]'::JSONB,
  updated_at = NOW()
WHERE code = 'K1201';

-- Log enrichment completion
DO $$
DECLARE
  total_records INT;
  enriched_records INT;
BEGIN
  SELECT COUNT(*) INTO total_records FROM public.rome_metiers;
  SELECT COUNT(*) INTO enriched_records FROM public.rome_metiers WHERE riasec_profile != '{}'::JSONB;
  RAISE NOTICE 'Rome métiers enrichment completed: % / % records enriched', enriched_records, total_records;
END $$;

COMMIT;
