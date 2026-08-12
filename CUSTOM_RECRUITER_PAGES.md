# Custom Recruiter Pages — Template Guide

A full map of the `/fifa` page (`src/app/fifa/`), documented so you can clone it into a
new private, role-specific page for any job you apply for.

Live example: https://portfolio-by-lukas.vercel.app/fifa

---

## 1. What this page is

A **private, unlisted, role-specific "fit brief"** — a single scrollable page that maps
your experience against one specific job posting. It is:

- **Not in the nav** (`src/components/ui/navigation.tsx`) and **not in the sitemap**
  (`src/app/sitemap.xml/route.ts`) — reachable only by direct URL.
- **`noindex, nofollow`** — search engines are told to skip it (set in `layout.tsx`).
- **Self-contained** — driven entirely by one local content file. It does **not** touch
  Prisma, the D1 API, or `DataService`. Copy is hardcoded per role.
- **Multilingual** — EN / IT / DE, switched in-page with a toggle (no routing).
- **Motion-rich** — GSAP scroll reveals, a looping video hero, count-up stats, a marquee,
  and an interactive requirement filter. All motion respects `prefers-reduced-motion`.

## 2. File & asset map

Everything for one page lives in three files plus two assets:

```
src/app/fifa/
├── layout.tsx      # Per-page <title>/description + robots noindex (server component)
├── page.tsx        # The UI: all sections + local sub-components (client component)
└── content.ts      # All copy, typed. This is the "fill in the blanks" file.

public/fifa/
├── hero.mp4        # Looping cinematic hero background (~2.3 MB)
└── hero-poster.jpg # Poster frame — shown while video buffers or if motion is reduced
```

It **inherits the root layout** (`src/app/layout.tsx`): the site `Navigation`, `Footer`,
`ScrollProgress` bar, fonts (Geist + Space Grotesk), and `globals.css` design tokens all
come for free. The page never redeclares them.

## 3. The content model (`content.ts`)

`content.ts` is the only file you rewrite per role. It exports one object keyed by locale:

```ts
export const fifaContent: Record<Locale, FifaContent> = { en: {...}, it: {...}, de: {...} }
```

Each locale is a `FifaContent` with these blocks — every field maps to something visible:

| Block                        | Fields                                                                                               | Renders as                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `hero`                       | `eyebrow`, `headlineLead`, `headlineGradient`, `description`, `chips[]`, `stats[]` (`value`+`label`) | Video hero + the overlapping 4-up stat band              |
| `roleMapSection`             | `eyebrow`, `heading`, `items[]` (`id`, `title`, `body`)                                              | "The role, mapped" — numbered list with a sticky heading |
| `profileMatchSection`        | `eyebrow`, `heading`, `panels[]` (`title` + `rows[]`)                                                | "Profile match" — panels of requirement rows             |
| `profileMatchSection…rows[]` | `requirement`, `isMatch` (bool), `tierLabel`, `proof`                                                | One requirement line: badge + evidence                   |
| `football`                   | `chip`, `statusBadge`, `heading`, `body`, `credentials[]`, `closingLine`                             | The domain/"other job" feature panel                     |
| `blockchain`                 | `chip`, `heading`, `body`                                                                            | The "honest about a gap" section                         |
| `closing`                    | `eyebrow`, `heading`, `body`, `credentials[]`, `signature`                                           | Centered closing / "why them" panel                      |

Two values are **derived in `page.tsx`**, not authored:

- The **stat band and marquee** reuse `hero.stats`, `hero.chips`, and `football.credentials`.
- The **filter tally counts** (`matchCount` / `transferCount`) and their labels are computed
  from `rows[].isMatch` and `rows[].tierLabel` — set those correctly and the buttons populate
  themselves.

## 4. Section-by-section anatomy (`page.tsx`)

Top to bottom, with the content field that drives each and the mechanics involved:

1. **Cinematic hero** (`min-h-[100svh]`, always dark) — `HeroVideo` local component layers
   `hero-poster.jpg` (priority image) under `hero.mp4` (autoplay/muted/loop/playsInline),
   fading the video in on `canplay`. Two gradient overlays keep text legible. Shows
   `hero.eyebrow`, the `LocaleToggle`, and the headline (`headlineLead` + accent-colored
   `headlineGradient`) + `description`. A `scroll-hint` chevron sits bottom-right.
