-- establishment_password_history / establishment_code_history only ever
-- fed by EstablishmentActivationService.activateEstablishment(), itself
-- never called anywhere in the app. 0 rows, no other dependency.
DROP TABLE IF EXISTS public.establishment_password_history CASCADE;
DROP TABLE IF EXISTS public.establishment_code_history CASCADE;
