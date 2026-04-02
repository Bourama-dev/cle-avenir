# Telegram Digest Deployment Checklist

## 1. Pre-Deployment Verification

- [ ] **Database**: `event_log` table exists with correct schema.
- [ ] **Database**: RLS policies are enabled and configured (deny anon, allow service_role).
- [ ] **Database**: Indexes on `created_at` and `event_type` are present.
- [ ] **Edge Functions**: `log-user-signup`, `log-test-completed`, `log-payment-event`, `log-school-event` are deployed.
- [ ] **Bot**: Telegram Bot created and `BOT_TOKEN` secured.
- [ ] **Bot**: Target `CHAT_ID` retrieved and verified.

## 2. Deployment Steps

1. **Deploy Edge Functions**: