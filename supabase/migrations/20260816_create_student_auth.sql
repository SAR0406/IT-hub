-- IT Hub 11 — student authentication, activity tracking and misbehavior flags
-- Part 1: schema. Part 2 (separate file) seeds demo students and activity.
--
-- Model
--   profiles          — one row per auth user; role ('student' | 'admin'),
--                       is_active lets an admin disable an account.
--   activity_logs     — every meaningful action (page view, search, download…).
--   misbehavior_flags — raised automatically by the app when a rule trips
--                       (banned search terms, download bursts, repeated
--                       failed logins, students probing admin APIs).
--
-- Security model
--   is_admin() is a SECURITY DEFINER helper so policies can check roles
--   without recursive RLS.
--   Students may read only their own profile row and insert only their own
--   logs/flags. Admin sees everything. Logs are immutable to clients.
--   Guest inserts are allowed ONLY for action = 'login_failed' so failed
--   logins can be recorded before a session exists.

-- ---------------------------------------------------------------- profiles

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'student' check (role in ('student', 'admin')),
  class_name text,
  student_id text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Student and admin accounts for IT Hub 11.';

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_student_id_idx on public.profiles (student_id);

-- ----------------------------------------------------------- activity_logs

create table if not exists public.activity_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  action text not null check (action in (
    'page_view', 'search', 'resource_open', 'resource_download',
    'login_success', 'login_failed', 'resource_upload', 'resource_delete',
    'admin_action', 'unauthorized_admin_attempt'
  )),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.activity_logs is
  'Immutable audit trail of student and admin activity.';

create index if not exists activity_logs_user_idx on public.activity_logs (user_id, created_at desc);
create index if not exists activity_logs_action_idx on public.activity_logs (action, created_at desc);
create index if not exists activity_logs_created_idx on public.activity_logs (created_at desc);
create index if not exists activity_logs_email_idx on public.activity_logs
  ((details ->> 'email'::text)) where action = 'login_failed';

-- ----------------------------------------------------- misbehavior_flags

create table if not exists public.misbehavior_flags (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in (
    'banned_search', 'rapid_downloads', 'failed_login', 'unauthorized_admin'
  )),
  severity text not null check (severity in ('low', 'medium', 'high')),
  details jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz
);

comment on table public.misbehavior_flags is
  'Automatically raised concerns for the admin to review.';

create index if not exists flags_status_idx on public.misbehavior_flags (status, created_at desc);
create index if not exists flags_user_idx on public.misbehavior_flags (user_id, created_at desc);

-- -------------------------------------------------------------- is_admin

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------------- RLS

alter table public.profiles enable row level security;
alter table public.activity_logs enable row level security;
alter table public.misbehavior_flags enable row level security;

-- profiles: users see their own row; admins see all.
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

create policy "profiles_delete_admin" on public.profiles
  for delete using (public.is_admin());

-- activity_logs: immutable; students insert only their own rows; admins read all.
create policy "logs_select_admin" on public.activity_logs
  for select using (public.is_admin());

create policy "logs_insert_own" on public.activity_logs
  for insert with check (auth.uid() = user_id);

-- Guests have no session, but a failed login must still be recorded so the
-- admin can spot brute-force attempts against known accounts.
create policy "logs_insert_guest_failed_login" on public.activity_logs
  for insert with check (user_id is null and action = 'login_failed');

-- misbehavior_flags: admins read and review; students can only raise their own.
create policy "flags_select_admin" on public.misbehavior_flags
  for select using (public.is_admin());

create policy "flags_insert_own" on public.misbehavior_flags
  for insert with check (auth.uid() = user_id);

create policy "flags_update_admin" on public.misbehavior_flags
  for update using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------- tighten existing resources

-- Content is now behind login: only authenticated users may read material.
drop policy if exists "resources_public_select" on public.resources;
create policy "resources_authenticated_select" on public.resources
  for select using (auth.role() = 'authenticated');

-- Writes were previously allowed for any authenticated user; only admins.
drop policy if exists "resources_authenticated_insert" on public.resources;
create policy "resources_admin_insert" on public.resources
  for insert with check (public.is_admin());

drop policy if exists "resources_authenticated_update" on public.resources;
create policy "resources_admin_update" on public.resources
  for update using (public.is_admin());

drop policy if exists "resources_authenticated_delete" on public.resources;
create policy "resources_admin_delete" on public.resources
  for delete using (public.is_admin());

-- --------------------------------------------------- tighten storage

-- Bucket becomes private: every download is streamed through the app,
-- authenticated and logged. No more public URLs.
update storage.buckets set public = false where id = 'resources';

-- Storage object read: authenticated users only.
drop policy if exists "resources_public_read" on storage.objects;
create policy "resources_authenticated_read" on storage.objects
  for select using (bucket_id = 'resources' and auth.role() = 'authenticated');

-- Storage writes: admins only.
drop policy if exists "resources_authenticated_insert" on storage.objects;
create policy "resources_admin_insert" on storage.objects
  for insert with check (bucket_id = 'resources' and public.is_admin());

drop policy if exists "resources_authenticated_update" on storage.objects;
create policy "resources_admin_update" on storage.objects
  for update using (bucket_id = 'resources' and public.is_admin());

drop policy if exists "resources_authenticated_delete" on storage.objects;
create policy "resources_admin_delete" on storage.objects
  for delete using (bucket_id = 'resources' and public.is_admin());