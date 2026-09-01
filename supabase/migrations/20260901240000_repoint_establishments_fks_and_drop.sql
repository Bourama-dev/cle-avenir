-- Same bug as establishment_users (20260901230000): authorized_emails,
-- establishment_emails, establishment_activity_logs, and profiles.establishment_id
-- all FK'd to `establishments` (0 rows, no admin UI writes to it), while every
-- live component passing an "establishment id" around actually uses
-- educational_institutions.id. All 4 columns were at 0 rows — repointed
-- directly, no data to migrate. establishments then dropped (empty, nothing
-- references it anymore).

ALTER TABLE public.authorized_emails
  DROP CONSTRAINT authorized_emails_establishment_id_fkey,
  ADD CONSTRAINT authorized_emails_establishment_id_fkey
    FOREIGN KEY (establishment_id) REFERENCES public.educational_institutions(id) ON DELETE CASCADE;

ALTER TABLE public.establishment_emails
  DROP CONSTRAINT establishment_emails_establishment_id_fkey,
  ADD CONSTRAINT establishment_emails_establishment_id_fkey
    FOREIGN KEY (establishment_id) REFERENCES public.educational_institutions(id) ON DELETE CASCADE;

ALTER TABLE public.establishment_activity_logs
  DROP CONSTRAINT establishment_activity_logs_establishment_id_fkey,
  ADD CONSTRAINT establishment_activity_logs_establishment_id_fkey
    FOREIGN KEY (establishment_id) REFERENCES public.educational_institutions(id) ON DELETE CASCADE;

ALTER TABLE public.profiles
  DROP CONSTRAINT profiles_establishment_id_fkey,
  ADD CONSTRAINT profiles_establishment_id_fkey
    FOREIGN KEY (establishment_id) REFERENCES public.educational_institutions(id) ON DELETE SET NULL;

DROP TABLE IF EXISTS public.establishments CASCADE;
