-- Migration: Replace the pg_net Slack trigger with a Supabase Edge Function approach.
-- The pg_net-based trigger timed out at the TCP/SSL level because the database process
-- cannot reach external URLs on this project. The Edge Function has full internet access.
-- Notification is now sent from authService.js via supabase.functions.invoke().

DROP TRIGGER IF EXISTS trigger_notify_slack_new_user ON public.profiles;
DROP FUNCTION IF EXISTS public.notify_slack_new_user();
