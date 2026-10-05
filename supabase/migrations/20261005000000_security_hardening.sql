-- Security hardening (audit 2026-10-05)

-- 1. Extend the profile guard: non-admin authenticated users cannot grant
--    themselves an elevated role, mark themselves verified or set a Stripe customer.
CREATE OR REPLACE FUNCTION public.protect_subscription_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    if tg_op = 'INSERT' then
      if coalesce(new.subscription_tier, 'free') not in ('free', 'decouverte') then
        new.subscription_tier := 'free';
      end if;
      if new.role in ('admin', 'super_admin', 'establishment_admin', 'teacher') then
        new.role := 'user';
      end if;
      new.is_verified := false;
      new.stripe_customer_id := null;
    else
      if new.subscription_tier is distinct from old.subscription_tier then
        new.subscription_tier := old.subscription_tier;
      end if;
      if new.role is distinct from old.role then
        new.role := old.role;
      end if;
      new.is_verified := old.is_verified;
      new.stripe_customer_id := old.stripe_customer_id;
    end if;
  end if;
  return new;
end;
$function$;

-- 2. anon never needs to write profiles (RLS already blocks it; defence in depth).
REVOKE UPDATE, INSERT, DELETE ON public.profiles FROM anon;

-- 3. Trigger / event-trigger functions must not be callable through the API.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    WHERE p.pronamespace = 'public'::regnamespace
      AND p.proname IN ('protect_subscription_tier',
                        'resolve_profile_establishment','set_admin_role','sync_profile_role',
                        'revoke_establishment_membership','rls_auto_enable',
                        'update_metier_weights_from_feedback')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
  END LOOP;
END $$;

-- 4. Pin search_path on SECURITY DEFINER / helper functions flagged by the advisor.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig, p.proname
    FROM pg_proc p
    WHERE p.pronamespace = 'public'::regnamespace
      AND p.proname IN ('notify_slack_new_user','default_riasec_by_rome_code','generate_riasec_profile',
                        'jitter_riasec','riasec_profile_from_majeur_mineur','compute_job_riasec_profile')
  LOOP
    IF r.proname = 'notify_slack_new_user' THEN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, vault, net, extensions, pg_temp', r.sig);
    ELSE
      EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', r.sig);
    END IF;
  END LOOP;
END $$;

-- 5. (not applied: DDL on public.subscriptions hung on production) restrict the INSERT policy
--    to rows where user_email matches the caller's JWT email. Apply during a quiet window.
