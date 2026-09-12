-- Design OS: inspiration image storage
-- Run in Supabase SQL Editor after 002_collections.sql

insert into storage.buckets (id, name, public)
values ('inspirations', 'inspirations', true)
on conflict (id) do nothing;

create policy "inspirations_storage_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'inspirations');

create policy "inspirations_storage_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'inspirations');

create policy "inspirations_storage_update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'inspirations');

create policy "inspirations_storage_delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'inspirations');
