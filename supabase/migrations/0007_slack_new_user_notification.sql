-- Migration: Slack notification trigger for new user registrations
-- Sends a POST request to n8n webhook when a new profile is created,
-- which forwards the notification to the #nouvelle-utilisateur Slack channel.

CREATE OR REPLACE FUNCTION public.notify_slack_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n.srv1011354.hstgr.cloud/webhook/new-user-notification',
    body := jsonb_build_object(
      'user_id',    NEW.id,
      'email',      COALESCE(NEW.email, ''),
      'first_name', COALESCE(NEW.first_name, ''),
      'last_name',  COALESCE(NEW.last_name, ''),
      'created_at', COALESCE(NEW.created_at::text, now()::text)
    ),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_notify_slack_new_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_slack_new_user();
