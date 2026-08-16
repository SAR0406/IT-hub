-- IT Hub 11 — resources table
-- Stores metadata for every study material file. Files live in the
-- "resources" storage bucket; this table only holds their paths.

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size bigint,
  unit_slug text not null,
  topic_slug text,
  resource_type text not null,
  description text,
  created_at timestamptz default now()
);

comment on table public.resources is
  'Study material metadata for Class 11 Information Technology (IT Hub 11).';

create index if not exists resources_title_idx on public.resources (title);
create index if not exists resources_file_name_idx on public.resources (file_name);
create index if not exists resources_unit_slug_idx on public.resources (unit_slug);
create index if not exists resources_topic_slug_idx on public.resources (topic_slug);
create index if not exists resources_created_at_idx on public.resources (created_at desc);

alter table public.resources enable row level security;

-- Students browse without accounts: anyone may read.
create policy "resources_public_select" on public.resources
  for select using (true);

-- Only signed-in admins may add, edit or remove material.
create policy "resources_authenticated_insert" on public.resources
  for insert with check (auth.role() = 'authenticated');

create policy "resources_authenticated_update" on public.resources
  for update using (auth.role() = 'authenticated');

create policy "resources_authenticated_delete" on public.resources
  for delete using (auth.role() = 'authenticated');