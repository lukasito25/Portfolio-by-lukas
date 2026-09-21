/**
 * Builds the CV and cover-letter template variants.
 *
 * Five prototypes, deliberately spanning a range of risk, so the choice can be
 * made by looking at real documents rather than at descriptions:
 *
 *   rule     Typographic only. No images, white page, nothing an ATS has never
 *            seen. The design is carried entirely by the site's type system:
 *            letter-spaced accent section labels, hairline rules, the ink and
 *            grey scale from `globals.css`. This is the control.
 *
 *   panel    The site's panel language. A flat --background paper tone behind
 *            the whole page, a filled letterhead block with an accent edge, and
 *            each section heading in a tinted bar. Everything printable, no
 *            artwork.
 *
 *   field    The brief pages, on paper. The hero vignette and the
 *            gradient-signal rule, drawn from the same tokens the briefs use,
 *            behind the text on every page.
 *
 *   dossier  The brief page as a sheet of paper: a dark hero band, the four-up
 *            stat band under it, dates set hard right against a tab stop, and a
 *            spine down each role's bullets. Restructured, but still one column
 *            and still no tables.
 *
 *   column   The agency two-column CV — a shaded rail for skills, languages and
 *            education beside the summary and experience. The only variant that
 *            uses a table, and the only one whose text does not come out in
 *            reading order. See the note above `table()` in `doc-kit.mjs`.
 *
 * `rule`, `panel` and `field` render exactly the same text in exactly the same
 * order as the classic template. `dossier` adds the stat band. Only `column`
 * reorders anything. None of them puts a single character in a header or a text
 * box. `scripts/check-doc-text.mjs` asserts all of that rather than trusting it.
 *
 * Run: node scripts/build-doc-variants.mjs
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  INK,
  PAGE,
  TYPE,
  p,
  run,
  tab,
  loop,
  table,
  writeDocx,
} from './doc-kit.mjs'
import { buildBackgroundPng } from './doc-background.mjs'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates')

/* ------------------------------------------------------------------ *
 * Type scale
 *
 * Sizes are half-points. Both of the site's faces travel inside the package
 * now (see `doc-fonts.mjs`), so the display voice is carried by Space Grotesk
 * where `globals.css` uses `.font-display`, and by Geist everywhere else —
 * rather than being imitated with weight and tracking on Calibri.
 *
 * The section labels are the one exception: the site sets them in Geist Mono,
 * but a third embedded family for six words a page is not worth 60 KB, so they
 * stay letter-spaced Geist at the same 0.18em.
 * ------------------------------------------------------------------ */

const NAME = {
  font: TYPE.display,
  size: 40,
  bold: true,
  color: INK.ink,
  track: -12,
}
const HEADLINE = { size: 21, color: INK.secondary }
const CONTACT = { size: 18, color: INK.secondary }
const META = { size: 18, color: INK.tertiary }
const LABEL = { size: 16, bold: true, caps: true, track: 29, color: INK.accent }

/** The stat band: the site's `font-display` numerals over `text-tertiary-fg`. */
const STAT_VALUE = {
  font: TYPE.display,
  size: 32,
  bold: true,
  color: INK.accent,
  track: -10,
}
const STAT_LABEL = { size: 15, caps: true, track: 24, color: INK.tertiary }

/** Text on the dark hero band. Light enough to clear AA on #051D39 by a mile. */
const ON_DARK = 'AECBE8'

/** 2.25pt of accent down the left edge — the site's panel accent border. */
const ACCENT_EDGE = { sz: 18, color: INK.accent, space: 8 }
/** An invisible border in the fill colour, there only to pad the fill. */
const pad = (fill, space) => ({ sz: 2, color: fill, space })

/* ------------------------------------------------------------------ *
 * Skins
 * ------------------------------------------------------------------ */

/**
 * A filled block.
 *
 * Word merges consecutive paragraphs into one bordered box only when their
 * border definitions are identical, so every paragraph in a block — including
 * the padding gaps — carries the same spec. And every paragraph inside it sets
 * `after: 0`: paragraph shading covers the line, not the space between
 * paragraphs, so any gap shows through the fill as a white stripe.
 */
const filledBlock = (fill, space = 10, edge = ACCENT_EDGE) => ({
  shd: fill,
  border: {
    top: pad(fill, space),
    left: edge,
    bottom: pad(fill, space),
    right: pad(fill, space),
  },
})

