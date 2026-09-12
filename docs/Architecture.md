# Architecture — Design OS

> Status: Draft

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| UI Primitives | `@base-ui/react` |

## Folder Structure

```
src/
├── app/              # Next.js routes, layouts, and page entry points
├── components/
│   ├── common/       # Shared composite components used across features
│   ├── layout/       # App shell, navigation, page wrappers
│   ├── dashboard/    # Dashboard-specific reusable UI
│   └── ui/           # Design system primitives (shadcn/ui)
├── features/         # Feature modules (auth, dashboard, inspiration, etc.)
├── hooks/            # Shared React hooks
├── lib/              # Pure utilities and helpers
├── services/         # API clients and external integrations
├── types/            # Shared TypeScript types
└── styles/           # Global and shared stylesheets
```

## Conventions

- **Features** own business logic, feature-specific hooks, and feature UI composition.
- **Components** are reusable and presentational; avoid feature logic in `ui/`.
- **Services** handle all external data access; no fetch calls directly in components.
- **Types** shared across features live in `src/types/`; feature-local types stay in the feature folder.

## Data Flow

<!-- Document request flow: UI → hooks/features → services → API -->

## Key Decisions

<!-- Record architectural decisions and rationale. -->
