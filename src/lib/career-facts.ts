/**
 * The career facts corpus — the ONLY source the application engine may draw on.
 *
 * Every claim the generator makes on a fit brief, a CV or a cover letter has to
 * cite one or more `id`s from this file. A claim with no citable fact is written
 * into the brief's `warnings` and surfaced in the admin review screen rather
 * than silently shipped. That is the whole point: these documents go to real
 * recruiters, and a metric that cannot be defended in the interview is worse
 * than no metric at all.
 *
 * Provenance rules for editing this file:
 *
 * - `published` facts already appear on the public site (`content-config.ts`)
 *   or the CV, so they are safe to restate.
 * - `owner-stated` facts came directly from Lukáš in conversation and are not
 *   published anywhere. Usable, but they cannot be cross-checked by a recruiter,
 *   so keep them to things he would obviously know about himself.
 * - `unverified` facts are NOT usable. The generator must treat them as absent
 *   and raise a warning if a posting seems to require one. They exist here so
 *   the gap is visible rather than forgotten.
 *
 * When the site content changes, this file changes with it. If they drift, the
 * site wins — it is the version a recruiter can actually see.
 */

export type FactProvenance = 'published' | 'owner-stated' | 'unverified'

export type FactCategory =
  | 'role'
  | 'metric'
  | 'project'
  | 'education'
  | 'capability'
  | 'logistics'
  | 'language'
  | 'framing'

export interface CareerFact {
  /** Stable citation key. Never renumber these — briefs store them. */
  id: string
  category: FactCategory
  /** The statement, phrased as it may legitimately be used. */
  claim: string
  /** Extra context for the model; not necessarily surfaced verbatim. */
  detail?: string
  period?: string
  provenance: FactProvenance
}

/* ------------------------------------------------------------------ *
 * Roles — structured, because the CV renderer needs them as records
 * ------------------------------------------------------------------ */

export interface RoleRecord {
  id: string
  title: string
  company: string
  location: string
  /**
   * How prominently this role may be used.
   *
   * `lead`       — safe to open with.
   * `supporting` — include, but not as the headline.
   * `optional`   — leave out unless the posting specifically calls for it.
   *
   * PlayerGrade is `optional` on purpose. A founder narrative reads as
   * "he is building his own thing and may leave", which costs more in a
   * Senior PM application than the credential gains. His own CV omits it
   * entirely; this is the middle ground.
   */
  emphasis: 'lead' | 'supporting' | 'optional'
  /** Display form used on the CV. */
  period: string
  startYear: number
  endYear: number | null
  summary: string
  /** Fact ids that back the bullets available for this role. */
  factIds: string[]
  technologies: string[]
}

