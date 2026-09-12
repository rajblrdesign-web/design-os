-- Design OS: initial schema
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create extension if not exists "pgcrypto";

create table if not exists public.inspirations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  url text not null,
  company text not null,
  industry text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.inspirations enable row level security;

-- MVP: open access for internal dev. Replace with auth-based policies later.
create policy "inspirations_select_anon"
  on public.inspirations for select
  to anon, authenticated
  using (true);

create policy "inspirations_insert_anon"
  on public.inspirations for insert
  to anon, authenticated
  with check (true);

create policy "inspirations_update_anon"
  on public.inspirations for update
  to anon, authenticated
  using (true);

create policy "inspirations_delete_anon"
  on public.inspirations for delete
  to anon, authenticated
  using (true);

create index if not exists inspirations_created_at_idx
  on public.inspirations (created_at desc);

create index if not exists inspirations_industry_idx
  on public.inspirations (industry);

-- Seed data (optional — skip if you prefer an empty library)
insert into public.inspirations (title, image_url, url, company, industry, tags)
values
  (
    'Minimal SaaS Dashboard',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'https://linear.app',
    'Linear',
    'UI Design',
    array['Dashboard', 'Analytics']
  ),
  (
    'Brand Identity System',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    'https://stripe.com',
    'Stripe',
    'Branding',
    array['Identity', 'Guidelines']
  ),
  (
    'Mobile Banking App',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    'https://revolut.com',
    'Revolut',
    'Mobile',
    array['Fintech', 'iOS']
  ),
  (
    'Marketing Landing Page',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
    'https://vercel.com',
    'Vercel',
    'Web',
    array['Landing', 'Marketing']
  ),
  (
    'Editorial Typography',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://notion.so',
    'Notion',
    'Typography',
    array['Editorial', 'Type']
  ),
  (
    'Design System Components',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    'https://supabase.com',
    'Supabase',
    'UI Design',
    array['Components', 'System']
  );
