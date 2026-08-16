-- SECURITY DEFINER helpers for the misbehavior rules in src/lib/activity.ts.
-- They are owned by postgres so anon/authenticated can call them without
-- SELECT rights on activity_logs / misbehavior_flags (RLS stays enforced
-- everywhere else).

create or replace function public.count_recent_actions(p_user_id uuid, p_action text, p_window interval)
returns bigint
language sql
security definer
set search_path to 'public'
as $function$
  select count(*) from public.activity_logs
  where user_id = p_user_id
    and action = p_action
    and created_at > now() - p_window
$function$;

create or replace function public.count_recent_failed_logins(p_email text, p_window interval)
returns bigint
language sql
security definer
set search_path to 'public'
as $function$
  select count(*) from public.activity_logs
  where action = 'login_failed'
    and details ->> 'email' = p_email
    and created_at > now() - p_window
$function$;

create or replace function public.flag_failed_logins(p_email text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_count bigint;
  v_user_id uuid;
begin
  select count(*) into v_count from public.activity_logs
  where action = 'login_failed'
    and details ->> 'email' = p_email
    and created_at > now() - interval '10 minutes';

  if v_count >= 3 then
    select id into v_user_id from public.profiles where email = p_email;
    if v_user_id is not null then
      if not exists (
        select 1 from public.misbehavior_flags
        where user_id = v_user_id and type = 'failed_login'
          and created_at > now() - interval '5 minutes'
      ) then
        insert into public.misbehavior_flags (user_id, type, severity, details)
        values (v_user_id, 'failed_login', 'high',
                jsonb_build_object('count', v_count, 'window', '10m', 'email', p_email));
      end if;
    end if;
  end if;
end;
$function$;

grant execute on function public.count_recent_actions(uuid, text, interval) to anon, authenticated;
grant execute on function public.count_recent_failed_logins(text, interval) to anon, authenticated;
grant execute on function public.flag_failed_logins(text) to anon, authenticated;