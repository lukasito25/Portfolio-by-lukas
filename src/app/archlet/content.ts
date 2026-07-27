export type Locale = 'en' | 'de' | 'es' | 'it'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'ownership'
    | 'discovery'
    | 'roadmap'
    | 'craft'
    | 'accounts'
    | 'gtm'
    | 'autonomy'
  title: string
  body: string
}

export interface ProfileRow {
  requirement: string
  isMatch: boolean
  tierLabel: string
  proof: string
}

export interface ProfilePanel {
  title: string
  rows: ProfileRow[]
}

export interface ArchletContent {
  hero: {
    eyebrow: string
    headlineLead: string
    headlineGradient: string
    description: string
    chips: string[]
    stats: HeroStat[]
  }
  roleMapSection: {
    eyebrow: string
    heading: string
    items: RoleMapItem[]
  }
  profileMatchSection: {
    eyebrow: string
    heading: string
    panels: ProfilePanel[]
  }
  /** Standout credential panel — here: make-or-buy judgement on real spend. */
  spotlight: {
    chip: string
    statusBadge: string
    heading: string
    body: string
    credentials: string[]
    closingLine: string
  }
  /** Candidly owning the weakest area of the match. */
  gap: {
    chip: string
    heading: string
    body: string
  }
  closing: {
    eyebrow: string
    heading: string
    body: string
    credentials: string[]
    signature: string
  }
}

