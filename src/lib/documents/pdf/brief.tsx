/**
 * The fit brief as a PDF — the thing a recruiter forwards.
 *
 * The page is a link, and a link is what gets lost. A recruiter who likes a
 * candidate forwards something to a hiring manager, pastes it into an ATS
 * note, or reads it on a train with no signal, and in every one of those the
 * artifact that travels is a PDF. Both reviews of the brief format landed on
 * the same gap: there was nothing to attach.
 *
 * Its own format rather than one of the six CV designs, because a brief is a
 * different document — an argument mapped against a posting, not a career in
 * reverse chronology. It borrows the exploratory prototype's language instead:
 * numbered movements and the figures given room.
 *
 * No match/transferable badge, though the page carries one. On screen that
 * tier is a filter the reader drives; printed beside every line it reads as a
 * self-assessment nobody asked for, and "TRANSFERABLE" in a document that gets
 * forwarded is a caveat travelling without the paragraph that answers it.
 *
 * **It renders only what the page already says.** Every string here comes from
 * `FitBriefContent`, which the honesty layer has already validated against the
 * career-facts corpus. Nothing is summarised, rewritten or generated for the
 * PDF, so the file and the page can never disagree — and the PDF inherits the
 * citation checks for free.
 *
 * Density is handled with hierarchy, not with cuts: every section is present,
 * but a requirement is a bold line with its proof small underneath, so the
 * document is scanned rather than read. Trimming the
 * prose would have meant deciding what a recruiter does not need to see, which
 * is the page's job and not this file's.
 */

import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from '@react-pdf/renderer'
import type { FitBriefContent } from '@/lib/fit-brief/schema'
import { getFact } from '@/lib/career-facts'
import ink from '../ink.json'

const hex = (value: string) => `#${value}`

/**
 * The contact line, read from the corpus rather than typed here.
 *
 * It was typed here, with the gmail address — which `contact.email` explicitly
 * flags as the 2018-era one and says never to use. Hardcoding contact details
 * is precisely what the corpus exists to stop: the generator was inventing a
 * dead LinkedIn handle until they were made citable facts, and a hand-written
 * document is no more trustworthy than a generated one.
 */
function contactLine(): string {
  const strip = (id: string) =>
    getFact(id)
      ?.claim.replace(/^[A-Za-z ]+:\s*/, '')
      .trim()
  return [
    'Senior Product Manager',
    strip('contact.email'),
    'Based in Italy, working internationally',
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Paper is white, so the brief's light-mode accent is the right one. */
export interface BriefTheme {
  accent: string
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Geist',
    fontSize: 9.5,
    lineHeight: 1.45,
    color: hex(ink.ink),
    backgroundColor: hex(ink.white),
    paddingTop: 44,
    paddingBottom: 54,
    paddingHorizontal: 46,
  },
  /* letterhead */
  name: { fontSize: 15, fontWeight: 700, letterSpacing: -0.3 },
  contact: { fontSize: 8, color: hex(ink.secondary), marginTop: 3 },
  rule: { height: 1, backgroundColor: hex(ink.hairline), marginVertical: 16 },

  /* title block */
  eyebrow: {
    fontSize: 7.5,
    // 0.065em. Past ~0.08em pdf.js and a good share of ATS parsers read the
    // glyph gaps as spaces, and this line extracts as "F I FA · Z U R I C H".
    // It did exactly that at 1.2.
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: hex(ink.tertiary),
  },
  headline: {
    fontSize: 17,
    lineHeight: 1.22,
    fontWeight: 700,
    letterSpacing: -0.4,
    marginTop: 9,
  },
  lede: {
    fontSize: 9,
    lineHeight: 1.5,
    color: hex(ink.secondary),
    marginTop: 9,
    maxWidth: 420,
  },

  /* figures */
  statRow: { flexDirection: 'row', marginTop: 18, gap: 10 },
  stat: {
    flex: 1,
    borderTopWidth: 1.5,
    borderTopColor: hex(ink.hairlineStrong),
    paddingTop: 7,
  },
  statValue: { fontSize: 15, fontWeight: 700, letterSpacing: -0.4 },
  statLabel: {
    fontSize: 7,
    lineHeight: 1.3,
    color: hex(ink.tertiary),
    marginTop: 2,
  },

  /* movements */
  numeral: { fontSize: 13, fontWeight: 700 },
  sectionTitle: { fontSize: 11.5, fontWeight: 700, letterSpacing: -0.2 },

  /* a requirement and its answer */
  row: { marginTop: 11 },
  // No `flex: 1`. It was there to share a flex row with the verdict badge;
  // once the badge went, the row became a plain column and the flex collapsed
  // the heading's height to nothing, so the proof was drawn on top of it.
  requirement: { fontSize: 9.5, fontWeight: 600, lineHeight: 1.35 },
  proof: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: hex(ink.secondary),
    marginTop: 3,
    maxWidth: 440,
  },

  /* the work, and the project */
  card: { marginTop: 11 },
  cardTag: {
    fontSize: 6.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: hex(ink.tertiary),
  },
  cardTitle: { fontSize: 9.5, fontWeight: 600, marginTop: 2.5 },
  cardBody: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: hex(ink.secondary),
    marginTop: 2.5,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 10 },
  chip: {
    fontSize: 7,
    color: hex(ink.secondary),
    borderWidth: 1,
    borderColor: hex(ink.hairline),
    borderRadius: 8,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
  },

  footer: {
    position: 'absolute',
    bottom: 26,
    left: 46,
    fontSize: 7,
    color: hex(ink.tertiary),
  },
})