2. **Stat band** — a 2×2 / 4×1 grid pulled up `-mt-16` to overlap the hero. Each
   `hero.stats[]` value runs through `<CountUp>` (animates the numeric part on scroll).
3. **Marquee** — infinite horizontal loop of `hero.chips` + `football.credentials`.
4. **The role, mapped** — 12-col grid, left heading is `lg:sticky`. `roleMapSection.items[]`
   render as an auto-numbered (`01, 02…`) list with hover accent + slide.
5. **Profile match** — the interactive section. Two tally buttons filter the rows: clicking
   "Direct match" or "Transferable" dims (`opacity-25`) the rows of the other tier.
   `panels[]` each render a titled card; each row shows `requirement`, a tier badge
   (accent-filled when `isMatch`, outlined otherwise), and `proof`.
6. **Football** — a `panel` with a self-drawing half-pitch SVG (`PitchLines`, animates its
   `strokeDashoffset` on scroll). Shows `chip`, a live `statusBadge` with a `pulse-dot`,
   `heading`, `body`, `credentials[]` chips, and an accent `closingLine`.
7. **Blockchain, honestly** — a deliberately plain two-column section for candidly addressing
   a weaker area. `chip` + `heading` left, `body` right.
8. **Closing** — centered `panel` with a `--hero-vignette` glow, `eyebrow` + `heading` +
   `body`, `credentials[]` chips, and a `signature` line.

## 5. Shared building blocks it depends on

**Motion components** (`src/components/motion/`, all `'use client'`, all honor reduced motion):

- `Reveal` — fade + rise on scroll. `stagger` prop staggers children marked
  `data-reveal-child` instead of the wrapper. Renders as any tag via `as`.
- `CountUp` — animates the numeric portion of a string (`"165M+"`, `"8+"`); non-numeric
  values render as-is.
- `Marquee` — seamless infinite scroller; duplicates its items for the loop.
- `gsap` helper (`src/lib/gsap.ts`) — registers `ScrollTrigger` + `useGSAP`, exports
  `prefersReducedMotion()`.

**Design-system classes / tokens** (`src/app/globals.css`, "Ink & Signal"):

- Classes: `font-display`, `section-label` (mono uppercase eyebrow), `panel`, `chip`,
  `text-gradient`, plus animation classes `pulse-dot`, `scroll-hint`, `marquee-track`.
- Tailwind theme colors: `text-foreground`, `text-secondary-fg`, `text-tertiary-fg`,
  `bg-background`, `border-line`, `bg-accent-soft`, and `text-(--accent)`.
- Accent is **FIFA's brand blue by default, site-wide** (`--accent: #1277d9` light /
  `#4da6ff` dark). See §7 to re-theme per page.

## 6. How to build a new page for another job

Say the next role is at UEFA — target URL `/uefa`:

1. **Copy the folder:** `cp -r src/app/fifa src/app/uefa`.
2. **Rewrite `content.ts`:** keep the `FifaContent` shape (or rename the type/exports to
   something generic — see §7), and replace all copy with the new role's mapping. Keep all
   three locales or trim `locales` in `page.tsx` if you only need EN.
3. **Update `layout.tsx`:** change `title` and `description` to the new role. **Keep
   `robots: { index: false, follow: false }`** so it stays private.
4. **Update `page.tsx`:** rename the component (`FifaFitPage` → `UefaFitPage`) and update the
   import to `./content`. If you renamed exports in step 2, match them here.
5. **Add assets:** drop a `hero.mp4` + `hero-poster.jpg` into `public/uefa/` and update the
   two `src="/fifa/..."` paths in `HeroVideo`. (Reusing the FIFA video? Just point at
   `/fifa/...` and skip new assets.)
6. **Ship.** No route config, DB, or nav change needed — visit `/uefa`. It stays unlisted
   because nothing links to it and it's absent from the sitemap.

