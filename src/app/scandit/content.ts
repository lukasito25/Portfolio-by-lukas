export type Locale = 'en' | 'de' | 'it'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'modeling'
    | 'capture'
    | 'telemetry'
    | 'tasking'
    | 'crossfunc'
    | 'hybrid'
    | 'launch'
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

export interface ScanditContent {
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
  /** Standout credential — here: the adidas product-data platform. */
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

export const scanditContent: Record<Locale, ScanditContent> = {
  en: {
    hero: {
      eyebrow: 'Scandit · Zurich · Senior Product Manager, ShelfView Capture',
      headlineLead:
        'A digital twin of the store is only as good as the data that goes into it.',
      headlineGradient:
        'I spent eight years on that problem, one step upstream.',
      description:
        "At adidas I owned the product-data platform: collecting product information from source systems, standardising it into catalogs and attributes the business could rely on, and keeping it current as products and markets changed — for 50+ market teams feeding retail channels. That is store modelling's close cousin, and the failure mode is identical: when the model drifts from the shelf, everything built on top of it quietly becomes wrong. Eight of those years were inside a mobile-first product organisation at 165M+ user scale. Today I run product at a fintech and build my own instrumentation. This page maps that against ShelfView Capture, including the parts of your technology stack I have not worked in.",
      chips: [
        'Retail product data',
        'Catalogs, attributes & data quality',
        'Telemetry & experiments',
        'Mobile-first at 165M+ scale',
        'Relocating to Zurich',
      ],
      stats: [
        { value: '9', label: 'Years in product management' },
        {
          value: '165M+',
          label: 'Users at the mobile-first company I worked in',
        },
        { value: '50+', label: 'Market teams on the catalog standard I built' },
        { value: '+70%', label: 'Speed to market from that platform' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What ShelfView Capture asks for — and where I've done it",
      items: [
        {
          id: 'modeling',
          title: 'Store onboarding and modelling — and keeping it current',
          body: 'This is the closest precedent I have, and it is close. The adidas PIM existed because product data lived in fifty different spreadsheets with fifty different attribute names, and anything built downstream inherited that mess. I built the layer that collected it, standardised it into catalogs and attributes, and delivered it to the channels that needed it — then kept it accurate as ranges, markets and seasons changed. Getting a store ready is the same shape of work: a model that is correct on day one and quietly wrong by week six is the failure everyone underestimates, because nothing breaks loudly.',
        },
        {
          id: 'telemetry',
          title: 'Capture quality, product metrics and telemetry',
          body: 'Defining the metric before building is the only way the analysis afterwards means anything, and I hold that standard on my own work. The analytics behind this site are mine from the database up — including the moment the numbers looked healthy and the raw rows showed roughly a third of recorded traffic was automated. I classified it, backfilled the history and added the filter. Quality, coverage and cost is a three-way trade-off you can only manage if the instrumentation is trustworthy, and my instinct is to distrust a number until I have seen what it is made of.',
        },
        {
          id: 'capture',
          title: 'A capture experience that is first-time-right',
          body: 'First-time-right is a reliability problem wearing a UX costume: the cost of a failed capture is not the retry, it is the store associate who stops trusting the tool and works around it. I have spent nine years on adoption of exactly that kind — the platform that reached 100% uptake because the workflow fitted how people already worked, and the €1M platform that recovered 30 points once it was rebuilt around their real tasks. I also led the front-end rebuild that cut page-load time 55%, because latency in a working tool is a trust problem, not a comfort one.',
        },
        {
          id: 'tasking',
          title: 'Tasking and scheduling — which stores, how often, by whom',
          body: 'This is prioritisation with an operational edge: coverage against cost, with real people and their time on the other side of the decision. I have run that trade-off across 50+ market teams whose capacity, maturity and appetite differed enormously, and built the scheduling logic for my own systems — including the campaign engine behind this site, where each campaign carries its own window, an automatic expiry and an override, because anything scheduled by hand eventually runs long and nobody notices.',
        },
        {
          id: 'crossfunc',
          title: 'Design, mobile engineering, CV — and the field',
          body: 'The customer and field half I have done at length: 50+ market teams and 1,000+ internal users, none of whom reported to me, plus legal, procurement and IT on every rollout. The technical half I meet by building — I write and ship code, specify and consume APIs, and my own products run on managed ML platforms. That earns a working conversation with engineers; with a computer-vision team I would be starting from their expertise, and I would rather say so than imply otherwise.',
        },
        {
          id: 'hybrid',
          title: 'Hybrid capture — fixed cameras, robots, emerging technology',
          body: 'Evaluating an unfamiliar technology on its merits, and being willing to conclude that buying beats building, is a decision I have taken with money attached. At adidas I sat on both sides: a €1M licensed platform I owned and renewed, and an in-house engine we built instead of licensing more. The judgement transfers even though the hardware does not — what to pilot, what to measure before scaling, and when an impressive demo is not yet a product.',
        },
        {
          id: 'launch',
          title: 'Launches, pilots and being the point of contact',
          body: 'I have run launches where failure was visible to everyone: a staged migration across three countries with zero downtime for 165M+ users, and a platform rollout to 50+ market teams where training and documentation shipped with the product rather than after it. Being the named contact through a pilot — including the calls where something did not work — is the part that decides whether the second rollout is easier or harder than the first.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'What Scandit is looking for',
          rows: [
            {
              requirement:
                '6+ years of product management experience in deep tech or mobile SaaS, or equivalent product leadership in a startup',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product. Eight of them inside a mobile-first product organisation at 165M+ user scale, and the startup clause too: I am currently Head of Product at an early-stage fintech.',
            },
            {
              requirement: 'Experience with mobile apps',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years inside a mobile-first company — Runtastic is a mobile business, and I worked to its release cadence, its analytics and its constraints, on a product used by 165M+ people across mobile and web. To be exact about ownership: the surface I owned there was the web platform, alongside the mobile apps rather than inside them.',
            },
            {
              requirement:
                'Strong problem-solving and analytical skills; comfortable working hands-on with data and telemetry',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'SQL, PowerBI and Google Analytics weekly, and I build my own instrumentation — this site’s analytics pipeline is mine from schema to dashboard, including the bot classification I added after finding a third of its traffic was automated.',
            },
            {
              requirement: 'Excellent written and spoken English',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'English C2 and my working language for nine years across three countries. This page is also offered in German and Italian.',
            },
            {
              requirement:
                'Able to visit customers in Europe and North America on occasion',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Routine for me. My last role spanned three countries and rollouts reaching Colombia, the Netherlands and Germany.',
            },
            {
              requirement: 'Degree in Engineering or a related field',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Not on paper. My degrees are a BSc in Sport Management and a CMI Level 7 Diploma in Strategic Management — MBA-level, not engineering. What stands in for it is practice rather than credential: I ship code, I specify and consume APIs, and I build and deploy ML-backed products myself.',
            },
            {
              requirement: 'Experience with AR use-cases',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'None shipped. The nearest thing I have is guided task flows where the interface has to tell someone what to do next while they are doing something else — the same design problem, without the camera.',
            },
            {
              requirement: 'Experience with on-device ML',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My ML work is cloud-side: I train, tune and evaluate models on Google AI Studio and Vertex AI for PlayerGrade. On-device constraints — latency, battery, model size, degrading gracefully on a five-year-old handset — are real engineering trade-offs I have read about rather than lived.',
            },
            {
              requirement: 'Eligible to work in Switzerland',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Not today, and worth being precise rather than vague: I am an EU (Slovak) national living in Italy and I do not currently hold a Swiss permit. Under the EU–Switzerland free movement agreement this is the standard permit route rather than employer sponsorship, but I would not describe myself as already eligible.',
            },
            {
              requirement:
                'Living within commutable distance of the Zurich office',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Not yet — I would relocate for this role. Zurich has been on my list for some time and this is a move I am ready to make, not one I would need persuading into.',
            },
          ],
        },
        {
          title: 'Domain, technology and the product',
          rows: [
            {
              requirement:
                'Retail understanding — how stores and retail operations actually work',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Eight years in global sportswear at adidas across product data, social commerce and brand marketing, serving 50+ market teams whose work ended on a retail shelf or a retail channel.',
            },
            {
              requirement:
                'Product data lifecycle — acquisition, standardisation, delivery, and quality along the way',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The PIM was exactly that, end to end, and quality was the whole point: bad product data reaches the customer directly. Speed to market improved 70% and adoption across 50+ market teams reached 100%.',
            },
            {
              requirement:
                'Defining metrics and running experiments to drive iteration',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I set and reported OKRs and adoption KPIs to executives who steered with them, and I measure my own products the same way — defining what success looks like before building, then instrumenting it.',
            },
            {
              requirement:
                'Partnering with customers and field teams to turn needs into requirements',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'The discovery work behind the PIM was sitting with markets until I understood why each had built its own workaround. A data model designed without that context gets worked around rather than adopted.',
            },
            {
              requirement:
                'Coordinating launches with product marketing and sales operations',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Rollouts to 50+ market teams with enablement shipped alongside, a staged three-country migration with zero downtime, and the commercial side of a €1M platform including its renewal.',
            },
            {
              requirement: 'Hands-on product leadership in a small, fast team',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at an early-stage fintech after eight years in a large organisation, and I build my own products end to end — PlayerGrade, now in use at a professional club, and this site.',
            },
            {
              requirement:
                'Computer vision — shipping products built on visual recognition',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My honest limit. I have built products on top of video and tracking data, but I have not shipped computer vision, and I would not claim to know where its accuracy fails in a badly lit aisle. That is knowledge I would be taking from your CV team.',
            },
            {
              requirement:
                'Deep tech and hardware-adjacent capture — fixed cameras, robots',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'All my products have been software-only. Hardware changes the economics and the failure modes in ways I would have to learn from the people who have already been through it.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The closest precedent',
      statusBadge: 'adidas — product-data platform, 50+ market teams',
      heading:
        'A catalog that is right on day one and quietly wrong by week six — that is the problem I have already spent years on.',
      body: 'At adidas, product information lived in source systems and spreadsheets that disagreed with each other, and everything downstream inherited the disagreement. I built the platform that collected it, enriched and standardised it into one set of catalogs and attributes, and syndicated it to the channels and the 50+ market teams that needed it. Speed to market improved 70%; adoption reached 100%. The part that mattered was not the initial load, it was staying correct: ranges change, markets add exceptions, someone renames an attribute, and a model that nobody re-verified becomes confidently wrong. Store onboarding and modelling reads to me like the same job with a floor plan attached — planograms and catalogs that have to be right before capture means anything, and have to keep being right as the store is reset. I would also bring the instrumentation habit. The analytics behind this site are mine from schema to dashboard, and their most useful moment was discovering the numbers were wrong: roughly a third of recorded traffic turned out to be automated, inflating everything. Coverage, quality and cost cannot be traded off against each other unless the telemetry underneath is honest.',
      credentials: [
        'PIM — catalogs & attributes, 50+ markets',
        '+70% speed to market, 100% adoption',
        'Own analytics pipeline — schema to dashboard',
        'PlayerGrade — video & tracking data, Vertex AI',
      ],
      closingLine:
        'Capture is a data-quality problem before it is a camera problem, and data quality at scale is the thing I have the clearest record on.',
    },
    gap: {
      chip: 'The deep-tech half',
      heading:
        'Computer vision, AR and on-device ML are not on my record — and your capture stack is built on them.',
      body: 'The honest division: I bring retail product data, telemetry, adoption and launch experience with real evidence behind each, and the capture technology itself as something I would be learning from your team. I have not shipped computer vision, I have no AR product behind me, and my ML work is cloud-side rather than on-device — I could not tell you today where recognition accuracy falls apart in a badly lit aisle or what that costs in battery. My degree is not in engineering either; the technical credibility I have is practical rather than academic. Two of those three are listed as beneficial rather than required, which is presumably deliberate, and the requirement you did put first is six years of product management in deep tech or mobile SaaS, which I meet. There is also the practical matter: I am an EU national who would relocate to Zurich and take the standard permit route, rather than someone already sitting in Zurich with the right to work. If that changes the maths for you, I would rather you weigh it now, with the position stated plainly, than discover it late.',
    },
    closing: {
      eyebrow: 'Why Scandit',
      heading: 'The unglamorous layer is where this product is won or lost',
      body: 'What makes ShelfView interesting to me is that the hard part is not the recognition, it is everything around it: whether the right aisles get captured often enough, whether the store model still matches the store, whether an associate finds the capture flow worth doing properly on a busy afternoon. Those are product problems, not vision problems, and they are the ones I have spent nine years on — in an environment where the data feeding retail channels had to be right before anything downstream could be. Add a Zurich team building something physical enough to be verifiable, and a role defined precisely rather than aspirationally, and it is the kind of scope I would want. I know exactly which half of it I would be learning.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · German · Italian B2 · Slovak',
        'Head of Product, algorithmic trading fintech',
      ],
      signature:
        'Lukáš Hošala — nine years making sure the data underneath was right.',
    },
  },

  de: {
    hero: {
      eyebrow: 'Scandit · Zürich · Senior Product Manager, ShelfView Capture',
      headlineLead:
        'Ein digitaler Zwilling der Filiale ist nur so gut wie die Daten, die hineingehen.',
      headlineGradient:
        'Mit diesem Problem habe ich acht Jahre verbracht, eine Stufe weiter oben.',
      description:
        'Bei adidas verantwortete ich die Produktdaten-Plattform: Produktinformationen aus Quellsystemen sammeln, zu Katalogen und Attributen standardisieren, auf die sich das Geschäft verlassen kann, und sie aktuell halten, während sich Produkte und Märkte ändern — für mehr als 50 Marktteams, die Handelskanäle bespielen. Das ist der nahe Verwandte der Filialmodellierung, und der Fehlermodus ist identisch: Sobald das Modell vom Regal abweicht, wird alles darüber still falsch. Acht dieser Jahre verbrachte ich in einer mobile-first Produktorganisation mit über 165 Millionen Nutzern. Heute verantworte ich das Produkt bei einer Fintech und baue meine eigene Instrumentierung. Diese Seite gleicht das mit ShelfView Capture ab — samt der Teile Ihres Technologie-Stacks, in denen ich nicht gearbeitet habe.',
      chips: [
        'Retail-Produktdaten',
        'Kataloge, Attribute & Datenqualität',
        'Telemetrie & Experimente',
        'Mobile-first mit 165M+ Nutzern',
        'Umzug nach Zürich',
      ],
      stats: [
        { value: '9', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer im mobile-first Unternehmen, in dem ich arbeitete',
        },
        {
          value: '50+',
          label: 'Marktteams auf dem Katalogstandard, den ich baute',
        },
        {
          value: '+70%',
          label: 'Schnellere Time-to-Market durch die Plattform',
        },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was ShelfView Capture verlangt — und wo ich es gemacht habe',
      items: [
        {
          id: 'modeling',
          title: 'Filial-Onboarding und Modellierung — und das Aktuellhalten',
          body: 'Das ist mein nächstliegender Präzedenzfall, und er liegt nah. Das adidas-PIM existierte, weil Produktdaten in fünfzig Tabellen mit fünfzig verschiedenen Attributnamen lagen und alles Nachgelagerte dieses Durcheinander erbte. Ich baute die Schicht, die sie sammelte, zu Katalogen und Attributen standardisierte und an die Kanäle lieferte, die sie brauchten — und hielt sie korrekt, während sich Sortimente, Märkte und Saisons änderten. Eine Filiale einsatzbereit zu machen hat dieselbe Form: Ein Modell, das an Tag eins stimmt und in Woche sechs still falsch ist, ist das Scheitern, das alle unterschätzen, weil nichts hörbar bricht.',
        },
        {
          id: 'telemetry',
          title: 'Erfassungsqualität, Produktkennzahlen und Telemetrie',
          body: 'Die Kennzahl vor dem Bauen zu definieren ist die einzige Art, wie die Analyse danach etwas bedeutet, und diesen Anspruch halte ich auch bei eigener Arbeit. Die Analytics hinter dieser Website sind von der Datenbank aufwärts meine — einschließlich des Moments, in dem die Zahlen gesund aussahen und die Rohdaten zeigten, dass rund ein Drittel des erfassten Traffics automatisiert war. Ich habe ihn klassifiziert, die Historie nachgezogen und den Filter ergänzt. Qualität, Abdeckung und Kosten sind ein Dreiecks-Kompromiss, den man nur steuern kann, wenn die Instrumentierung vertrauenswürdig ist.',
        },
        {
          id: 'capture',
          title: 'Eine Erfassung, die beim ersten Mal sitzt',
          body: 'First-time-right ist ein Zuverlässigkeitsproblem im UX-Kostüm: Die Kosten einer fehlgeschlagenen Erfassung sind nicht der zweite Versuch, sondern die Mitarbeiterin, die dem Werkzeug nicht mehr traut und es umgeht. Genau um diese Art von Akzeptanz ging es in neun Jahren — die Plattform, die 100% Nutzung erreichte, weil der Ablauf zur tatsächlichen Arbeitsweise passte, und die 1-Mio.-€-Plattform, die 30 Punkte zurückgewann, nachdem sie um die echten Aufgaben herum neu gebaut wurde. Ich leitete außerdem den Front-End-Neuaufbau, der die Ladezeit um 55% senkte — Latenz in einem Arbeitswerkzeug ist ein Vertrauensproblem, kein Komfortproblem.',
        },
        {
          id: 'tasking',
          title:
            'Beauftragung und Planung — welche Filialen, wie oft, durch wen',
          body: 'Das ist Priorisierung mit operativer Kante: Abdeckung gegen Kosten, mit echten Menschen und ihrer Zeit auf der anderen Seite der Entscheidung. Diesen Kompromiss habe ich über mehr als 50 Marktteams gesteuert, deren Kapazität und Reife weit auseinanderlagen, und die Planungslogik für eigene Systeme gebaut — inklusive der Kampagnensteuerung hinter dieser Seite, in der jede Kampagne ihr eigenes Zeitfenster, einen automatischen Ablauf und eine Übersteuerung hat, weil handgeplante Dinge irgendwann zu lange laufen und es niemandem auffällt.',
        },
        {
          id: 'crossfunc',
          title: 'Design, Mobile Engineering, CV — und das Feld',
          body: 'Die Kunden- und Feldhälfte habe ich ausgiebig gemacht: 50+ Marktteams und über 1.000 interne Nutzer, keiner davon mir unterstellt, dazu Legal, Procurement und IT bei jedem Rollout. Die technische Hälfte decke ich durchs Bauen ab — ich schreibe und liefere Code, spezifiziere und nutze APIs, und meine eigenen Produkte laufen auf verwalteten ML-Plattformen. Das trägt ein Arbeitsgespräch mit Entwicklern; bei einem Computer-Vision-Team würde ich von deren Expertise ausgehen, und das sage ich lieber, als etwas anderes anzudeuten.',
        },
        {
          id: 'hybrid',
          title: 'Hybride Erfassung — Festkameras, Roboter, neue Technologien',
          body: 'Eine unbekannte Technologie nach ihren Verdiensten zu bewerten und auch zu dem Schluss zu kommen, dass Kaufen besser ist als Bauen, ist eine Entscheidung, die ich mit Budget dahinter getroffen habe. Bei adidas saß ich auf beiden Seiten: eine lizenzierte Plattform für 1 Mio. €, die ich verantwortete und verlängerte, und eine eigene Engine, die wir statt weiterer Lizenzen bauten. Das Urteilsvermögen überträgt sich, auch wenn die Hardware es nicht tut — was man pilotiert, was man vor dem Skalieren misst, und wann eine beeindruckende Demo noch kein Produkt ist.',
        },
        {
          id: 'launch',
          title: 'Launches, Piloten und die Rolle des Ansprechpartners',
          body: 'Ich habe Launches verantwortet, bei denen Scheitern für alle sichtbar gewesen wäre: eine stufenweise Migration über drei Länder mit null Ausfallzeit für über 165 Mio. Nutzer und ein Plattform-Rollout auf 50+ Marktteams, bei dem Schulung und Dokumentation mit dem Produkt kamen statt danach. Während eines Piloten der benannte Ansprechpartner zu sein — auch bei den Anrufen, in denen etwas nicht funktionierte — entscheidet darüber, ob der zweite Rollout leichter oder schwerer wird.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Was Scandit sucht',
          rows: [
            {
              requirement:
                'Mindestens 6 Jahre Produktmanagement in Deep Tech oder mobiler SaaS, oder vergleichbare Produktverantwortung in einem Start-up',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product. Acht davon in einer mobile-first Produktorganisation mit über 165 Mio. Nutzern — und die Start-up-Klausel ebenfalls: Ich bin aktuell Head of Product einer frühphasigen Fintech.',
            },
            {
              requirement: 'Erfahrung mit mobilen Apps',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre in einem mobile-first Unternehmen — Runtastic ist ein Mobilgeschäft, und ich arbeitete in dessen Release-Takt, Analytics und Rahmenbedingungen, an einem Produkt mit über 165 Mio. Nutzern auf Mobile und Web. Zur Verantwortung präzise: Die Oberfläche, die ich dort verantwortete, war die Web-Plattform, neben den Apps und nicht in ihnen.',
            },
            {
              requirement:
                'Starke analytische Fähigkeiten, praktischer Umgang mit Daten und Telemetrie',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'SQL, PowerBI und Google Analytics wöchentlich, und ich baue meine eigene Instrumentierung — die Analytics-Pipeline dieser Seite gehört mir vom Schema bis zum Dashboard, samt der Bot-Klassifikation, die ich ergänzte, nachdem ein Drittel des Traffics als automatisiert auffiel.',
            },
            {
              requirement: 'Exzellentes Englisch in Wort und Schrift',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Englisch C2 und seit neun Jahren meine Arbeitssprache in drei Ländern. Diese Seite gibt es zudem auf Deutsch und Italienisch.',
            },
            {
              requirement:
                'Bereitschaft, Kunden in Europa und Nordamerika gelegentlich zu besuchen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Für mich Routine. Meine letzte Rolle umfasste drei Länder, mit Rollouts bis nach Kolumbien, in die Niederlande und nach Deutschland.',
            },
            {
              requirement: 'Abschluss in Ingenieurwesen oder verwandtem Feld',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Auf dem Papier nicht. Meine Abschlüsse sind ein BSc in Sportmanagement und ein CMI Level 7 Diploma in Strategic Management — MBA-Niveau, nicht Ingenieurwesen. Dafür steht Praxis statt Zeugnis: Ich liefere Code, spezifiziere und nutze APIs und baue und deploye ML-gestützte Produkte selbst.',
            },
            {
              requirement: 'Erfahrung mit AR-Anwendungsfällen',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Nichts ausgeliefert. Das Nächstliegende sind geführte Aufgabenabläufe, in denen die Oberfläche jemandem sagen muss, was als Nächstes zu tun ist, während er etwas anderes tut — dasselbe Designproblem, ohne Kamera.',
            },
            {
              requirement: 'Erfahrung mit On-Device-ML',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine ML-Arbeit findet in der Cloud statt: Ich trainiere, tune und evaluiere Modelle auf Google AI Studio und Vertex AI für PlayerGrade. On-Device-Grenzen — Latenz, Akku, Modellgröße, sauberes Degradieren auf einem fünf Jahre alten Gerät — sind echte Abwägungen, über die ich gelesen, die ich aber nicht erlebt habe.',
            },
            {
              requirement: 'Arbeitsberechtigung für die Schweiz',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Heute nicht, und das gehört präzise gesagt: Ich bin EU-Bürger (Slowakei), lebe in Italien und habe derzeit keine Schweizer Bewilligung. Nach dem Freizügigkeitsabkommen EU–Schweiz ist dies der übliche Bewilligungsweg und keine Arbeitgeber-Sponsorschaft, aber ich würde mich nicht als bereits berechtigt bezeichnen.',
            },
            {
              requirement: 'Wohnsitz in pendelbarer Nähe zum Zürcher Büro',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Noch nicht — für diese Rolle würde ich umziehen. Zürich steht bei mir seit Längerem auf der Liste; das ist ein Schritt, zu dem ich bereit bin und zu dem man mich nicht überreden müsste.',
            },
          ],
        },
        {
          title: 'Domäne, Technologie und Produkt',
          rows: [
            {
              requirement:
                'Retail-Verständnis — wie Filialen und Filialbetrieb tatsächlich funktionieren',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Acht Jahre im globalen Sportartikelgeschäft bei adidas über Produktdaten, Social Commerce und Markenmarketing, für 50+ Marktteams, deren Arbeit auf einem Regal oder in einem Handelskanal endete.',
            },
            {
              requirement:
                'Produktdaten-Lebenszyklus — Erfassung, Standardisierung, Auslieferung und Qualität auf dem Weg',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Genau das war das PIM, end-to-end, und Qualität war der ganze Zweck: Schlechte Produktdaten erreichen den Kunden direkt. Die Time-to-Market verbesserte sich um 70%, die Nutzung über 50+ Marktteams erreichte 100%.',
            },
            {
              requirement:
                'Kennzahlen definieren und Experimente zur Iteration führen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe OKRs und Adoptions-KPIs gesetzt und an eine Führungsebene berichtet, die damit gesteuert hat, und messe eigene Produkte genauso: erst definieren, was Erfolg heißt, dann instrumentieren.',
            },
            {
              requirement:
                'Mit Kunden und Feldteams arbeiten, um Bedarfe in Anforderungen zu übersetzen',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Die Discovery hinter dem PIM bestand darin, bei den Märkten zu sitzen, bis ich verstand, warum jeder seine eigene Behelfslösung gebaut hatte. Ein Datenmodell ohne diesen Kontext wird umgangen statt genutzt.',
            },
            {
              requirement:
                'Launches mit Product Marketing und Sales Operations koordinieren',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Rollouts auf 50+ Marktteams mit begleitendem Enablement, eine stufenweise Migration über drei Länder ohne Ausfallzeit und die kommerzielle Seite einer 1-Mio.-€-Plattform inklusive Verlängerung.',
            },
            {
              requirement:
                'Praktische Produktverantwortung in einem kleinen Team',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Head of Product in einer frühphasigen Fintech nach acht Jahren in einer Großorganisation, und ich baue eigene Produkte end-to-end — PlayerGrade, heute bei einem Profiverein im Einsatz, und diese Website.',
            },
            {
              requirement:
                'Computer Vision — Produkte auf Basis visueller Erkennung ausliefern',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine ehrliche Grenze. Ich habe Produkte auf Video- und Tracking-Daten gebaut, aber keine Computer Vision ausgeliefert, und ich würde nicht behaupten zu wissen, wo ihre Genauigkeit in einem schlecht beleuchteten Gang versagt. Dieses Wissen käme von Ihrem CV-Team.',
            },
            {
              requirement:
                'Deep Tech und hardwarenahe Erfassung — Festkameras, Roboter',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Alle meine Produkte waren reine Software. Hardware verändert Ökonomie und Fehlermodi auf eine Weise, die ich von denen lernen müsste, die das bereits durchgemacht haben.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Der nächstliegende Präzedenzfall',
      statusBadge: 'adidas — Produktdaten-Plattform, 50+ Marktteams',
      heading:
        'Ein Katalog, der an Tag eins stimmt und in Woche sechs still falsch ist — mit diesem Problem habe ich bereits Jahre verbracht.',
      body: 'Bei adidas lagen Produktinformationen in Quellsystemen und Tabellen, die einander widersprachen, und alles Nachgelagerte erbte den Widerspruch. Ich baute die Plattform, die sie sammelte, anreicherte und zu einem Satz Kataloge und Attribute standardisierte und an die Kanäle und die 50+ Marktteams auslieferte, die sie brauchten. Die Time-to-Market verbesserte sich um 70%, die Nutzung erreichte 100%. Entscheidend war nicht die Erstbefüllung, sondern das Korrektbleiben: Sortimente ändern sich, Märkte fügen Ausnahmen hinzu, jemand benennt ein Attribut um — und ein Modell, das niemand nachprüft, wird selbstbewusst falsch. Filial-Onboarding und -Modellierung liest sich für mich wie dieselbe Aufgabe mit Grundriss: Planogramme und Kataloge, die stimmen müssen, bevor Erfassung überhaupt etwas bedeutet, und die weiter stimmen müssen, wenn die Filiale umgeräumt wird. Dazu käme die Gewohnheit zu instrumentieren. Die Analytics hinter dieser Seite gehören mir vom Schema bis zum Dashboard, und ihr nützlichster Moment war die Entdeckung, dass die Zahlen falsch waren: Rund ein Drittel des erfassten Traffics war automatisiert und blähte alles auf. Abdeckung, Qualität und Kosten lassen sich nicht gegeneinander abwägen, solange die Telemetrie darunter nicht ehrlich ist.',
      credentials: [
        'PIM — Kataloge & Attribute, 50+ Märkte',
        '+70% Time-to-Market, 100% Nutzung',
        'Eigene Analytics-Pipeline — Schema bis Dashboard',
        'PlayerGrade — Video- & Tracking-Daten, Vertex AI',
      ],
      closingLine:
        'Erfassung ist ein Datenqualitätsproblem, bevor sie ein Kameraproblem ist — und Datenqualität im Maßstab ist das, wofür ich die klarste Bilanz habe.',
    },
    gap: {
      chip: 'Die Deep-Tech-Hälfte',
      heading:
        'Computer Vision, AR und On-Device-ML stehen nicht in meiner Bilanz — und Ihr Capture-Stack baut darauf.',
      body: 'Die ehrliche Teilung: Retail-Produktdaten, Telemetrie, Akzeptanz und Launch-Erfahrung bringe ich mit belegbaren Nachweisen mit, die Erfassungstechnologie selbst würde ich von Ihrem Team lernen. Ich habe keine Computer Vision ausgeliefert, kein AR-Produkt hinter mir, und meine ML-Arbeit ist Cloud- statt On-Device-Arbeit — ich könnte Ihnen heute nicht sagen, wo Erkennungsgenauigkeit in einem schlecht beleuchteten Gang zusammenbricht oder was das an Akku kostet. Auch mein Abschluss ist keiner im Ingenieurwesen; meine technische Glaubwürdigkeit ist praktisch, nicht akademisch. Zwei dieser drei Punkte sind als von Vorteil und nicht als Voraussetzung gelistet, was vermutlich Absicht ist, und die Anforderung, die Sie zuerst nennen — sechs Jahre Produktmanagement in Deep Tech oder mobiler SaaS — erfülle ich. Dazu das Praktische: Ich bin EU-Bürger, der nach Zürich ziehen und den üblichen Bewilligungsweg gehen würde, und nicht jemand, der bereits mit Arbeitsberechtigung in Zürich sitzt. Wenn das die Rechnung für Sie verändert, wägen Sie es lieber jetzt ab, klar benannt, als es spät zu entdecken.',
    },
    closing: {
      eyebrow: 'Warum Scandit',
      heading: 'Die unglamouröse Schicht entscheidet über dieses Produkt',
      body: 'Was ShelfView für mich interessant macht: Der schwierige Teil ist nicht die Erkennung, sondern alles darum herum — ob die richtigen Gänge oft genug erfasst werden, ob das Filialmodell noch zur Filiale passt, ob eine Mitarbeiterin den Erfassungsablauf an einem vollen Nachmittag für lohnend genug hält, ihn sauber zu machen. Das sind Produktprobleme, keine Vision-Probleme, und genau mit ihnen habe ich neun Jahre verbracht — in einem Umfeld, in dem die Daten für Handelskanäle stimmen mussten, bevor irgendetwas Nachgelagertes funktionieren konnte. Dazu ein Zürcher Team, das etwas baut, das physisch genug ist, um überprüfbar zu sein, und eine Rolle, die präzise statt aspirativ beschrieben ist. Ich weiß genau, welche Hälfte davon ich lernen müsste.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Deutsch · Italienisch B2 · Slowakisch',
        'Head of Product, Fintech für algorithmischen Handel',
      ],
      signature:
        'Lukáš Hošala — neun Jahre dafür gesorgt, dass die Daten darunter stimmen.',
    },
  },

  it: {
    hero: {
      eyebrow: 'Scandit · Zurigo · Senior Product Manager, ShelfView Capture',
      headlineLead:
        'Un gemello digitale del punto vendita vale quanto i dati che ci entrano.',
      headlineGradient:
        'Su quel problema ho passato otto anni, un passo a monte.',
      description:
        "In adidas gestivo la piattaforma di dati prodotto: raccogliere le informazioni dai sistemi sorgente, standardizzarle in cataloghi e attributi su cui il business potesse contare, e tenerle aggiornate mentre prodotti e mercati cambiavano — per oltre 50 team di mercato che alimentavano i canali retail. È il parente stretto della modellazione del punto vendita, e la modalità di fallimento è identica: quando il modello si scosta dallo scaffale, tutto ciò che ci sta sopra diventa silenziosamente sbagliato. Otto di quegli anni li ho passati in un'organizzazione mobile-first con oltre 165 milioni di utenti. Oggi guido il prodotto in una fintech e costruisco la mia strumentazione. Questa pagina confronta tutto questo con ShelfView Capture, comprese le parti del vostro stack tecnologico in cui non ho lavorato.",
      chips: [
        'Dati prodotto retail',
        'Cataloghi, attributi e qualità del dato',
        'Telemetria ed esperimenti',
        'Mobile-first su scala 165M+',
        'Trasferimento a Zurigo',
      ],
      stats: [
        { value: '9', label: 'Anni in product management' },
        {
          value: '165M+',
          label: "Utenti dell'azienda mobile-first in cui ho lavorato",
        },
        {
          value: '50+',
          label: 'Team di mercato sullo standard di catalogo che ho costruito',
        },
        { value: '+70%', label: 'Time to market da quella piattaforma' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Cosa chiede ShelfView Capture — e dove l'ho già fatto",
      items: [
        {
          id: 'modeling',
          title:
            'Onboarding e modellazione del punto vendita — e tenerli aggiornati',
          body: 'È il precedente più vicino che ho, ed è vicino davvero. Il PIM di adidas esisteva perché i dati prodotto vivevano in cinquanta fogli di calcolo con cinquanta nomi di attributo diversi, e tutto ciò che stava a valle ereditava quel disordine. Ho costruito il livello che li raccoglieva, li standardizzava in cataloghi e attributi e li consegnava ai canali che ne avevano bisogno — mantenendoli corretti mentre gamme, mercati e stagioni cambiavano. Preparare un punto vendita ha la stessa forma: un modello corretto il primo giorno e silenziosamente sbagliato alla sesta settimana è il fallimento che tutti sottovalutano, perché non si rompe nulla in modo rumoroso.',
        },
        {
          id: 'telemetry',
          title: 'Qualità della cattura, metriche di prodotto e telemetria',
          body: "Definire la metrica prima di costruire è l'unico modo perché l'analisi successiva significhi qualcosa, e tengo questo standard anche sul lavoro mio. Le analytics dietro questo sito sono mie dal database in su — compreso il momento in cui i numeri sembravano sani e le righe grezze mostravano che circa un terzo del traffico registrato era automatico. L'ho classificato, ho corretto lo storico e ho aggiunto il filtro. Qualità, copertura e costo sono un compromesso a tre che si governa solo se la strumentazione è affidabile.",
        },
        {
          id: 'capture',
          title: 'Una cattura che funziona al primo tentativo',
          body: "Il first-time-right è un problema di affidabilità travestito da UX: il costo di una cattura fallita non è il secondo tentativo, è l'addetto che smette di fidarsi dello strumento e lo aggira. Ho passato nove anni proprio su questo tipo di adozione — la piattaforma che ha raggiunto il 100% perché il flusso corrispondeva a come le persone già lavoravano, e la piattaforma da 1 milione di euro che ha recuperato 30 punti una volta ricostruita attorno ai compiti reali. Ho anche guidato la ricostruzione del front-end che ha ridotto del 55% il tempo di caricamento: in uno strumento di lavoro la latenza è un problema di fiducia, non di comfort.",
        },
        {
          id: 'tasking',
          title:
            'Assegnazione e pianificazione — quali negozi, ogni quanto, da chi',
          body: "È prioritizzazione con un bordo operativo: copertura contro costo, con persone reali e il loro tempo dall'altra parte della decisione. Ho gestito quel compromesso su oltre 50 team di mercato con capacità e maturità molto diverse, e ho costruito la logica di pianificazione per i miei sistemi — inclusa la gestione delle campagne dietro questo sito, dove ogni campagna ha la sua finestra, una scadenza automatica e una possibilità di forzatura, perché ciò che si pianifica a mano prima o poi resta acceso troppo a lungo senza che nessuno se ne accorga.",
        },
        {
          id: 'crossfunc',
          title: 'Design, mobile engineering, CV — e il campo',
          body: "La metà fatta di clienti e team sul campo l'ho fatta a lungo: oltre 50 team di mercato e più di 1.000 utenti interni, nessuno dei quali rispondeva a me, più legal, procurement e IT a ogni rollout. La metà tecnica la copro costruendo: scrivo e rilascio codice, specifico e consumo API, e i miei prodotti girano su piattaforme ML gestite. Questo regge una conversazione di lavoro con gli ingegneri; con un team di computer vision partirei dalla loro competenza, e preferisco dirlo piuttosto che lasciare intendere altro.",
        },
        {
          id: 'hybrid',
          title:
            'Cattura ibrida — telecamere fisse, robot, tecnologie emergenti',
          body: "Valutare una tecnologia sconosciuta nel merito, ed essere disposto a concludere che comprare batte costruire, è una decisione che ho preso con dei soldi dietro. In adidas sono stato su entrambi i lati: una piattaforma in licenza da 1 milione di euro che gestivo e rinnovavo, e un motore interno costruito invece di comprare altre licenze. Il giudizio si trasferisce anche se l'hardware no — cosa pilotare, cosa misurare prima di scalare, e quando una demo impressionante non è ancora un prodotto.",
        },
        {
          id: 'launch',
          title: 'Lanci, piloti ed essere il punto di contatto',
          body: 'Ho gestito lanci in cui il fallimento sarebbe stato visibile a tutti: una migrazione a fasi su tre paesi con zero downtime per oltre 165 milioni di utenti, e un rollout su oltre 50 team di mercato in cui formazione e documentazione arrivavano con il prodotto e non dopo. Essere il contatto designato durante un pilota — comprese le telefonate in cui qualcosa non funzionava — è ciò che decide se il secondo rollout sarà più facile o più difficile del primo.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Quello che Scandit cerca',
          rows: [
            {
              requirement:
                'Almeno 6 anni di product management in deep tech o SaaS mobile, o equivalente leadership di prodotto in una startup',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Nove anni, da Product Owner a Head of Product. Otto in un'organizzazione mobile-first con oltre 165 milioni di utenti — e anche la clausola startup: oggi sono Head of Product di una fintech in fase iniziale.",
            },
            {
              requirement: 'Esperienza con app mobili',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                "Otto anni dentro un'azienda mobile-first: Runtastic è un business mobile, e ho lavorato al suo ritmo di rilascio, alle sue analytics e ai suoi vincoli, su un prodotto usato da oltre 165 milioni di persone tra mobile e web. Per essere preciso sulla titolarità: la superficie che gestivo era la piattaforma web, accanto alle app e non dentro di esse.",
            },
            {
              requirement:
                'Forti capacità analitiche e di problem solving; a proprio agio con dati e telemetria',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'SQL, PowerBI e Google Analytics ogni settimana, e costruisco la mia strumentazione: la pipeline di analytics di questo sito è mia dallo schema alla dashboard, inclusa la classificazione dei bot aggiunta dopo aver scoperto che un terzo del traffico era automatico.',
            },
            {
              requirement: 'Ottimo inglese scritto e parlato',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Inglese C2 e la mia lingua di lavoro da nove anni in tre paesi. Questa pagina è disponibile anche in tedesco e italiano.',
            },
            {
              requirement:
                'Disponibilità a visitare clienti in Europa e Nord America occasionalmente',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Per me è la norma. Il mio ultimo ruolo copriva tre paesi, con rollout fino a Colombia, Paesi Bassi e Germania.',
            },
            {
              requirement: 'Laurea in ingegneria o disciplina affine',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Non sulla carta. I miei titoli sono una laurea in Sport Management e un CMI Level 7 Diploma in Strategic Management — livello MBA, non ingegneria. Al suo posto c’è la pratica: rilascio codice, specifico e consumo API, e costruisco e distribuisco io stesso prodotti basati su ML.',
            },
            {
              requirement: 'Esperienza con casi d’uso AR',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Nulla di rilasciato. La cosa più vicina sono flussi guidati in cui l’interfaccia deve dire a qualcuno cosa fare mentre sta facendo altro — lo stesso problema di design, senza la fotocamera.',
            },
            {
              requirement: 'Esperienza con ML on-device',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Il mio lavoro sul ML è lato cloud: addestro, ottimizzo e valuto modelli su Google AI Studio e Vertex AI per PlayerGrade. I vincoli on-device — latenza, batteria, dimensione del modello, degradare bene su un telefono di cinque anni fa — sono compromessi reali che ho letto ma non vissuto.',
            },
            {
              requirement: 'Titolo per lavorare in Svizzera',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Oggi no, e vale la pena dirlo con precisione: sono cittadino UE (slovacco), vivo in Italia e non ho un permesso svizzero. In base all’accordo di libera circolazione UE–Svizzera questa è la procedura ordinaria di permesso e non una sponsorizzazione del datore di lavoro, ma non mi descriverei come già in possesso del titolo.',
            },
            {
              requirement:
                'Residenza a distanza pendolare dall’ufficio di Zurigo',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Non ancora — per questo ruolo mi trasferirei. Zurigo è nella mia lista da tempo: è un passo a cui sono pronto, non uno di cui andrei convinto.',
            },
          ],
        },
        {
          title: 'Dominio, tecnologia e prodotto',
          rows: [
            {
              requirement:
                'Conoscenza del retail — come funzionano davvero i punti vendita e le operazioni',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Otto anni nello sportswear globale in adidas tra dati prodotto, social commerce e marketing di marca, al servizio di oltre 50 team di mercato il cui lavoro finiva su uno scaffale o in un canale retail.',
            },
            {
              requirement:
                'Ciclo di vita del dato prodotto — acquisizione, standardizzazione, consegna e qualità lungo il percorso',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Il PIM era esattamente questo, end-to-end, e la qualità era tutto il punto: un dato prodotto sbagliato arriva direttamente al cliente. Il time to market è migliorato del 70% e l’adozione su oltre 50 team di mercato ha raggiunto il 100%.',
            },
            {
              requirement:
                'Definire metriche e condurre esperimenti per guidare l’iterazione',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho definito e riportato OKR e KPI di adozione a dirigenti che li usavano per decidere, e misuro i miei prodotti allo stesso modo: prima definire cosa significa successo, poi strumentarlo.',
            },
            {
              requirement:
                'Collaborare con clienti e team sul campo per tradurre bisogni in requisiti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'La discovery dietro il PIM è stata stare con i mercati finché non ho capito perché ognuno si era costruito la propria soluzione di ripiego. Un modello dati senza quel contesto viene aggirato, non adottato.',
            },
            {
              requirement:
                'Coordinare i lanci con product marketing e sales operations',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Rollout su oltre 50 team di mercato con abilitazione inclusa, una migrazione a fasi su tre paesi senza downtime, e il lato commerciale di una piattaforma da 1 milione di euro, rinnovo compreso.',
            },
            {
              requirement:
                'Leadership di prodotto pratica in un team piccolo e veloce',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Head of Product in una fintech in fase iniziale dopo otto anni in una grande organizzazione, e costruisco i miei prodotti end-to-end: PlayerGrade, oggi usato da un club professionistico, e questo sito.',
            },
            {
              requirement:
                'Computer vision — rilasciare prodotti basati sul riconoscimento visivo',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Il mio limite onesto. Ho costruito prodotti sopra dati video e di tracking, ma non ho rilasciato computer vision, e non direi di sapere dove la sua accuratezza cede in una corsia poco illuminata. È conoscenza che prenderei dal vostro team CV.',
            },
            {
              requirement:
                'Deep tech e cattura vicina all’hardware — telecamere fisse, robot',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Tutti i miei prodotti sono stati solo software. L’hardware cambia economia e modalità di guasto in modi che dovrei imparare da chi c’è già passato.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Il precedente più vicino',
      statusBadge: 'adidas — piattaforma dati prodotto, 50+ team di mercato',
      heading:
        'Un catalogo corretto il primo giorno e silenziosamente sbagliato alla sesta settimana: su quel problema ho già passato anni.',
      body: "In adidas le informazioni di prodotto vivevano in sistemi sorgente e fogli di calcolo che si contraddicevano, e tutto ciò che stava a valle ereditava la contraddizione. Ho costruito la piattaforma che le raccoglieva, le arricchiva e le standardizzava in un unico insieme di cataloghi e attributi, e le distribuiva ai canali e agli oltre 50 team di mercato che ne avevano bisogno. Il time to market è migliorato del 70%, l'adozione ha raggiunto il 100%. La parte che contava non era il caricamento iniziale, era restare corretti: le gamme cambiano, i mercati aggiungono eccezioni, qualcuno rinomina un attributo, e un modello che nessuno riverifica diventa sicuro di sé e sbagliato. L'onboarding e la modellazione del punto vendita mi sembrano lo stesso lavoro con una pianta allegata: planogrammi e cataloghi che devono essere giusti prima che la cattura significhi qualcosa, e devono restare giusti quando il negozio viene riallestito. Porterei anche l'abitudine di strumentare. Le analytics dietro questo sito sono mie dallo schema alla dashboard, e il loro momento più utile è stato scoprire che i numeri erano sbagliati: circa un terzo del traffico registrato era automatico e gonfiava tutto. Copertura, qualità e costo non si possono bilanciare se la telemetria sotto non è onesta.",
      credentials: [
        'PIM — cataloghi e attributi, 50+ mercati',
        '+70% time to market, 100% adozione',
        'Pipeline di analytics propria — dallo schema alla dashboard',
        'PlayerGrade — dati video e tracking, Vertex AI',
      ],
      closingLine:
        'La cattura è un problema di qualità del dato prima che un problema di fotocamera, e la qualità del dato su larga scala è ciò su cui ho il record più chiaro.',
    },
    gap: {
      chip: 'La metà deep tech',
      heading:
        'Computer vision, AR e ML on-device non sono nel mio percorso — e il vostro stack di cattura si basa su questi.',
      body: "La divisione onesta: porto dati prodotto retail, telemetria, adozione ed esperienza di lancio con prove concrete dietro ciascuno, e la tecnologia di cattura come qualcosa che imparerei dal vostro team. Non ho rilasciato computer vision, non ho un prodotto AR alle spalle, e il mio lavoro sul ML è lato cloud e non on-device: oggi non saprei dirvi dove l'accuratezza del riconoscimento crolla in una corsia poco illuminata né quanto costa in batteria. Nemmeno la mia laurea è in ingegneria; la credibilità tecnica che ho è pratica, non accademica. Due di quei tre punti sono elencati come utili e non come requisiti, presumibilmente per scelta, e il requisito che avete messo per primo — sei anni di product management in deep tech o SaaS mobile — lo soddisfo. C'è poi il lato pratico: sono un cittadino UE che si trasferirebbe a Zurigo seguendo la procedura ordinaria di permesso, non qualcuno già a Zurigo con il titolo per lavorare. Se questo cambia i conti per voi, preferisco che li facciate adesso, con la posizione dichiarata, piuttosto che scoprirlo tardi.",
    },
    closing: {
      eyebrow: 'Perché Scandit',
      heading:
        'Lo strato meno spettacolare è dove questo prodotto si vince o si perde',
      body: 'Ciò che rende ShelfView interessante per me è che la parte difficile non è il riconoscimento, è tutto ciò che gli sta attorno: se le corsie giuste vengono catturate abbastanza spesso, se il modello del negozio corrisponde ancora al negozio, se un addetto in un pomeriggio affollato ritiene che valga la pena fare bene il flusso di cattura. Sono problemi di prodotto, non di visione artificiale, e sono quelli su cui ho passato nove anni — in un contesto in cui i dati che alimentavano i canali retail dovevano essere corretti prima che qualsiasi cosa a valle potesse funzionare. Aggiungete un team a Zurigo che costruisce qualcosa di abbastanza fisico da essere verificabile, e un ruolo descritto con precisione anziché per aspirazione. So esattamente quale metà dovrei imparare.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglese C2 · Tedesco · Italiano B2 · Slovacco',
        'Head of Product, fintech di trading algoritmico',
      ],
      signature:
        'Lukáš Hošala — nove anni a garantire che i dati sotto fossero giusti.',
    },
  },
}
