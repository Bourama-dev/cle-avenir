-- institution_members / is_institution_admin() are retired (Phase 4, dead
-- cluster duplicating educational_institutions/establishment_users).
-- Stripped from profiles_select before dropping institution_members —
-- otherwise every profiles SELECT would break (the policy called
-- is_institution_admin(), which queries a table that would no longer exist).
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id)
    OR is_admin()
    OR (establishment_id IS NOT NULL AND is_establishment_admin(establishment_id))
    OR (EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      JOIN organizations o ON jp.organization_id = o.id
      WHERE ja.candidate_id = profiles.id AND o.user_id = auth.uid()
    ))
  );
