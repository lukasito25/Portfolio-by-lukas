export type Locale = 'en' | 'fr' | 'it' | 'de' | 'es'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'roadmap'
    | 'initiatives'
    | 'fullstack'
    | 'decisions'
    | 'data'
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

export interface QontoContent {
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
  /** Standout credential — here: an AI product taken 0 to 1, alone. */
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

export const qontoContent: Record<Locale, QontoContent> = {
  en: {
    hero: {
      eyebrow: 'Qonto · Milan · Staff Product Manager, AI Products',
      headlineLead:
        'Categorising a transaction and grading a player are the same problem.',
      headlineGradient:
        'Messy input, a judgement someone has to trust, and one chance to earn that trust.',
      description:
        "I'm Head of Product at an algorithmic trading fintech, and I built PlayerGrade — an AI product I took from nothing to live use at a professional club, trained and served by me on Google AI Studio and Vertex AI. Before that, eight years at adidas owning a platform used by 165M+ people. This page maps that against the Staff AI Product Manager role, honestly — including the part where I've taken an AI product 0 to 1 but not yet scaled one to 600,000 customers.",
      chips: [
        'AI Product 0 → 1',
        'Fintech Product',
        'Vertex AI · AI Studio',
        'Milan office',
        'Outcomes, not features',
      ],
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '165M+', label: 'Users on the platform I owned' },
        { value: '500K+', label: 'Monthly interactions on the engine I ran' },
        { value: '13+', label: 'People led, across 3 countries' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What Qonto is asking for — and where I've already done it",
      items: [
        {
          id: 'roadmap',
          title: 'Own the AI product roadmap end to end',
          body: "Deciding what gets built, why, and in what order — from engineering, data and business inputs — is the job I've had for nine years. I owned the roadmap for a platform used by 165M+ people at Runtastic and set product strategy outright at StagStrat. What's specific to AI is that the roadmap has to survive contact with what the model can actually do this quarter, which is a conversation I've had from both sides: I've been the PM asking, and the person who then had to build it.",
        },
        {
          id: 'initiatives',
          title: 'Attachment Matcher, Transaction Categorizer, Cashflow',
          body: 'These are three variations of one problem I have shipped: take messy real-world input, produce a judgement, and make it trustworthy enough that someone acts on it without checking. PlayerGrade ingests match, tracking and video data and returns a score a club uses in transfer decisions. At adidas the PIM did the unglamorous version — standardising product attributes so that data was right before it reached a customer. Matching and categorising are the same shape; the domain is what changes.',
        },
        {
          id: 'fullstack',
          title: 'Working across data science, engineering and business',
          body: 'Translating between those three is what a PM is for, and I do it with an unusual amount of the middle: I train, tune and evaluate models myself on Google AI Studio and Vertex AI, and write production code in Python and FastAPI. That means requirements arrive with the constraints already thought through, and I can tell when an estimate is really a data problem in disguise. At adidas the same translation ran across legal, procurement, IT and 50+ market teams, none of whom reported to me.',
        },
        {
          id: 'decisions',
          title: 'Own the decision, and explain the reasoning',
          body: "A decision nobody understands gets relitigated every sprint. I report direction and trade-offs to executives, brief engineers daily, and have argued business cases for spend at the €1M level at adidas. The AI-specific version is harder and I've had to do it: explaining to people who don't care how a model works why it is confident here and unreliable there, and what that means for whether they should trust the number in front of them.",
        },
        {
          id: 'data',
          title: 'Improve continuously through data',
          body: "Every project I've led is judged afterwards on a number: +70% speed to market, 100% adoption across 50+ teams, +30% adoption after repositioning, −55% page load, zero downtime for 165M+ users. With PlayerGrade the measurement is ongoing rather than final — I watch how the model behaves on new data and retune it, because a scoring product that quietly degrades is worse than no product at all.",
        },
        {
          id: 'autonomy',
          title: 'Squad autonomy, and shipping without permission',
          body: "The posting says you want people who experiment without waiting for permission. That is literally how PlayerGrade exists — nobody asked for it; the problem was worth solving so I built it. I chose the small-team end deliberately after eight years in a large organisation, and I'm now Head of Product at an early-stage fintech where there is no approval chain to hide behind.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'What Qonto is looking for',
          rows: [
            {
              requirement:
                'Product management experience with an LLM/AI focus, with concrete ML or AI products taken 0 → 1',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'PlayerGrade: from nothing to live use at a professional football club. I chose the approach, trained and tuned the models on Google AI Studio and Vertex AI, and shipped it. That is the 0 → 1 half of your requirement, done alone.',
            },
            {
              requirement: 'AI products significantly scaled',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "The other half, and my honest gap. PlayerGrade serves one club, not 600,000 SMEs. I've scaled non-AI products to 165M+ users and run a platform handling 500K+ monthly interactions, so I know what scale does to a system — but not yet to a model in production.",
            },
            {
              requirement:
                'Technical fluency in ML — collaborate with technical teams and translate into product requirements',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                "I train, tune and evaluate models on a managed suite rather than authoring architectures, which is exactly the altitude this asks for: enough depth to hold a real conversation about trade-offs, not so much that I'd be doing the data scientists' job for them.",
            },
            {
              requirement: 'Think in outcomes, not features',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Everything I have shipped was judged on a number afterwards, and I set the metric before building rather than reverse-engineering a win from whatever moved.',
            },
            {
              requirement:
                'Strong stakeholder management; explain complex technical concepts to non-technical audiences',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years of reporting direction to executives while briefing engineers daily — and the harder version with PlayerGrade, convincing people with no interest in how it works that a score was worth acting on.',
            },
            {
              requirement:
                'Analytical thinking; data-driven decisions and hard trade-offs',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I decide off SQL, PowerBI and Google Analytics, and at StagStrat off live output where latency is money — a model that answers too slowly is wrong regardless of how good it is.',
            },
            {
              requirement:
                'Strategic vision — a roadmap that aligns with company goals and delivers measurable impact',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Owned the roadmap for a 165M+ user platform and set product strategy end-to-end at StagStrat, reporting outcomes against OKRs rather than output.',
            },
          ],
        },
        {
          title: 'Domain, scale & context',
          rows: [
            {
              requirement: 'Fintech product experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at an algorithmic trading platform, where the product moves real capital and being wrong is expensive in a way that concentrates the mind.',
            },
            {
              requirement: 'A second ML product in finance specifically',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "To be precise rather than flattering: StagStrat is algorithmic, not learned — rules and statistics rather than trained models. It is genuine fintech and genuine real-money decisions, but I won't call it machine learning, because you asked for ML products and it isn't one.",
            },
            {
              requirement:
                'Banking and SME finance domain (expenses, attachments, cashflow)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "I've worked in trading, not banking, and I've been an SME customer of exactly these tools rather than a builder of them. The regulatory and product specifics of business banking are new to me.",
            },
            {
              requirement: 'Working alongside a data science team',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                "My AI work has been solo — I was the data scientist as well as the PM. That gives me unusual empathy for what I'd be asking of your team, but partnering with specialists who are better at it than me is a mode I have not yet practised.",
            },
            {
              requirement:
                'Classification and matching problems on messy real-world input',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'PlayerGrade turns raw match, tracking and video data into a trusted score; the adidas PIM standardised inconsistent product attributes into something 50+ markets could use. Both are the shape of a categoriser.',
            },
            {
              requirement: 'Hands-on with LLM tooling and modern AI platforms',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Google AI Studio and Vertex AI, weekly. Your posting says you want people who push AI beyond the obvious and know when to question it — I have shipped enough to have been burned by trusting output I should have checked.',
            },
            {
              requirement: 'Hybrid, from Paris, Milan, Berlin or Barcelona',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I live near Florence. Milan is a short train ride, so hybrid works without relocation, a visa, or a timezone gap.',
            },
            {
              requirement: 'International team, multiple languages',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2, Italian B2, German and Slovak. Straight about it: this page is offered in five languages, but the French and Spanish are translations rather than fluencies of mine.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The 0 → 1',
      statusBadge: 'PlayerGrade — live at a professional club',
      heading:
        'You asked for an AI product taken from nothing. Here is mine, and I built all of it.',
      body: 'PlayerGrade started as a problem nobody had asked me to solve. It ingests match, tracking and video data, models player performance, and returns a score that a professional club now uses in real transfer decisions. I chose the approach, trained and tuned the models on Google AI Studio and Vertex AI, wrote the code in Python and FastAPI, and shipped it. Then came the part that actually mattered: earning the trust of people with no interest whatsoever in how it works. That is the same problem as a Transaction Categorizer. A user does not want to understand your model — they want to stop checking its output. Getting there was less about accuracy than about being honest where the model was weak, showing its reasoning where it counted, and failing visibly rather than silently. I would rather bring that lesson to Attachment Matcher than a longer list of frameworks.',
      credentials: [
        'PlayerGrade — 0 → 1, built alone',
        'Google AI Studio · Vertex AI',
        'Python · FastAPI · PostgreSQL',
        'In live use at a professional club',
      ],
      closingLine:
        'AI is deeply embedded in how you work, and you want people who experiment without waiting for permission. PlayerGrade exists precisely because I did not wait for permission.',
    },
    gap: {
      chip: 'Scale, honestly',
      heading:
        "I've taken an AI product 0 → 1. I haven't scaled one to 600,000 customers.",
      body: 'Your requirement has two halves and I only have one of them cleanly. The 0 → 1 is real and it is mine end to end. The scaling is not: PlayerGrade serves one club, and the problems that appear when a model faces hundreds of thousands of customers — drift across segments, edge cases arriving faster than you can label them, the cost of being wrong multiplied by volume — I have read about rather than lived. What I do bring against that is scale in the non-AI direction: a platform used by 165M+ people, an engine handling 500K+ monthly interactions, and a three-country migration with zero downtime, so I know what volume does to a system even if I have not yet watched it do that to a model. Two other things I would rather state than let you discover: StagStrat is algorithmic rather than learned, so it is fintech credibility but not a second ML product; and my ML depth is applied — I assemble, train and deploy on managed platforms, I do not author architectures. If you need someone who has already run AI at your scale, that is not me yet. If you need someone who has actually shipped one alone and knows exactly how trust is won and lost, that is.',
    },
    closing: {
      eyebrow: 'Why Qonto',
      heading:
        'A domain being reshaped by AI, and I want to be doing the reshaping',
      body: 'The roles I keep turning down are the ones maintaining something that already works. This one says, in its own words, that you build at the frontier rather than maintain — in a domain where ML genuinely changes what the product can be, for 600,000 businesses whose finance admin is the least interesting part of their week. I have spent a career making complicated things feel obvious, most recently by building an AI product alone and discovering that the hard part is never the model. Add squad autonomy, no approval chains, and an office in Milan that I can reach on a train, and the honest answer is that this is the role I would have written for myself — including the part where you would be betting on 0 → 1 experience rather than experience at your scale.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · Italian B2 · German · Slovak',
        'Near Florence — Milan hybrid',
      ],
      signature:
        'Lukáš Hošala — based near Florence, a train ride from the Milan office.',
    },
  },

  fr: {
    hero: {
      eyebrow: 'Qonto · Milan · Staff Product Manager, AI Products',
      headlineLead:
        "Catégoriser une transaction et noter un joueur, c'est le même problème.",
      headlineGradient:
        "Des données brutes, un jugement auquel quelqu'un doit se fier, et une seule occasion de gagner cette confiance.",
      description:
        "Je suis Head of Product dans une fintech de trading algorithmique, et j'ai construit PlayerGrade — un produit d'IA que j'ai mené de zéro à un usage réel dans un club professionnel, entraîné et déployé par moi sur Google AI Studio et Vertex AI. Avant cela, huit ans chez adidas à piloter une plateforme utilisée par plus de 165 millions de personnes. Cette page confronte tout cela au poste de Staff AI Product Manager, honnêtement — y compris le fait que j'ai mené un produit d'IA de 0 à 1 sans encore l'avoir passé à l'échelle de 600 000 clients.",
      chips: [
        'Produit IA 0 → 1',
        'Produit fintech',
        'Vertex AI · AI Studio',
        'Bureau de Milan',
        'Des résultats, pas des fonctionnalités',
      ],
      stats: [
        { value: '8+', label: 'Années en product management' },
        {
          value: '165M+',
          label: 'Utilisateurs sur la plateforme que je gérais',
        },
        {
          value: '500K+',
          label: 'Interactions mensuelles sur le moteur que je gérais',
        },
        { value: '13+', label: 'Personnes encadrées, dans 3 pays' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Le poste, point par point',
      heading: "Ce que cherche Qonto — et où je l'ai déjà fait",
      items: [
        {
          id: 'roadmap',
          title: 'Porter la roadmap produit IA de bout en bout',
          body: "Décider quoi construire, pourquoi et dans quel ordre — à partir des apports de l'engineering, de la data et du business — est mon métier depuis neuf ans. J'ai porté la roadmap d'une plateforme utilisée par plus de 165 millions de personnes chez Runtastic et défini la stratégie produit de bout en bout chez StagStrat. Ce qui est propre à l'IA, c'est qu'une roadmap doit survivre au contact de ce que le modèle sait réellement faire ce trimestre — une conversation que j'ai eue des deux côtés : en tant que PM qui demande, puis en tant que personne qui doit le construire.",
        },
        {
          id: 'initiatives',
          title: 'Attachment Matcher, Transaction Categorizer, Cashflow',
          body: "Ce sont trois variantes d'un problème que j'ai déjà livré : prendre des données réelles désordonnées, produire un jugement, et le rendre assez fiable pour qu'on agisse dessus sans vérifier. PlayerGrade ingère des données de match, de tracking et vidéo et renvoie un score qu'un club utilise pour ses décisions de transfert. Chez adidas, le PIM en faisait la version ingrate : standardiser les attributs produit pour que la donnée soit juste avant d'atteindre le client. Rapprocher et catégoriser ont la même forme ; c'est le domaine qui change.",
        },
        {
          id: 'fullstack',
          title: 'Travailler avec la data science, la tech et le business',
          body: "Traduire entre ces trois mondes est la raison d'être d'un PM, et je le fais avec une part inhabituelle du milieu : j'entraîne, j'ajuste et j'évalue moi-même des modèles sur Google AI Studio et Vertex AI, et j'écris du code en Python et FastAPI. Les spécifications arrivent donc avec les contraintes déjà pensées, et je repère quand une estimation cache en réalité un problème de données. Chez adidas, la même traduction s'étendait au legal, aux achats, à l'IT et à plus de 50 équipes marché, dont aucune ne m'était rattachée.",
        },
        {
          id: 'decisions',
          title: 'Assumer la décision, et en expliquer la raison',
          body: "Une décision que personne ne comprend est rejouée à chaque sprint. Je reporte direction et arbitrages aux dirigeants, je briefe les ingénieurs au quotidien, et j'ai défendu des business cases pour des dépenses de l'ordre du million d'euros chez adidas. La version IA est plus difficile et je l'ai pratiquée : expliquer à des gens qui se moquent du fonctionnement d'un modèle pourquoi il est fiable ici et douteux là, et ce que cela implique pour la confiance à accorder au chiffre affiché.",
        },
        {
          id: 'data',
          title: 'Progresser en continu grâce à la donnée',
          body: "Chaque projet que j'ai mené est jugé ensuite sur un chiffre : +70 % de time-to-market, 100 % d'adoption sur plus de 50 équipes, +30 % d'adoption après repositionnement, −55 % de temps de chargement, zéro interruption pour plus de 165 millions d'utilisateurs. Avec PlayerGrade, la mesure est continue plutôt que finale : je surveille le comportement du modèle sur de nouvelles données et je le réajuste, car un produit de scoring qui se dégrade en silence est pire que pas de produit du tout.",
        },
        {
          id: 'autonomy',
          title: 'Autonomie de squad, et livrer sans demander la permission',
          body: "L'annonce dit que vous voulez des gens qui expérimentent sans attendre la permission. C'est littéralement l'origine de PlayerGrade : personne ne l'avait demandé, le problème méritait d'être résolu, je l'ai construit. J'ai choisi délibérément le format petite équipe après huit ans en grande organisation, et je suis aujourd'hui Head of Product dans une fintech en phase initiale, où aucune chaîne de validation ne sert d'abri.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondance avec le profil',
      heading: 'Où je corresponds, et où non',
      panels: [
        {
          title: 'Ce que cherche Qonto',
          rows: [
            {
              requirement:
                'Expérience produit orientée LLM/IA, avec des produits ML ou IA menés de 0 à 1',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "PlayerGrade : de rien à un usage réel dans un club de football professionnel. J'ai choisi l'approche, entraîné et ajusté les modèles sur Google AI Studio et Vertex AI, et livré. C'est la moitié « 0 à 1 » de votre exigence, faite seul.",
            },
            {
              requirement: "Produits d'IA passés à l'échelle",
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "L'autre moitié, et ma vraie lacune. PlayerGrade sert un club, pas 600 000 PME. J'ai passé à l'échelle des produits non-IA jusqu'à plus de 165 millions d'utilisateurs et géré une plateforme à plus de 500 000 interactions mensuelles : je sais ce que l'échelle fait à un système, mais pas encore à un modèle en production.",
            },
            {
              requirement:
                'Aisance technique en ML — collaborer avec les équipes techniques et traduire en exigences produit',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "J'entraîne, j'ajuste et j'évalue des modèles sur une suite gérée plutôt que de concevoir des architectures : exactement l'altitude demandée ici — assez de profondeur pour discuter sérieusement des arbitrages, pas au point de faire le travail des data scientists à leur place.",
            },
            {
              requirement: 'Raisonner en résultats, pas en fonctionnalités',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Tout ce que j'ai livré a été jugé ensuite sur un chiffre, et je définis la métrique avant de construire plutôt que d'inventer une victoire après coup.",
            },
            {
              requirement:
                'Gestion des parties prenantes ; expliquer des concepts techniques à des publics non techniques',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Neuf ans à reporter la direction produit aux dirigeants tout en briefant les ingénieurs — et la version plus difficile avec PlayerGrade : convaincre des gens indifférents au fonctionnement qu'un score méritait qu'on agisse dessus.",
            },
            {
              requirement:
                'Pensée analytique ; décisions fondées sur la donnée et arbitrages difficiles',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Je décide à partir de SQL, PowerBI et Google Analytics, et chez StagStrat à partir de sorties en temps réel où la latence coûte de l'argent : un modèle trop lent est faux, quelle que soit sa qualité.",
            },
            {
              requirement:
                'Vision stratégique — une roadmap alignée sur les objectifs et à impact mesurable',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Roadmap d'une plateforme à plus de 165 millions d'utilisateurs, et stratégie produit de bout en bout chez StagStrat, avec un reporting sur les résultats plutôt que sur la production.",
            },
          ],
        },
        {
          title: 'Domaine, échelle et contexte',
          rows: [
            {
              requirement: 'Expérience produit en fintech',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Head of Product d'une plateforme de trading algorithmique, où le produit engage du capital réel et où se tromper coûte cher — ce qui aiguise l'attention.",
            },
            {
              requirement: 'Un second produit ML, en finance cette fois',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "Pour être précis plutôt que flatteur : StagStrat est algorithmique, pas appris — des règles et des statistiques, pas des modèles entraînés. C'est de la vraie fintech et de vraies décisions engageant de l'argent, mais je ne l'appellerai pas du machine learning, parce que vous demandez des produits ML et que ce n'en est pas un.",
            },
            {
              requirement:
                'Domaine bancaire et finance PME (dépenses, justificatifs, trésorerie)',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "J'ai travaillé dans le trading, pas la banque, et j'ai été client PME de ce type d'outils plutôt que leur concepteur. Les spécificités réglementaires et produit de la banque pro me sont nouvelles.",
            },
            {
              requirement: 'Travailler aux côtés d’une équipe data science',
              isMatch: false,
              tierLabel: 'Transférable',
              proof:
                "Mon travail en IA a été solitaire : j'étais à la fois le data scientist et le PM. Cela me donne une empathie rare pour ce que je demanderais à votre équipe, mais collaborer avec des spécialistes meilleurs que moi est un mode que je n'ai pas encore pratiqué.",
            },
            {
              requirement:
                'Problèmes de classification et de rapprochement sur des données réelles désordonnées',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "PlayerGrade transforme des données brutes de match, de tracking et vidéo en un score fiable ; le PIM d'adidas standardisait des attributs produit incohérents pour plus de 50 marchés. Les deux ont la forme d'un catégoriseur.",
            },
            {
              requirement:
                'Pratique des outils LLM et des plateformes IA modernes',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Google AI Studio et Vertex AI, chaque semaine. Votre annonce dit vouloir des gens qui poussent l'IA au-delà de l'évidence et savent la remettre en question : j'ai assez livré pour m'être brûlé en faisant confiance à une sortie que j'aurais dû vérifier.",
            },
            {
              requirement: 'Hybride, depuis Paris, Milan, Berlin ou Barcelone',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                'Je vis près de Florence. Milan est à un court trajet en train : le format hybride fonctionne sans déménagement, sans visa et sans décalage horaire.',
            },
            {
              requirement: 'Équipe internationale, plusieurs langues',
              isMatch: true,
              tierLabel: 'Correspondance directe',
              proof:
                "Anglais C2, italien B2, allemand et slovaque. Pour être franc : cette page est proposée en cinq langues, mais le français et l'espagnol sont des traductions et non des langues que je parle.",
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Le 0 → 1',
      statusBadge: 'PlayerGrade — en usage dans un club professionnel',
      heading:
        "Vous demandez un produit d'IA parti de zéro. Voici le mien, et je l'ai construit entièrement.",
      body: "PlayerGrade est né d'un problème que personne ne m'avait demandé de résoudre. Il ingère des données de match, de tracking et vidéo, modélise la performance des joueurs et renvoie un score qu'un club professionnel utilise aujourd'hui dans de vraies décisions de transfert. J'ai choisi l'approche, entraîné et ajusté les modèles sur Google AI Studio et Vertex AI, écrit le code en Python et FastAPI, et livré. Puis est venue la partie qui compte vraiment : gagner la confiance de gens totalement indifférents à son fonctionnement. C'est exactement le problème d'un Transaction Categorizer. Un utilisateur ne veut pas comprendre votre modèle — il veut arrêter d'en vérifier les sorties. Y parvenir tenait moins à la précision qu'à être honnête là où le modèle est faible, à montrer son raisonnement quand cela compte, et à échouer visiblement plutôt qu'en silence. Je préfère apporter cette leçon à Attachment Matcher qu'une liste plus longue de frameworks.",
      credentials: [
        'PlayerGrade — 0 → 1, construit seul',
        'Google AI Studio · Vertex AI',
        'Python · FastAPI · PostgreSQL',
        'En usage réel dans un club professionnel',
      ],
      closingLine:
        "L'IA est profondément intégrée à votre façon de travailler, et vous voulez des gens qui expérimentent sans attendre la permission. PlayerGrade existe précisément parce que je n'ai pas attendu la permission.",
    },
    gap: {
      chip: "L'échelle, honnêtement",
      heading:
        "J'ai mené un produit d'IA de 0 à 1. Je n'en ai pas encore passé un à 600 000 clients.",
      body: "Votre exigence a deux moitiés et je n'en tiens proprement qu'une. Le 0 à 1 est réel et entièrement le mien. La mise à l'échelle, non : PlayerGrade sert un club, et les problèmes qui apparaissent quand un modèle affronte des centaines de milliers de clients — dérive selon les segments, cas limites arrivant plus vite qu'on ne les étiquette, coût de l'erreur multiplié par le volume — je les ai lus, pas vécus. En face, j'apporte l'échelle dans l'autre sens : une plateforme utilisée par plus de 165 millions de personnes, un moteur à plus de 500 000 interactions mensuelles, et une migration sur trois pays sans interruption. Deux autres choses que je préfère dire plutôt que vous laisser découvrir : StagStrat est algorithmique et non appris, donc c'est une crédibilité fintech mais pas un second produit ML ; et ma profondeur en ML est appliquée — j'assemble, j'entraîne et je déploie sur des plateformes gérées, je ne conçois pas d'architectures. S'il vous faut quelqu'un ayant déjà piloté de l'IA à votre échelle, ce n'est pas encore moi. S'il vous faut quelqu'un qui en a réellement livré une seul et sait comment la confiance se gagne et se perd, c'est moi.",
    },
    closing: {
      eyebrow: 'Pourquoi Qonto',
      heading: "Un domaine que l'IA redessine, et je veux tenir le crayon",
      body: "Les postes que je décline sont ceux qui consistent à entretenir ce qui marche déjà. Celui-ci dit, dans ses propres mots, que vous construisez à la frontière plutôt que vous n'entretenez — dans un domaine où le ML change réellement ce que le produit peut être, pour 600 000 entreprises dont l'administratif financier est la partie la moins intéressante de la semaine. J'ai passé une carrière à rendre évident ce qui est compliqué, dernièrement en construisant seul un produit d'IA et en découvrant que le plus dur n'est jamais le modèle. Ajoutez l'autonomie des squads, l'absence de chaînes de validation et un bureau à Milan que j'atteins en train, et la réponse honnête est que c'est le poste que j'aurais écrit pour moi — y compris la part où vous pariez sur une expérience 0 → 1 plutôt que sur une expérience à votre échelle.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Anglais C2 · Italien B2 · Allemand · Slovaque',
        'Près de Florence — hybride Milan',
      ],
      signature:
        'Lukáš Hošala — basé près de Florence, à un train du bureau de Milan.',
    },
  },

  it: {
    hero: {
      eyebrow: 'Qonto · Milano · Staff Product Manager, AI Products',
      headlineLead:
        'Categorizzare una transazione e valutare un giocatore sono lo stesso problema.',
      headlineGradient:
        'Dati grezzi, un giudizio di cui qualcuno deve fidarsi, e una sola occasione per guadagnare quella fiducia.',
      description:
        "Sono Head of Product in una fintech di trading algoritmico e ho costruito PlayerGrade — un prodotto AI che ho portato da zero all'uso reale in un club professionistico, addestrato e servito da me su Google AI Studio e Vertex AI. Prima, otto anni in adidas a gestire una piattaforma usata da oltre 165 milioni di persone. Questa pagina mette tutto questo a confronto con il ruolo di Staff AI Product Manager, con onestà — compreso il fatto che ho portato un prodotto AI da 0 a 1 ma non l'ho ancora scalato a 600.000 clienti.",
      chips: [
        'Prodotto AI 0 → 1',
        'Prodotto fintech',
        'Vertex AI · AI Studio',
        'Ufficio di Milano',
        'Risultati, non funzionalità',
      ],
      stats: [
        { value: '8+', label: 'Anni in product management' },
        { value: '165M+', label: 'Utenti sulla piattaforma che ho gestito' },
        { value: '500K+', label: 'Interazioni mensili sul motore che gestivo' },
        { value: '13+', label: 'Persone guidate, in 3 paesi' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Qonto cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'roadmap',
          title: 'Gestire la roadmap di prodotto AI end-to-end',
          body: "Decidere cosa costruire, perché e in che ordine — raccogliendo input da engineering, data e business — è il mio lavoro da nove anni. Ho gestito la roadmap di una piattaforma usata da oltre 165 milioni di persone in Runtastic e definito la strategia di prodotto end-to-end in StagStrat. La specificità dell'AI è che la roadmap deve reggere l'impatto con ciò che il modello sa davvero fare questo trimestre: una conversazione che ho avuto da entrambi i lati, come PM che chiede e come persona che poi deve costruirlo.",
        },
        {
          id: 'initiatives',
          title: 'Attachment Matcher, Transaction Categorizer, Cashflow',
          body: 'Sono tre varianti di un problema che ho già rilasciato: prendere dati reali disordinati, produrre un giudizio e renderlo abbastanza affidabile perché qualcuno agisca senza verificare. PlayerGrade acquisisce dati di partita, tracking e video e restituisce un punteggio che un club usa nelle decisioni di mercato. In adidas il PIM ne faceva la versione ingrata: standardizzare gli attributi di prodotto perché il dato fosse corretto prima di arrivare al cliente. Abbinare e categorizzare hanno la stessa forma; cambia il dominio.',
        },
        {
          id: 'fullstack',
          title: 'Lavorare con data science, engineering e business',
          body: "Tradurre fra questi tre mondi è la ragione d'essere di un PM, e lo faccio con una quota insolita di mezzo: addestro, affino e valuto i modelli di persona su Google AI Studio e Vertex AI, e scrivo codice in Python e FastAPI. Le specifiche arrivano quindi con i vincoli già ragionati, e riconosco quando una stima nasconde in realtà un problema di dati. In adidas la stessa traduzione riguardava legal, procurement, IT e oltre 50 team di mercato, nessuno dei quali rispondeva a me.",
        },
        {
          id: 'decisions',
          title: 'Assumersi la decisione e spiegarne il perché',
          body: "Una decisione che nessuno capisce viene rimessa in discussione a ogni sprint. Riporto direzione e trade-off ai dirigenti, informo gli ingegneri ogni giorno e ho sostenuto business case per spese nell'ordine del milione di euro in adidas. La versione AI è più difficile e l'ho praticata: spiegare a chi non si interessa del funzionamento perché un modello è affidabile qui e incerto lì, e cosa significa per la fiducia da dare al numero che ha davanti.",
        },
        {
          id: 'data',
          title: 'Migliorare di continuo attraverso i dati',
          body: 'Ogni progetto che ho guidato viene giudicato dopo su un numero: +70% di time-to-market, 100% di adozione su oltre 50 team, +30% dopo il riposizionamento, −55% sul tempo di caricamento, zero downtime per oltre 165 milioni di utenti. Con PlayerGrade la misurazione è continua invece che finale: osservo come si comporta il modello su dati nuovi e lo riaffino, perché un prodotto di scoring che si degrada in silenzio è peggio di nessun prodotto.',
        },
        {
          id: 'autonomy',
          title: 'Autonomia di squad, e rilasciare senza chiedere permesso',
          body: "L'annuncio dice che cercate persone che sperimentano senza aspettare il permesso. È letteralmente il motivo per cui PlayerGrade esiste: nessuno l'aveva chiesto, il problema meritava di essere risolto, l'ho costruito. Ho scelto deliberatamente la dimensione piccola dopo otto anni in una grande organizzazione, e oggi sono Head of Product in una fintech in fase iniziale, dove non c'è nessuna catena di approvazioni dietro cui nascondersi.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Quello che Qonto cerca',
          rows: [
            {
              requirement:
                'Esperienza di product management con focus LLM/AI, con prodotti ML o AI portati da 0 a 1',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "PlayerGrade: da zero all'uso reale in un club di calcio professionistico. Ho scelto l'approccio, addestrato e affinato i modelli su Google AI Studio e Vertex AI, e rilasciato. È la metà «0 a 1» del vostro requisito, fatta da solo.",
            },
            {
              requirement: 'Prodotti AI scalati in modo significativo',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "L'altra metà, e la mia lacuna onesta. PlayerGrade serve un club, non 600.000 PMI. Ho scalato prodotti non-AI fino a oltre 165 milioni di utenti e gestito una piattaforma con oltre 500.000 interazioni al mese: so cosa fa la scala a un sistema, ma non ancora a un modello in produzione.",
            },
            {
              requirement:
                'Competenza tecnica in ML — collaborare con i team tecnici e tradurre in requisiti di prodotto',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Addestro, affino e valuto modelli su una suite gestita invece di ideare architetture: esattamente l'altezza richiesta qui — abbastanza profondità per discutere seriamente di trade-off, non al punto di fare il lavoro dei data scientist al posto loro.",
            },
            {
              requirement: 'Ragionare per risultati, non per funzionalità',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Tutto ciò che ho rilasciato è stato giudicato dopo su un numero, e definisco la metrica prima di costruire invece di ricostruire una vittoria a posteriori.',
            },
            {
              requirement:
                'Gestione degli stakeholder; spiegare concetti tecnici complessi a un pubblico non tecnico',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni a riportare la direzione di prodotto ai dirigenti mentre briffo gli ingegneri ogni giorno — e la versione più difficile con PlayerGrade: convincere persone indifferenti al funzionamento che valeva la pena agire su un punteggio.',
            },
            {
              requirement:
                'Pensiero analitico; decisioni guidate dai dati e trade-off difficili',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Decido su SQL, PowerBI e Google Analytics, e in StagStrat su output in tempo reale dove la latenza è denaro: un modello troppo lento è sbagliato per quanto sia buono.',
            },
            {
              requirement:
                'Visione strategica — una roadmap allineata agli obiettivi e con impatto misurabile',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Roadmap di una piattaforma da oltre 165 milioni di utenti e strategia di prodotto end-to-end in StagStrat, riportando risultati invece che output.',
            },
          ],
        },
        {
          title: 'Dominio, scala e contesto',
          rows: [
            {
              requirement: 'Esperienza di prodotto nel fintech',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Head of Product di una piattaforma di trading algoritmico, dove il prodotto muove capitale reale e sbagliare costa in un modo che concentra l'attenzione.",
            },
            {
              requirement: 'Un secondo prodotto ML, stavolta nella finanza',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Per essere preciso invece che lusinghiero: StagStrat è algoritmico, non appreso — regole e statistica, non modelli addestrati. È fintech vero e sono decisioni vere su denaro vero, ma non lo chiamerò machine learning, perché voi chiedete prodotti ML e quello non lo è.',
            },
            {
              requirement:
                'Dominio bancario e finanza per PMI (spese, allegati, flussi di cassa)',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Ho lavorato nel trading, non nel banking, e di questi strumenti sono stato cliente PMI più che costruttore. Le specificità regolamentari e di prodotto del banking per le imprese sono nuove per me.',
            },
            {
              requirement: 'Lavorare accanto a un team di data science',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Il mio lavoro sull'AI è stato solitario: ero il data scientist oltre che il PM. Questo mi dà un'empatia insolita per ciò che chiederei al vostro team, ma collaborare con specialisti più bravi di me è una modalità che non ho ancora praticato.",
            },
            {
              requirement:
                'Problemi di classificazione e abbinamento su dati reali disordinati',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'PlayerGrade trasforma dati grezzi di partita, tracking e video in un punteggio affidabile; il PIM di adidas standardizzava attributi di prodotto incoerenti per oltre 50 mercati. Entrambi hanno la forma di un categorizzatore.',
            },
            {
              requirement: 'Pratica con strumenti LLM e piattaforme AI moderne',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Google AI Studio e Vertex AI, ogni settimana. Il vostro annuncio dice che cercate persone che spingono l'AI oltre l'ovvio e sanno metterla in discussione: ho rilasciato abbastanza da essermi bruciato fidandomi di un output che avrei dovuto verificare.",
            },
            {
              requirement: 'Ibrido, da Parigi, Milano, Berlino o Barcellona',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Vivo vicino a Firenze. Milano è un breve viaggio in treno: il modello ibrido funziona senza trasferimento, senza visto e senza fuso orario.',
            },
            {
              requirement: 'Team internazionale, più lingue',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2, italiano B2, tedesco e slovacco. Per essere chiaro: questa pagina è offerta in cinque lingue, ma francese e spagnolo sono traduzioni e non lingue che parlo.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Lo 0 → 1',
      statusBadge: 'PlayerGrade — in uso in un club professionistico',
      heading:
        'Chiedete un prodotto AI partito da zero. Ecco il mio, e l’ho costruito tutto io.',
      body: "PlayerGrade è nato da un problema che nessuno mi aveva chiesto di risolvere. Acquisisce dati di partita, tracking e video, modella la performance dei giocatori e restituisce un punteggio che oggi un club professionistico usa in decisioni di mercato reali. Ho scelto l'approccio, addestrato e affinato i modelli su Google AI Studio e Vertex AI, scritto il codice in Python e FastAPI, e rilasciato. Poi è arrivata la parte che conta davvero: guadagnare la fiducia di persone del tutto indifferenti a come funziona. È lo stesso problema di un Transaction Categorizer. Un utente non vuole capire il vostro modello: vuole smettere di controllarne l'output. Arrivarci dipendeva meno dall'accuratezza che dall'essere onesti dove il modello è debole, dal mostrare il ragionamento dove conta e dal fallire in modo visibile invece che silenzioso. Preferisco portare questa lezione ad Attachment Matcher che un elenco più lungo di framework.",
      credentials: [
        'PlayerGrade — 0 → 1, costruito da solo',
        'Google AI Studio · Vertex AI',
        'Python · FastAPI · PostgreSQL',
        'In uso reale in un club professionistico',
      ],
      closingLine:
        "L'AI è profondamente integrata nel vostro modo di lavorare e cercate persone che sperimentano senza aspettare il permesso. PlayerGrade esiste proprio perché non ho aspettato il permesso.",
    },
    gap: {
      chip: 'La scala, con onestà',
      heading:
        'Ho portato un prodotto AI da 0 a 1. Non ne ho ancora scalato uno a 600.000 clienti.',
      body: "Il vostro requisito ha due metà e io ne tengo pulita solo una. Lo 0 a 1 è reale ed è interamente mio. La scala no: PlayerGrade serve un club, e i problemi che emergono quando un modello incontra centinaia di migliaia di clienti — deriva tra segmenti, casi limite che arrivano più in fretta di quanto si riesca a etichettarli, il costo dell'errore moltiplicato per il volume — li ho letti, non vissuti. In cambio porto la scala nell'altra direzione: una piattaforma usata da oltre 165 milioni di persone, un motore con oltre 500.000 interazioni mensili e una migrazione su tre paesi senza downtime. Altre due cose che preferisco dire invece di lasciarvele scoprire: StagStrat è algoritmico e non appreso, quindi è credibilità fintech ma non un secondo prodotto ML; e la mia profondità in ML è applicata — assemblo, addestro e rilascio su piattaforme gestite, non progetto architetture. Se vi serve qualcuno che abbia già gestito AI alla vostra scala, non sono ancora io. Se vi serve qualcuno che ne abbia davvero rilasciata una da solo e sappia come si guadagna e si perde la fiducia, sono io.",
    },
    closing: {
      eyebrow: 'Perché Qonto',
      heading:
        "Un settore che l'AI sta ridisegnando, e voglio essere io a disegnarlo",
      body: "I ruoli che continuo a rifiutare sono quelli che mantengono qualcosa che già funziona. Questo dice, con parole vostre, che costruite alla frontiera invece di mantenere — in un settore dove il ML cambia davvero cosa può essere il prodotto, per 600.000 imprese la cui amministrazione finanziaria è la parte meno interessante della settimana. Ho passato una carriera a rendere ovvio ciò che è complicato, da ultimo costruendo da solo un prodotto AI e scoprendo che la parte difficile non è mai il modello. Aggiungete l'autonomia degli squad, nessuna catena di approvazioni e un ufficio a Milano che raggiungo in treno, e la risposta onesta è che questo è il ruolo che mi sarei scritto da solo — inclusa la parte in cui scommettereste su un'esperienza 0 → 1 invece che su un'esperienza alla vostra scala.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglese C2 · Italiano B2 · Tedesco · Slovacco',
        'Vicino a Firenze — ibrido su Milano',
      ],
      signature:
        "Lukáš Hošala — con base vicino a Firenze, a un treno dall'ufficio di Milano.",
    },
  },

  de: {
    hero: {
      eyebrow: 'Qonto · Mailand · Staff Product Manager, AI Products',
      headlineLead:
        'Eine Transaktion zu kategorisieren und einen Spieler zu bewerten ist dasselbe Problem.',
      headlineGradient:
        'Unsaubere Eingaben, ein Urteil, dem jemand vertrauen muss, und eine Chance, dieses Vertrauen zu gewinnen.',
      description:
        'Ich bin Head of Product bei einer Fintech für algorithmischen Handel und habe PlayerGrade gebaut — ein KI-Produkt, das ich von null bis in den Live-Einsatz bei einem Profiverein gebracht habe, von mir trainiert und auf Google AI Studio und Vertex AI ausgeliefert. Davor acht Jahre bei adidas mit Verantwortung für eine Plattform mit über 165 Millionen Nutzern. Diese Seite gleicht das ehrlich mit der Rolle als Staff AI Product Manager ab — einschließlich der Tatsache, dass ich ein KI-Produkt von 0 auf 1 gebracht, aber noch keines auf 600.000 Kunden skaliert habe.',
      chips: [
        'KI-Produkt 0 → 1',
        'Fintech-Produkt',
        'Vertex AI · AI Studio',
        'Büro Mailand',
        'Ergebnisse statt Features',
      ],
      stats: [
        { value: '8+', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer auf der Plattform, die ich verantwortet habe',
        },
        {
          value: '500K+',
          label: 'Monatliche Interaktionen auf der Engine, die ich führte',
        },
        { value: '13+', label: 'Geführte Personen, in 3 Ländern' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was Qonto sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'roadmap',
          title: 'Die KI-Produkt-Roadmap end-to-end verantworten',
          body: 'Zu entscheiden, was gebaut wird, warum und in welcher Reihenfolge — aus Input von Engineering, Data und Business — ist seit neun Jahren mein Beruf. Bei Runtastic habe ich die Roadmap einer Plattform mit über 165 Millionen Nutzern verantwortet und bei StagStrat die Produktstrategie vollständig gesetzt. Das KI-Spezifische ist, dass eine Roadmap dem standhalten muss, was das Modell in diesem Quartal tatsächlich kann — ein Gespräch, das ich von beiden Seiten geführt habe: als PM, der fragt, und als der, der es dann bauen musste.',
        },
        {
          id: 'initiatives',
          title: 'Attachment Matcher, Transaction Categorizer, Cashflow',
          body: 'Das sind drei Varianten eines Problems, das ich bereits ausgeliefert habe: unsaubere reale Daten nehmen, ein Urteil erzeugen und es so vertrauenswürdig machen, dass jemand danach handelt, ohne nachzuprüfen. PlayerGrade liest Spiel-, Tracking- und Videodaten ein und gibt einen Wert zurück, den ein Verein für Transferentscheidungen nutzt. Bei adidas machte das PIM die unglamouröse Variante: Produktattribute standardisieren, damit die Daten stimmen, bevor sie beim Kunden ankommen. Zuordnen und Kategorisieren haben dieselbe Form; nur die Domäne wechselt.',
        },
        {
          id: 'fullstack',
          title: 'Mit Data Science, Engineering und Business arbeiten',
          body: 'Zwischen diesen dreien zu übersetzen ist der Zweck eines PM, und ich tue es mit einem ungewöhnlich großen Anteil der Mitte: Ich trainiere, tune und bewerte Modelle selbst auf Google AI Studio und Vertex AI und schreibe produktiven Code in Python und FastAPI. Anforderungen kommen deshalb mit bereits durchdachten Beschränkungen an, und ich höre, wenn eine Schätzung in Wahrheit ein Datenproblem ist. Bei adidas lief dieselbe Übersetzung über Legal, Procurement, IT und mehr als 50 Marktteams, von denen mir keines unterstellt war.',
        },
        {
          id: 'decisions',
          title: 'Die Entscheidung verantworten und begründen',
          body: 'Eine Entscheidung, die niemand versteht, wird in jedem Sprint neu verhandelt. Ich berichte Richtung und Trade-offs an die Führungsebene, briefe Ingenieure täglich und habe bei adidas Business Cases für Ausgaben im Millionenbereich vertreten. Die KI-Variante ist schwerer, und ich musste sie führen: Menschen, denen die Funktionsweise gleichgültig ist, zu erklären, warum ein Modell hier sicher und dort unzuverlässig ist — und was das für das Vertrauen in die Zahl vor ihnen bedeutet.',
        },
        {
          id: 'data',
          title: 'Kontinuierlich über Daten besser werden',
          body: 'Jedes Projekt, das ich geführt habe, wird hinterher an einer Zahl gemessen: +70% Time-to-Market, 100% Nutzung über mehr als 50 Teams, +30% nach der Neupositionierung, −55% Ladezeit, null Ausfallzeit für über 165 Mio. Nutzer. Bei PlayerGrade ist die Messung laufend statt final — ich beobachte, wie sich das Modell auf neuen Daten verhält, und justiere nach, denn ein Scoring-Produkt, das still degradiert, ist schlimmer als gar keines.',
        },
        {
          id: 'autonomy',
          title: 'Squad-Autonomie und liefern ohne Erlaubnis',
          body: 'In der Ausschreibung steht, Sie wollen Menschen, die experimentieren, ohne auf Erlaubnis zu warten. Genau so ist PlayerGrade entstanden: Niemand hat danach gefragt, das Problem war es wert, also habe ich es gebaut. Nach acht Jahren in einer Großorganisation habe ich bewusst das kleine Ende gewählt und bin heute Head of Product in einer frühphasigen Fintech, in der es keine Freigabekette gibt, hinter der man sich verstecken könnte.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Was Qonto sucht',
          rows: [
            {
              requirement:
                'Produktmanagement-Erfahrung mit LLM/KI-Fokus, mit konkreten ML- oder KI-Produkten von 0 auf 1',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'PlayerGrade: von null bis in den Live-Einsatz bei einem Profi-Fußballverein. Ich habe den Ansatz gewählt, die Modelle auf Google AI Studio und Vertex AI trainiert und getunt und ausgeliefert. Das ist die 0-auf-1-Hälfte Ihrer Anforderung, allein gemacht.',
            },
            {
              requirement: 'KI-Produkte deutlich skaliert',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Die andere Hälfte, und meine ehrliche Lücke. PlayerGrade bedient einen Verein, nicht 600.000 KMU. Ich habe Nicht-KI-Produkte auf über 165 Mio. Nutzer skaliert und eine Plattform mit über 500.000 monatlichen Interaktionen verantwortet — ich weiß, was Skalierung mit einem System macht, aber noch nicht mit einem Modell in Produktion.',
            },
            {
              requirement:
                'Technische Sicherheit in ML — mit technischen Teams zusammenarbeiten und in Produktanforderungen übersetzen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich trainiere, tune und bewerte Modelle auf einer verwalteten Suite, statt Architekturen zu entwerfen — genau die hier verlangte Flughöhe: genug Tiefe für ein ernsthaftes Gespräch über Trade-offs, nicht so viel, dass ich den Data Scientists ihre Arbeit abnähme.',
            },
            {
              requirement: 'In Ergebnissen denken, nicht in Features',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Alles, was ich ausgeliefert habe, wurde hinterher an einer Zahl gemessen, und ich setze die Kennzahl vor dem Bauen, statt im Nachhinein einen Erfolg zu konstruieren.',
            },
            {
              requirement:
                'Starkes Stakeholder-Management; komplexe technische Konzepte für nicht-technische Zielgruppen erklären',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre Berichten an die Führungsebene bei täglichem Briefing der Ingenieure — und die schwerere Variante mit PlayerGrade: Menschen ohne Interesse an der Funktionsweise davon zu überzeugen, dass ein Wert Handeln wert ist.',
            },
            {
              requirement:
                'Analytisches Denken; datengetriebene Entscheidungen und harte Trade-offs',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich entscheide anhand von SQL, PowerBI und Google Analytics, und bei StagStrat anhand von Live-Output, wo Latenz Geld ist: Ein zu langsames Modell ist falsch, wie gut es auch sei.',
            },
            {
              requirement:
                'Strategische Vision — eine Roadmap im Einklang mit den Unternehmenszielen und mit messbarer Wirkung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Roadmap einer Plattform mit über 165 Mio. Nutzern und Produktstrategie end-to-end bei StagStrat, mit Berichterstattung über Ergebnisse statt über Output.',
            },
          ],
        },
        {
          title: 'Domäne, Skalierung & Kontext',
          rows: [
            {
              requirement: 'Produkterfahrung im Fintech-Bereich',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Head of Product einer Plattform für algorithmischen Handel, bei der das Produkt echtes Kapital bewegt und Fehler auf eine Weise teuer sind, die den Blick schärft.',
            },
            {
              requirement: 'Ein zweites ML-Produkt, diesmal im Finanzbereich',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Um präzise statt schmeichelhaft zu sein: StagStrat ist algorithmisch, nicht gelernt — Regeln und Statistik, keine trainierten Modelle. Es ist echtes Fintech und es sind echte Entscheidungen über echtes Geld, aber ich nenne es nicht Machine Learning, weil Sie ML-Produkte suchen und es keines ist.',
            },
            {
              requirement:
                'Banking- und KMU-Finanzdomäne (Ausgaben, Belege, Cashflow)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich habe im Trading gearbeitet, nicht im Banking, und war KMU-Kunde genau solcher Werkzeuge statt ihr Entwickler. Die regulatorischen und produktseitigen Besonderheiten des Geschäftsbankings sind neu für mich.',
            },
            {
              requirement: 'Zusammenarbeit mit einem Data-Science-Team',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine KI-Arbeit war alleinarbeit — ich war Data Scientist und PM zugleich. Das gibt mir ein ungewöhnliches Gespür dafür, was ich Ihrem Team abverlangen würde, aber mit Spezialisten zu arbeiten, die es besser können als ich, ist ein Modus, den ich noch nicht geübt habe.',
            },
            {
              requirement:
                'Klassifikations- und Zuordnungsprobleme auf unsauberen realen Daten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'PlayerGrade macht aus rohen Spiel-, Tracking- und Videodaten einen belastbaren Wert; das adidas-PIM standardisierte uneinheitliche Produktattribute für mehr als 50 Märkte. Beides hat die Form eines Kategorisierers.',
            },
            {
              requirement: 'Praxis mit LLM-Tooling und modernen KI-Plattformen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Google AI Studio und Vertex AI, wöchentlich. Ihre Ausschreibung sagt, Sie wollen Menschen, die KI über das Offensichtliche hinaus treiben und wissen, wann man sie hinterfragt — ich habe genug ausgeliefert, um mir daran die Finger verbrannt zu haben, Output zu vertrauen, den ich hätte prüfen sollen.',
            },
            {
              requirement: 'Hybrid, aus Paris, Mailand, Berlin oder Barcelona',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich lebe in der Nähe von Florenz. Mailand ist eine kurze Zugfahrt: Hybrid funktioniert ohne Umzug, ohne Visum und ohne Zeitverschiebung.',
            },
            {
              requirement: 'Internationales Team, mehrere Sprachen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2, Italienisch B2, Deutsch und Slowakisch. Ganz offen: Diese Seite wird in fünf Sprachen angeboten, aber Französisch und Spanisch sind Übersetzungen und keine Sprachen, die ich spreche.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Die 0 → 1',
      statusBadge: 'PlayerGrade — im Einsatz bei einem Profiverein',
      heading:
        'Sie suchen ein KI-Produkt, das bei null begann. Hier ist meines, und ich habe alles davon gebaut.',
      body: 'PlayerGrade begann als Problem, dessen Lösung niemand von mir verlangt hatte. Es liest Spiel-, Tracking- und Videodaten ein, modelliert Spielerleistung und gibt einen Wert zurück, den ein Profiverein heute in echten Transferentscheidungen nutzt. Ich habe den Ansatz gewählt, die Modelle auf Google AI Studio und Vertex AI trainiert und getunt, den Code in Python und FastAPI geschrieben und ausgeliefert. Dann kam der Teil, auf den es wirklich ankam: das Vertrauen von Menschen zu gewinnen, denen völlig gleichgültig ist, wie es funktioniert. Das ist dasselbe Problem wie bei einem Transaction Categorizer. Ein Nutzer will Ihr Modell nicht verstehen — er will aufhören, dessen Output zu prüfen. Dorthin zu kommen hing weniger an Genauigkeit als daran, ehrlich zu sein, wo das Modell schwach ist, sein Urteil dort zu zeigen, wo es zählt, und sichtbar statt still zu scheitern. Diese Lektion bringe ich lieber zu Attachment Matcher als eine längere Liste von Frameworks.',
      credentials: [
        'PlayerGrade — 0 → 1, allein gebaut',
        'Google AI Studio · Vertex AI',
        'Python · FastAPI · PostgreSQL',
        'Im Live-Einsatz bei einem Profiverein',
      ],
      closingLine:
        'KI ist tief in Ihrer Arbeitsweise verankert, und Sie wollen Menschen, die experimentieren, ohne auf Erlaubnis zu warten. PlayerGrade existiert genau deshalb, weil ich nicht auf Erlaubnis gewartet habe.',
    },
    gap: {
      chip: 'Skalierung, ehrlich gesagt',
      heading:
        'Ich habe ein KI-Produkt von 0 auf 1 gebracht. Auf 600.000 Kunden skaliert habe ich keines.',
      body: 'Ihre Anforderung hat zwei Hälften, und nur eine davon halte ich sauber. Die 0 auf 1 ist real und vollständig meine. Die Skalierung nicht: PlayerGrade bedient einen Verein, und die Probleme, die auftreten, wenn ein Modell auf Hunderttausende Kunden trifft — Drift zwischen Segmenten, Randfälle, die schneller eintreffen, als man sie labeln kann, die mit dem Volumen multiplizierten Kosten eines Fehlers — habe ich gelesen, nicht erlebt. Dagegen setze ich Skalierung in der anderen Richtung: eine Plattform mit über 165 Millionen Nutzern, eine Engine mit über 500.000 monatlichen Interaktionen und eine Migration über drei Länder ohne Ausfallzeit. Zwei weitere Dinge sage ich lieber selbst, als sie Sie entdecken zu lassen: StagStrat ist algorithmisch und nicht gelernt, also Fintech-Glaubwürdigkeit, aber kein zweites ML-Produkt; und meine ML-Tiefe ist angewandt — ich setze zusammen, trainiere und liefere auf verwalteten Plattformen aus, ich entwerfe keine Architekturen. Wenn Sie jemanden brauchen, der KI bereits in Ihrer Größenordnung verantwortet hat, bin ich das noch nicht. Wenn Sie jemanden brauchen, der tatsächlich allein eine ausgeliefert hat und genau weiß, wie Vertrauen gewonnen und verloren wird, dann schon.',
    },
    closing: {
      eyebrow: 'Warum Qonto',
      heading: 'Eine Branche, die KI neu formt — und ich will mitformen',
      body: 'Die Rollen, die ich immer wieder ablehne, sind die, in denen etwas gepflegt wird, das bereits funktioniert. Diese sagt in Ihren eigenen Worten, dass Sie an der Grenze bauen statt zu pflegen — in einer Branche, in der ML wirklich verändert, was das Produkt sein kann, für 600.000 Unternehmen, deren Finanzverwaltung der uninteressanteste Teil ihrer Woche ist. Ich habe eine Karriere damit verbracht, Kompliziertes selbstverständlich wirken zu lassen, zuletzt indem ich allein ein KI-Produkt gebaut und dabei gelernt habe, dass der schwierige Teil nie das Modell ist. Dazu Squad-Autonomie, keine Freigabeketten und ein Büro in Mailand, das ich mit dem Zug erreiche — die ehrliche Antwort ist, dass dies die Rolle ist, die ich mir selbst geschrieben hätte, einschließlich des Teils, in dem Sie auf 0-auf-1-Erfahrung setzen statt auf Erfahrung in Ihrer Größenordnung.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Italienisch B2 · Deutsch · Slowakisch',
        'Bei Florenz — hybrid Mailand',
      ],
      signature:
        'Lukáš Hošala — wohnhaft bei Florenz, eine Zugfahrt vom Büro in Mailand entfernt.',
    },
  },

  es: {
    hero: {
      eyebrow: 'Qonto · Milán · Staff Product Manager, AI Products',
      headlineLead:
        'Categorizar una transacción y puntuar a un jugador son el mismo problema.',
      headlineGradient:
        'Datos desordenados, un juicio en el que alguien tiene que confiar, y una sola oportunidad de ganarse esa confianza.',
      description:
        'Soy Head of Product en una fintech de trading algorítmico y construí PlayerGrade — un producto de IA que llevé de cero al uso real en un club profesional, entrenado y desplegado por mí en Google AI Studio y Vertex AI. Antes, ocho años en adidas dirigiendo una plataforma usada por más de 165 millones de personas. Esta página compara todo eso con el puesto de Staff AI Product Manager, con honestidad — incluido el hecho de que he llevado un producto de IA de 0 a 1 pero aún no he escalado ninguno a 600.000 clientes.',
      chips: [
        'Producto de IA 0 → 1',
        'Producto fintech',
        'Vertex AI · AI Studio',
        'Oficina de Milán',
        'Resultados, no funcionalidades',
      ],
      stats: [
        { value: '8+', label: 'Años en product management' },
        { value: '165M+', label: 'Usuarios en la plataforma que dirigí' },
        {
          value: '500K+',
          label: 'Interacciones mensuales en el motor que gestioné',
        },
        { value: '13+', label: 'Personas dirigidas, en 3 países' },
      ],
    },
    roleMapSection: {
      eyebrow: 'El puesto, punto por punto',
      heading: 'Lo que busca Qonto — y dónde ya lo he hecho',
      items: [
        {
          id: 'roadmap',
          title: 'Ser responsable de la hoja de ruta de producto de IA',
          body: 'Decidir qué se construye, por qué y en qué orden — a partir de las aportaciones de ingeniería, datos y negocio — es mi trabajo desde hace nueve años. Dirigí la hoja de ruta de una plataforma usada por más de 165 millones de personas en Runtastic y definí la estrategia de producto de principio a fin en StagStrat. Lo específico de la IA es que la hoja de ruta debe sobrevivir al contacto con lo que el modelo realmente puede hacer este trimestre: una conversación que he tenido por ambos lados, como PM que pide y como quien luego tiene que construirlo.',
        },
        {
          id: 'initiatives',
          title: 'Attachment Matcher, Transaction Categorizer, Cashflow',
          body: 'Son tres variantes de un problema que ya he entregado: tomar datos reales desordenados, producir un juicio y hacerlo lo bastante fiable como para que alguien actúe sin comprobarlo. PlayerGrade ingiere datos de partido, tracking y vídeo y devuelve una puntuación que un club usa en decisiones de fichajes. En adidas, el PIM hacía la versión ingrata: estandarizar atributos de producto para que el dato fuera correcto antes de llegar al cliente. Emparejar y categorizar tienen la misma forma; lo que cambia es el sector.',
        },
        {
          id: 'fullstack',
          title: 'Trabajar con data science, ingeniería y negocio',
          body: 'Traducir entre esos tres mundos es la razón de ser de un PM, y lo hago con una parte inusual del medio: entreno, ajusto y evalúo modelos yo mismo en Google AI Studio y Vertex AI, y escribo código en Python y FastAPI. Así, los requisitos llegan con las restricciones ya pensadas, y detecto cuándo una estimación esconde en realidad un problema de datos. En adidas la misma traducción abarcaba legal, compras, IT y más de 50 equipos de mercado, ninguno de los cuales dependía de mí.',
        },
        {
          id: 'decisions',
          title: 'Asumir la decisión y explicar el razonamiento',
          body: 'Una decisión que nadie entiende se vuelve a discutir en cada sprint. Reporto dirección y compromisos a la dirección, informo a ingeniería a diario y he defendido business cases para gasto del orden del millón de euros en adidas. La versión de IA es más difícil y me ha tocado hacerla: explicar a personas a las que no les importa cómo funciona un modelo por qué es fiable aquí y dudoso allí, y qué significa eso para la confianza en la cifra que tienen delante.',
        },
        {
          id: 'data',
          title: 'Mejorar continuamente a través de los datos',
          body: 'Cada proyecto que he dirigido se juzga después con una cifra: +70% de time-to-market, 100% de adopción en más de 50 equipos, +30% tras el reposicionamiento, −55% en tiempo de carga, cero caídas para más de 165 millones de usuarios. Con PlayerGrade la medición es continua en lugar de final: observo cómo se comporta el modelo con datos nuevos y lo reajusto, porque un producto de scoring que se degrada en silencio es peor que ningún producto.',
        },
        {
          id: 'autonomy',
          title: 'Autonomía de squad, y entregar sin pedir permiso',
          body: 'La oferta dice que queréis gente que experimente sin esperar permiso. Es literalmente el origen de PlayerGrade: nadie lo pidió, el problema merecía resolverse, lo construí. Elegí deliberadamente el extremo de equipo pequeño tras ocho años en una gran organización, y hoy soy Head of Product en una fintech en fase temprana, donde no hay cadena de aprobaciones tras la que esconderse.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Correspondencia con el perfil',
      heading: 'Dónde encajo, y dónde no',
      panels: [
        {
          title: 'Lo que busca Qonto',
          rows: [
            {
              requirement:
                'Experiencia de producto con enfoque LLM/IA, con productos de ML o IA llevados de 0 a 1',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'PlayerGrade: de cero al uso real en un club de fútbol profesional. Elegí el enfoque, entrené y ajusté los modelos en Google AI Studio y Vertex AI, y lo entregué. Es la mitad «0 a 1» de vuestro requisito, hecha en solitario.',
            },
            {
              requirement: 'Productos de IA escalados de forma significativa',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'La otra mitad, y mi carencia honesta. PlayerGrade sirve a un club, no a 600.000 pymes. He escalado productos que no son de IA hasta más de 165 millones de usuarios y gestionado una plataforma con más de 500.000 interacciones mensuales: sé lo que la escala le hace a un sistema, pero aún no a un modelo en producción.',
            },
            {
              requirement:
                'Soltura técnica en ML — colaborar con equipos técnicos y traducir a requisitos de producto',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Entreno, ajusto y evalúo modelos en una suite gestionada en lugar de diseñar arquitecturas: exactamente la altura que se pide aquí — profundidad suficiente para discutir compromisos en serio, sin llegar a hacer el trabajo de los data scientists.',
            },
            {
              requirement: 'Pensar en resultados, no en funcionalidades',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Todo lo que he entregado se juzgó después con una cifra, y defino la métrica antes de construir en lugar de fabricar un éxito a posteriori.',
            },
            {
              requirement:
                'Gestión de stakeholders; explicar conceptos técnicos complejos a públicos no técnicos',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Nueve años reportando dirección a la cúpula mientras informo a ingeniería a diario — y la versión más difícil con PlayerGrade: convencer a gente indiferente a su funcionamiento de que merecía actuar sobre una puntuación.',
            },
            {
              requirement:
                'Pensamiento analítico; decisiones basadas en datos y compromisos difíciles',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Decido con SQL, PowerBI y Google Analytics, y en StagStrat con salidas en vivo donde la latencia es dinero: un modelo demasiado lento es erróneo por bueno que sea.',
            },
            {
              requirement:
                'Visión estratégica — una hoja de ruta alineada con los objetivos y con impacto medible',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Hoja de ruta de una plataforma de más de 165 millones de usuarios y estrategia de producto de principio a fin en StagStrat, reportando resultados en lugar de producción.',
            },
          ],
        },
        {
          title: 'Sector, escala y contexto',
          rows: [
            {
              requirement: 'Experiencia de producto en fintech',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Head of Product de una plataforma de trading algorítmico, donde el producto mueve capital real y equivocarse sale caro de una forma que concentra la atención.',
            },
            {
              requirement: 'Un segundo producto de ML, esta vez en finanzas',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Por ser preciso en lugar de halagador: StagStrat es algorítmico, no aprendido — reglas y estadística, no modelos entrenados. Es fintech de verdad y son decisiones reales sobre dinero real, pero no lo llamaré machine learning, porque pedís productos de ML y no lo es.',
            },
            {
              requirement:
                'Sector bancario y finanzas para pymes (gastos, justificantes, tesorería)',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'He trabajado en trading, no en banca, y he sido cliente pyme de este tipo de herramientas más que constructor. Las particularidades regulatorias y de producto de la banca de empresas son nuevas para mí.',
            },
            {
              requirement: 'Trabajar junto a un equipo de data science',
              isMatch: false,
              tierLabel: 'Transferible',
              proof:
                'Mi trabajo en IA ha sido en solitario: yo era el data scientist además del PM. Eso me da una empatía poco común con lo que pediría a vuestro equipo, pero colaborar con especialistas mejores que yo es un modo que aún no he practicado.',
            },
            {
              requirement:
                'Problemas de clasificación y emparejamiento sobre datos reales desordenados',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'PlayerGrade convierte datos brutos de partido, tracking y vídeo en una puntuación fiable; el PIM de adidas estandarizaba atributos de producto inconsistentes para más de 50 mercados. Ambos tienen la forma de un categorizador.',
            },
            {
              requirement:
                'Práctica con herramientas LLM y plataformas de IA modernas',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Google AI Studio y Vertex AI, cada semana. Vuestra oferta dice que buscáis gente que lleve la IA más allá de lo obvio y sepa cuestionarla: he entregado lo suficiente como para haberme quemado confiando en una salida que debí comprobar.',
            },
            {
              requirement: 'Híbrido, desde París, Milán, Berlín o Barcelona',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Vivo cerca de Florencia. Milán está a un viaje corto en tren: el modelo híbrido funciona sin traslado, sin visado y sin diferencia horaria.',
            },
            {
              requirement: 'Equipo internacional, varios idiomas',
              isMatch: true,
              tierLabel: 'Correspondencia directa',
              proof:
                'Inglés C2, italiano B2, alemán y eslovaco. Para ser claro: esta página se ofrece en cinco idiomas, pero el francés y el español son traducciones y no idiomas que yo hable.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'El 0 → 1',
      statusBadge: 'PlayerGrade — en uso en un club profesional',
      heading:
        'Pedís un producto de IA que partiera de cero. Aquí está el mío, y lo construí entero.',
      body: 'PlayerGrade nació de un problema que nadie me había pedido resolver. Ingiere datos de partido, tracking y vídeo, modela el rendimiento de los jugadores y devuelve una puntuación que hoy un club profesional usa en decisiones reales de fichajes. Elegí el enfoque, entrené y ajusté los modelos en Google AI Studio y Vertex AI, escribí el código en Python y FastAPI, y lo entregué. Después llegó la parte que de verdad importaba: ganarme la confianza de personas a las que no les interesa en absoluto cómo funciona. Ese es el mismo problema que un Transaction Categorizer. Un usuario no quiere entender vuestro modelo: quiere dejar de comprobar su salida. Llegar ahí dependía menos de la precisión que de ser honesto donde el modelo es débil, mostrar su razonamiento donde cuenta y fallar de forma visible en lugar de silenciosa. Prefiero llevar esa lección a Attachment Matcher que una lista más larga de frameworks.',
      credentials: [
        'PlayerGrade — 0 → 1, construido en solitario',
        'Google AI Studio · Vertex AI',
        'Python · FastAPI · PostgreSQL',
        'En uso real en un club profesional',
      ],
      closingLine:
        'La IA está profundamente integrada en vuestra forma de trabajar y queréis gente que experimente sin esperar permiso. PlayerGrade existe precisamente porque no esperé permiso.',
    },
    gap: {
      chip: 'La escala, con honestidad',
      heading:
        'He llevado un producto de IA de 0 a 1. No he escalado ninguno a 600.000 clientes.',
      body: 'Vuestro requisito tiene dos mitades y solo sostengo una con claridad. El 0 a 1 es real y enteramente mío. La escala no: PlayerGrade sirve a un club, y los problemas que aparecen cuando un modelo se enfrenta a cientos de miles de clientes — deriva entre segmentos, casos límite que llegan más rápido de lo que se pueden etiquetar, el coste del error multiplicado por el volumen — los he leído, no vivido. A cambio aporto escala en la otra dirección: una plataforma usada por más de 165 millones de personas, un motor con más de 500.000 interacciones mensuales y una migración en tres países sin caídas. Otras dos cosas que prefiero decir a que las descubráis: StagStrat es algorítmico y no aprendido, así que es credibilidad fintech pero no un segundo producto de ML; y mi profundidad en ML es aplicada — ensamblo, entreno y despliego en plataformas gestionadas, no diseño arquitecturas. Si necesitáis a alguien que ya haya dirigido IA a vuestra escala, todavía no soy yo. Si necesitáis a alguien que haya entregado una de verdad en solitario y sepa exactamente cómo se gana y se pierde la confianza, sí lo soy.',
    },
    closing: {
      eyebrow: 'Por qué Qonto',
      heading:
        'Un sector que la IA está rediseñando, y quiero estar rediseñándolo',
      body: 'Los puestos que sigo rechazando son los que mantienen algo que ya funciona. Este dice, con vuestras propias palabras, que construís en la frontera en lugar de mantener — en un sector donde el ML cambia de verdad lo que el producto puede ser, para 600.000 empresas cuya administración financiera es la parte menos interesante de su semana. He pasado una carrera haciendo que lo complicado parezca obvio, últimamente construyendo en solitario un producto de IA y descubriendo que la parte difícil nunca es el modelo. Añadid autonomía de squad, ninguna cadena de aprobaciones y una oficina en Milán a la que llego en tren, y la respuesta honesta es que este es el puesto que me habría escrito yo mismo — incluida la parte en la que apostaríais por experiencia 0 → 1 en lugar de experiencia a vuestra escala.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglés C2 · Italiano B2 · Alemán · Eslovaco',
        'Cerca de Florencia — híbrido en Milán',
      ],
      signature:
        'Lukáš Hošala — con base cerca de Florencia, a un tren de la oficina de Milán.',
    },
  },
}
