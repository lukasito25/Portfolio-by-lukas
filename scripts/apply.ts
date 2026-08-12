/**
 * The application engine, from the terminal.
 *
 *   npx tsx scripts/apply.ts <url|file|->  [--out ~/Applications] [--no-docs]
 *
 * Examples:
 *   npx tsx scripts/apply.ts https://jobs.lever.co/qonto/7c6908ae-…
 *   npx tsx scripts/apply.ts ~/Downloads/posting.pdf
 *   pbpaste | npx tsx scripts/apply.ts -
 *
 * Runs the same pipeline as /admin/applications and writes the same rows, so a
 * brief generated here shows up in the admin panel for review and publishing.
 * The difference is where it runs: this path can reach a local agent suite and
 * a local Ollama, and it drops the .docx files straight into a folder rather
 * than a browser download.
 *
 * Requires the agent suite to be running:
 *   cd "../../Antigravity AI apps/agent-suite"
 *   python3 -m uvicorn api_production:app --port 8099
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, extname, basename } from 'node:path'
import { config } from 'dotenv'

config()

import {
  getProvider,
  addUsage,
  emptyUsage,
  estimateCostUsd,
} from '../src/lib/ai'
import {
  JobSpecSchema,
  FitBriefContentSchema,
  BrandSchema,
} from '../src/lib/fit-brief/schema'
import { DocumentBundleSchema } from '../src/lib/documents/schema'
import {
  EXTRACT_SYSTEM,
  EXTRACT_FROM_RESEARCH_PROMPT,
  extractResearchPrompt,
  briefSystem,
  briefPrompt,
  translateSystem,
  translatePrompt,
  documentsSystem,
  documentsPrompt,
} from '../src/lib/fit-brief/prompts'
import { CV_STYLE_GUIDE } from '../src/lib/documents/style-guide'
import { LOCALES, type Locale } from '../src/lib/fit-brief/guardrails'
import {
  validateBriefContent,
  validateDocuments,
  checkBrand,
  sortWarnings,
} from '../src/lib/fit-brief/validate'
import { fetchAtsPosting, describeAtsPosting } from '../src/lib/fit-brief/ats'
import {
  renderCv,
  renderCoverLetter,
  documentFilename,
} from '../src/lib/documents/render'
import { recentEdits } from '../src/lib/style/store'
import { buildEditLearningPrompt } from '../src/lib/style/learning'
import { slugify, previewToken } from '../src/lib/fit-brief/server'
import { createId } from '../src/lib/fit-brief/id'
import { dataService } from '../src/lib/data-service'
import * as z from 'zod/v4'

const BriefWithBrandSchema = z.object({
  content: FitBriefContentSchema,
  brand: BrandSchema,
})

/* ------------------------------------------------------------------ *
 * Terminal output
 * ------------------------------------------------------------------ */

