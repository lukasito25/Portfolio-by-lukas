/**
 * Seeds one generated brief into the LOCAL database so the /brief/[slug] route
 * can be exercised without spending an API call.
 *
 * This is a development fixture, not production data — it writes through Prisma
 * to prisma/dev.db and never touches D1. The content is modelled on the Rocken
 * posting because that is the case that stresses the most: German-first, a
 * requirements-engineering role, and a genuine gap worth naming.
 *
 * Run: node scripts/seed-example-brief.mjs
 * Then: http://localhost:3000/brief/fixture-rocken?preview=<token it prints>
 */

import { createRequire } from 'node:module'
import { randomBytes } from 'node:crypto'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

const stat = (value, label, factIds) => ({ value, label, factIds })

const en = {
  hero: {
    eyebrow: 'Fixture Co · Kriens, Switzerland · Senior Product Owner',
    headlineLead:
      'Turning requirements from people outside the product team into things engineers can build',
    headlineGradient: 'is the work I started with, and still do.',
    description:
      'I started as a Product Owner at adidas in 2016 and run product at a fintech today. The constant has been gathering requirements from people who do not report to me, structuring them, and writing them precisely enough that a team can build from them — most recently for 50+ market teams and 1,000+ internal users. Tax assessment is new to me. Domain-heavy business processes are not.',
    chips: [
      'Requirements engineering',
      'User stories & backlog',
      'Facilitating working groups',
      'Complex business processes',
      'Open to relocating',
    ],
    stats: [
      stat('10', 'Years in product', ['experience.anchor']),
      stat('50+', 'Market teams as a requirements source', ['adidas.markets']),
      stat('1,000+', 'Internal platform users', ['runtastic.admin']),
      stat('100%', 'Adoption at PIM launch', ['adidas.pimadoption']),
    ],
  },
  roleMapSection: {
    eyebrow: 'The role, mapped',
    heading: 'Six responsibilities — and where I have done each',
    hint: 'Swipe or use the arrows',
    items: [
      {
        id: 'gathering',
        tag: 'Requirements',
        title:
          'Gathering and analysing requirements with business stakeholders',
        body: 'At adidas every requirement arrived from a different market, each with its own exceptions and good reasons for them. The work was listening until it was clear why the existing workaround had grown, because that is when solutions start beating wish lists.',
        factIds: ['capability.requirements', 'adidas.markets'],
      },
      {
        id: 'stories',
        tag: 'User stories',
        title: 'Turning them into stories a team can actually build from',
        body: 'Converting contradictory input into a catalogue with clear attributes, rules and exceptions was the core of the PIM work. I have been writing acceptance criteria since 2016.',
        factIds: ['adidas.pim', 'capability.requirements'],
      },
      {
        id: 'backlog',
        tag: 'Backlog',
        title: 'Owning and prioritising the backlog',
        body: 'At StagStrat I cut feature lead time by 80% by changing how work was scoped and prioritised rather than by adding process.',
        factIds: ['stagstrat.leadtime', 'stagstrat.scope'],
      },
      {
        id: 'roadmap',
        tag: 'Roadmap',
        title: 'Holding a roadmap that survives contact with stakeholders',
        body: 'Three years of running a roadmap across teams in Colombia, the Netherlands and Germany, where written clarity mattered more than meetings.',
        factIds: ['capability.distributed', 'runtastic.countries'],
      },
      {
        id: 'groups',
        tag: 'Working groups',
        title: 'Facilitating groups who disagree with each other',
        body: 'Fifty market teams rarely want the same thing. Adoption went up 30% once onboarding and support were rebuilt around what they actually did.',
        factIds: ['adidas.adoption', 'adidas.markets'],
      },
      {
        id: 'technical',
        tag: 'Technical depth',
        title: 'Being technical enough to be useful in the detail',
        body: 'I led a staged Next.js migration for a platform with 165M+ registered users that finished with zero downtime.',
        factIds: ['runtastic.migration', 'runtastic.downtime'],
      },
    ],
  },
  profileMatchSection: {
    eyebrow: 'Profile match',
    heading: 'What lines up, and what does not',
    matchLabel: 'Direct match',
    transferLabel: 'Transferable',
    panels: [
      {
        title: 'The role',
        rows: [
          {
            requirement: 'Several years as a Product Owner in complex domains',
            isMatch: true,
            tierLabel: 'Direct match',
            proof:
              'Product Owner at adidas from 2016, then PM and Senior PM; product ownership has been the constant.',
            factIds: ['experience.anchor', 'adidas.interntopo'],
          },
          {
            requirement: 'Requirements engineering with business departments',
            isMatch: true,
            tierLabel: 'Direct match',
            proof:
              'The PIM programme was exactly this: 50+ market teams, conflicting rules, one catalogue.',
            factIds: ['capability.requirements', 'adidas.pim'],
          },
          {
            requirement: 'Experience in tax or public administration software',
            isMatch: false,
            tierLabel: 'Transferable',
            proof:
              'No tax domain experience. The closest analogue is enterprise product data, where the rules are similarly unforgiving.',
            factIds: ['adidas.pim'],
          },
        ],
      },
      {
        title: 'Ways of working',
        rows: [
          {
            requirement: 'Agile delivery with an in-house engineering team',
            isMatch: true,
            tierLabel: 'Direct match',
            proof:
              'Sprint planning and backlog management across three time zones on the Runtastic redesign.',
            factIds: ['capability.agile', 'runtastic.team'],
          },
          {
            requirement: 'Working in German with cantonal stakeholders',
            isMatch: false,
            tierLabel: 'Transferable',
            proof:
              'Three years working in Vienna in a German-speaking environment; my working language throughout my career has been English.',
            factIds: ['language.german', 'language.english'],
          },
          {
            requirement: 'On site in Kriens several days a week',
            isMatch: false,
            tierLabel: 'Transferable',
            proof:
              'Currently in Tuscany and remote. This role would mean relocating, which I am open to; as a Slovak citizen there is no permit question.',
            factIds: ['logistics.base', 'logistics.eu', 'logistics.remote'],
          },
        ],
      },
    ],
  },
  spotlight: {
    chip: 'The closest precedent',
    statusBadge: 'In beta with 4 clubs',
    heading:
      'PlayerGrade — a product I specified, built and sold into real use',
    lede: 'A scouting platform for football clubs that grades and compares players through a position-calibrated engine. I did the requirements work, the product decisions and the build.',
    pillars: [
      {
        title: 'Requirements from outside the building',
        body: 'The requirements came from scouts, not from me. The engine exists because their notebooks did the same job badly.',
        factIds: ['playergrade.why'],
      },
      {
        title: 'Rules that differ per case',
        body: 'The scoring engine calibrates separately for all nine positions rather than applying one model everywhere.',
        factIds: ['playergrade.engine', 'playergrade.positions'],
      },
      {
        title: 'Data that must not leak',
        body: 'Multi-tenant with database-level isolation, so no club can see another club’s players.',
        factIds: ['playergrade.isolation'],
      },
      {
        title: 'Actually in use',
        body: 'Four clubs in beta, 395 players profiled, and the anchor tenant runs their real scouting workflow on it.',
        factIds: [
          'playergrade.tenants',
          'playergrade.players',
          'playergrade.anchor',
        ],
      },
    ],
    credentials: [
      '395 players profiled',
      'Scoring engine v6',
      '168 tests passing',
      '9/9 positions calibrated',
    ],
    closingLine:
      'Built alone, from the requirements interview through to the clubs using it.',
  },
  gap: {
    chip: 'Where it stops',
    heading: 'What I have not done',
    body: 'I have never worked on tax assessment software, and I have never worked with cantonal or municipal administrations. I would be learning the domain from zero, and in the first months that would show. What I would not be learning is how to sit with a working group, take contradictory requirements, and turn them into something a team can build.',
  },
  closing: {
    eyebrow: 'In short',
    heading: 'Ten years of the same core work, in a new domain',
    body: 'If the priority is someone who already knows Swiss tax processes, I am not that person. If it is someone who can own requirements and a backlog in a domain where the details matter, that is what I have been doing since 2016.',
    credentials: [
      'MBA, University of Derby',
      'CMI Level 7',
      'EU citizen — no permit needed',
    ],
    signature: 'Lukáš Hošala · lukas.hosala@icloud.com',
  },
}

