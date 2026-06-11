-- Migration: Slack notification trigger for new user registrations
-- On each new profile INSERT, calls the Slack Incoming Webhook (stored in
-- Supabase Vault as 'slack_webhook_nouvelle_utilisateur') to post a message
-- in the #nouvelle-utilisateur channel.
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
  SELECT decrypted_secret
    INTO webhook_url
    FROM vault.decrypted_secrets
   WHERE name = 'slack_webhook_nouvelle_utilisateur'
   LIMIT 1;

  payload := jsonb_build_object(
    'text', format(
      '*Nouvel utilisateur inscrit sur CléAvenir* :tada:' || chr(10) || chr(10) ||
      '*Nom :* %s %s' || chr(10) ||
      '*Email :* %s' || chr(10) ||
      '*Inscrit le :* %s',
      COALESCE(NEW.first_name, ''),
      COALESCE(NEW.last_name, ''),
      COALESCE(NEW.email, ''),
      COALESCE(to_char(NEW.created_at, 'DD/MM/YYYY à HH24:MI'), to_char(now(), 'DD/MM/YYYY à HH24:MI'))
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
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_slack_new_user();