export const roles: RoleRecord[] = [
  {
    id: 'playergrade',
    title: 'Founder & Head of Product',
    company: 'PlayerGrade — football scouting SaaS',
    location: 'Remote',
    emphasis: 'optional',
    period: '2026 – Present',
    startYear: 2026,
    endYear: null,
    summary:
      'Built and launched a scouting platform for football clubs as sole founder — grading, comparing and shortlisting players through a position-calibrated scoring engine.',
    factIds: [
      'playergrade.tenants',
      'playergrade.players',
      'playergrade.engine',
      'playergrade.positions',
      'playergrade.tests',
      'playergrade.pool',
      'playergrade.isolation',
      'playergrade.anchor',
      'playergrade.why',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Supabase',
      'PostgreSQL',
      'Row-Level Security',
      'Edge Functions',
      'Tailwind CSS',
      'shadcn/ui',
      'Cloudflare Pages',
    ],
  },
  {
    id: 'stagstrat',
    title: 'Senior Product Manager',
    emphasis: 'lead',
    company: 'StagStrat — algorithmic trading platform',
    location: 'Remote (Leeds, UK)',
    period: '2025 – Present',
    startYear: 2025,
    endYear: null,
    summary:
      'Full product ownership for an algorithmic trading platform aimed at institutional investors — roadmap, backlog and release planning.',
    factIds: [
      'stagstrat.leadtime',
      'stagstrat.seo',
      'stagstrat.scope',
      'stagstrat.audience',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Supabase (Postgres + Edge Functions)',
      'Python',
      'Vertex AI',
      'TradeStation API',
      'Docker',
    ],
  },
  {
    id: 'runtastic',
    title: 'Senior Product Manager',
    emphasis: 'lead',
    company: 'Runtastic GmbH — adidas Digital Sports',
    location: 'Vienna, Austria',
    period: '2022 – 2025',
    startYear: 2022,
    endYear: 2025,
    summary:
      'Led the website redesign and tech-stack migration of a fitness platform with 165M+ registered users, with the team split across three countries.',
    factIds: [
      'runtastic.users',
      'runtastic.pageload',
      'runtastic.downtime',
      'runtastic.countries',
      'runtastic.team',
      'runtastic.migration',
      'runtastic.admin',
      'runtastic.markets',
    ],
    technologies: [
      'Next.js',
      'TypeScript',
      'React',
      'Node.js',
      'AWS',
      'Docker',
    ],
  },
  {
    id: 'adidas-pm',
    title: 'Product Manager',
    emphasis: 'lead',
    company: 'adidas International Marketing B.V.',
    location: 'Amsterdam, Netherlands',
    period: '2019 – 2022',
    startYear: 2019,
    endYear: 2022,
    summary:
      'Owned Sprinklr and the in-house social commerce platform (adiSCom), leading a team of 13 including external freelancers.',
    factIds: [
      'adidas.team13',
      'adidas.sprinklr',
      'adidas.interactions',
      'adidas.adoption',
      'adidas.markets',
      'adidas.adiscom',
    ],
    technologies: [
      'Vue.js',
      'Node.js',
      'GraphQL',
      'MongoDB',
      'Sprinklr API',
      'Facebook Business Manager',
      'Instagram API',
    ],
  },
  {
    id: 'adidas-po',
    title: 'Product Owner',
    emphasis: 'supporting',
    company: 'adidas International Marketing B.V.',
    location: 'Amsterdam, Netherlands',
    period: '2016 – 2019',
    startYear: 2016,
    endYear: 2019,
    summary:
      'Joined as an intern and became Product Owner within 18 months; delivered a Product Information Management tool with an external development team.',
    factIds: [
      'adidas.pim',
      'adidas.pimadoption',
      'adidas.speedtomarket',
      'adidas.interntopo',
      'adidas.toolecosystem',
    ],
    technologies: [
      'PIM systems',
      'Vendor management',
      'Facebook Business Manager',
      'Instagram API',
      'Sprinklr',
      'Enterprise integrations',
    ],
  },
]

/* ------------------------------------------------------------------ *
 * Facts
 * ------------------------------------------------------------------ */