> **Leading in a language other than English?** `/rocken` is the reference: `Locale` is
> ordered `'de' | 'en'`, `useState<Locale>('de')` sets the default, the `locales` array puts
> DE first, and the page syncs `document.documentElement.lang` to the active locale in an
> effect (restoring it on unmount) because `src/app/layout.tsx` hard-codes `lang="en"`.
> Claim no CEFR level the owner has not stated — say which languages are his and let the
> page being written in one of them make the point.
>
> **Long page? Trade prose for interaction.** `/zalando` is the reference for a senior reader
> who will not scroll through seven paragraphs: the role map is a card deck on native
> scroll-snap (`overflow-x-auto snap-x snap-mandatory`, arrows + dot indicators derived from
> `scrollLeft`), the spotlight is a short lede plus four numbered pillar cards, and the
> profile-match panels are tabbed so only one set of rows renders. Content-side this needs
> `roleMapSection.hint`, a `tag` per role item and `spotlight.pillars[]` instead of one long
> `spotlight.body`. It cut that page from 18.1 kB to 15.1 kB.
>
> **A brand accent is optional.** Most briefs re-theme to the company's colours via
> `[data-brand='…']`, but that is a choice, not a requirement. `/scandit` runs on the site's
> own Ink & Signal palette and reuses the homepage hero composition (`HeroCanvas` + vignette
>
> - `grain`) — no override, no `data-brand` attribute. Reach for that when the company's
>   palette would fight the site or when a bespoke hero starts to read as generated rather
>   than designed.
>
> **Code-generated hero? Round your coordinates.** Every brief after `/fifa` and `/genius`
> draws its hero in SVG instead of shipping a video. If those coordinates come from
> `Math.cos`/`Math.sin`, round them before they reach the DOM
> (`Math.round(n * 100) / 100`) — Node and the browser can differ in the final bits, and
> React reports the difference as a hydration mismatch in the console. `/ubp` shipped with
> this bug and it was caught in the pre-PR browser check.

## 7. Customization knobs & things to rename

- **The "football" and "blockchain" sections are FIFA-specific by name, not by purpose.**
  `football` = your standout domain credential; `blockchain` = candidly owning a gap. For a
  non-football/non-blockchain role, rename the fields (and the `t.football` / `t.blockchain`
  references in `page.tsx`) to whatever fits — or drop a section by deleting its JSX block.
- **Per-page accent color.** The accent is global (FIFA blue). To brand a page to a different
  company, wrap the page's root `<div>` and override the token inline, e.g.
  `style={{ ['--accent' as string]: '#e2001a' }}` — every `text-(--accent)`, `accent-soft`,
  and badge updates automatically.
- **Fewer languages.** Trim the `locales` array in `page.tsx` and the matching keys in
  `content.ts`; the toggle renders whatever's in `locales`.
- **Reduce/remove video weight.** The hero works with just the poster image — drop the
  `<video>` in `HeroVideo` if you don't have a clip, and it degrades cleanly.
- **No footage that fits? Generate the hero in code.** `/qualcomm` replaces `HeroVideo`
  entirely with `HeroCircuitry` — an inline SVG "PCB" whose traces carry GSAP-animated
  signal pulses over a dark base, so the page ships **zero binary assets**. Same slot, same
  overlays, same reduced-motion contract (static board, no tweens). Copy that component and
  swap the motif when a stock clip would be off-domain (the `/fifa` hero is stadium footage,
  which suits the football briefs and nothing else). Its decorative panel SVG
  (`CircuitLines`, a chip with routed pins) is the `PitchLines` equivalent — same
  self-drawing `strokeDashoffset`-on-scroll mechanic, different subject.
- **Making it a true reusable scaffold.** If you'll do this often, consider renaming
  `FifaContent`/`fifaContent` to `FitBriefContent`/`briefContent` and moving the shared
  `page.tsx` sub-components into `src/components/` so each new role is _only_ a `content.ts`
  file. Happy to do that refactor on request.

## 8. Privacy checklist (per new page)

