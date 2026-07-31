/**
 * Rocken — Senior Product Owner (m/w/d), Kriens.
 * German-first: the posting, the customers (cantonal and municipal tax
 * administrations) and the working groups all run in German, so `de` is the
 * default locale and English is the translation rather than the other way round.
 */
export type Locale = 'de' | 'en'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'anforderungen'
    | 'engineering'
    | 'backlog'
    | 'roadmap'
    | 'fachgruppen'
    | 'technik'
    | 'generation'
  /** Short label shown on the card's chip. */
  tag: string
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

export interface RockenContent {
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
    hint: string
    items: RoleMapItem[]
  }
  profileMatchSection: {
    eyebrow: string
    heading: string
    panels: ProfilePanel[]
  }
  spotlight: {
    chip: string
    statusBadge: string
    heading: string
    lede: string
    pillars: { title: string; body: string }[]
    credentials: string[]
    closingLine: string
  }
  gap: { chip: string; heading: string; body: string }
  closing: {
    eyebrow: string
    heading: string
    body: string
    credentials: string[]
    signature: string
  }
}

export const rockenContent: Record<Locale, RockenContent> = {
  de: {
    hero: {
      eyebrow:
        'Rocken · Kriens · Senior Product Owner (m/w/d) — Steuerlösung für Kantone und Gemeinden',
      headlineLead:
        'Anforderungen aus Fachgruppen in klare User Stories zu übersetzen ist die Arbeit, mit der ich angefangen habe.',
      headlineGradient:
        'Zehn Jahre später mache ich sie immer noch am liebsten.',
      description:
        'Ich habe als Product Owner bei adidas begonnen und verantworte heute das Produkt in einer Fintech. Was gleich geblieben ist: Anforderungen von Menschen erheben, die nicht in meinem Team sind, sie strukturieren und so präzise formulieren, dass ein Entwicklungsteam damit bauen kann — zuletzt für über 50 Marktteams und mehr als 1.000 interne Nutzer. Steuerveranlagung ist für mich neu. Fachlich anspruchsvolle Geschäftsprozesse sind es nicht.',
      chips: [
        'Requirements Engineering',
        'User Stories & Backlog',
        'Fachgruppen moderieren',
        'Komplexe Geschäftsprozesse',
        'Umzug nach Kriens/Luzern',
      ],
      stats: [
        { value: '10', label: 'Jahre im Produktmanagement' },
        { value: '50+', label: 'Marktteams als Anforderungsquelle' },
        { value: '1.000+', label: 'Interne Nutzer der Plattform' },
        { value: '100%', label: 'Adoption beim Rollout' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Sieben Aufgaben — und wo ich sie gemacht habe',
      hint: 'Wischen oder Pfeile nutzen',
      items: [
        {
          id: 'anforderungen',
          tag: 'Anforderungen',
          title: 'Erheben und analysieren im Austausch mit Fachbereichen',
          body: 'Bei adidas kam jede Anforderung aus einem anderen Markt, jeder mit eigenen Ausnahmen und guten Gründen dafür. Die Arbeit bestand darin, so lange zuzuhören, bis klar war, warum die bestehende Behelfslösung entstanden ist — erst danach entstehen tragfähige Lösungsvorschläge statt Wunschlisten.',
        },
        {
          id: 'engineering',
          tag: 'Requirements Engineering',
          title: 'Strukturieren und in umsetzbare User Stories überführen',
          body: 'Aus widersprüchlichen Zurufen einen Katalog mit klaren Attributen, Regeln und Ausnahmen zu machen, war der Kern der Produktdaten-Plattform. User Stories mit Akzeptanzkriterien, gegen die ein Team wirklich bauen kann, schreibe ich seit 2016 — als Product Owner angefangen, seither nie ganz aufgehört.',
        },
        {
          id: 'backlog',
          tag: 'Backlog',
          title: 'Pflegen, priorisieren, Verständnis sicherstellen',
          body: 'Ein Backlog ist erst dann gepflegt, wenn das Entwicklungsteam die Priorisierung selbst erklären kann. Ich priorisiere nach expliziten Kriterien statt nach Lautstärke der Stakeholder und mache die Begründung sichtbar — das erspart die Hälfte der Diskussionen im nächsten Refinement.',
        },
        {
          id: 'roadmap',
          tag: 'Roadmap',
          title: 'Release-Planung mit Blick auf Scope, Qualität und Nutzen',
          body: 'Ich habe Releases verantwortet, bei denen ein Fehler für alle sichtbar gewesen wäre, und OKRs an die Führungsebene berichtet, die damit gesteuert hat. Kundennutzen heisst für mich eine Zahl vor dem Bauen zu definieren: Time-to-Market +70%, Adoption 100%, null Ausfallzeit.',
        },
        {
          id: 'fachgruppen',
          tag: 'Fachgruppen',
          title: 'Fachgruppen mit Kundenvertretern leiten und moderieren',
          body: 'Über 50 Marktteams und mehr als 1.000 interne Nutzer, von denen mir niemand unterstellt war, dazu Legal, Procurement und IT bei jedem Rollout. Eine Gruppe zu moderieren, die man nicht anweisen kann, ist eine eigene Fähigkeit — und der Teil dieser Rolle, für den ich die klarsten Belege habe.',
        },
        {
          id: 'technik',
          tag: 'Technisches Verständnis',
          title: 'Anforderungen präzise konkretisieren',
          body: 'Ich schreibe und liefere selbst Code, spezifiziere und nutze APIs und baue eigene Produkte. Das genügt nicht, um Softwarearchitekt zu sein, aber es genügt, um zu hören, wann eine Schätzung in Wahrheit ein Datenmodellproblem ist — und um eine Anforderung so zu formulieren, dass sie nicht dreimal zurückkommt.',
        },
        {
          id: 'generation',
          tag: 'Neue Generation',
          title: 'Eine neue Software-Generation ohne Bruch einführen',
          body: 'Genau das habe ich gemacht: eine stufenweise Migration über drei Länder, null Ausfallzeit, laufender Betrieb für über 165 Millionen Nutzer. Bei einer Ablösung entscheidet nicht die neue Architektur über den Erfolg, sondern die Reihenfolge, die Rückfallebene und die Frage, wer während der Umstellung weiterarbeiten können muss.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Anforderung für Anforderung',
      panels: [
        {
          title: 'Qualifikationen',
          rows: [
            {
              requirement:
                'Mehrjährige Berufserfahrung als Product Owner, Business Analyst oder in ähnlicher Rolle in Softwareprojekten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Zehn Jahre, angefangen als Product Owner bei adidas 2016 (vom Praktikanten zum PO in 18 Monaten), danach Product Manager, Senior Product Manager und heute Head of Product. Durchgehend in Softwareprojekten mit internen und externen Entwicklungsteams.',
            },
            {
              requirement:
                'Sichere Kommunikation mit Kunden, Fachbereichen und Entwicklungsteams',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre zwischen Fachbereichen und Entwicklung: Spezifikationen, gegen die Entwickler bauen können, und Business Cases, die Führungskräfte finanzieren. Bei adidas über 50 Marktteams sowie Legal, Procurement und IT.',
            },
            {
              requirement:
                'Anforderungen dank sehr gutem technischem Verständnis präzise konkretisieren',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich schreibe und liefere selbst Code, spezifiziere und konsumiere APIs und habe den Front-End-Neuaufbau einer Plattform mit 165 Mio. Nutzern geleitet statt beauftragt. Diese Website samt Datenbank und Auswertung ist ebenfalls meine.',
            },
            {
              requirement:
                'Strukturierte Arbeitsweise, klare Prioritäten, Qualitätsanspruch, Eigenverantwortung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Priorisierung nach expliziten Kriterien statt nach Lautstärke, mit sichtbarer Begründung. Qualität heisst bei mir messen statt hoffen: null Ausfallzeit bei der Migration, 100% Adoption beim Rollout.',
            },
            {
              requirement:
                'Fundierte Kenntnisse in fachlich anspruchsvollen Geschäftsprozessen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Produktdaten-Lebenszyklus über 50+ Märkte mit Regeln, Ausnahmen und Freigaben; Integration von Unternehmenssystemen; heute eine Handelsplattform, auf der Privatanleger eigenes Kapital einsetzen. Prozesse mit vielen Sonderfällen sind mein Normalfall.',
            },
            {
              requirement:
                'Deutsch als Arbeitssprache in Kundenprojekten der öffentlichen Hand',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Deutsch gehört zu meinen Arbeitssprachen (Englisch C2, Deutsch, Italienisch B2, Slowakisch) — deshalb ist diese Seite zuerst auf Deutsch. Bei Feinheiten der Amtssprache in Kantonsprojekten würde ich anfangs mehr nachfragen als ein Muttersprachler.',
            },
            {
              requirement:
                'Höherer Abschluss in Wirtschaftsinformatik, Informatik oder vergleichbar (FH/HF/Uni)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Auf dem Papier nicht. Meine Abschlüsse sind ein BSc in Sportmanagement und ein CMI Level 7 Diploma in Strategic Management auf MBA-Niveau. Das technische Verständnis, das der Abschluss belegen soll, kommt bei mir aus zehn Jahren Praxis und eigener Entwicklungsarbeit.',
            },
            {
              requirement:
                'Fundierte Kenntnisse in Steuerveranlagung oder öffentlicher Verwaltung',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Keine. Ich habe weder in der Steuerdomäne noch für eine öffentliche Verwaltung gearbeitet. Das ist der Teil, den ich von Ihren Fachgruppen und Kundenvertretern lernen müsste — mit vielen Fragen und ohne so zu tun, als wäre es schnell erledigt.',
            },
          ],
        },
        {
          title: 'Kontext & Praktisches',
          rows: [
            {
              requirement:
                'Fachgruppen mit Kundenvertretern leiten und moderieren',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Der Teil mit meiner klarsten Bilanz: Gruppen ohne Weisungsbefugnis zu einem gemeinsamen Standard bringen. 50+ Marktteams, die hätten ablehnen können — und einige taten es zunächst.',
            },
            {
              requirement:
                'Mitwirkung an Roadmap- und Releaseplanung, Scope und Qualität im Blick',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Roadmaps, Releases und OKRs an eine Führungsebene berichtet, die damit gesteuert hat. Time-to-Market +70%, Ladezeit −55%, null Ausfallzeit bei laufendem Betrieb.',
            },
            {
              requirement:
                'Zusammenarbeit mit Projektleitung, Delivery und Entwicklung im agilen Team',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Agile Zusammenarbeit über drei Zeitzonen mit internen Teams und externen Dienstleistern, inklusive Backlog, Refinement, Sprintplanung und Abnahme.',
            },
            {
              requirement:
                'Ablösung durch eine neue Software-Generation begleiten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Eine stufenweise Migration über drei Länder mit Testphasen und Rückfallebene je Schritt, null Ausfallzeit für über 165 Mio. Nutzer. Bei Ablösungen entscheidet die Reihenfolge, nicht die Architektur.',
            },
            {
              requirement:
                'Kantone, Gemeinden und Städte als Kunden — öffentliche Verwaltung',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Neu für mich. Meine Kunden waren interne Fachbereiche und Marktteams eines Konzerns, keine Verwaltungen mit gesetzlichen Fristen, politischen Zyklen und Rechenschaftspflicht gegenüber der Öffentlichkeit.',
            },
            {
              requirement: 'Steuerregister, Veranlagung, Wertschriften',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Die Domäne kenne ich nicht. Was ich mitbringe, ist Erfahrung damit, mir eine fremde Fachlogik schnell und gründlich anzueignen — und die Disziplin, sie nicht zu vereinfachen, bevor ich sie verstanden habe.',
            },
            {
              requirement: 'Arbeitsort Kriens, 80–100%, Festanstellung',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Noch nicht vor Ort: Ich lebe in Italien und würde für diese Rolle in die Region Luzern ziehen. Als EU-Bürger ist der Bewilligungsweg der übliche und keine Arbeitgeber-Sponsorschaft — aber heute halte ich keine Schweizer Bewilligung, und das gehört gesagt.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Der nächstliegende Präzedenzfall',
      statusBadge: 'adidas — Produktdaten-Plattform, 50+ Marktteams',
      heading:
        'Fünfzig Fachbereiche, fünfzig Wahrheiten — und am Ende ein Standard, den alle genutzt haben.',
      lede: 'Bei adidas lagen Produktdaten in Tabellen, die einander widersprachen, und jeder Markt hatte gute Gründe für seine Ausnahme. Vier Dinge daraus sind der Grund, warum ich mich auf diese Rolle bewerbe.',
      pillars: [
        {
          title: 'Erst verstehen, warum es so ist',
          body: 'Die Discovery bestand darin, bei den Märkten zu sitzen, bis klar war, warum jeder seine eigene Behelfslösung gebaut hatte. Ein Datenmodell ohne diesen Kontext wird umgangen statt genutzt.',
        },
        {
          title: 'Regeln statt Wunschlisten',
          body: 'Aus widersprüchlichen Anforderungen wurden Kataloge, Attribute und Ausnahmen mit klaren Regeln — dokumentiert, prüfbar und in User Stories überführt, gegen die gebaut werden konnte.',
        },
        {
          title: 'Qualität war der ganze Zweck',
          body: 'Falsche Produktdaten erreichen den Kunden direkt. Deshalb wurde vor dem Bauen definiert, was Erfolg heisst: Time-to-Market +70%, Adoption 100% über 50+ Marktteams.',
        },
        {
          title: 'Angenommen, nicht angeordnet',
          body: 'Schulung und Dokumentation kamen mit der Lösung statt danach. Später habe ich eine kaum genutzte Plattform um die tatsächlichen Arbeitsabläufe herum neu positioniert und 30 Punkte Nutzung zurückgewonnen.',
        },
      ],
      credentials: [
        'Product Owner seit 2016',
        'PIM — Kataloge & Attribute, 50+ Märkte',
        'Migration über 3 Länder, null Ausfallzeit',
        'Interne Plattform für 1.000+ Nutzer',
      ],
      closingLine:
        'Steuerveranlagung ist eine andere Fachlogik als Produktdaten. Die Arbeit davor — zuhören, strukturieren, präzise formulieren, priorisieren — ist dieselbe.',
    },
    gap: {
      chip: 'Was mir fehlt',
      heading: 'Die Steuerdomäne und ein Informatik-Abschluss.',
      body: 'Zwei Ihrer Anforderungen erfülle ich nicht. Ich habe keinen höheren Abschluss in Wirtschaftsinformatik oder Informatik — mein Weg führte über Sportmanagement und ein CMI Level 7 Diploma, und das technische Verständnis kommt aus der Praxis statt aus dem Studium. Und ich kenne weder Steuerveranlagung noch die öffentliche Verwaltung; das steht bei Ihnen als «idealerweise», und ich will es nicht grösser reden, als es ist. Dem gegenüber steht der Rest der Ausschreibung: Anforderungen erheben, strukturieren, in User Stories überführen, ein Backlog priorisieren und Fachgruppen moderieren, die einem nicht unterstellt sind. Das ist die Arbeit, mit der ich 2016 angefangen habe und die ich seither in jeder Rolle gemacht habe.',
    },
    closing: {
      eyebrow: 'Warum diese Rolle',
      heading:
        'Eine neue Software-Generation für ein Produkt, das jahrzehntelang benutzt wird',
      body: 'Software für Steuerverwaltungen wird nicht quartalsweise ersetzt. Sie muss über Jahre stimmen, für Menschen, die sie nicht ausgesucht haben und nicht ausweichen können — und genau deshalb interessiert mich die Rolle. Zur Offenheit gehört auch: Ich bin heute Head of Product und bewerbe mich auf eine Senior-Product-Owner-Stelle. Das ist Absicht. Die Arbeit, die ich am liebsten mache, ist die am Anforderungs- und Backlog-Ende, und dieses Produkt verbindet sie mit einer fachlichen Tiefe, die man sich erarbeiten muss. Dazu ein Umzug in die Schweiz, den ich ohnehin plane. Was Sie an Steuerwissen einbringen, bringe ich an Handwerk mit — und ich lerne die Fachlogik schneller, als jemand mit Steuerwissen dieses Handwerk lernt.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Deutsch · Italienisch B2 · Slowakisch',
        'Head of Product, Fintech für algorithmischen Handel',
      ],
      signature:
        'Lukáš Hošala — Product Owner seit 2016, und am liebsten immer noch nah an den Anforderungen.',
    },
  },

  en: {
    hero: {
      eyebrow:
        'Rocken · Kriens · Senior Product Owner — tax solution for cantons and municipalities',
      headlineLead:
        'Turning requirements from working groups into clear user stories is the job I started in.',
      headlineGradient: 'Ten years on, it is still the part I like most.',
      description:
        'I began as a Product Owner at adidas and now run product at a fintech. What has not changed: gathering requirements from people who are not on my team, structuring them, and phrasing them precisely enough for a development team to build against — most recently for 50+ market teams and over 1,000 internal users. Tax assessment is new to me. Demanding business processes are not.',
      chips: [
        'Requirements engineering',
        'User stories & backlog',
        'Moderating working groups',
        'Complex business processes',
        'Relocating to Kriens/Lucerne',
      ],
      stats: [
        { value: '10', label: 'Years in product management' },
        { value: '50+', label: 'Market teams as requirement sources' },
        { value: '1,000+', label: 'Internal users of the platform' },
        { value: '100%', label: 'Adoption at rollout' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: 'Seven tasks — and where I have done them',
      hint: 'Swipe or use the arrows',
      items: [
        {
          id: 'anforderungen',
          tag: 'Requirements',
          title: 'Gathering and analysing with customers and departments',
          body: 'At adidas every requirement came from a different market, each with its own exceptions and good reasons for them. The work was listening until it was clear why the existing workaround had been built — only then do viable proposals appear instead of wish lists.',
        },
        {
          id: 'engineering',
          tag: 'Requirements engineering',
          title: 'Structuring them into executable user stories',
          body: 'Turning contradictory input into a catalog with clear attributes, rules and exceptions was the core of the product-data platform. I have been writing user stories with acceptance criteria a team can genuinely build against since 2016 — I started as a Product Owner and never fully stopped.',
        },
        {
          id: 'backlog',
          tag: 'Backlog',
          title: 'Maintaining, prioritising, making it understood',
          body: 'A backlog is only maintained once the development team can explain the prioritisation themselves. I prioritise against explicit criteria rather than stakeholder volume and keep the reasoning visible — which removes half the discussion at the next refinement.',
        },
        {
          id: 'roadmap',
          tag: 'Roadmap',
          title: 'Release planning with scope, quality and customer value',
          body: 'I have owned releases where a mistake would have been visible to everyone, and reported OKRs to executives who steered with them. Customer value means defining a number before building: +70% speed to market, 100% adoption, zero downtime.',
        },
        {
          id: 'fachgruppen',
          tag: 'Working groups',
          title: 'Leading and moderating groups with customer representatives',
          body: 'More than 50 market teams and over 1,000 internal users, none of whom reported to me, plus legal, procurement and IT on every rollout. Moderating a group you cannot instruct is a specific skill — and the part of this role I have the clearest evidence for.',
        },
        {
          id: 'technik',
          tag: 'Technical understanding',
          title: 'Specifying requirements precisely',
          body: 'I write and ship code, specify and consume APIs, and build my own products. Not enough to be a software architect, but enough to hear when an estimate is really a data-model problem — and to phrase a requirement so it does not come back three times.',
        },
        {
          id: 'generation',
          tag: 'New generation',
          title: 'Introducing a new software generation without a break',
          body: 'Exactly what I have done: a staged migration across three countries, zero downtime, service running throughout for 165M+ users. In a replacement programme success is decided by sequencing and fallback plans, not by the new architecture.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: 'Requirement by requirement',
      panels: [
        {
          title: 'Qualifications',
          rows: [
            {
              requirement:
                'Several years as Product Owner, Business Analyst or similar in software projects',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Ten years, starting as Product Owner at adidas in 2016 (intern to PO in 18 months), then Product Manager, Senior Product Manager and today Head of Product — continuously in software projects with in-house and external development teams.',
            },
            {
              requirement:
                'Confident communication with customers, departments and development teams',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years between business and engineering: specifications developers can build against, and business cases executives will fund. At adidas that meant 50+ market teams plus legal, procurement and IT.',
            },
            {
              requirement:
                'Precise specification of requirements through strong technical understanding',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I write and ship code, specify and consume APIs, and led rather than commissioned the front-end rebuild of a platform used by 165M people. This site, including its database and analytics, is mine too.',
            },
            {
              requirement:
                'Structured approach, clear prioritisation, quality focus, independent accountability',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Prioritisation against explicit criteria rather than stakeholder volume, with the reasoning visible. Quality means measuring rather than hoping: zero downtime through a migration, 100% adoption at rollout.',
            },
            {
              requirement: 'Solid grounding in demanding business processes',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A product-data lifecycle across 50+ markets with rules, exceptions and approvals; enterprise system integration; and today a trading platform where retail investors commit their own capital. Processes full of special cases are my normal.',
            },
            {
              requirement:
                'German as the working language in public-sector customer projects',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'German is among my working languages (English C2, German, Italian B2, Slovak) — which is why this page opens in German. On the finer points of official language in cantonal projects I would ask more questions than a native speaker at first.',
            },
            {
              requirement:
                'Higher degree in business informatics, computer science or equivalent (FH/HF/Uni)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Not on paper. My degrees are a BSc in Sport Management and a CMI Level 7 Diploma in Strategic Management at MBA level. The technical understanding the degree is meant to evidence comes from ten years of practice and building software myself.',
            },
            {
              requirement:
                'Solid knowledge of tax assessment or public administration',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'None. I have worked neither in the tax domain nor for a public administration. That is what I would be learning from your working groups and customer representatives — with a lot of questions, and without pretending it is quick.',
            },
          ],
        },
        {
          title: 'Context & practicalities',
          rows: [
            {
              requirement:
                'Leading and moderating working groups with customer representatives',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The part with my clearest record: bringing groups to a shared standard without authority over them. 50+ market teams could have refused, and some did at first.',
            },
            {
              requirement:
                'Contributing to roadmap and release planning, watching scope and quality',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Roadmaps, releases and OKRs reported to executives who steered with them. +70% speed to market, −55% page load, zero downtime with the service live throughout.',
            },
            {
              requirement:
                'Working with project management, delivery and development in an agile team',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Agile delivery across three time zones with in-house teams and external suppliers, including backlog, refinement, sprint planning and acceptance.',
            },
            {
              requirement: 'Supporting a move to a new software generation',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A staged migration across three countries with test phases and a fallback at every step, zero downtime for 165M+ users. In replacements, sequencing decides the outcome, not architecture.',
            },
            {
              requirement:
                'Cantons, municipalities and cities as customers — public administration',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'New to me. My customers were internal departments and market teams inside a corporation, not administrations with statutory deadlines, political cycles and public accountability.',
            },
            {
              requirement: 'Tax register, assessment, securities',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I do not know the domain. What I bring is experience in learning an unfamiliar body of rules quickly and thoroughly — and the discipline not to simplify it before I understand it.',
            },
            {
              requirement: 'Based in Kriens, 80–100%, permanent',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Not there yet: I live in Italy and would relocate to the Lucerne region for this role. As an EU national the permit route is the standard one rather than employer sponsorship — but I hold no Swiss permit today, and that should be said.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The closest precedent',
      statusBadge: 'adidas — product-data platform, 50+ market teams',
      heading:
        'Fifty departments, fifty versions of the truth — and in the end one standard everybody used.',
      lede: 'At adidas product data lived in spreadsheets that contradicted each other, and every market had good reasons for its exception. Four things from that work are why I am applying for this role.',
      pillars: [
        {
          title: 'First understand why it is like this',
          body: 'Discovery meant sitting with the markets until it was clear why each had built its own workaround. A data model without that context gets worked around rather than adopted.',
        },
        {
          title: 'Rules, not wish lists',
          body: 'Contradictory requirements became catalogs, attributes and exceptions with clear rules — documented, checkable, and turned into user stories that could be built against.',
        },
        {
          title: 'Quality was the whole point',
          body: 'Wrong product data reaches the customer directly. So what success meant was defined before building: +70% speed to market, 100% adoption across 50+ market teams.',
        },
        {
          title: 'Adopted, not mandated',
          body: 'Training and documentation shipped with the solution rather than after it. Later I repositioned a barely used platform around the workflows teams actually ran and recovered 30 points of usage.',
        },
      ],
      credentials: [
        'Product Owner since 2016',
        'PIM — catalogs & attributes, 50+ markets',
        'Migration across 3 countries, zero downtime',
        'Internal platform for 1,000+ users',
      ],
      closingLine:
        'Tax assessment is a different body of rules from product data. The work in front of it — listening, structuring, specifying precisely, prioritising — is the same.',
    },
    gap: {
      chip: 'What I am missing',
      heading: 'The tax domain and a computer science degree.',
      body: 'Two of your requirements I do not meet. I hold no higher degree in business informatics or computer science — my route ran through sport management and a CMI Level 7 Diploma, and the technical understanding comes from practice rather than study. And I know neither tax assessment nor public administration; you list it as "ideally", and I will not make it sound larger than it is. Against that stands the rest of the posting: gathering requirements, structuring them, turning them into user stories, prioritising a backlog and moderating working groups you have no authority over. That is the work I started doing in 2016 and have done in every role since.',
    },
    closing: {
      eyebrow: 'Why this role',
      heading:
        'A new software generation for a product that will be used for decades',
      body: 'Software for tax administrations is not replaced every quarter. It has to be right for years, for people who did not choose it and cannot avoid it — which is exactly why the role interests me. Candour requires one more thing: I am currently Head of Product and applying for a Senior Product Owner position. That is deliberate. The work I enjoy most sits at the requirements and backlog end, and this product pairs it with domain depth that has to be earned. Add a move to Switzerland I am planning anyway. What you bring in tax knowledge, I bring in craft — and I will learn the domain faster than someone with tax knowledge learns the craft.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · German · Italian B2 · Slovak',
        'Head of Product, algorithmic trading fintech',
      ],
      signature:
        'Lukáš Hošala — Product Owner since 2016, and still happiest close to the requirements.',
    },
  },
}
