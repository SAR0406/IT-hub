-- 5-minute cooldown helper: raiseFlag in src/lib/activity.ts checks this
-- before inserting, so a burst raises one flag, not a flood.

create or replace function public.recent_flag_exists(p_user_id uuid, p_type text, p_window interval)
returns boolean
language sql
security definer
set search_path to 'public'
as $function$
  select exists (
    select 1 from public.misbehavior_flags
    where user_id = p_user_id
      and type = p_type
      and created_at > now() - p_window
  );
$function$;

grant execute on function public.recent_flag_exists(uuid, text, interval) to anon, authenticated;