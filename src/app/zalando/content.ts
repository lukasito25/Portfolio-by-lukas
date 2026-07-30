export type Locale = 'en' | 'de'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'aiplatform'
    | 'horizontal'
    | 'infra'
    | 'ecosystem'
    | 'techauthority'
    | 'executive'
    | 'mentorship'
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

export interface ZalandoContent {
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
  /** Standout credential — the orchestration layer, broken into scannable pillars. */
  spotlight: {
    chip: string
    statusBadge: string
    heading: string
    lede: string
    pillars: { title: string; body: string }[]
    credentials: string[]
    closingLine: string
  }
  /** The one area that is genuinely new, stated once and without ceremony. */
  gap: { chip: string; heading: string; body: string }
  closing: {
    eyebrow: string
    heading: string
    body: string
    credentials: string[]
    signature: string
  }
}

export const zalandoContent: Record<Locale, ZalandoContent> = {
  en: {
    hero: {
      eyebrow:
        'Zalando · Partner Tech · Senior Principal Product Manager — Partner Experience & AI Platform',
      headlineLead:
        'You are hiring someone to turn AI experiments into platform infrastructure.',
      headlineGradient: 'I built mine because I needed it, and it runs daily.',
      description:
        'Ten years in product. Eight at adidas owning the internal platforms other teams ran on — article data for 50+ market teams, one application for 1,000+ colleagues. Alongside that, an agent orchestration layer of my own: routing by role, versioned agent definitions, verification, human gates.',
      chips: [
        'LLM orchestration',
        'Agentic frameworks',
        'Platforms other teams run on',
        'Consumer craft at 165M+ scale',
        'Relocating to Berlin',
      ],
      stats: [
        { value: '10', label: 'Years in product management' },
        { value: '1,000+', label: 'Colleagues on the platform I owned' },
        { value: '50+', label: 'Market teams onboarded to one standard' },
        { value: '165M+', label: 'Users on the consumer platform I owned' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The mandate, mapped',
      heading: 'Seven asks, and the evidence behind each',
      hint: 'Swipe or use the arrows',
      items: [
        {
          id: 'aiplatform',
          tag: 'AI platform',
          title: 'Strategy and orchestration',
          body: 'I run my own orchestration layer daily: work routed by role and cost across several models, versioned agent definitions, and a verification pass before anything is trusted. Plus a five-agent Python suite on Vertex AI and a Gemini service behind a paid product.',
        },
        {
          id: 'horizontal',
          tag: 'Horizontal',
          title: 'Stewardship across a fragmented journey',
          body: "Friction between systems is nobody's job, which is why it survives. At adidas I built the sanctioned layer beneath dozens of disconnected tools and ran the full article-data lifecycle for 50+ market teams — then kept it correct as assortments changed.",
        },
        {
          id: 'infra',
          tag: 'Infrastructure',
          title: 'Central foundations and a design system',
          body: 'The adidas admin application consolidated scattered tooling for 1,000+ colleagues across business units — shared foundations, each unit moving at its own pace. This site runs on a token-based design system I built and maintain.',
        },
        {
          id: 'ecosystem',
          tag: 'Ecosystem',
          title: 'APIs, extensibility and integration',
          body: 'I have specified, consumed and integrated enterprise APIs for years — Sprinklr, Meta and Instagram catalogs, PIM feeds — and build on serverless platforms in my own products. Owning an API whose customers are external developers would be new.',
        },
        {
          id: 'techauthority',
          tag: 'Technical',
          title: 'Sparring with Principal Engineers',
          body: 'I write and ship code, so engineers get requirements with the constraints already thought through, and I can hear when an estimate is really a data-model problem. On distributed architecture I bring good questions rather than equal authority.',
        },
        {
          id: 'executive',
          tag: 'Executive',
          title: 'Trade-offs as business narratives',
          body: 'I argued for, won and then justified a €1M annual platform licence, made the build-versus-buy call against an in-house alternative, and reported OKRs to executives who steered with them rather than filed them.',
        },
        {
          id: 'mentorship',
          tag: 'Craft',
          title: 'Coaching product colleagues',
          body: 'Led 13 people across three countries and came up that path myself — intern to Product Owner in 18 months. Craft leadership is mostly showing your working: the reasoning behind a call travels further than the call.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: 'Requirement by requirement',
      panels: [
        {
          title: 'The role',
          rows: [
            {
              requirement:
                '10+ years in high-scale platforms, SaaS or marketplaces',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Ten years, Product Owner in 2016 to Head of Product now — a consumer platform at 165M+ users and internal platforms serving 1,000+ colleagues and 50+ market teams.',
            },
            {
              requirement:
                'Deep fluency in the GenAI stack — LLM orchestration and agentic workflows',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Built, not surveyed: multi-model routing by role, versioned agent definitions, separated state and context, a verification pass. Plus a five-agent Vertex AI suite and daily delivery using agentic coding tools.',
            },
            {
              requirement:
                'Moving from AI experimentation to production-grade automation',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Mine is not a notebook — it runs on a schedule, logs, heals itself, verifies its own output and stops at defined human gates. Reliability came from routing and guardrails, not better prompts.',
            },
            {
              requirement:
                'Alignment across complex organisations without line authority',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                '50+ market teams could have refused, and some did at first. Full adoption came from enablement; a €1M platform people had abandoned recovered 30 points of usage the same way.',
            },
            {
              requirement:
                'Enterprise software as intuitive as B2C — and the craft to deliver it',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'My actual career shape: eight years in a consumer organisation at 165M+ scale, including a rebuild that cut page-load 55%, then the same bar applied to internal tooling most companies leave ugly.',
            },
            {
              requirement: 'Coaching and developing product colleagues',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                '13 people across three countries, product colleagues mentored, and intern to Product Owner in 18 months myself.',
            },
            {
              requirement: 'Based in Berlin or Helsinki',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Berlin, and I would relocate. EU national, so no visa or sponsorship question — only a move I am ready to make.',
            },
            {
              requirement:
                'APIs-as-products and developer experience as a surface you own',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Years of specifying, consuming and integrating APIs, and building on serverless platforms — but not an API whose customers were external developers. The extensibility instinct transfers; the DX craft I would pick up here.',
            },
            {
              requirement: 'RAG patterns within the AI platform',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'The one genuinely new area: orchestration and agentic patterns I have built, retrieval I have not. See the note below.',
            },
          ],
        },
        {
          title: 'Scale & domain',
          rows: [
            {
              requirement:
                'Article lifecycle, partner onboarding and assortment data',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The closest precedent I have: article data collected from source systems, standardised into catalogs and attributes, syndicated to channels and 50+ market teams, kept correct as assortments changed. Speed to market +70%, adoption 100%.',
            },
            {
              requirement:
                'Platforms whose customers are other teams, not end consumers',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Both platforms I owned at adidas were exactly that — 50+ market teams and 1,000+ colleagues across separate business units, with the onboarding, support load, compatibility expectations and migrations that come with real tenants.',
            },
            {
              requirement: 'Building and operating AI automation personally',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Three distinct systems rather than one repeated: an orchestration layer with agent definitions and verification, a Vertex AI agent suite, and a Python/FastAPI service on Gemini behind a paid product.',
            },
            {
              requirement: 'Working across multiple European locations',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years across three countries, with rollouts reaching Colombia, the Netherlands and Germany. Distributed working is my normal.',
            },
            {
              requirement:
                'An AI platform with internal product teams as its tenants',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My platform tenancy experience comes from data and tooling platforms rather than the AI layer, which today serves my own products. The patterns carry over — routing, guardrails, reusable definitions, human gates — and so does knowing what tenants expect.',
            },
            {
              requirement:
                'Marketplace serving thousands of external brand partners',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I come from the brand side of retail. My teams were internal, and internal users cannot take their business elsewhere — a difference in accountability I would treat seriously rather than gloss.',
            },
            {
              requirement:
                'An enterprise design system adopted across many applications',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I built and maintain a token-based system with per-page overrides for this site. Versioning and contribution governance across many consuming applications is a larger problem.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The orchestration layer',
      statusBadge: 'Running daily · human gates · self-verifying',
      heading:
        'I did not read about LLM orchestration. I built the layer I needed and I run it every day.',
      lede: 'FounderOS is a terminal-first system I built to run several AI products at once. Four decisions in it are the reason I am applying — each one cost me a mistake first.',
      pillars: [
        {
          title: 'Route by role, not to one model',
          body: 'A coding agent builds, a local model reviews, Gemini specialists take the rest. Cost, latency and trust differ per task; platforms that ignore that get expensive fast.',
        },
        {
          title: 'Agent definitions are versioned files',
          body: 'Architect, backend, frontend, product, QA, review, release — each a reviewable file rather than a prompt buried in code, so behaviour changes deliberately.',
        },
        {
          title: 'Verification is its own concern',
          body: 'Orchestrator, context, state and secrets are separated, with a self-healing pass before the daily briefing. An agent system without verification is a demo that has not failed yet.',
        },
        {
          title: 'Two gates stay human',
          body: 'It runs on a schedule and stops at exactly two decisions. Choosing which calls never automate is the design work; the rest is plumbing.',
        },
      ],
      credentials: [
        'FounderOS — orchestrator, agent specs, verification',
        'StagStrat — 5-agent Python suite on Vertex AI',
        'FastAPI + Gemini behind a paid product',
        'adidas PIM — 50+ market teams, 100% adoption',
      ],
      closingLine:
        'The older half of my case is bigger: the platforms 1,000+ colleagues and 50+ market teams actually ran on, adopted without a mandate.',
    },
    gap: {
      chip: 'What I would be learning',
      heading: 'Retrieval is the genuinely new part.',
      body: 'Your posting names RAG alongside orchestration and agentic frameworks. Two of those three I have built and operate; retrieval I have not — no embeddings, no vector store, no evaluation of retrieval quality. I would be learning that from your engineers rather than teaching it, and I would rather say so plainly than discover it in the first sprint. Everything else in this mandate I have done, at organisational scale, with the numbers attached.',
    },
    closing: {
      eyebrow: 'Why this role',
      heading:
        'Partner-facing software is where most marketplaces quietly give up on craft',
      body: 'The line about enterprise software deserving to be as intuitive as B2C is why I read the rest of the posting. Most companies accept that partner tooling will be worse than what they ship to consumers, and the cost never appears on a dashboard — it shows up as partners working around the system and data going stale. I have worked both sides of that line: consumer products at 165M+ users, then internal platforms where I refused to lower the bar, which is the only reason adoption held. Putting an AI platform underneath that is the interesting part, because the hard question is not which model to use. It is which decisions stay human, and what happens when the automation is wrong in front of a partner.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · German · Italian B2 · Slovak',
        'Head of Product, algorithmic trading fintech',
      ],
      signature:
        'Lukáš Hošala — ten years in product; the orchestration layer is mine and it runs tonight.',
    },
  },

  de: {
    hero: {
      eyebrow:
        'Zalando · Partner Tech · Senior Principal Product Manager — Partner Experience & AI Platform',
      headlineLead:
        'Sie suchen jemanden, der KI-Experimente in Plattform-Infrastruktur verwandelt.',
      headlineGradient:
        'Meine habe ich gebaut, weil ich sie brauchte — und sie läuft täglich.',
      description:
        'Zehn Jahre im Produkt. Acht bei adidas mit Verantwortung für die internen Plattformen, auf denen andere Teams arbeiteten — Artikeldaten für über 50 Marktteams, eine Anwendung für mehr als 1.000 Kolleginnen und Kollegen. Daneben eine eigene Agenten-Orchestrierung: Routing nach Rolle, versionierte Agentendefinitionen, Verifikation, menschliche Entscheidungspunkte.',
      chips: [
        'LLM-Orchestrierung',
        'Agentische Frameworks',
        'Plattformen für andere Teams',
        'Consumer-Handwerk mit 165M+',
        'Umzug nach Berlin',
      ],
      stats: [
        { value: '10', label: 'Jahre im Produktmanagement' },
        {
          value: '1.000+',
          label: 'Kollegen auf der Plattform, die ich verantwortete',
        },
        { value: '50+', label: 'Marktteams auf einen Standard gebracht' },
        {
          value: '165M+',
          label: 'Nutzer auf der Consumer-Plattform, die ich verantwortete',
        },
      ],
    },
    roleMapSection: {
      eyebrow: 'Das Mandat, im Detail',
      heading: 'Sieben Anforderungen und die Belege dahinter',
      hint: 'Wischen oder Pfeile nutzen',
      items: [
        {
          id: 'aiplatform',
          tag: 'KI-Plattform',
          title: 'Strategie und Orchestrierung',
          body: 'Ich betreibe meine eigene Orchestrierungsschicht täglich: Arbeit nach Rolle und Kosten über mehrere Modelle geroutet, versionierte Agentendefinitionen und ein Verifikationsdurchlauf, bevor etwas vertraut wird. Dazu eine Fünf-Agenten-Suite in Python auf Vertex AI und ein Gemini-Dienst hinter einem bezahlten Produkt.',
        },
        {
          id: 'horizontal',
          tag: 'Horizontal',
          title: 'Verantwortung über eine fragmentierte Journey',
          body: 'Reibung zwischen Systemen ist niemandes Aufgabe — deshalb überlebt sie. Bei adidas habe ich die sanktionierte Schicht unter Dutzenden unverbundener Werkzeuge gebaut und den vollen Artikeldaten-Lebenszyklus für über 50 Marktteams verantwortet — und korrekt gehalten, während sich Sortimente änderten.',
        },
        {
          id: 'infra',
          tag: 'Infrastruktur',
          title: 'Zentrale Grundlagen und ein Designsystem',
          body: 'Die adidas-Admin-Anwendung konsolidierte verstreutes Tooling für mehr als 1.000 Kollegen über Geschäftsbereiche hinweg — gemeinsame Grundlagen, jeder Bereich in seinem Tempo. Diese Website läuft auf einem token-basierten Designsystem, das ich gebaut habe und pflege.',
        },
        {
          id: 'ecosystem',
          tag: 'Ökosystem',
          title: 'APIs, Erweiterbarkeit und Integration',
          body: 'Ich habe jahrelang Unternehmens-APIs spezifiziert, genutzt und integriert — Sprinklr, Meta- und Instagram-Kataloge, PIM-Feeds — und baue in eigenen Produkten auf Serverless-Plattformen. Eine API zu verantworten, deren Kunden externe Entwickler sind, wäre neu.',
        },
        {
          id: 'techauthority',
          tag: 'Technik',
          title: 'Sparren mit Principal Engineers',
          body: 'Ich schreibe und liefere Code, deshalb bekommen Entwickler Anforderungen mit durchdachten Randbedingungen, und ich höre, wann eine Schätzung ein Datenmodellproblem ist. Bei verteilter Architektur bringe ich gute Fragen mit, keine gleichrangige Autorität.',
        },
        {
          id: 'executive',
          tag: 'Führungsebene',
          title: 'Abwägungen als Business-Narrativ',
          body: 'Ich habe eine Jahreslizenz über 1 Mio. € begründet, durchgesetzt und anschließend gerechtfertigt, die Make-or-Buy-Entscheidung gegen eine eigene Lösung getroffen und OKRs an Führungskräfte berichtet, die damit gesteuert und sie nicht abgelegt haben.',
        },
        {
          id: 'mentorship',
          tag: 'Handwerk',
          title: 'Produktkollegen coachen',
          body: '13 Personen in drei Ländern geführt und selbst diesen Weg gegangen — vom Praktikanten zum Product Owner in 18 Monaten. Craft-Leadership heißt vor allem, die eigene Arbeit offenzulegen: Die Begründung trägt weiter als die Entscheidung.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Anforderung für Anforderung',
      panels: [
        {
          title: 'Die Rolle',
          rows: [
            {
              requirement:
                'Mindestens 10 Jahre mit skalierenden Plattformen, SaaS oder Marktplätzen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Zehn Jahre, vom Product Owner 2016 bis heute Head of Product — eine Consumer-Plattform mit über 165 Mio. Nutzern und interne Plattformen für 1.000+ Kollegen und 50+ Marktteams.',
            },
            {
              requirement:
                'Tiefe Vertrautheit mit dem GenAI-Stack — LLM-Orchestrierung und agentische Workflows',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Gebaut, nicht recherchiert: rollenbasiertes Routing über mehrere Modelle, versionierte Agentendefinitionen, getrennter State und Kontext, ein Verifikationsdurchlauf. Dazu eine Fünf-Agenten-Suite auf Vertex AI und täglicher Einsatz agentischer Coding-Werkzeuge.',
            },
            {
              requirement:
                'Von KI-Experimenten zu produktionsreifer Automatisierung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Meine ist kein Notebook — sie läuft geplant, protokolliert, heilt sich selbst, verifiziert ihre Ausgaben und hält an definierten menschlichen Entscheidungspunkten. Verlässlichkeit kam aus Routing und Leitplanken, nicht aus besseren Prompts.',
            },
            {
              requirement:
                'Ausrichtung in komplexen Organisationen ohne Weisungsbefugnis',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                '50+ Marktteams hätten ablehnen können, und einige taten es zunächst. Volle Adoption kam über Enablement; eine aufgegebene 1-Mio.-€-Plattform gewann so 30 Punkte Nutzung zurück.',
            },
            {
              requirement:
                'Unternehmenssoftware so intuitiv wie B2C — und das Handwerk dafür',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Meine Berufsbiografie: acht Jahre in einer Consumer-Organisation mit über 165 Mio. Nutzern, inklusive eines Neuaufbaus, der die Ladezeit um 55% senkte, dann derselbe Anspruch an internes Tooling, das die meisten hässlich lassen.',
            },
            {
              requirement: 'Produktkollegen coachen und entwickeln',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                '13 Personen in drei Ländern, begleitete Produktkollegen und selbst in 18 Monaten vom Praktikanten zum Product Owner.',
            },
            {
              requirement: 'Standort Berlin oder Helsinki',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Berlin, und ich würde umziehen. Als EU-Bürger keine Visums- oder Sponsoring-Frage — nur ein Umzug, zu dem ich bereit bin.',
            },
            {
              requirement:
                'APIs als Produkt und Developer Experience als eigene Fläche',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Jahrelang APIs spezifiziert, genutzt und integriert und auf Serverless-Plattformen gebaut — aber keine API verantwortet, deren Kunden externe Entwickler waren. Das Gespür für Erweiterbarkeit überträgt sich; das DX-Handwerk würde ich hier aufnehmen.',
            },
            {
              requirement: 'RAG-Muster innerhalb der KI-Plattform',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Der einzige wirklich neue Bereich: Orchestrierung und agentische Muster habe ich gebaut, Retrieval nicht. Siehe die Notiz unten.',
            },
          ],
        },
        {
          title: 'Größenordnung & Domäne',
          rows: [
            {
              requirement:
                'Artikel-Lebenszyklus, Partner-Onboarding und Sortimentsdaten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Mein nächstliegender Präzedenzfall: Artikeldaten aus Quellsystemen gesammelt, zu Katalogen und Attributen standardisiert, an Kanäle und 50+ Marktteams ausgeliefert und korrekt gehalten, während sich Sortimente änderten. Time-to-Market +70%, Adoption 100%.',
            },
            {
              requirement:
                'Plattformen, deren Kunden andere Teams sind, nicht Endkunden',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Beide Plattformen, die ich bei adidas verantwortete, waren genau das — 50+ Marktteams und 1.000+ Kollegen aus getrennten Geschäftsbereichen, mit dem Onboarding, der Supportlast, den Kompatibilitätserwartungen und den Migrationen echter Mandanten.',
            },
            {
              requirement: 'KI-Automatisierung selbst bauen und betreiben',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Drei unterschiedliche Systeme statt einer Wiederholung: eine Orchestrierungsschicht mit Agentendefinitionen und Verifikation, eine Vertex-AI-Agentensuite und ein Python/FastAPI-Dienst auf Gemini hinter einem bezahlten Produkt.',
            },
            {
              requirement: 'Arbeiten über mehrere europäische Standorte',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre über drei Länder, mit Rollouts bis nach Kolumbien, in die Niederlande und nach Deutschland. Verteiltes Arbeiten ist mein Normalzustand.',
            },
            {
              requirement:
                'Eine KI-Plattform mit internen Produktteams als Mandanten',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine Erfahrung mit Mandanten stammt aus Daten- und Tooling-Plattformen, nicht aus der KI-Schicht, die heute meinen eigenen Produkten dient. Die Muster übertragen sich — Routing, Leitplanken, wiederverwendbare Definitionen, menschliche Gates — und das Wissen, was Mandanten erwarten, ebenso.',
            },
            {
              requirement: 'Marktplatz für tausende externe Markenpartner',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich komme von der Markenseite des Handels. Meine Teams waren intern, und interne Nutzer können ihr Geschäft nicht anderswohin tragen — ein Unterschied in der Verantwortung, den ich ernst nehmen und nicht übergehen würde.',
            },
            {
              requirement:
                'Ein Enterprise-Designsystem, das viele Anwendungen nutzen',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Für diese Website habe ich ein token-basiertes System samt seitenweiser Überschreibungen gebaut und pflege es. Versionierung und Contribution-Governance über viele konsumierende Anwendungen sind eine größere Aufgabe.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Die Orchestrierungsschicht',
      statusBadge: 'Täglich im Betrieb · menschliche Gates · selbstprüfend',
      heading:
        'Ich habe über LLM-Orchestrierung nicht gelesen. Ich habe die Schicht gebaut, die ich brauchte — und betreibe sie täglich.',
      lede: 'FounderOS ist ein terminal-first System, das ich gebaut habe, um mehrere KI-Produkte gleichzeitig zu führen. Vier Entscheidungen darin sind der Grund für meine Bewerbung — jede hat mich vorher einen Fehler gekostet.',
      pillars: [
        {
          title: 'Nach Rolle routen, nicht an ein Modell',
          body: 'Ein Coding-Agent baut, ein lokales Modell prüft, Gemini-Spezialisten übernehmen den Rest. Kosten, Latenz und Vertrauen unterscheiden sich je Aufgabe; Plattformen, die das ignorieren, werden schnell teuer.',
        },
        {
          title: 'Agentendefinitionen sind versionierte Dateien',
          body: 'Architektur, Backend, Frontend, Produkt, QA, Review, Release — jeweils eine prüfbare Datei statt eines im Code versteckten Prompts, damit sich Verhalten bewusst ändert.',
        },
        {
          title: 'Verifikation ist ein eigener Belang',
          body: 'Orchestrator, Kontext, State und Secrets sind getrennt, mit einem selbstheilenden Durchlauf vor dem täglichen Briefing. Ein Agentensystem ohne Verifikation ist eine Demo, die nur noch nicht gescheitert ist.',
        },
        {
          title: 'Zwei Gates bleiben menschlich',
          body: 'Es läuft geplant und hält an genau zwei Entscheidungen. Zu wählen, was nie automatisiert wird, ist die eigentliche Designarbeit; der Rest ist Installation.',
        },
      ],
      credentials: [
        'FounderOS — Orchestrator, Agentendefinitionen, Verifikation',
        'StagStrat — 5-Agenten-Suite in Python auf Vertex AI',
        'FastAPI + Gemini hinter einem bezahlten Produkt',
        'adidas PIM — 50+ Marktteams, 100% Adoption',
      ],
      closingLine:
        'Die ältere Hälfte meiner Argumentation ist größer: die Plattformen, auf denen 1.000+ Kollegen und 50+ Marktteams tatsächlich arbeiteten — angenommen ohne Anordnung.',
    },
    gap: {
      chip: 'Was ich lernen würde',
      heading: 'Retrieval ist der wirklich neue Teil.',
      body: 'Ihre Ausschreibung nennt RAG neben Orchestrierung und agentischen Frameworks. Zwei von drei habe ich gebaut und betreibe sie; Retrieval nicht — keine Embeddings, kein Vektorspeicher, keine Bewertung von Retrieval-Qualität. Das würde ich von Ihren Entwicklern lernen, nicht lehren, und ich sage es lieber offen, als es im ersten Sprint zu entdecken. Alles andere in diesem Mandat habe ich getan, auf Organisationsebene, mit Zahlen dahinter.',
    },
    closing: {
      eyebrow: 'Warum diese Rolle',
      heading:
        'Bei partnernaher Software geben die meisten Marktplätze das Handwerk still auf',
      body: 'Der Satz, dass Unternehmenssoftware so intuitiv wie B2C sein sollte, ist der Grund, warum ich den Rest gelesen habe. Die meisten Unternehmen akzeptieren, dass partnernahes Tooling schlechter ist als das, was sie Konsumenten ausliefern, und die Kosten erscheinen auf keinem Dashboard — sie zeigen sich darin, dass Partner um das System herumarbeiten und Daten veralten. Ich habe beide Seiten dieser Linie bearbeitet: Consumer-Produkte mit über 165 Mio. Nutzern und danach interne Plattformen, bei denen ich den Anspruch nicht gesenkt habe — der einzige Grund, warum die Adoption hielt. Darunter eine KI-Plattform zu legen ist der spannende Teil, denn die schwierige Frage ist nicht, welches Modell man nimmt. Sie ist, welche Entscheidungen beim Menschen bleiben und was passiert, wenn die Automatisierung vor einem Partner falsch liegt.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Deutsch · Italienisch B2 · Slowakisch',
        'Head of Product, Fintech für algorithmischen Handel',
      ],
      signature:
        'Lukáš Hošala — zehn Jahre im Produkt; die Orchestrierungsschicht ist meine und läuft heute Nacht.',
    },
  },
}