- [ ] `layout.tsx` has `robots: { index: false, follow: false }`
- [ ] Page is **not** added to `src/components/ui/navigation.tsx`
- [ ] Page is **not** added to `src/app/sitemap.xml/route.ts`
- [ ] You share the URL directly with the recruiter (there's no other way in)

## 9. Geo campaign banners (driving homepage traffic to a fit brief)

A recruiter who lands on the **homepage** first (not the direct link) can be nudged to
the right fit brief with a small, non-invasive banner targeted by the visitor's country.

### Files

- **`src/lib/location-campaigns.ts`** — the campaign registry. One object per campaign.
- **`src/components/location-campaign-banner.tsx`** — the client banner (bottom-right card).
- **`src/middleware.ts`** — resolves Vercel edge geo (`x-vercel-ip-country` / `-city`) into
  short-lived, client-readable cookies (`visitor-country` / `visitor-city`).
- Mounted once in **`src/app/page.tsx`** (`<LocationCampaignBanner />`) — homepage only.

### Managing campaigns — `/admin/campaigns`

Campaigns live in the **`LocationCampaign` table** (D1 in production, Prisma locally) and are
managed from the admin panel — create, edit, activate/deactivate and delete, **no deploy
needed**. Each row shows its real state:

| Badge       | Meaning                                                             |
| ----------- | ------------------------------------------------------------------- |
| **Live**    | Switched on _and_ inside its time window — visitors see it          |
| **Paused**  | Switched off in the panel                                           |
| **Expired** | Switched on but past `startsAt` + 2 months (or an earlier `endsAt`) |

The banner reads `GET /api/campaigns`, which returns only campaigns that are both active and
in-window, cached for 30s at the edge — so a toggle is visible within about half a minute.
Admin writes go through `/api/admin-proxy/campaigns` → Worker `/campaigns` (session-checked
by the proxy, secret-checked by the Worker).

`src/lib/location-campaigns.ts` is still the **seed and the runtime fallback**: if the store
is unreachable or empty, the banner uses the compiled-in list rather than disappearing. The
types and the `MAX_CAMPAIGN_DURATION_MONTHS` cap live there too.

> **Two roles in one country?** The first matching live campaign wins. Pause one rather than
> juggling dates.

### Add a campaign in code (the fallback list)

```ts
// src/lib/location-campaigns.ts → locationCampaigns[]
{
  id: 'uefa-ch',              // stable & unique — also the localStorage dismissal key
  countries: ['CH'],         // ISO 3166-1 alpha-2; add cities?: ['Nyon'] to narrow further
  startsAt: '2026-09-01',    // REQUIRED — YYYY-MM-DD, drives auto-expiry
  eyebrow: 'Recruiting for UEFA?',
  title: 'I mapped my experience to your role.',
  body: 'A short brief for the <role> opening in <city>.',
  ctaLabel: 'See the fit brief',
  href: '/uefa',             // the fit-brief page; banner never shows on this path
}
```

That's it — no component changes. Order entries **most-specific first**; the first active,
matching, non-dismissed campaign wins.

### Behaviour (already built in)

- **Auto-expiry.** `startsAt` is required and every campaign is hard-capped at
  `MAX_CAMPAIGN_DURATION_MONTHS` (2 months). Optional `endsAt` can end it _earlier_ but is
  clamped to the cap — so old banners retire on their own and never clash with new ones.
  Expired entries can stay in the file as a record.
- **Reveal on scroll.** Appears only after the visitor scrolls past (most of) the hero.
- **Dismissible & remembered.** The ✕ persists dismissal in `localStorage`.
- **Never self-targets.** Hidden on its own `href` page.
- **Accessible & motion-safe.** Mounts only when shown (not in the DOM before/after);
  honors `prefers-reduced-motion`; styled with the site's own tokens (uses the homepage
  accent, not a per-page brand override).

### Test locally (Vercel geo headers don't exist off-platform)

- `/?geo=GB` — simulate a UK visitor → scroll → banner
- `/?geo=CH&city=Zurich` — simulate a city
- `/?campaign=<id>` — force-preview a specific campaign (bypasses geo, dismissal, **and** the
  time window) — also the way to preview it in production from the wrong country

### Campaigns as of 2026-07-31

**`/admin/campaigns` is the source of truth** — this table is a snapshot, not something to
keep in sync by hand. To check the live state without opening the panel:
`curl -s https://portfolio-by-lukas.vercel.app/api/campaigns`.

| id                    | Country | Links to         | Starts     | Auto-expires | State      |
| --------------------- | ------- | ---------------- | ---------- | ------------ | ---------- |
| `zalando-de`          | DE      | `/zalando`       | 2026-07-30 | 2026-09-30   | Live       |
| `qonto-de-es`         | ES      | `/qonto`         | 2026-07-28 | 2026-09-28   | Live       |
| `qualcomm-arduino-it` | IT      | `/qualcomm`      | 2026-07-27 | 2026-09-27   | Live       |
| `launchmetrics-fr`    | FR      | `/launchmetrics` | 2026-07-27 | 2026-09-27   | Live       |
| `genius-sports-uk`    | GB      | `/genius`        | 2026-07-25 | 2026-09-25   | Live       |
| `fifa-ch`             | CH      | `/fifa`          | 2026-07-08 | 2026-09-08   | Live       |
| `archlet-es`          | ES      | `/archlet`       | 2026-07-27 | 2026-09-27   | **Paused** |

