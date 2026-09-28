-- AI usage limits (Cléo chat + interview simulator) and subscription_tier lock.

-- ── 1. One row per AI interview started ────────────────────────────────────
-- Written only by the chat-advisor edge function (service role); counted to
-- enforce the per-user interview quota.
create table if not exists public.ai_interview_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  calls integer not null default 1
);

create index if not exists ai_interview_credits_user_created_idx
  on public.ai_interview_credits (user_id, created_at desc);

alter table public.ai_interview_credits enable row level security;

-- Users may read their own usage; no insert/update/delete policy, so only
-- the service role can write.
drop policy if exists "Users can read their own interview credits" on public.ai_interview_credits;
create policy "Users can read their own interview credits"
  on public.ai_interview_credits for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ── 2. One row per Cléo chat message ───────────────────────────────────────
-- Written only by chat-advisor; counted for the daily anti-abuse limit.
-- Anonymous visitors are keyed by a salted hash of their IP (client_key),
-- never by the raw address.
create table if not exists public.ai_usage_events (
  id bigint generated always as identity primary key,
  kind text not null,
  user_id uuid references auth.users(id) on delete cascade,
  client_key text,
  created_at timestamptz not null default now(),
  constraint ai_usage_events_owner check (user_id is not null or client_key is not null)
);

create index if not exists ai_usage_events_user_idx
  on public.ai_usage_events (kind, user_id, created_at desc) where user_id is not null;
create index if not exists ai_usage_events_client_idx
  on public.ai_usage_events (kind, client_key, created_at desc) where client_key is not null;

-- Service role only: RLS on, no policy.
alter table public.ai_usage_events enable row level security;

-- ── 3. Users can't grant themselves a paid plan ────────────────────────────
-- profiles_update lets a user update any column of their own row, including
-- subscription_tier. Quotas (and any future paid feature) read that column,
-- so only admins and the service role (Stripe webhooks, edge functions) may
-- change it. Other updates to the row go through untouched.
create or replace function public.protect_subscription_tier()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'authenticated' and not public.is_admin() then
    if tg_op = 'INSERT' then
      if coalesce(new.subscription_tier, 'free') not in ('free', 'decouverte') then
        new.subscription_tier := 'free';
      end if;
    elsif new.subscription_tier is distinct from old.subscription_tier then
      new.subscription_tier := old.subscription_tier;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_subscription_tier on public.profiles;
create trigger protect_subscription_tier
  before insert or update on public.profiles
  for each row execute function public.protect_subscription_tier();
