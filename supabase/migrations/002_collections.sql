-- Design OS: collections schema
-- Run in Supabase SQL Editor after 001_initial_schema.sql

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  inspiration_id uuid not null references public.inspirations (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, inspiration_id)
);

alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

-- MVP: open access for internal dev. Replace with auth-based policies later.
create policy "collections_select_anon"
  on public.collections for select
  to anon, authenticated
  using (true);

create policy "collections_insert_anon"
  on public.collections for insert
  to anon, authenticated
  with check (true);

create policy "collections_update_anon"
  on public.collections for update
  to anon, authenticated
  using (true);

create policy "collections_delete_anon"
  on public.collections for delete
  to anon, authenticated
  using (true);

create policy "collection_items_select_anon"
  on public.collection_items for select
  to anon, authenticated
  using (true);

create policy "collection_items_insert_anon"
  on public.collection_items for insert
  to anon, authenticated
  with check (true);

create policy "collection_items_delete_anon"
  on public.collection_items for delete
  to anon, authenticated
  using (true);

create index if not exists collections_created_at_idx
  on public.collections (created_at desc);

create index if not exists collection_items_collection_id_idx
  on public.collection_items (collection_id);

create index if not exists collection_items_inspiration_id_idx
  on public.collection_items (inspiration_id);
