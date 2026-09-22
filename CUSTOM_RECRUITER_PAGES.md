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
| Hero     | Video, canvas, or a hand-drawn SVG          | Code-drawn motif, or footage for a brief worth it (below)     |
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

`templates/cv-template.docx` and `templates/cover-letter-template.docx` (the
`classic` pair) are built by `node scripts/build-doc-templates.mjs`; the five
other designs by `node scripts/build-doc-variants.mjs`. Both scripts draw on
`scripts/doc-kit.mjs` — the paragraph, run, tab-grid, table and stat-band
builders — so the layout is reviewable as code rather than an opaque binary,
and a block that every design needs (the stat band, the letterhead's contact
lines) exists once. The placeholder names are the contract with
`src/lib/documents/schema.ts` — change one and change the other in the same
commit, and rebuild.

To swap in a different design, either edit a script's layout, or mark up a
real `.docx` with the same placeholders and drop it in. House style for the
copy itself lives separately in `src/lib/documents/style-guide.ts`.

### The gates — `npm run check:docs`

One command renders the previews and runs every document check, in this order.
Run it before any PR that touches `src/lib/documents/`, `templates/` or the
document scripts; each check has negative controls, because a regression in
any of them looks right in every preview.

| Check                         | Asserts                                                                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-doc-text.mjs`          | The .docx designs: no text in a header; `rule`/`panel`/`field` token-identical to `classic`; `dossier` and `column` exactly classic's words; section order stated |
| `check-doc-clean.mjs`         | No tool fingerprint, hidden character, homoglyph, `docProps/app.xml`, PNG text chunk or zip comment in any .docx                                                  |
| `check-pdf-text.mjs`          | Every PDF design: name first, every heading on its own line, email once, no word lost, and in the declared reading order                                          |
| `check-pdf-pagination.mjs`    | A CV three times the sample, every design, four bullet counts (24 renders): no page ends with a bullet glyph or a heading, none begins mid-sentence               |
| `check-doc-recommendation.ts` | `recommendDocument` for seven postings, one per rule — the design per format, which format to attach, the reader, and that the intended rule's reason fired       |

### Document designs

The documents carry the same visual language as the portfolio and the fit-brief
pages: the Ink & Signal tokens from `globals.css`, applied to paper. Six
designs are registered in `src/lib/documents/variants.ts` and built by
`node scripts/build-doc-variants.mjs`:

| id        | what it does                                                                                                                                                                                                  | cost   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `classic` | the original plain template; the .docx default                                                                                                                                                                | —      |
| `rule`    | typographic only — accent section labels at the site's `.section-label` tracking, hairline rules, the ink and grey scale. No images, white page                                                               | none   |
| `panel`   | the site's panel language — a flat `--background` paper tone behind the page, a filled letterhead block with an accent edge, section headings in tinted bars                                                  | ~5 KB  |
| `field`   | the brief pages on paper — the hero vignette and the gradient-signal rule, drawn from the same tokens the briefs use, behind the text on every page                                                           | ~33 KB |
| `dossier` | the brief page as a sheet of paper — a dark hero band, the four-up stat band under it, dates hard right against a tab stop, a spine down each role's bullets. Restructured, still one column, still no tables | ~5 KB  |
| `column`  | the agency two-column CV — a shaded rail for skills, languages and education beside the summary and experience. **The only variant that uses a table**. As a PDF, the dark-rail page below                    | ~5 KB  |

Pick one per download with `?variant=` on
`/api/admin/brief/<id>/document`, or from the picker next to Download in
`/admin/applications`. `npx tsx scripts/preview-doc-variants.ts` renders all of
them with a realistic sample into `doc-previews/` — through `renderCv` and
`renderCoverLetter`, not through docxtemplater directly, so a prototype cannot
look right in the preview and break in the download.

### Typeface

The documents are set in **Geist**, the site's own body face, subsetted by
`node scripts/build-doc-fonts.mjs` into `templates/fonts/` and embedded in the
file. Calibri was the previous choice, on the reasoning that "the site's fonts
are not on a recruiter's machine" — true for a document that only _names_ a
font, but a `.docx` and a PDF can both carry one, so the constraint was never
real. Calibri is the Microsoft default, and a default typeface is the loudest
signal that a document came out of a word processor.

Licence: SIL OFL 1.1, which permits embedding and requires the licence text to
travel with the font — hence `templates/fonts/Geist-OFL.txt`.

Three OOXML traps, each of which produces a document that opens without
complaint and silently uses the wrong font:

- **Font relationships belong to `word/_rels/fontTable.xml.rels`**, not to
  `document.xml.rels`. The `r:id` values inside `fontTable.xml` resolve against
  the font table's own rels.
- **The obfuscation key is the GUID's hex pairs read backwards** (ECMA-376
  §17.8.1), XORed over the first 32 bytes. Forwards produces a valid package
  Word refuses to use.
- **Name the face on the runs**, not only in `docDefaults`. Google Docs,
  LibreOffice and other consumers ignore `rPrDefault` and fall back to their own
  default.

`w:altName` is Arial, and that is not arbitrary: Next.js generates a
metric-matched fallback for Geist against Arial at `size-adjust: 104.76%`.
Word for Windows honours embedded fonts; **Word for Mac may not**, so `altName`
is what decides the substitute rather than leaving it to the reader's Word.

Space Grotesk, the site's display face, was tried and dropped — the only source
that ships it embeddably is a woff2 that must be decompressed to TrueType, and
the result would not paint despite passing Chrome's font sanitiser. `globals.css`
already names Geist as the display fallback, so this is the site's own second
choice. See `scripts/doc-fonts.mjs`.

### Two formats, two readers

`?format=pdf` on the download route renders through
`src/lib/documents/pdf/cv.tsx`; anything else renders `.docx`. Same
`CvContent`, so the two can never disagree about what they say. Every variant
has a PDF design, chosen by the same `variant` as the `.docx`. The five
single-column ones — `classic`, `rule`, `panel`, `field`, `dossier` — are
themes of one document in `src/lib/documents/pdf/single.tsx`: the body is the
same component in the same order for all five, and a theme may change only the
letterhead, the section heading, the page ground and the accent. That split is
deliberate: a recruiter compares designs on the top third of the page and a
parser does not care about any of it. `column` is the dark-rail page described
under "The column PDF" below. Each design's cover letter shares its CV's
letterhead exactly.

Shared across the six: dates hard right on the title line; the contact block
on two lines (where and how to reach him, then the links — one line wrapped a
URL at its hyphen once the phone joined it); a heading never strands at a page
foot (`minPresenceAhead`), a role header keeps at least two bullets with it,
and **a bullet never splits** (`wrap={false}` — a production PDF once ended
page one with a lone "•" and began page two with its sentence); a page number
only when there is a second page; tracking under ~0.08em (see below). The
page-break rules are checked by rendering a three-times-longer CV with the
bullet count varied so the break lands in different places: no page may end
with a bullet glyph or a heading, or begin mid-sentence.

Three react-pdf traps, each of which renders without an error: a unitless
`lineHeight` on a style with no `fontSize` of its own is resolved against the
library's 18pt default rather than the inherited size, and the page triples its
leading; `alignItems: 'baseline'` misplaces a flex row whose text has nested
spans, so rows align by their tops with matched line heights instead; and
gradients ignore `stopOpacity`, so `field`'s vignette fades in colour stops
down to the paper.

|         | goes to                      | why                                                                                                                                                                                         |
| ------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.docx` | an applicant tracking system | Measured 2026 parser testing: single-column `.docx` extracts 97.4% of fields, two-column PDF 71.2%. Greenhouse, Lever and Workday parse text PDFs as cleanly; older Taleo and iCIMS do not. |
| PDF     | a person                     | Embeds its fonts by definition and lays out identically everywhere, so the design does not have to survive a negotiation with someone else's word processor.                                |