> **`qonto-de-es` now serves only `ES`.** Germany was handed to `zalando-de` on 2026-07-31 by
> editing Qonto's countries rather than pausing it, so Barcelona traffic still reaches
> `/qonto`. The id keeps its original slug — renaming would mean delete-and-recreate and
> would un-dismiss the banner for anyone who had closed it.
>
> **`/ubp`, `/scandit` and `/rocken` have no campaign**: all three are Swiss-facing and `CH`
> is held by `fifa-ch` until 2026-09-08. They travel by direct link, which is how most briefs
> reach a recruiter anyway.

> **Two roles in one country?** The first matching live campaign wins, so one country can
> only carry one banner. Qonto's offices include Paris and Milan, but `launchmetrics-fr` and
> `qualcomm-arduino-it` hold `FR` and `IT`, so `qonto-de-es` took Berlin and Barcelona
> instead. To hand a country over, pause the incumbent in the panel — that is what the
> switch is for, rather than juggling dates.
>
> Archlet is paused (unsuccessful application) but kept as a record, which is also why `ES`
> was free for Qonto.
>
> **`/ubp` has no campaign**: the role is London / Geneva / Zurich, and `CH` is held by
> `fifa-ch` until 2026-09-08 with `GB` held by `genius-sports-uk` until 2026-09-25. Pause
> one of those to free the country, or share the brief by direct link — which is how most
> of these pages reach a recruiter anyway. **Check the live list before assuming a country
> is free** (`curl -s localhost:3000/api/campaigns`); the table above is a snapshot and the
> array in `src/lib/location-campaigns.ts` is only the fallback seed.

## 10. Analytics — did the recruiter look, and from where?

Two complementary systems track traffic; both are already wired.

### a) Vercel Web Analytics (aggregate, zero-maintenance)

`<Analytics />` is mounted in `src/app/layout.tsx`. The Vercel dashboard shows page views
filterable by path with a country breakdown — the fastest read on "how many visitors from
which country hit `/genius`". Cookieless and privacy-friendly; aggregate only.

The component is already deployed — just enable collection once in the Vercel dashboard
(Project → **Analytics**), then browse the live site; data appears within ~30s. Ad/content
blockers can block the insights script, so verify in a clean browser if it reads zero.

### b) Self-owned dashboard at `/admin/analytics` (detailed + ref attribution)

This is the one that answers **"did _this_ recruiter open the page?"** It records every
page view to the Cloudflare **D1 `Analytics` table** and renders, per page: total views, the
**country** breakdown, and any **`?ref=` tags** used — plus new-vs-returning and recent visits.

Data flow: `middleware.ts` (resolves geo + `?ref=`/UTM + returning-visitor cookie) →
`/api/analytics` (POST) → Cloudflare Worker `/analytics` → D1. The dashboard reads
`/api/analytics` (GET, admin-only) → Worker `/analytics/summary`. The route picks its store
by `NODE_ENV` + `API_SECRET`: **production** → Worker/D1; **local dev** → Prisma/SQLite, so
the dashboard works in dev too.

**Privacy:** raw IP is never stored — only country/city (from the edge) and a hashed-ish
session id.

### Tagged links (`?ref=`) — the flow for every new page

Tag a link by **channel or page**, so you can tell where a visit came from:

```
https://portfolio-by-lukas.vercel.app/genius?ref=recruiter
https://portfolio-by-lukas.vercel.app/fifa?ref=linkedin-post
https://portfolio-by-lukas.vercel.app/archlet?ref=application
```

The dashboard groups views by `ref`, per page. Standard `utm_source` / `utm_medium` /
`utm_campaign` params are captured too (e.g. `?utm_source=linkedin`).

> **Never use a person's name in `ref`.** `/privacy` states that these tags are
> page- and channel-level labels that "do not contain names and are not used to identify
> individual people" — `?ref=jane-smith` would make that statement false, and would turn
> an exempt audience-measurement tag into personal data with the consent obligations that
> follow. Use `recruiter`, `linkedin-post`, `application`, or the company name.

