# Event Logging Best Practices & Security

## Security Guidelines

1. **Service Role Isolation**
   - **NEVER** expose the Supabase Service Role Key in the frontend client.
   - All writes to `event_log` must go through Edge Functions or secure server-side environments.
   - The `event_log` table should have RLS policies denying ALL access to `anon` and `authenticated` roles directly.

2. **Input Validation**
   - Edge Functions must strictly validate all inputs (types, formats, allowed values) before inserting into the database.
   - Sanitize metadata fields to prevent JSON injection or excessive storage usage.

3. **Data Privacy**
   - Avoid logging sensitive PII (Personally Identifiable Information) in the `metadata` JSONB column unless absolutely necessary.
   - Use user IDs (UUIDs) instead of raw emails or names where possible.
   - If logging emails is required for debugging (e.g., signup events), ensure access to logs is strictly controlled.

## Operational Best Practices

### Retry Policy
- **Client-Side**: Implement exponential backoff for event logging calls (e.g., 3 retries: 500ms, 1s, 2s).
- **Fail-Safe**: Event logging should be "fire and forget" from the user's perspective. A failure to log an event *must not* block the user journey (e.g., don't prevent a signup just because the log failed).

### Anti-Spam & Rate Limiting
- The n8n digest runs once daily.
- If real-time alerts are needed (e.g., > 10 payment failures in an hour), implement a separate high-frequency check or Supabase Database Webhook.

### Data Retention
- **Active Logs**: Keep detailed logs in `event_log` for **90 days**.
- **Archiving**: Create a scheduled SQL function or cron job to move older logs to a cold storage bucket (CSV/JSON) or delete them to maintain database performance.
- **Performance**: The `event_log` table can grow quickly. Ensure indexes on `created_at` and `event_type` are maintained.

## Monitoring & Alerting Logic (n8n)

The Daily Digest workflow implements the following logic:

1. **Payment Failures**:
   - Highlight if > 0 failures occur.
   - List top 3 reasons for failure (e.g., "insufficient_funds").

2. **Test Abandonment**:
   - Calculate: `(Tests Started - Tests Completed) / Tests Started`.
   - Alert if abandonment rate > **40%**.

3. **System Errors**:
   - Critical alert if `error_occurred` events > **5** per day.

4. **Low Activity**:
   - Send a "Low Activity" warning if total events < 10 (may indicate tracking breakage).

## Indexing Strategy
To ensure the daily reporting query remains fast as the table grows: