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
 * numbered movements, the figures given room, a verdict beside every
 * requirement.
 *
 * **It renders only what the page already says.** Every string here comes from
 * `FitBriefContent`, which the honesty layer has already validated against the
 * career-facts corpus. Nothing is summarised, rewritten or generated for the
 * PDF, so the file and the page can never disagree — and the PDF inherits the
 * citation checks for free.
 *
 * Density is handled with hierarchy, not with cuts: every section is present,
 * but a requirement is a bold line with its verdict to the right and its proof
 * small underneath, so the document is scanned rather than read. Trimming the
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
import type { Style } from '@react-pdf/types'
import type { FitBriefContent } from '@/lib/fit-brief/schema'
import ink from '../ink.json'

const hex = (value: string) => `#${value}`

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
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  numeral: { fontSize: 13, fontWeight: 700 },
  sectionTitle: { fontSize: 11.5, fontWeight: 700, letterSpacing: -0.2 },

  /* a requirement and its answer */
  row: { marginTop: 11 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  requirement: { flex: 1, fontSize: 9.5, fontWeight: 600, lineHeight: 1.35 },
  verdict: {
    fontSize: 6.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: 600,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderRadius: 7,
  },
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
 */
function Movement({
  numeral,
  title,
  accent,
}: {
  numeral: string
  title: string
  accent: string
}) {
  return (
    <View style={{ marginTop: 22 }} minPresenceAhead={56}>
      <View style={styles.sectionHead}>
        <Text style={[styles.numeral, { color: accent }]}>{numeral}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: hex(ink.hairline),
          marginTop: 7,
        }}
      />
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

  const verdictStyle = (isMatch: boolean): Style =>
    isMatch
      ? { backgroundColor: hex(ink.accentSoft), color: accent }
      : {
          borderWidth: 1,
          borderColor: hex(ink.hairline),
          color: hex(ink.tertiary),
        }

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
          <Text style={styles.contact}>
            Senior Product Manager · hosala.lukas@gmail.com · Based in Italy,
            working internationally
          </Text>
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
        />
        {rows.map(row => (
          // A requirement and its proof are one thought; splitting them across
          // a page break leaves a claim with no answer under it.
          <View key={row.requirement} style={styles.row} wrap={false}>
            <View style={styles.rowTop}>
              <Text style={styles.requirement}>{row.requirement}</Text>
              <Text style={[styles.verdict, verdictStyle(row.isMatch)]}>
                {row.tierLabel}
              </Text>
            </View>
            <Text style={styles.proof}>{row.proof}</Text>
          </View>
        ))}

        {/* ---- 02 the work ---- */}
        <Movement
          numeral="02"
          title={content.roleMapSection.heading}
          accent={accent}
        />
        {content.roleMapSection.items.map(item => (
          <View key={item.id} style={styles.card} wrap={false}>
            <Text style={styles.cardTag}>{item.tag}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        ))}

        {/* ---- 03 the project ---- */}
        <Movement
          numeral="03"
          title={content.spotlight.heading}
          accent={accent}
        />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
          <Text style={[styles.cardTag, { color: accent }]}>
            {content.spotlight.chip}
          </Text>
          <Text style={styles.cardTag}>{content.spotlight.statusBadge}</Text>
        </View>
        <Text style={[styles.proof, { marginTop: 5 }]}>
          {content.spotlight.lede}
        </Text>
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
        <Movement numeral="04" title={content.gap.heading} accent={accent} />
        <Text style={[styles.proof, { marginTop: 9, maxWidth: 460 }]}>
          {content.gap.body}
        </Text>

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
