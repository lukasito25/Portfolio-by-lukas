/**
 * The single-column PDF designs: classic, rule, panel, field and dossier.
 *
 * One document, five treatments. The body — summary, skills, experience,
 * education, certifications, languages — is the same component in the same
 * order for all five; what a design changes is the letterhead, the section
 * heading, the page ground and the accent. That split is deliberate: a
 * recruiter compares designs on the top third of the page, and a parser does
 * not care about any of it, so the parts a parser reads are shared and the
 * parts a person judges are themed.
 *
 * Every one of these is one column, top to bottom, so extraction order is the
 * reading order — the safe shape for an ATS. `column.tsx` is the one design
 * that trades that away, and it lives in its own file for that reason.
 *
 * Typographic rules that hold across all five, because a regression in any of
 * them is invisible in a preview and expensive in a parser:
 *
 * - **Tracking stays under ~0.08em.** Past that, pdf.js reads glyph gaps as
 *   spaces and "SUMMARY" extracts as "S U M M A R Y".
 * - **A heading never strands at a page foot** — `minPresenceAhead` keeps it
 *   with what follows — and a role never splits, so no title sits alone at the
 *   bottom of page one.
 * - **Dates sit hard right** on the same line as the title, so the eye reads
 *   the career as a column of years without hunting for them.
 * - **A page number only when there is a second page.** A "1 / 1" is noise.
 */

import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  StyleSheet,
} from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { CvContent, CoverLetterContent } from '../schema'
import type { Locale } from '@/lib/fit-brief/guardrails'
import type { DocVariant } from '../variants'
import ink from '../ink.json'

const hex = (token: string) => `#${token}`

/* A4 at 72dpi is 595×842pt. Margins match the .docx: 2cm ≈ 56.7pt. */
export const PAGE_W = 595.28
export const PAGE_H = 841.89
const MARGIN = 54
/* Body size. Every style that sets `lineHeight` sets `fontSize` beside it: a
 * unitless lineHeight on a style without its own fontSize is resolved against
 * react-pdf's 18pt default, not the inherited size, and the page triples its
 * leading with no error anywhere. */
const BASE = 9.4

export type SingleVariant = Exclude<DocVariant, 'column'>

/* ------------------------------------------------------------------ *
 * Themes — the four things a design is allowed to change.
 * ------------------------------------------------------------------ */

interface Theme {
  /** Page ground. */
  paper: string
  /** Body text and its quieter companions. */
  ink: string
  secondary: string
  tertiary: string
  /** The accent, where the design uses one; classic sets it to ink. */
  accent: string
  /** Hairlines. */
  line: string
  /** How a section heading is drawn. */
  heading: 'underline' | 'label' | 'bar' | 'spine'
  /** Which letterhead. */
  letterhead: 'plain' | 'typographic' | 'panel' | 'field' | 'hero'
  /** Whether the stat band draws its numbers in the accent. */
  statsInAccent: boolean
}

const THEMES: Record<SingleVariant, Theme> = {
  classic: {
    paper: hex(ink.white),
    ink: hex(ink.ink),
    secondary: hex(ink.secondary),
    tertiary: hex(ink.tertiary),
    accent: hex(ink.ink),
    line: hex(ink.hairlineStrong),
    heading: 'underline',
    letterhead: 'plain',
    statsInAccent: false,
  },
  rule: {
    paper: hex(ink.white),
    ink: hex(ink.ink),
    secondary: hex(ink.secondary),
    tertiary: hex(ink.tertiary),
    accent: hex(ink.accent),
    line: hex(ink.hairline),
    heading: 'label',
    letterhead: 'typographic',
    statsInAccent: true,
  },
  panel: {
    paper: hex(ink.paper),
    ink: hex(ink.ink),
    secondary: hex(ink.secondary),
    tertiary: hex(ink.tertiary),
    accent: hex(ink.accent),
    line: hex(ink.hairline),
    heading: 'bar',
    letterhead: 'panel',
    statsInAccent: true,
  },
  field: {
    paper: hex(ink.white),
    ink: hex(ink.ink),
    secondary: hex(ink.secondary),
    tertiary: hex(ink.tertiary),
    accent: hex(ink.accent),
    line: hex(ink.hairline),
    heading: 'label',
    letterhead: 'field',
    statsInAccent: true,
  },
  dossier: {
    paper: hex(ink.paper),
    ink: hex(ink.ink),
    secondary: hex(ink.secondary),
    tertiary: hex(ink.tertiary),
    accent: hex(ink.accent),
    line: hex(ink.hairline),
    heading: 'spine',
    letterhead: 'hero',
    statsInAccent: true,
  },
}