### Returning visitors

A first-party cookie (`pv_seen`, 90-day rolling) flags whether a visitor has been on the site
before. The dashboard shows new-vs-returning and tags returning rows in the recent-visits
list — so a recruiter coming back to re-read a page is visible. Analytics-only; it does not
change what visitors see.

### One-time + per-change Worker deploy

The self-owned analytics lives in the Cloudflare Worker (`cloudflare-api/`, a separate,
git-ignored deployment). After changing it — or the first time — run:

```bash
cd cloudflare-api
# once: add the ref + isReturning columns to the live D1 table
npx wrangler d1 execute portfolio-db --remote --file=migrations/add_analytics_ref_returning.sql
# deploy the Worker (adds the /analytics endpoints)
npx wrangler deploy
```

Vercel Web Analytics and the Next app deploy automatically with the normal git push; only the
Worker needs this manual step. Until it's deployed, the dashboard shows no self-owned data in
production (Vercel Web Analytics still works).

### Production configuration (Vercel env)

The analytics pipeline needs exactly **one** Vercel environment variable:

- **`API_SECRET`** (Production scope) — set to the **same value as the Worker's secret** (your
  local `.env` `API_SECRET`). This is what authorizes the Next route → Worker calls.

The Worker URL is resolved with a built-in fallback
(`https://portfolio-api.hosala-lukas.workers.dev`, matching `api-client` / `admin-proxy`), so
`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_USE_API` are **not** required in Vercel. Prod-vs-dev
storage keys off `NODE_ENV` + presence of `API_SECRET` — not the build-inlined
`NEXT_PUBLIC_USE_API`. After changing this env var, **redeploy** (env changes need a fresh
deployment).

### Troubleshooting

`POST /api/analytics` returns a non-secret `sink` field showing where the write went:

| `sink`             | Meaning                                                              |
| ------------------ | -------------------------------------------------------------------- |
| `worker-ok`        | Written to D1 via the Worker — healthy production state              |
| `worker-<status>`  | Worker rejected it, e.g. `worker-401` = `API_SECRET` mismatch        |
| `prisma-ok`        | Written locally via Prisma (dev)                                     |
| `error:dev-prisma` | Prod route fell through to Prisma → `API_SECRET` missing (misconfig) |

Quick production check:

```bash
curl -sX POST https://portfolio-by-lukas.vercel.app/api/analytics \
  -H 'content-type: application/json' -d '{"path":"/genius","ref":"probe"}'
# → {"success":true,"sink":"worker-ok"}
```

## 11. Generated briefs — the application engine

Sections 1–8 describe how to build a fit brief **by hand**, which is how all
eleven existing ones were made. Since August 2026 there is a second route:
`/admin/applications` takes a job posting and produces the brief, a tailored CV
and a cover letter in one pass.

Both kinds coexist and neither affects the other.

|          | Hand-built (`/fifa`, `/rocken`, …)          | Generated (`/brief/<slug>`)                                   |
| -------- | ------------------------------------------- | ------------------------------------------------------------- |
| Lives in | `src/app/<company>/` — three files          | The `GeneratedBrief` table (D1 in production, SQLite locally) |
| URL      | `/company`                                  | `/brief/company`                                              |
| Layout   | Bespoke per page                            | One shared scaffold, `src/components/fit-brief/`              |
| Hero     | Video, canvas, or a hand-drawn SVG          | Code-drawn motif chosen per company                           |
| Accent   | A `[data-brand='…']` block in `globals.css` | Inline custom properties, no deploy                           |
| Ship     | PR → merge → deploy                         | Live the moment you press Publish                             |
| Best for | A role worth a bespoke page                 | Everything else                                               |

### The flow

1. **Give it the posting** — a URL, a PDF, a screenshot, or pasted text.
   - URL input goes through the model's own `web_fetch`/`web_search` rather than
     a server-side fetch, because ATS pages render client-side. A plain fetch is
     what came back empty on the ABB posting in August.
2. **It writes the brief** in the posting's own language, then translates into
   the other two. A German posting gets a German-first page with English as the
   translation — the `/rocken` precedent, now automatic.
3. **It writes the CV and cover letter**, reusing the brief's judgement so all
   three tell one story: the letter's honest limit is the brief's gap section.
