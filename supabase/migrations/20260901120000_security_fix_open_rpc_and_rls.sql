-- Security audit fixes (2026-09-01)
--
-- 1. delete_user / delete_user_completely / create_establishment_staff / get_institution_login_info
--    were SECURITY DEFINER functions callable by the `anon` role with no authorization check
--    inside their body. Confirmed unused by the current frontend (no callers in src/), so
--    locking them down has no functional impact today.
-- 2. parental_consent_requests had RLS enabled with zero policies, silently breaking the
--    parental-consent insert in authService.js.
-- 3. Four functions had a mutable search_path (privilege-escalation vector via schema hijacking).

-- --- 1a. delete_user: restrict to self or admin, drop anon access ---
REVOKE ALL ON FUNCTION public.delete_user(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_user(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;

  IF auth.uid() IS NULL OR (auth.uid() != p_user_id AND NOT public.is_admin()) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  DELETE FROM public.user_events WHERE user_id = p_user_id;
  DELETE FROM public.profiles WHERE id = p_user_id;
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.delete_user(uuid) TO authenticated;

-- --- 1b. delete_user_completely: same treatment, plus fix mutable search_path ---
REVOKE ALL ON FUNCTION public.delete_user_completely(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'target_user_id cannot be null';
  END IF;

  IF auth.uid() IS NULL OR (auth.uid() != target_user_id AND NOT public.is_admin()) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  DELETE FROM action_plans WHERE user_id = target_user_id;
  DELETE FROM admin_users WHERE user_id = target_user_id;
  DELETE FROM audit_logs WHERE actor_id = target_user_id;
  DELETE FROM authorized_emails WHERE added_by = target_user_id;
  DELETE FROM bug_reports_settings WHERE user_id = target_user_id;
  DELETE FROM bug_reports WHERE user_id = target_user_id;
  DELETE FROM chat_sessions WHERE user_id = target_user_id;
  DELETE FROM cleo_action_plans WHERE user_id = target_user_id;
  DELETE FROM cleo_conversations WHERE user_id = target_user_id;
  DELETE FROM cleo_memories WHERE user_id = target_user_id;
  DELETE FROM content_items WHERE author_id = target_user_id;
  DELETE FROM conversation_history WHERE user_id = target_user_id;
  DELETE FROM direct_messages WHERE receiver_id = target_user_id OR sender_id = target_user_id;
  DELETE FROM error_logs WHERE user_id = target_user_id;
  DELETE FROM establishment_code_history WHERE created_by = target_user_id;
  DELETE FROM establishment_password_history WHERE created_by = target_user_id;
  DELETE FROM event_logs WHERE user_id = target_user_id;
  DELETE FROM feedback WHERE user_id = target_user_id;
  DELETE FROM game_analytics WHERE user_id = target_user_id;
  DELETE FROM game_sessions WHERE user_id = target_user_id;
  DELETE FROM gdpr_consents WHERE user_id = target_user_id;
  DELETE FROM gdpr_cookie_preferences WHERE user_id = target_user_id;
  DELETE FROM gdpr_logs WHERE user_id = target_user_id;
  DELETE FROM gdpr_policies WHERE created_by = target_user_id;
  DELETE FROM gdpr_requests WHERE user_id = target_user_id OR processed_by = target_user_id;
  DELETE FROM goals WHERE user_id = target_user_id;
  DELETE FROM launch_checklist WHERE completed_by = target_user_id;
  DELETE FROM match_results WHERE user_id = target_user_id;
  DELETE FROM notifications WHERE user_id = target_user_id;
  DELETE FROM operational_tasks WHERE assigned_to = target_user_id;
  DELETE FROM organizations WHERE user_id = target_user_id;
  DELETE FROM payment_history WHERE user_id = target_user_id;
  DELETE FROM qa_issues WHERE assigned_to = target_user_id;
  DELETE FROM saved_formations WHERE user_id = target_user_id;
  DELETE FROM saved_jobs WHERE user_id = target_user_id;
  DELETE FROM saved_metiers WHERE user_id = target_user_id;
  DELETE FROM sector_coverage WHERE user_id = target_user_id;
  DELETE FROM support_requests WHERE user_id = target_user_id;
  DELETE FROM test_metier_feedback WHERE user_id = target_user_id;
  DELETE FROM test_results WHERE user_id = target_user_id;
  DELETE FROM test_runs WHERE executed_by = target_user_id;
  DELETE FROM user_activities WHERE user_id = target_user_id;
  DELETE FROM user_answers WHERE user_id = target_user_id;
  DELETE FROM user_career_goals WHERE user_id = target_user_id;
  DELETE FROM user_cover_letters WHERE user_id = target_user_id;
  DELETE FROM user_cvs WHERE user_id = target_user_id;
  DELETE FROM user_events WHERE user_id = target_user_id;
  DELETE FROM user_games WHERE user_id = target_user_id;
  DELETE FROM user_gamification WHERE user_id = target_user_id;
  DELETE FROM user_plans WHERE user_id = target_user_id;
  DELETE FROM user_preferences WHERE user_id = target_user_id;
  DELETE FROM user_profiles_extended WHERE user_id = target_user_id;
  DELETE FROM user_profiles WHERE user_id = target_user_id;
  DELETE FROM user_progression WHERE user_id = target_user_id;
  DELETE FROM user_roles WHERE user_id = target_user_id;
  DELETE FROM user_skills_progress WHERE user_id = target_user_id;
  DELETE FROM user_skills WHERE user_id = target_user_id;
  DELETE FROM user_subscriptions WHERE user_id = target_user_id;
  DELETE FROM user_test_progress WHERE user_id = target_user_id;
  DELETE FROM user_test_results WHERE user_id = target_user_id;
  DELETE FROM weekly_reports WHERE admin_id = target_user_id;
  DELETE FROM wiki_pages WHERE author_id = target_user_id;
  DELETE FROM learning_paths WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE id = target_user_id;

  -- Supprimer l'utilisateur auth (supprime aussi les sessions, identities, etc. en cascade)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;

-- --- 1c. create_establishment_staff: admin-only, drop anon access ---
REVOKE ALL ON FUNCTION public.create_establishment_staff(uuid, text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_establishment_staff(p_establishment_id uuid, p_email text, p_password text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  new_id uuid;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  INSERT INTO public.establishment_staff (establishment_id, email, encrypted_password, status)
  VALUES (p_establishment_id, p_email, crypt(p_password, gen_salt('bf')), 'pending')
  RETURNING id INTO new_id;
  RETURN json_build_object('success', true, 'id', new_id);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$function$;

GRANT EXECUTE ON FUNCTION public.create_establishment_staff(uuid, text, text) TO authenticated;

-- --- 1d. get_institution_login_info: unused by the frontend, no legitimate anon/authenticated caller today ---
REVOKE ALL ON FUNCTION public.get_institution_login_info(text) FROM PUBLIC, anon, authenticated;

-- --- 2. parental_consent_requests: was RLS-enabled with zero policies (silently broken inserts) ---
CREATE POLICY "Users can create their own parental consent request"
  ON public.parental_consent_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own parental consent request"
  ON public.parental_consent_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- --- 3. Fix remaining mutable search_path functions ---
ALTER FUNCTION public.generate_riasec_profile(text, text) SET search_path TO 'public', 'pg_temp';
ALTER FUNCTION public.infer_education_level(text, text) SET search_path TO 'public', 'pg_temp';
ALTER FUNCTION public.infer_domain(text, text) SET search_path TO 'public', 'pg_temp';
