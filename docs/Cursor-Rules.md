# Design OS — Cursor Development Rules

## Project Overview

Design OS is an internal SaaS platform for designers.

The MVP focuses on the Inspiration Library.

The application must feel like a premium modern SaaS product.

---

## Technology Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL
- Vercel

---

## Development Principles

- Always build reusable components.
- Never duplicate UI.
- Prefer composition over large files.
- Keep components focused on one responsibility.
- Business logic should never live inside UI components.

---

## Folder Structure

```
app/
components/
features/
hooks/
lib/
services/
types/
```

All application code lives under `src/` in this repository.

---

## Component Guidelines

Use PascalCase.

Examples:

- `AppShell.tsx`
- `Sidebar.tsx`
- `TopNavigation.tsx`
- `InspirationCard.tsx`
- `SearchBar.tsx`
- `CollectionCard.tsx`

---

## Component Size

**Target:** 50–150 lines.

**Maximum:** 250 lines.

Split into smaller components whenever appropriate.

---

## Styling

- Use Tailwind CSS only.
- Do not use CSS modules.
- Do not use inline styles.
- Use CSS variables for colors.

---

## UI Components

Always use shadcn/ui whenever possible.

Prefer:

- Button
- Card
- Input
- Dialog
- Dropdown Menu
- Badge
- Avatar
- Tabs
- Sheet
- Toast
- Separator

Create custom components only when necessary.

---

## Layout

- Desktop first
- Responsive
- Mobile navigation uses Sheet component
- Sidebar collapses on tablet/mobile
- Top navigation remains fixed

---

## Spacing

Use an 8px spacing system.

Allowed values:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

---

## Border Radius

| Size | Value |
|------|-------|
| Small | 8 |
| Medium | 12 |
| Large | 16 |

---

## Typography

**Font:** Geist

**Hierarchy:**

- Heading XL
- Heading L
- Heading M
- Body
- Caption

---

## Icons

Use Lucide React only.

---

## Colors

Use semantic tokens.

Examples:

- Primary
- Secondary
- Muted
- Accent
- Destructive

Avoid hardcoded colors.

---

## State Handling

Every page should support:

- Loading
- Empty
- Error
- Success

---

## Data Fetching

- Server Components by default.
- Client Components only when interaction is required.

---

## Forms

- React Hook Form
- Zod Validation

---

## API

- Use Supabase.
- Never call SQL directly from components.
- Create reusable service functions.

---

## Naming

**Good:**

- `getInspirations()`
- `createCollection()`

**Bad:**

- `fetchStuff()`
- `dataFunction()`

---

## Code Quality

- Use TypeScript everywhere.
- No `any` types.
- Prefer interfaces.
- Use meaningful variable names.

---

## Comments

- Only comment complex logic.
- Avoid obvious comments.

---

## Accessibility

- Use semantic HTML.
- Keyboard navigation.
- Proper labels.
- Visible focus states.

---

## Performance

- Lazy load where appropriate.
- Optimize images.
- Avoid unnecessary re-renders.

---

## Reusability

If UI appears twice, extract a component.

---

## Before Creating New Components

Always check:

- `components/ui`
- `components/common`

before creating a new one.

---

## Git

- Small commits.
- One feature per commit.

---

## Sprint Strategy

- Build only the requested sprint.
- Never implement future features.
- Keep the codebase simple.

---

## Design Philosophy

- Minimal
- Premium
- Fast
- Modern SaaS
- Clean whitespace
- Consistent spacing
- Readable typography
- No unnecessary animations
- Animations should be subtle and purposeful

---

## Design Rules

- Follow an 8px spacing system.
- Use consistent visual hierarchy.
- Avoid visual clutter.
- Prefer whitespace over borders.
- Cards should use subtle elevation.
- Do not use more than two accent colors.
- Keep interactions simple.

Every page should have:

- Page title
- Short description (if applicable)
- Primary action
- Secondary actions
- Clear empty state

Prefer dashboards that feel like:

- Linear
- Notion
- Vercel
- Supabase
- Stripe Dashboard

Do not imitate Material Design.

Avoid heavy gradients.

Avoid excessive glassmorphism.

The interface should feel calm, professional, and enterprise-ready.

---

## References

- [Architecture](./Architecture.md)
- [PRD](./PRD.md)
- [Roadmap](./Roadmap.md)
- [Sprint 01](./Sprint-01.md)
