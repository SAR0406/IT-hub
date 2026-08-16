-- Best-practice hardening pass:
-- 1. RLS initplan optimization: (select auth.uid()) evaluates once per query
--    instead of per row (performance advisor lint 0003).
-- 2. Merge the two activity_logs INSERT policies into one auditable policy
--    (kills the multiple_permissive_policies warning; behavior unchanged).
-- 3. Index the reviewed_by FK (unindexed_foreign_keys lint 0001).
-- 4. Revoke EXECUTE from PUBLIC on the app's SECURITY DEFINER functions —
--    anon/authenticated keep execution (the app calls them under the user
--    session; storage policies call is_admin() under the request role).

-- --- 1 + 2: rewritten policies ----------------------------------------------

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using ((select auth.uid()) = id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check ((select auth.uid()) = id);

drop policy if exists "logs_insert_own" on public.activity_logs;
drop policy if exists "logs_insert_guest_failed_login" on public.activity_logs;
drop policy if exists "logs_insert_owner_or_guest_failure" on public.activity_logs;
create policy "logs_insert_owner_or_guest_failure" on public.activity_logs
  for insert with check (
    (select auth.uid()) = user_id
    or (user_id is null and action = 'login_failed')
  );

drop policy if exists "flags_insert_own" on public.misbehavior_flags;
create policy "flags_insert_own" on public.misbehavior_flags
  for insert with check ((select auth.uid()) = user_id);

drop policy if exists "resources_authenticated_select" on public.resources;
create policy "resources_authenticated_select" on public.resources
  for select using ((select auth.uid()) is not null);

-- --- 3: index the reviewed_by FK --------------------------------------------

create index if not exists flags_reviewed_by_idx
  on public.misbehavior_flags (reviewed_by);

-- --- 4: tighten function grants ----------------------------------------------

revoke execute on function public.is_admin() from public;
revoke execute on function public.count_recent_actions(uuid, text, interval) from public;
revoke execute on function public.count_recent_failed_logins(text, interval) from public;
revoke execute on function public.flag_failed_logins(text) from public;
revoke execute on function public.recent_flag_exists(uuid, text, interval) from public;