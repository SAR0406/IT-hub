-- IT Hub 11 — missing tables that exist in live DB but had no committed migration.
-- Commit 20260816_* only created resources/profiles/activity_logs/misbehavior_flags + bucket.
-- This file makes `fresh DB + migrations` bootable. All tables are idempotent (if not exists)
-- and include RLS + initplan-friendly policies consistent with existing codebase usage.
-- Run after 20260816_* in Supabase SQL Editor.
-- Sources: src/lib/supabase/database.types.ts, src/app/api/*/route.ts, src/lib/ai/settings.ts, src/lib/quizzes.ts

-- ------------------------------------------------------------ announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  body text not null check (char_length(body) between 2 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists announcements_created_idx on public.announcements (created_at desc);
alter table public.announcements enable row level security;
-- Students read announcements on dashboard; only admins write.
drop policy if exists "announcements_select_authenticated" on public.announcements;
create policy "announcements_select_authenticated" on public.announcements
  for select using ((select auth.uid()) is not null);
drop policy if exists "announcements_admin_write" on public.announcements;
create policy "announcements_admin_write" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------ app_settings
create table if not exists public.app_settings (
  id int primary key,
  ai_enabled boolean not null default true,
  ai_model text not null default 'openai/gpt-oss-120b',
  ai_daily_cap int not null default 30 check (ai_daily_cap between 1 and 500),
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
-- Only admins can read/write app_settings; getAiSettings() is called under user session but reads id=1.
drop policy if exists "app_settings_admin_all" on public.app_settings;
create policy "app_settings_admin_all" on public.app_settings
  for all using (public.is_admin()) with check (public.is_admin());
-- Allow authenticated read of the single settings row for AI feature flag check (fallback to defaults if no row).
drop policy if exists "app_settings_select_authenticated" on public.app_settings;
create policy "app_settings_select_authenticated" on public.app_settings
  for select using ((select auth.uid()) is not null);
insert into public.app_settings (id, ai_enabled, ai_model, ai_daily_cap)
values (1, true, 'openai/gpt-oss-120b', 30)
on conflict (id) do nothing;

-- ------------------------------------------------------------ quizzes
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 200),
  description text check (description is null or char_length(description) <= 1000),
  unit_slug text not null,
  questions jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  time_limit_minutes int check (time_limit_minutes is null or time_limit_minutes between 1 and 180),
  created_at timestamptz not null default now()
);
create index if not exists quizzes_unit_idx on public.quizzes (unit_slug);
create index if not exists quizzes_published_idx on public.quizzes (published, created_at desc);
create index if not exists quizzes_created_idx on public.quizzes (created_at desc);
alter table public.quizzes enable row level security;
-- Published quizzes are readable by any signed-in user; drafts only by admins.
drop policy if exists "quizzes_select_published_or_admin" on public.quizzes;
create policy "quizzes_select_published_or_admin" on public.quizzes
  for select using (published = true or public.is_admin());
drop policy if exists "quizzes_admin_write" on public.quizzes;
create policy "quizzes_admin_write" on public.quizzes
  for all using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------ quiz_attempts
create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score int not null check (score >= 0),
  total int not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts (quiz_id, created_at desc);
create index if not exists quiz_attempts_user_idx on public.quiz_attempts (user_id, created_at desc);
alter table public.quiz_attempts enable row level security;
drop policy if exists "quiz_attempts_select_own_or_admin" on public.quiz_attempts;
create policy "quiz_attempts_select_own_or_admin" on public.quiz_attempts
  for select using ((select auth.uid()) = user_id or public.is_admin());
drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own" on public.quiz_attempts
  for insert with check ((select auth.uid()) = user_id);

-- ------------------------------------------------------------ chat_messages
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  room text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  sender_name text not null check (char_length(sender_name) between 1 and 100),
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_room_created_idx on public.chat_messages (room, created_at desc);
create index if not exists chat_messages_user_idx on public.chat_messages (user_id, created_at desc);
alter table public.chat_messages enable row level security;
drop policy if exists "chat_messages_select_authenticated" on public.chat_messages;
create policy "chat_messages_select_authenticated" on public.chat_messages
  for select using ((select auth.uid()) is not null);
drop policy if exists "chat_messages_insert_authenticated" on public.chat_messages;
create policy "chat_messages_insert_authenticated" on public.chat_messages
  for insert with check ((select auth.uid()) = user_id);
drop policy if exists "chat_messages_delete_admin" on public.chat_messages;
create policy "chat_messages_delete_admin" on public.chat_messages
  for delete using (public.is_admin());
-- Realtime + RLS: ensure publication includes chat_messages for WebSocket streaming.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages') then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
exception when duplicate_object then null;
end $$;

-- Helper for AI bot inserts when RLS would block service-like insert under user session.
create or replace function public.insert_ai_message(p_room text, p_content text, p_bot_id uuid)
returns setof public.chat_messages
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_bot_name text := 'IT Hub AI';
begin
  -- Only allow AI room and authenticated caller; model daily cap is checked in app code.
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if p_room <> 'ai' then
    raise exception 'Invalid room';
  end if;
  return query
  insert into public.chat_messages (room, user_id, sender_name, content)
  values (p_room, p_bot_id, v_bot_name, p_content)
  returning *;
end;
$$;
grant execute on function public.insert_ai_message(text, text, uuid) to anon, authenticated;
revoke execute on function public.insert_ai_message(text, text, uuid) from public;

-- ------------------------------------------------------------ ai_usage
create table if not exists public.ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in ('chat', 'quiz_gen')),
  model text not null,
  prompt_tokens int not null default 0 check (prompt_tokens >= 0),
  completion_tokens int not null default 0 check (completion_tokens >= 0),
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_user_action_created_idx on public.ai_usage (user_id, action, created_at desc);
create index if not exists ai_usage_created_idx on public.ai_usage (created_at desc);
alter table public.ai_usage enable row level security;
drop policy if exists "ai_usage_select_own_or_admin" on public.ai_usage;
create policy "ai_usage_select_own_or_admin" on public.ai_usage
  for select using ((select auth.uid()) = user_id or public.is_admin());
drop policy if exists "ai_usage_insert_own" on public.ai_usage;
create policy "ai_usage_insert_own" on public.ai_usage
  for insert with check ((select auth.uid()) = user_id);
