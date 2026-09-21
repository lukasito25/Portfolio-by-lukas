/**
 * Shared OOXML building blocks for the CV and cover-letter templates.
 *
 * Extracted from `build-doc-templates.mjs` so the prototype variants in
 * `build-doc-variants.mjs` are built by the same code that builds the shipping
 * template — a divergence between the two would show up as a document that
 * looks right in the prototype and wrong in the application.
 *
 * The one rule that matters above all: a docxtemplater placeholder must live
 * inside a single <w:t> run. Word itself loves to split text across runs, which
 * is the classic cause of "Unopened tag" errors — generating the XML here
 * avoids it entirely.
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import PizZip from 'pizzip'
import { TYPE, buildFontParts } from './doc-fonts.mjs'
import ink from '../src/lib/documents/ink.json' with { type: 'json' }

export { TYPE }

/* ------------------------------------------------------------------ *
 * Ink & Signal — the site's light-theme tokens, as Word hex.
 *
 * Sourced from `src/app/globals.css` :root. Word has no notion of alpha on
 * text or shading, so the translucent tokens are pre-composited onto white:
 * `--border` rgba(21,21,28,0.1) becomes E4E4E8, `--accent-soft`
 * rgba(18,119,217,0.1) becomes E8F1FB.
 * ------------------------------------------------------------------ */

export const INK = ink

/* A4, in the two units OOXML insists on using at once. */
export const PAGE = {
  widthTwips: 11906,
  heightTwips: 16838,
  /** Text column width at the standard 1134-twip (2 cm) margins. */
  contentTwips: 11906 - 1134 * 2,
  widthEmu: 7560000, // 210mm × 36000 EMU/mm
  heightEmu: 10692000, // 297mm × 36000 EMU/mm
}

export const esc = s =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ------------------------------------------------------------------ *
 * Runs and paragraphs
 *
 * Both emit their properties in schema order. Word is forgiving about it and
 * LibreOffice is not, and a document that only opens in one of them is not
 * something to hand a recruiter.
 * ------------------------------------------------------------------ */

/**
 * @param {string} text
 * @param {object} [o]
 * @param {number} [o.size]   half-points, so 21 = 10.5pt
 * @param {number} [o.track]  letter spacing in twentieths of a point; the
 *                            site's `.section-label` is 0.18em, which at 8pt
 *                            is ~1.4pt, i.e. 29
 */
export const run = (
  text,
  {
    // Defaulted, not inherited. The font is also set in `docDefaults`, but
    // several consumers — Google Docs, LibreOffice, and the docx-preview
    // renderer used to check this work — ignore `docDefaults/rPrDefault` and
    // fall back to their own default face. Naming it on every run is the only
    // form all of them honour.
    font = TYPE.body,
    bold = false,
    italic = false,
    caps = false,
    color,
    track,
    size,
    underline,
  } = {}
) =>
  `<w:r><w:rPr>` +
  (font
    ? `<w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>`
    : '') +
  (bold ? '<w:b/>' : '') +
  (italic ? '<w:i/>' : '') +
  (caps ? '<w:caps/>' : '') +
  (color ? `<w:color w:val="${color}"/>` : '') +
  (track ? `<w:spacing w:val="${track}"/>` : '') +
  (size ? `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>` : '') +
  (underline ? `<w:u w:val="single" w:color="${underline}"/>` : '') +
  `</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`

/**
 * A tab character as its own run.
 *
 * The only way to build a grid without a table: a paragraph of runs separated
 * by tabs, against tab stops declared on the paragraph. An ATS reads it as one
 * line of text, which is exactly what it is.
 */
export const tab = () => '<w:r><w:tab/></w:r>'

const edge = (side, b) =>
  b
    ? `<w:${side} w:val="${b.val ?? 'single'}" w:sz="${b.sz ?? 4}" w:space="${b.space ?? 0}" w:color="${b.color ?? 'auto'}"/>`
    : ''

/**
 * A paragraph of runs.
 *
 * `shd` plus `border` is how a Word document gets a padded, filled block: the
 * fill extends into the space reserved by the borders, so a border in the fill
 * colour is invisible and behaves as padding. It is the only way to inset text
 * from the edge of its own background — an indent would shrink the fill with
 * the text still flush against it.
 */