export const careerFacts: CareerFact[] = [
  /* -- Experience shape -------------------------------------------- */
  {
    id: 'experience.anchor',
    category: 'role',
    claim:
      'Product career started at adidas in 2016 as an intern, reaching Product Owner within 18 months.',
    detail:
      'The public site publishes the headline figure as "8+ years". Use that published figure rather than computing a larger number from 2016 — do not inflate.',
    provenance: 'published',
  },
  {
    id: 'experience.countries',
    category: 'role',
    claim:
      'Has worked in three countries: the Netherlands (Amsterdam), Austria (Vienna) and the UK (remote, Leeds-based company). Originally from Slovakia.',
    provenance: 'published',
  },
  {
    id: 'experience.teamsize',
    category: 'metric',
    claim: 'Largest team managed: 13 people, including external freelancers.',
    detail: 'At adidas International Marketing B.V., Amsterdam, 2019–2022.',
    provenance: 'published',
  },

  /* -- PlayerGrade -------------------------------------------------- */
  {
    id: 'playergrade.tenants',
    category: 'metric',
    claim:
      'PlayerGrade is in beta with 4 live club tenants across Central & Eastern Europe.',
    provenance: 'published',
  },
  {
    id: 'playergrade.players',
    category: 'metric',
    claim:
      '395 players profiled on PlayerGrade — 239 private to individual clubs, 156 in the shared CEE pool.',
    provenance: 'published',
  },
  {
    id: 'playergrade.engine',
    category: 'project',
    claim:
      'Designed PlayerGrade’s scoring engine, now on v6, which calibrates per position rather than applying one model to every role on the pitch.',
    provenance: 'published',
  },
  {
    id: 'playergrade.positions',
    category: 'metric',
    claim:
      'PlayerGrade’s scoring engine runs natively across all 9 outfield/keeper positions.',
    provenance: 'published',
  },
  {
    id: 'playergrade.tests',
    category: 'metric',
    claim:
      'PlayerGrade ships with 168 unit tests passing on the scoring engine.',
    provenance: 'published',
  },
  {
    id: 'playergrade.pool',
    category: 'project',
    claim:
      'Built a shared Central & Eastern European player pool so clubs benefit from data they did not collect themselves.',
    provenance: 'published',
  },
  {
    id: 'playergrade.isolation',
    category: 'project',
    claim:
      'Built multi-tenant architecture with database-level isolation (row-level security) so clubs cannot see each other’s data.',
    provenance: 'published',
  },
  {
    id: 'playergrade.anchor',
    category: 'project',
    claim:
      'The anchor tenant, MFK Ružomberok, uses PlayerGrade in their real scouting workflow.',
    detail:
      'Name the club as a customer only. See framing.scouting-role before mentioning any personal role at the club.',
    provenance: 'published',
  },
  {
    id: 'playergrade.why',
    category: 'project',
    claim:
      'Built PlayerGrade because smaller CEE clubs cannot afford tools like Wyscout and were running scouting on notebooks, spreadsheets and memory.',
    provenance: 'published',
  },

  /* -- StagStrat ---------------------------------------------------- */
  {
    id: 'stagstrat.leadtime',
    category: 'metric',
    claim:
      'Cut feature lead time by 80% at StagStrat by tightening how work is scoped and prioritised.',
    provenance: 'published',
  },
  {
    id: 'stagstrat.seo',
    category: 'metric',
    claim:
      'Built and launched the StagStrat website with an SEO strategy that grew organic traffic by 40%.',
    provenance: 'published',
  },
  {
    id: 'stagstrat.scope',
    category: 'role',
    claim:
      'Owns the full product lifecycle at StagStrat — roadmap, backlog and release planning.',
    provenance: 'published',
  },
  {
    id: 'stagstrat.audience',
    category: 'role',
    claim: 'StagStrat targets institutional investors.',
    provenance: 'published',
  },

  /* -- Runtastic / adidas Digital Sports ---------------------------- */
  {
    id: 'runtastic.users',
    category: 'metric',
    claim:
      'Runtastic had over 165 million registered users on the platform he owned.',
    detail:
      'Phrase as registered users of the platform, not as monthly actives and not as users he personally acquired.',
    provenance: 'published',
  },
  {
    id: 'runtastic.pageload',
    category: 'metric',
    claim: 'Improved page load speed by 55% during the Runtastic migration.',
    provenance: 'published',
  },
  {
    id: 'runtastic.downtime',
    category: 'metric',
    claim: 'Completed the Runtastic migration with zero downtime.',
    provenance: 'published',
  },
  {
    id: 'runtastic.countries',
    category: 'project',
    claim:
      'Coordinated the Runtastic redesign across teams in Colombia, the Netherlands and Germany, spanning three time zones.',
    provenance: 'published',
  },
  {
    id: 'runtastic.team',
    category: 'metric',
    claim:
      'Led a cross-functional team of 10+ people on the Runtastic redesign.',
    provenance: 'published',
  },
  {
    id: 'runtastic.migration',
    category: 'project',
    claim:
      'Migrated Runtastic to Next.js and React in stages, with testing and rollback plans at every step.',
    provenance: 'published',
  },
  {
    id: 'runtastic.admin',
    category: 'project',
    claim:
      'Managed the product lifecycle of adidas’s internal admin application, used by 1000+ people across the global organisation and multiple business units.',
    provenance: 'published',
  },
  {
    id: 'runtastic.markets',
    category: 'metric',
    claim:
      'The Runtastic platform kept running for users across 15+ countries throughout the migration.',
    provenance: 'published',
  },

  /* -- adidas Amsterdam --------------------------------------------- */
  {
    id: 'adidas.team13',
    category: 'metric',
    claim:
      'Led a team of 13 at adidas, including external freelancers in different countries.',
    provenance: 'published',
  },
  {
    id: 'adidas.sprinklr',
    category: 'metric',
    claim: 'Owned the Sprinklr relationship — a €1M annual licence.',
    detail:
      'The figure is published on the portfolio. It has previously been queried as potentially NDA-sensitive; if a brief leans on it, raise a warning so the owner can decide.',
    provenance: 'published',
  },
  {
    id: 'adidas.interactions',
    category: 'metric',
    claim:
      'The in-house social commerce platform (adiSCom) processed over 500K monthly interactions.',
    provenance: 'published',
  },
  {
    id: 'adidas.adoption',
    category: 'metric',
    claim:
      'Improved platform adoption by 30% by redesigning onboarding and rebuilding the customer support model.',
    provenance: 'published',
  },
  {
    id: 'adidas.markets',
    category: 'metric',
    claim:
      'Supported 50+ global market teams on the social media tool ecosystem.',
    provenance: 'published',
  },
  {
    id: 'adidas.adiscom',
    category: 'project',
    claim:
      'Managed Sprinklr and adiSCom, an in-house social commerce engine built internally, in parallel.',
    provenance: 'published',
  },
  {
    id: 'adidas.pim',
    category: 'project',
    claim:
      'Delivered a Product Information Management (PIM) tool with an external development team, on schedule.',
    provenance: 'published',
  },
  {
    id: 'adidas.pimadoption',
    category: 'metric',
    claim: 'The PIM tool launched with 100% adoption on day one.',
    provenance: 'published',
  },
  {
    id: 'adidas.speedtomarket',
    category: 'metric',
    claim: 'Improved speed to market by 70% through the PIM programme.',
    provenance: 'published',
  },
  {
    id: 'adidas.interntopo',
    category: 'role',
    claim: 'Went from intern to Product Owner in 18 months.',
    provenance: 'published',
  },
  {
    id: 'adidas.toolecosystem',
    category: 'project',
    claim:
      'Managed the social media tool ecosystem — Sprinklr, Facebook Business Manager, Instagram — for 50+ market teams globally.',
    provenance: 'published',
  },

  /* -- Requirements & stakeholder work (cross-cutting) -------------- */
  {
    id: 'capability.requirements',
    category: 'capability',
    claim:
      'Has gathered requirements from stakeholders outside his own team since 2016 — market teams at adidas, each with their own exceptions and reasons — and translated them into structured user stories with acceptance criteria a development team can build against.',
    detail:
      'This is the through-line of the whole career and the strongest transferable claim for Product Owner / requirements-engineering roles.',
    provenance: 'published',
  },
  {
    id: 'capability.distributed',
    category: 'capability',
    claim:
      'Has run distributed product teams across time zones — Colombia, Netherlands, Germany, UK — where written clarity mattered more than meetings.',
    provenance: 'published',
  },
  {
    id: 'capability.migration',
    category: 'capability',
    claim:
      'Has run a staged platform migration at scale without breaking the live product.',
    provenance: 'published',
  },
  {
    id: 'capability.seo',
    category: 'capability',
    claim:
      'Builds SEO into product roadmaps rather than bolting it on afterwards — done at both adidas and StagStrat.',
    provenance: 'published',
  },
  {
    id: 'capability.agile',
    category: 'capability',
    claim:
      'Uses Agile pragmatically — sprint planning, backlog management, iterative delivery — adapted to the team rather than applied by the book.',
    provenance: 'published',
  },

  /* -- AI capability (the single most-corrected framing) ------------ */
  {
    id: 'capability.ai',
    category: 'capability',
    claim:
      'Builds AI solutions on a managed suite — Google AI Studio and Vertex AI — including training, tuning and evaluating models.',
    detail:
      'Evidenced by PlayerGrade’s scoring engine and the Python agent suite on Vertex AI at StagStrat. See framing.ai for the hard limits on how this may be phrased.',
    provenance: 'published',
  },

  /* -- Education ---------------------------------------------------- */
  {
    id: 'education.mba',
    category: 'education',
    claim: 'MBA Global, University of Derby, UK — 2018–2020.',
    provenance: 'published',
  },
  {
    id: 'education.cmi',
    category: 'education',
    claim:
      'Level 7 Diploma in Strategic Management and Leadership, CMI — 2022.',
    provenance: 'published',
  },
  {
    id: 'education.bsc',
    category: 'education',
    claim: 'BSc Sport Management, University of Derby, UK — 2014–2018.',
    detail:
      'On both CVs. Was missing from this corpus until the CVs were read.',
    provenance: 'published',
  },
  {
    id: 'education.agile',
    category: 'education',
    claim: 'Agile Product Owner certification.',
    provenance: 'published',
  },
  {
    id: 'education.uefa',
    category: 'education',
    claim: 'UEFA A coaching licence.',
    detail:
      'Relevant credential for football-domain roles and the origin story for PlayerGrade. Off-topic elsewhere.',
    provenance: 'published',
  },

  /* -- Logistics ---------------------------------------------------- */
  {
    id: 'logistics.base',
    category: 'logistics',
    claim: 'Based in Volterra, Tuscany, Italy.',
    provenance: 'published',
  },
  {
    id: 'logistics.eu',
    category: 'logistics',
    claim:
      'Slovak citizen, so no visa or work permit is required anywhere in the EU, and no relocation is needed for Italian roles.',
    provenance: 'owner-stated',
  },
  {
    id: 'logistics.travel',
    category: 'logistics',
    claim:
      'Turin is roughly 3 hours away by direct train — workable for occasional office visits, not a daily commute. Milan and Bologna are closer.',
    detail:
      'Owner-stated in July 2026, correcting an earlier 40-minute estimate. Never understate this.',
    provenance: 'owner-stated',
  },
  {
    id: 'logistics.remote',
    category: 'logistics',
    claim:
      'Works remotely today and has done since 2025 (StagStrat is a Leeds, UK company).',
    provenance: 'published',
  },

  /* -- Languages ---------------------------------------------------- *
   * These levels ARE stated, on his own CV, and were being blocked by an
   * earlier guardrail built on the assumption that they were not. The rule is
   * "do not invent a level", not "never state one".
   * ------------------------------------------------------------------ */
  {
    id: 'language.slovak',
    category: 'language',
    claim: 'Slovak — native.',
    detail: 'His CV writes it as "Slovak (Native)".',
    provenance: 'published',
  },
  {
    id: 'language.english',
    category: 'language',
    claim: 'English — C2, fluent.',
    detail:
      'His CV writes it as "English (Fluent, C2)". His working language throughout his career: adidas Amsterdam, adidas Vienna, and a UK company today.',
    provenance: 'published',
  },
  {
    id: 'language.italian',
    category: 'language',
    claim: 'Italian — B2.',
    detail:
      'His two CVs label B2 differently: the ATS version says "Professional", the graphical one says "Limited working proficiency". B2 is the constant; prefer the plain "B2" and avoid the labels until he settles on one.',
    provenance: 'published',
  },
  {
    id: 'language.german',
    category: 'language',
    claim:
      'No German level is stated on any CV, despite three years working in Vienna (2022–2025).',
    detail:
      'Usable as a fact about where he worked. NOT usable as a proficiency claim — there is no level to cite. If a posting requires German, that belongs in the gap section.',
    provenance: 'published',
  },

  /* -- Framing rules that behave like facts ------------------------- */
  {
    id: 'framing.ai',
    category: 'framing',
    claim:
      'He builds AI solutions on top of a managed suite. He does not author novel model architectures and does not do research-level ML.',
    detail:
      'Never write "built the AI", "developed the model architecture", or anything implying original ML research. Correct framing: builds AI solutions using Google AI Studio and Vertex AI, including training, tuning and evaluating models.',
    provenance: 'owner-stated',
  },
  {
    id: 'framing.playergrade',
    category: 'framing',
    claim:
      'PlayerGrade is evidence that he can build and ship a product end to end. It is not the headline of an application.',
    detail:
      'A founder narrative reads to a hiring manager as divided attention and a likely short tenure, which costs more than the credential gains. His own CV leaves it off entirely. Use it as supporting proof — one bullet, one pillar — when the posting values zero-to-one building, and leave it out otherwise. Never open a page or a CV with it, and never frame him primarily as a founder.',
    provenance: 'owner-stated',
  },
  {
    id: 'framing.scouting-role',
    category: 'framing',
    claim:
      'His Head of Analytical & Scouting role at MFK Ružomberok is deliberately omitted from non-football applications.',
    detail:
      'Lead with PlayerGrade as a product instead. The club may still be named as PlayerGrade’s anchor customer.',
    provenance: 'owner-stated',
  },
  {
    id: 'framing.languages',
    category: 'framing',
    claim:
      'Writing a document in German or Italian asserts nothing about proficiency.',
    detail:
      'State which languages are his and let a page written in the reader’s language make its own point. Never claim a CEFR level. A previous Spanish-language brief had to be corrected for exactly this.',
    provenance: 'owner-stated',
  },
  {
    id: 'framing.domains',
    category: 'framing',
    claim:
      'The portfolio lives at portfolio-by-lukas.vercel.app. lukashosala.com is a separate football-coaching site and must never be cited as the portfolio.',
    provenance: 'owner-stated',
  },
  {
    id: 'framing.contact',
    category: 'framing',
    claim: 'The public contact address is lukas.hosala@icloud.com.',
    provenance: 'published',
  },

  /* -- Contact block, exactly as it appears on the CV ---------------- *
   * Here because the generator was inventing it: one run produced
   * linkedin.com/in/lukashosala, which is the handle from his 2018 CV and no
   * longer resolves. Contact details are the one part of a CV a recruiter
   * actually uses, so they get cited like any other claim.
   * ------------------------------------------------------------------ */
  {
    id: 'contact.email',
    category: 'logistics',
    claim: 'Email: lukas.hosala@icloud.com',
    detail:
      'On the current CV and on /privacy. hosala.lukas@gmail.com is his older address and appears only on the 2018-era CV — never use it.',
    provenance: 'published',
  },
  {
    id: 'contact.phone',
    category: 'logistics',
    claim: 'Phone: +39 379 3110473',
    provenance: 'published',
  },
  {
    id: 'contact.linkedin',
    category: 'logistics',
    claim: 'LinkedIn: linkedin.com/in/hosala',
    detail:
      'NOT /in/lukashosala — that is the old handle. Cite this fact rather than guessing the URL.',
    provenance: 'published',
  },
  {
    id: 'contact.portfolio',
    category: 'logistics',
    claim: 'Portfolio: portfolio-by-lukas.vercel.app',
    provenance: 'published',
  },
  {
    id: 'framing.ai-selfdescription',
    category: 'framing',
    claim:
      'His own CV describes his AI work as: "Hands-on experience with AI technologies (Claude Code, Google AI Studio, Antigravity) to build fully functional products. Utilising my own agent suite and agent skills built internally to support my workflows and productivity."',
    detail:
      'His wording, and the safest register: tools he uses, things he built with them, no claim about authoring models. Prefer it over any paraphrase.',
    provenance: 'published',
  },
]