**`tsx` cannot run the PDF renderer.** It fails to resolve
`@react-pdf/hyphenate/en-us`, which is reached through a `"./*"` export
pattern, with ERR_PACKAGE_PATH_NOT_EXPORTED. Node's own resolver handles it and
so does the Next bundler — verified: react-pdf is present in the built
`document/route.js`, and `templates/fonts/` is traced into
`.next/standalone/`. So `scripts/preview-cv-pdf.mjs` esbuild-bundles the
component (JSX automatic runtime, packages external) and runs it under plain
Node.

### Which document to send

Six designs and two formats is a decision per application, and the evidence
is already on the brief. `src/lib/documents/recommend.ts` makes the call and
lists its reasons; the panel's download buttons follow it and the reasons show
under the fit score. It is rule-based on purpose — a rule can be audited, and
when the recommendation is wrong the reason it gives names the signal that
misfired.

It starts from one default per format (`variants.ts`): **`classic` for the
.docx** — the plainest single-column page, the one nothing in a parser has ever
mis-read — and **`column` for the PDF**, the dark-rail page with the photo,
chosen from rendered previews of all six. The rules then adjust:

| Signal          | Read from                        | Decides                                                                                                                                                                               |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tracking system | `sourceUrl` hostname             | A parser reads it first → attach the .docx. Greenhouse/Lever/Ashby/Workday/SmartRecruiters read text PDFs cleanly; Taleo/iCIMS/SuccessFactors do not                                  |
| Country         | `jobSpec.countryCode`            | DACH, IT, FR, ES and most of central Europe expect a photo; UK/IE/US/CA/NL/Nordics discourage one — the reasons say to send `column` without `templates/photo.jpg`, or pick `dossier` |
| Sector          | company context, title, keywords | Banking, insurance, consulting, public sector, pharma, legal → `rule` for both formats                                                                                                |
| Company size    | company context                  | Startup/scale-up with no ATS → a person reads it → attach the PDF; enterprise → assume a parser                                                                                       |
| Nothing         | —                                | the defaults, attach the .docx, low confidence                                                                                                                                        |

