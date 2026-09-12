# Database — Design OS

> Status: Active (Supabase)

## Overview

Design OS uses **Supabase** (PostgreSQL) for persistent storage.

## Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` → `.env.local` and add your API credentials
3. Run migrations in **SQL Editor**:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_collections.sql`

## Tables

### `inspirations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `title` | text | Inspiration title |
| `image_url` | text | Cover image URL |
| `url` | text | External link |
| `company` | text | Company name |
| `industry` | text | Industry badge |
| `tags` | text[] | Tag list |
| `created_at` | timestamptz | Created timestamp |

### `collections`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `name` | text | Collection name |
| `description` | text | Optional description |
| `created_at` | timestamptz | Created timestamp |

### `collection_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `collection_id` | uuid | FK → `collections.id` |
| `inspiration_id` | uuid | FK → `inspirations.id` |
| `created_at` | timestamptz | Added timestamp |

Unique constraint on `(collection_id, inspiration_id)`.

## Row Level Security

MVP policies allow anonymous read/write for internal development.

**Before production:** replace with auth-based policies tied to `auth.uid()`.

## Services

| Service | Path |
|---------|------|
| Inspirations | `src/services/inspiration-service.ts` |
| Collections | `src/services/collection-service.ts` |

## Pending tables

- `favorites` — after Auth (currently in localStorage)
- `users` — via Supabase Auth
