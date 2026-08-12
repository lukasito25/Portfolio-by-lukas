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

node scripts/build-doc-templates.mjs   # rebuild templates/*.docx (CV + cover letter)
node scripts/seed-example-brief.mjs    # seed a local /brief/[slug] fixture, prints a preview URL
npx tsx scripts/apply.ts <url|file|->  # generate an application from the terminal

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

Public: `/` (home), `/about`, `/work`, `/projects/[slug]`, `/blog`, `/skills`, `/contact`, `/privacy`. Private recruiter "fit brief" pages (noindex, unlisted, not in nav/sitemap): `/fifa`, `/genius`, `/qualcomm`, `/archlet`, `/launchmetrics`, `/qonto`, `/kraken`, `/ubp`, `/scandit`, `/zalando`, `/rocken` — all hand-built. `/brief/[slug]` renders **generated** briefs from the database (same privacy rules; drafts 404 without `?preview=<token>`). Recruiter personalization: `/r/[slug]`. SEO: `sitemap.xml`, `robots.txt`.

### Recruiter fit-brief pages, geo banners & analytics

Three linked subsystems for the job hunt — fully documented in **`CUSTOM_RECRUITER_PAGES.md`** (and analytics in **`ANALYTICS.md`**):

- **Fit-brief pages** (`src/app/fifa/`, `src/app/genius/`) — private, `noindex`, self-contained pages (`page.tsx` + `layout.tsx` + `content.ts`, EN/IT/DE) that map experience to one job. Cloned per role from the `/fifa` template; `/genius` re-themes the accent via a page-scoped `[data-brand]` override in `globals.css`.
- **Geo campaign banners** — `src/lib/location-campaigns.ts` (config registry, each entry has a required `startsAt` with a hard 2-month auto-expiry) + `src/components/location-campaign-banner.tsx` (bottom-corner banner, homepage only), routing geo-matched visitors to the right fit brief. Geo comes from `middleware.ts` (Vercel edge headers → client-readable cookies).
- **Analytics** — Vercel Web Analytics (`<Analytics/>` in `layout.tsx`) **plus** self-owned tracking: `middleware.ts` captures geo + `?ref=`/UTM + a 90-day returning-visitor cookie → `POST /api/analytics` → Cloudflare Worker `/analytics` → D1. Dashboard at `/admin/analytics` (admin-only) reads `GET /api/analytics` → Worker `/analytics/summary`. Prod-vs-dev storage keys off `NODE_ENV` + `API_SECRET` (the only required Vercel env var; Worker URL has a built-in fallback). The Worker (`cloudflare-api/`, git-ignored) needs a manual `wrangler deploy` when its analytics code changes.

### Application engine (`/admin/applications`)

Turns one job posting into a fit brief (EN/IT/DE), a tailored CV and a cover
letter. Documented in **`CUSTOM_RECRUITER_PAGES.md` §11**; admin UI in `ADMIN.md`.

