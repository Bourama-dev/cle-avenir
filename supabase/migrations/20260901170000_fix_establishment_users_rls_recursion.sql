-- "Establishment admins manage users" was self-referential (a subquery on
-- establishment_users inside its own policy on establishment_users) —
-- a dormant pre-existing bug, never triggered because the table was empty
-- until this session's testing exercised it under RLS for the first time
-- (via the new profiles_select clause added in 20260901160000). Route
-- through the SECURITY DEFINER helper instead, same safe pattern already
-- used by is_institution_admin().
DROP POLICY IF EXISTS "Establishment admins manage users" ON public.establishment_users;

CREATE POLICY "Establishment admins manage users" ON public.establishment_users
  FOR ALL
  TO public
  USING (is_establishment_admin(establishment_id) OR is_admin())
  WITH CHECK (is_establishment_admin(establishment_id) OR is_admin());

-- Simplify profiles_select: the redundant raw subquery on establishment_users
-- is what triggered the recursion above (it runs as the calling role, not
-- through the SECURITY DEFINER function, so it was still subject to
-- establishment_users' own RLS). is_establishment_admin(establishment_id)
-- alone already covers "admin/teacher of this profile's establishment".
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id)
    OR is_admin()
    OR (
      (institution_id IS NOT NULL AND is_institution_admin(institution_id))
      OR (id IN (
        SELECT im.user_id FROM institution_members im
        WHERE im.institution_id IN (
          SELECT im2.institution_id FROM institution_members im2
          WHERE im2.user_id = auth.uid() AND im2.role = ANY (ARRAY['admin'::text, 'teacher'::text])
        )
      ))
    )
    OR (establishment_id IS NOT NULL AND is_establishment_admin(establishment_id))
    OR (EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      JOIN organizations o ON jp.organization_id = o.id
      WHERE ja.candidate_id = profiles.id AND o.user_id = auth.uid()
    ))
  );