/** A shaded spacer, used to pad the top and bottom of a filled block. */
const blockGap = (block, size, after = 0) =>
  p(`<w:r><w:rPr><w:sz w:val="${size}"/></w:rPr><w:t/></w:r>`, {
    ...block,
    after,
  })

/**
 * The letterhead as a filled block: name, headline, contact, padded.
 *
 * Shared by `panel` and `dossier` — the only difference between a tinted
 * letterhead and a dark one is the fill and the three run colours.
 */
const filledLetterhead = ({ block, name, headline, contact, after }) =>
  blockGap(block, 10) +
  p(run('{fullName}', name), { ...block, style: 'Name', after: 0 }) +
  p(run('{headline}', headline), { ...block, after: 0 }) +
  p(run('{contactLine}', contact), { ...block, after: 0 }) +
  blockGap(block, 10, after)

/** The plain letterhead: name over an accent rule. */
const ruledLetterhead = (after = 260) =>
  p(run('{fullName}', NAME), { style: 'Name', after: 40 }) +
  p(run('{headline}', HEADLINE), { after: 40 }) +
  p(run('{contactLine}', CONTACT), {
    after,
    border: { bottom: { sz: 12, color: INK.accent, space: 8 } },
  })

/** A section eyebrow over a hairline, optionally with the accent tab. */
const ruledHeading = (text, { tabbed = false, before = 280 } = {}) =>
  p(run(text, LABEL), {
    keepNext: true,
    before,
    after: 100,
    border: {
      ...(tabbed ? { left: ACCENT_EDGE } : {}),
      bottom: { sz: 4, color: INK.hairline, space: 3 },
    },
  })

const skins = {
  rule: {
    label: 'Ink & Rule',
    page: {},
    letterhead: () => ruledLetterhead(),
    heading: text => ruledHeading(text),
  },

  panel: {
    label: 'Paper & Panel',
    page: { pageColor: INK.paper, background: { vignette: 0 } },

    letterhead: () =>
      filledLetterhead({
        block: filledBlock(INK.accentSoft),
        name: NAME,
        headline: HEADLINE,
        contact: CONTACT,
        after: 320,
      }),

    /* `line` is what pads the bar vertically: shading covers the line box, so
     * 1.5 lines of leading is a taller tint around the same 8pt label. */
    heading: text =>
      p(run(text, LABEL), {
        ...filledBlock(INK.accentSoftPaper, 8),
        keepNext: true,
        before: 260,
        after: 140,
        line: 360,
      }),
  },

  field: {
    label: 'Signal Field',
    page: { pageColor: INK.paper, background: { vignette: 0.14, band: true } },
    letterhead: () => ruledLetterhead(280),

    /* No fill on the page that already carries one — an opaque bar would sit
     * on top of the vignette and read as a patch. The accent tab does the work
     * the fill does in `panel`. */
    heading: text => ruledHeading(text, { tabbed: true }),
  },

  dossier: {
    label: 'Dossier',
    /* Flat paper, deliberately not the `field` vignette: its gradient rule
     * along the top edge would sit directly above the dark band and read as a
     * second, competing header. */
    page: { pageColor: INK.paper, background: { vignette: 0 } },

    /* The site's hero is dark; this is that hero, margin to margin. It takes
     * its padding from border spacing rather than a negative indent — a
     * full-bleed band has to hang text into the margin, and the moment a long
     * headline wraps, the second line starts adrift of everything below it. */
    letterhead: () =>
      filledLetterhead({
        block: filledBlock(INK.accentDeep, 12, {
          sz: 18,
          color: INK.accentSky,
          space: 12,
        }),
        name: {
          font: TYPE.display,
          size: 44,
          bold: true,
          color: 'FFFFFF',
          track: -14,
        },
        headline: { size: 21, color: INK.accentSky },
        contact: { size: 18, color: ON_DARK },
        after: 200,
      }),

    heading: text => ruledHeading(text, { tabbed: true }),
  },

  column: {
    label: 'Column',
    page: { pageColor: INK.paper, background: { vignette: 0 } },
    letterhead: () => ruledLetterhead(200),
    /* Compact: this heading is used inside a 3000-twip rail as well as the
     * main column, so it cannot rely on having a line to itself. */
    heading: text => ruledHeading(text, { before: 200 }),
  },
}

