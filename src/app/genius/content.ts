export type Locale = 'en' | 'it' | 'de'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id: 'unify' | 'vision' | 'translate' | 'metrics' | 'market' | 'gtm'
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

export interface GeniusContent {
  hero: {
    eyebrow: string
    headlineLead: string
    headlineGradient: string
    description: string
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
    signature: string
  }
}

export const geniusContent: Record<Locale, GeniusContent> = {
  en: {
    hero: {
      eyebrow:
        'Genius Sports · London · Senior Product Manager, Platform Experience',
      headlineLead:
        'Consolidating a dozen tools into one product? I’ve done it, repeatedly.',
      headlineGradient: 'It just wasn’t called Platform Experience yet.',
      description:
        "Eight years at adidas building front-end products for 165M+ people — and building the shared admin platform that pulled dozens of fragmented internal tools into one experience for 1,000+ people across the company's business units. That's this role, almost to the word. These days I lead product at a real-money trading fintech and run the analytics department at a professional football club, living in live sports data every week. This page walks through how it all lines up with what Genius Sports is looking for.",
      chips: [
        'Platform Experience',
        'Front-End Product',
        'Live Sports Data',
        'Agile Delivery',
      ],
      statsLabel: 'Quick stats',
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '165M+', label: 'Users on the platform I owned' },
        { value: '1000+', label: 'Stakeholders on one admin platform I built' },
        { value: '13+', label: 'People led, across 3 countries' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What Genius is asking for — and where I've already done it",
      items: [
        {
          id: 'unify',
          title: 'Consolidating tools into one shared platform',
          body: "This is the exact shape of the role — and it's the work I'm proudest of. At adidas I owned the Global Admin Application: a single shared platform that pulled dozens of disconnected internal tools and workflows into one interface for 1,000+ stakeholders across multiple business units. Instead of teams hopping between systems, they got one consistent experience — shared navigation, permissions and data in one place. I ran the same play again on the €1M Sprinklr social-commerce platform (adoption rose 30% once it was rebuilt around how teams actually worked) and on a PIM unification across 50+ market teams. Pulling fragmented internal and external tools into one coherent product is the work I keep being handed.",
        },
        {
          id: 'vision',
          title: 'Product vision & strategy with leadership',
          body: "A roadmap only matters if leadership actually buys into it. I owned the product roadmap for Runtastic — a platform used by 165M+ people — reporting direction and trade-offs straight to executives, and I'm doing the same now as Head of Product at StagStrat and with PlayerGrade, an AI scouting tool I built that's already shaping transfer decisions at a top-flight club.",
        },
        {
          id: 'translate',
          title: 'Turning vision into work items',
          body: 'The role specifically calls for converting high-level roadmaps into detailed, buildable work. That translation is my day-to-day: breaking strategy into epics with clear acceptance criteria, verifying delivery against spec, and keeping squads aligned — in JIRA and Confluence, not just in decks.',
        },
        {
          id: 'metrics',
          title: 'KPIs, OKRs & stakeholder alignment',
          body: "Alignment holds when it's anchored to numbers. I set and reported OKRs and adoption KPIs to executives at Runtastic, and used them to drive change — the 30% adoption jump and 100% training-led rollout across 50+ teams both came from managing to the metric, not mandating from the top.",
        },
        {
          id: 'market',
          title: 'Reading the competitive landscape',
          body: 'Watching the field is second nature — on the product side through market and competitive analysis, and on the football side quite literally: opposition scouting and match analysis off live tracking and video data is my other job. Turning how a market moves into a product response is a habit, not a task.',
        },
        {
          id: 'gtm',
          title: 'Releases & go-to-market',
          body: "I've run customer releases where failure wasn't an option — a staged migration of the Runtastic platform across three countries with zero downtime for 165M+ users — and owned the go-to-market that carried teams onto the new experience without losing them along the way.",
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
              requirement: '5+ years in Product Management',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product, 2016 to 2025.',
            },
            {
              requirement: 'Product strategy development & roadmap management',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned the roadmap for a 165M+ user platform at Runtastic and set product strategy end-to-end at StagStrat.',
            },
            {
              requirement: 'Strong analytics / BI background',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I decide off SQL, Google Analytics and PowerBI on the product side, and off live tracking and video data on the football side.',
            },
            {
              requirement: 'Front-end product development experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I led the front-end rebuild of the Runtastic platform — a Next.js/React migration that cut page-load time by 55%.',
            },
            {
              requirement:
                'Front-end product development focused on sports betting',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Closest is real-money algorithmic trading at StagStrat — live markets, odds, latency and real capital — paired with daily work in live sports data. A licensed sportsbook specifically is the newer part.',
            },
            {
              requirement: 'Passion for the betting industry',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I live sport and real-money markets every day — from a trading platform to a football club — so the instinct is there; betting as a regulated industry is where I'm newest, and keen.",
            },
          ],
        },
        {
          title: 'Delivery & Ways of Working',
          rows: [
            {
              requirement:
                'Proficiency with agile methodologies (Scrum / Kanban)',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years running agile delivery — Scrum and Kanban — in JIRA and Confluence.',
            },
            {
              requirement:
                'Requirements gathering & transformation into work items',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Translating vision into epics with clear acceptance criteria, then verifying delivery against them, is exactly what I do.',
            },
            {
              requirement:
                'Consolidating internal & external tools into a unified experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'My core work: the adidas Global Admin Application unified dozens of internal tools into one shared platform for 1,000+ stakeholders across multiple business units — plus the Sprinklr rebuild and a 50+ market PIM unification. Many tools, one experience.',
            },
            {
              requirement: 'Team leadership & cross-functional collaboration',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "I've led teams of 13+ across three countries and aligned legal, procurement, branding, IT, business and Squad Leads to ship.",
            },
            {
              requirement: 'Excellent written & oral communication',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I report direction and trade-offs to executives and brief squads and stakeholders daily — in three languages.',
            },
            {
              requirement: 'Managing customer releases & go-to-market',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A zero-downtime, three-country platform migration for 165M+ users, plus the go-to-market that carried teams onto it.',
            },
          ],
        },
      ],
    },
    football: {
      chip: 'The sports-data half',
      statusBadge: 'Active — Head of Analytical & Scouting, MFK Ružomberok',
      heading: "Live sports data isn't a line on my CV — it's my other job.",
      body: "Alongside product work, I'm Head of the Analytical & Scouting Department at MFK Ružomberok, in Slovakia's top division. I built PlayerGrade myself — an AI scouting tool now shaping the club's transfer calls — and I lead match analysis, opposition scouting and real-time tactical reporting off live video and tracking data. Genius Sports is built on turning live sports data into products; that's the world I already live in.",
      credentials: [
        'UEFA A Licence',
        'Barça Innovation Hub Certified',
        'Wyscout Proficient',
        'Hudl Proficient',
      ],
      closingLine:
        'Genius turns the fastest, richest live data in sport into experiences fans and bettors feel. I understand that data from the inside — I collect it, model it, and make decisions on it every week.',
    },
    blockchain: {
      chip: 'Betting, honestly',
      heading:
        "I haven't shipped inside a sportsbook — but the adjacent experience is real",
      body: "As Head of Product at StagStrat, an algorithmic trading start-up, I owned a real-money platform built on the same instincts a betting product runs on: live markets, probability and odds, latency that costs you money, and a risk posture strong enough to put real capital on the line. Pair that with living in live sports data every week, and I arrive fluent in both halves of Genius's business. What's newer for me is the regulated sportsbook itself — the compliance, responsible-gambling and operator-side specifics — and I won't pretend otherwise.",
    },
    closing: {
      eyebrow: 'Why Genius',
      heading: 'Two worlds, one intersection',
      body: "Most product managers sit on one side of this — either the platform and the tooling, or the sport and its data. I've spent a career on the first: building front-end products for 165M+ users, shared platforms for 1,000+ internal stakeholders, and consolidating scattered tools into one experience. And I live the second every week, turning live football data into decisions. Genius Sports sits exactly where those two meet — live sports data becoming products people feel in real time. That intersection is rare, and it's where I'm most at home. I'd welcome the chance to bring both to the Platform Experience team in London.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'UEFA A Licence',
        'Slovak · English C2 · Italian B2 · German',
      ],
      signature: 'Lukáš Hošala, based in Italy, ready to relocate to London.',
    },
  },
  it: {
    hero: {
      eyebrow:
        'Genius Sports · Londra · Senior Product Manager, Platform Experience',
      headlineLead:
        'Unire una dozzina di strumenti in un solo prodotto? L’ho fatto, più volte.',
      headlineGradient: 'Solo che non si chiamava ancora Platform Experience.',
      description:
        "Otto anni in adidas a costruire prodotti front-end per oltre 165 milioni di persone — e a costruire la piattaforma di amministrazione condivisa che ha unito decine di strumenti interni frammentati in un'unica esperienza per oltre 1.000 persone nelle diverse business unit dell'azienda. È questo ruolo, quasi alla lettera. Oggi guido il prodotto in una fintech di trading a capitale reale e dirigo il reparto analisi di un club di calcio professionistico, immerso ogni settimana nei dati sportivi in tempo reale. Questa pagina ripercorre come tutto ciò si allinei con quello che Genius Sports sta cercando.",
      chips: [
        'Platform Experience',
        'Prodotto Front-End',
        'Dati sportivi live',
        'Delivery Agile',
      ],
      statsLabel: 'In breve',
      stats: [
        { value: '8+', label: 'Anni in product management' },
        { value: '165M+', label: 'Utenti sulla piattaforma che ho gestito' },
        {
          value: '1000+',
          label: 'Stakeholder su un’unica piattaforma admin che ho costruito',
        },
        { value: '13+', label: 'Persone guidate, in 3 paesi' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Genius cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'unify',
          title: 'Unire gli strumenti in un’unica piattaforma condivisa',
          body: "È esattamente la forma di questo ruolo — ed è il lavoro di cui vado più fiero. In adidas ho gestito la Global Admin Application: un'unica piattaforma condivisa che ha unito decine di strumenti e flussi di lavoro interni scollegati in un'unica interfaccia per oltre 1.000 stakeholder su più business unit. Invece di saltare da un sistema all'altro, i team hanno avuto un'unica esperienza coerente — navigazione, permessi e dati condivisi in un solo posto. Ho ripetuto la stessa mossa sulla piattaforma di social commerce Sprinklr da 1 milione di euro (l'adozione è salita del 30% una volta ricostruita attorno a come i team lavoravano davvero) e su un'unificazione PIM su oltre 50 team di mercato. Portare strumenti interni ed esterni frammentati in un unico prodotto coerente è il lavoro che mi viene affidato di continuo.",
        },
        {
          id: 'vision',
          title: 'Visione e strategia di prodotto con la leadership',
          body: 'Una roadmap conta solo se la leadership ci crede davvero. Ho gestito la roadmap di prodotto di Runtastic — una piattaforma usata da oltre 165 milioni di persone — riportando direzione e trade-off direttamente ai dirigenti, e sto facendo lo stesso adesso come Head of Product in StagStrat e con PlayerGrade, uno strumento di scouting AI che ho costruito e che sta già influenzando le decisioni di mercato di un club di primo livello.',
        },
        {
          id: 'translate',
          title: 'Trasformare la visione in work item',
          body: 'Il ruolo chiede esplicitamente di convertire roadmap ad alto livello in lavoro dettagliato e realizzabile. È la traduzione che faccio ogni giorno: scomporre la strategia in epic con criteri di accettazione chiari, verificare la delivery rispetto alle specifiche e tenere allineati gli squad — in JIRA e Confluence, non solo nelle slide.',
        },
        {
          id: 'metrics',
          title: 'KPI, OKR e allineamento degli stakeholder',
          body: "L'allineamento tiene quando è ancorato ai numeri. Ho definito e riportato OKR e KPI di adozione ai dirigenti in Runtastic, e li ho usati per guidare il cambiamento — l'aumento del 30% nell'adozione e il 100% di adozione guidata dalla formazione su oltre 50 team sono nati gestendo la metrica, non imponendo dall'alto.",
        },
        {
          id: 'market',
          title: 'Leggere il panorama competitivo',
          body: 'Osservare il campo mi viene naturale — lato prodotto tramite analisi di mercato e della concorrenza, e lato calcio in senso letterale: lo scouting degli avversari e l’analisi delle partite su dati di tracking e video in tempo reale è il mio altro lavoro. Trasformare il modo in cui un mercato si muove in una risposta di prodotto è un’abitudine, non un compito.',
        },
        {
          id: 'gtm',
          title: 'Release e go-to-market',
          body: "Ho gestito release verso i clienti in cui fallire non era un'opzione — una migrazione a fasi della piattaforma Runtastic su tre paesi, con zero downtime per oltre 165 milioni di utenti — e ho curato il go-to-market che ha portato i team sulla nuova esperienza senza perderli per strada.",
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
              requirement: 'Almeno 5 anni in Product Management',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni, da Product Owner a Head of Product, dal 2016 al 2025.',
            },
            {
              requirement:
                'Sviluppo della strategia di prodotto e gestione della roadmap',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho gestito la roadmap di una piattaforma da oltre 165 milioni di utenti in Runtastic e definito la strategia di prodotto end-to-end in StagStrat.',
            },
            {
              requirement: 'Solido background analitico / BI',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Decido sulla base di SQL, Google Analytics e PowerBI lato prodotto, e di dati di tracking e video in tempo reale lato calcio.',
            },
            {
              requirement: 'Esperienza di sviluppo di prodotto front-end',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato la ricostruzione front-end della piattaforma Runtastic — una migrazione Next.js/React che ha ridotto del 55% il tempo di caricamento.',
            },
            {
              requirement:
                'Sviluppo di prodotto front-end focalizzato sulle scommesse sportive',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Il più vicino è il trading algoritmico a capitale reale in StagStrat — mercati live, quote, latenza e capitale vero — unito al lavoro quotidiano sui dati sportivi in tempo reale. Uno sportsbook regolamentato nello specifico è la parte più nuova.',
            },
            {
              requirement: 'Passione per il settore delle scommesse',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Vivo lo sport e i mercati a capitale reale ogni giorno — da una piattaforma di trading a un club di calcio — quindi l'istinto c'è; le scommesse come settore regolamentato sono l'ambito in cui sono più nuovo, e curioso.",
            },
          ],
        },
        {
          title: 'Delivery e modo di lavorare',
          rows: [
            {
              requirement:
                'Padronanza delle metodologie agili (Scrum / Kanban)',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni di delivery agile — Scrum e Kanban — in JIRA e Confluence.',
            },
            {
              requirement:
                'Raccolta dei requisiti e trasformazione in work item',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Tradurre la visione in epic con criteri di accettazione chiari, e poi verificare la delivery rispetto ad essi, è esattamente ciò che faccio.',
            },
            {
              requirement:
                "Unire strumenti interni ed esterni in un'esperienza unificata",
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Il mio lavoro centrale: la adidas Global Admin Application ha unito decine di strumenti interni in un'unica piattaforma condivisa per oltre 1.000 stakeholder su più business unit — oltre alla ricostruzione di Sprinklr e a un'unificazione PIM su oltre 50 mercati. Tanti strumenti, un'unica esperienza.",
            },
            {
              requirement:
                'Leadership del team e collaborazione cross-funzionale',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato team di oltre 13 persone in tre paesi e allineato legal, procurement, branding, IT, business e Squad Lead per rilasciare.',
            },
            {
              requirement: 'Ottima comunicazione scritta e orale',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Riporto direzione e trade-off ai dirigenti e informo squad e stakeholder ogni giorno — in tre lingue.',
            },
            {
              requirement:
                'Gestione delle release verso i clienti e del go-to-market',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Una migrazione di piattaforma su tre paesi con zero downtime per oltre 165 milioni di utenti, più il go-to-market che vi ha portato i team.',
            },
          ],
        },
      ],
    },
    football: {
      chip: 'La metà fatta di dati sportivi',
      statusBadge: 'Attivo — Head of Analytical & Scouting, MFK Ružomberok',
      heading:
        'I dati sportivi in tempo reale non sono una riga nel CV — sono il mio altro lavoro.',
      body: "Oltre al lavoro di prodotto, sono Head of Analytical & Scouting Department all'MFK Ružomberok, nella massima serie slovacca. Ho costruito io stesso PlayerGrade — uno strumento di scouting AI che oggi orienta le decisioni di mercato del club — e guido l'analisi delle partite, lo scouting degli avversari e la reportistica tattica in tempo reale su dati video e di tracking. Genius Sports si basa sul trasformare i dati sportivi in tempo reale in prodotti; è il mondo in cui vivo già.",
      credentials: [
        'Licenza UEFA A',
        'Certificazione Barça Innovation Hub',
        'Competenza Wyscout',
        'Competenza Hudl',
      ],
      closingLine:
        'Genius trasforma i dati sportivi più rapidi e ricchi in esperienze che tifosi e scommettitori sentono davvero. Quei dati li capisco dall’interno — li raccolgo, li modello e ci prendo decisioni ogni settimana.',
    },
    blockchain: {
      chip: 'Scommesse, con onestà',
      heading:
        'Non ho lavorato dentro uno sportsbook — ma l’esperienza adiacente è reale',
      body: 'Come Head of Product in StagStrat, una start-up di trading algoritmico, ho gestito una piattaforma a capitale reale costruita sugli stessi istinti su cui gira un prodotto di scommesse: mercati live, probabilità e quote, una latenza che ti costa denaro e una gestione del rischio abbastanza solida da mettere in gioco capitale vero. Unisci questo al vivere ogni settimana immerso nei dati sportivi in tempo reale, e arrivo fluente in entrambe le metà del business di Genius. Ciò che per me è più nuovo è lo sportsbook regolamentato in sé — la compliance, il gioco responsabile e le specificità lato operatore — e non fingerò il contrario.',
    },
    closing: {
      eyebrow: 'Perché Genius',
      heading: 'Due mondi, un solo punto d’incontro',
      body: "La maggior parte dei product manager sta da un lato solo — o la piattaforma e il tooling, o lo sport e i suoi dati. Ho passato una carriera sul primo: costruire prodotti front-end per oltre 165 milioni di utenti, piattaforme condivise per oltre 1.000 stakeholder interni e unire strumenti sparsi in un'unica esperienza. E vivo il secondo ogni settimana, trasformando i dati calcistici in tempo reale in decisioni. Genius Sports sta esattamente dove i due si incontrano — dati sportivi in tempo reale che diventano prodotti che le persone sentono in tempo reale. Quell'incontro è raro, ed è dove mi sento più a casa. Sarei felice di portare entrambe le cose al team Platform Experience a Londra.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Licenza UEFA A',
        'Slovacco · Inglese C2 · Italiano B2 · Tedesco',
      ],
      signature:
        'Lukáš Hošala, basato in Italia, pronto a trasferirmi a Londra.',
    },
  },
  de: {
    hero: {
      eyebrow:
        'Genius Sports · London · Senior Product Manager, Platform Experience',
      headlineLead:
        'Ein Dutzend Tools zu einem Produkt zusammenführen? Das habe ich mehrfach gemacht.',
      headlineGradient: 'Nur hieß es noch nicht Platform Experience.',
      description:
        'Acht Jahre bei adidas, in denen ich Front-End-Produkte für über 165 Millionen Menschen gebaut habe — und die gemeinsame Admin-Plattform aufgebaut habe, die dutzende fragmentierte interne Tools zu einer Experience für über 1.000 Menschen über die Geschäftsbereiche des Unternehmens hinweg zusammenführte. Das ist diese Rolle, fast wortwörtlich. Heute verantworte ich das Produkt bei einer Trading-Fintech mit echtem Kapital und leite die Analyseabteilung eines Profi-Fußballvereins, jede Woche mitten in Live-Sportdaten. Diese Seite zeigt, wie das alles zu dem passt, was Genius Sports sucht.',
      chips: [
        'Platform Experience',
        'Front-End-Produkt',
        'Live-Sportdaten',
        'Agile Delivery',
      ],
      statsLabel: 'Auf einen Blick',
      stats: [
        { value: '8+', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer auf der Plattform, die ich verantwortet habe',
        },
        {
          value: '1000+',
          label: 'Stakeholder auf einer Admin-Plattform, die ich gebaut habe',
        },
        { value: '13+', label: 'Geführte Personen, in 3 Ländern' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was Genius sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'unify',
          title: 'Tools zu einer gemeinsamen Plattform zusammenführen',
          body: 'Das ist exakt der Zuschnitt der Rolle — und die Arbeit, auf die ich am stolzesten bin. Bei adidas habe ich die Global Admin Application verantwortet: eine einzige gemeinsame Plattform, die dutzende getrennte interne Tools und Workflows in einer Oberfläche für über 1.000 Stakeholder über mehrere Geschäftsbereiche hinweg zusammenführte. Statt zwischen Systemen zu springen, bekamen die Teams eine konsistente Experience — gemeinsame Navigation, Berechtigungen und Daten an einem Ort. Denselben Ansatz habe ich auf der 1-Mio.-€-Social-Commerce-Plattform Sprinklr wiederholt (die Nutzung stieg um 30%, nachdem sie um die tatsächliche Arbeitsweise der Teams herum neu aufgebaut war) und bei einer PIM-Vereinheitlichung über mehr als 50 Marktteams. Fragmentierte interne und externe Tools zu einem stimmigen Produkt zusammenzuführen, ist die Arbeit, die mir immer wieder anvertraut wird.',
        },
        {
          id: 'vision',
          title: 'Produktvision & -strategie mit der Führungsebene',
          body: 'Eine Roadmap zählt nur, wenn die Führungsebene wirklich dahintersteht. Ich habe die Produkt-Roadmap von Runtastic verantwortet — einer Plattform mit über 165 Millionen Nutzern — und Richtung sowie Trade-offs direkt an die Führungsebene berichtet. Genau das mache ich jetzt als Head of Product bei StagStrat und mit PlayerGrade, einem KI-Scouting-Tool, das ich gebaut habe und das bereits Transferentscheidungen bei einem Erstligaverein mitgestaltet.',
        },
        {
          id: 'translate',
          title: 'Vision in Arbeitspakete übersetzen',
          body: 'Die Rolle verlangt ausdrücklich, übergeordnete Roadmaps in detaillierte, umsetzbare Arbeit zu übersetzen. Diese Übersetzung ist mein Tagesgeschäft: Strategie in Epics mit klaren Akzeptanzkriterien zerlegen, die Lieferung gegen die Spezifikation prüfen und die Squads ausgerichtet halten — in JIRA und Confluence, nicht nur in Folien.',
        },
        {
          id: 'metrics',
          title: 'KPIs, OKRs & Stakeholder-Ausrichtung',
          body: 'Ausrichtung hält, wenn sie an Zahlen verankert ist. Bei Runtastic habe ich OKRs und Adoptions-KPIs gesetzt und an die Führungsebene berichtet — und sie genutzt, um Veränderung voranzutreiben: Der Anstieg der Nutzung um 30% und die 100-prozentige schulungsgestützte Einführung über mehr als 50 Teams entstanden beide durch das Steuern über die Kennzahl, nicht durch Anordnung von oben.',
        },
        {
          id: 'market',
          title: 'Das Wettbewerbsumfeld lesen',
          body: 'Das Feld zu beobachten ist für mich selbstverständlich — auf der Produktseite über Markt- und Wettbewerbsanalyse, und auf der Fußballseite ganz wörtlich: Gegner-Scouting und Spielanalyse anhand von Live-Tracking- und Videodaten ist mein anderer Job. Aus der Bewegung eines Marktes eine Produktantwort zu machen, ist Gewohnheit, keine Aufgabe.',
        },
        {
          id: 'gtm',
          title: 'Releases & Go-to-Market',
          body: 'Ich habe Kunden-Releases verantwortet, bei denen Scheitern keine Option war — eine stufenweise Migration der Runtastic-Plattform über drei Länder mit null Ausfallzeit für über 165 Millionen Nutzer — und das Go-to-Market gesteuert, das die Teams auf die neue Experience gebracht hat, ohne sie unterwegs zu verlieren.',
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
              requirement: 'Mindestens 5 Jahre im Produktmanagement',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product, 2016 bis 2025.',
            },
            {
              requirement: 'Produktstrategie-Entwicklung & Roadmap-Management',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe die Roadmap einer Plattform mit über 165 Mio. Nutzern bei Runtastic verantwortet und bei StagStrat die Produktstrategie end-to-end gesetzt.',
            },
            {
              requirement: 'Fundierter Analytics- / BI-Hintergrund',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich entscheide produktseitig anhand von SQL, Google Analytics und PowerBI, und fußballseitig anhand von Live-Tracking- und Videodaten.',
            },
            {
              requirement: 'Erfahrung in der Front-End-Produktentwicklung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe den Front-End-Neuaufbau der Runtastic-Plattform geleitet — eine Next.js/React-Migration, die die Ladezeit um 55% senkte.',
            },
            {
              requirement:
                'Front-End-Produktentwicklung mit Fokus auf Sportwetten',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Am nächsten kommt algorithmisches Trading mit echtem Kapital bei StagStrat — Live-Märkte, Quoten, Latenz und echtes Kapital — gepaart mit täglicher Arbeit an Live-Sportdaten. Ein lizenzierter Sportsbook im Speziellen ist der neuere Teil.',
            },
            {
              requirement: 'Leidenschaft für die Wettbranche',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich lebe Sport und Märkte mit echtem Kapital jeden Tag — von einer Trading-Plattform bis zu einem Fußballverein — der Instinkt ist also da; Wetten als regulierte Branche ist der Bereich, in dem ich am neuesten bin, und neugierig.',
            },
          ],
        },
        {
          title: 'Umsetzung & Arbeitsweise',
          rows: [
            {
              requirement:
                'Sicherer Umgang mit agilen Methoden (Scrum / Kanban)',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre agile Delivery — Scrum und Kanban — in JIRA und Confluence.',
            },
            {
              requirement: 'Anforderungserhebung & Umwandlung in Arbeitspakete',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Vision in Epics mit klaren Akzeptanzkriterien zu übersetzen und die Lieferung dagegen zu prüfen, ist genau das, was ich tue.',
            },
            {
              requirement:
                'Interne & externe Tools zu einer einheitlichen Experience zusammenführen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Meine Kernarbeit: Die adidas Global Admin Application vereinte dutzende interne Tools zu einer gemeinsamen Plattform für über 1.000 Stakeholder über mehrere Geschäftsbereiche — dazu der Sprinklr-Neuaufbau und eine PIM-Vereinheitlichung über mehr als 50 Märkte. Viele Tools, eine Experience.',
            },
            {
              requirement:
                'Teamführung & funktionsübergreifende Zusammenarbeit',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe Teams von über 13 Personen in drei Ländern geführt und Legal, Procurement, Branding, IT, Business und Squad Leads zum Release ausgerichtet.',
            },
            {
              requirement:
                'Ausgezeichnete schriftliche & mündliche Kommunikation',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich berichte Richtung und Trade-offs an die Führungsebene und briefe Squads und Stakeholder täglich — in drei Sprachen.',
            },
            {
              requirement: 'Steuerung von Kunden-Releases & Go-to-Market',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Eine Plattform-Migration über drei Länder mit null Ausfallzeit für über 165 Mio. Nutzer, plus das Go-to-Market, das die Teams darauf brachte.',
            },
          ],
        },
      ],
    },
    football: {
      chip: 'Die Sportdaten-Hälfte',
      statusBadge: 'Aktiv — Head of Analytical & Scouting, MFK Ružomberok',
      heading:
        'Live-Sportdaten sind keine Zeile im Lebenslauf — sie sind mein anderer Job.',
      body: 'Neben der Produktarbeit bin ich Head of Analytical & Scouting Department bei MFK Ružomberok, in der höchsten slowakischen Spielklasse. Ich habe PlayerGrade selbst entwickelt — ein KI-Scouting-Tool, das mittlerweile die Transferentscheidungen des Vereins mitgestaltet — und leite die Spielanalyse, das Gegner-Scouting und die taktische Echtzeit-Berichterstattung anhand von Live-Video- und Tracking-Daten. Genius Sports lebt davon, Live-Sportdaten in Produkte zu verwandeln; das ist die Welt, in der ich ohnehin schon lebe.',
      credentials: [
        'UEFA-A-Lizenz',
        'Barça Innovation Hub zertifiziert',
        'Wyscout-Kenntnisse',
        'Hudl-Kenntnisse',
      ],
      closingLine:
        'Genius macht aus den schnellsten und reichhaltigsten Live-Daten im Sport Erlebnisse, die Fans und Wettende wirklich spüren. Diese Daten verstehe ich von innen — ich erhebe sie, modelliere sie und treffe jede Woche Entscheidungen auf ihrer Basis.',
    },
    blockchain: {
      chip: 'Wetten, ehrlich gesagt',
      heading:
        'Ich habe nicht in einem Sportsbook gearbeitet — aber die angrenzende Erfahrung ist real',
      body: 'Als Head of Product bei StagStrat, einem Start-up für algorithmischen Handel, habe ich eine Plattform mit echtem Kapital verantwortet, die auf denselben Instinkten beruht wie ein Wettprodukt: Live-Märkte, Wahrscheinlichkeit und Quoten, eine Latenz, die Geld kostet, und eine Risikohaltung, die stark genug ist, echtes Kapital einzusetzen. Kombiniert mit dem wöchentlichen Leben in Live-Sportdaten komme ich in beiden Hälften des Genius-Geschäfts fließend an. Neuer ist für mich der regulierte Sportsbook selbst — Compliance, verantwortungsvolles Spielen und die betreiberseitigen Besonderheiten — und ich werde nicht so tun, als wäre es anders.',
    },
    closing: {
      eyebrow: 'Warum Genius',
      heading: 'Zwei Welten, ein Schnittpunkt',
      body: 'Die meisten Produktmanager sitzen nur auf einer Seite — entweder Plattform und Tooling, oder Sport und seine Daten. Ich habe eine Karriere lang die erste gemacht: Front-End-Produkte für über 165 Millionen Nutzer gebaut, gemeinsame Plattformen für über 1.000 interne Stakeholder, und verstreute Tools zu einer Experience zusammengeführt. Und die zweite lebe ich jede Woche, indem ich Live-Fußballdaten in Entscheidungen verwandle. Genius Sports sitzt genau dort, wo sich beide treffen — Live-Sportdaten, die in Echtzeit zu Produkten werden, die Menschen spüren. Dieser Schnittpunkt ist selten, und dort bin ich am meisten zu Hause. Ich würde mich freuen, beides ins Platform-Experience-Team in London einzubringen.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'UEFA-A-Lizenz',
        'Slowakisch · Englisch C2 · Italienisch B2 · Deutsch',
      ],
      signature:
        'Lukáš Hošala, wohnhaft in Italien, bereit für den Umzug nach London.',
    },
  },
}