4. **You review**, edit anything, and press **Publish**.

### Privacy — the same guarantees as a hand-built brief

- `robots: { index: false, follow: false }` in `src/app/brief/[slug]/layout.tsx`
- Absent from `src/data/navigation.ts`, `src/app/sitemap.ts` and
  `src/lib/seo.ts`'s `generateSitemap()`
- **Drafts 404** for anyone without `?preview=<token>`, so an unfinished brief
  cannot be found by guessing the URL

### Traceability — why the output is usable

The engine can only draw on `src/lib/career-facts.ts`. Every stat, role-map
item, profile-match proof, CV bullet and cover-letter paragraph carries the fact
ids backing it, and `src/lib/fit-brief/validate.ts` checks them. Anything it
cannot trace becomes a warning in the review screen.

The rules in `src/lib/fit-brief/guardrails.ts` are the corrections already made
by hand during the July run, encoded so they do not have to be made again:

- AI work is framed as **building solutions on Google AI Studio and Vertex AI**,
  never as authoring models
- The MFK Ružomberok scouting role is omitted from non-football applications
- **No CEFR level or fluency claim** for any language — a Spanish brief had to be
  corrected for exactly this
- Turin is ~3 hours away, never less
- The gap section is mandatory
- No personal name in a `?ref=` tag

### Changing the CV template

`templates/cv-template.docx` and `templates/cover-letter-template.docx` are
built by `node scripts/build-doc-templates.mjs`, so the layout is reviewable as
code rather than an opaque binary. The placeholder names are the contract with
`src/lib/documents/schema.ts` — change one and change the other in the same
commit.

To swap in a different design, either edit the script's layout, or mark up a
real `.docx` with the same placeholders and drop it in. House style for the
copy itself lives separately in `src/lib/documents/style-guide.ts`.

### One-time setup

```bash
# The Worker owns the table in production and is git-ignored, so this runs
# BEFORE the app is merged — the app writes columns the Worker must already have
cd cloudflare-api
npx wrangler d1 execute portfolio-db --remote --file=migrations/add_generated_briefs.sql
npx wrangler deploy
```

Then point the app at a generator — see below. Without one the panel replaces
the Generate form with an explanation; nothing else on the site is affected.

### Where the generator runs

The engine calls the agent suite (`~/Documents/Antigravity AI apps/agent-suite`),
a FastAPI app wrapping Gemini 2.5 Pro. It is **deployed on Cloud Run**, which is
what makes `/admin/applications` usable from the deployed site at all: before
that, the Generate button ran on Vercel, `127.0.0.1:8099` was the serverless
container's own loopback, and every attempt returned 503 no matter how healthy
the suite was at home.

|                       | Local                                | Cloud Run                                     |
| --------------------- | ------------------------------------ | --------------------------------------------- |
| `AGENT_SUITE_URL`     | unset → `http://127.0.0.1:8099`      | `https://agent-suite-736pn2fxha-uc.a.run.app` |
| `AGENT_SUITE_KEY`     | not needed                           | **required**                                  |
| Start it              | `./start-local.sh` in the suite repo | always up, scales to zero                     |
| Reachable from Vercel | no                                   | yes                                           |

Two things about it are worth knowing before changing anything:

**The session endpoint is keyed whenever the service is public.** `/api/v1/auth/session`
hands out a 24-hour token that unlocks generation, so on a public URL it is the
front door to the Gemini quota. The suite requires the shared key whenever
`K_SERVICE` is set — Cloud Run sets that itself, so the protection cannot be
forgotten on a deploy — and stays open on loopback, where nothing outside the
machine can reach it. It also refuses to issue sessions at all if no
`API_SECRET_KEY` is configured, rather than falling back to a guessable default.

**Never put a JWT in the `Authorization` header of a Cloud Run request.** Its
front end sometimes tries to verify a bearer JWT as a Google-issued ID token and
rejects the request before the container sees it:

```
The request was not authorized to invoke this service.
The access token could not be verified.
```

It arrives as an HTML 401 that no part of the app can produce, and it is
_intermittent_ — it appeared once during deployment verification and not on
retry. `src/lib/ai/agent-suite.ts` therefore sends the opaque shared key
directly instead of exchanging it for a session JWT. The key has no dots, so
nothing upstream can mistake it for a token, and it removes a round trip per
pipeline step.