/** Short but genuine translations — enough to exercise the locale toggle. */
const it = structuredClone(en)
it.hero.eyebrow = 'Fixture Co · Kriens, Svizzera · Senior Product Owner'
it.hero.headlineLead =
  'Tradurre i requisiti di chi non fa parte del team in qualcosa che gli sviluppatori possano costruire'
it.hero.headlineGradient =
  'è il lavoro con cui ho iniziato, e che faccio ancora.'
it.hero.description =
  'Ho iniziato come Product Owner in adidas nel 2016 e oggi guido il prodotto in una fintech. La costante è raccogliere requisiti da persone che non fanno capo a me, strutturarli e scriverli con la precisione necessaria perché un team possa costruirci sopra. La fiscalità è nuova per me. I processi aziendali complessi no.'
it.hero.chips = [
  'Ingegneria dei requisiti',
  'User story e backlog',
  'Gruppi di lavoro',
  'Processi complessi',
  'Disponibile al trasferimento',
]
it.hero.stats[0].label = 'Anni nel prodotto'
it.hero.stats[1].label = 'Team di mercato come fonte di requisiti'
it.hero.stats[2].label = 'Utenti interni della piattaforma'
it.hero.stats[3].label = 'Adozione al lancio del PIM'
it.roleMapSection.eyebrow = 'Il ruolo, nel dettaglio'
it.roleMapSection.heading = 'Sei responsabilità — e dove le ho svolte'
it.roleMapSection.hint = 'Scorri o usa le frecce'
it.profileMatchSection.eyebrow = 'Corrispondenza del profilo'
it.profileMatchSection.heading = 'Cosa combacia e cosa no'
it.profileMatchSection.matchLabel = 'Corrispondenza diretta'
it.profileMatchSection.transferLabel = 'Trasferibile'
it.profileMatchSection.panels[0].title = 'Il ruolo'
it.profileMatchSection.panels[1].title = 'Modo di lavorare'
it.spotlight.chip = 'Il precedente più vicino'
it.spotlight.statusBadge = 'In beta con 4 club'
it.spotlight.heading =
  'PlayerGrade — un prodotto che ho specificato, costruito e portato in uso'
