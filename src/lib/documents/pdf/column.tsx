/**
 * The `column` design as a PDF: a dark rail on the left, the record on the right.
 *
 * Modelled on the two-column résumé he has been sending by hand — a charcoal
 * rail carrying a round photo, boxed section labels and the reference material
 * (contact, education, skills, languages), beside a white column with the name
 * set very large, the summary and the experience. This is the PDF twin of the
 * `column` .docx: same content, same split, drawn where it was put instead of
 * negotiated with a word processor.
 *
 * A two-column PDF is the layout an ATS parses worst, so everything that can
 * be done inside the design to keep it readable is done here, and each one is
 * a deliberate choice rather than a default:
 *
 * - **The content stream is in a parser's order, not the visual one.** A PDF
 *   has no columns; a parser reads the text in the order it was drawn. The
 *   rail is drawn *between* the name block and the body, so extraction reads
 *   name → headline → contact → education → skills → languages → summary →
 *   experience — the name and contact first, every heading intact, nothing
 *   interleaved. `scripts/check-pdf-text.mjs` asserts this.
 * - **The rail content is drawn once**, on the first page, and only its
 *   background repeats. Repeating the contact block on every page would put
 *   the email address in the extracted text twice.
 * - **Nothing textual is an image.** The photo is decorative and carries no
 *   text; the icons are vector strokes with no glyphs in them.
 * - **The headings are the plain words a parser is trained on** — Summary,
 *   Work Experience, Education, Skills, Languages — in the same case the
 *   reference uses.
 * - **The photo is optional.** It renders when a file is supplied and the rail
 *   simply starts with Contact when it is not, because a photo on a CV is a
 *   choice that differs by country and by recruiter.
 *
 * What the reference has that this does not: the second page of portfolio
 * screenshots, the tools list, the hobbies and the references. None of that is
 * in `CvContent`, and the screenshots in particular are text a parser cannot
 * read and a person cannot verify. The portfolio link in the contact block is
 * the replacement.
 */

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  StyleSheet,
} from '@react-pdf/renderer'
import type { CvContent, CoverLetterContent } from '../schema'
import type { Locale } from '@/lib/fit-brief/guardrails'

/* A4 at 72dpi. */
const PAGE_H = 841.89

/* The reference's rail is 38.5% of the page; its main column starts 22pt after. */
const RAIL_W = 229
const GUTTER = 22
const MAIN_X = RAIL_W + GUTTER
const RIGHT = 24
const TOP = 46
const RAIL_PAD = 22
const PHOTO = 128

/* The reference's palette, not the site's: this design matches a document, not
 * a page. Charcoal rail, light grey label boxes, near-black type. */
const RAIL = '#2E2E2E'
const BOX = '#ECECEC'
const INK = '#2E2E2E'
const BODY = '#3A3A3A'
const MUTED = '#5A5A5A'
const ON_RAIL = '#FFFFFF'
const ON_RAIL_SOFT = '#E4E4E4'