export const archletContent: Record<Locale, ArchletContent> = {
  en: {
    hero: {
      eyebrow: 'Archlet · Zurich · Senior Product Manager',
      headlineLead: 'Your posting asks for no degree, no years, and no domain.',
      headlineGradient: 'Just judgement. So let me show you mine.',
      description:
        "Nine years of product management: a platform used by 165M+ people at adidas, the shared internal platform 1,000+ professionals worked in every day, and now Head of Product at an algorithmic trading fintech. I've owned enterprise software from discovery through to measured impact, aligned people who didn't report to me, and made make-or-buy calls on real spend. This page maps that against your six missions, honestly — including the part where I don't match yet.",
      chips: [
        'Enterprise Product',
        'Discovery → Impact',
        'Align Without Authority',
        'AI-Native Tooling',
        'Relocating to Zurich',
      ],
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '165M+', label: 'Users on the platform I owned' },
        { value: '€1M', label: 'Annual licence I owned — bought, not built' },
        { value: '1000+', label: 'Professionals on the platform I built' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What Archlet is asking for — and where I've already done it",
      items: [
        {
          id: 'ownership',
          title: 'Owning a product area end to end — including the impact half',
          body: "Discovery through delivery is the easy half to claim; measurement is where most ownership quietly stops. Mine didn't. At Runtastic I owned the roadmap for a platform used by 165M+ people and reported direction and trade-offs straight to executives against OKRs and adoption KPIs — numbers used to steer the roadmap, not decorate it. The €1M Sprinklr platform was rebuilt around how teams actually worked and adoption rose 30%; the PIM rollout reached 100% adoption across 50+ market teams. I can tell you what each thing I shipped changed, because I was accountable for the number afterwards.",
        },
        {
          id: 'discovery',
          title: 'Deep discovery — with people whose job I have to learn first',
          body: "Your buyers, category managers and procurement leads are experts in something I am not, and the only way in is to sit with them until their workflow makes sense. I've done exactly that from the outside twice: building the adidas Global Admin Application meant learning how 1,000+ professionals across separate business units actually worked before consolidating their tools, and PlayerGrade meant learning how scouts and coaches judge a player well enough that they'd trust a score. Both times the useful insight arrived only after I stopped assuming I already understood the job.",
        },
        {
          id: 'roadmap',
          title: 'Prioritising against value, impact and feasibility',
          body: "Balancing those three is the daily trade-off, and I've made it under real constraints rather than in the abstract. At StagStrat latency is money — a model that answers too slowly is wrong regardless of quality — so specs get written as performance budgets. At adidas the constraint was 50+ market teams with genuinely conflicting priorities and one backlog. The judgement you're hiring for is knowing which requests are the market talking and which are one loud account; I've been wrong at that often enough to have got better at it.",
        },
        {
          id: 'craft',
          title:
            'Partnering with design and engineering from framing to release',
          body: 'The posting asks for solutions that are powerful *and* easy to use, which is a tension resolved in the framing, not in QA. I work close to the build: I led the front-end rebuild of the Runtastic platform (a Next.js/React migration that cut page-load time 55%), and I write and ship code myself — PlayerGrade in Python and FastAPI, this site included. That means engineers get a problem statement with the constraints already thought through, and I can hear when an estimate is really a design problem in disguise.',
        },
        {
          id: 'accounts',
          title: 'Strategic accounts, and the pull they exert on a roadmap',
          body: "Sitting in customer conversations and synthesising account feedback is familiar work — mine were internal, but the dynamics are identical. Business units at adidas behaved exactly like strategic accounts: large, vocal, convinced their edge case was the general case, and able to escalate. The skill is taking that seriously without letting the loudest voice quietly become the roadmap, and being able to explain to them, in their terms, why something didn't make the cut.",
        },
        {
          id: 'gtm',
          title: 'Positioning, enablement and rollout',
          body: 'A launch that nobody adopts is a failed launch, so I treat enablement as part of the product rather than a handover. The Sprinklr platform gained 30% adoption once positioning and enablement were rebuilt around real workflows; the PIM hit 100% adoption on day one because the documentation and training shipped with it. And I have run releases where failure was not an option — a staged Runtastic migration across three countries with zero downtime for 165M+ users, plus the go-to-market that carried people onto it.',
        },
        {
          id: 'autonomy',
          title: 'Proactive, self-directed, and used to a small team',
          body: "Archlet describes a small, ambitious team with a lot of autonomy, and that's the environment I actively chose most recently: Head of Product at a start-up where nobody hands you a backlog, and building PlayerGrade end to end on my own initiative because the problem was worth solving. I flag blockers early because at that size an unflagged blocker is everyone's problem within a day.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'What Archlet asks for',
          rows: [
            {
              requirement:
                'A user- and outcome-driven mindset — solving real problems, not shipping features',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Every project I lead is judged on a number afterwards: +30% adoption, 100% adoption across 50+ teams, −55% page load, zero downtime for 165M+ users.',
            },
            {
              requirement:
                'Strong analytical thinking; confident decisions on imperfect data',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I decide off SQL, PowerBI and Google Analytics on the product side, and off live model output at a trading platform where the data is never complete and the decision cannot wait.',
            },
            {
              requirement:
                'Excellent English; crisp problem statements, briefs and business cases',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2. I write specs and acceptance criteria as a deliverable, and have put business cases in front of executives at adidas for spend at the €1M level.',
            },
            {
              requirement:
                'Collaborative by default — aligning people without relying on authority',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The clearest match on this page. I aligned legal, procurement, branding, IT, business and Squad Leads — none of whom reported to me — plus 50+ global market teams and external vendors. Authority was never available; the work still shipped.',
            },
            {
              requirement:
                "Proactive and self-directed; flag blockers early, don't wait to be told",
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at an early-stage fintech, and I built PlayerGrade unprompted because the problem was worth solving. Nobody assigns work at that size.',
            },
            {
              requirement:
                'Own product areas end to end — discovery, delivery, impact measurement',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned the roadmap for a 165M+ user platform at Runtastic and set product strategy end-to-end at StagStrat, reporting outcomes against OKRs rather than output.',
            },
            {
              requirement:
                'Partner with design and engineering from problem framing to release',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I led the Next.js/React rebuild of the Runtastic front end and write production code myself, so framing arrives with the constraints already considered.',
            },
            {
              requirement:
                'Partner with go-to-market on positioning, enablement and rollout',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned go-to-market and enablement on a €1M platform rollout — adoption rose 30% after repositioning — and a PIM that hit 100% adoption on day one.',
            },
          ],
        },
        {
          title: 'Domain, product & context',
          rows: [
            {
              requirement: 'Procurement and sourcing domain knowledge',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "My honest gap, and the reason this panel exists. I've been a buyer of enterprise software and worked alongside adidas procurement and legal as an internal stakeholder — that's familiarity with the process, not expertise in it, and I won't inflate it.",
            },
            {
              requirement:
                'E-sourcing mechanics: RFX, bid optimisation, award scenarios',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I have not built or run these. I can reason about constrained optimisation and scenario modelling from the trading side, but the sourcing-specific mechanics I'd be learning from your customers in my first weeks.",
            },
            {
              requirement:
                'Discovery with buyers, category managers and procurement leads',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I've run discovery with expert users whose domain I didn't share — 1,000+ internal professionals, and coaches for PlayerGrade — but never with procurement practitioners specifically. The method carries; the vocabulary I have to earn.",
            },
            {
              requirement:
                'Working with Customer Success on strategic enterprise accounts',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My equivalent accounts were internal: adidas business units that were large, vocal and able to escalate. Same dynamics, same discipline — but not an external commercial relationship with a renewal attached.',
            },
            {
              requirement:
                'Enterprise software built for demanding professional users',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The adidas Global Admin Application pulled dozens of disconnected internal tools into one interface for 1,000+ professionals across business units — enterprise workflow software, judged on whether experts would actually switch to it.',
            },
            {
              requirement:
                'AI-native product; a roadmap leaning into automation and AI',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I build AI solutions hands-on: PlayerGrade is trained, tuned and served on Google AI Studio and Vertex AI. I assemble and deploy models on a managed suite rather than authoring architectures — which is exactly the altitude a PM needs on an AI-native roadmap.',
            },
            {
              requirement:
                'Small ambitious team; autonomy, speed and care about craft',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at a start-up building a real-money trading platform, after eight years in a large organisation. I have chosen the small-team end deliberately.',
            },
            {
              requirement: 'Based in Zurich, or remote within Spain',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "I'm near Florence today and ready to relocate to Zurich — no hedging, no request for a remote exception. I've already worked across Austria, the Netherlands and the UK, so moving for the right role is familiar rather than daunting.",
            },
            {
              requirement:
                'Fluent English; German useful around a Zurich headquarters',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2, plus German, Italian B2 and Slovak. This page is written in four of them.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Make or buy',
      statusBadge:
        'adidas — Sprinklr (bought) + adiSCom (built), run in parallel',
      heading:
        "I've run both sides of make-or-buy at once — and been accountable for the call.",
      body: "At adidas I owned Sprinklr, a €1M-a-year licensed platform, and adiSCom, the social-commerce engine we built in-house instead of buying, at the same time. One was a vendor relationship with a renewal and a business case attached; the other was a backlog, a team and a maintenance burden we chose to take on. I also delivered the PIM with an external development team, which is the third version of the same question — buy the product, build the product, or buy the capacity to build it. None of that makes me a procurement specialist. What it does mean is that I've sat on the paying side of enterprise software, argued a business case for spend at that level, and then lived with the consequences when the answer was wrong — the licence you can't get out of, the in-house tool nobody else will maintain. Archlet is building the system that makes those calls legible and defensible instead of instinctive. I know the feeling of making them without one.",
      credentials: [
        'Sprinklr — €1M/yr licence, bought',
        'adiSCom — built in-house instead',
        'PIM — delivered with an external dev team',
        'Vendor ecosystem across 50+ market teams',
      ],
      closingLine:
        'Your customers are trying to systematise a judgement I have had to make personally, with a fraction of the evidence and none of the tooling. That is a product problem I would find genuinely satisfying to work on.',
    },
    gap: {
      chip: 'Procurement, honestly',
      heading:
        "I haven't built sourcing software, and I'm not a procurement practitioner",
      body: "Let me be precise about the gap rather than blur it. I have never shipped procurement or sourcing software. I don't have RFX tooling, bid optimisation or award-scenario modelling in my background, and I've never held a category-management role or run a competitive tender as the buyer of record. Reading your posting, the domain is the one thing it doesn't ask for — every requirement listed is a competency — and I suspect that's deliberate, because sourcing expertise is learnable from your customers and product judgement mostly isn't. That's the bet I'd be asking you to make. What I bring against it is nine years of taking something complex and making it usable for experts who had no obligation to adopt it, a habit of measuring whether that worked, and enough technical depth to build the thing rather than only describe it. The domain is a first-quarter problem, and I'd rather be judged on how fast I close it than talk my way around the question now.",
    },
    closing: {
      eyebrow: 'Why Archlet',
      heading: 'Complex, unglamorous, and it decides where billions go',
      body: "Sourcing is the kind of problem I keep gravitating towards: high-stakes, structurally messy, owned by experts who have adapted to bad tools for years and stopped expecting better. That's the same shape as the internal platform I consolidated at adidas, where a thousand professionals had quietly built workarounds around software nobody had loved in a decade. Doing it well is mostly about respect for how the work actually gets done, and the patience to earn it before redesigning it. Add an AI-native platform, a small team with real autonomy, and a product whose output is measured in savings rather than engagement, and it's the most interesting product role I've read this year. I'd bring nine years of product judgement, the habit of building things myself, and an honest map of what I still have to learn.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · German · Italian B2 · Slovak',
        'Ready to relocate to Zurich',
      ],
      signature:
        'Lukáš Hošala — based near Florence, ready to relocate to Zurich.',
    },
  },

  de: {
    hero: {
      eyebrow: 'Archlet · Zürich · Senior Product Manager',
      headlineLead:
        'Ihre Ausschreibung verlangt keinen Abschluss, keine Jahre, keine Branche.',
      headlineGradient: 'Nur Urteilsvermögen. Also zeige ich Ihnen meines.',
      description:
        'Neun Jahre Produktmanagement: eine Plattform mit über 165 Millionen Nutzern bei adidas, die gemeinsame interne Plattform, in der über 1.000 Fachleute täglich arbeiteten, und heute Head of Product bei einer Fintech für algorithmischen Handel. Ich habe Unternehmenssoftware von der Discovery bis zur gemessenen Wirkung verantwortet, Menschen ausgerichtet, die mir nicht unterstellt waren, und Make-or-Buy-Entscheidungen über echtes Budget getroffen. Diese Seite gleicht das ehrlich mit Ihren sechs Missionen ab — einschließlich der Stelle, an der ich noch nicht passe.',
      chips: [
        'Enterprise-Produkt',
        'Discovery → Wirkung',
        'Ausrichten ohne Weisungsbefugnis',
        'KI-natives Tooling',
        'Umzug nach Zürich',
      ],
      stats: [
        { value: '8+', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer auf der Plattform, die ich verantwortet habe',
        },
        {
          value: '€1M',
          label:
            'Jahreslizenz, die ich verantwortet habe — gekauft, nicht gebaut',
        },
        {
          value: '1000+',
          label: 'Fachleute auf der Plattform, die ich gebaut habe',
        },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was Archlet sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'ownership',
          title:
            'Einen Produktbereich end-to-end verantworten — inklusive der Wirkung',
          body: 'Von Discovery bis Delivery ist die einfachere Hälfte; bei der Messung endet Verantwortung meist stillschweigend. Meine nicht. Bei Runtastic habe ich die Roadmap einer Plattform mit über 165 Millionen Nutzern verantwortet und Richtung sowie Trade-offs direkt an die Führungsebene berichtet — gegen OKRs und Adoptions-KPIs, die die Roadmap gesteuert und nicht geschmückt haben. Die 1-Mio.-€-Plattform Sprinklr wurde um die tatsächliche Arbeitsweise der Teams herum neu gebaut, die Nutzung stieg um 30%; der PIM-Rollout erreichte 100% Nutzung über mehr als 50 Marktteams. Ich kann Ihnen zu jedem ausgelieferten Produkt sagen, was es verändert hat, weil ich hinterher für die Zahl geradestehen musste.',
        },
        {
          id: 'discovery',
          title:
            'Tiefe Discovery — mit Menschen, deren Beruf ich erst lernen muss',
          body: 'Ihre Buyer, Category Manager und Procurement Leads sind Expertinnen und Experten für etwas, das ich nicht bin, und der einzige Weg hinein führt darüber, so lange neben ihnen zu sitzen, bis ihr Workflow Sinn ergibt. Genau das habe ich zweimal von außen getan: Für die adidas Global Admin Application musste ich verstehen, wie über 1.000 Fachleute in getrennten Geschäftsbereichen wirklich arbeiten, bevor ich ihre Tools zusammenführte; für PlayerGrade musste ich verstehen, wie Scouts und Trainer einen Spieler bewerten — gut genug, dass sie einer Bewertung vertrauen. Beide Male kam die brauchbare Erkenntnis erst, als ich aufhörte anzunehmen, ich verstünde den Job bereits.',
        },
        {
          id: 'roadmap',
          title: 'Priorisieren zwischen Wert, Wirkung und Machbarkeit',
          body: 'Diese drei auszubalancieren ist der tägliche Trade-off, und ich habe ihn unter echten Beschränkungen getroffen, nicht im Abstrakten. Bei StagStrat ist Latenz Geld — ein Modell, das zu langsam antwortet, ist falsch, egal wie gut es ist —, also entstehen Spezifikationen als Performance-Budgets. Bei adidas war die Beschränkung: über 50 Marktteams mit echten Zielkonflikten und ein Backlog. Das Urteilsvermögen, für das Sie einstellen, besteht darin zu erkennen, welche Anfragen der Markt sind und welche ein einzelner lauter Account; ich lag oft genug daneben, um darin besser geworden zu sein.',
        },
        {
          id: 'craft',
          title: 'Mit Design und Engineering vom Framing bis zum Release',
          body: 'Die Ausschreibung verlangt Lösungen, die mächtig *und* einfach zu bedienen sind — eine Spannung, die im Framing aufgelöst wird, nicht in der QA. Ich arbeite nah am Bauen: Ich habe den Front-End-Neuaufbau der Runtastic-Plattform geleitet (eine Next.js/React-Migration, die die Ladezeit um 55% senkte), und ich schreibe und liefere selbst Code aus — PlayerGrade in Python und FastAPI, diese Seite eingeschlossen. Ingenieure bekommen dadurch ein Problem, dessen Beschränkungen bereits durchdacht sind, und ich höre, wenn eine Schätzung in Wahrheit ein verkapptes Designproblem ist.',
        },
        {
          id: 'accounts',
          title: 'Strategische Accounts und ihr Zug an der Roadmap',
          body: 'In Kundengesprächen zu sitzen und Account-Feedback zu verdichten ist vertraute Arbeit — meine Accounts waren intern, die Dynamik ist identisch. Geschäftsbereiche bei adidas verhielten sich exakt wie strategische Accounts: groß, laut, überzeugt, ihr Sonderfall sei der Regelfall, und in der Lage zu eskalieren. Die Kunst besteht darin, das ernst zu nehmen, ohne dass die lauteste Stimme unbemerkt zur Roadmap wird — und erklären zu können, in ihren Begriffen, warum etwas es nicht geschafft hat.',
        },
        {
          id: 'gtm',
          title: 'Positionierung, Enablement und Rollout',
          body: 'Ein Launch, den niemand annimmt, ist ein gescheiterter Launch, deshalb behandle ich Enablement als Teil des Produkts und nicht als Übergabe. Die Sprinklr-Plattform gewann 30% Nutzung, nachdem Positionierung und Enablement um reale Workflows herum neu aufgebaut waren; das PIM erreichte 100% Nutzung am ersten Tag, weil Dokumentation und Schulung mitgeliefert wurden. Und ich habe Releases verantwortet, bei denen Scheitern keine Option war — eine stufenweise Runtastic-Migration über drei Länder mit null Ausfallzeit für über 165 Millionen Nutzer, samt dem Go-to-Market, das die Menschen darauf gebracht hat.',
        },
        {
          id: 'autonomy',
          title: 'Proaktiv, eigenständig und an kleine Teams gewöhnt',
          body: 'Archlet beschreibt ein kleines, ambitioniertes Team mit viel Autonomie — genau das Umfeld, das ich zuletzt bewusst gewählt habe: Head of Product in einem Start-up, wo niemand einem ein Backlog hinlegt, und PlayerGrade end-to-end aus eigenem Antrieb gebaut, weil das Problem es wert war. Blocker melde ich früh, weil ein ungemeldeter Blocker in dieser Größe binnen eines Tages das Problem aller ist.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Was Archlet verlangt',
          rows: [
            {
              requirement:
                'Nutzer- und ergebnisorientierte Haltung — echte Probleme lösen, nicht Features ausliefern',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Jedes Projekt, das ich führe, wird hinterher an einer Zahl gemessen: +30% Nutzung, 100% Nutzung über 50+ Teams, −55% Ladezeit, null Ausfallzeit für über 165 Mio. Nutzer.',
            },
            {
              requirement:
                'Starkes analytisches Denken; sichere Entscheidungen bei unvollständigen Daten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Produktseitig entscheide ich anhand von SQL, PowerBI und Google Analytics, und auf einer Trading-Plattform anhand von Live-Modell-Output, wo die Daten nie vollständig sind und die Entscheidung nicht warten kann.',
            },
            {
              requirement:
                'Exzellentes Englisch; präzise Problemstellungen, Briefs und Business Cases',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2. Ich schreibe Spezifikationen und Akzeptanzkriterien als Liefergegenstand und habe der adidas-Führungsebene Business Cases für Ausgaben in der Größenordnung von 1 Mio. € vorgelegt.',
            },
            {
              requirement:
                'Kollaborativ von Haus aus — Menschen ausrichten ohne Weisungsbefugnis',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Die klarste Übereinstimmung auf dieser Seite. Ich habe Legal, Procurement, Branding, IT, Business und Squad Leads ausgerichtet — keine davon mir unterstellt — dazu über 50 globale Marktteams und externe Anbieter. Weisungsbefugnis stand nie zur Verfügung; ausgeliefert wurde trotzdem.',
            },
            {
              requirement:
                'Proaktiv und eigenständig; Blocker früh melden, nicht auf Ansage warten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Head of Product in einer frühphasigen Fintech, und PlayerGrade habe ich unaufgefordert gebaut, weil das Problem es wert war. In dieser Größe verteilt niemand Aufgaben.',
            },
            {
              requirement:
                'Produktbereiche end-to-end verantworten — Discovery, Delivery, Wirkungsmessung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe die Roadmap einer Plattform mit über 165 Mio. Nutzern bei Runtastic verantwortet und bei StagStrat die Produktstrategie end-to-end gesetzt — berichtet wurden Ergebnisse gegen OKRs, nicht Output.',
            },
            {
              requirement:
                'Mit Design und Engineering vom Problem-Framing bis zum Release arbeiten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe den Next.js/React-Neuaufbau des Runtastic-Front-Ends geleitet und schreibe selbst produktiven Code, sodass das Framing mit bereits bedachten Beschränkungen ankommt.',
            },
            {
              requirement:
                'Mit Go-to-Market an Positionierung, Enablement und Rollout arbeiten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Go-to-Market und Enablement bei einem 1-Mio.-€-Rollout verantwortet — die Nutzung stieg nach der Neupositionierung um 30% — sowie ein PIM mit 100% Nutzung am ersten Tag.',
            },
          ],
        },
        {
          title: 'Fachgebiet, Produkt & Kontext',
          rows: [
            {
              requirement: 'Fachwissen in Procurement und Sourcing',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine ehrliche Lücke und der Grund, warum es dieses Panel gibt. Ich war Käufer von Unternehmenssoftware und habe als interner Stakeholder mit adidas Procurement und Legal gearbeitet — das ist Vertrautheit mit dem Prozess, keine Expertise darin, und ich werde es nicht aufblasen.',
            },
            {
              requirement:
                'E-Sourcing-Mechanik: RFX, Bid-Optimierung, Award-Szenarien',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Das habe ich weder gebaut noch betrieben. Über beschränkte Optimierung und Szenariomodellierung kann ich von der Trading-Seite her nachdenken, aber die sourcing-spezifische Mechanik würde ich in den ersten Wochen von Ihren Kunden lernen.',
            },
            {
              requirement:
                'Discovery mit Buyern, Category Managern und Procurement Leads',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich habe Discovery mit Expertennutzern gemacht, deren Fachgebiet ich nicht teilte — über 1.000 interne Fachleute und Trainer für PlayerGrade —, aber nie mit Procurement-Praktikern im Speziellen. Die Methode trägt; das Vokabular muss ich mir verdienen.',
            },
            {
              requirement:
                'Zusammenarbeit mit Customer Success an strategischen Enterprise-Accounts',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine vergleichbaren Accounts waren intern: adidas-Geschäftsbereiche, die groß und laut waren und eskalieren konnten. Gleiche Dynamik, gleiche Disziplin — aber keine externe Geschäftsbeziehung mit einer Vertragsverlängerung daran.',
            },
            {
              requirement:
                'Unternehmenssoftware für anspruchsvolle Fachanwender',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Die adidas Global Admin Application führte dutzende getrennte interne Tools in einer Oberfläche für über 1.000 Fachleute zusammen — Enterprise-Workflow-Software, gemessen daran, ob Expertinnen und Experten tatsächlich wechseln.',
            },
            {
              requirement:
                'KI-natives Produkt; eine Roadmap mit Fokus auf Automatisierung und KI',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich baue KI-Lösungen praktisch: PlayerGrade wird auf Google AI Studio und Vertex AI trainiert, getunt und ausgeliefert. Ich setze Modelle auf einer verwalteten Suite zusammen, statt Architekturen zu entwerfen — genau die Flughöhe, die ein PM auf einer KI-nativen Roadmap braucht.',
            },
            {
              requirement:
                'Kleines ambitioniertes Team; Autonomie, Tempo und Anspruch an Handwerk',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Head of Product in einem Start-up, das eine Trading-Plattform mit echtem Kapital baut, nach acht Jahren in einer Großorganisation. Das kleine Ende habe ich bewusst gewählt.',
            },
            {
              requirement: 'Standort Zürich oder remote innerhalb Spaniens',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich lebe derzeit bei Florenz und bin bereit, nach Zürich zu ziehen — ohne Wenn und Aber und ohne Bitte um eine Remote-Ausnahme. Ich habe bereits in Österreich, den Niederlanden und Großbritannien gearbeitet; ein Umzug für die richtige Rolle ist mir vertraut.',
            },
            {
              requirement:
                'Fließendes Englisch; Deutsch nützlich rund um eine Zürcher Zentrale',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2, dazu Deutsch, Italienisch B2 und Slowakisch. Diese Seite ist in vier davon geschrieben.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Make or Buy',
      statusBadge:
        'adidas — Sprinklr (gekauft) + adiSCom (gebaut), parallel geführt',
      heading:
        'Ich habe beide Seiten von Make-or-Buy gleichzeitig geführt — und für die Entscheidung geradegestanden.',
      body: 'Bei adidas habe ich Sprinklr verantwortet, eine lizenzierte Plattform für 1 Mio. € im Jahr, und gleichzeitig adiSCom, die Social-Commerce-Engine, die wir statt eines Zukaufs selbst gebaut haben. Das eine war eine Lieferantenbeziehung mit Vertragsverlängerung und Business Case; das andere ein Backlog, ein Team und eine Wartungslast, die wir bewusst auf uns genommen haben. Dazu habe ich das PIM mit einem externen Entwicklungsteam geliefert — die dritte Variante derselben Frage: das Produkt kaufen, das Produkt bauen, oder die Kapazität zum Bauen kaufen. Nichts davon macht mich zum Procurement-Spezialisten. Es heißt aber, dass ich auf der zahlenden Seite von Unternehmenssoftware saß, einen Business Case für Ausgaben dieser Größenordnung vertreten und anschließend mit den Folgen gelebt habe, wenn die Antwort falsch war — die Lizenz, aus der man nicht herauskommt, das interne Tool, das sonst niemand pflegen will. Archlet baut das System, das solche Entscheidungen nachvollziehbar und belegbar macht statt instinktiv. Ich kenne das Gefühl, sie ohne dieses System zu treffen.',
      credentials: [
        'Sprinklr — Lizenz für 1 Mio. €/Jahr, gekauft',
        'adiSCom — stattdessen intern gebaut',
        'PIM — mit externem Entwicklungsteam geliefert',
        'Anbieter-Ökosystem über 50+ Marktteams',
      ],
      closingLine:
        'Ihre Kunden versuchen, ein Urteil zu systematisieren, das ich persönlich treffen musste — mit einem Bruchteil der Belege und ganz ohne Werkzeug. Das ist ein Produktproblem, an dem ich mit echter Freude arbeiten würde.',
    },
    gap: {
      chip: 'Procurement, ehrlich gesagt',
      heading:
        'Ich habe keine Sourcing-Software gebaut, und ich bin kein Procurement-Praktiker',
      body: 'Ich will die Lücke präzise benennen statt sie zu verwischen. Ich habe nie Procurement- oder Sourcing-Software ausgeliefert. RFX-Tooling, Bid-Optimierung oder Award-Szenario-Modellierung stehen nicht in meinem Hintergrund, und ich hatte nie eine Category-Management-Rolle oder eine Ausschreibung als verantwortlicher Einkäufer. Beim Lesen Ihrer Ausschreibung fällt auf: Das Fachgebiet ist das Einzige, wonach sie nicht fragt — jede genannte Anforderung ist eine Kompetenz. Ich vermute, das ist Absicht, weil Sourcing-Wissen von Ihren Kunden lernbar ist und Produkturteil meist nicht. Das ist die Wette, um die ich Sie bitten würde. Dagegen setze ich neun Jahre darin, Komplexes für Fachleute nutzbar zu machen, die keinerlei Verpflichtung hatten, es anzunehmen, die Gewohnheit zu messen, ob das gelungen ist, und genug technische Tiefe, um die Sache selbst zu bauen statt sie nur zu beschreiben. Das Fachgebiet ist ein Problem des ersten Quartals, und ich möchte lieber daran gemessen werden, wie schnell ich es schließe, als die Frage jetzt zu umgehen.',
    },
    closing: {
      eyebrow: 'Warum Archlet',
      heading:
        'Komplex, unglamourös — und es entscheidet, wohin Milliarden gehen',
      body: 'Sourcing ist genau die Art Problem, zu der es mich immer wieder zieht: hohe Einsätze, strukturell unordentlich, in den Händen von Fachleuten, die sich jahrelang an schlechte Werkzeuge angepasst und aufgehört haben, Besseres zu erwarten. Das ist derselbe Zuschnitt wie die interne Plattform, die ich bei adidas zusammengeführt habe, wo tausend Fachleute leise Workarounds um Software herum gebaut hatten, die seit einem Jahrzehnt niemand mochte. Es gut zu machen heißt vor allem: Respekt davor, wie die Arbeit tatsächlich läuft, und die Geduld, sich diesen zu verdienen, bevor man umgestaltet. Dazu eine KI-native Plattform, ein kleines Team mit echter Autonomie und ein Produkt, dessen Wirkung in Einsparungen und nicht in Engagement gemessen wird — es ist die interessanteste Produktrolle, die ich dieses Jahr gelesen habe. Ich brächte neun Jahre Produkturteil mit, die Gewohnheit, Dinge selbst zu bauen, und eine ehrliche Landkarte dessen, was ich noch lernen muss.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Deutsch · Italienisch B2 · Slowakisch',
        'Bereit für den Umzug nach Zürich',
      ],
      signature:
        'Lukáš Hošala — wohnhaft bei Florenz, bereit für den Umzug nach Zürich.',
    },
  },

  es: {
    hero: {
      eyebrow: 'Archlet · Zúrich · Senior Product Manager',
      headlineLead: 'Vuestra oferta no pide titulación, ni años, ni sector.',
      headlineGradient: 'Solo criterio. Así que os muestro el mío.',
      description:
        'Nueve años de product management: una plataforma usada por más de 165 millones de personas en adidas, la plataforma interna compartida en la que más de 1.000 profesionales trabajaban cada día, y hoy Head of Product en una fintech de trading algorítmico. He sido responsable de software empresarial desde el descubrimiento hasta el impacto medido, he alineado a personas que no dependían de mí, y he tomado decisiones de comprar-o-construir sobre gasto real. Esta página compara todo eso con vuestras seis misiones, con honestidad — incluida la parte en la que todavía no encajo.',
      chips: [
        'Producto empresarial',
        'Discovery → Impacto',
        'Alinear sin autoridad',
        'Herramientas AI-native',
        'Traslado a Zúrich',
      ],
      stats: [
        { value: '8+', label: 'Años en product management' },
        {
          value: '165M+',
          label: 'Usuarios en la plataforma que dirigí',
        },
        {
          value: '€1M',
          label: 'Licencia anual que gestioné — comprada, no construida',
        },
        {
          value: '1000+',
          label: 'Profesionales en la plataforma que construí',
        },
      ],
    },
    roleMapSection: {
      eyebrow: 'El puesto, punto por punto',
      heading: 'Lo que busca Archlet — y dónde ya lo he hecho',
      items: [
        {
          id: 'ownership',
          title:
            'Ser responsable de un área de producto de principio a fin — incluido el impacto',
          body: 'Del descubrimiento a la entrega es la mitad fácil de reivindicar; es en la medición donde la responsabilidad suele detenerse en silencio. La mía no. En Runtastic dirigí la hoja de ruta de una plataforma usada por más de 165 millones de personas y reporté dirección y compromisos directamente a la dirección, contra OKR y KPI de adopción — números usados para guiar la hoja de ruta, no para decorarla. La plataforma Sprinklr, de 1 millón de euros, se reconstruyó en torno a cómo trabajaban realmente los equipos y la adopción subió un 30%; el despliegue del PIM alcanzó el 100% de adopción en más de 50 equipos de mercado. Puedo deciros qué cambió cada cosa que lancé, porque después tuve que responder por la cifra.',
        },
        {
          id: 'discovery',
          title:
            'Descubrimiento profundo — con personas cuyo oficio tengo que aprender primero',
          body: 'Vuestros compradores, category managers y responsables de compras son expertos en algo que yo no soy, y la única forma de entrar es sentarse con ellos hasta que su flujo de trabajo tenga sentido. He hecho exactamente eso desde fuera dos veces: construir la Global Admin Application de adidas exigió entender cómo trabajaban de verdad más de 1.000 profesionales de unidades de negocio distintas antes de unificar sus herramientas, y PlayerGrade exigió entender cómo un ojeador o un entrenador valora a un jugador, lo bastante bien como para que se fiaran de una puntuación. Las dos veces, la idea útil llegó solo cuando dejé de dar por supuesto que ya entendía el trabajo.',
        },
        {
          id: 'roadmap',
          title: 'Priorizar entre valor, impacto y viabilidad',
          body: 'Equilibrar esos tres es el compromiso diario, y lo he hecho bajo restricciones reales, no en abstracto. En StagStrat la latencia es dinero — un modelo que responde demasiado tarde está equivocado por bueno que sea —, así que las especificaciones se escriben como presupuestos de rendimiento. En adidas la restricción eran más de 50 equipos de mercado con prioridades realmente enfrentadas y un solo backlog. El criterio por el que contratáis consiste en saber qué peticiones son el mercado hablando y cuáles son una sola cuenta ruidosa; me he equivocado lo suficiente como para haber mejorado en eso.',
        },
        {
          id: 'craft',
          title:
            'Colaborar con diseño e ingeniería desde el planteamiento hasta el lanzamiento',
          body: 'La oferta pide soluciones potentes *y* fáciles de usar, una tensión que se resuelve en el planteamiento, no en QA. Trabajo cerca de la construcción: dirigí la reconstrucción del front-end de la plataforma Runtastic (una migración a Next.js/React que redujo un 55% el tiempo de carga) y escribo y despliego código yo mismo — PlayerGrade en Python y FastAPI, esta página incluida. Eso significa que ingeniería recibe un problema con las restricciones ya pensadas, y que sé escuchar cuándo una estimación es en realidad un problema de diseño disfrazado.',
        },
        {
          id: 'accounts',
          title:
            'Cuentas estratégicas y la fuerza que ejercen sobre la hoja de ruta',
          body: 'Participar en conversaciones con clientes y sintetizar el feedback de cuenta es trabajo conocido — las mías eran internas, pero la dinámica es idéntica. Las unidades de negocio de adidas se comportaban exactamente como cuentas estratégicas: grandes, ruidosas, convencidas de que su caso particular era el caso general, y con capacidad de escalar. La habilidad está en tomarlo en serio sin dejar que la voz más alta se convierta discretamente en la hoja de ruta, y en poder explicarles, en sus términos, por qué algo no entró.',
        },
        {
          id: 'gtm',
          title: 'Posicionamiento, habilitación y despliegue',
          body: 'Un lanzamiento que nadie adopta es un lanzamiento fallido, así que trato la habilitación como parte del producto y no como una entrega. La plataforma Sprinklr ganó un 30% de adopción cuando posicionamiento y habilitación se reconstruyeron en torno a flujos de trabajo reales; el PIM llegó al 100% de adopción el primer día porque la documentación y la formación se entregaron con él. Y he gestionado lanzamientos en los que fallar no era una opción — una migración escalonada de Runtastic en tres países con cero tiempo de inactividad para más de 165 millones de usuarios, más el go-to-market que llevó a la gente hasta allí.',
        },
        {
          id: 'autonomy',
          title: 'Proactivo, autónomo y acostumbrado a un equipo pequeño',
          body: 'Archlet describe un equipo pequeño y ambicioso con mucha autonomía, y es justo el entorno que elegí de forma activa más recientemente: Head of Product en una start-up donde nadie te entrega un backlog, y PlayerGrade construido de principio a fin por iniciativa propia porque el problema merecía la pena. Señalo los bloqueos pronto porque, a ese tamaño, un bloqueo no señalado es problema de todos en un día.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondencia con el perfil',
      heading: 'Dónde encajo, y dónde no',
      panels: [
        {
          title: 'Lo que pide Archlet',
          rows: [
            {
              requirement:
                'Mentalidad centrada en el usuario y el resultado — resolver problemas reales, no lanzar funcionalidades',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Cada proyecto que dirijo se juzga después con una cifra: +30% de adopción, 100% de adopción en más de 50 equipos, −55% en tiempo de carga, cero caídas para más de 165 millones de usuarios.',
            },
            {
              requirement:
                'Pensamiento analítico sólido; decisiones firmes con datos imperfectos',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Decido con SQL, PowerBI y Google Analytics en el lado de producto, y con la salida de modelos en vivo en una plataforma de trading donde los datos nunca están completos y la decisión no puede esperar.',
            },
            {
              requirement:
                'Excelente inglés; planteamientos, briefs y business cases claros',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Inglés C2. Escribo especificaciones y criterios de aceptación como entregable, y he defendido business cases ante la dirección de adidas para gasto del orden de 1 millón de euros.',
            },
            {
              requirement:
                'Colaborativo por defecto — alinear a la gente sin recurrir a la autoridad',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'La correspondencia más clara de esta página. Alineé a legal, compras, marca, IT, negocio y Squad Leads — ninguno dependía de mí — más de 50 equipos de mercado globales y proveedores externos. Nunca hubo autoridad disponible; el trabajo salió igualmente.',
            },
            {
              requirement:
                'Proactivo y autónomo; señalar bloqueos pronto, sin esperar instrucciones',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Head of Product en una fintech en fase temprana, y construí PlayerGrade sin que nadie me lo pidiera porque el problema lo merecía. A ese tamaño nadie reparte tareas.',
            },
            {
              requirement:
                'Responsabilidad de principio a fin — descubrimiento, entrega y medición de impacto',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Dirigí la hoja de ruta de una plataforma de más de 165 millones de usuarios en Runtastic y definí la estrategia de producto de principio a fin en StagStrat, reportando resultados contra OKR y no producción.',
            },
            {
              requirement:
                'Colaborar con diseño e ingeniería desde el planteamiento hasta el lanzamiento',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Dirigí la reconstrucción en Next.js/React del front-end de Runtastic y escribo código en producción, así que el planteamiento llega con las restricciones ya consideradas.',
            },
            {
              requirement:
                'Colaborar con go-to-market en posicionamiento, habilitación y despliegue',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Responsable del go-to-market y la habilitación en un despliegue de 1 millón de euros — la adopción subió un 30% tras el reposicionamiento — y de un PIM con 100% de adopción el primer día.',
            },
          ],
        },
        {
          title: 'Sector, producto y contexto',
          rows: [
            {
              requirement: 'Conocimiento del sector de compras y sourcing',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Mi carencia honesta, y la razón de que exista este panel. He sido comprador de software empresarial y he trabajado junto a compras y legal en adidas como parte interesada interna — eso es familiaridad con el proceso, no experiencia en él, y no lo voy a inflar.',
            },
            {
              requirement:
                'Mecánica de e-sourcing: RFX, optimización de ofertas, escenarios de adjudicación',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'No lo he construido ni operado. Puedo razonar sobre optimización con restricciones y modelado de escenarios desde el lado del trading, pero la mecánica específica de sourcing la aprendería de vuestros clientes en mis primeras semanas.',
            },
            {
              requirement:
                'Descubrimiento con compradores, category managers y responsables de compras',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'He hecho descubrimiento con usuarios expertos cuyo campo no compartía — más de 1.000 profesionales internos, y entrenadores para PlayerGrade — pero nunca con profesionales de compras en concreto. El método se traslada; el vocabulario me lo tengo que ganar.',
            },
            {
              requirement:
                'Trabajar con Customer Success en cuentas empresariales estratégicas',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Mis cuentas equivalentes eran internas: unidades de negocio de adidas grandes, ruidosas y con capacidad de escalar. Misma dinámica, misma disciplina — pero sin una relación comercial externa con una renovación de por medio.',
            },
            {
              requirement:
                'Software empresarial para usuarios profesionales exigentes',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'La Global Admin Application de adidas unificó decenas de herramientas internas inconexas en una sola interfaz para más de 1.000 profesionales — software de flujo de trabajo empresarial, juzgado por si los expertos se cambiaban de verdad a él.',
            },
            {
              requirement:
                'Producto AI-native; una hoja de ruta orientada a la automatización y la IA',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Construyo soluciones de IA de forma práctica: PlayerGrade se entrena, ajusta y sirve en Google AI Studio y Vertex AI. Ensamblo y despliego modelos sobre una suite gestionada en lugar de diseñar arquitecturas — exactamente la altura que necesita un PM en una hoja de ruta AI-native.',
            },
            {
              requirement:
                'Equipo pequeño y ambicioso; autonomía, velocidad y cuidado por el oficio',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Head of Product en una start-up que construye una plataforma de trading con capital real, tras ocho años en una gran organización. He elegido el extremo pequeño deliberadamente.',
            },
            {
              requirement: 'Con base en Zúrich, o en remoto dentro de España',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Hoy vivo cerca de Florencia y estoy dispuesto a trasladarme a Zúrich — sin condiciones y sin pedir una excepción de trabajo en remoto. Ya he trabajado en Austria, Países Bajos y Reino Unido, así que mudarme por el puesto adecuado me resulta familiar.',
            },
            {
              requirement:
                'Inglés fluido; el alemán resulta útil en una sede en Zúrich',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Inglés C2, además de alemán, italiano B2 y eslovaco. Esta página está escrita en cuatro de ellos.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Comprar o construir',
      statusBadge:
        'adidas — Sprinklr (comprado) + adiSCom (construido), en paralelo',
      heading:
        'He llevado los dos lados de comprar-o-construir a la vez — y he respondido por la decisión.',
      body: 'En adidas fui responsable de Sprinklr, una plataforma licenciada de 1 millón de euros al año, y de adiSCom, el motor de social commerce que construimos internamente en lugar de comprarlo, al mismo tiempo. Lo uno era una relación con un proveedor, con una renovación y un business case detrás; lo otro era un backlog, un equipo y una carga de mantenimiento que decidimos asumir. Además entregué el PIM con un equipo de desarrollo externo, que es la tercera versión de la misma pregunta: comprar el producto, construir el producto, o comprar la capacidad de construirlo. Nada de eso me convierte en especialista en compras. Lo que sí significa es que he estado en el lado que paga por el software empresarial, he defendido un business case para gasto de ese nivel y después he convivido con las consecuencias cuando la respuesta era la equivocada — la licencia de la que no puedes salir, la herramienta interna que nadie más quiere mantener. Archlet está construyendo el sistema que hace que esas decisiones sean legibles y defendibles en vez de instintivas. Yo conozco la sensación de tomarlas sin él.',
      credentials: [
        'Sprinklr — licencia de 1 M€/año, comprada',
        'adiSCom — construido internamente en su lugar',
        'PIM — entregado con un equipo de desarrollo externo',
        'Ecosistema de proveedores en más de 50 equipos de mercado',
      ],
      closingLine:
        'Vuestros clientes intentan sistematizar un criterio que yo he tenido que aplicar personalmente, con una fracción de la evidencia y sin ninguna herramienta. Ese es un problema de producto en el que trabajaría con verdadero gusto.',
    },
    gap: {
      chip: 'Compras, con honestidad',
      heading:
        'No he construido software de sourcing, y no soy profesional de compras',
      body: 'Prefiero precisar la carencia en lugar de difuminarla. Nunca he lanzado software de compras o de sourcing. No tengo en mi trayectoria herramientas de RFX, optimización de ofertas ni modelado de escenarios de adjudicación, y nunca he ocupado un puesto de category management ni he llevado una licitación competitiva como comprador responsable. Al leer vuestra oferta, el sector es justo lo único que no pedís — todos los requisitos que enumeráis son competencias. Sospecho que es deliberado, porque la experiencia en sourcing se aprende de vuestros clientes y el criterio de producto en general no. Esa es la apuesta que os pediría hacer. A cambio traigo nueve años cogiendo algo complejo y volviéndolo utilizable para expertos que no tenían ninguna obligación de adoptarlo, la costumbre de medir si funcionó, y suficiente profundidad técnica para construir la cosa en lugar de solo describirla. El sector es un problema del primer trimestre, y prefiero que me juzguéis por lo rápido que lo cierro antes que esquivar la pregunta ahora.',
    },
    closing: {
      eyebrow: 'Por qué Archlet',
      heading:
        'Complejo, poco glamuroso, y decide a dónde van miles de millones',
      body: 'El sourcing es el tipo de problema al que vuelvo una y otra vez: mucho en juego, estructuralmente desordenado, en manos de expertos que llevan años adaptándose a herramientas malas y han dejado de esperar algo mejor. Es la misma forma que tenía la plataforma interna que unifiqué en adidas, donde mil profesionales habían construido en silencio sus apaños alrededor de un software que nadie apreciaba desde hacía una década. Hacerlo bien consiste sobre todo en respetar cómo se hace el trabajo de verdad, y en tener la paciencia de ganarse ese respeto antes de rediseñar nada. Añadid una plataforma AI-native, un equipo pequeño con autonomía real y un producto cuyo resultado se mide en ahorro y no en engagement, y es el puesto de producto más interesante que he leído este año. Aportaría nueve años de criterio de producto, la costumbre de construir las cosas yo mismo, y un mapa honesto de lo que todavía me queda por aprender.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglés C2 · Alemán · Italiano B2 · Eslovaco',
        'Dispuesto a trasladarme a Zúrich',
      ],
      signature:
        'Lukáš Hošala — con base cerca de Florencia, dispuesto a trasladarme a Zúrich.',
    },
  },

  it: {
    hero: {
      eyebrow: 'Archlet · Zurigo · Senior Product Manager',
      headlineLead:
        'Il vostro annuncio non chiede titoli, né anni, né settore.',
      headlineGradient: 'Solo giudizio. Quindi vi mostro il mio.',
      description:
        "Nove anni di product management: una piattaforma usata da oltre 165 milioni di persone in adidas, la piattaforma interna condivisa in cui oltre 1.000 professionisti lavoravano ogni giorno, e oggi Head of Product in una fintech di trading algoritmico. Ho gestito software aziendale dalla discovery fino all'impatto misurato, ho allineato persone che non rispondevano a me, e ho preso decisioni di comprare-o-costruire su spesa reale. Questa pagina mette tutto questo a confronto con le vostre sei missioni, con onestà — inclusa la parte in cui ancora non corrispondo.",
      chips: [
        'Prodotto enterprise',
        'Discovery → Impatto',
        'Allineare senza autorità',
        'Strumenti AI-native',
        'Trasferimento a Zurigo',
      ],
      stats: [
        { value: '8+', label: 'Anni in product management' },
        {
          value: '165M+',
          label: 'Utenti sulla piattaforma che ho gestito',
        },
        {
          value: '€1M',
          label: 'Licenza annuale che ho gestito — comprata, non costruita',
        },
        {
          value: '1000+',
          label: 'Professionisti sulla piattaforma che ho costruito',
        },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Archlet cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'ownership',
          title: "Gestire un'area di prodotto end-to-end — impatto compreso",
          body: "Dalla discovery alla delivery è la metà facile da rivendicare; è sulla misurazione che la responsabilità di solito si ferma in silenzio. La mia no. In Runtastic ho gestito la roadmap di una piattaforma usata da oltre 165 milioni di persone e ho riportato direzione e trade-off direttamente ai dirigenti, contro OKR e KPI di adozione — numeri usati per guidare la roadmap, non per decorarla. La piattaforma Sprinklr da 1 milione di euro è stata ricostruita attorno a come i team lavoravano davvero e l'adozione è salita del 30%; il rollout del PIM ha raggiunto il 100% di adozione su oltre 50 team di mercato. Posso dirvi cosa ha cambiato ogni cosa che ho rilasciato, perché dopo ho dovuto rispondere del numero.",
        },
        {
          id: 'discovery',
          title:
            'Discovery profonda — con persone il cui mestiere devo prima imparare',
          body: "I vostri buyer, category manager e responsabili acquisti sono esperti di qualcosa che io non sono, e l'unico modo di entrarci è sedersi accanto a loro finché il loro flusso di lavoro non ha senso. L'ho fatto esattamente così, dall'esterno, due volte: costruire la Global Admin Application di adidas ha richiesto di capire come lavoravano davvero oltre 1.000 professionisti di business unit diverse prima di unificare i loro strumenti, e PlayerGrade ha richiesto di capire come un osservatore o un allenatore valuta un giocatore, abbastanza bene da fidarsi di un punteggio. Entrambe le volte l'intuizione utile è arrivata solo quando ho smesso di dare per scontato di aver già capito il lavoro.",
        },
        {
          id: 'roadmap',
          title: 'Dare priorità tra valore, impatto e fattibilità',
          body: "Bilanciare questi tre è il trade-off quotidiano, e l'ho fatto sotto vincoli reali, non in astratto. In StagStrat la latenza è denaro — un modello che risponde troppo lentamente è sbagliato per quanto sia buono — quindi le specifiche si scrivono come budget di performance. In adidas il vincolo erano oltre 50 team di mercato con priorità realmente in conflitto e un solo backlog. Il giudizio per cui state assumendo sta nel capire quali richieste sono il mercato che parla e quali sono un singolo cliente rumoroso; ho sbagliato abbastanza spesso da esserci migliorato.",
        },
        {
          id: 'craft',
          title: 'Lavorare con design e engineering dal framing al rilascio',
          body: "L'annuncio chiede soluzioni potenti *e* facili da usare, una tensione che si risolve nel framing, non in QA. Lavoro vicino alla costruzione: ho guidato la ricostruzione del front-end della piattaforma Runtastic (una migrazione Next.js/React che ha ridotto del 55% il tempo di caricamento) e scrivo e rilascio codice di persona — PlayerGrade in Python e FastAPI, questa pagina compresa. Significa che gli ingegneri ricevono un problema con i vincoli già ragionati, e che so riconoscere quando una stima è in realtà un problema di design travestito.",
        },
        {
          id: 'accounts',
          title: 'Account strategici e la forza che esercitano sulla roadmap',
          body: "Partecipare alle conversazioni con i clienti e sintetizzare il feedback di account è lavoro familiare — i miei erano interni, ma la dinamica è identica. Le business unit di adidas si comportavano esattamente come account strategici: grandi, rumorose, convinte che il loro caso particolare fosse quello generale, e in grado di fare escalation. L'abilità sta nel prenderle sul serio senza lasciare che la voce più forte diventi silenziosamente la roadmap, e nel saper spiegare loro, nei loro termini, perché qualcosa non è entrato.",
        },
        {
          id: 'gtm',
          title: 'Posizionamento, abilitazione e rollout',
          body: "Un lancio che nessuno adotta è un lancio fallito, quindi tratto l'abilitazione come parte del prodotto e non come un passaggio di consegne. La piattaforma Sprinklr ha guadagnato il 30% di adozione quando posizionamento e abilitazione sono stati ricostruiti attorno ai flussi di lavoro reali; il PIM ha raggiunto il 100% di adozione il primo giorno perché documentazione e formazione sono state rilasciate insieme. E ho gestito rilasci in cui fallire non era un'opzione — una migrazione a fasi di Runtastic su tre paesi con zero downtime per oltre 165 milioni di utenti, più il go-to-market che ci ha portato le persone.",
        },
        {
          id: 'autonomy',
          title: 'Proattivo, autonomo e abituato a un team piccolo',
          body: "Archlet descrive un team piccolo e ambizioso con molta autonomia, ed è esattamente l'ambiente che ho scelto attivamente più di recente: Head of Product in una start-up dove nessuno ti consegna un backlog, e PlayerGrade costruito end-to-end di mia iniziativa perché il problema valeva la pena. Segnalo presto i blocchi perché, a quelle dimensioni, un blocco non segnalato diventa il problema di tutti nel giro di un giorno.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Quello che Archlet chiede',
          rows: [
            {
              requirement:
                'Mentalità orientata a utente e risultato — risolvere problemi reali, non rilasciare funzionalità',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ogni progetto che guido viene giudicato dopo su un numero: +30% di adozione, 100% di adozione su oltre 50 team, −55% sul tempo di caricamento, zero downtime per oltre 165 milioni di utenti.',
            },
            {
              requirement:
                'Pensiero analitico solido; decisioni sicure con dati imperfetti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Decido su SQL, PowerBI e Google Analytics lato prodotto, e sull’output dei modelli in tempo reale in una piattaforma di trading dove i dati non sono mai completi e la decisione non può aspettare.',
            },
            {
              requirement:
                'Ottimo inglese; problemi, brief e business case formulati con precisione',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2. Scrivo specifiche e criteri di accettazione come deliverable, e ho portato business case davanti ai dirigenti di adidas per spese nell’ordine del milione di euro.',
            },
            {
              requirement:
                'Collaborativo per natura — allineare le persone senza ricorrere all’autorità',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'La corrispondenza più netta di questa pagina. Ho allineato legal, procurement, branding, IT, business e Squad Lead — nessuno dei quali rispondeva a me — oltre a più di 50 team di mercato globali e fornitori esterni. L’autorità non è mai stata disponibile; il lavoro è uscito lo stesso.',
            },
            {
              requirement:
                'Proattivo e autonomo; segnalare presto i blocchi, senza aspettare istruzioni',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Head of Product in una fintech in fase iniziale, e ho costruito PlayerGrade senza che me lo chiedesse nessuno perché il problema lo meritava. A quelle dimensioni nessuno assegna i compiti.',
            },
            {
              requirement:
                'Gestione end-to-end — discovery, delivery e misurazione dell’impatto',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho gestito la roadmap di una piattaforma da oltre 165 milioni di utenti in Runtastic e definito la strategia di prodotto end-to-end in StagStrat, riportando risultati contro gli OKR e non output.',
            },
            {
              requirement:
                'Lavorare con design e engineering dal framing del problema al rilascio',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato la ricostruzione Next.js/React del front-end di Runtastic e scrivo codice in produzione, così il framing arriva con i vincoli già considerati.',
            },
            {
              requirement:
                'Lavorare con il go-to-market su posizionamento, abilitazione e rollout',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho curato go-to-market e abilitazione su un rollout da 1 milione di euro — l’adozione è salita del 30% dopo il riposizionamento — e un PIM al 100% di adozione il primo giorno.',
            },
          ],
        },
        {
          title: 'Settore, prodotto e contesto',
          rows: [
            {
              requirement: 'Conoscenza del settore procurement e sourcing',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'La mia lacuna onesta, e il motivo per cui esiste questo pannello. Sono stato acquirente di software aziendale e ho lavorato accanto a procurement e legal in adidas come stakeholder interno — è familiarità con il processo, non competenza in esso, e non la gonfierò.',
            },
            {
              requirement:
                'Meccanica dell’e-sourcing: RFX, ottimizzazione delle offerte, scenari di aggiudicazione',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Non li ho né costruiti né gestiti. So ragionare di ottimizzazione vincolata e modellazione di scenari dal lato trading, ma la meccanica specifica del sourcing la imparerei dai vostri clienti nelle prime settimane.',
            },
            {
              requirement:
                'Discovery con buyer, category manager e responsabili acquisti',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Ho fatto discovery con utenti esperti di cui non condividevo il campo — oltre 1.000 professionisti interni e allenatori per PlayerGrade — ma mai con professionisti degli acquisti nello specifico. Il metodo si trasferisce; il vocabolario devo guadagnarmelo.',
            },
            {
              requirement:
                'Lavorare con il Customer Success su account enterprise strategici',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'I miei account equivalenti erano interni: business unit di adidas grandi, rumorose e capaci di fare escalation. Stessa dinamica, stessa disciplina — ma senza una relazione commerciale esterna con un rinnovo in gioco.',
            },
            {
              requirement:
                'Software aziendale per utenti professionali esigenti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'La Global Admin Application di adidas ha unito decine di strumenti interni scollegati in un’unica interfaccia per oltre 1.000 professionisti — software di workflow aziendale, giudicato sul fatto che gli esperti ci passassero davvero.',
            },
            {
              requirement:
                'Prodotto AI-native; una roadmap orientata ad automazione e AI',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Costruisco soluzioni AI in modo pratico: PlayerGrade viene addestrato, affinato e servito su Google AI Studio e Vertex AI. Assemblo e rilascio modelli su una suite gestita invece di ideare architetture — esattamente l’altezza che serve a un PM su una roadmap AI-native.',
            },
            {
              requirement:
                'Team piccolo e ambizioso; autonomia, velocità e cura del mestiere',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Head of Product in una start-up che costruisce una piattaforma di trading a capitale reale, dopo otto anni in una grande organizzazione. Ho scelto deliberatamente il lato piccolo.',
            },
            {
              requirement: 'Sede a Zurigo, o da remoto in Spagna',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Oggi vivo vicino a Firenze e sono pronto a trasferirmi a Zurigo — senza riserve e senza chiedere un’eccezione per il lavoro da remoto. Ho già lavorato in Austria, Paesi Bassi e Regno Unito, quindi trasferirmi per il ruolo giusto mi è familiare.',
            },
            {
              requirement:
                'Inglese fluente; il tedesco è utile attorno a una sede di Zurigo',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2, più tedesco, italiano B2 e slovacco. Questa pagina è scritta in quattro di queste lingue.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Comprare o costruire',
      statusBadge:
        'adidas — Sprinklr (comprato) + adiSCom (costruito), in parallelo',
      heading:
        'Ho gestito entrambi i lati del comprare-o-costruire insieme — e ho risposto della scelta.',
      body: "In adidas ho gestito Sprinklr, una piattaforma in licenza da 1 milione di euro l'anno, e adiSCom, il motore di social commerce che abbiamo costruito internamente invece di comprarlo, nello stesso periodo. Il primo era un rapporto con un fornitore, con un rinnovo e un business case dietro; il secondo era un backlog, un team e un carico di manutenzione che abbiamo scelto di assumerci. Ho inoltre rilasciato il PIM con un team di sviluppo esterno, che è la terza versione della stessa domanda: comprare il prodotto, costruire il prodotto, o comprare la capacità di costruirlo. Niente di tutto questo mi rende uno specialista di procurement. Significa però che sono stato dal lato che paga il software aziendale, che ho sostenuto un business case per una spesa di quel livello e che poi ho convissuto con le conseguenze quando la risposta era sbagliata — la licenza da cui non esci, lo strumento interno che nessun altro vuole mantenere. Archlet sta costruendo il sistema che rende quelle decisioni leggibili e difendibili invece che istintive. Io so cosa vuol dire prenderle senza.",
      credentials: [
        'Sprinklr — licenza da 1 M€/anno, comprata',
        'adiSCom — costruito internamente al suo posto',
        'PIM — rilasciato con un team di sviluppo esterno',
        'Ecosistema fornitori su oltre 50 team di mercato',
      ],
      closingLine:
        'I vostri clienti stanno cercando di sistematizzare un giudizio che io ho dovuto esprimere di persona, con una frazione delle evidenze e senza alcuno strumento. È un problema di prodotto su cui lavorerei con vero piacere.',
    },
    gap: {
      chip: 'Procurement, con onestà',
      heading:
        'Non ho costruito software di sourcing, e non sono un professionista degli acquisti',
      body: "Preferisco definire la lacuna con precisione invece di sfumarla. Non ho mai rilasciato software di procurement o sourcing. Non ho nel mio percorso strumenti di RFX, ottimizzazione delle offerte o modellazione di scenari di aggiudicazione, e non ho mai ricoperto un ruolo di category management né gestito una gara competitiva come acquirente responsabile. Leggendo il vostro annuncio, il settore è l'unica cosa che non chiedete — ogni requisito elencato è una competenza. Sospetto sia deliberato, perché la competenza di sourcing si impara dai vostri clienti mentre il giudizio di prodotto per lo più no. È questa la scommessa che vi chiederei di fare. In cambio porto nove anni passati a prendere qualcosa di complesso e renderlo utilizzabile per esperti che non avevano alcun obbligo di adottarlo, l'abitudine a misurare se ha funzionato, e sufficiente profondità tecnica per costruire la cosa invece di limitarmi a descriverla. Il settore è un problema da primo trimestre, e preferisco essere giudicato su quanto in fretta lo colmo piuttosto che aggirare la domanda adesso.",
    },
    closing: {
      eyebrow: 'Perché Archlet',
      heading: 'Complesso, poco glamour, e decide dove vanno miliardi',
      body: "Il sourcing è il tipo di problema verso cui torno sempre: poste in gioco alte, disordine strutturale, in mano a esperti che si sono adattati per anni a strumenti scadenti e hanno smesso di aspettarsi di meglio. È la stessa forma della piattaforma interna che ho unificato in adidas, dove mille professionisti avevano costruito in silenzio i propri espedienti attorno a un software che nessuno amava da un decennio. Farlo bene significa soprattutto rispettare come il lavoro viene svolto davvero, e avere la pazienza di guadagnarsi quel rispetto prima di ridisegnare qualcosa. Aggiungete una piattaforma AI-native, un team piccolo con autonomia vera e un prodotto il cui risultato si misura in risparmi e non in engagement, ed è il ruolo di prodotto più interessante che abbia letto quest'anno. Porterei nove anni di giudizio di prodotto, l'abitudine a costruire le cose di persona, e una mappa onesta di ciò che devo ancora imparare.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglese C2 · Tedesco · Italiano B2 · Slovacco',
        'Pronto a trasferirmi a Zurigo',
      ],
      signature:
        'Lukáš Hošala — con base vicino a Firenze, pronto a trasferirmi a Zurigo.',
    },
  },
}
