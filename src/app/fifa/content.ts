export type Locale = 'en' | 'it' | 'de'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id: 'policies' | 'strategy' | 'lifecycle' | 'privacy' | 'risk' | 'buyin'
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

export interface FifaContent {
  hero: {
    eyebrow: string
    headlineLead: string
    headlineGradient: string
    description: string
    note: string
    paletteNote: string
    chips: string[]
    statsLabel: string
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
  football: {
    chip: string
    statusBadge: string
    heading: string
    body: string
    credentials: string[]
    closingLine: string
  }
  blockchain: {
    chip: string
    heading: string
    body: string
  }
  closing: {
    eyebrow: string
    heading: string
    body: string
    credentials: string[]
    ctaContact: string
    ctaLinkedIn: string
    signature: string
  }
}

export const fifaContent: Record<Locale, FifaContent> = {
  en: {
    hero: {
      eyebrow: 'FIFA · Zurich · AI & Innovative Tech Governance Manager',
      headlineLead: "I've already been doing most of this job.",
      headlineGradient: 'Just not with this job title yet.',
      description:
        'Eight years at adidas, building products used by 165M+ people and making sure they stayed GDPR-compliant along the way. These days I build with Claude, OpenAI, and Vertex AI daily, and I lead the analytics department at a professional football club on the side. This page walks through how that experience lines up with what FIFA is actually looking for.',
      note: 'One page, built specifically for this application — not linked anywhere else on the site.',
      paletteNote:
        "The color palette is a deliberate nod to FIFA's own brand — this isn't an official FIFA page.",
      chips: [
        'AI Governance',
        'Data Compliance',
        'Product Strategy',
        'UEFA A Licence',
      ],
      statsLabel: 'Quick stats',
      stats: [
        { value: '8+', label: 'Years in product & governance' },
        { value: '165M+', label: 'Users on products I helped govern' },
        { value: '13+', label: 'People led, across 3 countries' },
        { value: '4', label: 'Roles where governance was the job' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What FIFA is asking for — and where I've already done it",
      items: [
        {
          id: 'policies',
          title: 'Governance policies & standards',
          body: "Governance frameworks don't mean much until someone actually writes the policy and gets fifty teams to follow it. I've done that twice — once defining product strategy and operational standards for an AI-powered trading platform at StagStrat, and earlier building the data-governance policy for a PIM tool that had to work identically across 50+ market teams at adidas.",
        },
        {
          id: 'strategy',
          title: 'AI strategy & executive buy-in',
          body: "A roadmap only matters if executives actually buy into it. I owned that at Runtastic, setting the product roadmap for a platform used by 165M+ people, and I'm doing the same thing right now with PlayerGrade — an AI scouting tool I built myself that's already shaping transfer decisions at a Slovak Nike Liga club.",
        },
        {
          id: 'lifecycle',
          title: 'Owning the lifecycle',
          body: 'Someone has to own a model or product end to end — deployment, monitoring, knowing when to retire it. That was my job at StagStrat for an AI trading platform, and at Runtastic for products shipped and operated across three countries.',
        },
        {
          id: 'privacy',
          title: 'Data privacy & compliance',
          body: "GDPR isn't theoretical to me — I ran it. At Runtastic that meant working directly with legal and data-protection teams across every European market we shipped to, and earlier at adidas I was responsible for compliance on a €1M enterprise platform.",
        },
        {
          id: 'risk',
          title: 'Risk, KPIs & reporting',
          body: "Governance only works if someone's actually watching the numbers. I reported compliance status and adoption metrics to executives at Runtastic. At adidas Netherlands, the €1M Sprinklr platform was live but barely used — teams found the compliance steps confusing and skipped them. I rebuilt the onboarding around the actual governance requirements instead of bolting them on afterward, and adoption rose 30%.",
        },
        {
          id: 'buyin',
          title: 'Getting people on board',
          body: "The hardest part of governance is getting people who don't report to you to actually follow it. I've done that across legal, procurement, branding, IT, and business teams at adidas — and got to 100% adoption of a new governance framework across 50+ market teams through training, not a mandate.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'Experience & Domain',
          rows: [
            {
              requirement:
                'Minimum 5 years Technology Product Manager experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product, 2016 to 2025.',
            },
            {
              requirement: 'Minimum 3 years Technology governance experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Six-plus years of GDPR and data-governance ownership, going back to policy work I did in 2016.',
            },
            {
              requirement:
                'Strong understanding of AI technologies and blockchain platforms',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I use Claude, OpenAI, LangChain, and Vertex AI in production — deep, daily experience. Blockchain is lighter: hands-on exposure via a blockchain-adjacent trading platform at StagStrat, not years of specialization.',
            },
            {
              requirement: 'University degree in IT/CS or related field',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Eight years of hands-on technology governance work, backed by an MBA and a CMI Level 7 in Strategic Management — not a CS degree, but the practical grounding it would have given me.',
            },
            {
              requirement: '3–5 years in a similar role',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Data-governance responsibility since 2019 at adidas, sharpened into a dedicated governance mandate at StagStrat from 2025 — the title is newer than the work.',
            },
            {
              requirement:
                'Governance/risk/compliance expertise (GDPR, ISO, NIST, EU AI Act)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Deep, practiced GDPR experience across three markets and a working knowledge of the EU AI Act — built from doing the work, not from an ISO or NIST certificate (yet).',
            },
          ],
        },
        {
          title: 'Delivery & Tooling',
          rows: [
            {
              requirement:
                'Defining policies/operational standards for emerging tech',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I built the AI model lifecycle standards at StagStrat, and rolled out the same kind of governance policy across 50+ adidas market teams.',
            },
            {
              requirement:
                'Cross-functional collaboration & stakeholder management, incl. executives',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "I've led teams of 13+ across three countries and reported governance KPIs straight to executives at Runtastic.",
            },
            {
              requirement:
                'Familiarity with lifecycle management tools & governance dashboards',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'JIRA, Confluence, PowerBI, ServiceNow, Monday.com — day-to-day tools, not just résumé keywords.',
            },
            {
              requirement:
                'Strong analytical/problem-solving, attention to detail',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I make decisions off SQL and Google Analytics on the product side, and off video and tracking data on the football side.',
            },
            {
              requirement:
                'Ability to set strategic goals, manage expectations, drive change, facilitate',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A 30% jump in platform adoption and 100% training-led adoption across 50+ teams — both came from getting the change management right.',
            },
            {
              requirement:
                'Good knowledge of PowerBI / Monday.com / ServiceNow (advantage)',
              isMatch: true,
              tierLabel: 'Direct match',
              proof: 'All three, in active use.',
            },
          ],
        },
      ],
    },
    football: {
      chip: 'The other job',
      statusBadge: 'Active — Head of Analytical & Scouting, MFK Ružomberok',
      heading:
        "Football isn't a hobby I mention in interviews — it's the other half of my job.",
      body: "Alongside product work, I'm Head of the Analytical & Scouting Department at MFK Ružomberok, in Slovakia's top-tier league. I built PlayerGrade myself — an AI scouting tool that's now shaping the club's transfer decisions — and I lead match analysis, opposition scouting, and real-time tactical reporting off video and tracking data for the first team.",
      credentials: [
        'UEFA A Licence',
        'Barça Innovation Hub Certified',
        'Wyscout Proficient',
        'Hudl Proficient',
      ],
      closingLine:
        "FIFA's mission to make football truly global is one I understand from both sides of the pitch: I've spent a career building the technology, and just as long developing the game itself.",
    },
    blockchain: {
      chip: 'Blockchain, honestly',
      heading: "My blockchain experience is real, but I won't oversell it",
      body: "As Head of Product at StagStrat, an algorithmic trading start-up, I defined the governance and operational standards for a blockchain-adjacent AI trading platform — the kind of risk posture you need before letting an always-on trading product near real capital. That, plus hands-on time with Web3 tooling, gave me a practical sense of how decentralized platforms behave differently from traditional systems, and why their governance can't be bolted on after the fact.",
    },
    closing: {
      eyebrow: 'Why FIFA',
      heading: 'Two careers, one instinct',
      body: "I'm not just a product manager who'd like to work at FIFA — I live football every day. Governing AI and blockchain responsibly gets harder, not easier, at FIFA's scale: 211 member associations, dozens of languages, wildly different regulatory environments. That's the kind of complexity I've spent eight years building governance for at adidas, and the kind of complexity I understand instinctively because I've lived inside football's version of it too. I'd welcome the chance to bring both to FIFA's AI and blockchain governance work in Zurich.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'UEFA A Licence',
        'Slovak · English C2 · Italian B2 · German',
      ],
      ctaContact: 'Get in touch',
      ctaLinkedIn: 'Connect on LinkedIn',
      signature: 'Lukáš Hošala, based in Italy, ready to relocate to Zurich.',
    },
  },
  it: {
    hero: {
      eyebrow: 'FIFA · Zurigo · AI & Innovative Tech Governance Manager',
      headlineLead: 'Gran parte di questo lavoro lo sto già facendo.',
      headlineGradient: 'Solo non con questo titolo, ancora.',
      description:
        "Otto anni in adidas, a costruire prodotti usati da oltre 165 milioni di persone e a garantire che restassero conformi al GDPR lungo il percorso. Oggi lavoro ogni giorno con Claude, OpenAI e Vertex AI, e nel tempo libero guido il reparto analisi di un club di calcio professionistico. Questa pagina ripercorre come quell'esperienza si allinei con quello che FIFA sta effettivamente cercando.",
      note: 'Una pagina pensata specificamente per questa candidatura — non collegata al resto del sito.',
      paletteNote:
        'La palette cromatica è un omaggio volontario ai colori di FIFA — non è una pagina ufficiale FIFA.',
      chips: [
        'Governance AI',
        'Compliance dei dati',
        'Strategia di prodotto',
        'Licenza UEFA A',
      ],
      statsLabel: 'In breve',
      stats: [
        { value: '8+', label: 'Anni in ambito prodotto e governance' },
        {
          value: '165M+',
          label: 'Utenti su prodotti di cui ho curato la governance',
        },
        { value: '13+', label: 'Persone guidate, in 3 paesi' },
        { value: '4', label: 'Ruoli in cui la governance era il lavoro' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che FIFA cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'policies',
          title: 'Policy e standard di governance',
          body: "Un framework di governance non conta molto finché qualcuno non scrive davvero la policy e non convince cinquanta team a seguirla. L'ho fatto due volte — definendo strategia di prodotto e standard operativi per una piattaforma di trading algoritmico basata su AI in StagStrat, e prima ancora costruendo la policy di data governance per uno strumento PIM che doveva funzionare in modo identico in oltre 50 mercati in adidas.",
        },
        {
          id: 'strategy',
          title: 'Strategia AI e coinvolgimento dei dirigenti',
          body: "Una roadmap conta solo se i dirigenti ci credono davvero. L'ho gestita in Runtastic, definendo la roadmap di prodotto per una piattaforma usata da oltre 165 milioni di persone, e sto facendo lo stesso adesso con PlayerGrade — uno strumento di scouting AI che ho costruito io stesso e che sta già influenzando le decisioni di mercato di un club della Nike Liga slovacca.",
        },
        {
          id: 'lifecycle',
          title: 'Gestire il ciclo di vita',
          body: "Qualcuno deve seguire un modello o un prodotto dall'inizio alla fine — deployment, monitoraggio, sapere quando ritirarlo. Era il mio lavoro in StagStrat per una piattaforma di trading AI, e in Runtastic per prodotti distribuiti e gestiti in tre paesi.",
        },
        {
          id: 'privacy',
          title: 'Privacy dei dati e compliance',
          body: "Il GDPR per me non è teoria — l'ho applicato sul campo. In Runtastic significava lavorare direttamente con i team legali e di protezione dati in ogni mercato europeo in cui distribuivamo prodotti, e prima, in adidas, ero responsabile della compliance su una piattaforma enterprise da 1 milione di euro.",
        },
        {
          id: 'risk',
          title: 'Rischio, KPI e reportistica',
          body: "La governance funziona solo se qualcuno tiene davvero d’occhio i numeri. In Runtastic riportavo lo stato di compliance e le metriche di adozione ai dirigenti. In adidas Paesi Bassi, la piattaforma Sprinklr da 1 milione di euro era attiva ma poco utilizzata — i team trovavano confusi i passaggi di compliance e li saltavano. Ho ricostruito l'onboarding attorno ai requisiti di governance reali invece di aggiungerli dopo, e l'adozione è salita del 30%.",
        },
        {
          id: 'buyin',
          title: 'Portare le persone dalla propria parte',
          body: "La parte più difficile della governance è far seguire le regole a chi non risponde direttamente a te. L'ho fatto tra legal, procurement, branding, IT e business in adidas — arrivando al 100% di adozione di un nuovo framework di governance su oltre 50 team di mercato, tramite formazione, non un'imposizione.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Esperienza e ambito',
          rows: [
            {
              requirement: 'Almeno 5 anni come Technology Product Manager',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni, da Product Owner a Head of Product, dal 2016 al 2025.',
            },
            {
              requirement:
                'Almeno 3 anni di esperienza in governance tecnologica',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Oltre sei anni di responsabilità su GDPR e data governance, a partire dal lavoro sulle policy che ho fatto nel 2016.',
            },
            {
              requirement:
                'Solida comprensione di tecnologie AI e piattaforme blockchain',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Uso Claude, OpenAI, LangChain e Vertex AI in produzione — esperienza quotidiana e approfondita. La blockchain è più leggera: esposizione pratica tramite una piattaforma di trading vicina al mondo blockchain in StagStrat, non anni di specializzazione.',
            },
            {
              requirement: 'Laurea in Informatica o affini',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Otto anni di lavoro pratico in technology governance, supportati da un MBA e da un CMI Level 7 in Strategic Management — non una laurea in informatica, ma la base pratica che avrebbe potuto darmi.',
            },
            {
              requirement: '3–5 anni in un ruolo simile',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Responsabilità di data governance dal 2019 in adidas, affinata in un mandato di governance dedicato in StagStrat dal 2025 — il titolo è più recente del lavoro.',
            },
            {
              requirement:
                'Competenze in governance/rischio/compliance (GDPR, ISO, NIST, EU AI Act)',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Esperienza approfondita e concreta di GDPR in tre mercati e conoscenza pratica dell'EU AI Act — costruita facendo il lavoro, non con una certificazione ISO o NIST (per ora).",
            },
          ],
        },
        {
          title: 'Delivery e strumenti',
          rows: [
            {
              requirement:
                'Definire policy e standard operativi per tecnologie emergenti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho costruito gli standard di lifecycle per i modelli AI in StagStrat, e ho esteso lo stesso tipo di policy di governance a oltre 50 mercati in adidas.',
            },
            {
              requirement:
                'Collaborazione cross-funzionale e gestione degli stakeholder, dirigenti inclusi',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato team di oltre 13 persone in tre paesi e riportato i KPI di governance direttamente ai dirigenti in Runtastic.',
            },
            {
              requirement:
                'Familiarità con strumenti di lifecycle management e dashboard di governance',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'JIRA, Confluence, PowerBI, ServiceNow, Monday.com — strumenti che uso ogni giorno, non solo parole chiave nel CV.',
            },
            {
              requirement:
                'Solide capacità analitiche e di problem-solving, attenzione ai dettagli',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Decido sulla base di SQL e Google Analytics lato prodotto, e di video e dati di tracking lato calcio.',
            },
            {
              requirement:
                'Capacità di definire obiettivi strategici, gestire aspettative, guidare il cambiamento, facilitare',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Un aumento del 30% nell'adozione della piattaforma e il 100% di adozione guidata dalla formazione su oltre 50 team — entrambi frutto di un change management fatto bene.",
            },
            {
              requirement:
                'Buona conoscenza di PowerBI / Monday.com / ServiceNow (vantaggio)',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof: 'Tutti e tre, in uso attivo.',
            },
          ],
        },
      ],
    },
    football: {
      chip: "L'altro lavoro",
      statusBadge: 'Attivo — Head of Analytical & Scouting, MFK Ružomberok',
      heading:
        'Il calcio non è un hobby che cito ai colloqui — è l’altra metà del mio lavoro.',
      body: "Oltre al lavoro di prodotto, sono Head of Analytical & Scouting Department all'MFK Ružomberok, nella massima serie slovacca. Ho costruito io stesso PlayerGrade — uno strumento di scouting AI che oggi orienta le decisioni di mercato del club — e guido l'analisi delle partite, lo scouting degli avversari e la reportistica tattica in tempo reale su dati video e di tracking per la prima squadra.",
      credentials: [
        'Licenza UEFA A',
        'Certificazione Barça Innovation Hub',
        'Competenza Wyscout',
        'Competenza Hudl',
      ],
      closingLine:
        'La missione di FIFA di rendere il calcio davvero globale è qualcosa che capisco da entrambi i lati del campo: ho passato una carriera a costruire la tecnologia, e altrettanto tempo a sviluppare il gioco stesso.',
    },
    blockchain: {
      chip: 'Blockchain, con onestà',
      heading:
        'La mia esperienza in blockchain è reale, ma non la voglio gonfiare',
      body: "Come Head of Product in StagStrat, una start-up di trading algoritmico, ho definito la governance e gli standard operativi per una piattaforma di trading AI vicina al mondo blockchain — il tipo di gestione del rischio necessaria prima di affidare capitale reale a un prodotto di trading sempre attivo. Questo, insieme a un'esperienza pratica con strumenti Web3, mi ha dato una comprensione concreta di come le piattaforme decentralizzate si comportino diversamente dai sistemi tradizionali, e del perché la loro governance non possa essere aggiunta dopo, ma vada progettata da subito.",
    },
    closing: {
      eyebrow: 'Perché FIFA',
      heading: 'Due carriere, un solo istinto',
      body: "Non sono solo un product manager a cui piacerebbe lavorare per FIFA — vivo il calcio ogni giorno. Governare AI e blockchain in modo responsabile diventa più difficile, non più semplice, alla scala di FIFA: 211 federazioni affiliate, decine di lingue, contesti normativi profondamente diversi. È il tipo di complessità per cui ho costruito governance per otto anni in adidas, ed è il tipo di complessità che capisco istintivamente perché l'ho vissuta anche nella versione calcistica. Sarei felice di portare entrambe le cose nel lavoro di governance AI e blockchain di FIFA a Zurigo.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Licenza UEFA A',
        'Slovacco · Inglese C2 · Italiano B2 · Tedesco',
      ],
      ctaContact: 'Contattami',
      ctaLinkedIn: 'Collegati su LinkedIn',
      signature:
        'Lukáš Hošala, basato in Italia, pronto a trasferirmi a Zurigo.',
    },
  },
  de: {
    hero: {
      eyebrow: 'FIFA · Zürich · AI & Innovative Tech Governance Manager',
      headlineLead: 'Das meiste an diesem Job mache ich eigentlich schon.',
      headlineGradient: 'Nur eben noch ohne diesen Titel.',
      description:
        'Acht Jahre bei adidas, in denen ich Produkte für über 165 Millionen Menschen gebaut und dabei die DSGVO-Konformität sichergestellt habe. Heute arbeite ich täglich mit Claude, OpenAI und Vertex AI, und nebenbei leite ich die Analyseabteilung eines Profi-Fußballvereins. Diese Seite zeigt, wie diese Erfahrung zu dem passt, was FIFA tatsächlich sucht.',
      note: 'Eine Seite, gezielt für diese Bewerbung erstellt — nirgendwo sonst auf der Website verlinkt.',
      paletteNote:
        'Die Farbpalette ist eine bewusste Anlehnung an FIFAs eigene Marke — dies ist keine offizielle FIFA-Seite.',
      chips: [
        'KI-Governance',
        'Datenschutz-Compliance',
        'Produktstrategie',
        'UEFA-A-Lizenz',
      ],
      statsLabel: 'Auf einen Blick',
      stats: [
        { value: '8+', label: 'Jahre in Produkt & Governance' },
        {
          value: '165M+',
          label:
            'Nutzer auf Produkten, deren Governance ich mitverantwortet habe',
        },
        { value: '13+', label: 'Geführte Personen, in 3 Ländern' },
        { value: '4', label: 'Rollen, in denen Governance der Job war' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was FIFA sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'policies',
          title: 'Governance-Richtlinien & Standards',
          body: 'Governance-Frameworks bringen wenig, solange niemand die Richtlinie tatsächlich schreibt und fünfzig Teams dazu bringt, sie auch zu befolgen. Das habe ich zweimal gemacht — einmal mit der Produktstrategie und den Betriebsstandards für eine KI-gestützte Trading-Plattform bei StagStrat, und davor mit der Data-Governance-Richtlinie für ein PIM-Tool, das in über 50 Märkten bei adidas identisch funktionieren musste.',
        },
        {
          id: 'strategy',
          title: 'KI-Strategie & Rückhalt auf Führungsebene',
          body: 'Eine Roadmap zählt nur, wenn die Führungsebene wirklich dahintersteht. Das habe ich bei Runtastic verantwortet, mit der Produkt-Roadmap für eine Plattform mit über 165 Millionen Nutzern, und genau das mache ich gerade wieder mit PlayerGrade — einem KI-Scouting-Tool, das ich selbst gebaut habe und das bereits Transferentscheidungen bei einem Verein der slowakischen Nike Liga beeinflusst.',
        },
        {
          id: 'lifecycle',
          title: 'Verantwortung über den Lebenszyklus',
          body: 'Jemand muss ein Modell oder Produkt von Anfang bis Ende verantworten — Deployment, Monitoring, und zu wissen, wann es Zeit ist, es abzuschalten. Das war mein Job bei StagStrat für eine KI-Trading-Plattform, und bei Runtastic für Produkte, die in drei Ländern ausgerollt und betrieben wurden.',
        },
        {
          id: 'privacy',
          title: 'Datenschutz & Compliance',
          body: 'Die DSGVO ist für mich keine Theorie — ich habe sie umgesetzt. Bei Runtastic bedeutete das die direkte Zusammenarbeit mit Rechts- und Datenschutzteams in jedem europäischen Markt, in den wir ausgeliefert haben, und davor war ich bei adidas für die Compliance einer Enterprise-Plattform im Wert von 1 Mio. € verantwortlich.',
        },
        {
          id: 'risk',
          title: 'Risiko, KPIs & Reporting',
          body: 'Governance funktioniert nur, wenn jemand die Zahlen wirklich im Blick behält. Bei Runtastic habe ich Compliance-Status und Adoptionskennzahlen an die Führungsebene berichtet. Bei adidas Niederlande war die 1-Millionen-Euro-Plattform Sprinklr im Einsatz, wurde aber kaum genutzt — die Teams fanden die Compliance-Schritte verwirrend und übersprangen sie. Ich habe das Onboarding komplett um die tatsächlichen Governance-Anforderungen herum neu aufgebaut, statt sie nachträglich anzuflanschen, und die Nutzung stieg um 30%.',
        },
        {
          id: 'buyin',
          title: 'Menschen mit ins Boot holen',
          body: 'Der schwierigste Teil von Governance ist, Menschen, die einem nicht unterstellt sind, dazu zu bringen, sich wirklich daran zu halten. Das habe ich bei adidas über Legal, Procurement, Branding, IT und Business hinweg gemacht — und eine 100-prozentige Akzeptanz eines neuen Governance-Frameworks über mehr als 50 Märkte erreicht, durch Schulung, nicht durch Anordnung.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Erfahrung & Fachgebiet',
          rows: [
            {
              requirement:
                'Mindestens 5 Jahre Erfahrung als Technology Product Manager',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product, 2016 bis 2025.',
            },
            {
              requirement:
                'Mindestens 3 Jahre Erfahrung in Technology Governance',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Über sechs Jahre Verantwortung für DSGVO und Data Governance, zurückgehend auf Richtlinienarbeit, die ich 2016 geleistet habe.',
            },
            {
              requirement:
                'Fundiertes Verständnis von KI-Technologien und Blockchain-Plattformen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich nutze Claude, OpenAI, LangChain und Vertex AI im produktiven Einsatz — tiefe, tägliche Erfahrung. Blockchain ist leichter: praktische Erfahrung über eine blockchain-nahe Trading-Plattform bei StagStrat, keine jahrelange Spezialisierung.',
            },
            {
              requirement:
                'Hochschulabschluss in IT/Informatik oder verwandtem Bereich',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Acht Jahre praktische Arbeit in Technology Governance, unterstützt durch einen MBA und einen CMI Level 7 in Strategic Management — kein Informatik-Abschluss, aber die praktische Grundlage, die er vermittelt hätte.',
            },
            {
              requirement: '3–5 Jahre in einer vergleichbaren Rolle',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Data-Governance-Verantwortung seit 2019 bei adidas, geschärft zu einem dedizierten Governance-Mandat bei StagStrat seit 2025 — der Titel ist neuer als die Arbeit.',
            },
            {
              requirement:
                'Governance-/Risiko-/Compliance-Expertise (DSGVO, ISO, NIST, EU AI Act)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Tiefgehende, praxiserprobte DSGVO-Erfahrung in drei Märkten und fundierte Kenntnis des EU AI Act — aus der Praxis entstanden, nicht aus einem ISO- oder NIST-Zertifikat (noch nicht).',
            },
          ],
        },
        {
          title: 'Umsetzung & Tools',
          rows: [
            {
              requirement:
                'Definition von Richtlinien/Betriebsstandards für neue Technologien',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe die Lifecycle-Standards für KI-Modelle bei StagStrat aufgebaut und die gleiche Art von Governance-Richtlinie auf über 50 adidas-Märkte ausgerollt.',
            },
            {
              requirement:
                'Funktionsübergreifende Zusammenarbeit & Stakeholder-Management, inkl. Führungsebene',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe Teams von über 13 Personen in drei Ländern geführt und Governance-KPIs bei Runtastic direkt an die Führungsebene berichtet.',
            },
            {
              requirement:
                'Vertrautheit mit Lifecycle-Management-Tools & Governance-Dashboards',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'JIRA, Confluence, PowerBI, ServiceNow, Monday.com — tägliche Werkzeuge, keine reinen Lebenslauf-Schlagworte.',
            },
            {
              requirement:
                'Ausgeprägte analytische Fähigkeiten und Problemlösungskompetenz, Liebe zum Detail',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich treffe Entscheidungen auf Produktseite anhand von SQL und Google Analytics, und auf der Fußballseite anhand von Video- und Tracking-Daten.',
            },
            {
              requirement:
                'Fähigkeit, strategische Ziele zu setzen, Erwartungen zu steuern, Veränderung voranzutreiben, zu moderieren',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ein Anstieg der Plattformnutzung um 30% und 100% schulungsgestützte Akzeptanz über mehr als 50 Teams — beides durch sauberes Change Management.',
            },
            {
              requirement:
                'Gute Kenntnisse in PowerBI / Monday.com / ServiceNow (von Vorteil)',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof: 'Alle drei im aktiven Einsatz.',
            },
          ],
        },
      ],
    },
    football: {
      chip: 'Der andere Job',
      statusBadge: 'Aktiv — Head of Analytical & Scouting, MFK Ružomberok',
      heading:
        'Fußball ist kein Hobby, das ich im Bewerbungsgespräch erwähne — es ist die andere Hälfte meines Jobs.',
      body: 'Neben der Produktarbeit bin ich Head of Analytical & Scouting Department bei MFK Ružomberok, in der höchsten slowakischen Spielklasse. Ich habe PlayerGrade selbst entwickelt — ein KI-Scouting-Tool, das mittlerweile die Transferentscheidungen des Vereins mitgestaltet — und leite die Spielanalyse, das Gegner-Scouting und die taktische Echtzeit-Berichterstattung anhand von Video- und Tracking-Daten für die erste Mannschaft.',
      credentials: [
        'UEFA-A-Lizenz',
        'Barça Innovation Hub zertifiziert',
        'Wyscout-Kenntnisse',
        'Hudl-Kenntnisse',
      ],
      closingLine:
        'FIFAs Mission, den Fußball wirklich global zu machen, verstehe ich von beiden Seiten des Spielfelds aus: Ich habe eine Karriere lang Technologie gebaut — und genauso lange das Spiel selbst weiterentwickelt.',
    },
    blockchain: {
      chip: 'Blockchain, ehrlich gesagt',
      heading:
        'Meine Blockchain-Erfahrung ist real, aber ich will sie nicht überverkaufen',
      body: 'Als Head of Product bei StagStrat, einem Start-up für algorithmischen Handel, habe ich die Governance und die Betriebsstandards für eine blockchain-nahe KI-Trading-Plattform definiert — genau die Art von Risikohaltung, die nötig ist, bevor ein dauerhaft aktives Trading-Produkt mit echtem Kapital arbeitet. Das, zusammen mit praktischer Erfahrung mit Web3-Tools, hat mir ein konkretes Verständnis dafür gegeben, wie sich dezentrale Plattformen anders verhalten als klassische Systeme — und warum ihre Governance von Anfang an mitgedacht werden muss, statt nachträglich angeflanscht zu werden.',
    },
    closing: {
      eyebrow: 'Warum FIFA',
      heading: 'Zwei Karrieren, ein Instinkt',
      body: 'Ich bin nicht einfach nur ein Product Manager, der gerne bei FIFA arbeiten würde — ich lebe Fußball jeden Tag. KI und Blockchain verantwortungsvoll zu governieren wird bei FIFAs Größenordnung schwieriger, nicht einfacher: 211 Mitgliedsverbände, dutzende Sprachen, grundverschiedene regulatorische Umfelder. Genau diese Art von Komplexität habe ich acht Jahre lang bei adidas governiert, und genau diese Art von Komplexität verstehe ich instinktiv, weil ich sie auch in ihrer fußballerischen Version erlebt habe. Ich würde mich freuen, beides in FIFAs KI- und Blockchain-Governance-Arbeit in Zürich einzubringen.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'UEFA-A-Lizenz',
        'Slowakisch · Englisch C2 · Italienisch B2 · Deutsch',
      ],
      ctaContact: 'Kontakt aufnehmen',
      ctaLinkedIn: 'Auf LinkedIn vernetzen',
      signature:
        'Lukáš Hošala, wohnhaft in Italien, bereit für den Umzug nach Zürich.',
    },
  },
}
