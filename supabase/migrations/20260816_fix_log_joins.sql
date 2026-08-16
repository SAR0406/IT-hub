-- Admin queries embed the student profile via PostgREST joins:
--   select *, student:profiles(full_name, email) from activity_logs / misbehavior_flags
-- For that, the FK must point at public.profiles, not auth.users directly.
-- profiles.id itself references auth.users(id) on delete cascade, so cascade
-- semantics are preserved (auth user deleted -> profile gone -> logs/flags gone).

alter table public.activity_logs
  drop constraint if exists activity_logs_user_id_fkey,
  add constraint activity_logs_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.misbehavior_flags
  drop constraint if exists misbehavior_flags_user_id_fkey,
  add constraint misbehavior_flags_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.misbehavior_flags
  drop constraint if exists misbehavior_flags_reviewed_by_fkey,
  add constraint misbehavior_flags_reviewed_by_fkey
    foreign key (reviewed_by) references public.profiles(id) on delete set null;