export type Photo = { data: Buffer; format: 'jpg' | 'png' }

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Geist',
    fontSize: 9.2,
    lineHeight: 1.45,
    color: BODY,
    backgroundColor: '#FFFFFF',
    paddingTop: TOP,
    paddingBottom: 40,
    paddingLeft: MAIN_X,
    paddingRight: RIGHT,
  },

  railBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: RAIL_W,
    height: PAGE_H,
    backgroundColor: RAIL,
  },
  rail: {
    position: 'absolute',
    left: 0,
    top: TOP,
    width: RAIL_W,
    paddingHorizontal: RAIL_PAD,
    color: ON_RAIL,
  },

  /* The photo is clipped to a circle by its own borderRadius and the white
   * ring is a separate layer drawn over it. A border on the clipping view
   * would inset the image by the border width on the top and left only, so
   * the picture overruns the ring on the other two sides. */
  photoFrame: {
    alignSelf: 'center',
    width: PHOTO,
    height: PHOTO,
    marginTop: 4,
    marginBottom: 6,
  },
  photo: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    objectFit: 'cover',
  },
  photoRing: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },

  box: {
    backgroundColor: BOX,
    paddingVertical: 6.5,
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  boxLabel: {
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: INK,
    lineHeight: 1.2,
  },

  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6.5 },
  contactIcon: { width: 10, height: 10, marginRight: 9 },
  contactText: { fontSize: 8.8, color: ON_RAIL, lineHeight: 1.3 },
  contactLink: {
    fontSize: 8.8,
    color: ON_RAIL,
    lineHeight: 1.3,
    textDecoration: 'underline',
  },

  eduEntry: { marginBottom: 9 },
  eduInstitution: { fontSize: 9.6, fontWeight: 600, lineHeight: 1.35 },
  eduQualification: { fontSize: 9, color: ON_RAIL_SOFT, lineHeight: 1.35 },
  eduDetail: { fontSize: 8.8, fontWeight: 700, lineHeight: 1.4 },

  skillGroup: { fontSize: 9.2, fontWeight: 600, marginTop: 5, lineHeight: 1.4 },
  skillItem: { fontSize: 9, color: ON_RAIL_SOFT, lineHeight: 1.42 },
  skillInline: { fontSize: 8.8, color: ON_RAIL_SOFT, lineHeight: 1.42 },

  language: {
    fontSize: 9,
    color: ON_RAIL_SOFT,
    lineHeight: 1.45,
    marginBottom: 2,
  },

  /* The name, set the way the reference sets it: the heaviest cut, upper case,
   * one word to a line. */
  name: {
    fontSize: 38,
    fontWeight: 900,
    lineHeight: 1.0,
    letterSpacing: 0.4,
    color: INK,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 13,
    lineHeight: 1.3,
    letterSpacing: 1.1,
    color: INK,
    marginTop: 7,
  },

  /* The figures, set as a quiet row under the headline. The reference has no
   * band; the numbers are the strongest thing on the page, so they get the
   * position without the decoration. */
  figures: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 9,
    borderTopWidth: 0.7,
    borderTopColor: '#D6D6D6',
  },
  figure: { flex: 1, paddingRight: 6 },
  figureValue: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.15,
    color: INK,
    letterSpacing: -0.3,
  },
  figureLabel: {
    fontSize: 6.5,
    lineHeight: 1.3,
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 1.5,
  },

  section: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: INK,
    textTransform: 'uppercase',
    lineHeight: 1.2,
    marginTop: 14,
    marginBottom: 6,
  },
  summary: {
    fontSize: 9.2,
    lineHeight: 1.55,
    color: MUTED,
    textAlign: 'justify',
  },

  role: { marginBottom: 9 },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roleCompany: {
    fontSize: 11,
    fontWeight: 700,
    color: INK,
    flex: 1,
    lineHeight: 1.25,
  },
  rolePeriod: {
    fontSize: 9.4,
    fontWeight: 700,
    color: INK,
    letterSpacing: 0.4,
    marginLeft: 10,
    lineHeight: (1.25 * 11) / 9.4,
    paddingTop: 0.4,
  },
  roleSubtitle: { fontSize: 9.4, color: BODY, marginTop: 1.5, lineHeight: 1.3 },
  bullets: { marginTop: 4.5 },
  bullet: { flexDirection: 'row', marginBottom: 2.2 },
  bulletGlyph: { width: 10, fontSize: 8.8, color: INK },
  bulletText: { flex: 1, fontSize: 8.9, lineHeight: 1.42, color: BODY },
  bulletLabel: { fontWeight: 600, color: INK },

  entry: { fontSize: 9.2, marginBottom: 2.5, color: BODY },
  entryYear: { fontWeight: 700, color: INK },

  letterDate: { fontSize: 9, color: MUTED, marginTop: 18, marginBottom: 14 },
  letterBlock: { fontSize: 9.4, marginBottom: 10, lineHeight: 1.5 },
  letterSubject: {
    fontSize: 10,
    fontWeight: 700,
    color: INK,
    letterSpacing: 0.6,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  letterSignature: { fontSize: 9.4, fontWeight: 700, color: INK, marginTop: 4 },
})

/* ------------------------------------------------------------------ *
 * Icons — vector strokes only. No glyph inside an icon, so nothing here
 * can be mistaken for text by a parser or lost by one.
 * ------------------------------------------------------------------ */

const stroke = { stroke: ON_RAIL, strokeWidth: 0.9, fill: 'none' } as const

const MailIcon = () => (
  <Svg viewBox="0 0 10 10" style={styles.contactIcon}>
    <Rect x={1} y={2.4} width={8} height={5.8} rx={0.8} {...stroke} />
    <Polyline points="1.4,3 5,6 8.6,3" {...stroke} />
  </Svg>
)

const PhoneIcon = () => (
  <Svg viewBox="0 0 10 10" style={styles.contactIcon}>
    <Path
      d="M2.2 1.4 L3.6 1.2 L4.4 3.2 L3.4 4 C3.9 5.2 4.8 6.1 6 6.6 L6.8 5.6 L8.8 6.4 L8.6 7.8 C8.5 8.4 8 8.8 7.4 8.7 C4.4 8.3 1.7 5.6 1.3 2.6 C1.2 2 1.6 1.5 2.2 1.4 Z"
      {...stroke}
    />
  </Svg>
)

const PinIcon = () => (
  <Svg viewBox="0 0 10 10" style={styles.contactIcon}>
    <Path
      d="M5 9.4 C5 9.4 1.9 6.2 1.9 4.1 A3.1 3.1 0 0 1 8.1 4.1 C8.1 6.2 5 9.4 5 9.4 Z"
      {...stroke}
    />
    <Circle cx={5} cy={4.1} r={1.05} {...stroke} />
  </Svg>
)