export const p = (
  runs,
  {
    style = 'Body',
    keepNext = false,
    numbered = false,
    border,
    shd,
    tabs,
    before,
    after = 120,
    line,
    ind,
    align,
  } = {}
) =>
  `<w:p><w:pPr>` +
  `<w:pStyle w:val="${style}"/>` +
  (keepNext ? '<w:keepNext/>' : '') +
  (numbered
    ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'
    : '') +
  (border
    ? `<w:pBdr>${edge('top', border.top)}${edge('left', border.left)}${edge('bottom', border.bottom)}${edge('right', border.right)}</w:pBdr>`
    : '') +
  (shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${shd}"/>` : '') +
  (tabs
    ? `<w:tabs>${tabs
        .map(
          t =>
            `<w:tab w:val="${t.align ?? 'left'}" w:pos="${t.pos}"${t.leader ? ` w:leader="${t.leader}"` : ''}/>`
        )
        .join('')}</w:tabs>`
    : '') +
  `<w:spacing${before === undefined ? '' : ` w:before="${before}"`} w:after="${after}"${line ? ` w:line="${line}" w:lineRule="auto"` : ''}/>` +
  (ind
    ? `<w:ind${ind.left === undefined ? '' : ` w:left="${ind.left}"`}${ind.right === undefined ? '' : ` w:right="${ind.right}"`}${ind.hanging === undefined ? '' : ` w:hanging="${ind.hanging}"`}${ind.firstLine === undefined ? '' : ` w:firstLine="${ind.firstLine}"`}/>`
    : '') +
  (align ? `<w:jc w:val="${align}"/>` : '') +
  `</w:pPr>${runs}</w:p>`

/**
 * A loop tag on a paragraph of its own.
 *
 * Docxtemplater only sees tags inside a <w:t> run — a bare "{#roles}" placed
 * between paragraphs is invisible to it and survives into the rendered document
 * as literal text. With `paragraphLoop: true` the wrapper paragraph is dropped
 * during render, so this leaves no blank line behind.
 */
export const loop = tag =>
  `<w:p><w:r><w:t xml:space="preserve">${tag}</w:t></w:r></w:p>`

/** A spacer that carries a fill, used to pad the top and bottom of a block. */
export const shadedGap = (fill, { size = 8, after = 0 } = {}) =>
  p(
    `<w:r><w:rPr><w:sz w:val="${size}"/></w:rPr><w:t xml:space="preserve"></w:t></w:r>`,
    {
      shd: fill,
      after,
    }
  )

/* ------------------------------------------------------------------ *
 * Tables
 *
 * Used by exactly one design, and reluctantly. A table is the only way to get
 * a genuine two-column CV out of Word, and it is also the one layout choice
 * that measurably degrades ATS parsing: a parser walks cells in row-major
 * order, so everything in the left rail is extracted before anything in the
 * main column. Keep the letterhead outside the table, keep it to one row, and
 * never nest.
 * ------------------------------------------------------------------ */

/**
 * One cell.
 *
 * `margin` is the padding, in twips, and it is a real cell property rather
 * than the border-spacing trick paragraphs need — `w:tcMar` insets the content
 * and the fill covers the whole cell either way.
 */
export const cell = ({ width, shd, margin = 227, body }) =>
  `<w:tc><w:tcPr>` +
  `<w:tcW w:w="${width}" w:type="dxa"/>` +
  (shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${shd}"/>` : '') +
  `<w:tcMar>` +
  `<w:top w:w="${margin}" w:type="dxa"/><w:left w:w="${margin}" w:type="dxa"/>` +
  `<w:bottom w:w="${margin}" w:type="dxa"/><w:right w:w="${margin}" w:type="dxa"/>` +
  `</w:tcMar>` +
  `<w:vAlign w:val="top"/>` +
  `</w:tcPr>${body}</w:tc>`

/**
 * A single-row table with no visible borders.
 *
 * Two rules the OOXML schema enforces and Word does not warn about: a cell must
 * end with a paragraph, and a table may not be the last element of the body —
 * hence the trailing empty paragraph, which is part of the table's output
 * rather than something a caller has to remember.
 */
export const table = cells =>
  `<w:tbl><w:tblPr>` +
  `<w:tblW w:w="${cells.reduce((n, c) => n + c.width, 0)}" w:type="dxa"/>` +
  `<w:tblLayout w:type="fixed"/>` +
  `<w:tblBorders>` +
  ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']
    .map(side => `<w:${side} w:val="nil"/>`)
    .join('') +
  `</w:tblBorders>` +
  `<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar>` +
  `</w:tblPr>` +
  `<w:tblGrid>${cells.map(c => `<w:gridCol w:w="${c.width}"/>`).join('')}</w:tblGrid>` +
  `<w:tr>${cells.map(cell).join('')}</w:tr>` +
  `</w:tbl>` +
  p('', { after: 0 })

/* ------------------------------------------------------------------ *
 * Package
 * ------------------------------------------------------------------ */

const NS =
  'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
  'xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" ' +
  'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" ' +
  'mc:Ignorable="w14" ' +
  'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
  'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
  'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
  'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'

/**
 * Geist at 10.5pt with generous line spacing — the site's own body face,
 * carried inside the package (see `doc-fonts.mjs`) rather than named and hoped
 * for. `w:altName` in the font table makes Arial the substitute if a reader
 * ignores the embedded font.
 *
 * The three run defaults below are the ones a word processor leaves off and a
 * typesetter never would: `w:kern` turns on pair kerning above 8pt,
 * `w14:ligatures` enables the standard ligatures, and `w:widowControl` stops a
 * single line of a paragraph being stranded across a page break.
 */
const styles = ({ body = TYPE.body, ink = INK.ink } = {}) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
 xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
 xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="w14">
<w:docDefaults><w:rPrDefault><w:rPr>
<w:rFonts w:ascii="${body}" w:hAnsi="${body}" w:cs="${body}"/>
<w:kern w:val="16"/>
<w:sz w:val="21"/><w:szCs w:val="21"/><w:color w:val="${ink}"/>
<w14:ligatures w14:val="standardContextual"/>
</w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr>
<w:widowControl/>
<w:spacing w:line="264" w:lineRule="auto"/>
</w:pPr></w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:styleId="Body"><w:name w:val="Body"/>
<w:rPr><w:rFonts w:ascii="${body}" w:hAnsi="${body}" w:cs="${body}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading"><w:name w:val="Heading"/>
<w:rPr><w:rFonts w:ascii="${body}" w:hAnsi="${body}" w:cs="${body}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Name"><w:name w:val="Name"/>
<w:rPr><w:rFonts w:ascii="${TYPE.display}" w:hAnsi="${TYPE.display}" w:cs="${TYPE.display}"/></w:rPr></w:style>
</w:styles>`

/**
 * A full-page picture anchored behind the text, in the header so it repeats on
 * every page.
 *
 * This is the mechanism Word's own watermark uses, and the reason it is used
 * here rather than a page background colour: `w:background` is not printed
 * unless the reader has turned on "Print background colors and images", and it
 * is dropped by most PDF exports. An anchored picture prints and exports
 * everywhere. Nothing but the picture goes in the header — text placed there is
 * invisible to a good share of applicant tracking systems.
 */
const headerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr ${NS}>
<w:p><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:rPr><w:sz w:val="2"/></w:rPr></w:pPr>
<w:r><w:rPr><w:noProof/><w:sz w:val="2"/></w:rPr><w:drawing>
<wp:anchor distT="0" distB="0" distL="0" distR="0" simplePos="0" relativeHeight="1" behindDoc="1" locked="0" layoutInCell="0" allowOverlap="1">
<wp:simplePos x="0" y="0"/>
<wp:positionH relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionH>
<wp:positionV relativeFrom="page"><wp:posOffset>0</wp:posOffset></wp:positionV>
<wp:extent cx="${PAGE.widthEmu}" cy="${PAGE.heightEmu}"/>
<wp:effectExtent l="0" t="0" r="0" b="0"/>
<wp:wrapNone/>
<wp:docPr id="1" name="Background"/>
<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>
<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="background.png"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${PAGE.widthEmu}" cy="${PAGE.heightEmu}"/></a:xfrm>
<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic></a:graphicData></a:graphic>
</wp:anchor></w:drawing></w:r></w:p>
</w:hdr>`

/**
 * `w:embedTrueTypeFonts` and `w:saveSubsetFonts` are what tell a reader the
 * package carries its own type and that the faces are subsets, not full
 * families. Without them Word may load `fontTable.xml` and still substitute.
 */
const settingsXml = pageColor =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:embedTrueTypeFonts/>
<w:saveSubsetFonts/>
${pageColor ? '<w:displayBackgroundShape/>' : ''}
</w:settings>`

/**
 * One bullet list definition.
 *
 * Replaces the literal "•" glyph the templates used to emit as text. Two
 * reasons, and the second matters more: a real list gives Word a proper hanging
 * indent that survives being pasted elsewhere, and the glyph stops appearing in
 * the extracted text stream — an ATS was reading a bullet character in front of
 * every achievement.
 */
const NUMBERING = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:abstractNum w:abstractNumId="0">
<w:lvl w:ilvl="0">
<w:start w:val="1"/>
<w:numFmt w:val="bullet"/>
<w:lvlText w:val="\u2022"/>
<w:lvlJc w:val="left"/>
<w:suff w:val="space"/>
<w:pPr><w:ind w:left="284" w:hanging="284"/></w:pPr>
<w:rPr><w:rFonts w:ascii="${TYPE.body}" w:hAnsi="${TYPE.body}" w:hint="default"/>
<w:color w:val="${INK.accent}"/></w:rPr>
</w:lvl>
</w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`

/**
 * Document metadata.
 *
 * Written deliberately, and deliberately incomplete. A `.docx` with no
 * `docProps` at all is unusual enough to tell anyone who unzips it that a
 * script produced the file, so the author is stated. There is no
 * `docProps/app.xml`, because that part carries
 * `<Application>Microsoft Office Word</Application>` and claiming that would be
 * a lie. `src/lib/documents/render.ts` overwrites the placeholder values with
 * the CV's own name at render time.
 */
const coreXml = (author = '', title = '') =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:title>${esc(title)}</dc:title>
<dc:creator>${esc(author)}</dc:creator>
<cp:lastModifiedBy>${esc(author)}</cp:lastModifiedBy>
</cp:coreProperties>`

export { coreXml }

/**
 * Assemble and write a `.docx`.
 *
 * Rel ids are fixed rather than sequential so the parts can be added
 * conditionally without renumbering: 1 styles, 2 settings, 3 header,
 * 4 fontTable, 5 numbering, 10+ the embedded fonts.
 *
 * @param {object} opts
 * @param {string} opts.path        absolute output path
 * @param {string} opts.body        the assembled <w:p> stream
 * @param {string} [opts.pageColor] on-screen page fill; see the note on
 *                                  `headerXml` for why this alone is not enough
 * @param {Buffer} [opts.background] full-page PNG anchored behind the text
 * @param {number} [opts.margin]    page margin in twips (1134 = 2cm)
 */
export function writeDocx({
  path,
  body,
  pageColor,
  background,
  margin = 1134,
}) {
  const zip = new PizZip()
  const fonts = buildFontParts(10)

  const contentTypes = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/>',
    background ? '<Default Extension="png" ContentType="image/png"/>' : '',
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>',
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>',
    '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>',
    '<Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>',
    '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>',
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
    background
      ? '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
      : '',
    '</Types>',
  ].join('')

  const rel = (id, type, target) =>
    `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/${type}" Target="${target}"/>`

  const docRels = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    rel('rId1', 'officeDocument/2006/relationships/styles', 'styles.xml'),
    rel('rId2', 'officeDocument/2006/relationships/settings', 'settings.xml'),
    background
      ? rel('rId3', 'officeDocument/2006/relationships/header', 'header1.xml')
      : '',
    rel('rId4', 'officeDocument/2006/relationships/fontTable', 'fontTable.xml'),
    rel('rId5', 'officeDocument/2006/relationships/numbering', 'numbering.xml'),
    '</Relationships>',
  ].join('')

  /**
   * Font relationships hang off `fontTable.xml`, not off the document.
   *
   * The `r:id` values inside `fontTable.xml` are resolved against this part's
   * own rels, so putting them in `document.xml.rels` produces a package that
   * validates, opens without complaint, and silently falls back to the
   * substitute font — which is exactly how the bug presented.
   */
  const fontRels = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    ...fonts.rels.map(f =>
      rel(f.id, 'officeDocument/2006/relationships/font', f.target)
    ),
    '</Relationships>',
  ].join('')

  const packageRels = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    rel(
      'rId1',
      'officeDocument/2006/relationships/officeDocument',
      'word/document.xml'
    ),
    rel(
      'rId2',
      'package/2006/relationships/metadata/core-properties',
      'docProps/core.xml'
    ),
    '</Relationships>',
  ].join('')

  const document =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<w:document ${NS}>` +
    (pageColor ? `<w:background w:color="${pageColor}"/>` : '') +
    `<w:body>${body}` +
    `<w:sectPr>` +
    (background ? '<w:headerReference w:type="default" r:id="rId3"/>' : '') +
    `<w:pgSz w:w="${PAGE.widthTwips}" w:h="${PAGE.heightTwips}"/>` +
    `<w:pgMar w:top="${margin}" w:right="${margin}" w:bottom="${margin}" w:left="${margin}" w:header="0" w:footer="708" w:gutter="0"/>` +
    `</w:sectPr></w:body></w:document>`

  zip.file('[Content_Types].xml', contentTypes)
  zip.folder('_rels').file('.rels', packageRels)
  zip.folder('docProps').file('core.xml', coreXml())

  const word = zip.folder('word')
  word.file('document.xml', document)
  word.file('styles.xml', styles())
  word.file('settings.xml', settingsXml(pageColor))
  word.file('fontTable.xml', fonts.fontTable)
  word.file('numbering.xml', NUMBERING)
  word.folder('_rels').file('document.xml.rels', docRels)
  word.folder('_rels').file('fontTable.xml.rels', fontRels)

  for (const part of fonts.parts) zip.file(part.path, part.data)

  if (background) {
    word.file('header1.xml', headerXml)
    word.folder('_rels').file(
      'header1.xml.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/background.png"/>
</Relationships>`
    )
    word.folder('media').file('background.png', background)
  }

  mkdirSync(path.replace(/\/[^/]+$/, ''), { recursive: true })
  writeFileSync(
    path,
    zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })
  )
  return path
}

