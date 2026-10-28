-- IT Hub 11 — school events and memory wall
-- Keeps non-academic moments (annual day, sports, tours) separate from study resources.

create table if not exists public.school_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  photo_url text,
  emoji text not null default '🎉',
  event_date date,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.school_events is
  'School memory wall shown on /chapters (photos and moments, not study content).';

create index if not exists school_events_published_idx
  on public.school_events (is_published, event_date desc, created_at desc);
create index if not exists school_events_display_order_idx
  on public.school_events (display_order asc, created_at desc);

alter table public.school_events enable row level security;

create policy "school_events_authenticated_select" on public.school_events
  for select using ((select auth.uid()) is not null and is_published = true);

create policy "school_events_admin_insert" on public.school_events
  for insert with check (public.is_admin());

create policy "school_events_admin_update" on public.school_events
  for update using (public.is_admin()) with check (public.is_admin());

create policy "school_events_admin_delete" on public.school_events
  for delete using (public.is_admin());
