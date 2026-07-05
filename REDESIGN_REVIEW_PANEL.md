# Redesign Review Panel — July 2026

The portfolio was redesigned (design system, motion, all public pages), then reviewed by four
independent agent reviewers. A final reviewer — acting as the candidate himself, an experienced
Senior PM — had binding decision authority. This document records those interactions and what
changed as a result.

## The redesign under review

- New "Ink & Signal" design system: dark-first, electric-indigo accent, proper light mode via
  CSS tokens (replaced ~300 lines of `!important` dark-mode override hacks)
- Space Grotesk display typography + Geist body/mono
- GSAP motion: scroll reveals, count-up metrics, magnetic buttons; interactive canvas particle
  hero; company marquee; all gated behind `prefers-reduced-motion` and a no-JS fallback
- All five public pages rebuilt on the same system; factual content kept verbatim
- Removed: dead "View Full Case Study" button, emoji icons, rainbow gradient cards

## Independent review scores (before fixes)

| Reviewer           | Score  | Headline finding                                                                                                                                      |
| ------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marketing          | 6.5/10 | SEO metadata still had the old jargon copy ("orchestrating product magic") — first impression in search results contradicted the honest on-page voice |
| HR / Recruiter     | 6.5/10 | No CV download (funnel-breaker); self-scored percentage skill bars read junior at senior level                                                        |
| Legal / Compliance | 4/10   | No privacy policy despite storing IP/behavioral analytics + contact data; analytics captured visitors' copied text                                    |
| Design             | 7/10   | Strong system and theme parity; percentage bars a dated cliché; count-up animation can be caught mid-value in screenshots                             |

Notable false positive: HR and Design flagged "163M+/164M+ vs 165M+" inconsistencies — these
were screenshots catching the count-up animation mid-flight (source is 165M+ everywhere).
The panel still ruled the slow animation itself a risk worth mitigating.

## Final decision (Senior PM candidate proxy, binding)

**Verdict: 6.5/10 as reviewed → GO for local delivery with the DO-NOW list applied.
NO-GO for public deployment until the owner completes the privacy policy details.**

### DO-NOW — all applied

1. **SEO metadata rewritten** in root + about/work/skills/contact layouts — honest voice,
   facts unchanged (`src/app/layout.tsx`, `src/app/*/layout.tsx`)
2. **LinkedIn CTA added** to homepage hero and contact "Direct lines" (interim substitute for
   CV download — see owner actions)
3. **Percentage skill bars removed** — replaced with Expert/Advanced tier tags (the pattern
   already used on About), trimmed 36 skills → 21 strongest (`src/app/skills/page.tsx`)
4. **Contact form reframed for recruiters** — Budget range and Phone removed, Project type
   replaced with an optional "I'm reaching out about" select whose first option is
   "Hiring for a senior PM role" (`src/app/contact/page.tsx`)
5. **Privacy defect fixed** — the analytics copy-listener no longer transmits the visitor's
   copied text, only a `contact_copied` event (`src/components/analytics-provider.tsx`)
6. **Stray placeholder phone number** removed (field deleted with the form reframe)
7. **Count-up mitigation** — animation shortened to 0.8s with a hard snap to the exact final
   value (`src/components/motion/count-up.tsx`)
8. **Privacy policy skeleton** at `/privacy` with `[OWNER: …]` placeholders, linked from the
   footer and from a notice above the contact form submit button

### DEFERRED (owner input needed or post-ship polish)

- Canonical URLs (await final domain decision)
- "Open to work / remote" statement near hero (owner's status to declare)
- "Advisory/part-time" qualifiers on overlapping roles (only if factually accurate)
- Data retention automation (folds into completed privacy policy)
- Minor design polish: home vertical rhythm, light-mode card elevation

### REJECTED

- Softening "€1M/yr Sprinklr licence" to "seven-figure" (Legal SHOULD-FIX): rejected because
  the figure is stated in the CV — making the site vaguer than the CV creates the exact
  inconsistency recruiters probe. If an NDA review says otherwise, CV and site change together.

## Ship decision (owner, July 2026)

The owner reviewed the local build and decided to **ship to production**, overriding the
panel's "complete privacy details first" gate. Before deploy, the `[OWNER: …]` placeholders
on `/privacy` were replaced with sensible defaults so no placeholder text reaches production:
last-updated = July 2026, controller contact = lukas.hosala@icloud.com (the address already
published on /contact), retention = 24 months for contact submissions / 13 months for
analytics. **The owner should review these defaults.**

## Still owed by the owner (deferred to the next iteration, per owner)

1. **CV PDF** — a "Download CV" button will be wired next to the LinkedIn CTA once the file
   exists (owner confirmed it comes later with additional changes)
2. **Privacy policy review** — confirm the deployed defaults above are acceptable
3. **Factual claims audit** — does €1M Sprinklr stay (NDA check)? Are StagStrat / PlayerGrade
   roles "advisory/part-time"? State open-to-work / remote preferences?
