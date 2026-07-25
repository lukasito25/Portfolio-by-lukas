# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Personal portfolio site for Lukáš Hošala (Senior PM). Next.js 15 App Router + React 19 + TypeScript, Tailwind CSS 4, Radix UI. Public marketing/portfolio pages plus a JWT-protected admin CMS. Deployed on Vercel.

## Commands

```bash
npm run dev            # Next dev with Turbopack
npm run build          # bash scripts/build.sh (prisma generate → db push → seed → next build)
npm run start          # production server
npm run lint           # eslint (also: lint:fix)
npm run format         # prettier --write . (also: format:check)
npm run type-check     # tsc --noEmit

npm run db:migrate     # prisma migrate dev
npm run db:seed        # tsx prisma/seed.ts
npm run db:studio      # prisma studio
npm run db:reset       # migrate reset + reseed

npm run test:e2e       # Playwright against local (playwright.config.ts)
npm run test:production # Playwright against production URL (playwright.config.production.ts)
```

Run a single E2E test: `npx playwright test tests/<file>.spec.ts`.

## Architecture

### Hybrid data service (the central pattern)

All data access goes through `src/lib/data-service.ts` (`DataService` class). Each method chooses a source at runtime:

1. **Cloudflare D1 API** via `src/lib/api-client.ts` — used when `NEXT_PUBLIC_USE_API=true`, in production, or in the browser.
2. **Local Prisma / SQLite** (`src/lib/prisma.ts`, `prisma/dev.db`) — server-side fallback in development.
3. **`defaultContent`** in `src/lib/content-config.ts` — static hardcoded content fallback (typed by `SiteContent`) so pages render even with no DB/API.

Key rule: **Prisma is server-only.** In the browser the service throws rather than touching Prisma; the API is the only browser data path. When adding data access, add a method to `DataService`, don't call Prisma or the API client directly from components.

### Backend / API layer

- `src/app/api/*` — Next.js route handlers (contact, projects, analytics, health, auth).
- `src/app/api/admin-proxy/[...path]/route.ts` — proxies admin requests to the Cloudflare Worker API.
- `cloudflare-api/` — separate Cloudflare Workers app (Hono + D1) that serves production data. Has its own `package.json`, `wrangler.toml`, and migrations. **Excluded from the Next.js build** (see webpack ignore in `next.config.ts`). Treat it as a sub-project.

### Database

Prisma schema at `prisma/schema.prisma` (SQLite locally, `output = ../src/generated/prisma`). Models include NextAuth (`Account`/`Session`/`User`/`VerificationToken`), `Project`, `BlogPost`, `Technology`, `Tag`, `ContactSubmission`, `Newsletter`, `Analytics`, `MediaFile`, and the recruiter feature (`RecruiterPage`, `RecruiterPageAnalytics`, `RecruiterPageInteraction`, `CompanyResearch`). The D1 production schema mirrors this via `cloudflare-api/migrations`.

### Auth

NextAuth.js with JWT sessions (no DB adapter) at `src/app/api/auth/[...nextauth]/route.ts`, config in `src/lib/auth.ts`. Admin credentials via `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Admin UI lives under `src/app/admin/*`.

### Routes

Public: `/` (home), `/about`, `/work`, `/projects/[slug]`, `/blog`, `/skills`, `/contact`, `/privacy`, `/fifa`. Recruiter personalization: `/r/[slug]`. SEO: `sitemap.xml`, `robots.txt`.

### Other libs (`src/lib/`)

`analytics.ts` + `personalization.ts` (Mixpanel/recruiter tracking), `email.ts` (Resend/Nodemailer), `seo.ts`, `gsap.ts` (GSAP motion — see `src/components/motion/`), `validations.ts` (Zod), `error-*` (error handling/monitoring), `request-deduplication.ts`.

## Conventions

- Pre-commit hook (Husky + lint-staged) runs Prettier on staged files. `.prettierrc` governs formatting.
- `next.config.ts`: `output: 'standalone'`, ESLint ignored during builds, `cloudflare-api/` excluded from webpack.
- Path alias `@/*` → `src/*` (tsconfig).
- Add remote image hosts to `next.config.ts` `images.remotePatterns` before using them.

## Environment

Copy `.env.example` → `.env`. Key vars: `DATABASE_URL`, `NEXT_PUBLIC_USE_API`, `NEXT_PUBLIC_API_URL` (D1 Worker), `NEXTAUTH_SECRET`/`NEXTAUTH_URL`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `OPENAI_API_KEY`, `RESEND_API_KEY`/SMTP, `MIXPANEL_TOKEN`.

## Reference docs

Deeper topic docs exist at the repo root: `README.md`, `API.md`, `ADMIN.md`, `ANALYTICS.md`, `BACKEND_SETUP.md`, `DEPLOYMENT.md`, `FEATURES.md`, `AI_FEATURES_SETUP.md`.