The output is `byFormat` (a design for each format — both are always
downloadable), `attach` (which format goes on the application), the reader
(`parser` / `person` / `unknown`), the ATS profile when recognised, and a
confidence. The picker in the panel overrides it by forcing one design for
both formats.

### The column PDF

`src/lib/documents/pdf/column.tsx` is the two-column résumé he had been sending
by hand, rebuilt from `CvContent`: a charcoal rail with a round photo, boxed
section labels and the reference material — contact, education, skills,
languages — beside a white column with the name set very large in the heaviest
cut of Geist, the summary and the experience. The cover letter shares the rail
and the name block, with contact only.

What the reference has that this drops: the second page of portfolio
screenshots, the tools list, the hobbies and the references. None of it is in
`CvContent`, and the screenshots in particular are text a parser cannot read
and a person cannot verify. The portfolio link in the contact block stands in
for them.

A two-column PDF is the layout an ATS parses worst (71.2% field extraction in
the 2026 testing above), so the design does everything a layout can do to stay
readable, and `node scripts/check-pdf-text.mjs` asserts each of these:

- **The content stream is a parser's order, not the visual one.** A PDF has no
  columns; a parser reads text in the order it was drawn. The rail is drawn
  _between_ the name block and the body, so extraction reads name → contact →
  education → skills → languages → summary → experience. Name and contact
  first, every heading on a line of its own, nothing interleaved.
- **The rail content is drawn once**, on the first page; only its dark
  background repeats. A rail repeated per page would put the email address in
  the text twice.
- **Nothing textual is an image.** The photo carries no text and the contact
  icons are vector strokes with no glyphs in them.
- **Tracking stays under ~0.08em.** Past that pdf.js — and so a good share of
  parsers — reads the gaps between glyphs as spaces, and `SUMMARY` extracts as
  `S U M M A R Y`, which is no heading at all. The `dossier` labels shipped at
  0.19em; the gate caught it and they were brought down.

The photo has a source and a switch. The source is the square headshot at
`templates/photo.jpg` (600×600, composited onto the rail colour, committed
2026-09-21 — replace the file to change it), read at render time. The switch is per download: `?photo=0` on the document
route, which the panel exposes as **Photo in PDF** whenever the PDF design is
`column`. Whether a CV should carry a photo differs by country and by
recruiter — expected in DACH and Italy, a liability in the UK and US — so the
recommender's reasons say which applies and the checkbox is where the choice
is made. `/api/admin/brief/health` reports `hasPhoto` so the panel can disable
the checkbox, with the reason, when no file is on disk. Without a file the
rail simply starts at Contact. `scripts/preview-cv-pdf.mjs` uses
`doc-previews/photo.jpg` for the preview when one is there.

The .docx gates render Word's reading order; this one uses `pdf-parse` (pdf.js)
on the previews `preview-cv-pdf.mjs` writes, so run that first. Negative
controls: a rail drawn last, a contact block repeated, a heading lost and a
word lost all fail.

### Nothing in these files identifies a tool

An audit of every generated document found no trace of any model or tool: no
`docProps/app.xml`, no RSIDs, no zip comment, no PNG text chunks, and no hidden
characters — `sanitizeDeep` is on the generation path for every provider via
`validateAgainstSchema`.

Two things were changed to keep that true rather than merely observed:

- **The review-screen PUT now sanitises.** It validated and stored edits without
  it, so text _pasted_ into the panel from another tool reached the `.docx`
  unsanitised. Generated text was never the risk; pasted text was.
- **`docProps/core.xml` names the author.** A `.docx` with no metadata at all is
  itself unusual and tells anyone who unzips it that a script produced the file.
  There is deliberately no `app.xml` — that part declares
  `<Application>Microsoft Office Word</Application>`, which would be untrue.

`node scripts/check-doc-clean.mjs` asserts all of it: fingerprints in XML and in
raw bytes, invisible characters (including both variation-selector blocks, which
a negative control caught this check missing), homoglyphs, `app.xml`, the
`dc:creator` name, PNG text chunks and zip comments. It has negative controls —
plant a zero-width space, a Cyrillic "а", a tag character or a model name and it
fails.

### The two-column trade

`column` is the one design whose text does not come out in reading order. A
parser walks table cells row-major, so the rail is extracted first:

    Skills → Languages → Education → Certifications → Summary → Work Experience

Everything is present and every heading survives, but experience arrives last.
Two things keep that survivable, and both are deliberate:

- **The letterhead and stat band sit above the table**, as ordinary full-width
  paragraphs. A name inside the main cell would be extracted after every skill
  in the rail; this way name, headline and contact are still read first.
- **`RAIL_SIDE` in `scripts/build-doc-variants.mjs` is a constant.** Flip it to
  `'right'` and summary and experience come out ahead of the rail — strictly
  better for parsing, at the cost of the more familiar left-rail look.

Whether the trade is worth it depends on where the application is going: a
direct-to-hiring-manager email and a Workday portal are not the same bet. The
other five designs make no such trade, which is why `column` is a choice rather
than a default.

### Contact and languages