it.gap.chip = 'Dove si ferma'
it.gap.heading = 'Quello che non ho fatto'
it.closing.eyebrow = 'In sintesi'
it.closing.heading = 'Dieci anni dello stesso lavoro, in un dominio nuovo'

const de = structuredClone(en)
de.hero.eyebrow = 'Fixture Co · Kriens, Schweiz · Senior Product Owner'
de.hero.headlineLead =
  'Anforderungen aus Fachbereichen in klare User Stories zu übersetzen ist die Arbeit, mit der ich angefangen habe'
de.hero.headlineGradient = 'Zehn Jahre später mache ich sie immer noch.'
de.hero.description =
  'Ich habe 2016 als Product Owner bei adidas begonnen und verantworte heute das Produkt in einer Fintech. Gleich geblieben ist: Anforderungen von Menschen erheben, die nicht in meinem Team sind, sie strukturieren und so präzise formulieren, dass ein Entwicklungsteam damit bauen kann. Steuerveranlagung ist für mich neu. Fachlich anspruchsvolle Geschäftsprozesse sind es nicht.'
de.hero.chips = [
  'Requirements Engineering',
  'User Stories & Backlog',
  'Fachgruppen moderieren',
  'Komplexe Geschäftsprozesse',
  'Umzugsbereit',
]
de.hero.stats[0].label = 'Jahre im Produktmanagement'
de.hero.stats[1].label = 'Marktteams als Anforderungsquelle'
de.hero.stats[2].label = 'Interne Nutzer der Plattform'
de.hero.stats[3].label = 'Adoption beim PIM-Rollout'
de.roleMapSection.eyebrow = 'Die Rolle, im Detail'
de.roleMapSection.heading = 'Sechs Aufgaben — und wo ich sie gemacht habe'
de.roleMapSection.hint = 'Wischen oder Pfeile nutzen'
de.profileMatchSection.eyebrow = 'Profilabgleich'
de.profileMatchSection.heading = 'Was passt und was nicht'
de.profileMatchSection.matchLabel = 'Direkte Übereinstimmung'
de.profileMatchSection.transferLabel = 'Übertragbar'
de.profileMatchSection.panels[0].title = 'Die Rolle'
de.profileMatchSection.panels[1].title = 'Arbeitsweise'
de.spotlight.chip = 'Der nächste Präzedenzfall'
de.spotlight.statusBadge = 'In Beta mit 4 Vereinen'
de.spotlight.heading =
  'PlayerGrade — ein Produkt, das ich spezifiziert und gebaut habe'
de.gap.chip = 'Wo es aufhört'
de.gap.heading = 'Was ich nicht gemacht habe'
de.closing.eyebrow = 'Kurz gesagt'
de.closing.heading = 'Zehn Jahre dieselbe Kernarbeit, in einer neuen Domäne'

const token = randomBytes(16).toString('hex')

const brief = {
  id: 'brf_fixture_rocken',
  slug: 'fixture-rocken',
  companyName: 'Fixture Co',
  roleTitle: 'Senior Product Owner',
  sourceUrl: null,
  sourceKind: 'text',
  status: 'draft',
  previewToken: token,
  jobSpec: JSON.stringify({
    companyName: 'Fixture Co',
    roleTitle: 'Senior Product Owner',
    location: 'Kriens, Switzerland',
    countryCode: 'CH',
    workModel: 'hybrid',
    seniority: 'Senior',
    postingLanguage: 'de',
    companyContext: ['Tax software for cantonal and municipal administrations'],
    responsibilities: [],
    requirements: [],
    domainKeywords: ['Requirements Engineering', 'Steuerlösung'],
    sourceQuotes: [],
    brandColorGuess: '#0f6f4f',
  }),
  content: JSON.stringify({ de, en, it }),
  cvContent: JSON.stringify({}),
  coverLetter: JSON.stringify({}),
  brand: JSON.stringify({
    accentLight: '#0f6f4f',
    accentDark: '#4fd1a5',
    motif: 'topography',
  }),
  warnings: JSON.stringify([]),
}

const existing = await prisma.generatedBrief.findUnique({
  where: { slug: brief.slug },
})

if (existing) {
  await prisma.generatedBrief.update({
    where: { slug: brief.slug },
    data: { ...brief, previewToken: existing.previewToken },
  })
  console.log(`updated fixture brief (kept its preview token)`)
  console.log(
    `  draft:     /brief/${brief.slug}?preview=${existing.previewToken}`
  )
} else {
  await prisma.generatedBrief.create({ data: brief })
  console.log(`created fixture brief`)
  console.log(`  draft:     /brief/${brief.slug}?preview=${token}`)
}

console.log(
  `  anonymous: /brief/${brief.slug}   (expect 404 while status=draft)`
)

await prisma.$disconnect()