- **Provider**: his own **agent suite** by default (`~/Documents/Antigravity AI apps/agent-suite` — Gemini 2.5 Pro on his own keys, ~$0.005/application), **deployed on Cloud Run** as service `agent-suite` in project `ai-agent-suite`, region `us-central1`. `AI_PROVIDER=anthropic` switches to Claude (needs `ANTHROPIC_API_KEY`). Implementations in `src/lib/ai/`; `getProvider()` is the only selection point.
- **Where the suite runs decides how it is authorised.** `AGENT_SUITE_URL` unset → `127.0.0.1:8099`, i.e. `./start-local.sh` in the suite repo, no key needed because only that machine can reach it. Set to the Cloud Run URL → `AGENT_SUITE_KEY` becomes mandatory and must equal the service's `API_SECRET_KEY` (`gcloud secrets versions access latest --secret=agent-suite-api-key --project=ai-agent-suite`). The suite enforces this itself: `/api/v1/auth/session` is open on loopback and keyed whenever `K_SERVICE` is set, so a Cloud Run deploy cannot accidentally ship an open door to the Gemini quota.
- **Never send a JWT to Cloud Run in the `Authorization` header.** Its front end sometimes tries to verify a bearer JWT as a Google ID token and rejects the request with an HTML 401 _before the container sees it_ (`The access token could not be verified`) — intermittently, so it survives a first test. The client sends the opaque shared key directly instead; the suite accepts it, and it can never be mistaken for a JWT.
- **Two entry points, one pipeline**: `/admin/applications` in the browser (the normal path, works from Vercel now that the suite is deployed), or `npx tsx scripts/apply.ts <url|file|->` from the terminal (writes .docx to a folder). Both write the same rows.
- **Two passes are mandatory**: Gemini rejects `response_schema` alongside `google_search` (_"Tool use with a response mime type is unsupported"_), so research runs first and structuring second. Anthropic is treated the same way.
- **Extraction is deterministic where possible**: Greenhouse, Lever and Ashby return posting JSON (verified); Personio is written but unverified; everything else falls back to grounded research.
- **Pipeline routes**: four session-gated routes under `src/app/api/admin/brief/` (`extract` → `generate-brief` → `translate` → `generate-documents`), orchestrated in sequence by the client so no single call approaches the function timeout.
- **Edit learning**: `generatedContent` holds the untouched first draft; saving an edit stores the diff, and later generations are shown those pairs. It is the strongest signal of his voice — better than any rule written in advance.
- **Tracking**: `sentSnapshot` freezes exactly what was sent and is never rewritten.
- **Honesty layer, and the reason this is usable at all**: `src/lib/career-facts.ts` is the only source the generator may draw on, `guardrails.ts` encodes the standing rules, and `validate.ts` verifies every citation. Blockers (unknown fact id, invented language level) refuse to publish. **When site content changes, update `career-facts.ts` with it.**
- **Storage**: `GeneratedBrief` — local SQLite in development, D1 elsewhere. Deliberately unlike `/api/campaigns`, which keys on `API_SECRET`: a brief drafted locally must not land in production D1 one click from being published.
- **Public reads go straight to the Worker**, never through `/api/admin-proxy` — see the rule above.
- **Documents**: rendered on demand from `templates/*.docx` via docxtemplater. Rebuild the templates with `node scripts/build-doc-templates.mjs`; their placeholders are the contract with `src/lib/documents/schema.ts`.
- **Generated hero art** is code-drawn and seeded from the slug. Round every computed coordinate — an unrounded `Math.cos` is a hydration mismatch (`/ubp` shipped with one).

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

Copy `.env.example` → `.env`. Key vars: `DATABASE_URL`, `NEXT_PUBLIC_USE_API`, `NEXT_PUBLIC_API_URL` (D1 Worker), `NEXTAUTH_SECRET`/`NEXTAUTH_URL`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `AI_PROVIDER` + `AGENT_SUITE_URL` + `AGENT_SUITE_KEY` (application engine; `ANTHROPIC_API_KEY` only if `AI_PROVIDER=anthropic`), `OPENAI_API_KEY` (unused), `RESEND_API_KEY`/SMTP, `MIXPANEL_TOKEN`.

## Reference docs

Deeper topic docs exist at the repo root: `README.md`, `API.md`, `ADMIN.md`, `ANALYTICS.md`, `BACKEND_SETUP.md`, `DEPLOYMENT.md`, `FEATURES.md`, `AI_FEATURES_SETUP.md`.

## Credentials

The admin user lives in the database (D1 in production, Prisma locally) with a bcrypt hash — `ADMIN_EMAIL` / `ADMIN_PASSWORD` only seed it. **The seed scripts now refuse to run without `ADMIN_PASSWORD`** rather than falling back to a shared default, and they no longer print the password back to the console.

To rotate the production admin password:

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" '<new-password>'
cd cloudflare-api && npx wrangler d1 execute portfolio-db --remote \
  --command "UPDATE User SET password='<hash>', updatedAt=CURRENT_TIMESTAMP WHERE role='ADMIN'"
```

Then confirm with `POST /auth/verify` (200 for the new password, 401 for the old) and update `ADMIN_PASSWORD` in `.env` and in Vercel so future seeds match. Never commit a password or paste one into a doc.