/* ------------------------------------------------------------------ *
 * Shared content blocks
 *
 * Every variant composes its CV from these. The placeholder set is the contract
 * with `src/lib/documents/schema.ts`, and keeping one copy of each block is
 * what stops a variant quietly drifting into producing different text from the
 * others — the failure that would matter most and show up least.
 * ------------------------------------------------------------------ */

/**
 * A bullet.
 *
 * The glyph comes from `numbering.xml`, not from a literal "•" run. That is
 * partly typography — Word gets a real list with a real hanging indent — but
 * mostly it is for the parser: the old approach put a bullet character into the
 * extracted text in front of every achievement.
 */
const bullet = (runs, spine) =>
  p(runs, {
    numbered: true,
    after: 60,
    // The spined variant drops the hanging indent, and that is not a style
    // choice. Word draws a left border `space` points to the LEFT of the text;
    // some renderers ignore `space` and draw it at the indent. With a hanging
    // indent there is no geometry that survives both — the rule lands either on
    // the bullet glyph or between the glyph and its sentence, where it reads as
    // a strikethrough. Flush left, the worst case is a spine hugging the
    // bullets instead of sitting out on the margin.
    ind: spine ? { left: 397 } : { left: 284, hanging: 284 },
    ...(spine
      ? { border: { left: { sz: 6, color: INK.hairlineStrong, space: 20 } } }
      : {}),
  })

/**
 * The stat band — four numbers over their labels, the fit-brief hero band.
 *
 * A tab grid rather than a table: an ATS reads two ordinary lines of text, and
 * `renderCv` supplies four fixed slots because a docxtemplater loop cannot run
 * inside a paragraph. `{#hasHighlights}` drops the band, rule and all, for a CV
 * generated before the field existed.
 */
const statBand = width => {
  const step = Math.round(width / 4)
  const stops = [1, 2, 3].map(i => ({ pos: step * i }))
  const line = (slot, style) =>
    [1, 2, 3, 4].map(i => run(`{h${i}${slot}}`, style)).join(tab())

  return (
    loop('{#hasHighlights}') +
    p(line('value', STAT_VALUE), { tabs: stops, keepNext: true, after: 0 }) +
    p(line('label', STAT_LABEL), {
      tabs: stops,
      after: 260,
      border: { bottom: { sz: 4, color: INK.hairline, space: 8 } },
    }) +
    loop('{/hasHighlights}')
  )
}

const summaryBlock = skin => skin.heading('Summary') + p(run('{summary}'))

const skillsBlock = skin =>
  skin.heading('Skills') +
  loop('{#skills}') +
  p(`${run('{group}: ', { bold: true })}${run('{itemsLine}')}`, { after: 60 }) +
  loop('{/skills}')

/**
 * Work experience.
 *
 * `layout: 'rail'` sets the period and location hard right against a tab stop
 * instead of running them inline, and draws a spine down the bullets. The
 * placeholders are identical either way — only the separators between them
 * differ, and a separator is not something an ATS reads.
 */
const rolesBlock = (skin, { layout = 'inline', width } = {}) => {
  const header =
    layout === 'rail'
      ? p(
          `${run('{title}', { bold: true, size: 22 })}${tab()}${run('{period}', META)}`,
          {
            keepNext: true,
            after: 10,
            tabs: [{ align: 'right', pos: width }],
          }
        ) +
        p(
          `${run('{company}', { color: INK.accent })}${tab()}${run('{location}', META)}`,
          {
            keepNext: true,
            after: 80,
            tabs: [{ align: 'right', pos: width }],
          }
        )
      : p(
          `${run('{title}', { bold: true })}${run('  ·  ', { color: INK.tertiary })}${run('{company}')}`,
          { keepNext: true, after: 20 }
        ) +
        p(run('{period}  |  {location}', META), { keepNext: true, after: 70 })

  return (
    skin.heading('Work Experience') +
    loop('{#roles}') +
    header +
    loop('{#bullets}') +
    // The bold lead-in label is the one device carried over from the CVs that
    // actually landed interviews: a recruiter reads the labels down the left
    // edge first, and only then the sentence. `label` is optional — a bullet
    // without one renders as plain text.
    bullet(
      `${run('{label}', { bold: true })}${run('{text}')}`,
      layout === 'rail'
    ) +
    loop('{/bullets}') +
    p(run(''), { after: 70 }) +
    loop('{/roles}')
  )
}

