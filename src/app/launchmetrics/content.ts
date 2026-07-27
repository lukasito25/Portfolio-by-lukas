export type Locale = 'en' | 'fr' | 'it' | 'es'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'users'
    | 'missions'
    | 'dataflow'
    | 'measure'
    | 'market'
    | 'stakeholders'
    | 'raisebar'
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

export interface LaunchmetricsContent {
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
  /** Standout credential panel — here: the adidas product-data pipeline. */
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

export const launchmetricsContent: Record<Locale, LaunchmetricsContent> = {
  en: {
    hero: {
      eyebrow: 'Launchmetrics · Remote · Senior Product Builder, Data',
      headlineLead: 'Dior, Fendi, Shiseido, NET-A-PORTER, adidas.',
      headlineGradient:
        'I spent eight years inside the last one, building its product-data pipeline.',
      description:
        "Your own customer list is where my CV starts. At adidas I built the PIM that collected product data, enriched it to a common standard and syndicated it to 50+ market teams — acquisition, enrichment, delivery, one layer upstream of what you sell — and owned the €1M platform the brand measured itself with. Today I'm Head of Product at an algorithmic trading fintech, working with live data and models daily. This page maps that against the Data Collection & Enrichment role, honestly — including exactly where my data depth stops.",
      chips: [
        'Product Data Lifecycle',
        'Fashion & Beauty',
        'SQL & Analytics',
        'AI-Based Enrichment',
        'Remote, near Milan',
      ],
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '50+', label: 'Market teams on the PIM I built' },
        { value: '165M+', label: 'Users on the platform I owned' },
        { value: '€1M', label: 'Brand-measurement licence I owned' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading:
        "What Launchmetrics is asking for — and where I've already done it",
      items: [
        {
          id: 'users',
          title: 'Talk to your users. A lot.',
          body: "Turning fuzzy needs into measurable requirements is the job I've had for nine years, and the users have rarely been people who reported to me. The adidas PIM served 50+ market teams across different countries, each convinced their local product data was the exception; the Global Admin Application served 1,000+ professionals across separate business units. In both cases the work started by sitting with them until I understood why the current mess existed, because a data model built without that context gets quietly worked around rather than adopted.",
        },
        {
          id: 'missions',
          title: 'Own missions end to end — including the adoption half',
          body: 'Scoping and building is the half everyone claims; enablement and adoption is where most ownership quietly stops. The PIM hit 100% adoption on day one and cut speed to market by 70%, because documentation and training shipped with it rather than after it. The €1M Sprinklr platform gained 30% adoption once it was rebuilt around how teams actually worked. I keep a visible source of truth because in a small pod the alternative is three people each holding a different version of the plan.',
        },
        {
          id: 'dataflow',
          title: 'Master the data flow — acquisition, enrichment, management',
          body: "This is the closest thing to a direct precedent I have. The PIM was exactly that shape: collect product data from source systems, enrich and standardise it into something usable, then deliver it out to the channels that needed it. On the AI-based enrichment side, PlayerGrade is mine — it ingests match, tracking and video data, and I train and tune the models on Google AI Studio and Vertex AI that turn that raw feed into a score people will actually trust. Manual, rule-based and AI enrichment are three answers to the same question, and I've shipped the first and third.",
        },
        {
          id: 'measure',
          title: 'Measure what matters, then feed it back',
          body: "Every project I've led is judged on a number afterwards: +70% speed to market, 100% adoption across 50+ teams, +30% adoption after repositioning, −55% page load, zero downtime for 165M+ users. I set and reported OKRs and adoption KPIs to executives at Runtastic and used them to steer the roadmap rather than decorate it. Defining the metric before building is the only way the analysis afterwards means anything.",
        },
        {
          id: 'market',
          title: 'Keep an eye on brand measurement',
          body: "I've been on the buying side of this market. At adidas I owned Sprinklr — a €1M/year licence — and the in-house social commerce engine we built instead of buying more, so I sat through the vendor evaluations, the renewal conversations and the internal arguments about which numbers actually meant something to the brand. I know what a marketing team is really trying to prove when they ask for a measurement platform, because I was the one being asked.",
        },
        {
          id: 'stakeholders',
          title: 'Speaking the right language to each side',
          body: 'The posting asks for someone who can talk to engineers and business people and be trusted by both. That translation is my day-to-day: I write specs and acceptance criteria that engineers can build against, and business cases that executives will fund — at adidas for spend at the €1M level. I also write and ship code myself, which mostly matters because it means I can hear when an estimate is really a data-model problem in disguise.',
        },
        {
          id: 'raisebar',
          title: 'Raise the bar around you',
          body: "Contributing to shared tooling is habit rather than an add-on. I consolidated dozens of disconnected internal tools into one platform at adidas precisely because the shared layer was nobody's job and everybody's problem. And I build my own tools when the gap is obvious — PlayerGrade, and the analytics pipeline behind this site, including the bot classification that keeps its numbers honest.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'What Launchmetrics is looking for',
          rows: [
            {
              requirement:
                'Around 5 years in product management or data management, shipping alongside engineers in SaaS',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product, 2016 to 2025 — all of it shipping with engineering teams, in-house and external.',
            },
            {
              requirement: 'Fluent in SQL',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I write my own queries to answer product questions rather than waiting on an analyst — SQL alongside PowerBI and Google Analytics, every week.',
            },
            {
              requirement:
                'Comfortable with data modelling, pipelines and APIs',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "Honest line: I query data, I haven't owned the schema. I've specified and consumed APIs, and at StagStrat I work daily with a Postgres-backed platform ingesting live market data — but designing the model and owning the pipeline is work I've sat next to rather than done.",
            },
            {
              requirement:
                'Understand the data lifecycle from acquisition to delivery, and improve quality along it',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The adidas PIM was that lifecycle end to end: collect product data from source systems, enrich and standardise it, syndicate it to the channels that needed it — with quality being the whole point, since bad product data reaches the customer directly.',
            },
            {
              requirement:
                'A few years on data, analytics or data-product problems alongside engineers',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The PIM and the Sprinklr/adiSCom measurement stack at adidas, PlayerGrade as an AI data product, and a model-driven trading platform now. Data products have been the through-line even when the job title said Product Manager.',
            },
            {
              requirement:
                'Business sense — knowing why one kind of data matters to a fashion brand and another does not',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "Eight years at adidas, which is on your customer list. I've been the person deciding which product attributes were worth the effort to standardise and which numbers a brand team would actually act on.",
            },
            {
              requirement:
                'Curious about the branding challenges fashion and luxury brands face',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I lived them: global brand consistency across 50+ markets, product data that had to be right before a launch, and measurement that had to survive contact with a marketing director.',
            },
            {
              requirement:
                'A real discovery instinct — start from the problem, not the solution',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Both my clearest wins came from discovery: the PIM worked because I understood how markets were coping without it, and PlayerGrade only got adopted once I understood how its users judged the thing it was scoring.',
            },
            {
              requirement:
                'Self-sufficient across crafts — enough product thinking and rough interface reasoning to keep a pod moving',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I led the Next.js/React front-end rebuild of the Runtastic platform and build my own products end to end, so I can sketch the interface and reason about the trade-off without blocking on someone else.',
            },
            {
              requirement:
                'Clear communication with both technical and business audiences; fluent English',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2, and nine years of reporting direction to executives while briefing engineers daily.',
            },
            {
              requirement: 'Other languages a welcome bonus',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "Italian B2, German and Slovak alongside English. To be straight about it: this page is offered in four languages, but French and Spanish are translations rather than fluencies of mine — I'd rather say so than let the language toggle imply otherwise.",
            },
          ],
        },
        {
          title: 'Domain, data platform & context',
          rows: [
            {
              requirement:
                'Owning a data platform: datalake, large-scale pipelines, enrichment at volume',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "My honest gap. The PIM was a real data lifecycle but at brand scale, not platform scale, and I've never owned a datalake or an ingestion system running continuously against many external sources. This is the part I'd be learning fastest in.",
            },
            {
              requirement:
                'Rule-based and manual enrichment operations at scale',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I've built standardisation rules and the human workflow around them for product data, but not an enrichment operation of the size a 1,200-customer platform implies. The shape is familiar; the volume is not.",
            },
            {
              requirement: 'AI-based enrichment',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'PlayerGrade turns raw match, tracking and video data into trusted scores — trained, tuned and served by me on Google AI Studio and Vertex AI. I assemble and deploy models on a managed suite rather than authoring architectures, which is the right altitude for this role.',
            },
            {
              requirement: 'Brand measurement and performance products',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I owned the brand-measurement stack at adidas — Sprinklr on a €1M/year licence plus adiSCom handling 500K+ monthly interactions — from the customer side of exactly this category.',
            },
            {
              requirement:
                'Fashion, Lifestyle and Beauty industry understanding',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years in global sportswear at adidas, across product data, social commerce and brand marketing.',
            },
            {
              requirement:
                'Pod model — small team, full autonomy, ownership from scoping to adoption',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at an early-stage fintech after eight years in a large organisation, and PlayerGrade built end to end on my own initiative. I chose the small-team end deliberately.',
            },
            {
              requirement: 'Fully remote, European team',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "I'm near Florence and already work remotely across borders — Milan is your nearest office and a short train away when a pod wants to be in a room together. No relocation, no visa, no timezone gap.",
            },
            {
              requirement:
                'Comfortable in a fast-paced environment, keen to learn',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I taught myself to build and train models well enough to put one into live use at a professional club. The learning curve here is steeper on the data-platform side, and that is precisely the appeal.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The data half',
      statusBadge: 'adidas — PIM across 50+ market teams',
      heading:
        'You already sell to adidas. I spent eight years inside it, on the data.',
      body: "Launchmetrics collects data, enriches it, and makes it reliably accessible — and that is almost exactly what I built at adidas, one layer upstream. The PIM took product data from source systems, enriched and standardised it into something every market could actually use, and syndicated it out to the channels that sold it. Delivered with an external development team, on schedule, 100% adoption on day one, speed to market up 70%. Alongside it I owned the measurement stack: Sprinklr on a €1M/year licence and adiSCom, the social commerce engine we built in-house, running 500K+ interactions a month. So I've been on both halves of your value proposition — the product data pipeline, and the brand measurement layer on top of it — from the customer's side of the table. That's the part I think is genuinely rare here: not that I've worked with data, but that I know why a fashion brand cares about one attribute and shrugs at another, because I had to argue for the budget to get the first one right.",
      credentials: [
        'adidas PIM — collect, enrich, syndicate',
        '+70% speed to market · 100% adoption day one',
        'Sprinklr — €1M/yr brand measurement',
        'PlayerGrade — AI enrichment on Vertex AI',
      ],
      closingLine:
        'Your clients buy the data as much as the platform. I was one of those clients, and I know exactly how quickly a brand team stops trusting a number that turned out to be wrong once.',
    },
    gap: {
      chip: 'Data depth, honestly',
      heading:
        "I query data every day. I haven't built the pipeline underneath it.",
      body: "Let me draw the line precisely rather than blur it. I'm fluent in SQL in the sense that matters daily — I write my own queries against real schemas to answer product questions instead of waiting on someone else. What I have not done is own the layer beneath: designing the data model, building and running ingestion pipelines, or holding a datalake together at the volume a 1,200-customer platform implies. I've specified and consumed APIs, I work alongside a Postgres-backed platform ingesting live market data, and I've trained and deployed models that enrich raw feeds into something usable — but the engineering underneath has been my colleagues' craft, not mine. Your posting asks for a Product Builder with data expertise rather than a data engineer, and the case I'd make is that the product judgement, the domain fluency and the discovery instinct are the harder halves to hire, while the pipeline depth is the part I can close fastest with engineers who already know your stack. If you need someone who can architect the datalake on day one, I'm not that person, and I'd rather you know now.",
    },
    closing: {
      eyebrow: 'Why Launchmetrics',
      heading: 'The data behind a brand, which is where I started',
      body: 'Most product roles ask you to choose a side: the data, or the industry that gives it meaning. This one wants both, and they are the two halves of what I already have. I spent eight years inside a brand on your customer list, deciding which product data was worth standardising and which numbers a marketing team would actually act on — then spent the last two building data products hands-on, training models and shipping them to people who had every reason not to trust them. A domain where clients buy the data as much as the platform is a domain where quality is the product, and that is a much more interesting problem than it sounds from outside. Add a pod model that hands you a mission and gets out of the way, and it reads like a role built for someone who wants to own the whole arc rather than a slice of it.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · Italian B2 · German · Slovak',
        'Remote from Italy — Milan nearby',
      ],
      signature:
        'Lukáš Hošala — based near Florence, remote-ready, a train ride from the Milan office.',
    },
  },

  fr: {
    hero: {
      eyebrow: 'Launchmetrics · Télétravail · Senior Product Builder, Data',
      headlineLead: 'Dior, Fendi, Shiseido, NET-A-PORTER, adidas.',
      headlineGradient:
        "J'ai passé huit ans à l'intérieur du dernier, à construire son pipeline de données produit.",
      description:
        "Votre liste de clients est le point de départ de mon parcours. Chez adidas, j'ai construit le PIM qui collectait les données produit, les enrichissait selon un standard commun et les diffusait à plus de 50 équipes marché — acquisition, enrichissement, livraison, une couche en amont de ce que vous vendez — et j'ai géré la plateforme à 1 M€ avec laquelle la marque se mesurait. Aujourd'hui je suis Head of Product dans une fintech de trading algorithmique, au contact quotidien de données et de modèles en production. Cette page confronte tout cela au poste Data Collection & Enrichment, honnêtement — y compris là où ma profondeur technique s'arrête.",
      chips: [
        'Cycle de vie de la donnée produit',
        'Mode & Beauté',
        'SQL & Analytics',
        'Enrichissement par IA',
        'Télétravail, près de Milan',
      ],
      stats: [
        { value: '8+', label: 'Années en product management' },
        { value: '50+', label: 'Équipes marché sur le PIM que j’ai construit' },
        {
          value: '165M+',
          label: 'Utilisateurs sur la plateforme que je gérais',
        },
        { value: '€1M', label: 'Licence de brand measurement que je gérais' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Le poste, point par point',
      heading: "Ce que cherche Launchmetrics — et où je l'ai déjà fait",
      items: [
        {
          id: 'users',
          title: 'Parler à vos utilisateurs. Beaucoup.',
          body: "Transformer des besoins flous en exigences mesurables, c'est mon métier depuis neuf ans, et ces utilisateurs n'ont presque jamais été sous ma responsabilité hiérarchique. Le PIM d'adidas servait plus de 50 équipes marché dans différents pays, chacune convaincue que ses données produit locales étaient l'exception ; la Global Admin Application servait plus de 1 000 professionnels de business units distinctes. Dans les deux cas, le travail commençait en m'asseyant avec eux jusqu'à comprendre pourquoi le désordre existant existait — car un modèle de données conçu sans ce contexte est contourné en silence plutôt qu'adopté.",
        },
        {
          id: 'missions',
          title: "Porter les missions de bout en bout — l'adoption comprise",
          body: "Cadrer et construire, tout le monde le revendique ; c'est sur l'activation et l'adoption que la responsabilité s'arrête discrètement. Le PIM a atteint 100 % d'adoption dès le premier jour et réduit le time-to-market de 70 %, parce que documentation et formation ont été livrées avec lui et non après. La plateforme Sprinklr à 1 M€ a gagné 30 % d'adoption une fois reconstruite autour du travail réel des équipes. Je tiens une source de vérité visible, parce que dans un petit pod l'alternative est trois personnes avec trois versions du plan.",
        },
        {
          id: 'dataflow',
          title:
            'Maîtriser le flux de données — acquisition, enrichissement, gestion',
          body: "C'est le précédent le plus direct que je puisse présenter. Le PIM avait exactement cette forme : collecter les données produit depuis les systèmes sources, les enrichir et les standardiser pour les rendre utilisables, puis les livrer aux canaux qui en avaient besoin. Côté enrichissement par IA, PlayerGrade est à moi : il ingère des données de match, de tracking et vidéo, et j'entraîne et ajuste sur Google AI Studio et Vertex AI les modèles qui transforment ce flux brut en un score auquel les gens font réellement confiance. Enrichissement manuel, par règles et par IA sont trois réponses à la même question ; j'ai livré la première et la troisième.",
        },
        {
          id: 'measure',
          title: 'Mesurer ce qui compte, puis en tirer les conséquences',
          body: "Chaque projet que j'ai mené est jugé ensuite sur un chiffre : +70 % de time-to-market, 100 % d'adoption sur plus de 50 équipes, +30 % d'adoption après repositionnement, −55 % de temps de chargement, zéro interruption pour plus de 165 millions d'utilisateurs. J'ai défini et reporté OKR et KPI d'adoption à la direction chez Runtastic, et je m'en suis servi pour piloter la roadmap plutôt que pour la décorer. Définir la métrique avant de construire est la seule façon de donner un sens à l'analyse qui suit.",
        },
        {
          id: 'market',
          title: 'Garder un œil sur le brand measurement',
          body: "J'ai été du côté acheteur de ce marché. Chez adidas je gérais Sprinklr — une licence à 1 M€ par an — et le moteur de social commerce que nous avons construit en interne plutôt que d'acheter davantage. J'ai donc vécu les évaluations de fournisseurs, les renouvellements et les débats internes sur les chiffres qui comptaient vraiment pour la marque. Je sais ce qu'une équipe marketing cherche réellement à prouver quand elle demande une plateforme de mesure, parce que c'est à moi qu'on le demandait.",
        },
        {
          id: 'stakeholders',
          title: 'Parler la bonne langue à chaque interlocuteur',
          body: "L'annonce cherche quelqu'un capable de parler aux ingénieurs comme aux profils business, et d'être crédible auprès des deux. Cette traduction est mon quotidien : j'écris des spécifications et des critères d'acceptation sur lesquels les ingénieurs peuvent construire, et des business cases que la direction finance — chez adidas pour des dépenses de l'ordre du million d'euros. J'écris aussi du code moi-même, ce qui compte surtout parce que j'entends quand une estimation cache en réalité un problème de modèle de données.",
        },
        {
          id: 'raisebar',
          title: 'Élever le niveau autour de soi',
          body: "Contribuer à l'outillage commun est une habitude, pas une option. J'ai regroupé chez adidas des dizaines d'outils internes déconnectés en une seule plateforme, précisément parce que cette couche partagée n'était le travail de personne et le problème de tout le monde. Et je construis mes propres outils quand le manque est évident — PlayerGrade, et le pipeline analytique derrière ce site, y compris la classification des bots qui en garde les chiffres honnêtes.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondance avec le profil',
      heading: 'Où je corresponds, et où non',
      panels: [
        {
          title: 'Ce que cherche Launchmetrics',
          rows: [
            {
              requirement:
                'Environ 5 ans en product management ou data management, en livrant avec des ingénieurs en SaaS',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Neuf ans, de Product Owner à Head of Product, de 2016 à 2025 — toujours en livrant avec des équipes d’ingénierie, internes et externes.',
            },
            {
              requirement: 'Maîtrise du SQL',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "J'écris mes propres requêtes pour répondre aux questions produit plutôt que d'attendre un analyste — SQL, aux côtés de PowerBI et Google Analytics, chaque semaine.",
            },
            {
              requirement:
                'À l’aise avec la modélisation, les pipelines et les API',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "Pour être franc : j'interroge les données, je n'ai pas possédé le schéma. J'ai spécifié et consommé des API, et chez StagStrat je travaille quotidiennement avec une plateforme sur PostgreSQL qui ingère des données de marché en direct — mais concevoir le modèle et porter le pipeline est un travail à côté duquel j'ai travaillé, pas que j'ai fait.",
            },
            {
              requirement:
                'Comprendre le cycle de vie de la donnée, de l’acquisition à la livraison, et en améliorer la qualité',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Le PIM d'adidas était ce cycle complet : collecter les données produit depuis les systèmes sources, les enrichir et les standardiser, les diffuser aux canaux concernés — la qualité étant tout l'enjeu, puisqu'une mauvaise donnée produit arrive directement chez le client.",
            },
            {
              requirement:
                'Quelques années sur des problématiques data, analytics ou data-product avec des ingénieurs',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Le PIM et la stack de mesure Sprinklr/adiSCom chez adidas, PlayerGrade comme produit de données IA, et aujourd'hui une plateforme de trading pilotée par des modèles. Les produits de données sont le fil conducteur, même quand l'intitulé disait Product Manager.",
            },
            {
              requirement:
                'Sens business — savoir pourquoi tel type de donnée compte pour une marque de mode et tel autre non',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Huit ans chez adidas, qui figure sur votre liste de clients. J'ai été celui qui décidait quels attributs produit méritaient l'effort de standardisation et quels chiffres une équipe de marque allait réellement utiliser.",
            },
            {
              requirement:
                'Curiosité pour les enjeux de marque du luxe et de la mode',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Je les ai vécus : cohérence de marque sur plus de 50 marchés, données produit qui devaient être justes avant un lancement, et une mesure qui devait survivre au contact d'un directeur marketing.",
            },
            {
              requirement:
                'Un vrai instinct de discovery — partir du problème, pas de la solution',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Mes deux réussites les plus nettes viennent de la discovery : le PIM a fonctionné parce que j'avais compris comment les marchés s'en sortaient sans lui, et PlayerGrade n'a été adopté qu'une fois compris comment ses utilisateurs jugeaient ce qu'il notait.",
            },
            {
              requirement:
                'Autonome entre les crafts — assez de réflexion produit et d’ébauche d’interface pour faire avancer un pod',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "J'ai dirigé la refonte front-end Next.js/React de la plateforme Runtastic et je construis mes propres produits de bout en bout : je peux esquisser l'interface et arbitrer sans dépendre de quelqu'un d'autre.",
            },
            {
              requirement:
                'Communication claire avec les publics techniques et business ; anglais courant',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Anglais C2, et neuf ans à reporter la direction produit aux dirigeants tout en briefant les ingénieurs au quotidien.',
            },
            {
              requirement: 'Autres langues appréciées',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Italien B2, allemand et slovaque, en plus de l'anglais. Pour être clair : cette page est proposée en quatre langues, mais le français et l'espagnol sont des traductions et non des langues que je parle — je préfère le dire plutôt que laisser le sélecteur le suggérer.",
            },
          ],
        },
        {
          title: 'Domaine, plateforme de données & contexte',
          rows: [
            {
              requirement:
                'Porter une plateforme de données : datalake, pipelines à grande échelle, enrichissement en volume',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "Ma vraie lacune. Le PIM était un cycle de données réel mais à l'échelle d'une marque, pas d'une plateforme, et je n'ai jamais porté de datalake ni de système d'ingestion tournant en continu sur de nombreuses sources externes. C'est là que j'apprendrais le plus vite.",
            },
            {
              requirement:
                'Opérations d’enrichissement manuel et par règles à grande échelle',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "J'ai construit des règles de standardisation et le workflow humain autour, pour des données produit, mais pas une opération d'enrichissement de la taille qu'implique une plateforme à 1 200 clients. La forme m'est familière ; le volume non.",
            },
            {
              requirement: 'Enrichissement par IA',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "PlayerGrade transforme des données brutes de match, de tracking et vidéo en scores fiables — entraînés, ajustés et servis par moi sur Google AI Studio et Vertex AI. J'assemble et déploie des modèles sur une suite gérée plutôt que de concevoir des architectures, ce qui est la bonne altitude pour ce poste.",
            },
            {
              requirement: 'Produits de brand measurement et de performance',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Je gérais la stack de mesure de marque chez adidas — Sprinklr sous licence à 1 M€/an, plus adiSCom traitant plus de 500 000 interactions par mois — du côté client de cette catégorie exactement.',
            },
            {
              requirement: 'Compréhension du secteur Mode, Lifestyle et Beauté',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Huit ans dans le sportswear mondial chez adidas, entre données produit, social commerce et marketing de marque.',
            },
            {
              requirement:
                'Modèle en pods — petite équipe, autonomie totale, propriété du cadrage à l’adoption',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Head of Product dans une fintech en phase initiale après huit ans en grande organisation, et PlayerGrade construit de bout en bout de ma propre initiative. J'ai choisi délibérément le format petite équipe.",
            },
            {
              requirement: 'Full remote, équipe européenne',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Je vis près de Florence et je travaille déjà à distance au-delà des frontières — Milan est votre bureau le plus proche, à un trajet de train quand un pod veut se retrouver. Pas de déménagement, pas de visa, pas de décalage horaire.',
            },
            {
              requirement:
                'À l’aise dans un environnement rapide, envie d’apprendre',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "J'ai appris seul à construire et entraîner des modèles suffisamment bien pour en mettre un en usage réel dans un club professionnel. Ici la courbe est plus raide côté plateforme de données, et c'est précisément l'intérêt.",
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'La moitié data',
      statusBadge: 'adidas — PIM sur plus de 50 équipes marché',
      heading:
        "Vous vendez déjà à adidas. J'y ai passé huit ans, du côté des données.",
      body: "Launchmetrics collecte des données, les enrichit et les rend accessibles de façon fiable — et c'est presque exactement ce que j'ai construit chez adidas, une couche en amont. Le PIM prenait les données produit depuis les systèmes sources, les enrichissait et les standardisait pour les rendre réellement utilisables par chaque marché, puis les diffusait vers les canaux qui les vendaient. Livré avec une équipe de développement externe, dans les délais, 100 % d'adoption dès le premier jour, time-to-market amélioré de 70 %. En parallèle, je gérais la stack de mesure : Sprinklr sous licence à 1 M€/an et adiSCom, le moteur de social commerce construit en interne, traitant plus de 500 000 interactions par mois. J'ai donc été des deux côtés de votre proposition de valeur — le pipeline de données produit et la couche de mesure au-dessus — depuis la place du client. C'est ce qui me paraît réellement rare ici : non pas d'avoir travaillé avec de la donnée, mais de savoir pourquoi une marque de mode tient à un attribut et se moque d'un autre, parce qu'il a fallu que je défende le budget pour que le premier soit juste.",
      credentials: [
        'PIM adidas — collecter, enrichir, diffuser',
        '+70 % de time-to-market · 100 % d’adoption J1',
        'Sprinklr — 1 M€/an de brand measurement',
        'PlayerGrade — enrichissement IA sur Vertex AI',
      ],
      closingLine:
        "Vos clients achètent la donnée autant que la plateforme. J'ai été l'un de ces clients, et je sais à quelle vitesse une équipe de marque cesse de faire confiance à un chiffre qui s'est révélé faux une seule fois.",
    },
    gap: {
      chip: 'Profondeur data, honnêtement',
      heading:
        "J'interroge les données tous les jours. Je n'ai pas construit le pipeline en dessous.",
      body: "Traçons la ligne précisément plutôt que de la brouiller. Je maîtrise le SQL au sens qui compte au quotidien : j'écris mes propres requêtes sur des schémas réels pour répondre à des questions produit, sans attendre quelqu'un d'autre. Ce que je n'ai pas fait, c'est porter la couche en dessous — concevoir le modèle de données, construire et opérer des pipelines d'ingestion, ou tenir un datalake au volume qu'implique une plateforme à 1 200 clients. J'ai spécifié et consommé des API, je travaille aux côtés d'une plateforme PostgreSQL qui ingère des données de marché en direct, et j'ai entraîné et déployé des modèles qui enrichissent des flux bruts — mais l'ingénierie en dessous a été le métier de mes collègues, pas le mien. Votre annonce cherche un Product Builder avec une expertise data plutôt qu'un data engineer, et mon argument est que le jugement produit, la connaissance du secteur et l'instinct de discovery sont les moitiés les plus difficiles à recruter, tandis que la profondeur pipeline est ce que je peux combler le plus vite avec des ingénieurs qui connaissent déjà votre stack. S'il vous faut quelqu'un capable d'architecturer le datalake dès le premier jour, ce n'est pas moi, et je préfère que vous le sachiez maintenant.",
    },
    closing: {
      eyebrow: 'Pourquoi Launchmetrics',
      heading: 'La donnée derrière une marque, là où j’ai commencé',
      body: "La plupart des postes produit demandent de choisir un camp : la donnée, ou le secteur qui lui donne du sens. Celui-ci veut les deux, et ce sont précisément les deux moitiés que j'ai déjà. J'ai passé huit ans à l'intérieur d'une marque figurant sur votre liste de clients, à décider quelles données produit méritaient d'être standardisées et quels chiffres une équipe marketing utiliserait vraiment — puis les deux dernières années à construire des produits de données de mes mains, à entraîner des modèles et à les livrer à des gens qui avaient toutes les raisons de s'en méfier. Un domaine où les clients achètent la donnée autant que la plateforme est un domaine où la qualité est le produit, et c'est un problème bien plus intéressant qu'il n'y paraît de l'extérieur. Ajoutez un modèle en pods qui vous confie une mission et vous laisse travailler, et cela ressemble à un poste taillé pour qui veut porter tout l'arc plutôt qu'une tranche.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Anglais C2 · Italien B2 · Allemand · Slovaque',
        'Télétravail depuis l’Italie — Milan à proximité',
      ],
      signature:
        'Lukáš Hošala — basé près de Florence, prêt pour le télétravail, à un train du bureau de Milan.',
    },
  },

  it: {
    hero: {
      eyebrow: 'Launchmetrics · Da remoto · Senior Product Builder, Data',
      headlineLead: 'Dior, Fendi, Shiseido, NET-A-PORTER, adidas.',
      headlineGradient:
        "Ho passato otto anni dentro l'ultimo, a costruire la sua pipeline di dati di prodotto.",
      description:
        'La vostra lista clienti è il punto da cui parte il mio percorso. In adidas ho costruito il PIM che raccoglieva i dati di prodotto, li arricchiva secondo uno standard comune e li distribuiva a oltre 50 team di mercato — acquisizione, arricchimento, consegna, un livello a monte di ciò che vendete — e ho gestito la piattaforma da 1 milione di euro con cui il brand si misurava. Oggi sono Head of Product in una fintech di trading algoritmico, a contatto quotidiano con dati e modelli in produzione. Questa pagina mette tutto questo a confronto con il ruolo su Data Collection & Enrichment, con onestà — compreso il punto esatto in cui la mia profondità tecnica si ferma.',
      chips: [
        'Ciclo di vita del dato di prodotto',
        'Moda & Beauty',
        'SQL & Analytics',
        'Arricchimento con AI',
        'Da remoto, vicino a Milano',
      ],
      stats: [
        { value: '8+', label: 'Anni in product management' },
        { value: '50+', label: 'Team di mercato sul PIM che ho costruito' },
        { value: '165M+', label: 'Utenti sulla piattaforma che ho gestito' },
        { value: '€1M', label: 'Licenza di brand measurement che gestivo' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Launchmetrics cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'users',
          title: 'Parlare con gli utenti. Molto.',
          body: "Trasformare bisogni confusi in requisiti misurabili è il mio lavoro da nove anni, e quegli utenti quasi mai rispondevano a me. Il PIM di adidas serviva oltre 50 team di mercato in paesi diversi, ognuno convinto che i propri dati di prodotto fossero l'eccezione; la Global Admin Application serviva oltre 1.000 professionisti di business unit separate. In entrambi i casi il lavoro iniziava sedendomi accanto a loro finché non capivo perché il disordine esistente esistesse — perché un modello di dati costruito senza quel contesto viene aggirato in silenzio, non adottato.",
        },
        {
          id: 'missions',
          title: 'Gestire le missioni end-to-end — adozione compresa',
          body: "Definire e costruire è la metà che tutti rivendicano; è sull'abilitazione e l'adozione che la responsabilità si ferma in silenzio. Il PIM ha raggiunto il 100% di adozione il primo giorno e ridotto il time-to-market del 70%, perché documentazione e formazione sono state rilasciate insieme e non dopo. La piattaforma Sprinklr da 1 milione di euro ha guadagnato il 30% di adozione una volta ricostruita attorno al lavoro reale dei team. Tengo una fonte di verità visibile, perché in un pod piccolo l'alternativa sono tre persone con tre versioni del piano.",
        },
        {
          id: 'dataflow',
          title:
            'Padroneggiare il flusso dei dati — acquisizione, arricchimento, gestione',
          body: "È il precedente più diretto che posso portare. Il PIM aveva esattamente questa forma: raccogliere i dati di prodotto dai sistemi sorgente, arricchirli e standardizzarli per renderli davvero utilizzabili, poi consegnarli ai canali che ne avevano bisogno. Sul fronte dell'arricchimento con AI, PlayerGrade è mio: acquisisce dati di partita, tracking e video, e su Google AI Studio e Vertex AI addestro e affino i modelli che trasformano quel flusso grezzo in un punteggio di cui le persone si fidano davvero. Arricchimento manuale, a regole e con AI sono tre risposte alla stessa domanda; il primo e il terzo li ho rilasciati.",
        },
        {
          id: 'measure',
          title: 'Misurare ciò che conta, e riportarlo nelle priorità',
          body: "Ogni progetto che ho guidato viene giudicato dopo su un numero: +70% di time-to-market, 100% di adozione su oltre 50 team, +30% di adozione dopo il riposizionamento, −55% sul tempo di caricamento, zero downtime per oltre 165 milioni di utenti. In Runtastic ho definito e riportato OKR e KPI di adozione ai dirigenti, usandoli per guidare la roadmap e non per decorarla. Definire la metrica prima di costruire è l'unico modo perché l'analisi successiva significhi qualcosa.",
        },
        {
          id: 'market',
          title: 'Tenere d’occhio il brand measurement',
          body: "Sono stato dal lato di chi compra in questo mercato. In adidas gestivo Sprinklr — una licenza da 1 milione di euro l'anno — e il motore di social commerce costruito internamente invece di comprare ancora. Ho quindi vissuto le valutazioni dei fornitori, i rinnovi e le discussioni interne su quali numeri contassero davvero per il brand. So cosa un team marketing sta realmente cercando di dimostrare quando chiede una piattaforma di misurazione, perché era a me che lo chiedevano.",
        },
        {
          id: 'stakeholders',
          title: 'Parlare la lingua giusta a ciascun interlocutore',
          body: "L'annuncio cerca qualcuno capace di parlare con gli ingegneri e con il business, ed essere credibile per entrambi. Questa traduzione è la mia quotidianità: scrivo specifiche e criteri di accettazione su cui gli ingegneri possono costruire, e business case che i dirigenti finanziano — in adidas per spese nell'ordine del milione di euro. Scrivo anche codice di persona, il che conta soprattutto perché mi permette di sentire quando una stima è in realtà un problema di modello dei dati travestito.",
        },
        {
          id: 'raisebar',
          title: 'Alzare il livello attorno a sé',
          body: "Contribuire agli strumenti condivisi è un'abitudine, non un extra. In adidas ho unito decine di strumenti interni scollegati in un'unica piattaforma proprio perché quel livello condiviso non era il lavoro di nessuno e il problema di tutti. E costruisco i miei strumenti quando la mancanza è evidente — PlayerGrade, e la pipeline analitica dietro questo sito, inclusa la classificazione dei bot che ne tiene onesti i numeri.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Quello che Launchmetrics cerca',
          rows: [
            {
              requirement:
                'Circa 5 anni in product management o data management, rilasciando con ingegneri in ambito SaaS',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni, da Product Owner a Head of Product, dal 2016 al 2025 — sempre rilasciando con team di ingegneria, interni ed esterni.',
            },
            {
              requirement: 'Padronanza di SQL',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Scrivo le mie query per rispondere alle domande di prodotto invece di aspettare un analista — SQL, insieme a PowerBI e Google Analytics, ogni settimana.',
            },
            {
              requirement:
                'A proprio agio con modellazione dei dati, pipeline e API',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Per essere onesto: interrogo i dati, non ho posseduto lo schema. Ho specificato e consumato API, e in StagStrat lavoro ogni giorno con una piattaforma su PostgreSQL che acquisisce dati di mercato in tempo reale — ma progettare il modello e gestire la pipeline è lavoro accanto al quale sono stato, non che ho fatto.',
            },
            {
              requirement:
                'Comprendere il ciclo di vita del dato, dall’acquisizione alla consegna, e migliorarne la qualità',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Il PIM di adidas era quel ciclo completo: raccogliere i dati di prodotto dai sistemi sorgente, arricchirli e standardizzarli, distribuirli ai canali che servivano — con la qualità come vero obiettivo, dato che un dato di prodotto sbagliato arriva dritto al cliente.',
            },
            {
              requirement:
                'Qualche anno su problemi di dati, analytics o data-product accanto a ingegneri',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Il PIM e lo stack di misurazione Sprinklr/adiSCom in adidas, PlayerGrade come prodotto di dati AI, e oggi una piattaforma di trading guidata da modelli. I prodotti di dati sono il filo conduttore, anche quando il titolo diceva Product Manager.',
            },
            {
              requirement:
                'Senso del business — sapere perché un tipo di dato conta per un brand di moda e un altro no',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Otto anni in adidas, che è nella vostra lista clienti. Sono stato io a decidere quali attributi di prodotto meritassero lo sforzo di standardizzazione e quali numeri un team di brand avrebbe davvero usato.',
            },
            {
              requirement:
                'Curiosità per le sfide di brand della moda e del lusso',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Le ho vissute: coerenza di marca su oltre 50 mercati, dati di prodotto che dovevano essere corretti prima di un lancio, e una misurazione che doveva reggere il confronto con un direttore marketing.',
            },
            {
              requirement:
                'Un vero istinto di discovery — partire dal problema, non dalla soluzione',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Entrambi i miei risultati più netti nascono dalla discovery: il PIM ha funzionato perché avevo capito come i mercati se la cavavano senza; PlayerGrade è stato adottato solo dopo aver capito come i suoi utenti giudicavano ciò che stava valutando.',
            },
            {
              requirement:
                'Autonomia tra i craft — abbastanza pensiero di prodotto e ragionamento sull’interfaccia da far avanzare un pod',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Ho guidato la ricostruzione front-end Next.js/React della piattaforma Runtastic e costruisco i miei prodotti end-to-end: so abbozzare l'interfaccia e ragionare sui compromessi senza dipendere da altri.",
            },
            {
              requirement:
                'Comunicazione chiara con pubblici tecnici e di business; inglese fluente',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2, e nove anni a riportare la direzione di prodotto ai dirigenti mentre briffo gli ingegneri ogni giorno.',
            },
            {
              requirement: 'Altre lingue sono un plus gradito',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Italiano B2, tedesco e slovacco, oltre all'inglese. Per essere chiaro: questa pagina è offerta in quattro lingue, ma francese e spagnolo sono traduzioni e non lingue che parlo — preferisco dirlo piuttosto che lasciarlo intendere dal selettore.",
            },
          ],
        },
        {
          title: 'Dominio, piattaforma dati e contesto',
          rows: [
            {
              requirement:
                'Gestire una piattaforma dati: datalake, pipeline su larga scala, arricchimento in volume',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'La mia lacuna onesta. Il PIM era un ciclo di dati reale ma su scala di brand, non di piattaforma, e non ho mai gestito un datalake né un sistema di ingestione che gira di continuo su molte fonti esterne. È qui che imparerei più in fretta.',
            },
            {
              requirement:
                'Operazioni di arricchimento manuale e a regole su larga scala',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Ho costruito regole di standardizzazione e il flusso umano attorno, per dati di prodotto, ma non un'operazione di arricchimento delle dimensioni che implica una piattaforma da 1.200 clienti. La forma mi è familiare; il volume no.",
            },
            {
              requirement: 'Arricchimento basato su AI',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "PlayerGrade trasforma dati grezzi di partita, tracking e video in punteggi affidabili — addestrati, affinati e serviti da me su Google AI Studio e Vertex AI. Assemblo e rilascio modelli su una suite gestita invece di ideare architetture, che è l'altezza giusta per questo ruolo.",
            },
            {
              requirement: 'Prodotti di brand measurement e performance',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Gestivo lo stack di misurazione del brand in adidas — Sprinklr con licenza da 1 M€/anno più adiSCom con oltre 500.000 interazioni al mese — dal lato cliente esattamente di questa categoria.',
            },
            {
              requirement: 'Conoscenza del settore Moda, Lifestyle e Beauty',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Otto anni nello sportswear globale in adidas, tra dati di prodotto, social commerce e marketing di marca.',
            },
            {
              requirement:
                'Modello a pod — team piccolo, autonomia piena, responsabilità dallo scoping all’adozione',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Head of Product in una fintech in fase iniziale dopo otto anni in una grande organizzazione, e PlayerGrade costruito end-to-end di mia iniziativa. Ho scelto deliberatamente la dimensione piccola.',
            },
            {
              requirement: 'Full remote, team europeo',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Vivo vicino a Firenze e lavoro già da remoto oltre confine — Milano è il vostro ufficio più vicino, a un viaggio in treno quando un pod vuole trovarsi in una stanza. Nessun trasferimento, nessun visto, nessun fuso orario di mezzo.',
            },
            {
              requirement:
                'A proprio agio in un ambiente veloce, voglia di imparare',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Ho imparato da solo a costruire e addestrare modelli abbastanza bene da metterne uno in uso reale in un club professionistico. Qui la curva è più ripida sul lato piattaforma dati, ed è esattamente questo l'interesse.",
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'La metà dei dati',
      statusBadge: 'adidas — PIM su oltre 50 team di mercato',
      heading:
        'Vendete già ad adidas. Io ci ho passato otto anni, dal lato dei dati.',
      body: 'Launchmetrics raccoglie dati, li arricchisce e li rende accessibili in modo affidabile — ed è quasi esattamente ciò che ho costruito in adidas, un livello a monte. Il PIM prendeva i dati di prodotto dai sistemi sorgente, li arricchiva e li standardizzava perché ogni mercato potesse usarli davvero, e li distribuiva ai canali che li vendevano. Rilasciato con un team di sviluppo esterno, nei tempi previsti, 100% di adozione il primo giorno, time-to-market migliorato del 70%. In parallelo gestivo lo stack di misurazione: Sprinklr con licenza da 1 M€/anno e adiSCom, il motore di social commerce costruito internamente, con oltre 500.000 interazioni al mese. Sono quindi stato su entrambe le metà della vostra proposta di valore — la pipeline dei dati di prodotto e il livello di misurazione sopra — dalla parte del cliente. È questo che mi sembra davvero raro qui: non aver lavorato con i dati, ma sapere perché un brand di moda tiene a un attributo e ne ignora un altro, perché ho dovuto difendere il budget per far sì che il primo fosse corretto.',
      credentials: [
        'PIM adidas — raccogliere, arricchire, distribuire',
        '+70% time-to-market · 100% adozione al giorno 1',
        'Sprinklr — 1 M€/anno di brand measurement',
        'PlayerGrade — arricchimento AI su Vertex AI',
      ],
      closingLine:
        'I vostri clienti comprano il dato tanto quanto la piattaforma. Sono stato uno di quei clienti, e so quanto in fretta un team di brand smette di fidarsi di un numero che una volta si è rivelato sbagliato.',
    },
    gap: {
      chip: 'Profondità sui dati, con onestà',
      heading:
        'Interrogo i dati ogni giorno. Non ho costruito la pipeline sotto di essi.',
      body: "Tracciamo la linea con precisione invece di sfumarla. Padroneggio SQL nel senso che conta quotidianamente: scrivo le mie query su schemi reali per rispondere a domande di prodotto, senza aspettare qualcun altro. Quello che non ho fatto è gestire il livello sottostante — progettare il modello dei dati, costruire e far girare pipeline di ingestione, o tenere insieme un datalake al volume che implica una piattaforma da 1.200 clienti. Ho specificato e consumato API, lavoro accanto a una piattaforma PostgreSQL che acquisisce dati di mercato in tempo reale, e ho addestrato e rilasciato modelli che arricchiscono flussi grezzi — ma l'ingegneria sottostante è stata il mestiere dei miei colleghi, non il mio. Il vostro annuncio cerca un Product Builder con competenza sui dati, non un data engineer, e la tesi che porterei è che il giudizio di prodotto, la conoscenza del settore e l'istinto di discovery sono le metà più difficili da assumere, mentre la profondità sulle pipeline è quella che posso colmare più in fretta con ingegneri che già conoscono il vostro stack. Se vi serve qualcuno che sappia progettare il datalake dal primo giorno, non sono io, e preferisco che lo sappiate ora.",
    },
    closing: {
      eyebrow: 'Perché Launchmetrics',
      heading: 'I dati dietro un brand, che è da dove sono partito',
      body: "La maggior parte dei ruoli di prodotto chiede di scegliere una parte: i dati, o il settore che dà loro significato. Questo le vuole entrambe, e sono esattamente le due metà che già ho. Ho passato otto anni dentro un brand che è nella vostra lista clienti, a decidere quali dati di prodotto meritassero di essere standardizzati e quali numeri un team marketing avrebbe davvero usato — e gli ultimi due a costruire prodotti di dati con le mie mani, addestrando modelli e consegnandoli a persone che avevano ottime ragioni per non fidarsene. Un settore in cui i clienti comprano il dato quanto la piattaforma è un settore in cui la qualità è il prodotto, ed è un problema molto più interessante di quanto sembri da fuori. Aggiungete un modello a pod che vi affida una missione e vi lascia lavorare, e sembra un ruolo costruito per chi vuole portare tutto l'arco invece di una fetta.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglese C2 · Italiano B2 · Tedesco · Slovacco',
        'Da remoto dall’Italia — Milano vicina',
      ],
      signature:
        'Lukáš Hošala — con base vicino a Firenze, pronto da remoto, a un treno dall’ufficio di Milano.',
    },
  },

  es: {
    hero: {
      eyebrow: 'Launchmetrics · En remoto · Senior Product Builder, Data',
      headlineLead: 'Dior, Fendi, Shiseido, NET-A-PORTER, adidas.',
      headlineGradient:
        'Pasé ocho años dentro del último, construyendo su pipeline de datos de producto.',
      description:
        'Vuestra lista de clientes es donde empieza mi trayectoria. En adidas construí el PIM que recogía los datos de producto, los enriquecía a un estándar común y los distribuía a más de 50 equipos de mercado — adquisición, enriquecimiento, entrega, una capa por encima de lo que vendéis — y gestioné la plataforma de 1 M€ con la que la marca se medía. Hoy soy Head of Product en una fintech de trading algorítmico, en contacto diario con datos y modelos en producción. Esta página compara todo eso con el puesto de Data Collection & Enrichment, con honestidad — incluido el punto exacto donde se acaba mi profundidad técnica.',
      chips: [
        'Ciclo de vida del dato de producto',
        'Moda y Belleza',
        'SQL y Analytics',
        'Enriquecimiento con IA',
        'En remoto, cerca de Milán',
      ],
      stats: [
        { value: '8+', label: 'Años en product management' },
        { value: '50+', label: 'Equipos de mercado en el PIM que construí' },
        { value: '165M+', label: 'Usuarios en la plataforma que dirigí' },
        { value: '€1M', label: 'Licencia de brand measurement que gestioné' },
      ],
    },
    roleMapSection: {
      eyebrow: 'El puesto, punto por punto',
      heading: 'Lo que busca Launchmetrics — y dónde ya lo he hecho',
      items: [
        {
          id: 'users',
          title: 'Hablar con vuestros usuarios. Mucho.',
          body: 'Convertir necesidades difusas en requisitos medibles es mi trabajo desde hace nueve años, y esos usuarios casi nunca dependían de mí. El PIM de adidas daba servicio a más de 50 equipos de mercado en países distintos, cada uno convencido de que sus datos de producto locales eran la excepción; la Global Admin Application daba servicio a más de 1.000 profesionales de unidades de negocio separadas. En ambos casos el trabajo empezaba sentándome con ellos hasta entender por qué existía el desorden actual, porque un modelo de datos construido sin ese contexto se esquiva en silencio en lugar de adoptarse.',
        },
        {
          id: 'missions',
          title:
            'Ser responsable de las misiones de principio a fin — adopción incluida',
          body: 'Definir y construir es la mitad que todos reivindican; es en la habilitación y la adopción donde la responsabilidad se detiene en silencio. El PIM alcanzó el 100% de adopción el primer día y redujo el time-to-market un 70%, porque la documentación y la formación se entregaron con él y no después. La plataforma Sprinklr de 1 M€ ganó un 30% de adopción cuando se reconstruyó en torno a cómo trabajaban realmente los equipos. Mantengo una fuente de verdad visible, porque en un pod pequeño la alternativa son tres personas con tres versiones del plan.',
        },
        {
          id: 'dataflow',
          title:
            'Dominar el flujo de datos — adquisición, enriquecimiento, gestión',
          body: 'Es el precedente más directo que puedo presentar. El PIM tenía exactamente esa forma: recoger datos de producto de los sistemas fuente, enriquecerlos y estandarizarlos para que fueran realmente utilizables, y entregarlos después a los canales que los necesitaban. En el lado del enriquecimiento con IA, PlayerGrade es mío: ingiere datos de partido, tracking y vídeo, y en Google AI Studio y Vertex AI entreno y ajusto los modelos que convierten ese flujo bruto en una puntuación en la que la gente confía de verdad. Enriquecimiento manual, por reglas y con IA son tres respuestas a la misma pregunta; la primera y la tercera las he entregado.',
        },
        {
          id: 'measure',
          title: 'Medir lo que importa y devolverlo a la priorización',
          body: 'Cada proyecto que he dirigido se juzga después con una cifra: +70% de time-to-market, 100% de adopción en más de 50 equipos, +30% de adopción tras el reposicionamiento, −55% en tiempo de carga, cero caídas para más de 165 millones de usuarios. En Runtastic definí y reporté OKR y KPI de adopción a la dirección, y los usé para guiar la hoja de ruta en lugar de decorarla. Definir la métrica antes de construir es la única forma de que el análisis posterior signifique algo.',
        },
        {
          id: 'market',
          title: 'No perder de vista el brand measurement',
          body: 'He estado en el lado comprador de este mercado. En adidas gestionaba Sprinklr — una licencia de 1 millón de euros al año — y el motor de social commerce que construimos internamente en lugar de comprar más. Así que viví las evaluaciones de proveedores, las renovaciones y las discusiones internas sobre qué cifras importaban de verdad a la marca. Sé qué intenta demostrar realmente un equipo de marketing cuando pide una plataforma de medición, porque era a mí a quien se lo pedían.',
        },
        {
          id: 'stakeholders',
          title: 'Hablar el idioma adecuado a cada interlocutor',
          body: 'La oferta busca a alguien capaz de hablar con ingeniería y con negocio, y de ser creíble para ambos. Esa traducción es mi día a día: escribo especificaciones y criterios de aceptación sobre los que ingeniería puede construir, y business cases que la dirección financia — en adidas para gasto del orden del millón de euros. También escribo código yo mismo, lo que importa sobre todo porque me permite oír cuándo una estimación es en realidad un problema de modelo de datos disfrazado.',
        },
        {
          id: 'raisebar',
          title: 'Subir el nivel a tu alrededor',
          body: 'Contribuir a las herramientas compartidas es un hábito, no un añadido. En adidas unifiqué decenas de herramientas internas inconexas en una sola plataforma precisamente porque esa capa compartida no era el trabajo de nadie y el problema de todos. Y construyo mis propias herramientas cuando la carencia es evidente — PlayerGrade, y el pipeline de analítica detrás de esta web, incluida la clasificación de bots que mantiene honestas sus cifras.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondencia con el perfil',
      heading: 'Dónde encajo, y dónde no',
      panels: [
        {
          title: 'Lo que busca Launchmetrics',
          rows: [
            {
              requirement:
                'Unos 5 años en product management o data management, entregando junto a ingeniería en SaaS',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Nueve años, de Product Owner a Head of Product, de 2016 a 2025 — siempre entregando con equipos de ingeniería, internos y externos.',
            },
            {
              requirement: 'Dominio de SQL',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Escribo mis propias consultas para responder preguntas de producto en lugar de esperar a un analista — SQL, junto a PowerBI y Google Analytics, cada semana.',
            },
            {
              requirement: 'Cómodo con modelado de datos, pipelines y APIs',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Siendo honesto: consulto los datos, no he sido dueño del esquema. He especificado y consumido APIs, y en StagStrat trabajo a diario con una plataforma sobre PostgreSQL que ingiere datos de mercado en vivo — pero diseñar el modelo y llevar el pipeline es trabajo junto al que he estado, no que haya hecho.',
            },
            {
              requirement:
                'Entender el ciclo de vida del dato, de la adquisición a la entrega, y mejorar su calidad',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'El PIM de adidas era ese ciclo completo: recoger datos de producto de los sistemas fuente, enriquecerlos y estandarizarlos, distribuirlos a los canales que los necesitaban — con la calidad como el objetivo real, ya que un dato de producto erróneo llega directo al cliente.',
            },
            {
              requirement:
                'Algunos años en problemas de datos, analítica o data-product junto a ingeniería',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'El PIM y el stack de medición Sprinklr/adiSCom en adidas, PlayerGrade como producto de datos con IA, y ahora una plataforma de trading guiada por modelos. Los productos de datos son el hilo conductor, aunque el título dijera Product Manager.',
            },
            {
              requirement:
                'Sentido de negocio — saber por qué un tipo de dato importa a una marca de moda y otro no',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Ocho años en adidas, que está en vuestra lista de clientes. He sido quien decidía qué atributos de producto merecían el esfuerzo de estandarizar y qué cifras usaría de verdad un equipo de marca.',
            },
            {
              requirement:
                'Curiosidad por los retos de marca de la moda y el lujo',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Los he vivido: coherencia de marca en más de 50 mercados, datos de producto que tenían que estar bien antes de un lanzamiento, y una medición que debía sobrevivir al contacto con un director de marketing.',
            },
            {
              requirement:
                'Un instinto real de discovery — partir del problema, no de la solución',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Mis dos aciertos más claros nacen del discovery: el PIM funcionó porque entendí cómo se apañaban los mercados sin él, y PlayerGrade solo se adoptó cuando entendí cómo sus usuarios juzgaban aquello que puntuaba.',
            },
            {
              requirement:
                'Autosuficiente entre crafts — suficiente pensamiento de producto y razonamiento de interfaz para hacer avanzar un pod',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Dirigí la reconstrucción front-end en Next.js/React de la plataforma Runtastic y construyo mis propios productos de principio a fin: puedo esbozar la interfaz y razonar el compromiso sin bloquearme esperando a otra persona.',
            },
            {
              requirement:
                'Comunicación clara con públicos técnicos y de negocio; inglés fluido',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Inglés C2, y nueve años reportando la dirección de producto a la dirección mientras informo a ingeniería a diario.',
            },
            {
              requirement: 'Otros idiomas son un plus',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Italiano B2, alemán y eslovaco, además del inglés. Para ser claro: esta página se ofrece en cuatro idiomas, pero el francés y el español son traducciones y no idiomas que yo hable — prefiero decirlo a dejar que el selector lo sugiera.',
            },
          ],
        },
        {
          title: 'Sector, plataforma de datos y contexto',
          rows: [
            {
              requirement:
                'Ser dueño de una plataforma de datos: datalake, pipelines a gran escala, enriquecimiento en volumen',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Mi carencia honesta. El PIM era un ciclo de datos real pero a escala de marca, no de plataforma, y nunca he sido dueño de un datalake ni de un sistema de ingesta funcionando de forma continua contra muchas fuentes externas. Es donde aprendería más rápido.',
            },
            {
              requirement:
                'Operaciones de enriquecimiento manual y por reglas a gran escala',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'He construido reglas de estandarización y el flujo humano alrededor, para datos de producto, pero no una operación de enriquecimiento del tamaño que implica una plataforma con 1.200 clientes. La forma me resulta familiar; el volumen no.',
            },
            {
              requirement: 'Enriquecimiento basado en IA',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'PlayerGrade convierte datos brutos de partido, tracking y vídeo en puntuaciones fiables — entrenadas, ajustadas y servidas por mí en Google AI Studio y Vertex AI. Ensamblo y despliego modelos sobre una suite gestionada en lugar de diseñar arquitecturas, que es la altura adecuada para este puesto.',
            },
            {
              requirement: 'Productos de brand measurement y rendimiento',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Gestionaba el stack de medición de marca en adidas — Sprinklr con licencia de 1 M€/año más adiSCom con más de 500.000 interacciones al mes — desde el lado cliente de exactamente esta categoría.',
            },
            {
              requirement: 'Conocimiento del sector Moda, Lifestyle y Belleza',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Ocho años en ropa deportiva global en adidas, entre datos de producto, social commerce y marketing de marca.',
            },
            {
              requirement:
                'Modelo de pods — equipo pequeño, autonomía total, responsabilidad del scoping a la adopción',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Head of Product en una fintech en fase temprana tras ocho años en una gran organización, y PlayerGrade construido de principio a fin por iniciativa propia. He elegido deliberadamente el extremo de equipo pequeño.',
            },
            {
              requirement: 'Totalmente en remoto, equipo europeo',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Vivo cerca de Florencia y ya trabajo en remoto entre países — Milán es vuestra oficina más cercana, a un viaje en tren cuando un pod quiera reunirse. Sin traslado, sin visado, sin diferencia horaria.',
            },
            {
              requirement: 'Cómodo en un entorno rápido, con ganas de aprender',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Aprendí solo a construir y entrenar modelos lo bastante bien como para poner uno en uso real en un club profesional. Aquí la curva es más pronunciada en el lado de la plataforma de datos, y eso es precisamente lo atractivo.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'La mitad de los datos',
      statusBadge: 'adidas — PIM en más de 50 equipos de mercado',
      heading:
        'Ya vendéis a adidas. Yo pasé ocho años dentro, en el lado de los datos.',
      body: 'Launchmetrics recoge datos, los enriquece y los hace accesibles de forma fiable — y eso es casi exactamente lo que construí en adidas, una capa más arriba. El PIM tomaba los datos de producto de los sistemas fuente, los enriquecía y estandarizaba para que cada mercado pudiera usarlos de verdad, y los distribuía a los canales que los vendían. Entregado con un equipo de desarrollo externo, en plazo, 100% de adopción el primer día, time-to-market mejorado un 70%. En paralelo gestionaba el stack de medición: Sprinklr con licencia de 1 M€/año y adiSCom, el motor de social commerce que construimos internamente, con más de 500.000 interacciones al mes. Así que he estado en las dos mitades de vuestra propuesta de valor — el pipeline de datos de producto y la capa de medición encima — desde el lado del cliente. Eso es lo que me parece realmente escaso aquí: no haber trabajado con datos, sino saber por qué una marca de moda se preocupa por un atributo y se encoge de hombros ante otro, porque me tocó defender el presupuesto para que el primero estuviera bien.',
      credentials: [
        'PIM adidas — recoger, enriquecer, distribuir',
        '+70% time-to-market · 100% adopción el día 1',
        'Sprinklr — 1 M€/año de brand measurement',
        'PlayerGrade — enriquecimiento con IA en Vertex AI',
      ],
      closingLine:
        'Vuestros clientes compran el dato tanto como la plataforma. Yo fui uno de esos clientes, y sé lo rápido que un equipo de marca deja de fiarse de una cifra que resultó equivocada una sola vez.',
    },
    gap: {
      chip: 'Profundidad en datos, con honestidad',
      heading:
        'Consulto datos todos los días. No he construido el pipeline que hay debajo.',
      body: 'Tracemos la línea con precisión en vez de difuminarla. Domino SQL en el sentido que importa a diario: escribo mis propias consultas sobre esquemas reales para responder preguntas de producto, sin esperar a nadie. Lo que no he hecho es ser dueño de la capa de abajo — diseñar el modelo de datos, construir y operar pipelines de ingesta, o sostener un datalake al volumen que implica una plataforma con 1.200 clientes. He especificado y consumido APIs, trabajo junto a una plataforma PostgreSQL que ingiere datos de mercado en vivo, y he entrenado y desplegado modelos que enriquecen flujos brutos — pero la ingeniería de debajo ha sido el oficio de mis compañeros, no el mío. Vuestra oferta busca un Product Builder con experiencia en datos, no un data engineer, y el argumento que traigo es que el criterio de producto, el conocimiento del sector y el instinto de discovery son las mitades más difíciles de contratar, mientras que la profundidad en pipelines es lo que puedo cerrar más rápido con ingenieros que ya conocen vuestro stack. Si necesitáis a alguien capaz de diseñar el datalake el primer día, no soy esa persona, y prefiero que lo sepáis ahora.',
    },
    closing: {
      eyebrow: 'Por qué Launchmetrics',
      heading: 'Los datos detrás de una marca, que es donde empecé',
      body: 'La mayoría de los puestos de producto piden elegir un bando: los datos, o el sector que les da sentido. Este quiere ambos, y son las dos mitades que ya tengo. Pasé ocho años dentro de una marca de vuestra lista de clientes, decidiendo qué datos de producto merecían estandarizarse y qué cifras usaría de verdad un equipo de marketing — y los dos últimos construyendo productos de datos con mis manos, entrenando modelos y entregándolos a personas que tenían todos los motivos para desconfiar. Un sector donde los clientes compran el dato tanto como la plataforma es un sector donde la calidad es el producto, y ese es un problema mucho más interesante de lo que parece desde fuera. Añadid un modelo de pods que te entrega una misión y te deja trabajar, y se lee como un puesto hecho para quien quiere llevar el arco completo en lugar de una porción.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglés C2 · Italiano B2 · Alemán · Eslovaco',
        'En remoto desde Italia — Milán cerca',
      ],
      signature:
        'Lukáš Hošala — con base cerca de Florencia, listo para remoto, a un tren de la oficina de Milán.',
    },
  },
}
