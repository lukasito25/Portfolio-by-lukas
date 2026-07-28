export type Locale = 'en' | 'de' | 'it'

export interface HeroStat {
  value: string
  label: string
}

export interface RoleMapItem {
  id:
    | 'deliver'
    | 'prototype'
    | 'stakeholders'
    | 'requirements'
    | 'ownership'
    | 'analytics'
    | 'opportunities'
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

export interface KrakenContent {
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
  /** Standout credential — here: prototyping with AI, evidenced by this page. */
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

export const krakenContent: Record<Locale, KrakenContent> = {
  en: {
    hero: {
      eyebrow: 'Kraken · Consumer Trading · Senior Product Manager',
      headlineLead:
        'You asked for someone who prototypes with Claude Code before writing specs.',
      headlineGradient: "You're reading one.",
      description:
        "I run product at an algorithmic trading platform where retail traders put their own money to work — the same user and the same stakes as Kraken Consumer. Before that, eight years at adidas owning a product used by 165M+ people. I hold crypto and use exchanges like yours, so I know the consumer flow as someone who lives it rather than someone who has read about it. This page maps all of that against the role, honestly — including the part where crypto is something I use rather than something I've built.",
      chips: [
        'Retail Trading Product',
        'Consumer at 165M+ scale',
        'Claude Code · Cursor',
        'SQL & Experimentation',
        'Crypto holder',
      ],
      stats: [
        { value: '8+', label: 'Years in product management' },
        { value: '165M+', label: 'Users on the consumer product I owned' },
        { value: '55%', label: 'Faster page load on the rebuild I led' },
        { value: '13+', label: 'People led, across 3 countries' },
      ],
    },
    roleMapSection: {
      eyebrow: 'The role, mapped',
      heading: "What Kraken is asking for — and where I've already done it",
      items: [
        {
          id: 'prototype',
          title: 'Prototype it yourself before writing the spec',
          body: 'This is the line in your posting I did not expect to see, and the one I can answer most directly. This site — seven role-specific briefs, a geo-targeted campaign system with its own admin panel, and an analytics pipeline that classifies bots — was built by directing Claude Code. It is not a demo. It is deployed, instrumented, and when the analytics started counting automated traffic as real visitors, I found it and fixed it. Getting to a working thing first is how you discover whether an idea survives contact with reality; the spec is then written knowing what is actually true rather than what sounded true in a document.',
        },
        {
          id: 'deliver',
          title: 'Deliver Consumer Trading initiatives',
          body: 'Shipping consumer features to people who did not ask for change is the job I have done longest. At Runtastic I owned a product used by 165M+ people and led the front-end rebuild that cut page-load time by 55% — a consumer trading app lives or dies on exactly that kind of latency. And I have run releases where failure was not an option: a staged migration across three countries with zero downtime for those same 165M+ users.',
        },
        {
          id: 'requirements',
          title: 'Requirements, analysis, and actually testing the result',
          body: 'Writing specs with acceptance criteria clear enough to build against, then verifying delivery against them, is my day-to-day rather than a phase. I do the UAT myself where it matters, because the gap between "implemented" and "implemented as intended" is where consumer trust quietly leaks — and in a trading product that gap costs someone money rather than a mild annoyance.',
        },
        {
          id: 'analytics',
          title: 'Evangelising analytics and experimentation',
          body: 'Making an organisation data-driven is mostly a persuasion problem, not a tooling one. I set and reported OKRs and adoption KPIs to executives at Runtastic and used them to steer rather than decorate; the 30% adoption lift on a €1M platform came from managing to the metric instead of mandating from the top. I decide off SQL, PowerBI and Google Analytics, and I built the analytics for this site myself — including the part that stops it lying to me.',
        },
        {
          id: 'stakeholders',
          title: 'Stakeholders, and communicating the roadmap',
          body: 'At adidas I aligned legal, procurement, branding, IT, business and 50+ global market teams, none of whom reported to me, and led 13+ people across three countries. Communicating a roadmap to people who can veto it but not be ordered by it is a specific skill, and it is most of what I have been doing for nine years.',
        },
        {
          id: 'ownership',
          title: 'Ownership, including the unglamorous continuity work',
          body: 'The posting asks for collaboration with Finance and Operations to keep the business running, which is the part of product work nobody writes on a CV. I owned a €1M annual platform licence and the operational reality around it — renewals, budget, the questions from teams whose work stopped when something broke. Owning a product means owning it on the days it is boring.',
        },
        {
          id: 'opportunities',
          title: 'Evaluating and proposing new product opportunities',
          body: 'I bring proposals rather than wait for them: PlayerGrade exists because I saw a problem worth solving and built it end to end without being asked, and it now shapes real transfer decisions at a professional club. Evaluating an opportunity and being willing to build a rough version to find out is the same instinct your prototyping requirement is pointing at.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profile match',
      heading: "Where I match, and where I don't",
      panels: [
        {
          title: 'What Kraken is looking for',
          rows: [
            {
              requirement: '4+ years of product management experience',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Nine years, from Product Owner to Head of Product, 2016 to 2025.',
            },
            {
              requirement:
                'Prior crypto, trading, or banking experience (required)',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Trading. I am Head of Product at an algorithmic trading platform used by retail traders with their own capital. That is the clause I qualify under — see the panel below for the honest limits on the crypto half.',
            },
            {
              requirement:
                'Experience building retail products in stocks, cryptocurrencies or derivatives',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A retail trading platform is my current product. Same user as Kraken Consumer, same psychology, same consequence when the interface misleads someone by a fraction.',
            },
            {
              requirement:
                'Strong understanding of the retail trading landscape and user behaviour',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'From both sides: I build for retail traders daily, and I am one — I hold crypto and use exchanges like yours, so I know where the consumer flow is friction and where it is trust.',
            },
            {
              requirement:
                'Comfortable prototyping with AI tools (Claude Code, Cursor) to validate ideas hands-on',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'You are reading the evidence. This site and everything behind it — seven briefs, a campaign admin panel, an analytics pipeline — was built by directing Claude Code, and it is in production rather than a sandbox.',
            },
            {
              requirement:
                'Strong product sense with a keen eye for UX and attention to detail',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'I led the Next.js/React rebuild of the Runtastic front end, cutting page-load time 55%, and I design and build my own interfaces — including this one.',
            },
            {
              requirement:
                'Expertise in data gathering and quantitative analysis (SQL, data visualisation)',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'SQL, PowerBI and Google Analytics weekly, and I built this site’s analytics from the database up — including bot classification, because the numbers were wrong and nobody else was going to notice.',
            },
            {
              requirement:
                'Solution-oriented, highly motivated, proactive self-starter',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'PlayerGrade was unprompted. So was rebuilding this site. I am at my best when nobody has told me what the next thing is.',
            },
          ],
        },
        {
          title: 'Crypto, scale & the nice-to-haves',
          rows: [
            {
              requirement: 'Crypto as a product you have built, not just used',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My honest limit. I hold crypto and use exchanges, and StagStrat is blockchain-adjacent, but I have not built a crypto product. Custody, listings, on-chain mechanics and market structure are things I understand as an informed user, not as someone who has shipped them.',
            },
            {
              requirement: 'Trading products at exchange scale (10M+ clients)',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'My consumer scale is 165M+ users, but on fitness rather than finance; my trading product is real-money but far smaller than Kraken. I have had both halves, never at once.',
            },
            {
              requirement:
                'Scaling subscription products — pricing, feature gating, churn',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'Listed as a nice-to-have and I will not stretch for it. I have owned licence economics from the buying side at €1M a year, which is not the same as running a consumer subscription P&L.',
            },
            {
              requirement:
                'Product-led growth — activation, retention, monetisation loops',
              isMatch: false,
              tierLabel: 'Transferable',
              proof:
                'I have driven adoption hard — 100% on a rollout across 50+ market teams, +30% after repositioning — but through enablement and positioning rather than designed growth loops.',
            },
            {
              requirement: 'Consumer products on mobile and web at scale',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Runtastic was exactly that: a consumer product on both, used by 165M+ people, with the roadmap and the front-end rebuild mine to own.',
            },
            {
              requirement:
                'Working with Finance and Operations to ensure continuity',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'A €1M annual licence, its renewals and its budget, plus the operational fallout whenever the tooling underneath 50+ market teams misbehaved.',
            },
            {
              requirement: 'A full-stack team shipping fast, in the open',
              isMatch: true,
              tierLabel: 'Direct match',
              proof:
                'Head of Product at an early-stage fintech after eight years in a large organisation. I chose the small, fast end deliberately, and I write and ship code myself when that is the quickest way to an answer.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'The prototype',
      statusBadge: 'This page — built by directing Claude Code',
      heading:
        'You asked for someone who prototypes with AI before writing specs. This page is the work sample.',
      body: 'Your posting names Claude Code and Cursor, which is unusual enough that it changed what I sent you. Rather than describe how I work, this is it. This site is a Next.js application I built by directing Claude Code: seven role-specific briefs like this one, a geo-targeted campaign system with an admin panel so I can start and stop banners without a deploy, and a self-owned analytics pipeline running on Cloudflare D1. It is deployed, it is instrumented, and it has had real bugs — at one point the analytics were counting automated traffic as genuine visitors and inflating every number, so I found it, classified the bot traffic and backfilled the history. That is the actual value of prototyping this way, and it is not speed. It is that you learn what is true early enough to change your mind cheaply. A spec written after you have held a working version is a different document from one written before.',
      credentials: [
        'This site — Next.js, built with Claude Code',
        'Campaign admin panel — no deploy needed',
        'Analytics on Cloudflare D1, with bot filtering',
        'PlayerGrade — Python · FastAPI · Vertex AI',
      ],
      closingLine:
        'You can click anything on this site and see whether it holds up. That felt like a more honest answer to a prototyping requirement than a bullet point claiming I meet it.',
    },
    gap: {
      chip: 'Crypto, honestly',
      heading:
        'I qualify through trading, not crypto — and the difference is worth stating.',
      body: 'Your requirement reads crypto, trading, or banking, and mine is squarely the middle one: a retail trading platform where people commit their own capital and a slow or misleading interface costs them money. That is real, and it is current. What I am not is someone who has built a crypto product. I hold crypto and use exchanges, which gives me the consumer perspective and a genuine feel for where these flows are confusing — but custody, listings, on-chain mechanics and market structure are things I know as an informed user rather than as a builder. I would be learning that from your team, quickly and with a lot of questions. The same applies to the two nice-to-haves: subscription economics and designed growth loops are not my background, and I would rather leave those rows empty than fill them with something adjacent. You say you encourage people to apply where they do not fully meet the listed requirements, especially if they are passionate about crypto. I am taking you at your word on that, with the gaps named rather than blurred.',
    },
    closing: {
      eyebrow: 'Why Kraken',
      heading:
        'The consumer surface is where crypto either earns trust or loses it',
      body: "Most of what makes crypto hard for ordinary people is not the technology, it is the interface — a flow that assumes you already know what you are doing, a number that appears without explanation, a moment of doubt at exactly the point where confidence matters most. Kraken Consumer is that surface for over 10 million people, letting them move between stocks, crypto and cash instantly. I have spent a career making complicated things feel obvious, most recently for retail traders with real money on the line, and I have been on the user's side of a crypto exchange often enough to know which parts still feel like they were designed for someone else. Add a full-stack team, a prototyping culture that matches how I already work, and a product where getting the details right is the whole job, and it is an unusually good fit for what I do well.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'English C2 · Italian B2 · German · Slovak',
        'Head of Product, algorithmic trading',
      ],
      signature:
        'Lukáš Hošala — nine years in product, and a retail trader myself.',
    },
  },

  de: {
    hero: {
      eyebrow: 'Kraken · Consumer Trading · Senior Product Manager',
      headlineLead:
        'Sie suchen jemanden, der mit Claude Code prototypt, bevor er Spezifikationen schreibt.',
      headlineGradient: 'Sie lesen gerade einen dieser Prototypen.',
      description:
        'Ich verantworte das Produkt bei einer Plattform für algorithmischen Handel, auf der Privatanleger eigenes Geld einsetzen — dieselben Nutzer und dieselben Einsätze wie bei Kraken Consumer. Davor acht Jahre bei adidas mit Verantwortung für ein Produkt mit über 165 Millionen Nutzern. Ich halte Krypto und nutze Börsen wie Ihre, kenne den Consumer-Flow also als jemand, der ihn lebt, nicht als jemand, der darüber gelesen hat. Diese Seite gleicht das ehrlich mit der Rolle ab — einschließlich des Punktes, an dem Krypto etwas ist, das ich nutze, und nicht etwas, das ich gebaut habe.',
      chips: [
        'Retail-Trading-Produkt',
        'Consumer mit 165M+ Nutzern',
        'Claude Code · Cursor',
        'SQL & Experimente',
        'Krypto-Halter',
      ],
      stats: [
        { value: '8+', label: 'Jahre im Produktmanagement' },
        {
          value: '165M+',
          label: 'Nutzer auf dem Consumer-Produkt, das ich verantwortete',
        },
        {
          value: '55%',
          label: 'Schnellere Ladezeit beim Neuaufbau, den ich leitete',
        },
        { value: '13+', label: 'Geführte Personen, in 3 Ländern' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Die Rolle, im Detail',
      heading: 'Was Kraken sucht — und wo ich es schon gemacht habe',
      items: [
        {
          id: 'prototype',
          title: 'Selbst prototypen, bevor die Spezifikation geschrieben wird',
          body: 'Das ist die Zeile in Ihrer Ausschreibung, mit der ich nicht gerechnet hatte, und die ich am direktesten beantworten kann. Diese Website — sieben rollenspezifische Briefings, ein geo-gesteuertes Kampagnensystem mit eigenem Admin-Bereich und eine Analytics-Pipeline, die Bots klassifiziert — ist entstanden, indem ich Claude Code angeleitet habe. Das ist keine Demo: Sie ist ausgeliefert, instrumentiert, und als die Analytics automatisierten Traffic als echte Besucher zählte, habe ich es gefunden und behoben. Zuerst etwas Funktionierendes zu haben, ist der Weg, herauszufinden, ob eine Idee der Realität standhält; die Spezifikation entsteht danach mit dem Wissen, was tatsächlich stimmt.',
        },
        {
          id: 'deliver',
          title: 'Consumer-Trading-Initiativen ausliefern',
          body: 'Consumer-Features an Menschen auszuliefern, die nicht um Veränderung gebeten haben, ist die Arbeit, die ich am längsten mache. Bei Runtastic verantwortete ich ein Produkt mit über 165 Millionen Nutzern und leitete den Front-End-Neuaufbau, der die Ladezeit um 55% senkte — eine Consumer-Trading-App lebt oder stirbt genau an dieser Latenz. Und ich habe Releases verantwortet, bei denen Scheitern keine Option war: eine stufenweise Migration über drei Länder mit null Ausfallzeit für dieselben 165 Mio. Nutzer.',
        },
        {
          id: 'requirements',
          title: 'Anforderungen, Analyse und das Ergebnis wirklich testen',
          body: 'Spezifikationen mit Akzeptanzkriterien zu schreiben, gegen die gebaut werden kann, und die Lieferung dann daran zu prüfen, ist mein Tagesgeschäft und keine Phase. Das UAT mache ich dort selbst, wo es zählt, denn zwischen „umgesetzt" und „wie beabsichtigt umgesetzt" versickert das Vertrauen der Nutzer — und in einem Trading-Produkt kostet diese Lücke jemanden Geld statt nur Nerven.',
        },
        {
          id: 'analytics',
          title: 'Analytics und Experimente im Team verankern',
          body: 'Eine Organisation datengetrieben zu machen ist überwiegend ein Überzeugungsproblem, kein Werkzeugproblem. Bei Runtastic habe ich OKRs und Adoptions-KPIs gesetzt und an die Führungsebene berichtet und damit gesteuert statt dekoriert; der Anstieg der Nutzung um 30% auf einer 1-Mio.-€-Plattform kam vom Steuern über die Kennzahl statt von Anordnungen. Ich entscheide anhand von SQL, PowerBI und Google Analytics — und die Analytics dieser Seite habe ich selbst gebaut, inklusive des Teils, der sie daran hindert, mich anzulügen.',
        },
        {
          id: 'stakeholders',
          title: 'Stakeholder und die Kommunikation der Roadmap',
          body: 'Bei adidas habe ich Legal, Procurement, Branding, IT, Business und mehr als 50 globale Marktteams ausgerichtet — keines davon mir unterstellt — und über 13 Personen in drei Ländern geführt. Eine Roadmap Menschen zu vermitteln, die sie blockieren, aber nicht angewiesen werden können, ist eine eigene Fähigkeit, und sie ist das meiste, was ich seit neun Jahren tue.',
        },
        {
          id: 'ownership',
          title: 'Verantwortung, auch für die unglamouröse Kontinuität',
          body: 'Die Ausschreibung nennt die Zusammenarbeit mit Finance und Operations, damit der Betrieb läuft — der Teil der Produktarbeit, den niemand in den Lebenslauf schreibt. Ich habe eine Jahreslizenz über 1 Mio. € verantwortet und die operative Realität drumherum: Verlängerungen, Budget, die Fragen von Teams, deren Arbeit stillstand, wenn etwas ausfiel. Ein Produkt zu verantworten heißt, es auch an den langweiligen Tagen zu verantworten.',
        },
        {
          id: 'opportunities',
          title: 'Neue Produktchancen bewerten und vorschlagen',
          body: 'Ich bringe Vorschläge, statt auf sie zu warten: PlayerGrade existiert, weil ich ein lohnendes Problem gesehen und es ungefragt end-to-end gebaut habe — heute prägt es echte Transferentscheidungen eines Profivereins. Eine Chance zu bewerten und bereit zu sein, eine rohe Version zu bauen, um es herauszufinden, ist derselbe Instinkt, auf den Ihre Prototyping-Anforderung zielt.',
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Profilabgleich',
      heading: 'Wo ich passe, und wo nicht',
      panels: [
        {
          title: 'Was Kraken sucht',
          rows: [
            {
              requirement: 'Mindestens 4 Jahre Produktmanagement-Erfahrung',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Neun Jahre, vom Product Owner zum Head of Product, 2016 bis 2025.',
            },
            {
              requirement:
                'Vorerfahrung in Krypto, Trading oder Banking (Voraussetzung)',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Trading. Ich bin Head of Product einer Plattform für algorithmischen Handel, die Privatanleger mit eigenem Kapital nutzen. Das ist die Klausel, unter der ich qualifiziere — die ehrlichen Grenzen der Krypto-Hälfte stehen im Panel darunter.',
            },
            {
              requirement:
                'Erfahrung mit Retail-Produkten in Aktien, Kryptowährungen oder Derivaten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Eine Retail-Trading-Plattform ist mein aktuelles Produkt. Dieselben Nutzer wie Kraken Consumer, dieselbe Psychologie, dieselbe Konsequenz, wenn die Oberfläche jemanden um eine Nuance in die Irre führt.',
            },
            {
              requirement:
                'Gutes Verständnis des Retail-Trading-Umfelds und des Nutzerverhaltens',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Von beiden Seiten: Ich baue täglich für Privatanleger und bin selbst einer — ich halte Krypto und nutze Börsen wie Ihre, kenne also, wo der Consumer-Flow reibt und wo er Vertrauen schafft.',
            },
            {
              requirement:
                'Sicher im Prototyping mit KI-Werkzeugen (Claude Code, Cursor)',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Sie lesen gerade den Beleg. Diese Seite und alles dahinter — sieben Briefings, ein Kampagnen-Adminbereich, eine Analytics-Pipeline — ist entstanden, indem ich Claude Code angeleitet habe, und läuft produktiv statt in einer Sandbox.',
            },
            {
              requirement:
                'Ausgeprägtes Produktgespür mit Blick für UX und Detailgenauigkeit',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Ich habe den Next.js/React-Neuaufbau des Runtastic-Front-Ends geleitet und die Ladezeit um 55% gesenkt, und ich gestalte und baue meine eigenen Oberflächen — diese eingeschlossen.',
            },
            {
              requirement:
                'Kompetenz in Datenerhebung und quantitativer Analyse (SQL, Visualisierung)',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'SQL, PowerBI und Google Analytics wöchentlich — und die Analytics dieser Seite habe ich von der Datenbank aufwärts selbst gebaut, samt Bot-Klassifikation, weil die Zahlen falsch waren und es sonst niemand bemerkt hätte.',
            },
            {
              requirement:
                'Lösungsorientiert, hoch motiviert, proaktiver Selbststarter',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'PlayerGrade war unaufgefordert. Der Neuaufbau dieser Seite ebenso. Ich bin am besten, wenn mir niemand gesagt hat, was das Nächste ist.',
            },
          ],
        },
        {
          title: 'Krypto, Skalierung & die Nice-to-haves',
          rows: [
            {
              requirement:
                'Krypto als Produkt, das man gebaut und nicht nur genutzt hat',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine ehrliche Grenze. Ich halte Krypto und nutze Börsen, und StagStrat ist blockchain-nah, aber ich habe kein Krypto-Produkt gebaut. Verwahrung, Listings, On-Chain-Mechanik und Marktstruktur verstehe ich als informierter Nutzer, nicht als jemand, der sie ausgeliefert hat.',
            },
            {
              requirement: 'Trading-Produkte in Börsengröße (10 Mio.+ Kunden)',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Meine Consumer-Größenordnung liegt bei über 165 Mio. Nutzern, aber im Fitness- und nicht im Finanzbereich; mein Trading-Produkt bewegt echtes Geld, ist aber deutlich kleiner als Kraken. Ich hatte beide Hälften, nie gleichzeitig.',
            },
            {
              requirement:
                'Abo-Produkte skalieren — Pricing, Feature-Gating, Churn',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Als Nice-to-have gelistet, und ich strecke mich nicht danach. Ich habe Lizenzökonomie von der Käuferseite bei 1 Mio. € im Jahr verantwortet, was nicht dasselbe ist wie eine Consumer-Abo-P&L.',
            },
            {
              requirement:
                'Product-Led Growth — Aktivierung, Retention, Monetarisierung',
              isMatch: false,
              tierLabel: 'Übertragbar',
              proof:
                'Ich habe Adoption hart getrieben — 100% bei einem Rollout über 50+ Marktteams, +30% nach Neupositionierung — aber über Enablement und Positionierung statt über gestaltete Growth-Loops.',
            },
            {
              requirement: 'Consumer-Produkte auf Mobile und Web in Größe',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Runtastic war genau das: ein Consumer-Produkt auf beidem, mit über 165 Mio. Nutzern, dessen Roadmap und Front-End-Neuaufbau ich verantwortet habe.',
            },
            {
              requirement:
                'Mit Finance und Operations für Kontinuität arbeiten',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Eine Jahreslizenz über 1 Mio. €, ihre Verlängerungen und ihr Budget, dazu die operativen Folgen, wann immer das Tooling unter mehr als 50 Marktteams streikte.',
            },
            {
              requirement: 'Ein Full-Stack-Team, das schnell und offen liefert',
              isMatch: true,
              tierLabel: 'Direkte Übereinstimmung',
              proof:
                'Head of Product in einer frühphasigen Fintech nach acht Jahren in einer Großorganisation. Ich habe das kleine, schnelle Ende bewusst gewählt und schreibe und liefere selbst Code, wenn das der schnellste Weg zu einer Antwort ist.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Der Prototyp',
      statusBadge: 'Diese Seite — entstanden mit Claude Code',
      heading:
        'Sie suchen jemanden, der mit KI prototypt, bevor er Spezifikationen schreibt. Diese Seite ist die Arbeitsprobe.',
      body: 'Ihre Ausschreibung nennt Claude Code und Cursor — ungewöhnlich genug, dass es verändert hat, was ich Ihnen schicke. Statt zu beschreiben, wie ich arbeite, ist dies die Arbeit. Diese Website ist eine Next.js-Anwendung, die ich durch Anleiten von Claude Code gebaut habe: sieben rollenspezifische Briefings wie dieses, ein geo-gesteuertes Kampagnensystem mit Adminbereich, damit ich Banner ohne Deployment starten und stoppen kann, und eine eigene Analytics-Pipeline auf Cloudflare D1. Sie ist ausgeliefert, instrumentiert, und sie hatte echte Fehler — zeitweise zählte die Analytics automatisierten Traffic als echte Besucher und blähte jede Zahl auf, also habe ich es gefunden, den Bot-Traffic klassifiziert und die Historie nachgezogen. Das ist der eigentliche Wert dieser Arbeitsweise, und es ist nicht Geschwindigkeit. Es ist, früh genug zu erfahren, was stimmt, um seine Meinung günstig zu ändern. Eine Spezifikation, die man nach einer laufenden Version schreibt, ist ein anderes Dokument als eine davor.',
      credentials: [
        'Diese Seite — Next.js, mit Claude Code gebaut',
        'Kampagnen-Adminbereich — ohne Deployment',
        'Analytics auf Cloudflare D1, mit Bot-Filter',
        'PlayerGrade — Python · FastAPI · Vertex AI',
      ],
      closingLine:
        'Sie können auf dieser Seite alles anklicken und prüfen, ob es hält. Das schien mir eine ehrlichere Antwort auf eine Prototyping-Anforderung als ein Aufzählungspunkt, der behauptet, ich erfülle sie.',
    },
    gap: {
      chip: 'Krypto, ehrlich gesagt',
      heading:
        'Ich qualifiziere über Trading, nicht über Krypto — und der Unterschied gehört benannt.',
      body: 'Ihre Anforderung lautet Krypto, Trading oder Banking, und meine ist eindeutig die mittlere: eine Retail-Trading-Plattform, auf der Menschen eigenes Kapital einsetzen und eine langsame oder irreführende Oberfläche sie Geld kostet. Das ist real und aktuell. Was ich nicht bin: jemand, der ein Krypto-Produkt gebaut hat. Ich halte Krypto und nutze Börsen, was mir die Consumer-Perspektive gibt und ein echtes Gefühl dafür, wo diese Abläufe verwirren — aber Verwahrung, Listings, On-Chain-Mechanik und Marktstruktur kenne ich als informierter Nutzer, nicht als Entwickler. Das würde ich von Ihrem Team lernen, schnell und mit vielen Fragen. Dasselbe gilt für die beiden Nice-to-haves: Abo-Ökonomie und gestaltete Growth-Loops sind nicht mein Hintergrund, und ich lasse diese Zeilen lieber leer, als sie mit etwas Benachbartem zu füllen. Sie schreiben, Sie ermutigen Bewerbungen auch dann, wenn nicht alle Anforderungen erfüllt sind — besonders bei Begeisterung für Krypto. Ich nehme Sie beim Wort, mit benannten statt verwischten Lücken.',
    },
    closing: {
      eyebrow: 'Warum Kraken',
      heading:
        'An der Consumer-Oberfläche gewinnt oder verliert Krypto sein Vertrauen',
      body: 'Das meiste, was Krypto für normale Menschen schwer macht, ist nicht die Technologie, sondern die Oberfläche — ein Ablauf, der voraussetzt, dass man schon weiß, was man tut, eine Zahl ohne Erklärung, ein Moment des Zweifels genau dort, wo Sicherheit am meisten zählt. Kraken Consumer ist diese Oberfläche für über 10 Millionen Menschen und lässt sie sofort zwischen Aktien, Krypto und Bargeld wechseln. Ich habe eine Karriere damit verbracht, Kompliziertes selbstverständlich wirken zu lassen, zuletzt für Privatanleger mit echtem Geld im Spiel, und ich stand oft genug selbst auf der Nutzerseite einer Krypto-Börse, um zu wissen, welche Teile sich noch anfühlen, als wären sie für jemand anderen gemacht. Dazu ein Full-Stack-Team, eine Prototyping-Kultur, die zu meiner Arbeitsweise passt, und ein Produkt, bei dem die Details die ganze Arbeit sind.',
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Englisch C2 · Italienisch B2 · Deutsch · Slowakisch',
        'Head of Product, algorithmischer Handel',
      ],
      signature:
        'Lukáš Hošala — neun Jahre im Produkt, und selbst Privatanleger.',
    },
  },

  it: {
    hero: {
      eyebrow: 'Kraken · Consumer Trading · Senior Product Manager',
      headlineLead:
        'Cercate qualcuno che prototipa con Claude Code prima di scrivere le specifiche.',
      headlineGradient: 'Ne state leggendo uno.',
      description:
        'Guido il prodotto in una piattaforma di trading algoritmico dove investitori retail mettono in gioco i propri soldi — gli stessi utenti e la stessa posta di Kraken Consumer. Prima, otto anni in adidas a gestire un prodotto usato da oltre 165 milioni di persone. Detengo criptovalute e uso exchange come il vostro, quindi conosco il flusso consumer da chi lo vive, non da chi ne ha letto. Questa pagina mette tutto a confronto con il ruolo, con onestà — compreso il punto in cui le cripto sono qualcosa che uso e non qualcosa che ho costruito.',
      chips: [
        'Prodotto di trading retail',
        'Consumer su scala 165M+',
        'Claude Code · Cursor',
        'SQL & sperimentazione',
        'Detentore di cripto',
      ],
      stats: [
        { value: '8+', label: 'Anni in product management' },
        {
          value: '165M+',
          label: 'Utenti sul prodotto consumer che ho gestito',
        },
        {
          value: '55%',
          label: 'Caricamento più rapido nella ricostruzione che ho guidato',
        },
        { value: '13+', label: 'Persone guidate, in 3 paesi' },
      ],
    },
    roleMapSection: {
      eyebrow: 'Il ruolo, punto per punto',
      heading: "Quello che Kraken cerca — e dove l'ho già fatto",
      items: [
        {
          id: 'prototype',
          title: 'Prototipare di persona prima di scrivere la specifica',
          body: "È la riga del vostro annuncio che non mi aspettavo, e quella a cui posso rispondere più direttamente. Questo sito — sette brief specifici per ruolo, un sistema di campagne geolocalizzate con il suo pannello di amministrazione e una pipeline di analytics che classifica i bot — è nato guidando Claude Code. Non è una demo: è in produzione, è strumentato, e quando le analytics hanno iniziato a contare traffico automatico come visitatori reali l'ho scoperto e corretto. Arrivare prima a qualcosa che funziona è il modo per scoprire se un'idea regge l'impatto con la realtà; la specifica si scrive dopo, sapendo cosa è davvero vero.",
        },
        {
          id: 'deliver',
          title: 'Rilasciare iniziative di Consumer Trading',
          body: "Rilasciare funzionalità consumer a persone che non hanno chiesto un cambiamento è il lavoro che faccio da più tempo. In Runtastic gestivo un prodotto usato da oltre 165 milioni di persone e ho guidato la ricostruzione del front-end che ha ridotto del 55% il tempo di caricamento — un'app di trading consumer vive o muore proprio su quella latenza. E ho gestito rilasci in cui fallire non era un'opzione: una migrazione a fasi su tre paesi con zero downtime per quegli stessi utenti.",
        },
        {
          id: 'requirements',
          title: 'Requisiti, analisi e verifica reale del risultato',
          body: 'Scrivere specifiche con criteri di accettazione abbastanza chiari da poterci costruire sopra, e poi verificare la delivery rispetto a essi, è la mia quotidianità e non una fase. Lo UAT lo faccio io dove conta, perché tra «implementato» e «implementato come previsto» è dove la fiducia degli utenti si disperde in silenzio — e in un prodotto di trading quel divario costa denaro a qualcuno, non un fastidio.',
        },
        {
          id: 'analytics',
          title: 'Diffondere analytics e sperimentazione',
          body: "Rendere un'organizzazione guidata dai dati è soprattutto un problema di persuasione, non di strumenti. In Runtastic ho definito e riportato OKR e KPI di adozione ai dirigenti, usandoli per guidare e non per decorare; il +30% di adozione su una piattaforma da 1 milione di euro è nato gestendo la metrica invece di imporre dall'alto. Decido su SQL, PowerBI e Google Analytics — e le analytics di questo sito le ho costruite io, compresa la parte che le impedisce di mentirmi.",
        },
        {
          id: 'stakeholders',
          title: 'Stakeholder e comunicazione della roadmap',
          body: 'In adidas ho allineato legal, procurement, branding, IT, business e oltre 50 team di mercato globali, nessuno dei quali rispondeva a me, e guidato oltre 13 persone in tre paesi. Comunicare una roadmap a chi può bloccarla ma non riceve ordini da te è una competenza specifica, ed è gran parte di ciò che faccio da nove anni.',
        },
        {
          id: 'ownership',
          title: 'Responsabilità, inclusa la continuità meno glamour',
          body: "L'annuncio chiede collaborazione con Finance e Operations per garantire la continuità: la parte del lavoro di prodotto che nessuno scrive nel CV. Ho gestito una licenza annuale da 1 milione di euro e la realtà operativa attorno — rinnovi, budget, le domande dei team il cui lavoro si fermava quando qualcosa si rompeva. Gestire un prodotto significa gestirlo anche nei giorni noiosi.",
        },
        {
          id: 'opportunities',
          title: 'Valutare e proporre nuove opportunità di prodotto',
          body: "Porto proposte invece di aspettarle: PlayerGrade esiste perché ho visto un problema che valeva la pena risolvere e l'ho costruito end-to-end senza che me lo chiedessero, e oggi orienta vere decisioni di mercato in un club professionistico. Valutare un'opportunità ed essere disposti a costruirne una versione grezza per scoprirlo è lo stesso istinto a cui punta il vostro requisito sul prototipare.",
        },
      ],
    },
    profileMatchSection: {
      eyebrow: 'Corrispondenza con il profilo',
      heading: 'Dove corrispondo, e dove no',
      panels: [
        {
          title: 'Quello che Kraken cerca',
          rows: [
            {
              requirement: 'Almeno 4 anni di esperienza in product management',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Nove anni, da Product Owner a Head of Product, dal 2016 al 2025.',
            },
            {
              requirement:
                'Esperienza pregressa in cripto, trading o banking (requisito)',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Trading. Sono Head of Product di una piattaforma di trading algoritmico usata da investitori retail con il proprio capitale. È la clausola con cui qualifico — i limiti onesti sulla metà cripto sono nel pannello sotto.',
            },
            {
              requirement:
                'Esperienza nel costruire prodotti retail su azioni, criptovalute o derivati',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Una piattaforma di trading retail è il mio prodotto attuale. Stesso utente di Kraken Consumer, stessa psicologia, stessa conseguenza quando l’interfaccia fuorvia qualcuno di poco.',
            },
            {
              requirement:
                'Buona comprensione del panorama del trading retail e del comportamento degli utenti',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Da entrambi i lati: costruisco per investitori retail ogni giorno e lo sono io stesso — detengo cripto e uso exchange come il vostro, quindi so dove il flusso consumer attrita e dove costruisce fiducia.',
            },
            {
              requirement:
                'A proprio agio nel prototipare con strumenti AI (Claude Code, Cursor)',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'State leggendo la prova. Questo sito e tutto ciò che c’è dietro — sette brief, un pannello di amministrazione delle campagne, una pipeline di analytics — è nato guidando Claude Code, ed è in produzione e non in una sandbox.',
            },
            {
              requirement:
                'Forte senso del prodotto, con occhio per la UX e cura del dettaglio',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Ho guidato la ricostruzione Next.js/React del front-end di Runtastic, riducendo del 55% il tempo di caricamento, e progetto e costruisco le mie interfacce — questa compresa.',
            },
            {
              requirement:
                'Competenza nella raccolta dati e nell’analisi quantitativa (SQL, visualizzazione)',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'SQL, PowerBI e Google Analytics ogni settimana — e le analytics di questo sito le ho costruite dal database in su, inclusa la classificazione dei bot, perché i numeri erano sbagliati e non se ne sarebbe accorto nessun altro.',
            },
            {
              requirement:
                'Orientato alla soluzione, molto motivato, proattivo',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'PlayerGrade è nato senza che me lo chiedessero. Anche la ricostruzione di questo sito. Do il meglio quando nessuno mi ha detto qual è la prossima cosa.',
            },
          ],
        },
        {
          title: 'Cripto, scala e i nice-to-have',
          rows: [
            {
              requirement: 'Cripto come prodotto costruito, non solo usato',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'Il mio limite onesto. Detengo cripto e uso exchange, e StagStrat è adiacente alla blockchain, ma non ho costruito un prodotto cripto. Custodia, listing, meccaniche on-chain e struttura di mercato le capisco da utente informato, non da chi le ha rilasciate.',
            },
            {
              requirement:
                'Prodotti di trading su scala exchange (oltre 10 milioni di clienti)',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                'La mia scala consumer è di oltre 165 milioni di utenti, ma nel fitness e non nella finanza; il mio prodotto di trading muove denaro vero ma è molto più piccolo di Kraken. Ho avuto entrambe le metà, mai insieme.',
            },
            {
              requirement:
                'Scalare prodotti in abbonamento — pricing, feature gating, churn',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Elencato tra i nice-to-have e non mi ci allungo. Ho gestito l'economia di una licenza dal lato di chi compra a 1 milione di euro l'anno, che non è lo stesso di un conto economico di abbonamenti consumer.",
            },
            {
              requirement:
                'Product-led growth — attivazione, retention, monetizzazione',
              isMatch: false,
              tierLabel: 'Trasferibile',
              proof:
                "Ho spinto forte sull'adozione — 100% su un rollout in oltre 50 team di mercato, +30% dopo il riposizionamento — ma tramite abilitazione e posizionamento, non tramite growth loop progettati.",
            },
            {
              requirement: 'Prodotti consumer su mobile e web su larga scala',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Runtastic era esattamente questo: un prodotto consumer su entrambi, usato da oltre 165 milioni di persone, con roadmap e ricostruzione del front-end sotto la mia responsabilità.',
            },
            {
              requirement:
                'Lavorare con Finance e Operations per la continuità',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Una licenza annuale da 1 milione di euro, i suoi rinnovi e il suo budget, più le conseguenze operative ogni volta che gli strumenti sotto oltre 50 team di mercato facevano i capricci.',
            },
            {
              requirement: 'Un team full-stack che rilascia in fretta',
              isMatch: true,
              tierLabel: 'Corrispondenza diretta',
              proof:
                'Head of Product in una fintech in fase iniziale dopo otto anni in una grande organizzazione. Ho scelto deliberatamente il lato piccolo e veloce, e scrivo e rilascio codice quando è la via più rapida a una risposta.',
            },
          ],
        },
      ],
    },
    spotlight: {
      chip: 'Il prototipo',
      statusBadge: 'Questa pagina — costruita guidando Claude Code',
      heading:
        'Cercate qualcuno che prototipa con l’AI prima di scrivere le specifiche. Questa pagina è il campione di lavoro.',
      body: "Il vostro annuncio nomina Claude Code e Cursor, cosa abbastanza insolita da cambiare ciò che vi mando. Invece di descrivere come lavoro, questo è il lavoro. Questo sito è un'applicazione Next.js che ho costruito guidando Claude Code: sette brief specifici per ruolo come questo, un sistema di campagne geolocalizzate con pannello di amministrazione per attivare e fermare i banner senza un deploy, e una pipeline di analytics su Cloudflare D1. È in produzione, è strumentata, e ha avuto bug veri — a un certo punto le analytics contavano il traffico automatico come visitatori reali gonfiando ogni numero, quindi l'ho trovato, ho classificato i bot e ho corretto lo storico. È questo il valore reale di lavorare così, e non è la velocità. È scoprire cosa è vero abbastanza presto da cambiare idea a basso costo. Una specifica scritta dopo aver avuto in mano una versione funzionante è un documento diverso da una scritta prima.",
      credentials: [
        'Questo sito — Next.js, costruito con Claude Code',
        'Pannello campagne — senza deploy',
        'Analytics su Cloudflare D1, con filtro bot',
        'PlayerGrade — Python · FastAPI · Vertex AI',
      ],
      closingLine:
        'Potete cliccare qualsiasi cosa su questo sito e vedere se regge. Mi è sembrata una risposta più onesta a un requisito sul prototipare che un punto elenco in cui dichiaro di soddisfarlo.',
    },
    gap: {
      chip: 'Cripto, con onestà',
      heading:
        'Qualifico tramite il trading, non tramite le cripto — e la differenza va detta.',
      body: "Il vostro requisito dice cripto, trading o banking, e il mio è chiaramente quello di mezzo: una piattaforma di trading retail dove le persone impegnano il proprio capitale e un'interfaccia lenta o fuorviante costa loro denaro. È reale ed è attuale. Quello che non sono è qualcuno che ha costruito un prodotto cripto. Detengo cripto e uso exchange, il che mi dà la prospettiva consumer e una percezione autentica di dove questi flussi confondono — ma custodia, listing, meccaniche on-chain e struttura di mercato le conosco da utente informato, non da costruttore. Le imparerei dal vostro team, in fretta e con molte domande. Lo stesso vale per i due nice-to-have: l'economia degli abbonamenti e i growth loop progettati non sono il mio percorso, e preferisco lasciare quelle righe vuote piuttosto che riempirle con qualcosa di adiacente. Scrivete che incoraggiate a candidarsi anche senza soddisfare tutti i requisiti, soprattutto con passione per le cripto. Vi prendo in parola, con le lacune dette invece che sfumate.",
    },
    closing: {
      eyebrow: 'Perché Kraken',
      heading:
        'È sulla superficie consumer che le cripto guadagnano o perdono fiducia',
      body: "Gran parte di ciò che rende le cripto difficili per le persone comuni non è la tecnologia, è l'interfaccia — un flusso che dà per scontato che tu sappia già cosa stai facendo, un numero che compare senza spiegazione, un momento di dubbio esattamente dove la sicurezza conta di più. Kraken Consumer è quella superficie per oltre 10 milioni di persone, che permette di passare istantaneamente tra azioni, cripto e contanti. Ho passato una carriera a rendere ovvio ciò che è complicato, da ultimo per investitori retail con soldi veri in gioco, e sono stato dal lato utente di un exchange abbastanza spesso da sapere quali parti sembrano ancora progettate per qualcun altro. Aggiungete un team full-stack, una cultura del prototipare che coincide con come già lavoro, e un prodotto in cui azzeccare i dettagli è tutto il lavoro.",
      credentials: [
        'MBA Global — University of Derby',
        'CMI Level 7 Strategic Management',
        'Inglese C2 · Italiano B2 · Tedesco · Slovacco',
        'Head of Product, trading algoritmico',
      ],
      signature:
        'Lukáš Hošala — nove anni nel prodotto, e investitore retail io stesso.',
    },
  },
}