The contact line on every design is location · phone · email · links, from the
`contact.*` facts verbatim — the generator once invented a LinkedIn handle,
which is why they are facts. `phone` was added 2026-09-21 and is `.default('')`
on the schema for the same reason `highlights` is (below); the editor reads
`value.phone ?? ''` because it works on the stored JSON, not a parsed CV.

Languages carry the level the corpus states — Slovak native, English C2,
Italian B2 — and never one it does not; German has no level and is not listed.
`validate.ts` enforces exactly that. The schema description and the prompt
used to say "never levels", which contradicted both the validator and his own
CV; they now agree.

### The stat band

The four-up band under the letterhead of every design comes from `highlights`
on `CvContentSchema` — the same device as the brief pages' `HeroStatSchema`,
fact-cited like every other claim and audited by `collectCvCitations`.

The field is `.default([])`, not required, and that is load-bearing: five call
sites `safeParse` a stored CV, and a CV generated before the field existed would
otherwise fail all of them — two of them silently, stopping warnings being
recomputed and dropping the edit-learning training pair with no error anywhere.
Such a brief simply renders no band: `{#hasHighlights}` drops it, rule and all.

It is a **tab grid, not a table** — one paragraph of tab-separated runs against
tab stops, which an ATS reads as two ordinary lines. `renderCv` supplies four
fixed slots rather than a list because a docxtemplater loop cannot run inside a
paragraph. It lives once, in `scripts/doc-kit.mjs`, and every `.docx` design
carries it — `classic` in ink, the rest in the accent — since 2026-09-21, when
a CV with highlights downloaded as a `.docx` without them.

Four constraints shaped these, and a new design has to respect all four:

- **The text stream is identical in every variant**, in the same order, and none
  of them puts a character in a header, a text box or a table. An ATS reads the
  same document whichever is chosen; only a person sees the difference. The
  invariant is checkable — extract every `<w:t>` from every part and compare.
- **A page background must be an anchored picture in the header**, behind the
  text, which is the mechanism Word's own watermark uses. `w:background` alone
  is not printed unless the reader has enabled "Print background colors and
  images", and most PDF exports drop it. Set both; rely on the picture.
- **Noise is incompressible.** The site's `.grain` overlay costs 481 KB as
  per-pixel noise on an A4 page and 29 KB as the dither pattern of a smooth
  gradient quantised to 64 colours, which reads the same at print size. See
  `scripts/doc-background.mjs`.
- **The fonts travel with the file.** Geist is subsetted and embedded — see
  "Typeface" above — so the document is set in the same face on every machine.

The one text difference the variants introduced: the cover letter's letterhead
now repeats the CV's headline, so the two documents in one application open with
the same block. `classic` has no `{headline}` placeholder and is unaffected.

`node scripts/check-doc-text.mjs` asserts all of this against the rendered
previews rather than trusting it, because a regression here would be invisible
in every preview — the document would look right and parse wrong. It checks
three different promises: `rule`, `panel` and `field` must produce a token
sequence _identical_ to `classic`; `dossier` must lose no word and must keep the
section order; `column` must lose no word, and its section order is printed so
the trade above is decided on evidence. It fails if any variant puts a single
character of text in a header.

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

### Ask for a change — and the other two languages

`/admin/applications` has a refine box on each of the three documents: say what
you want changed, read the diff, accept or reject. Nothing is written until
Accept, and the accept goes through the ordinary `PUT`, so the revision is
re-validated, the checks are recomputed and the training pair is recorded with
the instruction attached. The route deliberately does not save: a model edit
that reached a file he downloads without anyone reading it would defeat the
point of the review screen.

**A revision lands in every language, not just the one on screen.** Until
September 2026 it did not: `POST /briefs/:id/refine` took one locale, proposed
for that locale, and the accept wrote that key alone. The Italian and German
copies kept the old wording and drifted a little further from the English with
every refinement — invisible unless you switched the toggle, because each page
reads as finished in whatever language you happen to open. These are pages sent
to recruiters in Zurich; a German version quietly out of date with the English
is exactly the kind of error the honesty layer exists to prevent elsewhere.

**Mirrored, not re-translated.** After the source locale comes back, each other
locale gets its own call with two things: its own current text, and the fields
that moved in the source, before and after. It applies the equivalent change in
its own language and returns everything else byte-identical. Re-translating the
revised document wholesale would have been one call cheaper and would have
overwritten whatever had already been edited by hand in Italian or German —
which is the work the edit-learning loop most wants to keep. The instruction
travels with the diff as well, because "cut the hedging" is a register
judgement that has to be made in German to be made at all.

Three things fall out of that:

- **A locale that fails is named, not fatal.** Its mirror is skipped, the panel
  says which one, and Accept writes the ones that did come back. A German
  failure must not throw away a good revision and a good Italian mirror.
- **A locale that does not exist yet is skipped silently**, and a document that
  exists in one language costs exactly what it did before — one call.
- **Only locales that actually moved are written.** A mirror that came back
  identical is left as stored rather than rewritten with an equal object, which
  would record an empty training pair and make the save look like it did more
  than it did.