/* ------------------------------------------------------------------ *
 * Lookup helpers
 * ------------------------------------------------------------------ */

/**
 * Roles are citable too, under `role:<id>`.
 *
 * `serializeFactsForPrompt` lists them that way, so the generator will use
 * them — and it should: "he held this title at this company between these
 * dates" is exactly the kind of claim that needs backing. Without these
 * entries the validator rejects citations it was itself advertising, which is
 * how the first end-to-end run failed.
 */
const roleFacts: CareerFact[] = roles.map(role => ({
  id: `role:${role.id}`,
  category: 'role' as const,
  claim: `${role.title}, ${role.company}, ${role.location}, ${role.period}.`,
  detail: role.summary,
  provenance: 'published' as const,
}))

const allFacts: CareerFact[] = [...careerFacts, ...roleFacts]

const factIndex = new Map(allFacts.map(f => [f.id, f]))

export function getFact(id: string): CareerFact | undefined {
  return factIndex.get(id)
}

/** Facts the generator is allowed to cite. Unverified ones are excluded. */
export const usableFacts = allFacts.filter(f => f.provenance !== 'unverified')

const usableIds = new Set(usableFacts.map(f => f.id))

export function isCitable(id: string): boolean {
  return usableIds.has(id)
}

/** Split a list of cited ids into the ones that check out and the ones that don't. */
export function partitionCitations(ids: string[]): {
  valid: string[]
  invalid: string[]
} {
  const valid: string[] = []
  const invalid: string[] = []
  for (const id of ids) {
    if (usableIds.has(id)) valid.push(id)
    else invalid.push(id)
  }
  return { valid, invalid }
}

