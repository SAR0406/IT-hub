-- The storage insert policy once required the first path segment of a file
-- name to equal the uploader's UUID, but the app stores files under unit
-- folders (<unit>/<timestamp>-<name>), so every upload was rejected by RLS.
-- Files live under unit folders by design; only the admin check matters.
drop policy if exists "resources_admin_insert" on storage.objects;
create policy "resources_admin_insert" on storage.objects
  for insert with check (
    bucket_id = 'resources'
    and public.is_admin()
  );