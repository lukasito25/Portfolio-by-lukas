export type Locale = 'en' | 'de' | 'fr'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'strategy'
    | 'platform'
    | 'access'
    | 'adoption'
    | 'intake'
    | 'stakeholders'
    | 'handson'
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

export interface UbpContent {
  hero: {
    eyebrow: string
    headlineLead: string
    headlineGradient: string
    description: string
    chips: string[]
    stats: HeroStat[]
  }
  roleMapSection: { eyebrow: string; heading: string; items: RoleMapItem[] }
  profileMatchSection: {
    eyebrow: string
    heading: string
    panels: ProfilePanel[]
  }
  /** Standout credential — here: the internal platform precedent at adidas. */
  spotlight: {
    chip: string
    statusBadge: string
    heading: string
    body: string
    credentials: string[]
    closingLine: string
  }
  /** Candidly owning the weakest area of the match. */
  gap: { chip: string; heading: string; body: string }
  closing: {
    eyebrow: string
    heading: string
    body: string
    credentials: string[]
    signature: string
  }
}

export const ubpContent: Record<Locale, UbpContent> = {
  en: {
    hero: {
      eyebrow: 'Union Bancaire Privée · COO · Head of AI Platform',
      headlineLead:
        'An internal platform succeeds or fails on whether people trust what it does with their data.',
      headlineGradient: 'That part I have done before.',
      description:
        'For nine years I have built internal platforms for people who did not report to me — a product-data platform used by 50+ adidas market teams, and an internal application used by 1,000+ colleagues across business units. The difficult part was never the tooling. It was classification, permissions, and persuading a division to give up the workaround it had grown attached to. I also work with LLM and agentic tooling daily and train models on a managed AI suite. What I have not done is run an AI platform inside a regulated bank, and this page is careful about the difference.',
      chips: [
        'Internal platform products',
        'Adoption & enablement',
        'LLM & agentic tooling',
        'Prioritisation & governance',
        'Geneva or Zurich',
      ],
      stats: [
        { value: '9', label: 'Years in product management' },
        {
          value: '1,000+',
          label: 'Colleagues on the internal platform I owned',
        },
        { value: '50+', label: 'Market teams onboarded to one standard' },
        { value: '€1M', label: 'Annual platform licence owned' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: 'What the mandate asks for — and where the evidence sits',
      items: [
        {
          id: 'platform',
          title: 'Own the enabling platform, not every use case',
          body: 'This distinction is the one I would most want to get right, and it is the shape of the work I have done. At adidas the answer to scattered, duplicated internal tooling was not to take over each team’s work but to build the sanctioned layer underneath it: one platform, consolidating dozens of disconnected tools, that let each business unit move at its own pace. The equivalent here is tooling access, deployment options, guardrails and reusable skills that divisions can draw on — with the platform team accountable for the rails rather than for every train.',
        },
        {
          id: 'adoption',
          title: 'Adoption is the deliverable, not the follow-up',
          body: 'Most internal platforms are technically fine and quietly unused. The product-data platform reached full adoption across 50+ market teams because documentation, training and enablement shipped with it rather than after it, and because I spent the discovery time understanding why each market had built its own workaround. When a €1M platform was underused, the fix was repositioning it around the workflows teams actually ran, which moved adoption 30 points. Neither result came from a mandate.',
        },
        {
          id: 'access',
          title: 'Differentiated access by data sensitivity',
          body: 'Giving client-facing teams different tooling from teams working only with non-confidential material is a classification problem before it is a technology one. I have built role-based access across business units and run consumer data under GDPR at adidas scale, so the mechanics are familiar. What I would be learning is your specific classification regime and what your Compliance function needs to see before a tool reaches a relationship manager’s desk — I would rather state that plainly than imply banking equivalence.',
        },
        {
          id: 'intake',
          title: 'A transparent intake, scored and defensible',
          body: 'Scoring use cases on impact, effort and risk, and being able to show why one was funded and another was not, is ordinary product discipline applied where it is politically hardest. I have run prioritisation against explicit criteria, brought funded business cases forward — at adidas including spend at the €1M level — and reported OKRs and adoption KPIs to executives who used them to make decisions. A steering committee works when the intake it reviews is already transparent.',
        },
        {
          id: 'stakeholders',
          title: 'Connective tissue between business, IT, security and risk',
          body: 'At adidas I aligned legal, procurement, IT, branding, business and 50+ global market teams, none of whom reported to me, while leading 13 people across three countries. Leading through influence is not a soft skill in that setting; it is the operating model. The translation work is the same in a bank, with a higher price on getting the risk conversation wrong.',
        },
        {
          id: 'strategy',
          title: 'A strategy that differs by division',
          body: 'A single AI strategy for Compliance, Asset Management and Relationship Management would be wrong for at least two of them. My experience of this is practical rather than theoretical: the same platform served market teams whose constraints, maturity and appetite differed enormously, and the strategy had to be expressed per audience while the underlying investment stayed shared. Keeping it current as the technology moves is the easier half — I follow this space closely because I build with it.',
        },
        {
          id: 'handson',
          title: 'Hands-on enough to unblock, not to take over',
          body: 'The posting asks for someone who gets into the detail rather than managing from a distance, which is how I work anyway. I write and ship code, specify and consume APIs, and build my own products — PlayerGrade, an AI scouting tool now in use at a professional club, and this site, including its analytics pipeline. That depth is not engineering seniority; it is enough to hear when an estimate is really a data problem, and enough to earn a technical team’s patience.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: 'Where I match, and where I do not',
      panels: [
        {
          title: 'What UBP is looking for',
          rows: [
            {
              requirement:
                'Proven product management experience, ideally delivering platform or internal-product capabilities',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product. Two of those products were internal platforms: a product-data platform across 50+ market teams and an admin application used by 1,000+ colleagues across business units.',
            },
            {
              requirement:
                'Track record of prioritisation, stakeholder management and outcome ownership in a complex organisation',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years inside a global organisation with the stakeholder set that implies — legal, procurement, IT, branding and 50+ market teams — and outcomes I was measured on rather than activity: +70% speed to market, full adoption, +30% on a repositioned platform.',
            },
            {
              requirement:
                'Proven experience of modern AI technology — LLMs, agentic and tool-using systems',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Daily, and in production rather than in demos. I build software by directing agentic coding tools, and I train, tune and evaluate models on Google AI Studio and Vertex AI for PlayerGrade. To be precise: I assemble and deploy on managed AI platforms — I do not author model architectures.',
            },
            {
              requirement:
                'Understanding of how that technology is deployed securely in an enterprise',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Partial, and worth naming. I have taken products through corporate IT and security review and work within a managed cloud suite, so the patterns are not foreign. Designing the sanctioned deployment model for an entire bank — hosting, data residency, guardrails signed off by Security — is a level beyond what I have owned.',
            },
            {
              requirement:
                'Hands-on and solutions-oriented, getting into the detail across technology, data and compliance',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I build things myself. PlayerGrade and this site are both mine end to end, and at adidas I stayed close enough to the technical detail to lead a full front-end rebuild rather than commission one.',
            },
            {
              requirement:
                'Familiarity with the constraints of a regulated, data-sensitive environment',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'GDPR-governed consumer data at adidas scale and a fintech in trading today — genuinely data-sensitive, but not a regulated bank. I have not worked under a financial supervisory regime, and the posting is right to list financial services as an advantage I do not hold.',
            },
            {
              requirement:
                'Excellent communicator, translating between business, technology and risk audiences',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Specs that engineers can build against and business cases that executives will fund, at the €1M level, plus OKR reporting to leadership. Translation between those audiences has been the constant of the last nine years.',
            },
            {
              requirement:
                'Comfortable leading through influence, not authority',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The 50+ market teams I onboarded could have refused, and some initially did. Adoption without authority is the specific thing I have evidence for.',
            },
            {
              requirement:
                'Product craft — discovery, prioritisation frameworks, roadmapping, business cases and ROI',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Standard practice for me, including the ROI half: I have argued for, won and then had to justify seven-figure platform spend, and made a build-versus-buy call between a licensed platform and an in-house alternative.',
            },
            {
              requirement:
                'Governance and risk — data classification, security and compliance awareness',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Role-based access, GDPR practice and permissioning across business units are real experience; a bank’s data-classification framework with Compliance as a gatekeeper is not. I would expect to be led by your risk functions here for some time.',
            },
            {
              requirement: 'English required',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2, and my working language for nine years across three countries.',
            },
            {
              requirement: 'French an advantage',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I do not speak French. German, Italian B2 and Slovak alongside English. This page is offered in French, but that is a translation rather than a fluency of mine, and I would rather say so than let the language toggle imply otherwise.',
            },
          ],
        },
        {
          title: 'The mandate, the bank and the practicalities',
          rows: [
            {
              requirement:
                'A founding role: standing up a new function inside a global bank',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I have founded a function, but at a different altitude — Head of Product at an early-stage fintech, building the practice from nothing. Doing that inside a CHF 184.5bn bank with 20+ locations is a step up, and I would be leaning on the platform and stakeholder experience rather than claiming the equivalent scale.',
            },
            {
              requirement: 'Private banking and wealth management domain',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'None. My finance experience is an algorithmic trading platform serving retail investors — adjacent in vocabulary, not in clients, regulation or the advisory relationship at the centre of your business.',
            },
            {
              requirement:
                'Working across a global organisation and multiple locations',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years at adidas across three countries, with rollouts spanning Colombia, the Netherlands and Germany, and a platform serving market teams worldwide.',
            },
            {
              requirement:
                'Steering committee, budget and executive sponsorship',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I have owned a €1M annual licence including its renewal and budget conversations, and reported platform performance to executives who controlled that spend.',
            },
            {
              requirement:
                'On-site in London, Geneva or Zurich, with frequent travel to Geneva',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Geneva or Zurich, and I would relocate for this role — I have been open to a Swiss move for some time. As an EU national, Switzerland is the straightforward route; London would need UK sponsorship, so I would not put it forward as the simplest option for either of us. Travel to Geneva is no obstacle.',
            },
            {
              requirement:
                'Enabling AI adoption bottom-up through communication and training',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Enablement is the part of platform work I have the clearest record on: full adoption across 50+ teams, and a 30-point recovery on a platform people had stopped using.',
            },
            {
              requirement:
                'Technical fluency sufficient to earn credibility with technical and risk teams',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I ship code and build with the tooling in question, which is usually enough for engineers. With risk teams I would expect credibility to be earned rather than assumed, and to be starting from their standards, not mine.',
            },
            {
              requirement:
                'Turning scattered experiments into measurable business results',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Consolidating dozens of disconnected internal tools into one platform is the same problem in an earlier decade: many local experiments, no shared standard, and a business case that had to be argued in numbers.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The platform precedent',
      statusBadge: 'adidas — internal platform, 1,000+ colleagues, 50+ markets',
      heading:
        'The unglamorous half of this role is the half I have already done: the sanctioned tool that replaced everyone’s workaround.',
      body: 'At adidas, internal tooling had grown the way it always does — dozens of disconnected tools, each defensible on its own, collectively a mess nobody owned. I built the platform that consolidated them, and the product-data layer that collected information from source systems, standardised it and delivered it to the teams that needed it. Speed to market improved 70%; adoption across 50+ market teams reached 100%. Neither number came from a mandate. They came from spending the discovery time on why each market had built its own workaround, then shipping training and documentation with the platform instead of after it. Separately I owned a €1M annual licence that teams had largely stopped using, and recovered 30 points of adoption by repositioning it around the workflows they actually ran. The AI half of my background is more recent and smaller, and I would rather size it honestly than let it carry more weight than it should: I use LLM and agentic tooling daily to build software that runs in production, and I train, tune and evaluate models on Google AI Studio and Vertex AI for PlayerGrade, which a professional club now uses. That is assembly and deployment on a managed suite, done properly — not enterprise-wide rollout under a bank’s risk regime.',
      credentials: [
        'Global Admin Application — 1,000+ colleagues',
        'Product-data platform — 50+ markets, 100% adoption',
        '€1M licence owned — +30% adoption recovered',
        'PlayerGrade — Vertex AI, in use at a club',
      ],
      closingLine:
        'Internal platforms fail on adoption far more often than on technology. Preventing that specific failure is most of what I have spent nine years doing.',
    },
    gap: {
      chip: 'Where the match stops',
      heading:
        'I have not run an AI platform inside a regulated bank — and that is the centre of this role, not its edge.',
      body: 'The honest summary is that I bring the platform, adoption and stakeholder half of this mandate with a real record behind it, and the regulated-banking half with none. I have not worked under a financial supervisory regime, I have no private-banking or wealth-management background, and I have not designed a data-classification framework that Compliance and Security had to sign off before a tool reached a client-facing colleague. My AI experience is genuine and current, but it is the experience of someone who builds with these tools and deploys them on a managed platform — not of someone who has rolled them out to a global bank under its risk appetite. I also do not speak French, which the posting names as an advantage. Set against that: the failure mode you are most likely to hit is not technical. It is a sanctioned platform that divisions quietly route around, and that is the failure I have the clearest evidence of preventing. Whether that trade is the right one is your call to make, and I would rather you make it with the gaps stated than discover them at interview.',
    },
    closing: {
      eyebrow: 'Why UBP',
      heading:
        'A founding mandate only means something if the organisation can absorb what gets built',
      body: 'The part of this posting that reads differently from most AI roles is the ownership structure behind it. A bank that has been family-owned and family-run for over fifty years can invest on a horizon where a platform is judged in its second year rather than its first quarter — which is the horizon internal platforms actually need, because adoption compounds slowly and then all at once. The mandate is also unusually well specified: enabling platform rather than centralised delivery, differentiated access by data sensitivity, a transparent intake, a steering committee for the money. That is someone thinking clearly about how AI capability is built rather than announced. I would come to it with a strong record on the platform and adoption side, a working AI practice, and a great deal to learn about the regulated half — which seems to me the right way round for a role where the technology is the easier problem.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · German · Italian B2 · Slovak',
        'Head of Product, algorithmic trading fintech',
      ],
      signature:
        'Lukáš Hošala — nine years building internal platforms people actually adopted.',
    },
  },

  de: {
    hero: {
      eyebrow: 'Union Bancaire Privée · COO · Head of AI Platform',
      headlineLead:
        'Eine interne Plattform steht und fällt damit, ob die Menschen ihr mit ihren Daten vertrauen.',
      headlineGradient: 'Diesen Teil habe ich bereits gemacht.',
      description:
        'Seit neun Jahren baue ich interne Plattformen für Menschen, die mir nicht unterstellt sind — eine Produktdaten-Plattform für über 50 adidas-Marktteams und eine interne Anwendung für mehr als 1.000 Kolleginnen und Kollegen über Geschäftsbereiche hinweg. Das Schwierige war nie die Technik. Es waren Klassifizierung, Berechtigungen und die Überzeugungsarbeit, damit ein Bereich seine liebgewonnene Behelfslösung aufgibt. Ich arbeite zudem täglich mit LLM- und Agenten-Werkzeugen und trainiere Modelle auf einer verwalteten KI-Suite. Was ich nicht getan habe: eine KI-Plattform innerhalb einer regulierten Bank verantworten — und diese Seite geht mit diesem Unterschied sorgfältig um.',
      chips: [
        'Interne Plattformprodukte',
        'Adoption & Enablement',
        'LLM- & Agenten-Werkzeuge',
        'Priorisierung & Governance',
        'Genf oder Zürich',
      ],
      stats: [
        { value: '9', label: 'Jahre im Produktmanagement' },
        {
          value: '1.000+',
          label: 'Kollegen auf der internen Plattform, die ich verantwortete',
        },
        { value: '50+', label: 'Marktteams auf einen Standard gebracht' },
        { value: '1 Mio. €', label: 'Jährliche Plattformlizenz verantwortet' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was das Mandat verlangt — und wo die Belege liegen',
      items: [
        {
          id: 'platform',
          title:
            'Die ermöglichende Plattform verantworten, nicht jeden Use Case',
          body: 'Diese Unterscheidung würde ich am liebsten richtig treffen, und sie beschreibt genau die Arbeit, die ich gemacht habe. Bei adidas bestand die Antwort auf verstreute, doppelte interne Werkzeuge nicht darin, die Arbeit jedes Teams zu übernehmen, sondern die sanktionierte Schicht darunter zu bauen: eine Plattform, die Dutzende unverbundener Werkzeuge konsolidierte und jedem Geschäftsbereich sein eigenes Tempo ließ. Das Äquivalent hier sind Werkzeugzugang, Deployment-Optionen, Leitplanken und wiederverwendbare Skills, aus denen sich die Bereiche bedienen — mit einem Plattformteam, das für die Schienen verantwortlich ist, nicht für jeden Zug.',
        },
        {
          id: 'adoption',
          title: 'Adoption ist das Ergebnis, nicht die Nachbereitung',
          body: 'Die meisten internen Plattformen sind technisch in Ordnung und werden still nicht genutzt. Die Produktdaten-Plattform erreichte volle Adoption über mehr als 50 Marktteams, weil Dokumentation, Schulung und Enablement mit ihr ausgeliefert wurden und nicht danach — und weil ich die Discovery-Zeit darauf verwendet habe zu verstehen, warum jeder Markt seine eigene Behelfslösung gebaut hatte. Als eine Plattform für 1 Mio. € kaum genutzt wurde, lag die Lösung darin, sie an den tatsächlichen Arbeitsabläufen auszurichten; das bewegte die Nutzung um 30 Punkte. Keines der Ergebnisse kam per Anordnung.',
        },
        {
          id: 'access',
          title: 'Differenzierter Zugang nach Datensensibilität',
          body: 'Kundennahen Teams andere Werkzeuge zu geben als Teams, die nur mit nicht vertraulichem Material arbeiten, ist zuerst ein Klassifizierungs- und erst dann ein Technologieproblem. Ich habe rollenbasierten Zugriff über Geschäftsbereiche hinweg gebaut und Konsumentendaten unter der DSGVO in adidas-Größenordnung verantwortet, die Mechanik ist mir also vertraut. Lernen müsste ich Ihr konkretes Klassifizierungsregime und das, was Ihre Compliance sehen muss, bevor ein Werkzeug auf dem Tisch eines Kundenberaters landet — das sage ich lieber deutlich, als eine Gleichwertigkeit mit dem Bankumfeld zu suggerieren.',
        },
        {
          id: 'intake',
          title: 'Ein transparenter Intake, bewertet und begründbar',
          body: 'Use Cases nach Wirkung, Aufwand und Risiko zu bewerten und zeigen zu können, warum das eine finanziert wurde und das andere nicht, ist gewöhnliche Produktdisziplin — angewandt dort, wo sie politisch am schwierigsten ist. Ich habe nach expliziten Kriterien priorisiert, finanzierte Business Cases vorgelegt (bei adidas auch im Bereich von 1 Mio. €) und OKRs und Adoptions-KPIs an eine Führungsebene berichtet, die damit entschieden hat. Ein Steuerungsgremium funktioniert, wenn der Intake, den es prüft, bereits transparent ist.',
        },
        {
          id: 'stakeholders',
          title: 'Bindeglied zwischen Business, IT, Security und Risiko',
          body: 'Bei adidas habe ich Legal, Procurement, IT, Branding, Business und mehr als 50 globale Marktteams ausgerichtet — keines davon mir unterstellt — und dabei 13 Personen in drei Ländern geführt. Führung über Einfluss ist in diesem Umfeld keine weiche Fähigkeit, sondern das Betriebsmodell. Die Übersetzungsarbeit ist in einer Bank dieselbe, nur mit höherem Preis, wenn man das Risikogespräch falsch führt.',
        },
        {
          id: 'strategy',
          title: 'Eine Strategie, die sich je Bereich unterscheidet',
          body: 'Eine einzige KI-Strategie für Compliance, Asset Management und Relationship Management wäre für mindestens zwei davon falsch. Meine Erfahrung damit ist praktisch statt theoretisch: Dieselbe Plattform diente Marktteams, deren Rahmenbedingungen, Reife und Bereitschaft weit auseinanderlagen, und die Strategie musste je Zielgruppe formuliert werden, während die Investition dahinter gemeinsam blieb. Sie aktuell zu halten ist die leichtere Hälfte — ich verfolge dieses Feld genau, weil ich damit baue.',
        },
        {
          id: 'handson',
          title:
            'Nah genug am Detail, um zu entblocken, nicht um zu übernehmen',
          body: 'Die Ausschreibung sucht jemanden, der ins Detail geht statt aus der Distanz zu steuern — so arbeite ich ohnehin. Ich schreibe und liefere Code, spezifiziere und nutze APIs und baue eigene Produkte: PlayerGrade, ein KI-Scouting-Werkzeug, das ein Profiverein einsetzt, und diese Website samt Analytics-Pipeline. Diese Tiefe ist keine Engineering-Seniorität; sie reicht, um zu hören, wann eine Schätzung eigentlich ein Datenproblem ist, und um sich die Geduld eines technischen Teams zu verdienen.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Was UBP sucht',
          rows: [
            {
              requirement:
                'Nachgewiesene Produktmanagement-Erfahrung, idealerweise mit Plattform- oder internen Produkten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product. Zwei dieser Produkte waren interne Plattformen: eine Produktdaten-Plattform über 50+ Marktteams und eine Admin-Anwendung für mehr als 1.000 Kollegen über Geschäftsbereiche hinweg.',
            },
            {
              requirement:
                'Erfolgsbilanz in Priorisierung, Stakeholder-Management und Ergebnisverantwortung in einer komplexen Organisation',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre in einer globalen Organisation mit dem entsprechenden Stakeholder-Kreis — Legal, Procurement, IT, Branding und 50+ Marktteams — und Ergebnissen, an denen ich gemessen wurde statt an Aktivität: +70% Time-to-Market, vollständige Adoption, +30% auf einer neu positionierten Plattform.',
            },
            {
              requirement:
                'Nachgewiesene Erfahrung mit moderner KI — LLMs, agentische und werkzeugnutzende Systeme',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Täglich, und produktiv statt in Demos. Ich baue Software, indem ich agentische Coding-Werkzeuge anleite, und trainiere, tune und evaluiere Modelle auf Google AI Studio und Vertex AI für PlayerGrade. Präzise gesagt: Ich setze auf verwalteten KI-Plattformen zusammen und deploye — ich entwerfe keine Modellarchitekturen.',
            },
            {
              requirement:
                'Verständnis dafür, wie diese Technologie im Unternehmen sicher ausgerollt wird',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Teilweise, und das gehört benannt. Ich habe Produkte durch Konzern-IT- und Security-Reviews gebracht und arbeite in einer verwalteten Cloud-Suite, die Muster sind mir also nicht fremd. Das sanktionierte Deployment-Modell für eine ganze Bank zu entwerfen — Hosting, Datenresidenz, von Security abgenommene Leitplanken — liegt eine Stufe über dem, was ich verantwortet habe.',
            },
            {
              requirement:
                'Praktisch veranlagt und lösungsorientiert, im Detail über Technologie, Daten und Compliance hinweg',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich baue selbst. PlayerGrade und diese Website sind end-to-end meine, und bei adidas blieb ich nah genug am technischen Detail, um einen kompletten Front-End-Neuaufbau zu leiten statt ihn zu beauftragen.',
            },
            {
              requirement:
                'Vertrautheit mit den Zwängen eines regulierten, datensensiblen Umfelds',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'DSGVO-regulierte Konsumentendaten in adidas-Größenordnung und heute eine Fintech im Handel — wirklich datensensibel, aber keine regulierte Bank. Ich habe nicht unter einer Finanzaufsicht gearbeitet, und die Ausschreibung nennt Financial Services zu Recht als Vorteil, den ich nicht habe.',
            },
            {
              requirement:
                'Ausgezeichnete Kommunikation zwischen Business-, Technologie- und Risiko-Publikum',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Spezifikationen, gegen die Entwickler bauen können, und Business Cases, die Führungskräfte finanzieren — im Bereich von 1 Mio. € — plus OKR-Berichterstattung an die Leitung. Diese Übersetzung ist die Konstante der letzten neun Jahre.',
            },
            {
              requirement: 'Führung über Einfluss statt über Weisungsbefugnis',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Die 50+ Marktteams, die ich an Bord geholt habe, hätten ablehnen können, und einige taten es zunächst. Adoption ohne Weisungsbefugnis ist genau das, wofür ich Belege habe.',
            },
            {
              requirement:
                'Produkthandwerk — Discovery, Priorisierungsrahmen, Roadmapping, Business Cases und ROI',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Für mich Standard, die ROI-Hälfte eingeschlossen: Ich habe siebenstellige Plattformausgaben begründet, durchgesetzt und anschließend rechtfertigen müssen — inklusive einer Make-or-Buy-Entscheidung zwischen einer Lizenzplattform und einer eigenen Lösung.',
            },
            {
              requirement:
                'Governance und Risiko — Datenklassifizierung, Security- und Compliance-Bewusstsein',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Rollenbasierter Zugriff, DSGVO-Praxis und Berechtigungen über Geschäftsbereiche hinweg sind echte Erfahrung; das Datenklassifizierungs-Regime einer Bank mit Compliance als Torwächter ist es nicht. Hier würde ich mich für eine Weile von Ihren Risikofunktionen führen lassen.',
            },
            {
              requirement: 'Englisch erforderlich',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2 und seit neun Jahren meine Arbeitssprache in drei Ländern.',
            },
            {
              requirement: 'Französisch von Vorteil',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich spreche kein Französisch. Deutsch, Italienisch B2 und Slowakisch neben Englisch. Diese Seite gibt es auf Französisch, aber das ist eine Übersetzung und keine Sprachkompetenz von mir — das sage ich lieber, als es die Sprachauswahl suggerieren zu lassen.',
            },
          ],
        },
        {
          title: 'Mandat, Bank und Praktisches',
          rows: [
            {
              requirement:
                'Eine Gründungsrolle: eine neue Funktion in einer globalen Bank aufbauen',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich habe eine Funktion aufgebaut, aber auf anderer Höhe — Head of Product in einer frühphasigen Fintech, die Praxis von null an. Dasselbe in einer Bank mit 184,5 Mrd. CHF und 20+ Standorten ist ein Schritt nach oben; ich würde mich auf die Plattform- und Stakeholder-Erfahrung stützen, statt vergleichbare Größenordnung zu behaupten.',
            },
            {
              requirement: 'Private Banking und Wealth Management als Domäne',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Keine. Meine Finanzerfahrung ist eine Plattform für algorithmischen Handel für Privatanleger — im Vokabular benachbart, nicht bei Kunden, Regulierung oder der Beratungsbeziehung, die im Zentrum Ihres Geschäfts steht.',
            },
            {
              requirement:
                'Arbeit in einer globalen Organisation über mehrere Standorte',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre bei adidas in drei Ländern, mit Rollouts über Kolumbien, die Niederlande und Deutschland und einer Plattform für Marktteams weltweit.',
            },
            {
              requirement:
                'Steuerungsgremium, Budget und Sponsoring auf Führungsebene',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe eine Jahreslizenz über 1 Mio. € samt Verlängerungs- und Budgetgesprächen verantwortet und die Plattformleistung an die Führungskräfte berichtet, die dieses Budget kontrollierten.',
            },
            {
              requirement:
                'Vor Ort in London, Genf oder Zürich, mit häufigen Reisen nach Genf',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Genf oder Zürich, und für diese Rolle würde ich umziehen — ein Wechsel in die Schweiz ist für mich seit Längerem eine Option. Als EU-Bürger ist die Schweiz der unkomplizierte Weg; London bräuchte eine britische Arbeitserlaubnis, deshalb schlage ich es nicht als die einfachste Variante vor. Reisen nach Genf sind kein Hindernis.',
            },
            {
              requirement:
                'KI-Adoption bottom-up über Kommunikation und Schulung ermöglichen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Enablement ist der Teil der Plattformarbeit mit meiner klarsten Bilanz: vollständige Adoption über 50+ Teams und eine Erholung um 30 Punkte auf einer Plattform, die man aufgegeben hatte.',
            },
            {
              requirement:
                'Technische Sattelfestigkeit, um bei technischen und Risikoteams Glaubwürdigkeit zu haben',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich liefere Code und baue mit genau diesen Werkzeugen, was bei Entwicklern meist genügt. Bei Risikoteams würde ich Glaubwürdigkeit erst erarbeiten wollen und von deren Standards ausgehen, nicht von meinen.',
            },
            {
              requirement:
                'Verstreute Experimente in messbare Geschäftsergebnisse überführen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Dutzende unverbundener interner Werkzeuge zu einer Plattform zu konsolidieren ist dasselbe Problem ein Jahrzehnt früher: viele lokale Experimente, kein gemeinsamer Standard und ein Business Case, der in Zahlen zu begründen war.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Der Plattform-Präzedenzfall',
      statusBadge: 'adidas — interne Plattform, 1.000+ Kollegen, 50+ Märkte',
      heading:
        'Die unglamouröse Hälfte dieser Rolle habe ich schon gemacht: das sanktionierte Werkzeug, das alle Behelfslösungen ersetzt hat.',
      body: 'Bei adidas war die interne Werkzeuglandschaft so gewachsen, wie sie immer wächst — Dutzende unverbundener Tools, jedes für sich begründbar, zusammen ein Zustand, den niemand verantwortete. Ich habe die Plattform gebaut, die sie konsolidierte, und die Produktdaten-Schicht, die Informationen aus Quellsystemen sammelte, standardisierte und an die Teams lieferte, die sie brauchten. Die Time-to-Market verbesserte sich um 70%, die Adoption über 50+ Marktteams erreichte 100%. Keine der Zahlen kam per Anordnung. Sie kamen daher, dass die Discovery-Zeit in die Frage floss, warum jeder Markt seine eigene Behelfslösung gebaut hatte, und dass Schulung und Dokumentation mit der Plattform ausgeliefert wurden statt danach. Separat verantwortete ich eine Jahreslizenz über 1 Mio. €, die kaum noch genutzt wurde, und gewann 30 Punkte Adoption zurück, indem ich sie an den tatsächlichen Arbeitsabläufen ausrichtete. Die KI-Hälfte meines Hintergrunds ist jünger und kleiner, und ich bemesse sie lieber ehrlich, als sie mehr tragen zu lassen, als sie sollte: Ich nutze LLM- und Agenten-Werkzeuge täglich für Software, die produktiv läuft, und trainiere, tune und evaluiere Modelle auf Google AI Studio und Vertex AI für PlayerGrade, das heute ein Profiverein einsetzt. Das ist sauber gemachte Zusammenstellung und Auslieferung auf einer verwalteten Suite — kein unternehmensweiter Rollout unter dem Risikoregime einer Bank.',
      credentials: [
        'Global Admin Application — 1.000+ Kollegen',
        'Produktdaten-Plattform — 50+ Märkte, 100% Adoption',
        '1 Mio. € Lizenz verantwortet — +30% Adoption zurückgewonnen',
        'PlayerGrade — Vertex AI, im Einsatz bei einem Verein',
      ],
      closingLine:
        'Interne Plattformen scheitern weit häufiger an der Adoption als an der Technologie. Genau dieses Scheitern zu verhindern ist das meiste, was ich seit neun Jahren tue.',
    },
    gap: {
      chip: 'Wo die Übereinstimmung endet',
      heading:
        'Ich habe keine KI-Plattform in einer regulierten Bank verantwortet — und das ist der Kern dieser Rolle, nicht ihr Rand.',
      body: 'Die ehrliche Zusammenfassung: Die Plattform-, Adoptions- und Stakeholder-Hälfte dieses Mandats bringe ich mit belegter Bilanz mit, die Hälfte der regulierten Bank mit keiner. Ich habe nicht unter einer Finanzaufsicht gearbeitet, habe keinen Hintergrund im Private Banking oder Wealth Management und habe kein Datenklassifizierungs-Rahmenwerk entworfen, das Compliance und Security abnehmen mussten, bevor ein Werkzeug einen kundennahen Kollegen erreicht. Meine KI-Erfahrung ist echt und aktuell, aber es ist die Erfahrung von jemandem, der mit diesen Werkzeugen baut und sie auf einer verwalteten Plattform ausliefert — nicht von jemandem, der sie in einer globalen Bank unter deren Risikoappetit ausgerollt hat. Französisch spreche ich ebenfalls nicht, was die Ausschreibung als Vorteil nennt. Dem gegenüber steht: Das wahrscheinlichste Scheitern ist nicht technischer Natur. Es ist eine sanktionierte Plattform, um die die Bereiche still herumarbeiten — und genau dagegen habe ich die deutlichsten Belege. Ob dieser Tausch der richtige ist, entscheiden Sie; mir ist lieber, Sie entscheiden es mit benannten Lücken, statt sie im Gespräch zu entdecken.',
    },
    closing: {
      eyebrow: 'Warum UBP',
      heading:
        'Ein Gründungsmandat bedeutet nur etwas, wenn die Organisation aufnehmen kann, was gebaut wird',
      body: 'Was diese Ausschreibung von den meisten KI-Rollen unterscheidet, ist die Eigentümerstruktur dahinter. Eine Bank, die seit über fünfzig Jahren in Familienbesitz ist und familiengeführt wird, kann auf einem Horizont investieren, auf dem eine Plattform im zweiten Jahr beurteilt wird und nicht im ersten Quartal — genau der Horizont, den interne Plattformen brauchen, weil Adoption langsam wächst und dann auf einmal. Das Mandat ist zudem ungewöhnlich präzise formuliert: ermöglichende Plattform statt zentralisierter Lieferung, differenzierter Zugang nach Datensensibilität, ein transparenter Intake, ein Gremium für das Budget. Da denkt jemand klar darüber nach, wie KI-Fähigkeit aufgebaut statt angekündigt wird. Ich käme mit einer starken Bilanz auf der Plattform- und Adoptionsseite, einer gelebten KI-Praxis und viel Lernbedarf auf der regulierten Seite — was mir für eine Rolle, in der die Technologie das leichtere Problem ist, die richtige Reihenfolge zu sein scheint.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Deutsch · Italienisch B2 · Slowakisch',
        'Head of Product, Fintech für algorithmischen Handel',
      ],
      signature:
        'Lukáš Hošala — neun Jahre interne Plattformen, die tatsächlich genutzt wurden.',
    },
  },

  fr: {
    hero: {
      eyebrow: 'Union Bancaire Privée · COO · Head of AI Platform',
      headlineLead:
        'Une plateforme interne réussit ou échoue selon la confiance accordée à ce qu’elle fait des données.',
      headlineGradient: 'Cette partie-là, je l’ai déjà faite.',
      description:
        "Depuis neuf ans, je construis des plateformes internes pour des personnes qui ne me sont pas rattachées — une plateforme de données produit utilisée par plus de 50 équipes de marché chez adidas, et une application interne utilisée par plus de 1 000 collaborateurs de différentes divisions. Le difficile n'a jamais été l'outil. C'était la classification, les habilitations, et la conviction nécessaire pour qu'une division abandonne la solution de contournement à laquelle elle tenait. Je travaille aussi quotidiennement avec des outils LLM et agentiques et j'entraîne des modèles sur une suite d'IA managée. Ce que je n'ai pas fait : diriger une plateforme d'IA au sein d'une banque régulée — et cette page traite cette différence avec précaution.",
      chips: [
        'Produits de plateforme interne',
        'Adoption et enablement',
        'Outils LLM et agentiques',
        'Priorisation et gouvernance',
        'Genève ou Zurich',
      ],
      stats: [
        { value: '9', label: 'Années en product management' },
        {
          value: '1 000+',
          label: 'Collaborateurs sur la plateforme interne que je pilotais',
        },
        { value: '50+', label: 'Équipes de marché alignées sur un standard' },
        { value: '1 M€', label: 'Licence de plateforme annuelle pilotée' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Le poste, point par point',
      heading: 'Ce que le mandat demande — et où se trouvent les preuves',
      items: [
        {
          id: 'platform',
          title: 'Piloter la plateforme habilitante, pas chaque cas d’usage',
          body: "C'est la distinction que je tiendrais le plus à respecter, et elle décrit exactement le travail que j'ai fait. Chez adidas, la réponse à des outils internes dispersés et redondants n'a pas été de reprendre le travail de chaque équipe, mais de construire la couche sanctionnée en dessous : une plateforme consolidant des dizaines d'outils déconnectés, laissant chaque division avancer à son rythme. L'équivalent ici, ce sont les accès aux outils, les options de déploiement, les garde-fous et les compétences réutilisables dans lesquels les divisions puisent — avec une équipe plateforme responsable des rails plutôt que de chaque train.",
        },
        {
          id: 'adoption',
          title: 'L’adoption est le livrable, pas le suivi',
          body: "La plupart des plateformes internes sont techniquement correctes et discrètement inutilisées. La plateforme de données produit a atteint une adoption complète sur plus de 50 équipes de marché parce que la documentation, la formation et l'enablement ont été livrés avec elle et non après, et parce que j'ai passé le temps de discovery à comprendre pourquoi chaque marché avait bâti sa propre solution de contournement. Quand une plateforme à 1 M€ était peu utilisée, la réponse a été de la repositionner sur les processus réellement suivis par les équipes, ce qui a fait progresser l'adoption de 30 points. Aucun de ces résultats n'est venu d'une directive.",
        },
        {
          id: 'access',
          title: 'Un accès différencié selon la sensibilité des données',
          body: "Donner aux équipes en contact clientèle des outils différents de ceux des équipes ne traitant que des éléments non confidentiels est d'abord un problème de classification, ensuite un problème de technologie. J'ai construit des accès par rôle entre divisions et géré des données clients sous RGPD à l'échelle d'adidas : la mécanique m'est familière. Ce que j'aurais à apprendre, c'est votre régime de classification et ce que votre Compliance doit voir avant qu'un outil n'arrive sur le bureau d'un chargé de relation — je préfère le dire clairement plutôt que de laisser croire à une équivalence bancaire.",
        },
        {
          id: 'intake',
          title: 'Un processus d’entrée transparent, noté et défendable',
          body: "Noter les cas d'usage sur l'impact, l'effort et le risque, et pouvoir montrer pourquoi l'un a été financé et l'autre non, c'est de la discipline produit ordinaire appliquée là où elle est politiquement la plus difficile. J'ai priorisé selon des critères explicites, présenté des business cases financés — chez adidas jusqu'à 1 M€ — et rapporté OKR et KPI d'adoption à des dirigeants qui s'en servaient pour décider. Un comité de pilotage fonctionne quand le processus d'entrée qu'il examine est déjà transparent.",
        },
        {
          id: 'stakeholders',
          title: 'Le lien entre métier, IT, sécurité et risque',
          body: "Chez adidas, j'ai aligné le juridique, les achats, l'IT, la marque, le métier et plus de 50 équipes de marché mondiales, dont aucune ne m'était rattachée, tout en dirigeant 13 personnes dans trois pays. Diriger par l'influence n'est pas une compétence secondaire dans ce contexte : c'est le modèle opérationnel. Le travail de traduction est le même dans une banque, avec un prix plus élevé si la conversation sur le risque est mal menée.",
        },
        {
          id: 'strategy',
          title: 'Une stratégie qui diffère selon les divisions',
          body: "Une stratégie d'IA unique pour la Compliance, l'Asset Management et le Relationship Management serait fausse pour au moins deux d'entre elles. Mon expérience ici est pratique et non théorique : la même plateforme servait des équipes de marché aux contraintes, à la maturité et à l'appétit très différents, et la stratégie devait être formulée par audience alors que l'investissement restait commun. La maintenir à jour est la moitié la plus facile — je suis ce domaine de près parce que je construis avec.",
        },
        {
          id: 'handson',
          title: 'Assez proche du détail pour débloquer, pas pour reprendre',
          body: "L'annonce cherche quelqu'un qui entre dans le détail plutôt que de piloter à distance, ce qui correspond à ma façon de travailler. J'écris et livre du code, je spécifie et consomme des API, et je construis mes propres produits : PlayerGrade, un outil de scouting par IA utilisé par un club professionnel, et ce site, avec sa pipeline d'analytics. Cette profondeur n'est pas une séniorité d'ingénieur ; elle suffit à entendre quand une estimation cache un problème de données, et à obtenir la patience d'une équipe technique.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondance du profil',
      heading: 'Là où je corresponds, et là où non',
      panels: [
        {
          title: 'Ce que recherche UBP',
          rows: [
            {
              requirement:
                'Expérience confirmée en product management, idéalement sur des plateformes ou des produits internes',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Neuf ans, de Product Owner à Head of Product. Deux de ces produits étaient des plateformes internes : une plateforme de données produit sur plus de 50 équipes de marché et une application d’administration utilisée par plus de 1 000 collaborateurs.',
            },
            {
              requirement:
                'Solide expérience de la priorisation, de la gestion des parties prenantes et de la responsabilité des résultats en organisation complexe',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Huit ans dans une organisation mondiale avec les parties prenantes que cela implique — juridique, achats, IT, marque et plus de 50 équipes de marché — et des résultats sur lesquels j’étais évalué plutôt que sur l’activité : +70% de time to market, adoption complète, +30% sur une plateforme repositionnée.',
            },
            {
              requirement:
                'Expérience avérée des technologies d’IA modernes — LLM, systèmes agentiques et utilisant des outils',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Quotidienne, et en production plutôt qu’en démonstration. Je construis des logiciels en pilotant des outils de codage agentiques, et j’entraîne, ajuste et évalue des modèles sur Google AI Studio et Vertex AI pour PlayerGrade. Pour être précis : j’assemble et je déploie sur des plateformes d’IA managées — je ne conçois pas d’architectures de modèles.',
            },
            {
              requirement:
                'Compréhension du déploiement sécurisé de ces technologies en entreprise',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'Partielle, et cela mérite d’être dit. J’ai fait passer des produits par des revues IT et sécurité d’un grand groupe et je travaille dans une suite cloud managée : les schémas ne me sont pas étrangers. Concevoir le modèle de déploiement sanctionné d’une banque entière — hébergement, résidence des données, garde-fous validés par la Sécurité — dépasse ce que j’ai piloté.',
            },
            {
              requirement:
                'Orienté terrain et solutions, dans le détail à travers technologie, données et conformité',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Je construis moi-même. PlayerGrade et ce site sont miens de bout en bout, et chez adidas je suis resté assez proche du détail technique pour diriger une refonte complète du front-end plutôt que de la commander.',
            },
            {
              requirement:
                'Familiarité avec les contraintes d’un environnement régulé et sensible aux données',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'Des données clients sous RGPD à l’échelle d’adidas et aujourd’hui une fintech de trading — réellement sensibles, mais pas une banque régulée. Je n’ai pas travaillé sous supervision financière, et l’annonce a raison de citer les services financiers comme un avantage que je n’ai pas.',
            },
            {
              requirement:
                'Excellent communicant, capable de traduire entre métier, technologie et risque',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Des spécifications sur lesquelles les développeurs peuvent bâtir et des business cases que les dirigeants financent, au niveau du million d’euros, plus un reporting OKR à la direction. Cette traduction est la constante de mes neuf dernières années.',
            },
            {
              requirement:
                'À l’aise pour diriger par l’influence, sans autorité',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Les 50+ équipes de marché que j’ai embarquées pouvaient refuser, et certaines l’ont d’abord fait. L’adoption sans autorité est précisément ce dont j’ai des preuves.',
            },
            {
              requirement:
                'Métier produit — discovery, cadres de priorisation, roadmap, business cases et ROI',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Pratique standard chez moi, la partie ROI comprise : j’ai défendu, obtenu puis justifié une dépense de plateforme à sept chiffres, et tranché un arbitrage entre plateforme sous licence et solution interne.',
            },
            {
              requirement:
                'Gouvernance et risque — classification des données, sécurité et conformité',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'Les accès par rôle, la pratique RGPD et les habilitations entre divisions sont une expérience réelle ; le cadre de classification d’une banque avec la Compliance comme gardien ne l’est pas. Je m’attendrais ici à être guidé par vos fonctions de risque pendant un certain temps.',
            },
            {
              requirement: 'Anglais requis',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Anglais C2, ma langue de travail depuis neuf ans dans trois pays.',
            },
            {
              requirement: 'Français apprécié',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'Je ne parle pas français. Allemand, italien B2 et slovaque en plus de l’anglais. Cette page est proposée en français, mais il s’agit d’une traduction et non d’une compétence linguistique de ma part — je préfère le dire plutôt que de laisser le sélecteur de langue le suggérer.',
            },
          ],
        },
        {
          title: 'Le mandat, la banque et l’aspect pratique',
          rows: [
            {
              requirement:
                'Un rôle fondateur : créer une nouvelle fonction au sein d’une banque mondiale',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'J’ai créé une fonction, mais à une autre altitude — Head of Product dans une fintech en amorçage, en partant de zéro. Le faire dans une banque de 184,5 Mrd CHF et plus de 20 implantations est un cran au-dessus ; je m’appuierais sur l’expérience plateforme et parties prenantes plutôt que de revendiquer une échelle équivalente.',
            },
            {
              requirement:
                'Domaine de la banque privée et de la gestion de fortune',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                'Aucune. Mon expérience financière est une plateforme de trading algorithmique pour investisseurs particuliers — proche par le vocabulaire, pas par la clientèle, la régulation ni la relation de conseil au cœur de votre métier.',
            },
            {
              requirement:
                'Travailler dans une organisation mondiale multi-sites',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Huit ans chez adidas dans trois pays, avec des déploiements couvrant la Colombie, les Pays-Bas et l’Allemagne, et une plateforme au service d’équipes de marché dans le monde entier.',
            },
            {
              requirement:
                'Comité de pilotage, budget et sponsoring de la direction',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'J’ai piloté une licence annuelle à 1 M€, ses renouvellements et son budget, et rapporté la performance de la plateforme aux dirigeants qui contrôlaient cette dépense.',
            },
            {
              requirement:
                'Sur site à Londres, Genève ou Zurich, avec des déplacements fréquents à Genève',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Genève ou Zurich, et je déménagerais pour ce poste — la Suisse est une option que j’envisage depuis un moment. En tant que ressortissant de l’UE, la Suisse est la voie la plus simple ; Londres exigerait un parrainage britannique, je ne la présente donc pas comme l’option la plus commode. Les déplacements à Genève ne posent aucun problème.',
            },
            {
              requirement:
                'Favoriser l’adoption de l’IA par la base, via la communication et la formation',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'L’enablement est la partie du travail de plateforme sur laquelle mon bilan est le plus net : adoption complète sur plus de 50 équipes, et 30 points regagnés sur une plateforme délaissée.',
            },
            {
              requirement:
                'Aisance technique suffisante pour être crédible auprès des équipes techniques et risque',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Je livre du code et je construis avec les outils concernés, ce qui suffit généralement auprès des ingénieurs. Auprès des équipes risque, je m’attendrais à gagner cette crédibilité et à partir de leurs standards, pas des miens.',
            },
            {
              requirement:
                'Transformer des expérimentations éparses en résultats mesurables',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Consolider des dizaines d’outils internes déconnectés en une plateforme, c’est le même problème une décennie plus tôt : beaucoup d’expérimentations locales, aucun standard commun, et un business case à défendre en chiffres.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Le précédent plateforme',
      statusBadge:
        'adidas — plateforme interne, 1 000+ collaborateurs, 50+ marchés',
      heading:
        'La moitié la moins spectaculaire de ce poste, je l’ai déjà faite : l’outil sanctionné qui a remplacé les contournements de chacun.',
      body: "Chez adidas, l'outillage interne avait grandi comme il grandit toujours — des dizaines d'outils déconnectés, chacun défendable isolément, formant ensemble un désordre que personne ne pilotait. J'ai construit la plateforme qui les a consolidés, et la couche de données produit qui collectait l'information des systèmes sources, la standardisait et la livrait aux équipes qui en avaient besoin. Le time to market s'est amélioré de 70% ; l'adoption sur plus de 50 équipes de marché a atteint 100%. Aucun de ces chiffres n'est venu d'une directive. Ils sont venus du temps passé en discovery à comprendre pourquoi chaque marché avait bâti son propre contournement, puis du fait de livrer formation et documentation avec la plateforme plutôt qu'après. Par ailleurs, j'ai piloté une licence annuelle à 1 M€ que les équipes avaient largement délaissée, et regagné 30 points d'adoption en la repositionnant sur leurs processus réels. La partie IA de mon parcours est plus récente et plus modeste, et je préfère la mesurer honnêtement plutôt que de lui faire porter plus qu'elle ne peut : j'utilise quotidiennement des outils LLM et agentiques pour construire des logiciels en production, et j'entraîne, ajuste et évalue des modèles sur Google AI Studio et Vertex AI pour PlayerGrade, aujourd'hui utilisé par un club professionnel. C'est de l'assemblage et du déploiement sur une suite managée, faits correctement — pas un déploiement à l'échelle d'une entreprise sous le régime de risque d'une banque.",
      credentials: [
        'Global Admin Application — 1 000+ collaborateurs',
        'Plateforme de données produit — 50+ marchés, 100% d’adoption',
        'Licence 1 M€ pilotée — +30% d’adoption regagnés',
        'PlayerGrade — Vertex AI, utilisé par un club',
      ],
      closingLine:
        'Les plateformes internes échouent bien plus souvent sur l’adoption que sur la technologie. Empêcher précisément cet échec occupe l’essentiel de mes neuf dernières années.',
    },
    gap: {
      chip: 'Là où la correspondance s’arrête',
      heading:
        'Je n’ai pas dirigé de plateforme d’IA dans une banque régulée — et c’est le cœur de ce poste, pas sa marge.',
      body: "Le résumé honnête : j'apporte la moitié plateforme, adoption et parties prenantes de ce mandat avec un bilan réel derrière, et la moitié bancaire régulée sans aucun. Je n'ai pas travaillé sous supervision financière, je n'ai aucun parcours en banque privée ou gestion de fortune, et je n'ai pas conçu de cadre de classification des données que la Compliance et la Sécurité devaient valider avant qu'un outil n'atteigne un collaborateur en contact clientèle. Mon expérience de l'IA est réelle et actuelle, mais c'est celle de quelqu'un qui construit avec ces outils et les déploie sur une plateforme managée — pas de quelqu'un qui les a déployés dans une banque mondiale selon son appétit au risque. Je ne parle pas non plus français, que l'annonce cite comme un avantage. En regard : l'échec le plus probable n'est pas technique. C'est une plateforme sanctionnée que les divisions contournent discrètement, et c'est l'échec que j'ai le plus clairement démontré savoir prévenir. Savoir si l'échange en vaut la peine vous appartient ; je préfère que vous en décidiez avec les lacunes énoncées plutôt que de les découvrir en entretien.",
    },
    closing: {
      eyebrow: 'Pourquoi UBP',
      heading:
        'Un mandat fondateur ne vaut que si l’organisation peut absorber ce qui est construit',
      body: "Ce qui distingue cette annonce de la plupart des postes IA, c'est la structure de propriété derrière. Une banque détenue et dirigée par une famille depuis plus de cinquante ans peut investir sur un horizon où une plateforme se juge sur sa deuxième année et non sur son premier trimestre — précisément l'horizon dont les plateformes internes ont besoin, car l'adoption se construit lentement puis d'un coup. Le mandat est aussi inhabituellement bien spécifié : plateforme habilitante plutôt que livraison centralisée, accès différencié selon la sensibilité des données, un processus d'entrée transparent, un comité pour le budget. C'est le signe d'une réflexion claire sur la façon dont une capacité d'IA se construit plutôt qu'elle ne s'annonce. J'y viendrais avec un bilan solide côté plateforme et adoption, une pratique réelle de l'IA, et beaucoup à apprendre côté régulé — ce qui me semble le bon ordre pour un poste où la technologie est le problème le plus simple.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Anglais C2 · Allemand · Italien B2 · Slovaque',
        'Head of Product, fintech de trading algorithmique',
      ],
      signature:
        'Lukáš Hošala — neuf ans à construire des plateformes internes réellement adoptées.',
    },
  },
}
