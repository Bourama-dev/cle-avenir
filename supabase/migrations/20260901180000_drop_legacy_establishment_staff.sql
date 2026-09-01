-- establishment_staff and verify_establishment_credentials were the old
-- password-based establishment login scheme, replaced by real Supabase Auth
-- accounts (establishment_users + create-establishment-staff edge function,
-- see CONSOLIDATION_ETABLISSEMENT.md Phase 2). 0 rows, no remaining callers.
DROP FUNCTION IF EXISTS public.verify_establishment_credentials(text, text);
DROP TABLE IF EXISTS public.establishment_staff CASCADE;