/**
 * A movement heading.
 *
 * `minPresenceAhead` is the rule the CV designs already follow: a heading that
 * lands as the last line of a page has stranded its own section overleaf.
 *
 * 130, not the 56 this shipped with. The number has to cover the heading, its
 * rule, and the whole of the first item beneath it — a role-map card is a tag,
 * a title and three lines of body, about 70pt on its own. At 56 the heading
 * cleared the break and the card did not, which put "02 How my experience maps
 * to the work" alone at the foot of page one. Reserving less than the first
 * child needs is the same bug as reserving nothing.
 */
/**
 * A movement heading, glued to whatever comes first beneath it.
 *
 * `minPresenceAhead` is how the CV designs do this and it does nothing in
 * react-pdf 4.9.0 — verified by raising it from 56 to 130 and rebuilding
 * clean, with "02 How my experience maps to the work" still sitting alone at
 * the foot of page one. (`render` on a Text is dead in the same version, so
 * the two are likely the same regression.)
 *
 * `wrap={false}` is not dead: it is what keeps a requirement and its proof
 * together, which held through every test. So the heading does not reserve
 * space ahead of itself — it simply refuses to be separated from its first
 * child, which is the same guarantee by a mechanism that works.
 */
function Movement({
  numeral,
  title,
  accent,
  first,
}: {
  numeral: string
  title: string
  accent: string
  /** Rendered inside the unbreakable block, so the heading never lands alone. */
  first: React.ReactNode
}) {
  return (
    <View style={{ marginTop: 22 }} wrap={false}>
      <Text style={styles.sectionTitle}>
        <Text style={[styles.numeral, { color: accent }]}>{numeral}</Text>
        {'   '}
        {title}
      </Text>
      <View
        style={{ height: 1, backgroundColor: hex(ink.hairline), marginTop: 7 }}
      />
      {first}
    </View>
  )
}

/** A requirement and its proof are one thought and never split. */
function Requirement({
  row,
}: {
  row: FitBriefContent['profileMatchSection']['panels'][number]['rows'][number]
}) {
  return (
    <View style={styles.row} wrap={false}>
      <Text style={styles.requirement}>{row.requirement}</Text>
      <Text style={styles.proof}>{row.proof}</Text>
    </View>
  )
}

function WorkItem({
  item,
}: {
  item: FitBriefContent['roleMapSection']['items'][number]
}) {
  return (
    <View style={styles.card} wrap={false}>
      <Text style={styles.cardTag}>{item.tag}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  )
}

