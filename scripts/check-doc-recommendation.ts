/**
 * Asserts what `recommendDocument` says for the postings it was designed on.
 *
 * The recommender is rule-based so that a wrong call can be traced to the
 * rule that made it. This pins the calls for a fixed set of postings — one
 * per rule, and one with no signals at all — so that editing a rule for one
 * case shows what it did to the others. Each case states the design for each
 * format and which format to attach; the reasons are checked for the one
 * phrase that proves the intended rule fired, not for their wording.
 *
 * Run: npx tsx scripts/check-doc-recommendation.ts
 */

import { recommendDocument } from '../src/lib/documents/recommend'
import type { RecommendInput } from '../src/lib/documents/recommend'

interface Case {
  name: string
  input: RecommendInput
  expect: {
    docx: string
    pdf: string
    attach: 'docx' | 'pdf'
    reader: 'parser' | 'person' | 'unknown'
    reason: RegExp
  }
}

const CASES: Case[] = [
  {
    name: 'Greenhouse posting, Switzerland',
    input: {
      jobSpec: {
        companyName: 'Scandit',
        roleTitle: 'Senior Product Manager',
        countryCode: 'CH',
        companyContext: ['Computer vision scale-up'],
      },
      sourceUrl: 'https://boards.greenhouse.io/scandit/jobs/1',
    },
    expect: {
      docx: 'classic',
      pdf: 'column',
      attach: 'docx',
      reader: 'parser',
      reason: /Greenhouse/,
    },
  },
  {
    name: 'Legacy ATS (SuccessFactors) at an insurer',
    input: {
      jobSpec: {
        companyName: 'Allianz',
        roleTitle: 'Product Manager',
        countryCode: 'DE',
        companyContext: ['Insurance group'],
      },
      sourceUrl: 'https://jobs.allianz.com/successfactors.com/job/1',
    },
    expect: {
      docx: 'rule',
      pdf: 'rule',
      attach: 'docx',
      reader: 'parser',
      reason: /older one that loses columns/,
    },
  },
  {
    name: 'Private bank, careers site, no ATS',
    input: {
      jobSpec: {
        companyName: 'UBP',
        roleTitle: 'Product Manager Digital',
        countryCode: 'CH',
        companyContext: ['Private bank, wealth management'],
      },
      sourceUrl: 'https://www.ubp.com/careers/1',
    },
    expect: {
      docx: 'rule',
      pdf: 'rule',
      attach: 'docx',
      reader: 'unknown',
      reason: /conservative/,
    },
  },
  {
    name: 'Ashby posting, United Kingdom',
    input: {
      jobSpec: {
        companyName: 'Kraken',
        roleTitle: 'Senior Product Manager',
        countryCode: 'GB',
        companyContext: ['Crypto exchange'],
      },
      sourceUrl: 'https://jobs.ashbyhq.com/kraken/x',
    },
    expect: {
      docx: 'classic',
      pdf: 'column',
      attach: 'docx',
      reader: 'parser',
      reason: /GB discourages a photo/,
    },
  },
  {
    name: 'Seed startup in Germany, pasted posting',
    input: {
      jobSpec: {
        companyName: 'Loopa',
        roleTitle: 'Head of Product',
        countryCode: 'DE',
        companyContext: ['Seed-stage startup, team of 12'],
      },
      sourceUrl: null,
      sourceKind: 'text',
    },
    expect: {
      docx: 'classic',
      pdf: 'column',
      attach: 'pdf',
      reader: 'person',
      reason: /read by a person/i,
    },
  },
  {
    name: 'Large fashion company, own careers site',
    input: {
      jobSpec: {
        companyName: 'Zalando',
        roleTitle: 'Senior Product Manager',
        countryCode: 'DE',
        companyContext: ['Fashion e-commerce, 15,000 employees'],
      },
      sourceUrl: 'https://jobs.zalando.com/en/jobs/1',
    },
    expect: {
      docx: 'classic',
      pdf: 'column',
      attach: 'docx',
      reader: 'parser',
      reason: /large organisation/,
    },
  },
  {
    name: 'No signals at all',
    input: {
      jobSpec: {
        companyName: 'Acme',
        roleTitle: 'Product Manager',
        countryCode: '',
        companyContext: [],
      },
      sourceUrl: 'https://acme.example/jobs/1',
    },
    expect: {
      docx: 'classic',
      pdf: 'column',
      attach: 'docx',
      reader: 'unknown',
      reason: /not known/,
    },
  },
]

let failed = false
console.log('')

for (const c of CASES) {
  const r = recommendDocument(c.input)
  const problems: string[] = []
  if (r.byFormat.docx !== c.expect.docx)
    problems.push(`docx ${r.byFormat.docx}, expected ${c.expect.docx}`)
  if (r.byFormat.pdf !== c.expect.pdf)
    problems.push(`pdf ${r.byFormat.pdf}, expected ${c.expect.pdf}`)
  if (r.attach !== c.expect.attach)
    problems.push(`attach ${r.attach}, expected ${c.expect.attach}`)
  if (r.reader !== c.expect.reader)
    problems.push(`reader ${r.reader}, expected ${c.expect.reader}`)
  if (!r.reasons.some(x => c.expect.reason.test(x)))
    problems.push(`no reason matching ${c.expect.reason}`)
  if (r.primary.variant !== r.byFormat[r.attach])
    problems.push('primary does not match byFormat[attach]')
  if (r.alternative.format === r.primary.format)
    problems.push('alternative is the same format as primary')

  if (problems.length) {
    failed = true
    console.log(`  ✗ ${c.name}`)
    for (const p of problems) console.log(`      ${p}`)
  } else {
    console.log(
      `  ✓ ${c.name} — ${r.byFormat.docx}.docx / ${r.byFormat.pdf}.pdf, attach .${r.attach} (${r.confidence})`
    )
  }
}

// Negative control: a conservative sector must move both formats off the
// defaults, or the sector rule has stopped firing.
const bank = recommendDocument({
  jobSpec: { companyName: 'X', roleTitle: 'PM', companyContext: ['banking'] },
})
if (bank.byFormat.docx === 'classic' || bank.byFormat.pdf === 'column') {
  failed = true
  console.log('      negative control did not fail: sector rule inert')
}

console.log('')
if (failed) {
  console.log('document recommendation checks FAILED')
  process.exit(1)
}
console.log(
  `all document recommendation checks passed (${CASES.length} postings)`
)