const GlobeIcon = () => (
  <Svg viewBox="0 0 10 10" style={styles.contactIcon}>
    <Circle cx={5} cy={5} r={3.9} {...stroke} />
    <Line x1={1.1} y1={5} x2={8.9} y2={5} {...stroke} />
    <Path
      d="M5 1.1 C3.3 2.6 3.3 7.4 5 8.9 M5 1.1 C6.7 2.6 6.7 7.4 5 8.9"
      {...stroke}
    />
  </Svg>
)

const LinkedInIcon = () => (
  <Svg viewBox="0 0 10 10" style={styles.contactIcon}>
    <Rect x={1} y={1} width={8} height={8} rx={1} {...stroke} />
    <Line x1={3.2} y1={4.4} x2={3.2} y2={7.4} {...stroke} strokeWidth={1.1} />
    <Circle cx={3.2} cy={2.9} r={0.55} fill={ON_RAIL} stroke="none" />
    <Path
      d="M5 7.4 V4.4 M5 5.5 C5 4.2 7 4.2 7 5.5 V7.4"
      {...stroke}
      strokeWidth={1.1}
    />
  </Svg>
)

const isLinkedIn = (link: string) => /linkedin\.com/i.test(link)
const href = (link: string) =>
  /^https?:\/\//i.test(link) ? link : `https://${link}`

/* ------------------------------------------------------------------ *
 * Rail pieces
 * ------------------------------------------------------------------ */

const Box = ({ label }: { label: string }) => (
  <View style={styles.box}>
    <Text style={styles.boxLabel}>{label.toUpperCase()}</Text>
  </View>
)

const Contact = ({
  cv,
}: {
  cv: Pick<CvContent, 'phone' | 'email' | 'links' | 'location'>
}) => (
  <>
    <Box label="Contact" />
    {cv.phone ? (
      <View style={styles.contactRow}>
        <PhoneIcon />
        <Text style={styles.contactText}>{cv.phone}</Text>
      </View>
    ) : null}
    {cv.email ? (
      <View style={styles.contactRow}>
        <MailIcon />
        <Text style={styles.contactText}>{cv.email}</Text>
      </View>
    ) : null}
    {cv.links.map(link => (
      <View key={link} style={styles.contactRow}>
        {isLinkedIn(link) ? <LinkedInIcon /> : <GlobeIcon />}
        <Link src={href(link)} style={styles.contactLink}>
          {link}
        </Link>
      </View>
    ))}
    {cv.location ? (
      <View style={styles.contactRow}>
        <PinIcon />
        <Text style={styles.contactText}>{cv.location}</Text>
      </View>
    ) : null}
  </>
)

const PhotoFrame = ({ photo }: { photo?: Photo }) =>
  photo ? (
    <View style={styles.photoFrame}>
      <Image src={photo} style={styles.photo} />
      <View style={styles.photoRing} />
    </View>
  ) : null

/**
 * The name block, one word to a line like the reference. The last word is the
 * surname; everything before it shares the first line, so a two-word name
 * splits exactly and a three-word one keeps its given names together.
 */
const NameBlock = ({ name, headline }: { name: string; headline: string }) => {
  const words = name.trim().split(/\s+/)
  const lines =
    words.length > 1
      ? [words.slice(0, -1).join(' '), words[words.length - 1]]
      : words
  return (
    <View>
      {lines.map(line => (
        <Text key={line} style={styles.name}>
          {line}
        </Text>
      ))}
      {headline ? <Text style={styles.headline}>{headline}</Text> : null}
    </View>
  )
}

const Section = ({ label }: { label: string }) => (
  <Text minPresenceAhead={48} style={styles.section}>
    {label}
  </Text>
)

/** Page number, only when there is more than one page. */
const Footer = () => (
  <Text
    fixed
    style={{
      position: 'absolute',
      bottom: 22,
      right: RIGHT,
      fontSize: 7.5,
      color: MUTED,
    }}
    render={({ pageNumber, totalPages }) =>
      totalPages > 1 ? `${pageNumber} / ${totalPages}` : ''
    }
  />
)

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

