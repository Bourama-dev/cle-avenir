-- Migration: Slack notification trigger for new user registrations
-- Fires when a profile's completed_at is set for the first time — meaning
-- the user has finished the entire signup form and all fields are populated.
-- Covers both email/password signup (INSERT with completed_at) and Google
-- OAuth signup (UPDATE that adds completed_at after the multi-step form).
--
-- Vault secret must be created once:
--   SELECT vault.create_secret('<webhook_url>', 'slack_webhook_nouvelle_utilisateur', '...');

CREATE OR REPLACE FUNCTION public.notify_slack_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_url TEXT;
  payload     JSONB;
BEGIN
  -- Only notify when completed_at is being set for the first time
  IF NEW.completed_at IS NULL THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.completed_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret
    INTO webhook_url
    FROM vault.decrypted_secrets
   WHERE name = 'slack_webhook_nouvelle_utilisateur'
   LIMIT 1;

  payload := jsonb_build_object(
    'text', format(
      '*Nouvel utilisateur inscrit sur CléAvenir* :tada:' || chr(10) || chr(10) ||
      ':bust_in_silhouette: *Nom :* %s %s' || chr(10) ||
      ':email: *Email :* %s' || chr(10) ||
      ':birthday: *Âge :* %s' || chr(10) ||
      ':briefcase: *Statut :* %s' || chr(10) ||
      ':mortar_board: *Niveau d''études :* %s' || chr(10) ||
      ':round_pushpin: *Localisation :* %s' || chr(10) ||
      ':dart: *Objectif :* %s' || chr(10) ||
      ':star: *Abonnement :* %s' || chr(10) ||
      ':calendar: *Inscrit le :* %s',
      COALESCE(NEW.first_name, '—'),
      COALESCE(NEW.last_name, '—'),
      COALESCE(NEW.email, '—'),
      COALESCE(NEW.age_range, '—'),
      COALESCE(NEW.professional_status, '—'),
      COALESCE(NEW.education_level, '—'),
      COALESCE(NEW.location, '—'),
      COALESCE(NEW.main_goal, '—'),
      COALESCE(NEW.subscription_tier, 'free'),
      COALESCE(to_char(NEW.completed_at, 'DD/MM/YYYY à HH24:MI'), to_char(now(), 'DD/MM/YYYY à HH24:MI'))
    )
  );

  PERFORM net.http_post(
    url     := webhook_url,
    body    := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_notify_slack_new_user
  AFTER INSERT OR UPDATE OF completed_at ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_slack_new_user();