const dim = (s: string) => `\x1b[2m${s}\x1b[0m`
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`
const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const amber = (s: string) => `\x1b[33m${s}\x1b[0m`
const red = (s: string) => `\x1b[31m${s}\x1b[0m`

let stepNumber = 0
function step(label: string) {
  stepNumber += 1
  process.stdout.write(`${dim(`[${stepNumber}]`)} ${label}… `)
}
function done(detail = '') {
  process.stdout.write(`${green('done')}${detail ? dim(` ${detail}`) : ''}\n`)
}

/* ------------------------------------------------------------------ *
 * Input
 * ------------------------------------------------------------------ */

const IMAGE_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks).toString('utf8')
}

/* ------------------------------------------------------------------ *
 * Pipeline
 * ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2)
  const source = args.find(a => !a.startsWith('--'))
  const outFlag = args.indexOf('--out')
  const outRoot =
    outFlag !== -1 && args[outFlag + 1]
      ? args[outFlag + 1].replace(/^~/, homedir())
      : join(homedir(), 'Applications-Lukas')
  const skipDocs = args.includes('--no-docs')
  const onlyPrimaryLocale = args.includes('--one-language')

  // Generation always runs locally — the agent suite is on localhost. Where the
  // draft is SAVED is a separate choice: local SQLite for experiments, or the
  // live database when the brief is destined for a URL you will actually send.
  const toProduction = args.includes('--production')
  if (toProduction) {
    process.env.BRIEF_STORE = 'worker'
    if (!process.env.API_SECRET) {
      console.error(
        red(
          '--production needs API_SECRET in .env — it authorises writes to the live database.'
        )
      )
      process.exit(1)
    }
  }

  if (!source) {
    console.error(
      'Usage: npx tsx scripts/apply.ts <url | file.pdf | file.png | -> [--out DIR] [--production] [--no-docs] [--one-language]'
    )
    process.exit(1)
  }

  const provider = getProvider()
  let usage = emptyUsage()

  console.log(
    `\n${bold('Application engine')} ${dim(`· provider: ${provider.name} · saving to ${toProduction ? 'LIVE database' : 'local database'}`)}\n`
  )

  /* -- 1. Read the posting ------------------------------------------ */

  let prompt: string
  let attachments: { mimeType: string; data: string }[] | undefined
  let sourceUrl: string | null = null
  let sourceKind: 'url' | 'pdf' | 'image' | 'text' = 'text'

  if (/^https?:\/\//i.test(source)) {
    sourceKind = 'url'
    sourceUrl = source
    step('Reading the posting')

    const posting = await fetchAtsPosting(source)
    if (posting) {
      prompt = `${EXTRACT_FROM_RESEARCH_PROMPT}\n\nPOSTING (retrieved directly from the ${posting.source} API — authoritative)\n${describeAtsPosting(posting)}`
      done(`via ${posting.source} API, no model needed`)
    } else {
      const research = await provider.research({
        system: EXTRACT_SYSTEM,
        prompt: extractResearchPrompt(source),
      })
      usage = addUsage(usage, research.usage)
      prompt = `${EXTRACT_FROM_RESEARCH_PROMPT}\n\nRESEARCH\n${research.text}`
      done('via grounded web research')
    }
  } else if (source === '-') {
    const text = await readStdin()
    if (text.trim().length < 80) {
      console.error(red('That is too short to be a job posting.'))
      process.exit(1)
    }
    prompt = `Structure this job posting.\n\n${text}`
    step('Reading the posting')
    done('from stdin')
  } else {
    const path = source.replace(/^~/, homedir())
    const ext = extname(path).toLowerCase()
    const buffer = readFileSync(path)

    if (ext === '.pdf') {
      sourceKind = 'pdf'
      attachments = [
        { mimeType: 'application/pdf', data: buffer.toString('base64') },
      ]
      prompt = 'Structure the job posting in the attached PDF.'
    } else if (IMAGE_TYPES[ext]) {
      sourceKind = 'image'
      attachments = [
        { mimeType: IMAGE_TYPES[ext], data: buffer.toString('base64') },
      ]
      prompt =
        'Structure the job posting shown in the attached image. Read every visible line.'
    } else {
      sourceKind = 'text'
      prompt = `Structure this job posting.\n\n${buffer.toString('utf8')}`
    }
    step('Reading the posting')
    done(basename(path))
  }

  step('Structuring it')
  const { value: jobSpec, usage: specUsage } =
    await provider.generateStructured({
      schema: JobSpecSchema,
      system: EXTRACT_SYSTEM,
      prompt,
      attachments,
      maxTokens: 16000,
    })
  usage = addUsage(usage, specUsage)
  done(`${jobSpec.companyName} — ${jobSpec.roleTitle}`)

  /* -- 2. Write the brief ------------------------------------------- */

  const primary: Locale = (LOCALES as readonly string[]).includes(
    jobSpec.postingLanguage
  )
    ? (jobSpec.postingLanguage as Locale)
    : 'en'

  const editLearning = buildEditLearningPrompt(await recentEdits())
  if (editLearning) {
    console.log(
      dim(
        `    (applying ${(await recentEdits()).length} learned edit patterns)`
      )
    )
  }

  step(`Writing the brief in ${primary.toUpperCase()}`)
  const { value: briefResult, usage: briefUsage } =
    await provider.generateStructured({
      schema: BriefWithBrandSchema,
      system: briefSystem(editLearning),
      prompt: briefPrompt(jobSpec, primary),
      maxTokens: 32000,
    })
  usage = addUsage(usage, briefUsage)
  done()

  const content: Partial<Record<Locale, typeof briefResult.content>> = {
    [primary]: briefResult.content,
  }
  let warnings = [
    ...validateBriefContent(briefResult.content, primary),
    ...checkBrand(briefResult.brand),
  ]

  /* -- 3. Translate -------------------------------------------------- */

  if (!onlyPrimaryLocale) {
    for (const locale of LOCALES.filter(l => l !== primary)) {
      step(`Translating to ${locale.toUpperCase()}`)
      const { value: translated, usage: tUsage } =
        await provider.generateStructured({
          schema: FitBriefContentSchema,
          system: translateSystem(editLearning),
          prompt: translatePrompt(briefResult.content, locale, jobSpec),
          maxTokens: 32000,
        })
      usage = addUsage(usage, tUsage)
      content[locale] = translated
      warnings = [...warnings, ...validateBriefContent(translated, locale)]
      done()
    }
  }

  /* -- 4. Documents -------------------------------------------------- */

  const cvContent: Record<string, unknown> = {}
  const coverLetter: Record<string, unknown> = {}
  const outDir = join(
    outRoot,
    `${slugify(jobSpec.companyName)}-${new Date().toISOString().slice(0, 10)}`
  )

  if (!skipDocs) {
    const docLocales = onlyPrimaryLocale
      ? [primary]
      : [primary, ...LOCALES.filter(l => l !== primary)]

    for (const locale of docLocales) {
      step(`Writing the CV and cover letter in ${locale.toUpperCase()}`)
      const { value: bundle, usage: dUsage } =
        await provider.generateStructured({
          schema: DocumentBundleSchema,
          system: documentsSystem(CV_STYLE_GUIDE, editLearning),
          prompt: documentsPrompt(
            jobSpec,
            content[locale] ?? briefResult.content,
            locale
          ),
          maxTokens: 24000,
        })
      usage = addUsage(usage, dUsage)
      cvContent[locale] = bundle.cv
      coverLetter[locale] = bundle.coverLetter
      warnings = [
        ...warnings,
        ...validateDocuments(bundle.cv, bundle.coverLetter, locale),
      ]

      mkdirSync(outDir, { recursive: true })
      writeFileSync(
        join(outDir, documentFilename('cv', jobSpec.companyName, locale)),
        renderCv(bundle.cv)
      )
      writeFileSync(
        join(
          outDir,
          documentFilename('cover-letter', jobSpec.companyName, locale)
        ),
        renderCoverLetter(bundle.coverLetter, bundle.cv, locale)
      )
      done()
    }
  }

  /* -- 5. Store ------------------------------------------------------ */

  step('Saving the draft')
  const slug = await uniqueSlug(slugify(jobSpec.companyName))
  const token = previewToken()

  const brief = await dataService.createBrief({
    id: createId(),
    slug,
    companyName: jobSpec.companyName,
    roleTitle: jobSpec.roleTitle,
    sourceUrl,
    sourceKind,
    status: 'draft',
    previewToken: token,
    jobSpec,
    content,
    generatedContent: content,
    cvContent,
    coverLetter,
    brand: briefResult.brand,
    warnings: sortWarnings(warnings),
  })
  done()

  if (!skipDocs) {
    mkdirSync(outDir, { recursive: true })
    writeFileSync(
      join(outDir, 'job-spec.json'),
      JSON.stringify(jobSpec, null, 2)
    )
  }

  /* -- Report -------------------------------------------------------- */

  const blockers = warnings.filter(w => w.severity === 'blocker')
  const reviews = warnings.filter(w => w.severity !== 'blocker')

  const host = toProduction
    ? 'https://portfolio-by-lukas.vercel.app'
    : 'http://localhost:3000'

  console.log(`\n${bold('Draft ready')}\n`)
  console.log(`  Preview   ${dim(host)}/brief/${slug}?preview=${token}`)
  console.log(`  Review    ${dim(host)}/admin/applications`)
  if (!skipDocs) console.log(`  Documents ${outDir}`)
  console.log(
    `  Languages ${Object.keys(content)
      .map(l => l.toUpperCase())
      .join(', ')}`
  )
  console.log(`  Cost      ~$${estimateCostUsd(usage).toFixed(4)}`)

  if (blockers.length) {
    console.log(
      `\n${red(`  ${blockers.length} blocking issue${blockers.length === 1 ? '' : 's'} — publishing is refused until resolved:`)}`
    )
    for (const w of blockers.slice(0, 5)) {
      console.log(`    ${red('•')} ${w.path} — ${w.message}`)
    }
  }
  if (reviews.length) {
    console.log(
      `\n${amber(`  ${reviews.length} thing${reviews.length === 1 ? '' : 's'} to check:`)}`
    )
    for (const w of reviews.slice(0, 5)) {
      console.log(`    ${amber('•')} ${w.path} — ${w.message}`)
    }
  }
  if (!blockers.length && !reviews.length) {
    console.log(`\n  ${green('No warnings — every claim traced to a fact.')}`)
  }

  console.log(
    `\n${dim('  Nothing is public yet. Review, edit, then publish from the admin panel.')}\n`
  )
}

async function uniqueSlug(base: string): Promise<string> {
  const existing: { slug: string }[] = await dataService.listBriefs()
  const taken = new Set(existing.map(b => b.slug))
  if (!taken.has(base)) return base
  for (let n = 2; n < 50; n++) {
    if (!taken.has(`${base}-${n}`)) return `${base}-${n}`
  }
  return `${base}-${Date.now()}`
}

main().catch(error => {
  console.error(`\n${red('Failed:')} ${error.message}\n`)
  if (error.message?.includes('agent suite')) {
    console.error(
      dim(
        '  Start it with:\n' +
          '    cd "../../Antigravity AI apps/agent-suite"\n' +
          '    python3 -m uvicorn api_production:app --port 8099\n'
      )
    )
  }
  process.exit(1)
})