/* ------------------------------------------------------------------ *
 * Styles shared by every theme. Colour comes from the theme at render time.
 * ------------------------------------------------------------------ */

const s = StyleSheet.create({
  page: {
    fontFamily: 'Geist',
    fontSize: BASE,
    lineHeight: 1.45,
    paddingTop: MARGIN,
    paddingBottom: MARGIN - 6,
    paddingHorizontal: MARGIN,
  },

  /* Letterheads */
  name: {
    fontSize: 24,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  headline: { fontSize: 10.5, lineHeight: 1.35, marginTop: 2 },
  contact: { fontSize: 8.6, lineHeight: 1.4, marginTop: 4 },
  contactSep: { marginHorizontal: 5 },

  plainHead: { marginBottom: 6 },
  typoHead: { marginBottom: 8 },
  panelHead: {
    marginHorizontal: -MARGIN,
    marginTop: -MARGIN,
    paddingHorizontal: MARGIN,
    paddingTop: MARGIN - 10,
    paddingBottom: 18,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  fieldHead: { marginBottom: 8, paddingTop: 4 },
  hero: {
    marginHorizontal: -MARGIN,
    marginTop: -MARGIN,
    paddingHorizontal: MARGIN,
    paddingTop: 34,
    paddingBottom: 26,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  heroName: {
    fontSize: 27,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: -0.8,
    color: '#FFFFFF',
  },
  heroHeadline: { fontSize: 10.5, lineHeight: 1.35, marginTop: 4 },
  heroContact: { fontSize: 8.6, lineHeight: 1.4, marginTop: 5 },

  /* Stat band */
  band: {
    flexDirection: 'row',
    paddingBottom: 9,
    marginBottom: 4,
    borderBottomWidth: 0.6,
  },
  stat: { flex: 1, paddingRight: 8 },
  statValue: {
    fontSize: 17,
    lineHeight: 1.15,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 7,
    lineHeight: 1.3,
    letterSpacing: 0.5,
    marginTop: 1.5,
    textTransform: 'uppercase',
  },

  /* Section headings */
  hUnderline: {
    fontSize: 9.5,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderBottomWidth: 0.7,
    paddingBottom: 2.5,
    marginTop: 13,
    marginBottom: 6,
  },
  hLabel: {
    fontSize: 7.6,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderBottomWidth: 0.6,
    paddingBottom: 3,
    marginTop: 13,
    marginBottom: 6,
  },
  hBar: {
    fontSize: 7.6,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingVertical: 3.5,
    paddingHorizontal: 7,
    marginTop: 13,
    marginBottom: 7,
  },
  hSpine: {
    fontSize: 7.6,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    borderBottomWidth: 0.6,
    borderLeftWidth: 2.5,
    paddingLeft: 6,
    paddingBottom: 3,
    marginTop: 13,
    marginBottom: 6,
  },

  /* Body */
  summary: { fontSize: BASE, lineHeight: 1.55 },
  skill: { fontSize: BASE, marginBottom: 2.2, lineHeight: 1.45 },
  bold: { fontWeight: 600 },

  role: { marginBottom: 9.5 },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roleTitle: {
    fontSize: 10.8,
    fontWeight: 600,
    lineHeight: 1.3,
    flex: 1,
    paddingRight: 8,
  },
  rolePeriod: {
    fontSize: 8.6,
    fontWeight: 600,
    lineHeight: (1.3 * 10.8) / 8.6,
    paddingTop: 0.3,
  },
  roleCompany: { fontSize: 9.4, lineHeight: 1.35, flex: 1, paddingRight: 8 },
  roleLocation: { fontSize: 8.4, lineHeight: (1.35 * BASE) / 8.4 },
  bullets: { marginTop: 4, paddingLeft: 9 },
  bulletsSpine: { marginTop: 4, paddingLeft: 9, borderLeftWidth: 0.8 },
  bullet: { flexDirection: 'row', marginBottom: 2.6 },
  glyph: { width: 9, fontSize: 8.5, lineHeight: 1.5 },
  bulletText: { flex: 1, fontSize: BASE, lineHeight: 1.45 },

  /* `alignItems: 'baseline'` misplaces a row whose text has nested spans, so
   * the two sides share one line height and align by their tops instead. */
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2.6,
  },
  entryMain: { flex: 1, paddingRight: 8, fontSize: BASE, lineHeight: 1.45 },
  entryAside: {
    fontSize: 8.6,
    lineHeight: (1.45 * BASE) / 8.6,
    paddingTop: 0.4,
  },
  entry: { fontSize: BASE, marginBottom: 2.6, lineHeight: 1.45 },

  footer: {
    position: 'absolute',
    bottom: 22,
    left: MARGIN,
    right: MARGIN,
    fontSize: 7.5,
    textAlign: 'right',
  },

  /* Letter */
  letterDate: { fontSize: 9, marginTop: 14, marginBottom: 12 },
  letterBlock: { fontSize: BASE, marginBottom: 10, lineHeight: 1.55 },
  letterSubject: {
    fontWeight: 600,
    letterSpacing: 0.4,
    marginBottom: 12,
    fontSize: 9.8,
  },
  letterSignature: { fontSize: BASE, fontWeight: 600, marginTop: 4 },
})

/* ------------------------------------------------------------------ *
 * Backgrounds — fixed, text-free, drawn first so they sit under everything.
 * ------------------------------------------------------------------ */

/** The brief pages' hero vignette and gradient-signal rule, for `field`. */
const FieldGround = () => (
  <Svg
    fixed
    width={PAGE_W}
    height={PAGE_H}
    viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}
    style={{ position: 'absolute', top: 0, left: 0 }}
  >
    <Defs>
      <LinearGradient id="signal" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={hex(ink.accentDeep)} />
        <Stop offset="0.55" stopColor={hex(ink.accent)} />
        <Stop offset="1" stopColor={hex(ink.accentSky)} />
      </LinearGradient>
      {/* Colour stops, not opacity stops: react-pdf's gradient ignores
          `stopOpacity`, so the fade is drawn in colour down to the paper. */}
      <RadialGradient id="vignette" cx="0.1" cy="0.02" r="0.55">
        <Stop offset="0" stopColor={hex(ink.accentSoft)} />
        <Stop offset="0.45" stopColor="#F3F7FC" />
        <Stop offset="1" stopColor={hex(ink.white)} />
      </RadialGradient>
    </Defs>
    {/* Full page, so the gradient reaches the paper colour before any edge and
        there is no rectangle to see — the fade is the only boundary. */}
    <Rect x={0} y={0} width={PAGE_W} height={PAGE_H} fill="url('#vignette')" />
    <Rect x={0} y={0} width={PAGE_W} height={6} fill="url('#signal')" />
  </Svg>
)

/* ------------------------------------------------------------------ *
 * Letterheads
 * ------------------------------------------------------------------ */

/**
 * Two lines: where and how to reach him, then the links. One line wrapped
 * once the phone joined it, and a wrapped URL reads as a broken address.
 */
const ContactLine = ({
  reach,
  links,
  color,
  style,
}: {
  reach: string[]
  links: string[]
  color: string
  style?: Style
}) => (
  <>
    {[reach, links]
      .filter(line => line.length > 0)
      .map((line, n) => (
        <Text
          key={n}
          style={[
            s.contact,
            { color },
            style ?? {},
            n > 0 ? { marginTop: 1 } : {},
          ]}
        >
          {line.map((item, i) => (
            <Text key={item}>
              {i > 0 ? (
                <Text style={[s.contactSep, { color }]}>{'  ·  '}</Text>
              ) : null}
              {item}
            </Text>
          ))}
        </Text>
      ))}
  </>
)

function Letterhead({
  theme,
  name,
  headline,
  contact,
}: {
  theme: Theme
  name: string
  headline: string
  contact: Contact
}) {
  switch (theme.letterhead) {
    case 'hero':
      return (
        <View
          style={[
            s.hero,
            {
              backgroundColor: hex(ink.accentDeep),
              borderLeftColor: hex(ink.accentSky),
            },
          ]}
        >
          <Text style={s.heroName}>{name}</Text>
          {headline ? (
            <Text style={[s.heroHeadline, { color: hex(ink.accentSky) }]}>
              {headline}
            </Text>
          ) : null}
          <ContactLine
            reach={contact.reach}
            links={contact.links}
            color={hex(ink.onDark)}
            style={s.heroContact}
          />
        </View>
      )
    case 'panel':
      return (
        <View
          style={[
            s.panelHead,
            {
              backgroundColor: hex(ink.accentSoft),
              borderLeftColor: theme.accent,
            },
          ]}
        >
          <Text style={[s.name, { color: theme.ink }]}>{name}</Text>
          {headline ? (
            <Text style={[s.headline, { color: theme.accent }]}>
              {headline}
            </Text>
          ) : null}
          <ContactLine
            reach={contact.reach}
            links={contact.links}
            color={theme.secondary}
          />
        </View>
      )
    case 'field':
      return (
        <View style={s.fieldHead}>
          <Text style={[s.name, { color: theme.ink }]}>{name}</Text>
          {headline ? (
            <Text style={[s.headline, { color: theme.accent }]}>
              {headline}
            </Text>
          ) : null}
          <ContactLine
            reach={contact.reach}
            links={contact.links}
            color={theme.secondary}
          />
        </View>
      )
    case 'typographic':
      return (
        <View style={s.typoHead}>
          <Text style={[s.name, { color: theme.ink }]}>{name}</Text>
          {headline ? (
            <Text style={[s.headline, { color: theme.accent }]}>
              {headline}
            </Text>
          ) : null}
          <ContactLine
            reach={contact.reach}
            links={contact.links}
            color={theme.tertiary}
          />
        </View>
      )
    default:
      return (
        <View style={s.plainHead}>
          <Text style={[s.name, { color: theme.ink }]}>{name}</Text>
          {headline ? (
            <Text style={[s.headline, { color: theme.secondary }]}>
              {headline}
            </Text>
          ) : null}
          <ContactLine
            reach={contact.reach}
            links={contact.links}
            color={theme.tertiary}
          />
        </View>
      )
  }
}

/* ------------------------------------------------------------------ *
 * Section heading
 * ------------------------------------------------------------------ */

const Section = ({ theme, label }: { theme: Theme; label: string }) => {
  // Keeps the heading with at least a few lines of what follows.
  const ahead = { minPresenceAhead: 48 }
  switch (theme.heading) {
    case 'bar':
      return (
        <Text
          {...ahead}
          style={[
            s.hBar,
            { backgroundColor: hex(ink.accentSoft), color: theme.accent },
          ]}
        >
          {label}
        </Text>
      )
    case 'spine':
      return (
        <Text
          {...ahead}
          style={[
            s.hSpine,
            {
              color: theme.accent,
              borderBottomColor: theme.line,
              borderLeftColor: theme.accent,
            },
          ]}
        >
          {label}
        </Text>
      )
    case 'label':
      return (
        <Text
          {...ahead}
          style={[
            s.hLabel,
            { color: theme.accent, borderBottomColor: theme.line },
          ]}
        >
          {label}
        </Text>
      )
    default:
      return (
        <Text
          {...ahead}
          style={[
            s.hUnderline,
            { color: theme.ink, borderBottomColor: theme.line },
          ]}
        >
          {label}
        </Text>
      )
  }
}

/* ------------------------------------------------------------------ *
 * Body blocks — identical across themes
 * ------------------------------------------------------------------ */

const StatBand = ({ theme, cv }: { theme: Theme; cv: CvContent }) =>
  cv.highlights.length > 0 ? (
    <View style={[s.band, { borderBottomColor: theme.line }]}>
      {cv.highlights.map(h => (
        <View key={h.label} style={s.stat}>
          <Text
            style={[
              s.statValue,
              { color: theme.statsInAccent ? theme.accent : theme.ink },
            ]}
          >
            {h.value}
          </Text>
          <Text style={[s.statLabel, { color: theme.tertiary }]}>
            {h.label}
          </Text>
        </View>
      ))}
    </View>
  ) : null

const Roles = ({ theme, cv }: { theme: Theme; cv: CvContent }) => (
  <>
    {cv.roles.map(role => (
      // A role may break across pages — refusing to leaves a third of page
      // one blank — but its header keeps at least two bullets with it, so a
      // title never sits alone at a page foot.
      <View key={role.roleId} style={s.role}>
        <View style={s.roleRow} minPresenceAhead={60}>
          <Text style={[s.roleTitle, { color: theme.ink }]}>{role.title}</Text>
          <Text style={[s.rolePeriod, { color: theme.secondary }]}>
            {role.period}
          </Text>
        </View>
        <View style={s.roleRow}>
          <Text style={[s.roleCompany, { color: theme.accent }]}>
            {role.company}
          </Text>
          <Text style={[s.roleLocation, { color: theme.tertiary }]}>
            {role.location}
          </Text>
        </View>
        <View
          style={
            theme.heading === 'spine'
              ? [s.bulletsSpine, { borderLeftColor: hex(ink.hairlineStrong) }]
              : s.bullets
          }
        >
          {role.bullets.map((b, i) => (
            // A bullet is one to three lines and never splits: a glyph alone
            // at a page foot with its sentence on the next page is the
            // emptiest thing a CV can show.
            <View key={i} style={s.bullet} wrap={false}>
              <Text style={[s.glyph, { color: theme.accent }]}>•</Text>
              <Text style={[s.bulletText, { color: theme.ink }]}>
                {b.label ? <Text style={s.bold}>{b.label}: </Text> : null}
                {b.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ))}
  </>
)

function Body({ theme, cv }: { theme: Theme; cv: CvContent }) {
  return (
    <>
      <StatBand theme={theme} cv={cv} />

      <Section theme={theme} label="Summary" />
      <Text style={[s.summary, { color: theme.ink }]}>{cv.summary}</Text>

      <Section theme={theme} label="Skills" />
      {cv.skills.map(group => (
        <Text key={group.group} style={[s.skill, { color: theme.ink }]}>
          <Text style={s.bold}>{group.group}: </Text>
          <Text style={{ color: theme.secondary }}>
            {group.items.join(' · ')}
          </Text>
        </Text>
      ))}

      <Section theme={theme} label="Work Experience" />
      <Roles theme={theme} cv={cv} />

      <Section theme={theme} label="Education" />
      {cv.education.map(e => (
        <View key={`${e.qualification}-${e.institution}`} style={s.entryRow}>
          <Text style={[s.entryMain, { color: theme.ink }]}>
            <Text style={s.bold}>{e.qualification}</Text>
            <Text
              style={{ color: theme.secondary }}
            >{` — ${e.institution}`}</Text>
          </Text>
          {e.detail ? (
            <Text style={[s.entryAside, { color: theme.tertiary }]}>
              {e.detail}
            </Text>
          ) : null}
        </View>
      ))}

      {cv.certifications.length > 0 && (
        <>
          <Section theme={theme} label="Certifications & Training" />
          {cv.certifications.map(c => (
            <View key={c.entry} style={s.entryRow}>
              <Text style={[s.entryMain, { color: theme.ink }]}>{c.entry}</Text>
              {c.year ? (
                <Text style={[s.entryAside, { color: theme.tertiary }]}>
                  {c.year}
                </Text>
              ) : null}
            </View>
          ))}
        </>
      )}

      <Section theme={theme} label="Languages" />
      <Text style={[s.entry, { color: theme.ink }]}>
        {cv.languages.join('   ·   ')}
      </Text>
    </>
  )
}

/** Page number, only when there is more than one page. */
const Footer = ({ theme }: { theme: Theme }) => (
  <Text
    fixed
    style={[s.footer, { color: theme.tertiary }]}
    render={({ pageNumber, totalPages }) =>
      totalPages > 1 ? `${pageNumber} / ${totalPages}` : ''
    }
  />
)

/* ------------------------------------------------------------------ *
 * Documents
 * ------------------------------------------------------------------ */

interface Contact {
  reach: string[]
  links: string[]
}

const contactOf = (
  cv: Pick<CvContent, 'location' | 'phone' | 'email' | 'links'>
): Contact => ({
  reach: [cv.location, cv.phone, cv.email].filter(Boolean),
  links: cv.links.filter(Boolean),
})

const NO_CONTACT: Contact = { reach: [], links: [] }

export function SingleCv({
  cv,
  variant,
}: {
  cv: CvContent
  variant: SingleVariant
}) {
  const theme = THEMES[variant]
  return (
    <Document
      title={`${cv.fullName} — CV`}
      author={cv.fullName}
      /* No `creator` or `producer` naming a tool: react-pdf defaults to its own
       * name, and a document going to an employer should say who wrote it and
       * nothing else. */
      creator={cv.fullName}
      producer={cv.fullName}
    >
      <Page
        size="A4"
        style={[s.page, { backgroundColor: theme.paper, color: theme.ink }]}
      >
        {theme.letterhead === 'field' ? <FieldGround /> : null}
        <Letterhead
          theme={theme}
          name={cv.fullName}
          headline={cv.headline}
          contact={contactOf(cv)}
        />
        <Body theme={theme} cv={cv} />
        <Footer theme={theme} />
      </Page>
    </Document>
  )
}

const DATE_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  it: 'it-IT',
  de: 'de-DE',
}

/**
 * The cover letter, sharing the CV's letterhead exactly. One page of prose,
 * so no stat band and no section system — those would be decoration on a
 * document that is four paragraphs long.
 */
export function SingleLetter({
  letter,
  cv,
  locale,
  variant,
}: {
  letter: CoverLetterContent
  cv?: CvContent
  locale: Locale
  variant: SingleVariant
}) {
  const theme = THEMES[variant]
  const author = cv?.fullName ?? letter.signature
  const date = new Date().toLocaleDateString(DATE_LOCALES[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document
      title={`${author} — Cover Letter`}
      author={author}
      creator={author}
      producer={author}
    >
      <Page
        size="A4"
        style={[s.page, { backgroundColor: theme.paper, color: theme.ink }]}
      >
        {theme.letterhead === 'field' ? <FieldGround /> : null}
        <Letterhead
          theme={theme}
          name={author}
          headline={cv?.headline ?? ''}
          contact={cv ? contactOf(cv) : NO_CONTACT}
        />
        <Text style={[s.letterDate, { color: theme.tertiary }]}>{date}</Text>
        <Text style={s.letterBlock}>{letter.recipient}</Text>
        <Text style={[s.letterSubject, { color: theme.accent }]}>
          {letter.subject}
        </Text>
        <Text style={s.letterBlock}>{letter.greeting}</Text>
        {letter.paragraphs.map((p, i) => (
          <Text key={i} style={s.letterBlock}>
            {p.text}
          </Text>
        ))}
        <Text style={s.letterBlock}>{letter.closing}</Text>
        <Text style={s.letterSignature}>{letter.signature}</Text>
      </Page>
    </Document>
  )
}