function CvDocument({ cv, photo }: { cv: CvContent; photo?: Photo }) {
  // One skill to a line reads best and is what the reference does; past a
  // certain count the rail runs off the page, so a long list is set inline per
  // group instead. Either way the words are the same and in the same order.
  const skillCount = cv.skills.reduce((n, g) => n + g.items.length, 0)
  const compactSkills = skillCount > 16

  return (
    <Document
      title={`${cv.fullName} — CV`}
      author={cv.fullName}
      creator={cv.fullName}
      producer={cv.fullName}
    >
      <Page size="A4" style={styles.page}>
        {/* Background only. `fixed` repeats it on every page; it holds no
            text, so repeating it costs the extraction nothing. */}
        <View fixed style={styles.railBackground} />

        {/* 1. Name first, so the parser's first line is his name. */}
        <NameBlock name={cv.fullName} headline={cv.headline} />
        {cv.highlights.length > 0 && (
          <View style={styles.figures}>
            {cv.highlights.map(h => (
              <View key={h.label} style={styles.figure}>
                <Text style={styles.figureValue}>{h.value}</Text>
                <Text style={styles.figureLabel}>{h.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 2. The rail — drawn once, here, so contact follows the name in the
            content stream and the reference material precedes the body. */}
        <View style={styles.rail}>
          <PhotoFrame photo={photo} />
          <Contact cv={cv} />

          <Box label="Education" />
          {cv.education.map(e => (
            <View
              key={`${e.qualification}-${e.institution}`}
              style={styles.eduEntry}
            >
              <Text style={styles.eduInstitution}>{e.institution}</Text>
              <Text style={styles.eduQualification}>{e.qualification}</Text>
              {e.detail ? (
                <Text style={styles.eduDetail}>{e.detail}</Text>
              ) : null}
            </View>
          ))}

          <Box label="Skills" />
          {cv.skills.map(group => (
            <View key={group.group}>
              <Text style={styles.skillGroup}>{group.group}</Text>
              {compactSkills ? (
                <Text style={styles.skillInline}>
                  {group.items.join(' · ')}
                </Text>
              ) : (
                group.items.map(item => (
                  <Text key={item} style={styles.skillItem}>
                    {item}
                  </Text>
                ))
              )}
            </View>
          ))}

          {cv.languages.length > 0 && (
            <>
              <Box label="Languages" />
              {cv.languages.map(l => (
                <Text key={l} style={styles.language}>
                  {l}
                </Text>
              ))}
            </>
          )}
        </View>

        {/* 3. The body, flowing down the main column and onto further pages. */}
        <Section label="Summary" />
        <Text style={styles.summary}>{cv.summary}</Text>

        <Section label="Work Experience" />
        {cv.roles.map(role => (
          <View key={role.roleId} style={styles.role}>
            <View style={styles.roleHeader} minPresenceAhead={60}>
              <Text style={styles.roleCompany}>{role.company}</Text>
              <Text style={styles.rolePeriod}>{role.period}</Text>
            </View>
            <Text style={styles.roleSubtitle}>
              {[role.title, role.location].filter(Boolean).join(' | ')}
            </Text>
            <View style={styles.bullets}>
              {role.bullets.map((b, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletGlyph}>•</Text>
                  <Text style={styles.bulletText}>
                    {b.label ? (
                      <Text style={styles.bulletLabel}>{b.label}: </Text>
                    ) : null}
                    {b.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {cv.certifications.length > 0 && (
          <>
            <Section label="Certifications & Training" />
            {cv.certifications.map(c => (
              <Text key={c.entry} style={styles.entry}>
                {c.year ? (
                  <Text style={styles.entryYear}>{`${c.year} — `}</Text>
                ) : null}
                {c.entry}
              </Text>
            ))}
          </>
        )}
        <Footer />
      </Page>
    </Document>
  )
}

/* ------------------------------------------------------------------ *
 * Cover letter — the same rail and name block, so the two documents in one
 * application open with the same face. The rail carries contact only; a
 * letter has no use for the skills list beside it.
 * ------------------------------------------------------------------ */

const DATE_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  it: 'it-IT',
  de: 'de-DE',
}

function LetterDocument({
  letter,
  cv,
  locale,
  photo,
}: {
  letter: CoverLetterContent
  cv?: CvContent
  locale: Locale
  photo?: Photo
}) {
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
      <Page size="A4" style={styles.page}>
        <View fixed style={styles.railBackground} />
        <NameBlock name={author} headline={cv?.headline ?? ''} />
        <View style={styles.rail}>
          <PhotoFrame photo={photo} />
          {cv ? <Contact cv={cv} /> : null}
        </View>

        <Text style={styles.letterDate}>{date}</Text>
        <Text style={styles.letterBlock}>{letter.recipient}</Text>
        <Text style={styles.letterSubject}>{letter.subject}</Text>
        <Text style={styles.letterBlock}>{letter.greeting}</Text>
        {letter.paragraphs.map((p, i) => (
          <Text key={i} style={styles.letterBlock}>
            {p.text}
          </Text>
        ))}
        <Text style={styles.letterBlock}>{letter.closing}</Text>
        <Text style={styles.letterSignature}>{letter.signature}</Text>
      </Page>
    </Document>
  )
}

export const ColumnCv = CvDocument
export const ColumnLetter = LetterDocument
