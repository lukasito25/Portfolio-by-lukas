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

Second rule: **only authenticated calls go through the proxy.** `src/lib/api-client.ts` routes a browser request to `/api/admin-proxy` when the endpoint starts with `/admin`, or when it is a `/content` **write**. Everything else — including all public `GET /content/:section` reads — goes straight to the Worker, which serves content without auth and already allows this origin via CORS. Routing public reads through the proxy makes every anonymous visitor 401 and silently fall back to `defaultContent`, which is what happened until 2026-07-31.

**The CMS is live.** `homepage`, `about`, `work` and `blog` are stored in the D1 `Content` table (one row per top-level key) and were synced to match `defaultContent` exactly. Whichever you edit, update the other or they drift.

### Backend / API layer

- `src/app/api/*` — Next.js route handlers (contact, projects, analytics, health, auth).
- `src/app/api/admin-proxy/[...path]/route.ts` — proxies admin requests to the Cloudflare Worker API.
- `cloudflare-api/` — separate Cloudflare Workers app (Hono + D1) that serves production data. Has its own `package.json`, `wrangler.toml`, and migrations. **Excluded from the Next.js build** (see webpack ignore in `next.config.ts`). Treat it as a sub-project.

### Database

Prisma schema at `prisma/schema.prisma` (SQLite locally, `output = ../src/generated/prisma`). Models include NextAuth (`Account`/`Session`/`User`/`VerificationToken`), `Project`, `BlogPost`, `Technology`, `Tag`, `ContactSubmission`, `Newsletter`, `Analytics`, `MediaFile`, and the recruiter feature (`RecruiterPage`, `RecruiterPageAnalytics`, `RecruiterPageInteraction`, `CompanyResearch`). The D1 production schema mirrors this via `cloudflare-api/migrations`.

### Auth

NextAuth.js with JWT sessions (no DB adapter) at `src/app/api/auth/[...nextauth]/route.ts`, config in `src/lib/auth.ts`. Admin UI lives under `src/app/admin/*`.

Credentials are **verified against the database**, not against env vars: `authorize()` → `dataService.verifyAdminCredentials()` → D1 `/auth/verify` in production, bcrypt against Prisma locally. `ADMIN_EMAIL` / `ADMIN_PASSWORD` are only read by the **seed scripts** (`prisma/seed.ts`, `scripts/init-production-db.mjs`) that create that user — and they fall back to a weak default if unset, so set them before seeding any environment.

### Routes

Public: `/` (home), `/about`, `/work`, `/projects/[slug]`, `/blog`, `/skills`, `/contact`, `/privacy`. Private recruiter "fit brief" pages (noindex, unlisted, not in nav/sitemap): `/fifa`, `/genius`, `/qualcomm`, `/archlet`, `/launchmetrics`, `/qonto`, `/kraken`, `/ubp`, `/scandit`, `/zalando`, `/rocken`. Recruiter personalization: `/r/[slug]`. SEO: `sitemap.xml`, `robots.txt`.

### Recruiter fit-brief pages, geo banners & analytics

Three linked subsystems for the job hunt — fully documented in **`CUSTOM_RECRUITER_PAGES.md`** (and analytics in **`ANALYTICS.md`**):

- **Fit-brief pages** (`src/app/fifa/`, `src/app/genius/`) — private, `noindex`, self-contained pages (`page.tsx` + `layout.tsx` + `content.ts`, EN/IT/DE) that map experience to one job. Cloned per role from the `/fifa` template; `/genius` re-themes the accent via a page-scoped `[data-brand]` override in `globals.css`.
- **Geo campaign banners** — `src/lib/location-campaigns.ts` (config registry, each entry has a required `startsAt` with a hard 2-month auto-expiry) + `src/components/location-campaign-banner.tsx` (bottom-corner banner, homepage only), routing geo-matched visitors to the right fit brief. Geo comes from `middleware.ts` (Vercel edge headers → client-readable cookies).
- **Analytics** — Vercel Web Analytics (`<Analytics/>` in `layout.tsx`) **plus** self-owned tracking: `middleware.ts` captures geo + `?ref=`/UTM + a 90-day returning-visitor cookie → `POST /api/analytics` → Cloudflare Worker `/analytics` → D1. Dashboard at `/admin/analytics` (admin-only) reads `GET /api/analytics` → Worker `/analytics/summary`. Prod-vs-dev storage keys off `NODE_ENV` + `API_SECRET` (the only required Vercel env var; Worker URL has a built-in fallback). The Worker (`cloudflare-api/`, git-ignored) needs a manual `wrangler deploy` when its analytics code changes.

