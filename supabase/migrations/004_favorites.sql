-- Design OS: favorites
-- Run in Supabase SQL Editor after 003_inspiration_storage.sql

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  inspiration_id uuid not null references public.inspirations(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, inspiration_id)
);

create index if not exists favorites_client_id_idx
  on public.favorites (client_id);

alter table public.favorites enable row level security;

-- MVP: open access for internal dev. Replace with auth-based policies later.
create policy "favorites_select_anon"
  on public.favorites for select
  to anon, authenticated
  using (true);

create policy "favorites_insert_anon"
  on public.favorites for insert
  to anon, authenticated
  with check (true);

create policy "favorites_delete_anon"
  on public.favorites for delete
  to anon, authenticated
  using (true);
