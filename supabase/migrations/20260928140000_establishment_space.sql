-- Establishment space: real authentication and data access.
--
-- Staff members sign in with a regular CléAvenir (Supabase Auth) account.
-- Access is granted by the platform admin (or an establishment admin) by
-- adding the staff email to `authorized_emails`; the first sign-in with that
-- (confirmed) email creates the `establishment_users` membership used by RLS.
--
-- Students are linked to an establishment through `profiles.establishment_id`,
-- which can only be set from the establishment code (`institution_code`).

-- ---------------------------------------------------------------------------
-- Membership checks
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_establishment_admin(target_establishment_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.establishment_users eu
    JOIN public.educational_institutions ei ON ei.id = eu.establishment_id
    WHERE eu.establishment_id = target_establishment_id
      AND eu.user_id = auth.uid()
      AND eu.role IN ('admin', 'teacher')
      AND eu.status = 'active'
      AND ei.deleted_at IS NULL
      AND ei.paused_at IS NULL
      AND COALESCE(ei.status, 'active') = 'active'
  );
END;
$$;

-- Memberships are created only by claim_establishment_access() (security
-- definer) or by platform admins: establishment staff must not be able to
-- add arbitrary accounts to their establishment.
DROP POLICY IF EXISTS "Establishment admins manage users" ON public.establishment_users;
DROP POLICY IF EXISTS "Admins manage establishment users" ON public.establishment_users;
CREATE POLICY "Admins manage establishment users" ON public.establishment_users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Establishment staff view members" ON public.establishment_users;
CREATE POLICY "Establishment staff view members" ON public.establishment_users
  FOR SELECT USING (public.is_establishment_admin(establishment_id));

-- ---------------------------------------------------------------------------
-- Sign-in: turn an authorized email into a membership
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.claim_establishment_access()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_confirmed timestamptz;
  v_est public.educational_institutions%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  SELECT lower(email), email_confirmed_at INTO v_email, v_confirmed
  FROM auth.users WHERE id = v_uid;

  -- Drop memberships that are no longer backed by an active authorized email.
  DELETE FROM public.establishment_users eu
  WHERE eu.user_id = v_uid
    AND NOT EXISTS (
      SELECT 1 FROM public.authorized_emails ae
      WHERE lower(ae.email) = v_email
        AND ae.establishment_id = eu.establishment_id
        AND COALESCE(ae.status, 'active') = 'active'
    );

  SELECT ei.* INTO v_est
  FROM public.authorized_emails ae
  JOIN public.educational_institutions ei ON ei.id = ae.establishment_id
  WHERE lower(ae.email) = v_email
    AND COALESCE(ae.status, 'active') = 'active'
    AND ei.deleted_at IS NULL
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'reason', 'not_authorized');
  END IF;

  IF v_confirmed IS NULL THEN
    RETURN json_build_object('success', false, 'reason', 'email_not_confirmed');
  END IF;

  IF v_est.paused_at IS NOT NULL OR COALESCE(v_est.status, 'active') <> 'active' THEN
    RETURN json_build_object('success', false, 'reason', 'establishment_paused');
  END IF;

  INSERT INTO public.establishment_users (establishment_id, user_id, role, status)
  VALUES (v_est.id, v_uid, 'admin', 'active')
  ON CONFLICT (establishment_id, user_id)
  DO UPDATE SET status = 'active', updated_at = now();

  UPDATE public.educational_institutions SET last_access = now() WHERE id = v_est.id;

  RETURN json_build_object(
    'success', true,
    'establishment', json_build_object(
      'id', v_est.id,
      'name', v_est.name,
      'uai', v_est.uai,
      'code', v_est.code,
      'city', v_est.city,
      'type', v_est.type
    )
  );
END;
$$;

-- Removing (or deactivating) an authorized email revokes the access at once.
CREATE OR REPLACE FUNCTION public.revoke_establishment_membership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND lower(NEW.email) = lower(OLD.email)
     AND NEW.establishment_id IS NOT DISTINCT FROM OLD.establishment_id
     AND COALESCE(NEW.status, 'active') = 'active' THEN
    RETURN NEW;
  END IF;

  DELETE FROM public.establishment_users eu
  USING auth.users u
  WHERE u.id = eu.user_id
    AND lower(u.email) = lower(OLD.email)
    AND eu.establishment_id = OLD.establishment_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS authorized_emails_revoke_membership ON public.authorized_emails;
CREATE TRIGGER authorized_emails_revoke_membership
  AFTER UPDATE OR DELETE ON public.authorized_emails
  FOR EACH ROW EXECUTE FUNCTION public.revoke_establishment_membership();

