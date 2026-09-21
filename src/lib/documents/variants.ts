/**
 * Document design variants.
 *
 * The generated CV and cover letter carry the same visual language as the
 * portfolio and the fit-brief pages: the Ink & Signal tokens from
 * `globals.css`, applied to paper. Five treatments exist beside the classic so
 * the choice can be made from real documents rather than from a description —
 * see the header of `scripts/build-doc-variants.mjs` for what each one does
 * and why.
 *
 * The same ids select the PDF design: `column` renders the dark-rail
 * two-column page in `pdf/column.tsx`, everything else renders `dossier`.
 *
 * All of them but `column` render an identical text stream in an identical
 * order, and none of them puts a character in a header or a text box.
 * `column` is the exception on both counts: it is the two-column design, so it
 * uses one table, and a parser walks table cells in row-major order — the rail
 * comes out before the main column. That is the trade it exists to test.
 * `scripts/check-doc-text.mjs` asserts the invariant for the rest.
 *
 * `classic` is the original plain template and the .docx default; `column`
 * is the PDF default. Which design a given application should use is decided
 * per posting by `recommend.ts`, from where the posting was found, the country
 * and the sector, and the panel's downloads follow that unless overridden.
 */

export const DOC_VARIANTS = [
  'classic',
  'rule',
  'panel',
  'field',
  'dossier',
  'column',
] as const

export type DocVariant = (typeof DOC_VARIANTS)[number]

/**
 * One default per format, because the two formats go to two readers.
 *
 * The .docx is the upload: `classic`, the plainest single-column page, is the
 * one nothing in an applicant tracking system has ever mis-read. The PDF goes
 * to a person: `column`, the dark-rail page with the photo, is the one he
 * chose from rendered previews of all six. Which design a given application
 * should actually use is decided per posting by `recommend.ts`; these are
 * what it starts from and what a download with no `variant` gets.
 */
export const DEFAULT_DOC_VARIANT: DocVariant = 'classic'
export const DEFAULT_PDF_VARIANT: DocVariant = 'column'

export type DocFormat = 'docx' | 'pdf'

export function defaultVariantFor(format: DocFormat): DocVariant {
  return format === 'pdf' ? DEFAULT_PDF_VARIANT : DEFAULT_DOC_VARIANT
}

/** Shown in the admin download picker. */
export const DOC_VARIANT_LABELS: Record<DocVariant, string> = {
  classic: 'Classic',
  rule: 'Ink & Rule',
  panel: 'Paper & Panel',
  field: 'Signal Field',
  dossier: 'Dossier',
  column: 'Column',
}

export function isDocVariant(value: unknown): value is DocVariant {
  return (DOC_VARIANTS as readonly unknown[]).includes(value)
}

/**
 * `classic` predates the variants and keeps its original filenames, so the
 * default path reads exactly the file it always read.
 */
export function templateFile(
  kind: 'cv' | 'cover-letter',
  variant: DocVariant
): string {
  return variant === 'classic'
    ? `${kind}-template.docx`
    : `${kind}-${variant}.docx`
}
