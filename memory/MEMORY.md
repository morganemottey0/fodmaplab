# FODMAP AI Project Memory

## Project Type
Next.js App Router + NextAuth v5 + Prisma + PostgreSQL. Coaching app for FODMAP diet.

## Roles
- USER / PREMIUM = clients (patients)
- DIETITIAN / ADMIN = diet admin (coach)
Session carries `role` in JWT via `token.role`.

## Key Files
- `auth.ts` — NextAuth config, JWT + session callbacks inject `role`
- `prisma/schema.prisma` — DB schema (PatientWeight model added)
- `app/AppShell.tsx` — wraps sidebar + nav, skips login/register routes
- `components/SideBar.tsx` — role-aware (uses useSession)
- `components/Navigation.tsx` — role-aware mobile bottom nav (uses useSession)
- `hooks/useClientGuard.ts` — redirects DIETITIAN/ADMIN away from client pages
- `middleware.ts` — session-token check, protects all routes including /patients

## Role-based Routing
- DIETITIAN/ADMIN: `/patients` (list), `/patients/[id]` (detail + weight tracking)
- CLIENT: `/`, `/scanner`, `/meal-plan`, `/chat`, `/journal`, `/favorites`
- Home page (`/`) redirects dietitians to `/patients`
- Client pages use `useClientGuard` hook to redirect dietitians

## API Routes
- `GET /api/patients` — list USER/PREMIUM users (dietitian only)
- `GET /api/patients/[id]` — patient detail
- `GET/POST/DELETE /api/patients/[id]/weight` — weight tracking entries

## CSS Patterns
- `gradient-primary page-header` — page headers
- `card` class — content cards
- `btn-primary`, `btn-secondary`, `btn-ghost` — buttons
- `section-label` — section titles
- `label`, `input` — form elements
- CSS variables: `--primary`, `--text-primary`, `--text-muted`, `--surface`, `--border`

## Important Notes
- After schema changes run: `npx prisma db push` or `npx prisma migrate dev`
- Navigation: Sidebar = desktop, Navigation = mobile bottom bar
- Both navigation components are client components using useSession