-- ---------------------------------------------------------------------------
-- Students: link through the establishment code only
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.resolve_profile_establishment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_code text;
  v_est public.educational_institutions%ROWTYPE;
  v_trusted boolean := auth.uid() IS NULL OR public.is_admin();
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.institution_code IS NOT DISTINCT FROM OLD.institution_code THEN
    -- The link itself can't be edited directly by the user.
    IF NOT v_trusted THEN
      NEW.establishment_id := OLD.establishment_id;
      NEW.institution_id := OLD.institution_id;
      NEW.institution_name := OLD.institution_name;
    END IF;
    RETURN NEW;
  END IF;

  -- Profile created at signup: the code entered in the form is kept in the
  -- auth metadata (the profile can't be updated before email confirmation).
  IF TG_OP = 'INSERT' AND NEW.institution_code IS NULL THEN
    SELECT u.raw_user_meta_data ->> 'establishment_code' INTO NEW.institution_code
    FROM auth.users u WHERE u.id = NEW.id;
  END IF;

  v_code := upper(trim(COALESCE(NEW.institution_code, '')));

  IF v_code = '' THEN
    IF TG_OP = 'UPDATE' OR NOT v_trusted THEN
      NEW.institution_code := NULL;
      NEW.establishment_id := NULL;
      NEW.institution_id := NULL;
      NEW.institution_name := NULL;
    END IF;
    RETURN NEW;
  END IF;

  SELECT * INTO v_est
  FROM public.educational_institutions
  WHERE (upper(code) = v_code OR upper(uai) = v_code)
    AND deleted_at IS NULL
    AND paused_at IS NULL
    AND COALESCE(status, 'active') = 'active'
  LIMIT 1;

  IF FOUND THEN
    NEW.institution_code := v_code;
    NEW.establishment_id := v_est.id;
    NEW.institution_id := v_est.id;
    NEW.institution_name := v_est.name;
  ELSE
    NEW.establishment_id := NULL;
    NEW.institution_id := NULL;
    NEW.institution_name := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_resolve_establishment ON public.profiles;
CREATE TRIGGER profiles_resolve_establishment
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.resolve_profile_establishment();

-- Backfill profiles that stored a code without being linked.
UPDATE public.profiles p
SET establishment_id = ei.id, institution_id = ei.id, institution_name = ei.name
FROM public.educational_institutions ei
WHERE p.establishment_id IS NULL
  AND p.institution_code IS NOT NULL
  AND (upper(ei.code) = upper(trim(p.institution_code)) OR upper(ei.uai) = upper(trim(p.institution_code)))
  AND ei.deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Dashboard data
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_establishment_overview(p_establishment_id uuid)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_result json;
BEGIN
  IF NOT (public.is_establishment_admin(p_establishment_id) OR public.is_admin()) THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  WITH students AS (
    SELECT p.id, p.first_name, p.last_name, p.email, p.education_level, p.created_at
    FROM public.profiles p
    WHERE p.establishment_id = p_establishment_id
  ),
  tests AS (
    SELECT
      tr.user_id,
      count(*) AS n,
      max(tr.created_at) AS last_at,
      (array_agg(tr.top_3_careers -> 0 ->> 'name' ORDER BY tr.created_at DESC)
        FILTER (WHERE jsonb_typeof(tr.top_3_careers) = 'array' AND jsonb_array_length(tr.top_3_careers) > 0))[1] AS top_career,
      (array_agg(tr.riasec_profile ORDER BY tr.created_at DESC)
        FILTER (WHERE jsonb_typeof(tr.riasec_profile) = 'object'))[1] AS riasec
    FROM public.test_results tr
    JOIN students s ON s.id = tr.user_id
    GROUP BY tr.user_id
  ),
  tests_ranked AS (
    SELECT t.*, (
      SELECT r.key FROM jsonb_each(t.riasec) r
      WHERE jsonb_typeof(r.value) = 'number'
      ORDER BY (r.value)::text::numeric DESC
      LIMIT 1
    ) AS riasec_top
    FROM tests t
  )
  SELECT json_build_object(
    'establishment', (
      SELECT json_build_object('id', id, 'name', name, 'uai', uai, 'code', code, 'city', city, 'type', type)
      FROM public.educational_institutions WHERE id = p_establishment_id
    ),
    'stats', json_build_object(
      'students', (SELECT count(*) FROM students),
      'new_students_30d', (SELECT count(*) FROM students WHERE created_at > now() - interval '30 days'),
      'students_tested', (SELECT count(*) FROM tests_ranked),
      'tests', (SELECT COALESCE(sum(n), 0) FROM tests_ranked),
      'programs', (SELECT count(*) FROM public.institution_programs WHERE institution_id = p_establishment_id)
    ),
    'students', COALESCE((
      SELECT json_agg(json_build_object(
        'id', s.id,
        'first_name', s.first_name,
        'last_name', s.last_name,
        'email', s.email,
        'education_level', s.education_level,
        'created_at', s.created_at,
        'tests', COALESCE(t.n, 0),
        'last_test_at', t.last_at,
        'top_career', t.top_career,
        'riasec_top', t.riasec_top
      ) ORDER BY s.last_name NULLS LAST, s.first_name)
      FROM students s LEFT JOIN tests_ranked t ON t.user_id = s.id
    ), '[]'::json),
    'top_careers', COALESCE((
      SELECT json_agg(x) FROM (
        SELECT top_career AS name, count(*) AS students
        FROM tests_ranked WHERE top_career IS NOT NULL
        GROUP BY top_career ORDER BY count(*) DESC, top_career LIMIT 5
      ) x
    ), '[]'::json),
    'riasec', COALESCE((
      SELECT json_object_agg(riasec_top, n) FROM (
        SELECT riasec_top, count(*) AS n FROM tests_ranked WHERE riasec_top IS NOT NULL GROUP BY riasec_top
      ) r
    ), '{}'::json),
    'programs', COALESCE((
      SELECT json_agg(json_build_object('id', id, 'name', program_name, 'level', level, 'sector', sector) ORDER BY program_name)
      FROM public.institution_programs WHERE institution_id = p_establishment_id
    ), '[]'::json),
    'staff', COALESCE((
      SELECT json_agg(json_build_object(
        'id', ae.id,
        'email', ae.email,
        'status', COALESCE(ae.status, 'active'),
        'joined', EXISTS (
          SELECT 1 FROM public.establishment_users eu JOIN auth.users u ON u.id = eu.user_id
          WHERE eu.establishment_id = p_establishment_id AND lower(u.email) = lower(ae.email)
        )
      ) ORDER BY ae.created_at)
      FROM public.authorized_emails ae WHERE ae.establishment_id = p_establishment_id
    ), '[]'::json)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_establishment_access() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_establishment_overview(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_establishment_access() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_establishment_overview(uuid) TO authenticated;