export function BriefDocument({
  content,
  theme,
  pageUrl,
}: {
  content: FitBriefContent
  theme: BriefTheme
  /** Printed in the footer so the file can be traced back to the page. */
  pageUrl: string
}) {
  const accent = theme.accent
  const rows = content.profileMatchSection.panels.flatMap(p => p.rows)

  return (
    <Document
      title={`${content.hero.eyebrow} — fit brief`}
      author="Lukáš Hošala"
    >
      <Page size="A4" style={styles.page}>
        {/* Declared before the flowing content, which is what makes `fixed`
            repeat it rather than lay it out once the page is already full.

            No page number beside it. The documented `render={({ pageNumber })
            => …}` pattern produces nothing in react-pdf 4.9.0 — verified by
            extracting the shipped `column` and `classic` CVs, which carry the
            same footer and show no numbers on a two-page document either. It
            is a pre-existing condition in the library, not a property of this
            file, and shipping a dead element here would only hide it. */}
        <Link src={pageUrl} style={styles.footer} fixed>
          {pageUrl.replace(/^https?:\/\//, '')}
        </Link>

        <View>
          <Text style={styles.name}>Lukáš Hošala</Text>
          <Text style={styles.contact}>{contactLine()}</Text>
        </View>
        <View style={styles.rule} />

        <Text style={styles.eyebrow}>{content.hero.eyebrow}</Text>
        <Text style={styles.headline}>
          {content.hero.headlineLead}{' '}
          <Text style={{ color: accent }}>{content.hero.headlineGradient}</Text>
        </Text>
        <Text style={styles.lede}>{content.hero.description}</Text>

        <View style={styles.statRow}>
          {content.hero.stats.map(stat => (
            <View key={stat.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: accent }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ---- 01 the posting, answered ---- */}
        <Movement
          numeral="01"
          title={content.profileMatchSection.heading}
          accent={accent}
          first={rows[0] ? <Requirement row={rows[0]} /> : null}
        />
        {rows.slice(1).map(row => (
          <Requirement key={row.requirement} row={row} />
        ))}

        {/* ---- 02 the work ---- */}
        <Movement
          numeral="02"
          title={content.roleMapSection.heading}
          accent={accent}
          first={
            content.roleMapSection.items[0] ? (
              <WorkItem item={content.roleMapSection.items[0]} />
            ) : null
          }
        />
        {content.roleMapSection.items.slice(1).map(item => (
          <WorkItem key={item.id} item={item} />
        ))}

        {/* ---- 03 the project ---- */}
        <Movement
          numeral="03"
          title={content.spotlight.heading}
          accent={accent}
          first={
            <>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
                <Text style={[styles.cardTag, { color: accent }]}>
                  {content.spotlight.chip}
                </Text>
                <Text style={styles.cardTag}>
                  {content.spotlight.statusBadge}
                </Text>
              </View>
              <Text style={[styles.proof, { marginTop: 5 }]}>
                {content.spotlight.lede}
              </Text>
            </>
          }
        />
        {content.spotlight.pillars.map(pillar => (
          <View key={pillar.title} style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>{pillar.title}</Text>
            <Text style={styles.cardBody}>{pillar.body}</Text>
          </View>
        ))}
        <View style={styles.chipRow}>
          {content.spotlight.credentials.map(credential => (
            <Text key={credential} style={styles.chip}>
              {credential}
            </Text>
          ))}
        </View>

        {/* ---- 04 where it stops short ---- */}
        <Movement
          numeral="04"
          title={content.gap.heading}
          accent={accent}
          first={
            <Text style={[styles.proof, { marginTop: 9, maxWidth: 460 }]}>
              {content.gap.body}
            </Text>
          }
        />

        {/* ---- close ---- */}
        <View style={{ marginTop: 22 }} wrap={false}>
          <Text style={styles.cardTitle}>{content.closing.heading}</Text>
          <Text style={[styles.proof, { maxWidth: 460 }]}>
            {content.closing.body}
          </Text>
          <View style={styles.chipRow}>
            {content.closing.credentials.map(credential => (
              <Text key={credential} style={styles.chip}>
                {credential}
              </Text>
            ))}
          </View>
          <Text style={{ fontSize: 9, color: accent, marginTop: 10 }}>
            {content.closing.signature}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