The panel shows the locale you asked in expanded and the mirrors folded away,
and the button says what it will do — "Accept 3 changes in 3 languages".
Measured on a full brief: about two minutes and roughly three times the tokens
of a single-locale refine, which is the price of the three documents actually
agreeing with each other.

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

### Is this one worth the hour?

The engine made applying cheap, and cheap applying is how a job hunt turns into
unpaid data entry. `/admin/applications` therefore scores each application on
its likelihood of reaching a **first interview** — not of getting the job — and
is calibrated to say no.

Two things stop it being a vanity number.

**Part of it is arithmetic, not judgement.** `coverage()` in
`src/lib/fit-brief/fit-score.ts` counts, from the brief's own requirement rows,
how many are marked a direct match rather than transferable. Those markings were
written under the honesty rules and are shown beneath the score, so the sum is
auditable: a 70 sitting on 2-of-9 must-haves is self-evidently wrong.

**Hard blockers cap it at 19**, in the prompt and again in the route. Missing
work authorisation, a required language he has not stated, a two-level seniority
gap, a mandatory degree or licence. Relocation alone is not a blocker — it goes
in the risk list.

The bands: **75+** strong (rare by design), **45–74** credible — where most
worthwhile applications sit, **20–44** stretch, **0–19** long shot.

It is deliberately **not** a gauge or a progress bar. A bar three-tenths full
reads as failure, and 45% is a perfectly good application; a design that makes a
realistic score feel like a bad one would push toward applying to everything,
which is the behaviour this exists to prevent.

First real run, on the aspaara posting: **5%, skip** — the posting's seventh
must-have is "Fluency in German is required", which he has not stated. Correct,
and an hour saved.

Scoring runs on demand (`POST /api/admin/brief/[id]/fit-score`) rather than
during generation: it costs a model call, and the answer only moves when the
posting or the brief does.

### Anything after the save must not be able to undo it

`PUT /api/admin/brief/[id]` writes the document, then records training pairs and
backfills the document baseline. Both of those run **after** a successful write,
and both are wrapped, because a throw there returns 500 over a change that is
already persisted — the panel says "Could not save changes" and the work gets
retyped despite never being lost.

That is exactly what happened: the Worker had not been redeployed with the
baseline columns, answered `Nothing to update`, and every Accept in the refine
box reported failure while saving correctly.

**`cloudflare-api/` is git-ignored, so a stale Worker never shows up in a diff
or a build.** When a change touches Worker fields, deploy it and verify the new
field round-trips before assuming the app is at fault.

### A video hero for a generated brief

A generated brief draws its hero in code and ships no binary assets, which is
what lets it go live the moment you press Publish. A few roles are worth more
than that — a clip that puts the company's world on screen the way `/fifa`
does with its stadium. `/brief/fifa` and `/brief/on` have one.

**The mapping lives in code, not in the database.** `src/lib/fit-brief/hero-media.ts`
maps a slug to its two files, and `/brief/[slug]` passes `heroMediaFor(slug)`
straight through. The clip has to be committed under `public/brief/<slug>/` and
deployed anyway, so a URL stored in `brand` would only pretend to be decoupled
from the deploy; keeping it in code also keeps the generator out of it, since
the model never sees a video field it could invent. **Adding an entry here is
the one change to a generated brief that needs a PR.**

**A clip replaces the motif; it does not layer over it.** The two were drawn
together first, and the result was worse: a real scene already carries the
company, and lines over it only compete with the copy. `brand.motif` still
draws the hero of every brief without footage, and still appears beside the
spotlight further down every page.

**Producing the two files** — `scripts/build-hero-video.sh <slug> <clip> [start] [duration]`
trims, loops, encodes under a ~2.5 MB cap (stepping the quantiser until it
fits) and cuts the poster from the encoded loop's **first frame**. That last
part is not cosmetic: the poster is what the video fades in over, and any
other frame shows as a jump. Two loop modes, and the choice is not free:
`HERO_XFADE` crossfades the tail into the head, which suits drifting clouds
and light; `HERO_LOOP=pingpong` plays the segment forward then backward, which
is what an **orbiting** camera needs — dissolving an orbit into itself
superimposes two angles of the same stand. The FIFA clip is a ping-pong for
exactly that reason.

**Footage is free stock (Pexels), and the source and licence go in the
registry entry's `credit` field.** Reject anything with readable sponsor
branding, on-screen text or identifiable faces, and anything whose motion is
too fast to loop.

