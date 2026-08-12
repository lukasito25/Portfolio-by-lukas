/**
 * Builds the provisional CV and cover-letter .docx templates.
 *
 * A .docx is a zip of XML, so the template is generated from this script rather
 * than committed as an opaque binary nobody can diff. The script is the
 * readable source; `templates/*.docx` is its build output.
 *
 * These are PROVISIONAL. The plan is to replace them with a template derived
 * from Lukáš's own example CVs — his previous applications plus the ones from
 * friends that got interviews. When that happens, either regenerate from this
 * script with the new layout, or drop his .docx in and mark it up with the same
 * placeholder names. The placeholder set is the contract with
 * `src/lib/documents/schema.ts`; keep them in step.
 *
 * Run: node scripts/build-doc-templates.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import PizZip from 'pizzip'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'templates')

/* ------------------------------------------------------------------ *
 * OOXML helpers
 *
 * One rule matters above all: a docxtemplater placeholder must live inside a
 * single <w:t> run. Word itself loves to split text across runs, which is the
 * classic cause of "Unopened tag" errors — generating the XML here avoids it.
 * ------------------------------------------------------------------ */

const esc = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A paragraph of runs. `style` names an entry in styles.xml. */
const p = (runs, { style = 'Body', spacingAfter = 120, align } = {}) =>
  `<w:p><w:pPr>` +
  `<w:pStyle w:val="${style}"/>` +
  (align ? `<w:jc w:val="${align}"/>` : '') +
  `<w:spacing w:after="${spacingAfter}"/>` +
  `</w:pPr>${runs}</w:p>`

const run = (
  text,
  { bold = false, italic = false, size, color, caps = false } = {}
) =>
  `<w:r><w:rPr>` +
  (bold ? '<w:b/>' : '') +
  (italic ? '<w:i/>' : '') +
  (caps ? '<w:caps/>' : '') +
  (size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : '') +
  (color ? `<w:color w:val="${color}"/>` : '') +
  `</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`

/** A section heading with a rule under it. */
const heading = text =>
  `<w:p><w:pPr><w:pStyle w:val="Heading"/><w:spacing w:before="240" w:after="80"/>` +
  `<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="2" w:color="C8C8CE"/></w:pBdr>` +
  `</w:pPr>${run(text, { bold: true, size: 20, caps: true, color: '15151C' })}</w:p>`

/** A bullet line. Uses a literal glyph rather than numbering.xml — simpler,
 *  and it survives being pasted into another document. */
const bullet = runs =>
  `<w:p><w:pPr><w:pStyle w:val="Body"/><w:spacing w:after="60"/>` +
  `<w:ind w:left="284" w:hanging="284"/></w:pPr>` +
  `${run('• ')}${runs}</w:p>`

/**
 * A loop tag on a paragraph of its own.
 *
 * Docxtemplater only sees tags that sit inside a <w:t> run — a bare "{#roles}"
 * placed between paragraphs is invisible to it and survives into the rendered
 * document as literal text. With `paragraphLoop: true` the wrapper paragraph is
 * dropped during render, so this leaves no blank line behind.
 */
const loop = tag =>
  `<w:p><w:r><w:t xml:space="preserve">${tag}</w:t></w:r></w:p>`

/* ------------------------------------------------------------------ *
 * Shared package parts
 * ------------------------------------------------------------------ */

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

/**
 * Calibri at 10.5pt with generous line spacing. Deliberately plain: an ATS
 * parses it cleanly, and it prints the same everywhere.
 */
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
<w:sz w:val="21"/><w:szCs w:val="21"/><w:color w:val="15151C"/>
</w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:styleId="Body"><w:name w:val="Body"/></w:style>
<w:style w:type="paragraph" w:styleId="Heading"><w:name w:val="Heading"/></w:style>
<w:style w:type="paragraph" w:styleId="Name"><w:name w:val="Name"/></w:style>
</w:styles>`

const document =
  body => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body}
<w:sectPr>
<w:pgSz w:w="11906" w:h="16838"/>
<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
</w:sectPr>
</w:body></w:document>`

function writeDocx(filename, body) {
  const zip = new PizZip()
  zip.file('[Content_Types].xml', CONTENT_TYPES)
  zip.folder('_rels').file('.rels', RELS)
  const word = zip.folder('word')
  word.file('document.xml', document(body))
  word.file('styles.xml', STYLES)
  word.folder('_rels').file('document.xml.rels', DOC_RELS)

  mkdirSync(outDir, { recursive: true })
  const target = join(outDir, filename)
  writeFileSync(
    target,
    zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })
  )
  console.log(`wrote ${target}`)
}

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

const cvBody = [
  p(run('{fullName}', { bold: true, size: 40 }), {
    style: 'Name',
    spacingAfter: 30,
  }),
  p(run('{headline}', { size: 21, color: '4A4A55' }), { spacingAfter: 30 }),
  p(run('{contactLine}', { size: 18, color: '4A4A55' }), { spacingAfter: 140 }),

  heading('Summary'),
  p(run('{summary}')),

  heading('Skills'),
  loop('{#skills}'),
  p(`${run('{group}: ', { bold: true })}${run('{itemsLine}')}`, {
    spacingAfter: 60,
  }),
  loop('{/skills}'),

  heading('Work Experience'),
  loop('{#roles}'),
  p(`${run('{title}', { bold: true })}${run('  ·  ')}${run('{company}')}`, {
    spacingAfter: 20,
  }),
  p(run('{period}  |  {location}', { size: 18, color: '4A4A55' }), {
    spacingAfter: 70,
  }),
  loop('{#bullets}'),
  // The bold lead-in label is the one device carried over from the CVs that
  // actually landed interviews: a recruiter reads the labels down the left
  // edge first, and only then the sentence. `label` is optional — a bullet
  // without one renders as plain text.
  bullet(`${run('{label}', { bold: true })}${run('{text}')}`),
  loop('{/bullets}'),
  p(run(''), { spacingAfter: 70 }),
  loop('{/roles}'),

  heading('Education'),
  loop('{#education}'),
  p(
    `${run('{qualification}', { bold: true })}${run(' — ')}${run('{institution}')}${run('{detailSuffix}', { color: '4A4A55' })}`,
    { spacingAfter: 50 }
  ),
  loop('{/education}'),

  heading('Certifications & Training'),
  loop('{#certifications}'),
  p(`${run('{year}', { bold: true })}${run('{entry}')}`, { spacingAfter: 50 }),
  loop('{/certifications}'),

  heading('Languages'),
  p(run('{languagesLine}')),
].join('')

/* ------------------------------------------------------------------ *
 * Cover letter
 * ------------------------------------------------------------------ */

const letterBody = [
  p(run('{fullName}', { bold: true, size: 32 }), {
    style: 'Name',
    spacingAfter: 40,
  }),
  p(run('{contactLine}', { size: 19, color: '4A4A55' }), { spacingAfter: 320 }),

  p(run('{date}', { size: 19, color: '4A4A55' }), { spacingAfter: 240 }),
  p(run('{recipient}'), { spacingAfter: 240 }),
  p(run('{subject}', { bold: true }), { spacingAfter: 240 }),

  p(run('{greeting}'), { spacingAfter: 180 }),
  loop('{#paragraphs}'),
  p(run('{text}'), { spacingAfter: 180 }),
  loop('{/paragraphs}'),

  p(run('{closing}'), { spacingAfter: 60 }),
  p(run('{signature}')),
].join('')

writeDocx('cv-template.docx', cvBody)
writeDocx('cover-letter-template.docx', letterBody)