### Redeploying the suite

`cloudflare-api/` is not the only sub-project outside the app's git diff — this
one is too. After changing anything in the agent-suite repo:

```bash
cd "/Users/lukashosala/Documents/Antigravity AI apps/agent-suite"
gcloud run deploy agent-suite --project ai-agent-suite --source . --region us-central1 \
  --allow-unauthenticated --memory 2Gi --cpu 1 --timeout 900 --concurrency 10 \
  --min-instances 0 --max-instances 3 \
  --set-env-vars GCP_PROJECT_ID=ai-agent-suite \
  --set-secrets GOOGLE_API_KEY=agent-suite-google-api-key:latest,API_SECRET_KEY=agent-suite-api-key:latest
```

Secrets live in Secret Manager and never enter the image — `.gcloudignore` and
`.dockerignore` both exclude every `.env`. Rotating the shared key means adding a
Secret Manager version, redeploying, and updating `AGENT_SUITE_KEY` in Vercel and
in `.env`; the app will report `rejected AGENT_SUITE_KEY` until all three agree.

Cold start is ~12s (eighteen agents plus the Firestore client), which is why the
health check retries with a longer budget rather than declaring the service down.

### Local development

Generated briefs are stored in **local SQLite** during development and in D1
everywhere else, so drafting an experiment locally cannot put a row in
production. To exercise the route without spending an API call:

```bash
node scripts/seed-example-brief.mjs   # prints a preview URL
```

### No hidden text in anything generated

Every document leaves under his name, so text that carries invisible characters
is a real risk: an ATS or AI-detection tool that finds zero-width characters or
Unicode tag characters does not conclude "a model wrote this", it concludes
"someone is hiding something" — a worse outcome than being thought to have used
AI at all.

`src/lib/ai/sanitize.ts` runs inside `validateAgainstSchema`, so **every**
structured generation is cleaned regardless of provider, before it is stored:

- zero-width spaces and joiners, soft hyphens, stray BOMs, bidi overrides
- **Unicode tag characters** (`U+E0000–U+E007F`) — the standard watermarking
  vector, since an entire message encodes into them and no renderer shows it
- Cyrillic/Greek homoglyphs, mapped back to Latin rather than deleted, because
  `Prоduct` with a Cyrillic _о_ defeats a recruiter's search for "Product"
- non-breaking and exotic spaces, normalised to a plain space

Em dashes, en dashes, curly quotes and accents are deliberately **kept** — they
are visible, correct typography, and stripping them would damage real prose to
chase a stylistic heuristic.

The first real application (aspaara, ~40k characters across CV, cover letter and
brief) was audited by hand and was already clean: no invisible codepoints, no
homoglyphs, no hidden or white or sub-4pt text in the `.docx`, no `docProps`
metadata at all (the templates carry no creator/company field), and none of the
18 banned AI phrases. Its em dashes appear only in structural separators —
education lines, the language list — and never in a bullet or a sentence, which
is where the tell would matter. The sanitizer exists because one clean sample
says nothing about the next generation.

### Edit learning storage

Edits follow the brief they came from: local SQLite in development, D1
everywhere else, chosen by the same `briefStore()` used for briefs. Splitting
them would put the training signal in one database and the material it
describes in another.

This was Prisma-only until the generator moved to Cloud Run. Generation then ran
on Vercel, where `file:./dev.db` does not exist, and the pipeline died on
`prisma.applicationEdit.findMany()` with **SQLite error 14: unable to open the
database file** — a feature that had never run outside a laptop, in a code path
every generation crosses three times.

Two changes, and the second matters more than the first:

- Worker routes `GET /briefs/edits/recent|undistilled|count`,
  `POST /briefs/:id/edits`, `POST /briefs/edits/distilled`, reached through
  `DataService`. Recording replaces any previous row for the same path rather
  than appending — the interesting comparison is always "generated → what he
  settled on".
- **Reads are non-fatal.** Edit learning improves a draft; it is not required to
  produce one. A generation that runs for minutes must never die because an
  optional prompt enrichment could not be fetched. `recentEdits()` logs and
  returns `[]`, and the draft is written as if it were the first ever run.
  Writes still throw, because losing an edit silently would degrade the model's
  picture of his voice with nothing to show why.