**Text over footage needs more headroom than text over a flat background.**
`hero-video.tsx` lays a 50% flat tint and a bottom gradient in the clip's own
darkest tone (`ground`), and the hero carries `dark text-foreground` so every
token flips for that section only — `text-foreground` is not redundant, since
`color` inherits from the body as an already-resolved value. On top of that,
`[data-hero-video]` mixes the accent 60% toward white and lifts the two muted
tones. Those numbers were measured, not guessed: sampled across every frame of
both clips, they put the eyebrow, headline and description at WCAG AA over the
brightest frame. The stock values (40% tint, the site's muted tones) left the
eyebrow at 2.9:1 on the stadium. **Re-measure when you add a clip**, especially
a bright one — the Matterhorn is what set these.

---

## 12. Finding the postings — the automatic search

Section 11 describes an engine that only works **backwards**: you must already
have found a posting, and you hand it a URL, a PDF or pasted text. Finding it
was still a matter of trawling LinkedIn, StepStone and careers pages by hand,
which is the part of a job hunt that costs the most hours for the least
judgement.

The **Search** tab in `/admin/applications` is the missing front half. Say what
you are looking for; get back real postings, checked and scored. Anything worth
an hour goes into the same pipeline as before, unchanged.

### The pipeline

```
criteria { titles[], locations[], salaryMin?, workModel?, seniority? }
   ↓  research    provider.research()  — grounded, prose out
   ↓  structure   JobHitListSchema     — prose into rows
   ↓  verify      a real request to every URL
   ↓  dedupe      on the normalised url, and against briefs already written
   ↓  score       one triage call for the whole set
   ↓  persist     JobLead, upserted on url
```

### Depth: one sweep per title × location

The first version asked a single grounded call to cover every title across every
location, and returned 3–10 postings of which roughly 60% were already taken
down — perhaps four roles worth opening. The model was not failing; it was
answering a broad question broadly.

`src/lib/job-search/sweeps.ts` splits the criteria into one sweep per title ×
location pair, capped at 8, and runs them concurrently. Measured on the same
Milan/remote-Italy criteria:

|                       | Before | After  |
| --------------------- | ------ | ------ |
| Raw hits              | 4      | 21     |
| Surviving the filters | 0      | 20     |
| **Applicable**        | **0**  | **12** |
| Wall-clock            | 91s    | 160s   |
| Cost                  | $0.002 | $0.009 |

Concurrency is 8 — enough that the widest search still fits in one wave, because
two waves of four put a wide search near the 300s function ceiling. Raising it
does **not** raise the 429 risk: the suite's limit is a _daily call cap_, and
fanning out changes when calls happen, not how many.

Two failure rules earn their place, both learned from the first version:

- **One sweep failing must not lose the others.** With eight in flight the odds
  that one misbehaves are eight times what they were, and failing the whole
  search over one bad sweep would make the deeper version less reliable than the
  shallow one it replaces. Failures are counted and named in the coverage note.
- **When every sweep fails, the original error is re-thrown, not a summary.** A
  first attempt replaced it with "the generator is reachable but not
  answering" — which, against a dead port, was an actively wrong diagnosis.
  `ProviderUnavailableError` already names the URL and the command that fixes
  it, and `generationError()` turns it into a 503 rather than a 500.

Sweeps also have a **start deadline** of 170s: a sweep launched after that
cannot finish inside the budget, and a run killed mid-flight loses the sweeps
that did succeed. Late ones are abandoned, counted and reported.

### Cost and timing

Three model calls per sweep pair, about **$0.005–0.03** a search on the agent
suite, and **100–160 seconds**. Measured, on a Milan sweep:

| Phase               | Time | Share |
| ------------------- | ---- | ----- |
| research (grounded) | ~30s | 30%   |
| structure           | ~30s | 30%   |
| verify (all URLs)   | ~1s  | 1%    |
| triage score        | ~40s | 40%   |

**Essentially all of it is model time, and it does not respond to tuning.**
Two things were tried and measured rather than assumed:

- Halving the scoring prompt (16.6k → 8.7k characters, −19% tokens) moved the
  total from 106s to 103s. Latency is Gemini's thinking time, not input size.
  The smaller prompt was kept anyway — it costs less and loses nothing, since
  triage cites no fact ids.
- Merging the structure and triage passes into one call — legal, since neither
  needs search — made it **slower**: 79s for the combined call against 65s for
  the two split, because each row has to carry twice the output. The split
  stays.

So the wait is irreducible and the panel shows an elapsed clock rather than a
staged progress bar, which would have to invent which phase it was in.

The route's `maxDuration` is 300s. A wide search does not clear that by much;
if it ever times out, narrow the titles rather than raising the ceiling.

Research and structuring are two calls for the same reason the extract route
splits them: Gemini rejects `response_schema` alongside `google_search`.

### The score is not the fit score

Two numbers now exist and they are deliberately different depths:

|          | Lead score                                  | Fit score                                            |
| -------- | ------------------------------------------- | ---------------------------------------------------- |
| Runs     | during a search, before anything is written | on demand, after the brief exists                    |
| Reads    | what the search could see of the posting    | the posting **and** the brief's own requirement rows |
| Costs    | one call for all results                    | one call per application                             |
| Lives in | `src/lib/job-search/lead-score.ts`          | `src/lib/fit-brief/fit-score.ts`                     |
| Answers  | is this worth opening?                      | is this worth an hour?                               |

They share their calibration on purpose: `SCORE_BANDS`, `HARD_BLOCKER_RULES`
and `HARD_BLOCKER_CEILING` are exported from `fit-score.ts` and interpolated
into both prompts. The moment the two drift, a lead scored 60 that becomes a
brief scored 40 looks like the application got worse when only the scale moved.

The lead score is biased toward "skip", because a false skip costs a posting he
does not apply to and a false apply costs an hour and a generation. The panel
labels it as a triage number and says the real one runs later.

### The badges are checked, not claimed

The whole saving here is not opening twenty tabs, and it evaporates the moment
a badge cannot be trusted. So `src/lib/job-search/verify.ts` makes a real
request to every URL and reports one of three answers:

- **Verified live** — an ATS returned the posting (reusing `fetchAtsPosting()`,
  the same lookup the extract route runs), or the URL answered 2xx.
- **Posting gone** — 404 or 410. Common: four of eight results in a German
  sweep were stale index entries, all four confirmed dead by hand.
- **Could not verify** — anything else. A timeout, a 403, a bot wall. This is
  its own answer and never becomes "gone": LinkedIn and Indeed refuse
  server-side requests as a matter of course, and calling a live posting dead
  would send him past the best result on the page.

Two filters run before a badge can be earned, both written against URLs that
actually came back from real searches:

- `isPostingUrl()` rejects a bare origin, a listing index (`/de/stellenangebote?term=`
  — a search page with an empty query, which answers 200), and domain-parking
  hosts. A sweep returned `hugedomains.com/domain_profile.cfm?d=primaindustries.com`
  for a real company: it answers 200, so a liveness check alone would have
  stamped it live.
- `isRedirector()` lets Gemini's grounding redirects through the _pre-fetch_
  filter, because their destination is the posting. They are judged again,
  strictly, on the resolved URL.

### Do not ask the research pass to quote a posting

`SEARCH_SYSTEM` asks for requirements **condensed, not quoted**, and that reads
like a style preference. It is not. Asking Gemini to reproduce a posting's
requirements verbatim reliably returns an empty response: the recitation guard
fires, the candidate comes back with no text part, and the agent suite surfaces
it as `object of type 'NoneType' has no len()` — a Python error from `len(None)`
that says nothing about what happened.

Measured, not guessed. Same criteria, same system prompt:

| Prompt asks for                          | Result            |
| ---------------------------------------- | ----------------- |
| a plain list of postings + URLs          | OK, 8–15s         |
| one line each: company, location, salary | OK, 15s           |
| **the stated requirements**              | **empty, 18–70s** |
| requirements _condensed_                 | OK, 30–46s        |

This is the opposite of the extract prompt, which does insist on verbatim
`sourceQuotes` — and the difference is safe because these lines only feed the
triage score. Anything he applies to is re-read from the posting itself by
`/api/admin/brief/extract` before a word of the brief is written.

### Storage

`JobLead` — local SQLite in development, D1 elsewhere, chosen by the same
`briefStore()` as briefs. Splitting them would show a lead in a list whose
Generate button writes to a different database.

Upsert is keyed on the normalised URL, and **`state` and `briefId` are never
overwritten**. The same posting resurfaces on every search that matches it; a
re-run must not multiply the list and must not resurrect something already
dismissed. Everything else is refreshed, because a posting and its score can
genuinely move.

Dismissed leads collapse into a disclosure rather than vanishing, so it is
visible that a repeat search did not put them back.

**"Only postings still open" is on by default**, and it filters `gone` only.
That distinction is the whole point: `gone` is a 404, while `unverified` is
usually LinkedIn or Indeed refusing a server-side request for a posting that is
perfectly live, so folding the two together would quietly hide the boards with
the most postings on them. The checkbox names how many it is hiding rather than
shrinking the list silently.

It earns its place — of 31 stored leads, 19 were dead, which is seven pages of
results cut to three. That ratio is worth watching: a grounded sweep reports
what an index knows, and job boards expire postings faster than they are
reindexed.

### Handing a lead to the generator

`generate()` in `ApplicationsClient` takes an optional handoff. Everything after
the payload is built is identical for both entry points on purpose: a lead is
not a second kind of application, it is the same application with the finding
step done for you, and the moment the two paths diverge they start drifting.

Two details:

- The lead carries a **fallback text** of what the search captured. A posting
  can be taken down between the search and the click, and a dead URL would
  otherwise waste a four-minute run — so extraction falls back to the captured
  summary, and says so, because a brief written from a summary is thinner than
  one written from the posting.
- Linking the lead to the brief it became runs **last and wrapped**. The brief
  is written by that point, and a throw there would report failure over work
  that is already saved — the same shape of mistake the brief PUT route had to
  fix.

### One-time setup

```bash
# The Worker owns the table in production and is git-ignored, so this runs
# BEFORE the app is merged.
cd cloudflare-api
npx wrangler d1 execute portfolio-db --remote --file=migrations/add_job_leads.sql
npx wrangler deploy
```

---

## 13. The overnight scheduler

§12 describes a search you press a button for. That still competes with the part
of the day he could spend writing applications, so a saved search runs itself
and the morning starts with results instead of a two-minute wait.

### Why the cron lives on Cloudflare and not on Vercel

The account is on the Vercel **Hobby** plan, which allows **two cron jobs at
once-a-day granularity**. That collapses a per-search frequency into "on or
off", and puts every search in the same nightly batch.

A Worker cron trigger is free, ticks as often as it likes, and the Worker
already owns the D1 database. So:

```
Cloudflare Worker, hourly tick
  └─ POST {APP_URL}/api/cron/job-search
       Authorization: Bearer <API_SECRET>
          └─ the app decides what is actually due
```

**Hourly is the tick, not the frequency.** Each saved search carries its own
`frequency` and `hourUtc`, and `isDue()` in `src/lib/job-search/schedule.ts`
decides. That split is the whole reason a real frequency choice is possible.

The Worker stays deliberately dumb — no schedule logic, no database read, it
does not even read the response. Everything requiring judgement lives in the app
next to the pipeline it drives, because splitting that across two deploys would
let the scheduler and the thing it schedules disagree, and only one of them
appears in a PR diff. Failures are the app's to report by email; a Worker cannot
send mail and should not learn how.

### The first inbound secret gate in the repo

Every other `/api/admin/*` route is NextAuth session-gated, and `API_SECRET` has
only ever authenticated Next → Worker. The cron tick has no session and cannot
get one, so `requireCronSecret()` in `src/lib/fit-brief/server.ts` compares a
`Bearer` token against `API_SECRET` — the same shape as the Worker's own
`requireAuth`, so there is one idiom in both directions.

It **refuses when no secret is configured**. Treating an unset secret as "no
check needed" would leave the route that spends the Gemini quota open to anyone
who guessed the path.

### One pipeline, two entry points

`src/lib/job-search/run-search.ts` holds the search. The manual route and the
cron route both call it and differ only in what happens to the result — the
panel renders it, the scheduler emails it. A scheduled run that quietly diverged
from the button would be the worst kind of bug here: plausible output nobody is
watching.

### What counts as "new"

`digestLeads()` applies four conditions, each of which exists because its
absence sends a mail he should not get:

- **Genuinely new** — `foundAt` is set on first discovery and left alone by the
  upsert, so a posting re-found tonight keeps its original timestamp. Without
  this every run emails everything.
- **Still `new`** — saved, dismissed or applied is a decision he has made.
- **Not `gone`** — a 404 cannot be applied to. `unverified` is kept.
- **At or above `minScore`** (default 45, the bottom of "credible").

`isDue()` allows an hour of slack on the interval. A run that started at
03:00:04 yesterday is not "24 hours old" at 03:00:01 today, so without the slack
the search would skip to the next day and drift later every time until it ran
weekly by accident.

### Guard rails

| Rail              | Behaviour                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-pause        | 5 consecutive runs with nothing new switches the search off and records `pausedReason`. Resuming from the panel clears the counter — leaving it at the ceiling would re-pause after one quiet night. |
| Monthly spend cap | `JOB_SEARCH_MONTHLY_CAP_USD` (default $5), summed from the `ScheduledRun` log rather than a counter so it cannot drift. Over the line, runs are recorded as `skipped`.                               |
| Failure email     | Sent instead of silence, because a broken scheduler and a quiet job market look identical from outside — and the quiet one is the story you tell yourself.                                           |
| Per-tick limits   | At most 2 searches, and none started after 150s of the 300s budget. The rest roll to the next hour.                                                                                                  |

**A failed run does not advance `lastRunAt`**, so it retries on the next tick it
is due rather than counting as having happened.

**Nothing after the leads are written may throw.** The digest, the run record
and the counter updates all run after `runSearch()` has persisted, each wrapped
separately — the same rule the brief PUT route and the search route follow.

### Email

`sendJobDigestEmail()` in `src/lib/email.ts`, in that file's existing idiom
(Resend, inline HTML) rather than a template system for one mail. Two things it
does that the older templates in that file get wrong:

- Absolute URLs come from `PORTFOLIO_ORIGIN`, not a hardcoded host. The welcome
  and newsletter templates hardcode `http://localhost:3000` in their unsubscribe
  links — a live bug worth not repeating.
- Posting text is HTML-escaped. It comes from job boards, not from us.

The sender is the Resend sandbox (`onboarding@resend.dev`), which **only
delivers to the account owner's own address**. The recipient is `ADMIN_EMAIL`,
so this works — but the digest cannot be sent anywhere else without verifying a
domain first.

### One-time setup

```bash
cd cloudflare-api
npx wrangler d1 execute portfolio-db --remote --file=migrations/add_saved_searches.sql
npx wrangler deploy          # also registers the cron trigger
```

`wrangler.toml` needs `APP_URL` pointing at the deployed app, and the app needs
`API_SECRET` — `briefStore()` throws without it outside development, so the cron
route cannot store anything if it is missing.

Testing the tick locally:

```bash
npx wrangler dev --local --test-scheduled --var APP_URL:http://localhost:3000
curl "http://localhost:8799/__scheduled"
```
