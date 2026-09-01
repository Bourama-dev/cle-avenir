-- Foundation for real Supabase-Auth-backed establishment staff accounts
-- (Phase 2 of CONSOLIDATION_ETABLISSEMENT.md, Option A).
--
-- establishment_users already links a real auth.users id to an establishment
-- with a role (used today by student signup). This adds the equivalent of
-- is_institution_admin() for establishments, and wires it into the profiles
-- RLS policy so establishment staff can see their own students once they
-- log in through real Supabase Auth (instead of the old localStorage/RPC
-- session, which never produced a JWT and so could never satisfy RLS).

CREATE OR REPLACE FUNCTION public.is_establishment_admin(target_establishment_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.establishment_users
    WHERE establishment_id = target_establishment_id
      AND user_id = auth.uid()
      AND role IN ('admin', 'teacher')
      AND status = 'active'
  );
END;
$function$;

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
    OR (
      (establishment_id IS NOT NULL AND is_establishment_admin(establishment_id))
      OR (id IN (
        SELECT eu.user_id FROM establishment_users eu
        WHERE eu.establishment_id IN (
          SELECT eu2.establishment_id FROM establishment_users eu2
          WHERE eu2.user_id = auth.uid() AND eu2.role IN ('admin', 'teacher') AND eu2.status = 'active'
        )
      ))
    )
    OR (EXISTS (
      SELECT 1 FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      JOIN organizations o ON jp.organization_id = o.id
      WHERE ja.candidate_id = profiles.id AND o.user_id = auth.uid()
    ))
  );
