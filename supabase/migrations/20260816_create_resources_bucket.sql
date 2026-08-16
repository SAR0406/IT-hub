-- Private bucket for study material. Files are streamed through the app
-- (/api/files/[id]/open|download), which checks the session and logs actions,
-- so the bucket itself is never public. File size limit: 25 MB.
insert into storage.buckets (id, name, public, file_size_limit)
values ('resources', 'resources', false, 26214400)
on conflict (id) do nothing;