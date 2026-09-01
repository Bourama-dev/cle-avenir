-- institutions, institution_emails, institution_codes, institution_members:
-- the whole "Institutions" admin section (AdminInstitutionsPage.jsx,
-- AdminInstitutionCodesPage.jsx) was never linked from the actual admin nav
-- (AdminSidebar.jsx only links /admin/establishments) — reachable only by
-- typing the URL directly. institutionService.js's only other consumer
-- (linkUserToInstitution) was never called anywhere. The single real row in
-- `institutions` (Lycée Professionnel Les Frères Moreau) was a confirmed
-- duplicate of an existing educational_institutions row (same name/address/
-- city/postal code) — nothing to migrate. institution_programs is NOT
-- included here: despite the name, its FK already correctly points at
-- educational_institutions and it's a live dependency of the Establishment
-- dashboard's Classes tab.
DROP TABLE IF EXISTS public.institution_emails CASCADE;
DROP TABLE IF EXISTS public.institution_codes CASCADE;
DROP TABLE IF EXISTS public.institution_members CASCADE;
DROP TABLE IF EXISTS public.institutions CASCADE;
