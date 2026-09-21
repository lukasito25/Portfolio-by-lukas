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

node scripts/build-doc-fonts.mjs       # subset Geist into templates/fonts/ (run first)
node scripts/build-doc-templates.mjs   # rebuild templates/*-template.docx (the classic pair)
node scripts/build-doc-variants.mjs    # rebuild the five .docx design variants
npx tsx scripts/preview-doc-variants.ts  # render every variant with a sample into doc-previews/
node scripts/check-doc-text.mjs        # assert what an ATS reads out of each design
node scripts/check-doc-clean.mjs       # assert no tool fingerprint or hidden characters
node scripts/preview-cv-pdf.mjs        # render the sample CV + letter as PDFs, both designs
node scripts/check-pdf-text.mjs        # assert what an ATS reads out of each PDF design, in order
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
- **Overnight search**: saved searches (`SavedSearch`) run on a **Cloudflare Worker cron** that ticks hourly and pokes `POST /api/cron/job-search`; the app decides what is due via `isDue()`. The cron lives on the Worker because **Vercel is on the Hobby plan** — 2 cron jobs, once a day — which would collapse per-search frequency into on/off. `requireCronSecret()` in `src/lib/fit-brief/server.ts` is the repo's **first inbound secret gate**: `API_SECRET` had only ever authenticated Next → Worker. Guard rails: auto-pause after 5 empty runs, `JOB_SEARCH_MONTHLY_CAP_USD` summed from `ScheduledRun`, and a failure email because silence looks like a quiet job market. A failed run must not advance `lastRunAt`. See `CUSTOM_RECRUITER_PAGES.md` §13.
- **One pipeline, two entry points**: `src/lib/job-search/run-search.ts` is called by both the manual route and the cron route. Do not inline a second copy — a scheduled run that diverged from the button produces plausible output nobody is watching.
- **Finding the postings**: the **Search** tab takes job titles, locations and an optional salary floor and returns scored leads — grounded sweep → structure → verify every URL → triage score → `JobLead` (D1/SQLite by the same `briefStore()`). Documented in `CUSTOM_RECRUITER_PAGES.md` §12. Three rules it encodes: **never ask the research pass to quote a posting verbatim** (Gemini's recitation guard returns an empty response, which the suite reports as `object of type 'NoneType' has no len()`); a liveness badge must come from an actual request, and `unverified` never becomes `gone`; and an upsert must never overwrite a lead's `state`, or a dismissed posting comes back on the next search.
- **Two passes are mandatory**: Gemini rejects `response_schema` alongside `google_search` (_"Tool use with a response mime type is unsupported"_), so research runs first and structuring second. Anthropic is treated the same way.
- **Extraction is deterministic where possible**: Greenhouse, Lever and Ashby return posting JSON (verified); Personio is written but unverified; everything else falls back to grounded research.
- **Pipeline routes**: four session-gated routes under `src/app/api/admin/brief/` (`extract` → `generate-brief` → `translate` → `generate-documents`), orchestrated in sequence by the client so no single call approaches the function timeout.
- **Edit learning**: `generatedContent` holds the untouched first draft; saving an edit stores the diff, and later generations are shown those pairs. It is the strongest signal of his voice — better than any rule written in advance.
- **Tracking**: `sentSnapshot` freezes exactly what was sent and is never rewritten.
- **Fit score**: `POST /api/admin/brief/[id]/fit-score` estimates the chance of a first interview, calibrated to say no. Its bands and blocker rules (`SCORE_BANDS`, `HARD_BLOCKER_RULES`, `HARD_BLOCKER_CEILING`) are exported and shared with the search's lead score — change them in one place, not two. Part arithmetic (direct-match count from the brief's own rows, shown next to the score), part judgement; a hard blocker — missing work authorisation, an unstated required language, a two-level seniority gap — caps it at 19 in both the prompt and the route. See `src/lib/fit-brief/fit-score.ts`.
- **Nothing after a successful save may throw.** The PUT records training pairs and backfills baselines _after_ writing the document; both are wrapped. An unwrapped throw returns 500 over work that is already persisted, and the user retypes it. This has happened once — a stale Worker answering `Nothing to update`.
- **Honesty layer, and the reason this is usable at all**: `src/lib/career-facts.ts` is the only source the generator may draw on, `guardrails.ts` encodes the standing rules, and `validate.ts` verifies every citation. Blockers (unknown fact id, invented language level) refuse to publish. **When site content changes, update `career-facts.ts` with it.**
- **Storage**: `GeneratedBrief`, `JobLead`, `SavedSearch` and `ScheduledRun` — local SQLite in development, D1 elsewhere. Deliberately unlike `/api/campaigns`, which keys on `API_SECRET`: a brief drafted locally must not land in production D1 one click from being published.
- **Public reads go straight to the Worker**, never through `/api/admin-proxy` — see the rule above.
- **Documents**: rendered on demand from `templates/*.docx` via docxtemplater. Rebuild the classic pair with `node scripts/build-doc-templates.mjs`; their placeholders are the contract with `src/lib/documents/schema.ts`.
- **Document designs** carry the site's Ink & Signal tokens onto paper. Six registered in `src/lib/documents/variants.ts` — `classic`, `rule`, `panel`, `field`, `dossier`, `column` — selected per download with `?variant=`. **One default per format**: `DEFAULT_DOC_VARIANT = classic` for the .docx upload, `DEFAULT_PDF_VARIANT = column` for the PDF a person reads; `defaultVariantFor(format)` is the only place that mapping lives. The palette lives once, in `src/lib/documents/ink.json`, because both renderers read it.
- **Which one to send is decided per posting**, not by preference: `src/lib/documents/recommend.ts` is rule-based and explainable — the ATS the posting sits on (and whether it is a modern parser or a legacy one), the country (photo or no photo), the sector (conservative → `rule` for both formats), company size (startup with no ATS → a person reads it → attach the PDF). It returns a design per format (`byFormat`), which format to attach, and the reasons in the order the rules fired. The panel's two download buttons follow it unless the picker forces one design for both; the reasons show under the fit score. When a rule misfires, fix the rule; do not add a model call.
- **Two formats, two readers.** `?format=pdf` renders through `src/lib/documents/pdf/cv.tsx` (@react-pdf/renderer); anything else renders .docx. Every variant has a PDF design: the five single-column ones are themes of one document in `pdf/single.tsx` (letterhead, heading treatment, page ground and accent are all a theme may change; the body is shared), and `column` is the dark-rail two-column page modelled on the résumé he sent by hand (`pdf/column.tsx`). `column` takes its headshot from `templates/photo.jpg` (committed 2026-09-21; replace the file to change it) and `?photo=0` drops it per download (the switch — a "Photo in PDF" checkbox in the panel, disabled with the reason when no file is on disk). Three react-pdf traps, each silent: a unitless `lineHeight` on a style with no `fontSize` of its own resolves against the 18pt default and triples the leading; `alignItems: 'baseline'` misplaces a row whose text has nested spans; gradients ignore `stopOpacity`, so a fade is drawn in colour stops. The .docx is what goes into an ATS — measured 2026 parser testing puts single-column .docx at 97.4% field extraction against 71.2% for two-column PDF, while Greenhouse/Lever/Workday parse text PDFs as cleanly and older Taleo/iCIMS do not. The PDF is what goes to a person. **`tsx` cannot run the PDF renderer** — it fails to resolve `@react-pdf/hyphenate/en-us` through a `"./*"` export pattern; Node and the Next bundler both can, which is why `scripts/preview-cv-pdf.mjs` esbuild-bundles and runs under plain Node.
- **The documents are set in Geist**, subsetted by `scripts/build-doc-fonts.mjs` into `templates/fonts/` (SIL OFL 1.1; the licence must travel with the font) and embedded — obfuscated `.odttf` per ECMA-376 §17.8.1, `w:altName` = Arial for readers that ignore embedding, which includes Word for Mac. Three traps, all of which produce a document that opens fine and silently uses the wrong font: **font relationships belong to `word/_rels/fontTable.xml.rels`**, not the document's; the key bytes are the GUID's hex pairs read **backwards**; and the face must be named on the **runs**, not only in `docDefaults`, because Google Docs and LibreOffice ignore `rPrDefault`. Space Grotesk was tried and dropped — see `scripts/doc-fonts.mjs`.
- **Five rules for the documents:**
  - **Nothing but artwork goes in a header.** Text there is invisible to a good share of ATS. A page background must be an anchored picture, never `w:background` alone: Word does not print page colours unless the reader has turned that on.
  - **`column` is the only variant that uses a table**, and so the only one whose text does not come out in reading order — a parser walks cells row-major, so the rail precedes the main column. Its letterhead sits _above_ the table for that reason.
  - **`check-doc-text.mjs`, `check-doc-clean.mjs` and `check-pdf-text.mjs` are the gates**, not comments. The first asserts the .docx ATS invariants; the second asserts no tool fingerprint, no hidden characters, no homoglyphs, no `docProps/app.xml`; the third asserts what a parser reads out of each PDF **and in what order** — a PDF has no columns, only a drawing order, so the `column` design draws the rail between the name and the body to be read name → contact → education → skills → summary → experience. All three have negative controls — a regression here looks right in every preview.
  - **`pdfkit` needs an explicit trace include.** It loads its built-in fonts through a package `#imports` subpath (`require('#standard-fonts/Helvetica')`), which Next's file tracer does not follow; without `outputFileTracingIncludes` for the document route the lambda ships without `pdfkit/js/standard-fonts/` and every PDF download dies at module load. It shipped that way once. Proving a PDF works means rendering from `.next/standalone/` alone — the preview scripts run against full `node_modules` and cannot catch it.
  - **Tracking in a PDF stays under ~0.08em.** Past that, pdf.js and a good share of parsers read the glyph gaps as spaces and a heading extracts as `S U M M A R Y`. The `dossier` labels were shipped at 0.19em and the gate caught it.
  - **`highlights` and `phone` on `CvContentSchema` must stay `.default(…)`.** Required would break five `safeParse` call sites for every CV generated before they existed — two of them silently. And **the admin editor reads the stored JSON, not a parsed `CvContent`**, so defaults do not apply there: read any field added after launch with `?? []` / `?? ''`. `value.highlights.map` on a pre-band CV took `/admin/applications` down in production once.
  - **Language levels are stated, never invented.** The corpus records Slovak native, English C2, Italian B2 and no German level; `validate.ts` flags any other level. The schema and prompts say the same — an earlier wording ("never levels") contradicted the validator.
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
- **Verification gate**: `npm run type-check` + `npm run build`. `npm run lint` parses TypeScript again since 2026-09-21 (Next's flat config); it reports warnings only and is not a gate. The Playwright suites (`tests/`) contain stale admin specs and are not a ship gate — verify what changed with targeted checks instead.
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