/**
 * The stat band — four numbers over their labels, the fit-brief hero band.
 *
 * A tab grid rather than a table: an ATS reads two ordinary lines of text, and
 * `renderCv` supplies four fixed slots because a docxtemplater loop cannot run
 * inside a paragraph. `{#hasHighlights}` drops the band, rule and all, for a CV
 * generated before the field existed. Every design carries it: the numbers
 * are the strongest thing on the page, and a design that dropped them would
 * be the one design a recruiter never saw them on.
 *
 * @param {number} width   content width in twips
 * @param {object} style
 * @param {object} style.value  run style for the figures
 * @param {object} style.label  run style for the labels
 * @param {string} style.rule   hairline colour under the band
 */
export const statBand = (width, { value, label, rule }) => {
  const step = Math.round(width / 4)
  const stops = [1, 2, 3].map(i => ({ pos: step * i }))
  const line = (slot, style) =>
    [1, 2, 3, 4].map(i => run(`{h${i}${slot}}`, style)).join(tab())

  return (
    loop('{#hasHighlights}') +
    p(line('value', value), { tabs: stops, keepNext: true, after: 0 }) +
    p(line('label', label), {
      tabs: stops,
      after: 260,
      border: { bottom: { sz: 4, color: rule, space: 8 } },
    }) +
    loop('{/hasHighlights}')
  )
}