/**
 * The corpus as the model sees it. Compact on purpose — this rides in every
 * generation call, and the facts are the expensive part of the prompt.
 */
export function serializeFactsForPrompt(): string {
  const byCategory = new Map<FactCategory, CareerFact[]>()
  for (const fact of usableFacts) {
    const list = byCategory.get(fact.category) ?? []
    list.push(fact)
    byCategory.set(fact.category, list)
  }

  const sections: string[] = []
  for (const [category, facts] of byCategory) {
    const lines = facts.map(f => {
      const detail = f.detail ? `\n    note: ${f.detail}` : ''
      return `  [${f.id}] ${f.claim}${detail}`
    })
    sections.push(`${category.toUpperCase()}\n${lines.join('\n')}`)
  }

  const roleLines = roles.map(
    r =>
      `  [role:${r.id}] ${r.title}, ${r.company}, ${r.location}, ${r.period}\n    emphasis: ${r.emphasis}${r.emphasis === 'optional' ? ' — leave out unless the posting specifically calls for it; never lead with it' : ''}\n    ${r.summary}\n    backing facts: ${r.factIds.join(', ')}\n    tech: ${r.technologies.join(', ')}`
  )

  return `ROLES (chronological, most recent first)\n${roleLines.join('\n')}\n\n${sections.join('\n\n')}`
}
