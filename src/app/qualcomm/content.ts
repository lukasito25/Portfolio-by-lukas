export type Locale = 'en' | 'it' | 'de'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'vision'
    | 'translate'
    | 'constraints'
    | 'devtools'
    | 'gtm'
    | 'lifecycle'
    | 'ecosystem'
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

export interface QualcommContent {
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
  /** Standout credential panel — here: building AI solutions hands-on. */
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

export const qualcommContent: Record<Locale, QualcommContent> = {
  en: {
    hero: {
      eyebrow: 'Qualcomm · Arduino · Turin, Italy · AI Product Manager',
      headlineLead:
        'Making complicated technology feel obvious is the entire job.',
      headlineGradient:
        "I've done it for 165 million users — and I build AI solutions myself.",
      description:
        "Eight years of product management at adidas, where I owned a platform used by 165M+ people and built the shared developer-facing tooling behind it. Today I'm Head of Product at an algorithmic trading fintech, where models run against real money under real latency budgets — and I built PlayerGrade, an AI scouting tool I trained and deployed on Google AI Studio and Vertex AI, now shaping transfer decisions at a professional football club. I already live in Italy. This page maps all of that against the Arduino AI Product Manager role, honestly — including the parts where I don't match yet.",
      chips: [
        'Edge AI Products',
        'Vertex AI · AI Studio',
        'Developer Tools',
        'Open Ecosystems',
        'Based in Italy',
      ],
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '165M+', label: 'Users on the platform I owned' },
        { value: '1000+', label: 'Stakeholders on the tooling I built' },
        { value: '13+', label: 'People led, across 3 countries' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What Arduino is asking for — and where I've already done it",
      items: [
        {
          id: 'vision',
          title: 'One roadmap across four very different audiences',
          body: "The role asks for a single AI roadmap serving Education, Maker, Professional and Industrial at once — four segments with opposite tolerances for complexity. That tension is familiar: at adidas I owned a product used by 165M+ consumers while simultaneously owning the internal platform that 1,000+ professionals across the company's business units worked in every day. Same organisation, same roadmap, wildly different users — a beginner who must succeed in five minutes, and an expert who needs depth and control. Deciding what each group gets, what they share, and what gets deliberately hidden from whom is the work I keep being handed.",
        },
        {
          id: 'translate',
          title: 'Turning hard AI into something people can actually use',
          body: "Translating LLMs, vision models and on-device inference into a product a teacher or a maker can ship on a Tuesday is a communication problem as much as a technical one. I've spent a career on that translation in both directions: explaining model behaviour and trade-offs to executives who fund it, and turning research-shaped capability into interfaces normal people succeed with. With PlayerGrade I did both ends myself — I trained and evaluated the models on Vertex AI, then had to make the output trustworthy enough for users with no interest in how any of it works.",
        },
        {
          id: 'constraints',
          title: 'Defining requirements against real constraints',
          body: "Inference speed, memory footprint and power budget are exactly the kind of constraints I already write requirements against — I've just been writing them for latency and cost instead of milliwatts. At StagStrat, latency is money: a model that answers too slowly is wrong regardless of how good it is, so specs get written as performance budgets, not feature lists. At Runtastic the same discipline cut page-load time by 55% in a front-end rebuild. Sitting with engineers to trade accuracy against speed against footprint is a conversation I've had many times, in a different unit.",
        },
        {
          id: 'devtools',
          title: 'Developer tools, docs and the experience around the product',
          body: 'The role puts real weight on developer resources — examples, tutorials, benchmarking kits, troubleshooting guides — and on AI-assisted tooling like code generation and model suggestion. Building for developers and technical operators is my core track record: the adidas Global Admin Application pulled dozens of disconnected internal tools into one interface for 1,000+ stakeholders, and a PIM unification across 50+ market teams reached 100% adoption because the documentation and training were treated as part of the product, not an afterthought.',
        },
        {
          id: 'gtm',
          title: 'Positioning, pricing and coordinated launches',
          body: "I've run launches where failure was not an option — a staged migration of the Runtastic platform across three countries with zero downtime for 165M+ users — and owned the go-to-market that actually carried people onto the new thing. On the €1M Sprinklr social-commerce platform, adoption rose 30% once positioning and enablement were rebuilt around how teams really worked. Aligning engineering, content, marketing and operations onto one launch date is routine, not novel.",
        },
        {
          id: 'lifecycle',
          title: 'Lifecycle: KPIs, platform transitions and end-of-life',
          body: 'Owning a product past launch — tracking usage data and business KPIs, deciding when to invest, when to migrate and when to sunset — is where most of my career has actually been spent. The three-country Runtastic migration was a platform transition with an end-of-life plan attached: a legacy stack retired without a single user noticing. I set and reported OKRs and adoption KPIs to executives, and used them to steer the roadmap rather than to decorate it.',
        },
        {
          id: 'ecosystem',
          title: 'Partners, OEMs and a community that will tell you the truth',
          body: "Arduino's ecosystem is its moat — millions of developers who are vocal, opinionated and quick to notice when something is designed badly. I've spent years gathering requirements from parties who don't report to me and turning them into specifications: 50+ global market teams, external vendors, legal, procurement and IT, plus 13+ people across three countries. And PlayerGrade taught me the same lesson from the other side — expert users will tell you within a minute if a tool doesn't respect how they work.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'Product, Delivery & The Basics',
          rows: [
            {
              requirement: '5+ years of Product Management experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product, 2016 to 2025.',
            },
            {
              requirement:
                "Bachelor's in Engineering, Information Systems, Computer Science, Humanities or related",
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'BSc plus a CMI Level 7 Diploma in Strategic Management and MBA Global from the University of Derby.',
            },
            {
              requirement: 'Define and manage a product roadmap end-to-end',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned the roadmap for a 165M+ user platform at Runtastic and set product strategy end-to-end at StagStrat.',
            },
            {
              requirement:
                'Drive cross-functional projects in international teams',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Led 13+ people across three countries and aligned engineering, legal, procurement, branding, IT and business to ship.',
            },
            {
              requirement:
                'Excellent communication; simplify complex topics for varied audiences',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I report direction and trade-offs to executives and brief engineers daily — in three languages, and for both 165M consumers and 1,000+ internal experts.',
            },
            {
              requirement: 'Lifecycle ownership incl. transitions and EOL',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A staged three-country platform migration that retired a legacy stack with zero downtime for 165M+ users.',
            },
            {
              requirement: 'Go-to-market, positioning and pricing input',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned go-to-market and enablement on a €1M platform rollout; adoption rose 30% after repositioning.',
            },
            {
              requirement: 'Fluency in English; Italian a strong plus',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2, Italian B2 and resident in Italy — plus Slovak and German. This page is written in three of them.',
            },
            {
              requirement: 'Based in Turin or remote within Italy',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I already live near Florence. No relocation, no visa, no notice period spent moving countries — and Turin is a direct three-hour train ride, which works cleanly for a remote-first role with regular time in the office.',
            },
            {
              requirement:
                'Occasional travel for partners, events and customers',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years of working across Austria, the Netherlands and the UK from a home base elsewhere. Travel is normal to me.',
            },
          ],
        },
        {
          title: 'AI, Edge & Silicon',
          rows: [
            {
              requirement:
                'Product Management experience specifically in AI, ML or edge computing',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I've built and shipped two model-driven products — PlayerGrade, an AI scouting tool I trained on Google AI Studio and Vertex AI and put into live use at a professional football club, and a real-money algorithmic trading platform — but my job title has said Product Manager, not AI Product Manager. The work is real; the label is newer.",
            },
            {
              requirement:
                'Technical background in AI/ML — GenAI (LLMs/LVMs) and classical models (CNN/RNN/LSTM)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I build with models rather than research them: I train, tune and evaluate them on Google AI Studio and Vertex AI, and I judge model behaviour on real output every week. I can hold a serious conversation about deployment and architecture trade-offs — I can't claim to have authored a novel architecture or trained a U-Net from scratch.",
            },
            {
              requirement:
                'Deployment and performance focus over model novelty',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "This is the half I'm strongest on. Everything I've shipped was judged on whether it ran fast enough, reliably enough, at a cost that made sense — never on how clever the model was.",
            },
            {
              requirement:
                'Understanding of on-device inference constraints (latency, memory, power)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Latency-critical, resource-bounded systems are daily work at StagStrat, and a 55% page-load reduction at Runtastic came from exactly this discipline. Milliwatts and MCU memory ceilings are the new variables, not the new concept.',
            },
            {
              requirement:
                'Edge AI toolchains: model conversion, quantization, profiling, benchmarking',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "Honest answer: I have not owned a quantization or benchmarking pipeline. I understand what these steps do and why they decide whether a product is viable, but I'd be learning the tooling hands-on in my first weeks.",
            },
            {
              requirement:
                'Knowledge of NPU/accelerator architectures and SoC integration',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "My weakest area, and the one I won't dress up. I've worked closely with engineers on architecture and performance constraints, but never on silicon roadmaps or accelerator integration.",
            },
            {
              requirement:
                'Frameworks: TensorFlow Lite, ONNX, OpenVINO, embedded inference engines',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Familiar as concepts and from the Python/ML ecosystem I build in; not from having shipped an embedded deployment pipeline.',
            },
            {
              requirement:
                'Writing and reviewing technical content: docs, benchmarks, tutorials',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I write specifications, acceptance criteria and enablement material as part of the product — the PIM rollout hit 100% adoption across 50+ market teams because the documentation was treated as a deliverable.',
            },
            {
              requirement:
                'Open-source experience and community-driven ecosystems',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I build on open source constantly — Python, FastAPI, Next.js, PostgreSQL, and this page — and I've worked with large, opinionated expert communities. Being a maintainer inside a community-governed project is genuinely new to me.",
            },
            {
              requirement:
                'Hands-on with TinyML, microcontrollers or constrained devices',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "Listed as bonus points, and I'd be starting from the shallow end. I build software end-to-end and learn technical stacks fast, but I won't claim board-level experience I don't have.",
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The hands-on half',
      statusBadge:
        'Active — PlayerGrade, built on Google AI Studio & Vertex AI',
      heading:
        "I don't only write AI requirements. I build the solutions, and I train the models.",
      body: "PlayerGrade is mine. It's an AI scouting tool that ingests match, tracking and video data, scores player performance, and now feeds the transfer decisions of a professional football club. I built it on Google AI Studio and Vertex AI — prototyping and evaluating in AI Studio, then training, tuning and serving custom models on Vertex. Let me be precise about what that means, because the distinction matters: I'm not authoring novel architectures. I'm assembling, training and deploying models on a managed AI suite and taking the result all the way to production — which is exactly the skill Arduino's users will need. The hard part was never the modelling; it was making the output trustworthy enough for people with no interest whatsoever in how it works. At StagStrat I do the same at higher stakes: a model-driven trading platform in Python and FastAPI where being slow is indistinguishable from being wrong. Arduino is hiring someone to make AI deployable by people who didn't build it. I've been on both sides of that handover.",
      credentials: [
        'PlayerGrade — AI scouting tool, self-built',
        'Google AI Studio · Vertex AI',
        'ML training, tuning & evaluation',
        'Python · FastAPI · PostgreSQL',
        'StagStrat — model-driven trading',
      ],
      closingLine:
        "Arduino's whole promise is that intelligence at the edge should be within reach of someone who isn't an ML researcher. That is precisely who I am — technical enough to train and ship a model on a managed platform, close enough to the user to know when it's still too hard.",
    },
    gap: {
      chip: 'Silicon, honestly',
      heading:
        "I haven't shipped an NPU toolchain — and I'm not going to pretend the gap isn't there",
      body: "The parts of this role I can't yet evidence are specific and I'd rather name them than bury them: quantization and model-conversion pipelines, profiling and benchmarking on-device, NPU and accelerator architectures, SoC integration, and hands-on TinyML on microcontrollers. I've never owned any of those. What I do bring is the thing that's harder to teach — nine years of deciding what to build for wildly different users, shipping model-driven products under hard performance constraints, and the technical depth to train and ship them myself on a managed AI platform rather than only describe them. Silicon-side fluency is a first-quarter problem, and I'd rather join a team that can tell whether I'm closing it than talk my way past the question now.",
    },
    closing: {
      eyebrow: 'Why Arduino, why now',
      heading: 'A mission I already believe in, in a country I already live in',
      body: "Arduino's mission — making genuinely hard technology reachable for 33 million developers, students and makers — is a restatement of what I've spent my career doing: taking something complex and making it feel obvious, first for 165 million consumers, then for the 1,000+ professionals inside the tooling. Now Qualcomm's silicon sits underneath it, and the question becomes how edge AI stops being a specialist discipline and becomes something you can just build with. That's the most interesting product problem I know of in Italy right now, and it's a three-hour train ride from where I already live near Florence — comfortably close enough for the office visits this role actually needs. I'd bring nine years of product judgement, the habit of building and training the thing myself, and an honest map of what I still have to learn.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Slovak · English C2 · Italian B2 · German',
        'Resident in Italy — Turin or remote',
      ],
      signature:
        'Lukáš Hošala — based near Florence, ready for remote within Italy with regular time in Turin. No relocation required.',
    },
  },
  it: {
    hero: {
      eyebrow: 'Qualcomm · Arduino · Torino, Italia · AI Product Manager',
      headlineLead:
        'Rendere ovvia una tecnologia complicata è tutto il lavoro.',
      headlineGradient:
        "L'ho fatto per 165 milioni di utenti — e le soluzioni AI me le costruisco da solo.",
      description:
        'Otto anni di product management in adidas, dove ho gestito una piattaforma usata da oltre 165 milioni di persone e costruito gli strumenti interni che ci stavano dietro. Oggi sono Head of Product in una fintech di trading algoritmico, dove i modelli girano su capitale reale con budget di latenza reali — e ho costruito PlayerGrade, uno strumento di scouting AI che ho addestrato e messo in produzione su Google AI Studio e Vertex AI, e che oggi orienta le decisioni di mercato di un club di calcio professionistico. Vivo già in Italia. Questa pagina mette tutto questo a confronto con il ruolo di AI Product Manager in Arduino, con onestà — comprese le parti in cui ancora non corrispondo.',
      chips: [
        'Prodotti Edge AI',
        'Vertex AI · AI Studio',
        'Strumenti per sviluppatori',
        'Ecosistemi aperti',
        'Residente in Italia',
      ],
      stats: [
        { value: '8+', label: 'Anni in product management' },
        { value: '165M+', label: 'Utenti sulla piattaforma che ho gestito' },
        {
          value: '1000+',
          label: 'Stakeholder sugli strumenti che ho costruito',
        },
        { value: '13+', label: 'Persone guidate, in 3 paesi' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Arduino cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'vision',
          title: 'Una sola roadmap per quattro pubblici molto diversi',
          body: "Il ruolo chiede un'unica roadmap AI che serva contemporaneamente Education, Maker, Professional e Industrial — quattro segmenti con tolleranze opposte alla complessità. È una tensione che conosco: in adidas gestivo un prodotto usato da oltre 165 milioni di consumatori e, allo stesso tempo, la piattaforma interna in cui oltre 1.000 professionisti delle diverse business unit lavoravano ogni giorno. Stessa azienda, stessa roadmap, utenti completamente diversi — un principiante che deve riuscirci in cinque minuti e un esperto che ha bisogno di profondità e controllo. Decidere cosa dare a ciascun gruppo, cosa condividere e cosa nascondere deliberatamente a chi è il lavoro che mi viene affidato di continuo.",
        },
        {
          id: 'translate',
          title: "Trasformare l'AI difficile in qualcosa di davvero usabile",
          body: "Tradurre LLM, modelli di visione e inferenza on-device in un prodotto che un insegnante o un maker possa usare subito è un problema di comunicazione tanto quanto di tecnica. Ho passato una carriera a fare questa traduzione in entrambe le direzioni: spiegare comportamento e trade-off dei modelli ai dirigenti che li finanziano, e trasformare capacità in forma di ricerca in interfacce con cui le persone normali riescono. Con PlayerGrade ho fatto entrambi i lati da solo — ho addestrato e valutato i modelli su Vertex AI, e poi ho dovuto rendere l'output abbastanza affidabile per utenti a cui non interessa minimamente come funziona.",
        },
        {
          id: 'constraints',
          title: 'Definire requisiti contro vincoli reali',
          body: "Velocità di inferenza, footprint di memoria e consumo energetico sono esattamente il tipo di vincoli su cui già scrivo requisiti — solo che finora li ho scritti per latenza e costo invece che per milliwatt. In StagStrat la latenza è denaro: un modello che risponde troppo lentamente è sbagliato per quanto sia buono, quindi le specifiche si scrivono come budget di performance, non come liste di funzionalità. In Runtastic la stessa disciplina ha ridotto del 55% il tempo di caricamento in una ricostruzione front-end. Sedermi con gli ingegneri per bilanciare accuratezza, velocità e footprint è una conversazione che ho già avuto molte volte, in un'altra unità di misura.",
        },
        {
          id: 'devtools',
          title:
            'Strumenti per sviluppatori, documentazione ed esperienza attorno al prodotto',
          body: "Il ruolo dà peso reale alle risorse per sviluppatori — esempi, tutorial, kit di benchmark, guide alla risoluzione dei problemi — e agli strumenti assistiti dall'AI come la generazione di codice e i sistemi di suggerimento dei modelli. Costruire per sviluppatori e operatori tecnici è il mio percorso principale: la adidas Global Admin Application ha unito decine di strumenti interni scollegati in un'unica interfaccia per oltre 1.000 stakeholder, e un'unificazione PIM su oltre 50 team di mercato ha raggiunto il 100% di adozione perché documentazione e formazione sono state trattate come parte del prodotto, non come un ripensamento.",
        },
        {
          id: 'gtm',
          title: 'Posizionamento, pricing e lanci coordinati',
          body: "Ho gestito lanci in cui fallire non era un'opzione — una migrazione a fasi della piattaforma Runtastic su tre paesi, con zero downtime per oltre 165 milioni di utenti — e curato il go-to-market che ha davvero portato le persone sulla cosa nuova. Sulla piattaforma di social commerce Sprinklr da 1 milione di euro, l'adozione è salita del 30% una volta che posizionamento e abilitazione sono stati ricostruiti attorno a come i team lavoravano davvero. Allineare engineering, contenuti, marketing e operations su un'unica data di lancio è routine, non una novità.",
        },
        {
          id: 'lifecycle',
          title: 'Ciclo di vita: KPI, transizioni di piattaforma e fine vita',
          body: 'Gestire un prodotto oltre il lancio — monitorare dati di utilizzo e KPI di business, decidere quando investire, quando migrare e quando dismettere — è dove ho passato gran parte della mia carriera. La migrazione Runtastic su tre paesi era una transizione di piattaforma con un piano di fine vita allegato: uno stack legacy dismesso senza che un solo utente se ne accorgesse. Ho definito e riportato OKR e KPI di adozione ai dirigenti, usandoli per guidare la roadmap e non per decorarla.',
        },
        {
          id: 'ecosystem',
          title: 'Partner, OEM e una community che ti dice la verità',
          body: "L'ecosistema di Arduino è il suo vantaggio competitivo — milioni di sviluppatori vocali, con opinioni forti e rapidissimi ad accorgersi quando qualcosa è progettato male. Ho passato anni a raccogliere requisiti da soggetti che non rispondono a me e a trasformarli in specifiche: oltre 50 team di mercato globali, fornitori esterni, legal, procurement e IT, più oltre 13 persone in tre paesi. E PlayerGrade mi ha insegnato la stessa lezione dall'altro lato — gli utenti esperti ti dicono nel giro di un minuto se uno strumento non rispetta il loro modo di lavorare.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Prodotto, delivery e requisiti di base',
          rows: [
            {
              requirement: 'Almeno 5 anni di esperienza in Product Management',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni, da Product Owner a Head of Product, dal 2016 al 2025.',
            },
            {
              requirement:
                'Laurea in Ingegneria, Sistemi Informativi, Informatica, discipline umanistiche o affini',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Laurea triennale, più un CMI Level 7 Diploma in Strategic Management e un MBA Global della University of Derby.',
            },
            {
              requirement:
                'Definire e gestire una roadmap di prodotto end-to-end',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho gestito la roadmap di una piattaforma da oltre 165 milioni di utenti in Runtastic e definito la strategia di prodotto end-to-end in StagStrat.',
            },
            {
              requirement:
                'Guidare progetti cross-funzionali in team internazionali',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato oltre 13 persone in tre paesi e allineato engineering, legal, procurement, branding, IT e business per rilasciare.',
            },
            {
              requirement:
                'Ottima comunicazione; semplificare temi complessi per pubblici diversi',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Riporto direzione e trade-off ai dirigenti e parlo con gli ingegneri ogni giorno — in tre lingue, e sia per 165 milioni di consumatori sia per oltre 1.000 esperti interni.',
            },
            {
              requirement:
                'Gestione del ciclo di vita, incluse transizioni e fine vita',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Una migrazione di piattaforma a fasi su tre paesi che ha dismesso uno stack legacy con zero downtime per oltre 165 milioni di utenti.',
            },
            {
              requirement:
                'Go-to-market, posizionamento e contributo al pricing',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Ho curato go-to-market e abilitazione su un rollout da 1 milione di euro; l'adozione è salita del 30% dopo il riposizionamento.",
            },
            {
              requirement: "Fluenza in inglese; l'italiano è un forte plus",
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2, italiano B2 e residenza in Italia — oltre a slovacco e tedesco. Questa pagina è scritta in tre di queste lingue.',
            },
            {
              requirement: 'Sede a Torino o da remoto in Italia',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Vivo già vicino a Firenze. Nessun trasferimento, nessun visto, nessun preavviso speso a cambiare paese — e Torino è a tre ore di treno diretto, il che funziona bene per un ruolo remote-first con presenze regolari in ufficio.',
            },
            {
              requirement:
                'Disponibilità a viaggiare occasionalmente per partner, eventi e clienti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Otto anni di lavoro tra Austria, Paesi Bassi e Regno Unito partendo da una base altrove. Viaggiare per me è normale.',
            },
          ],
        },
        {
          title: 'AI, edge e silicio',
          rows: [
            {
              requirement:
                'Esperienza di Product Management specificamente in AI, ML o edge computing',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Ho costruito e rilasciato due prodotti basati su modelli — PlayerGrade, uno strumento di scouting AI che ho addestrato su Google AI Studio e Vertex AI e portato in uso reale in un club di calcio professionistico, e una piattaforma di trading algoritmico a capitale reale — ma il mio titolo diceva Product Manager, non AI Product Manager. Il lavoro è reale; è l’etichetta a essere più recente.',
            },
            {
              requirement:
                'Background tecnico in AI/ML — GenAI (LLM/LVM) e modelli classici (CNN/RNN/LSTM)',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Costruisco con i modelli, non li ricerco: li addestro, li affino e li valuto su Google AI Studio e Vertex AI, e ne giudico il comportamento sull'output reale ogni settimana. Posso sostenere una conversazione seria sui trade-off di deployment e architettura — non posso dire di aver ideato un'architettura nuova né addestrato una U-Net da zero.",
            },
            {
              requirement:
                'Focus su deployment e performance più che sulla novità del modello',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'È la metà in cui sono più forte. Tutto ciò che ho rilasciato è stato giudicato sul fatto che girasse abbastanza in fretta, in modo abbastanza affidabile, a un costo sensato — mai su quanto fosse ingegnoso il modello.',
            },
            {
              requirement:
                'Comprensione dei vincoli di inferenza on-device (latenza, memoria, energia)',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Sistemi critici per la latenza e limitati nelle risorse sono lavoro quotidiano in StagStrat, e il 55% di riduzione del tempo di caricamento in Runtastic è nato esattamente da questa disciplina. I milliwatt e i limiti di memoria di un MCU sono le variabili nuove, non il concetto.',
            },
            {
              requirement:
                'Toolchain Edge AI: conversione dei modelli, quantizzazione, profiling, benchmarking',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Risposta onesta: non ho mai gestito una pipeline di quantizzazione o di benchmarking. Capisco cosa fanno questi passaggi e perché decidono se un prodotto è sostenibile, ma imparerei gli strumenti sul campo nelle prime settimane.',
            },
            {
              requirement:
                'Conoscenza delle architetture NPU/acceleratori e integrazione SoC',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "L'area in cui sono più debole, e quella che non voglio abbellire. Ho lavorato a stretto contatto con ingegneri su architettura e vincoli di performance, ma mai su roadmap di silicio o integrazione di acceleratori.",
            },
            {
              requirement:
                'Framework: TensorFlow Lite, ONNX, OpenVINO, motori di inferenza embedded',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Li conosco come concetti e dall'ecosistema Python/ML in cui costruisco; non per aver rilasciato una pipeline di deployment embedded.",
            },
            {
              requirement:
                'Scrivere e revisionare contenuti tecnici: documentazione, benchmark, tutorial',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Scrivo specifiche, criteri di accettazione e materiali di abilitazione come parte del prodotto — il rollout PIM ha raggiunto il 100% di adozione su oltre 50 team di mercato proprio perché la documentazione era un deliverable.',
            },
            {
              requirement:
                'Esperienza open-source ed ecosistemi guidati dalla community',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Costruisco costantemente su open source — Python, FastAPI, Next.js, PostgreSQL, e questa pagina — e ho lavorato con grandi community di esperti dalle opinioni forti. Essere maintainer dentro un progetto governato dalla community è però davvero nuovo per me.',
            },
            {
              requirement:
                'Esperienza pratica con TinyML, microcontrollori o dispositivi vincolati',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Elencata tra i bonus, e partirei dal livello base. Costruisco software end-to-end e imparo in fretta gli stack tecnici, ma non rivendicherò esperienza a livello di board che non ho.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'La metà pratica',
      statusBadge:
        'Attivo — PlayerGrade, costruito su Google AI Studio e Vertex AI',
      heading:
        'Non scrivo soltanto requisiti per prodotti AI. Costruisco le soluzioni e addestro i modelli.',
      body: "PlayerGrade è mio. È uno strumento di scouting AI che acquisisce dati di partita, tracking e video, valuta la performance dei giocatori e oggi alimenta le decisioni di mercato di un club di calcio professionistico. L'ho costruito su Google AI Studio e Vertex AI — prototipazione e valutazione in AI Studio, poi addestramento, affinamento e serving di modelli personalizzati su Vertex. Voglio essere preciso su cosa significa, perché la distinzione conta: non sto ideando architetture nuove. Assemblo, addestro e rilascio modelli su una suite AI gestita e porto il risultato fino alla produzione — che è esattamente la competenza di cui avranno bisogno gli utenti di Arduino. La parte difficile non è mai stata la modellazione: è stato rendere l'output abbastanza affidabile per persone a cui non interessa minimamente come funziona. In StagStrat faccio lo stesso con una posta più alta: una piattaforma di trading guidata da modelli, in Python e FastAPI, dove essere lenti equivale a sbagliare. Arduino cerca qualcuno che renda l'AI utilizzabile da chi non l'ha costruita. Io sono stato su entrambi i lati di quel passaggio di consegne.",
      credentials: [
        'PlayerGrade — strumento di scouting AI, costruito da me',
        'Google AI Studio · Vertex AI',
        'Addestramento, tuning e valutazione ML',
        'Python · FastAPI · PostgreSQL',
        'StagStrat — trading guidato da modelli',
      ],
      closingLine:
        "L'intera promessa di Arduino è che l'intelligenza all'edge sia alla portata di chi non è un ricercatore ML. Sono esattamente quella persona — abbastanza tecnico da addestrare e rilasciare un modello su una piattaforma gestita, abbastanza vicino all'utente da capire quando è ancora troppo difficile.",
    },
    gap: {
      chip: 'Silicio, con onestà',
      heading:
        'Non ho mai rilasciato una toolchain per NPU — e non farò finta che il divario non ci sia',
      body: 'Le parti di questo ruolo che non posso ancora dimostrare sono precise, e preferisco nominarle piuttosto che nasconderle: pipeline di quantizzazione e conversione dei modelli, profiling e benchmarking on-device, architetture NPU e di acceleratori, integrazione SoC, ed esperienza pratica di TinyML su microcontrollori. Non ne ho mai gestita nessuna. Quello che porto è la cosa più difficile da insegnare — nove anni passati a decidere cosa costruire per utenti profondamente diversi, a rilasciare prodotti guidati da modelli sotto vincoli di performance stringenti, e la profondità tecnica per addestrarli e rilasciarli io stesso su una piattaforma AI gestita, invece di limitarmi a descriverli. La padronanza lato silicio è un problema da primo trimestre, e preferisco entrare in un team capace di vedere se lo sto chiudendo, piuttosto che aggirare la domanda adesso.',
    },
    closing: {
      eyebrow: 'Perché Arduino, perché ora',
      heading: 'Una missione in cui credo già, in un paese in cui vivo già',
      body: "La missione di Arduino — rendere una tecnologia davvero difficile raggiungibile per 33 milioni di sviluppatori, studenti e maker — è una riformulazione di ciò che ho fatto per tutta la carriera: prendere qualcosa di complesso e renderlo ovvio, prima per 165 milioni di consumatori, poi per gli oltre 1.000 professionisti dentro gli strumenti interni. Ora sotto c'è il silicio di Qualcomm, e la domanda diventa come l'edge AI smetta di essere una disciplina da specialisti e diventi qualcosa con cui si costruisce e basta. È il problema di prodotto più interessante che conosca in Italia in questo momento, ed è a tre ore di treno da dove già vivo, vicino a Firenze — abbastanza vicino per le presenze in ufficio che questo ruolo richiede davvero. Porterei nove anni di giudizio di prodotto, l'abitudine a costruire e addestrare le cose di persona, e una mappa onesta di ciò che devo ancora imparare.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Slovacco · Inglese C2 · Italiano B2 · Tedesco',
        'Residente in Italia — Torino o da remoto',
      ],
      signature:
        'Lukáš Hošala — con base vicino a Firenze, disponibile da remoto in Italia con presenze regolari a Torino. Nessun trasferimento necessario.',
    },
  },
  de: {
    hero: {
      eyebrow: 'Qualcomm · Arduino · Turin, Italien · AI Product Manager',
      headlineLead:
        'Komplizierte Technologie selbstverständlich wirken zu lassen, ist die ganze Aufgabe.',
      headlineGradient:
        'Ich habe das für 165 Millionen Nutzer getan — und ich baue KI-Lösungen selbst.',
      description:
        'Acht Jahre Produktmanagement bei adidas, wo ich eine Plattform mit über 165 Millionen Nutzern verantwortet und das dahinterliegende interne Tooling aufgebaut habe. Heute bin ich Head of Product bei einer Fintech für algorithmischen Handel, wo Modelle mit echtem Kapital und echten Latenzbudgets laufen — und ich habe PlayerGrade gebaut, ein KI-Scouting-Tool, das ich auf Google AI Studio und Vertex AI trainiert und in Produktion gebracht habe und das inzwischen die Transferentscheidungen eines professionellen Fußballvereins mitgestaltet. Ich lebe bereits in Italien. Diese Seite gleicht all das ehrlich mit der Rolle als AI Product Manager bei Arduino ab — einschließlich der Punkte, bei denen ich noch nicht passe.',
      chips: [
        'Edge-AI-Produkte',
        'Vertex AI · AI Studio',
        'Entwickler-Tools',
        'Offene Ökosysteme',
        'Wohnhaft in Italien',
      ],
      stats: [
        { value: '8+', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer auf der Plattform, die ich verantwortet habe',
        },
        {
          value: '1000+',
          label: 'Stakeholder auf dem Tooling, das ich gebaut habe',
        },
        { value: '13+', label: 'Geführte Personen, in 3 Ländern' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was Arduino sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'vision',
          title: 'Eine Roadmap für vier sehr unterschiedliche Zielgruppen',
          body: 'Die Rolle verlangt eine einzige KI-Roadmap, die Education, Maker, Professional und Industrial gleichzeitig bedient — vier Segmente mit gegensätzlicher Toleranz für Komplexität. Diese Spannung kenne ich: Bei adidas verantwortete ich ein Produkt für über 165 Millionen Konsumenten und zugleich die interne Plattform, in der über 1.000 Fachleute aus den Geschäftsbereichen täglich arbeiteten. Dasselbe Unternehmen, dieselbe Roadmap, völlig unterschiedliche Nutzer — ein Einsteiger, der in fünf Minuten Erfolg haben muss, und ein Experte, der Tiefe und Kontrolle braucht. Zu entscheiden, was jede Gruppe bekommt, was sie teilen und was bewusst vor wem verborgen bleibt, ist die Arbeit, die mir immer wieder anvertraut wird.',
        },
        {
          id: 'translate',
          title:
            'Schwierige KI in etwas verwandeln, das Menschen nutzen können',
          body: 'LLMs, Vision-Modelle und On-Device-Inferenz in ein Produkt zu übersetzen, das eine Lehrerin oder ein Maker sofort einsetzen kann, ist ebenso ein Kommunikations- wie ein Technikproblem. Ich habe eine Karriere lang in beide Richtungen übersetzt: Modellverhalten und Trade-offs gegenüber der Führungsebene erklären, die es finanziert, und forschungsnahe Fähigkeiten in Oberflächen verwandeln, mit denen normale Menschen zurechtkommen. Bei PlayerGrade habe ich beide Enden selbst gemacht — ich habe die Modelle auf Vertex AI trainiert und evaluiert und musste die Ergebnisse dann vertrauenswürdig genug für Nutzer machen, die kein Interesse daran haben, wie irgendetwas davon funktioniert.',
        },
        {
          id: 'constraints',
          title: 'Anforderungen gegen echte Beschränkungen definieren',
          body: 'Inferenzgeschwindigkeit, Speicherbedarf und Energiebudget sind genau die Art von Beschränkungen, gegen die ich bereits Anforderungen schreibe — bisher nur für Latenz und Kosten statt für Milliwatt. Bei StagStrat ist Latenz Geld: Ein Modell, das zu langsam antwortet, ist falsch, egal wie gut es ist. Spezifikationen entstehen deshalb als Performance-Budgets, nicht als Feature-Listen. Bei Runtastic senkte dieselbe Disziplin die Ladezeit im Front-End-Neuaufbau um 55%. Mit Ingenieuren Genauigkeit gegen Geschwindigkeit gegen Speicherbedarf abzuwägen, ist ein Gespräch, das ich oft geführt habe — nur in einer anderen Einheit.',
        },
        {
          id: 'devtools',
          title:
            'Entwickler-Tools, Doku und die Experience rund um das Produkt',
          body: 'Die Rolle gewichtet Entwicklerressourcen ernsthaft — Beispiele, Tutorials, Benchmarking-Kits, Troubleshooting-Guides — sowie KI-gestützte Werkzeuge wie Codegenerierung und Modellvorschläge. Für Entwickler und technische Anwender zu bauen, ist mein Kerngeschäft: Die adidas Global Admin Application führte dutzende getrennte interne Tools in einer Oberfläche für über 1.000 Stakeholder zusammen, und eine PIM-Vereinheitlichung über mehr als 50 Marktteams erreichte 100% Nutzung, weil Dokumentation und Schulung als Teil des Produkts behandelt wurden, nicht als Nachgedanke.',
        },
        {
          id: 'gtm',
          title: 'Positionierung, Pricing und koordinierte Launches',
          body: 'Ich habe Launches verantwortet, bei denen Scheitern keine Option war — eine stufenweise Migration der Runtastic-Plattform über drei Länder mit null Ausfallzeit für über 165 Millionen Nutzer — und das Go-to-Market gesteuert, das die Menschen tatsächlich auf das Neue gebracht hat. Auf der 1-Mio.-€-Social-Commerce-Plattform Sprinklr stieg die Nutzung um 30%, nachdem Positionierung und Enablement um die reale Arbeitsweise der Teams herum neu aufgebaut waren. Engineering, Content, Marketing und Operations auf ein Launch-Datum auszurichten, ist Routine, nichts Neues.',
        },
        {
          id: 'lifecycle',
          title: 'Lebenszyklus: KPIs, Plattformwechsel und End-of-Life',
          body: 'Ein Produkt über den Launch hinaus zu verantworten — Nutzungsdaten und Business-KPIs verfolgen, entscheiden, wann investiert, wann migriert und wann abgeschaltet wird — ist der größte Teil meiner Laufbahn. Die Runtastic-Migration über drei Länder war ein Plattformwechsel mit angehängtem End-of-Life-Plan: ein Legacy-Stack, der abgeschaltet wurde, ohne dass ein einziger Nutzer es bemerkte. Ich habe OKRs und Adoptions-KPIs gesetzt und an die Führungsebene berichtet — um die Roadmap zu steuern, nicht um sie zu schmücken.',
        },
        {
          id: 'ecosystem',
          title: 'Partner, OEMs und eine Community, die die Wahrheit sagt',
          body: 'Arduinos Ökosystem ist sein Burggraben — Millionen von Entwicklern, die laut und meinungsstark sind und sofort merken, wenn etwas schlecht entworfen ist. Ich habe Jahre damit verbracht, Anforderungen von Parteien einzusammeln, die mir nicht unterstellt sind, und sie in Spezifikationen zu übersetzen: über 50 globale Marktteams, externe Anbieter, Legal, Procurement und IT, dazu über 13 Personen in drei Ländern. Und PlayerGrade hat mir dieselbe Lektion von der anderen Seite beigebracht — Expertennutzer sagen dir innerhalb einer Minute, wenn ein Werkzeug ihre Arbeitsweise nicht respektiert.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Produkt, Umsetzung & Grundanforderungen',
          rows: [
            {
              requirement: 'Mindestens 5 Jahre Erfahrung im Produktmanagement',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product, 2016 bis 2025.',
            },
            {
              requirement:
                'Bachelor in Ingenieurwesen, Wirtschaftsinformatik, Informatik, Geisteswissenschaften oder verwandt',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Bachelor, dazu ein CMI Level 7 Diploma in Strategic Management und ein MBA Global der University of Derby.',
            },
            {
              requirement:
                'Eine Produkt-Roadmap end-to-end definieren und führen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe die Roadmap einer Plattform mit über 165 Mio. Nutzern bei Runtastic verantwortet und bei StagStrat die Produktstrategie end-to-end gesetzt.',
            },
            {
              requirement:
                'Funktionsübergreifende Projekte in internationalen Teams steuern',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe über 13 Personen in drei Ländern geführt und Engineering, Legal, Procurement, Branding, IT und Business zum Release ausgerichtet.',
            },
            {
              requirement:
                'Exzellente Kommunikation; komplexe Themen für verschiedene Zielgruppen vereinfachen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich berichte Richtung und Trade-offs an die Führungsebene und spreche täglich mit Ingenieuren — in drei Sprachen, und sowohl für 165 Mio. Konsumenten als auch für über 1.000 interne Fachleute.',
            },
            {
              requirement:
                'Lebenszyklus-Verantwortung inkl. Übergängen und End-of-Life',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Eine stufenweise Plattform-Migration über drei Länder, die einen Legacy-Stack mit null Ausfallzeit für über 165 Mio. Nutzer abgelöst hat.',
            },
            {
              requirement: 'Go-to-Market, Positionierung und Pricing-Beitrag',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Go-to-Market und Enablement bei einem 1-Mio.-€-Rollout verantwortet; die Nutzung stieg nach der Neupositionierung um 30%.',
            },
            {
              requirement: 'Fließendes Englisch; Italienisch ein starkes Plus',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2, Italienisch B2 und wohnhaft in Italien — dazu Slowakisch und Deutsch. Diese Seite ist in drei davon geschrieben.',
            },
            {
              requirement: 'Standort Turin oder remote innerhalb Italiens',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich lebe bereits in der Nähe von Florenz. Kein Umzug, kein Visum, keine Kündigungsfrist für einen Länderwechsel — und Turin ist eine direkte Zugfahrt von drei Stunden, was für eine Remote-First-Rolle mit regelmäßiger Präsenz im Büro gut funktioniert.',
            },
            {
              requirement:
                'Gelegentliche Reisebereitschaft für Partner, Events und Kunden',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre Arbeit zwischen Österreich, den Niederlanden und Großbritannien von einer Basis anderswo aus. Reisen ist für mich normal.',
            },
          ],
        },
        {
          title: 'KI, Edge & Silizium',
          rows: [
            {
              requirement:
                'Produktmanagement-Erfahrung speziell in KI, ML oder Edge Computing',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich habe zwei modellgetriebene Produkte gebaut und ausgeliefert — PlayerGrade, ein KI-Scouting-Tool, das ich auf Google AI Studio und Vertex AI trainiert und bei einem professionellen Fußballverein in den Live-Einsatz gebracht habe, und eine Trading-Plattform mit echtem Kapital — aber mein Titel lautete Product Manager, nicht AI Product Manager. Die Arbeit ist real; das Etikett ist neuer.',
            },
            {
              requirement:
                'Technischer Hintergrund in KI/ML — GenAI (LLMs/LVMs) und klassische Modelle (CNN/RNN/LSTM)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich baue mit Modellen, statt sie zu erforschen: Ich trainiere, tune und evaluiere sie auf Google AI Studio und Vertex AI und beurteile das Modellverhalten wöchentlich am realen Output. Ein ernsthaftes Gespräch über Deployment- und Architektur-Trade-offs kann ich führen — behaupten, eine neue Architektur entworfen oder ein U-Net von Grund auf trainiert zu haben, kann ich nicht.',
            },
            {
              requirement:
                'Fokus auf Deployment und Performance statt auf Modell-Neuheit',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Das ist meine stärkere Hälfte. Alles, was ich ausgeliefert habe, wurde daran gemessen, ob es schnell genug, zuverlässig genug und zu sinnvollen Kosten lief — nie daran, wie clever das Modell war.',
            },
            {
              requirement:
                'Verständnis der On-Device-Inferenzgrenzen (Latenz, Speicher, Energie)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Latenzkritische, ressourcenbegrenzte Systeme sind bei StagStrat Tagesgeschäft, und die 55% kürzere Ladezeit bei Runtastic kam genau aus dieser Disziplin. Milliwatt und MCU-Speichergrenzen sind die neuen Variablen, nicht das neue Konzept.',
            },
            {
              requirement:
                'Edge-AI-Toolchains: Modellkonvertierung, Quantisierung, Profiling, Benchmarking',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ehrliche Antwort: Ich habe nie eine Quantisierungs- oder Benchmarking-Pipeline verantwortet. Ich verstehe, was diese Schritte tun und warum sie über die Tragfähigkeit eines Produkts entscheiden, aber ich würde das Tooling in den ersten Wochen praktisch lernen.',
            },
            {
              requirement:
                'Kenntnis von NPU-/Beschleuniger-Architekturen und SoC-Integration',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Mein schwächster Bereich, und der, den ich nicht beschönigen werde. Ich habe eng mit Ingenieuren an Architektur und Performance-Grenzen gearbeitet, aber nie an Silizium-Roadmaps oder Beschleuniger-Integration.',
            },
            {
              requirement:
                'Frameworks: TensorFlow Lite, ONNX, OpenVINO, eingebettete Inferenz-Engines',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Als Konzepte und aus dem Python-/ML-Ökosystem, in dem ich baue, vertraut; nicht daraus, eine eingebettete Deployment-Pipeline ausgeliefert zu haben.',
            },
            {
              requirement:
                'Technische Inhalte schreiben und prüfen: Doku, Benchmarks, Tutorials',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich schreibe Spezifikationen, Akzeptanzkriterien und Enablement-Material als Teil des Produkts — der PIM-Rollout erreichte 100% Nutzung über mehr als 50 Marktteams, weil die Dokumentation ein Liefergegenstand war.',
            },
            {
              requirement:
                'Open-Source-Erfahrung und community-getriebene Ökosysteme',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich baue ständig auf Open Source — Python, FastAPI, Next.js, PostgreSQL und diese Seite — und habe mit großen, meinungsstarken Expertengemeinschaften gearbeitet. Maintainer in einem community-geführten Projekt zu sein, ist für mich allerdings wirklich neu.',
            },
            {
              requirement:
                'Praktische Erfahrung mit TinyML, Mikrocontrollern oder beschränkten Geräten',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Als Bonuspunkt gelistet, und ich würde im flachen Wasser starten. Ich baue Software end-to-end und lerne technische Stacks schnell, aber ich behaupte keine Board-Erfahrung, die ich nicht habe.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Die praktische Hälfte',
      statusBadge:
        'Aktiv — PlayerGrade, gebaut auf Google AI Studio & Vertex AI',
      heading:
        'Ich schreibe nicht nur KI-Anforderungen. Ich baue die Lösungen und trainiere die Modelle.',
      body: 'PlayerGrade gehört mir. Es ist ein KI-Scouting-Tool, das Spiel-, Tracking- und Videodaten einliest, Spielerleistung bewertet und inzwischen die Transferentscheidungen eines professionellen Fußballvereins speist. Gebaut habe ich es auf Google AI Studio und Vertex AI — Prototyping und Evaluation in AI Studio, dann Training, Tuning und Serving eigener Modelle auf Vertex. Ich will präzise sein, was das heißt, denn die Unterscheidung zählt: Ich entwerfe keine neuen Architekturen. Ich setze Modelle auf einer verwalteten KI-Suite zusammen, trainiere sie, liefere sie aus und bringe das Ergebnis bis in die Produktion — genau die Fähigkeit, die Arduinos Nutzer brauchen werden. Der schwierige Teil war nie die Modellierung, sondern die Ergebnisse vertrauenswürdig genug für Menschen zu machen, die kein Interesse daran haben, wie es funktioniert. Bei StagStrat mache ich dasselbe mit höherem Einsatz: eine modellgetriebene Trading-Plattform in Python und FastAPI, bei der langsam zu sein von falsch zu sein nicht zu unterscheiden ist. Arduino sucht jemanden, der KI für Menschen einsetzbar macht, die sie nicht gebaut haben. Ich stand auf beiden Seiten dieser Übergabe.',
      credentials: [
        'PlayerGrade — KI-Scouting-Tool, selbst gebaut',
        'Google AI Studio · Vertex AI',
        'ML-Training, Tuning & Evaluation',
        'Python · FastAPI · PostgreSQL',
        'StagStrat — modellgetriebenes Trading',
      ],
      closingLine:
        'Arduinos ganzes Versprechen ist, dass Intelligenz am Edge für jemanden erreichbar sein soll, der kein ML-Forscher ist. Genau diese Person bin ich — technisch genug, um ein Modell auf einer verwalteten Plattform zu trainieren und auszuliefern, nah genug am Nutzer, um zu merken, wenn es noch zu schwer ist.',
    },
    gap: {
      chip: 'Silizium, ehrlich gesagt',
      heading:
        'Ich habe keine NPU-Toolchain ausgeliefert — und ich werde nicht so tun, als gäbe es die Lücke nicht',
      body: 'Die Teile dieser Rolle, die ich noch nicht belegen kann, sind konkret, und ich benenne sie lieber, als sie zu verstecken: Quantisierungs- und Modellkonvertierungs-Pipelines, Profiling und Benchmarking auf dem Gerät, NPU- und Beschleuniger-Architekturen, SoC-Integration und praktisches TinyML auf Mikrocontrollern. Nichts davon habe ich je verantwortet. Was ich mitbringe, ist das, was schwerer zu lehren ist — neun Jahre Entscheidungen darüber, was für sehr unterschiedliche Nutzer gebaut wird, modellgetriebene Produkte unter harten Performance-Grenzen ausgeliefert, und die technische Tiefe, sie auf einer verwalteten KI-Plattform selbst zu trainieren und auszuliefern, statt sie nur zu beschreiben. Siliziumseitige Sicherheit ist ein Problem des ersten Quartals, und ich trete lieber in ein Team ein, das beurteilen kann, ob ich sie schließe, als die Frage jetzt zu umgehen.',
    },
    closing: {
      eyebrow: 'Warum Arduino, warum jetzt',
      heading:
        'Eine Mission, an die ich ohnehin glaube, in einem Land, in dem ich ohnehin lebe',
      body: 'Arduinos Mission — wirklich schwierige Technologie für 33 Millionen Entwickler, Studierende und Maker erreichbar zu machen — ist eine Neuformulierung dessen, was ich meine ganze Laufbahn getan habe: etwas Komplexes nehmen und es selbstverständlich wirken lassen, erst für 165 Millionen Konsumenten, dann für die über 1.000 Fachleute im internen Tooling. Jetzt liegt Qualcomms Silizium darunter, und die Frage wird, wie Edge-KI aufhört, eine Spezialistendisziplin zu sein, und zu etwas wird, mit dem man einfach baut. Das ist das interessanteste Produktproblem, das ich derzeit in Italien kenne, und es liegt drei Zugstunden von meinem Wohnort bei Florenz entfernt — nah genug für die Bürotage, die diese Rolle tatsächlich braucht. Ich brächte neun Jahre Produkturteil mit, die Gewohnheit, Dinge selbst zu bauen und zu trainieren, und eine ehrliche Landkarte dessen, was ich noch lernen muss.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Slowakisch · Englisch C2 · Italienisch B2 · Deutsch',
        'Wohnhaft in Italien — Turin oder remote',
      ],
      signature:
        'Lukáš Hošala — wohnhaft bei Florenz, bereit für Remote-Arbeit in Italien mit regelmäßiger Präsenz in Turin. Kein Umzug nötig.',
    },
  },
}