### Other libs (`src/lib/`)

`analytics.ts` + `personalization.ts` (Mixpanel/recruiter tracking), `email.ts` (Resend/Nodemailer), `seo.ts`, `gsap.ts` (GSAP motion — see `src/components/motion/`), `validations.ts` (Zod), `error-*` (error handling/monitoring), `request-deduplication.ts`.

## Conventions

- Pre-commit hook (Husky + lint-staged) runs Prettier on staged files. `.prettierrc` governs formatting.
- `next.config.ts`: `output: 'standalone'`, ESLint ignored during builds, `cloudflare-api/` excluded from webpack.
- Path alias `@/*` → `src/*` (tsconfig).
- Add remote image hosts to `next.config.ts` `images.remotePatterns` before using them.

## Shipping

Use the **`ship` skill** (`/ship`) for anything going to production — it runs branch → verify → localhost review → PR → merge → deploy → verify live. Project specifics it needs:

- **Branches**: `feat/…`, `fix/…`, `docs/…` off `main`. PRs are **squash-merged**; merging `main` auto-deploys to Vercel. Never push to `main` directly.
- **Verification gate**: `npm run type-check` + `npm run build`. The Playwright suites (`tests/`) contain stale admin specs and are not a ship gate — verify what changed with targeted checks instead.
- **Kill the dev server before `npm run build`.** Both write `.next` and the collision corrupts it; the failure masquerades as a code error. Recovery: kill dev → `rm -rf .next` → rebuild.
- **`cloudflare-api/` is git-ignored** and never appears in a PR diff. If a change touches Worker routes or D1 schema, `wrangler deploy` + apply the migration **before** merging the app — the app writes columns the Worker must already have.
- **Probing production writes analytics rows.** Poll deploys with `HEAD`, or send a `pv_optout=1` cookie. `GET` requests from `curl` are recorded as visits (now classified as bots, but still stored).
- **New fit-brief page checklist**: `noindex` in `layout.tsx`, absent from nav and `sitemap.xml`, `[data-brand]` accent passing WCAG AA in both themes, every claim traceable — see `CUSTOM_RECRUITER_PAGES.md`.
- **Never assert campaign availability from memory.** One country carries one banner, so before proposing or creating a campaign, query the live list — `curl -s localhost:3000/api/campaigns` (or the `/admin/campaigns` panel) — and check the target countries against it. The compiled-in list in `src/lib/location-campaigns.ts` is only the fallback seed and can be out of date.
- **Docs in the same PR**: `CUSTOM_RECRUITER_PAGES.md` for briefs/campaigns, `ANALYTICS.md` for tracking, `ADMIN.md` for admin UI, this file for rules or commands.

## Environment

Copy `.env.example` → `.env`. Key vars: `DATABASE_URL`, `NEXT_PUBLIC_USE_API`, `NEXT_PUBLIC_API_URL` (D1 Worker), `NEXTAUTH_SECRET`/`NEXTAUTH_URL`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `OPENAI_API_KEY`, `RESEND_API_KEY`/SMTP, `MIXPANEL_TOKEN`.

## Reference docs

Deeper topic docs exist at the repo root: `README.md`, `API.md`, `ADMIN.md`, `ANALYTICS.md`, `BACKEND_SETUP.md`, `DEPLOYMENT.md`, `FEATURES.md`, `AI_FEATURES_SETUP.md`.
