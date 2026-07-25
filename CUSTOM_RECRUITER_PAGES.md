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
- **Making it a true reusable scaffold.** If you'll do this often, consider renaming
  `FifaContent`/`fifaContent` to `FitBriefContent`/`briefContent` and moving the shared
  `page.tsx` sub-components into `src/components/` so each new role is _only_ a `content.ts`
  file. Happy to do that refactor on request.

## 8. Privacy checklist (per new page)

- [ ] `layout.tsx` has `robots: { index: false, follow: false }`
- [ ] Page is **not** added to `src/components/ui/navigation.tsx`
- [ ] Page is **not** added to `src/app/sitemap.xml/route.ts`
- [ ] You share the URL directly with the recruiter (there's no other way in)
