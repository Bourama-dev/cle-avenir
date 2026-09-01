-- Schema cleanup (2026-09-01): drop tables confirmed dead on both sides —
-- zero rows, zero references in src/ or supabase/functions/, and no
-- dependency from any live RLS policy or SECURITY DEFINER function.
-- (Verified separately: user_profiles has 0 rows but IS referenced by
-- semanticMatchingService.js / ActionPlanPage.jsx, so it is NOT included here.
-- The three parallel establishment/institution/educational_institutions systems
-- are NOT touched here either — that needs a product decision first.)

-- Profile duplicates (superseded by public.profiles)
DROP TABLE IF EXISTS public.career_profiles CASCADE;
DROP TABLE IF EXISTS public.user_profiles_extended CASCADE;

-- Career/formation duplicates never wired to any feature
DROP TABLE IF EXISTS public.cleo_formations CASCADE;
DROP TABLE IF EXISTS public.user_careers CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.career_feedback CASCADE;
DROP TABLE IF EXISTS public.cleo_career_scenarios CASCADE;

-- English gdpr_* family superseded by the French rgpd_*/cookie_policies/
-- user_cookie_preferences tables that are actually used in the app
DROP TABLE IF EXISTS public.gdpr_consents CASCADE;
DROP TABLE IF EXISTS public.gdpr_requests CASCADE;
DROP TABLE IF EXISTS public.gdpr_policies CASCADE;
DROP TABLE IF EXISTS public.gdpr_cookies CASCADE;
DROP TABLE IF EXISTS public.gdpr_logs CASCADE;
DROP TABLE IF EXISTS public.gdpr_cookie_preferences CASCADE;
DROP TABLE IF EXISTS public.gdpr_cookie_settings CASCADE;

-- Plan/feedback duplicates superseded by personalized_plans / action_plans / feedback
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.user_plans CASCADE;
DROP TABLE IF EXISTS public.feedback_resultats CASCADE;

-- Unused establishment sub-tables (establishment_departments is FK'd by
-- department_users, itself unreferenced anywhere — dropped together)
DROP TABLE IF EXISTS public.partner_institutions CASCADE;
DROP TABLE IF EXISTS public.department_users CASCADE;
DROP TABLE IF EXISTS public.establishment_settings CASCADE;
DROP TABLE IF EXISTS public.establishment_departments CASCADE;