const educationBlock = skin =>
  skin.heading('Education') +
  loop('{#education}') +
  p(
    `${run('{qualification}', { bold: true })}${run(' — ')}${run('{institution}')}` +
      `${run('{detailSuffix}', { color: INK.secondary })}`,
    { after: 50 }
  ) +
  loop('{/education}')

const certificationsBlock = skin =>
  skin.heading('Certifications & Training') +
  loop('{#certifications}') +
  p(`${run('{year}', { bold: true })}${run('{entry}')}`, { after: 50 }) +
  loop('{/certifications}')

const languagesBlock = skin =>
  skin.heading('Languages') + p(run('{languagesLine}'))

/* ------------------------------------------------------------------ *
 * CV bodies
 * ------------------------------------------------------------------ */

/** The original order, unchanged, with no stat band. */
const cvBody = skin =>
  skin.letterhead() +
  summaryBlock(skin) +
  skillsBlock(skin) +
  rolesBlock(skin) +
  educationBlock(skin) +
  certificationsBlock(skin) +
  languagesBlock(skin)

/** Same order, plus the stat band and the rail layout for roles. */
const dossierCvBody = skin =>
  skin.letterhead() +
  statBand(PAGE.contentTwips) +
  summaryBlock(skin) +
  skillsBlock(skin) +
  rolesBlock(skin, { layout: 'rail', width: PAGE.contentTwips }) +
  educationBlock(skin) +
  certificationsBlock(skin) +
  languagesBlock(skin)

/* Two-column geometry. The rail is deliberately narrow: it holds lists, and a
 * wider one would start stealing lines from the experience that has to earn
 * the interview. */
const RAIL_WIDTH = 3000
const MAIN_WIDTH = PAGE.contentTwips - RAIL_WIDTH
const CELL_MARGIN = 227
/** Flip to 'right' to put summary and experience first in the text stream. */
const RAIL_SIDE = 'left'

const columnCvBody = skin => {
  const rail = {
    width: RAIL_WIDTH,
    shd: INK.accentSoftPaper,
    margin: CELL_MARGIN,
    body:
      skillsBlock(skin) +
      languagesBlock(skin) +
      educationBlock(skin) +
      certificationsBlock(skin) +
      p('', { after: 0 }),
  }

  const main = {
    width: MAIN_WIDTH,
    margin: CELL_MARGIN,
    body:
      summaryBlock(skin) +
      rolesBlock(skin, {
        layout: 'rail',
        width: MAIN_WIDTH - CELL_MARGIN * 2,
      }) +
      p('', { after: 0 }),
  }

  return (
    skin.letterhead() +
    statBand(PAGE.contentTwips) +
    table(RAIL_SIDE === 'left' ? [rail, main] : [main, rail])
  )
}

/* ------------------------------------------------------------------ *
 * Cover letter
 *
 * Same skin, lighter application of it: the letter is one page of prose and a
 * heading system would be noise. It gets the letterhead and the subject line
 * set as a section label, and nothing else — no stat band, no rail.
 * ------------------------------------------------------------------ */

const letterBody = skin =>
  [
    skin.letterhead(),

    p(run('{date}', META), { after: 240 }),
    p(run('{recipient}'), { after: 240 }),
    p(run('{subject}', { bold: true, caps: true, track: 20, size: 19 }), {
      after: 240,
    }),

    p(run('{greeting}'), { after: 180 }),
    loop('{#paragraphs}'),
    p(run('{text}'), { after: 180 }),
    loop('{/paragraphs}'),

    p(run('{closing}'), { after: 60 }),
    p(run('{signature}', { bold: true })),
  ].join('')

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

const cvBodyFor = { dossier: dossierCvBody, column: columnCvBody }

for (const [id, skin] of Object.entries(skins)) {
  const background = skin.page.background
    ? await buildBackgroundPng(skin.page.background)
    : undefined

  for (const [kind, body] of [
    ['cv', (cvBodyFor[id] ?? cvBody)(skin)],
    ['cover-letter', letterBody(skin)],
  ]) {
    const path = writeDocx({
      path: join(outDir, `${kind}-${id}.docx`),
      body,
      pageColor: skin.page.pageColor,
      background,
    })
    console.log(`wrote ${path}`)
  }
}
