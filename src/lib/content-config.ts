export interface SiteContent {
  homepage: {
    hero: {
      badge: string
      headline: string[]
      subheadline: string
      metrics: {
        value: string
        label: string
      }[]
    }
    competencies: {
      title: string
      description: string
    }[]
    cta: {
      title: string
      description: string
    }
  }
  about: {
    hero: {
      title: string
      description: string
      quickStats: {
        label: string
        value: string
      }[]
    }
    philosophy: {
      title: string
      description: string
      cards: {
        title: string
        description: string
      }[]
    }
    journey: {
      title: string
      positions: {
        title: string
        company: string
        period: string
        location: string
        description: string
        metrics?: {
          label: string
          value: string
        }[]
      }[]
    }
  }
  blog: {
    hero: {
      title: string
      description: string
    }
    featured: {
      title: string
      description: string
      keyInsights: string[]
    }
    articles: {
      title: string
      description: string
      content: string
      date: string
      readTime: string
      tags: string[]
    }[]
    expertise: {
      title: string
      areas: {
        title: string
        description: string
      }[]
    }
  }
  work: {
    hero: {
      title: string
      description: string
    }
    featured: {
      title: string
      challenge: string
      solution: string
      impact: string
    }
    playergrade: {
      title: string
      tagline: string
      description: string
      status: string
      url: string
      challenge: string
      solution: string
      impact: string
      technologies: string[]
      metrics: {
        label: string
        value: string
      }[]
    }
    professionalProjects: {
      title: string
      subtitle: string
      projects: {
        title: string
        description: string
        technologies: string[]
        metrics: {
          label: string
          value: string
        }[]
      }[]
    }
    personalProjects: {
      title: string
      subtitle: string
      projects: {
        title: string
        description: string
        technologies: string[]
        metrics: {
          label: string
          value: string
        }[]
      }[]
    }
  }
}

export const defaultContent: SiteContent = {
  homepage: {
    hero: {
      badge: 'Senior Product Manager & Founder • 8+ Years • Italy, EU',
      headline: ['Product Manager.', 'Team Builder.', 'Occasional Founder.'],
      subheadline:
        "I've spent 8+ years at adidas helping teams ship digital products that actually work. Led teams of up to 13 people across three countries, managed products used by over 165 million people, and recently started building my own things on the side.",
      metrics: [
        { value: '8+', label: 'Years in product' },
        { value: '165M+', label: 'Users on products I owned' },
        { value: '13', label: 'Largest team I managed' },
        { value: '3', label: 'Countries worked in' },
      ],
    },
    competencies: [
      {
        title: 'Working with teams across time zones',
        description:
          "Managed teams spread across Colombia, Netherlands, Germany and the UK. Most of what I've learned about good product work came from making that collaboration actually function.",
      },
      {
        title: 'Taking products from idea to live',
        description:
          "From the first backlog item to launch day — I've run the full cycle on website redesigns, internal tools, social commerce platforms, and trading software.",
      },
      {
        title: 'Agile without the religion',
        description:
          "I use Agile because it works, not because it's required. Sprint planning, backlog management, and iterative delivery — applied practically, adapted to the team.",
      },
      {
        title: 'Strategy grounded in real decisions',
        description:
          'MBA from University of Derby and a CMI Level 7 diploma. Useful when it matters — helps me think through tradeoffs and communicate clearly with leadership.',
      },
      {
        title: 'SEO as part of product, not an afterthought',
        description:
          "Built SEO planning into product roadmaps at adidas and at StagStrat. It's much easier when it's baked in from the start rather than bolted on at the end.",
      },
      {
        title: 'Tech migrations without the drama',
        description:
          'Ran a full Next.js/React migration on a platform with 165M users. Zero downtime. The key was planning, clear ownership, and not trying to do too much at once.',
      },
    ],
    cta: {
      title: 'Want to work together?',
      description:
        "I'm open to senior PM roles, advisory work, and interesting product conversations. If you've got something worth building, I'd like to hear about it.",
    },
  },
  about: {
    hero: {
      title: 'Eight years at adidas. Now building my own things.',
      description:
        "I'm Lukáš — a product manager based in Volterra, Italy. Most of my career has been at adidas, where I worked across digital sports, social commerce, and internal tools. I managed teams of up to 13 people across three countries and worked on products that reached over 165 million users. I hold an MBA from the University of Derby and a UEFA A coaching licence, which led me to building PlayerGrade — a scouting platform for football clubs. I care about clear thinking, honest communication, and shipping things that actually solve problems.",
      quickStats: [
        { label: 'Years in product', value: '8+' },
        { label: 'Users on products I owned', value: '165M+' },
        { label: 'Largest team managed', value: '13' },
        { label: 'Countries worked in', value: '3' },
      ],
    },
    philosophy: {
      title: 'How I think about product work',
      description:
        "I don't have a philosophy I can fit on a slide. But after eight years of working with teams in different countries, here are the things I keep coming back to.",
      cards: [
        {
          title: 'Clear beats clever',
          description:
            "Most product problems aren't solved by clever frameworks — they're solved by making sure everyone understands what we're doing and why. I spend a lot of time on alignment before I spend time on execution.",
        },
        {
          title: 'Strategy only works when it connects to the work',
          description:
            "An MBA helps me think at the right level when talking to leadership. But I've seen plenty of strategy decks that never touched the actual product. I try to keep the two connected.",
        },
        {
          title: 'Scale comes from boring foundations',
          description:
            "Running a zero-downtime migration for 165M users wasn't exciting — it was a lot of careful planning, staged rollouts, and clear ownership. The exciting part was that nothing broke.",
        },
      ],
    },
    journey: {
      title: 'Work history',
      positions: [
        {
          title: 'Founder & Head of Product',
          company: 'PlayerGrade | Football Scouting SaaS',
          period: '2026 - Present',
          location: 'Remote',
          description:
            "Built and launched PlayerGrade as sole founder — a scouting platform for football clubs that scores and compares players using a position-calibrated engine. Currently in beta with 4 clubs across Central & Eastern Europe, 395 players profiled. My UEFA A coaching licence made this feel like a natural project: I know what scouts actually need because I've done the work.",
          metrics: [
            { label: 'Live club tenants', value: '4' },
            { label: 'Players profiled', value: '395' },
            { label: 'Scoring engine version', value: 'v6' },
            { label: 'Status', value: 'Beta' },
          ],
        },
        {
          title: 'Senior Product Manager',
          company: 'StagStrat | Algorithmic Trading Startup',
          period: '2025 - Present',
          location: 'Remote (Leeds, UK)',
          description:
            'Running product for an algorithmic trading platform aimed at institutional investors. Owns the full product lifecycle — roadmap, backlog, release planning. Built and launched the company website with an SEO strategy that brought in 40% more organic traffic. Cut feature lead time by 80% by simplifying how we prioritise and scope work.',
          metrics: [
            { label: 'Feature lead time reduction', value: '80%' },
            { label: 'Organic traffic growth', value: '+40%' },
          ],
        },
        {
          title: 'Senior Product Manager',
          company: 'Runtastic GmbH | adidas Digital Sports',
          period: '2022 - 2025',
          location: 'Vienna, Austria',
          description:
            "Led the website redesign and tech stack migration for Runtastic — a fitness platform with over 165 million users. The team was spread across Colombia, Netherlands, and Germany, which meant most of my job was coordination and keeping things moving. We migrated to Next.js and React, improved page load speed by 55%, and kept the platform running throughout. Also managed the lifecycle of adidas's internal admin application, used by 1000+ people across the organisation.",
          metrics: [
            { label: 'Global users', value: '165M+' },
            { label: 'Team size', value: '10+' },
            { label: 'Page load improvement', value: '+55%' },
            { label: 'Downtime during migration', value: 'Zero' },
          ],
        },
        {
          title: 'Product Manager',
          company: 'adidas International Marketing B.V.',
          period: '2019 - 2022',
          location: 'Amsterdam, Netherlands',
          description:
            'Managed a team of 13, including external freelancers, across product delivery and stakeholder work. Responsible for Sprinklr (a €1M annual licence) and the in-house social commerce platform (adiSCom), which processed over 500K monthly interactions. Improved platform adoption by 30% by reworking the onboarding flow and customer support model.',
          metrics: [
            { label: 'Team size', value: '13' },
            { label: 'Monthly interactions', value: '500K+' },
            { label: 'Platform adoption increase', value: '+30%' },
            { label: 'Sprinklr licence value', value: '€1M/yr' },
          ],
        },
        {
          title: 'Product Owner',
          company: 'adidas International Marketing B.V.',
          period: '2016 - 2019',
          location: 'Amsterdam, Netherlands',
          description:
            'Started as an intern and became Product Owner within 18 months. Delivered a Product Information Management (PIM) tool with an external dev team — on schedule, with 100% adoption on day one. Also managed the social media tool ecosystem (Sprinklr, Facebook Business Manager, Instagram) for 50+ market teams globally.',
          metrics: [
            { label: 'Speed to market improvement', value: '+70%' },
            { label: 'PIM adoption at launch', value: '100%' },
            { label: 'Time from intern to PO', value: '18 months' },
            { label: 'Market teams supported', value: '50+' },
          ],
        },
      ],
    },
  },
  blog: {
    hero: {
      title: "Things I've written down",
      description:
        "Notes on product management, leading distributed teams, and building things from scratch. Mostly things I wish I'd read earlier in my career.",
    },
    featured: {
      title:
        'What working across three countries actually taught me about remote teams',
      description:
        "Leading teams in Colombia, Netherlands, and Germany at the same time sounds complicated — and it is. Here's what I actually learned, rather than what looks good on a slide.",
      keyInsights: [
        'Time zone gaps force you to write things down better',
        'Cultural differences in how people give feedback are real and matter',
        'Trust comes from delivery, not from meetings',
        'Over-communication early saves you from under-communication when it matters',
      ],
    },
    articles: [
      {
        title:
          'From sport management graduate to senior PM at adidas — how it actually happened',
        description:
          "I didn't plan any of this. Here's the honest version of how I ended up running products for one of the world's biggest fitness platforms.",
        content:
          "The path from studying sport management to leading product teams across three countries wasn't linear. Here's what I actually learned along the way.",
        date: 'January 8, 2025',
        readTime: '6 min read',
        tags: ['Career', 'Product management'],
      },
      {
        title:
          "Building StagStrat: what it's actually like to run product for a startup after working at a big company",
        description:
          'After six years at adidas, the pace and ambiguity of a startup felt very different. Some things are better. Some are harder.',
        content:
          "Moving from a structured enterprise environment to a two-person startup changes how you work in ways you don't expect.",
        date: 'December 1, 2024',
        readTime: '10 min read',
        tags: ['Startup', 'Fintech'],
      },
      {
        title: 'How we migrated a platform with 165M users and nothing broke',
        description:
          'A zero-downtime migration sounds impressive. The reality was mostly very careful planning and a lot of staged rollouts.',
        content:
          "The technical migration of the Runtastic platform taught me more about risk management than any course or certification I've taken.",
        date: 'November 24, 2024',
        readTime: '6 min read',
        tags: ['Tech migration', 'Risk management'],
      },
      {
        title: 'Managing freelancers and full-timers in the same team',
        description:
          'At adidas Amsterdam I managed 13 people, some employed, some contracted. Getting them to work as one team took more effort than I expected.',
        content:
          "The challenges of managing mixed teams aren't about the tools or processes — they're about expectation-setting and building shared context quickly.",
        date: 'November 17, 2024',
        readTime: '9 min read',
        tags: ['Team management', 'Remote work'],
      },
    ],
    expertise: {
      title: 'What I write about',
      areas: [
        {
          title: 'Managing distributed teams',
          description: 'Three countries, one team, real lessons',
        },
        {
          title: 'Product work at adidas',
          description: '8+ years across digital sports and e-commerce',
        },
        {
          title: 'Building a fintech startup',
          description: 'What changes when you go from PM to founder',
        },
        {
          title: 'Tech migrations done right',
          description: 'Zero downtime on 165M users — how we planned it',
        },
        {
          title: 'SEO as a product discipline',
          description: 'Building search strategy into the roadmap from day one',
        },
        {
          title: 'Agile in practice',
          description: 'What actually works vs. what looks good in a workshop',
        },
      ],
    },
  },
  work: {
    hero: {
      title: "Things I've built and shipped",
      description:
        'Eight years of product work, mostly at adidas, plus two ventures I started myself. Some of it was at scale, some of it was figuring things out from scratch.',
    },
    featured: {
      title:
        'Runtastic website redesign — migrating a platform used by 165M people',
      challenge:
        "Runtastic needed a full redesign and a new tech stack. The platform had over 165 million registered users and teams contributing from Colombia, Netherlands, and Germany. The constraint was simple: we couldn't break anything for existing users while rebuilding almost everything underneath them.",
      solution:
        'Led a cross-functional team of 10+ people using Agile, with product backlogs and sprint planning coordinated across three time zones. We migrated to Next.js and React in stages, with testing and rollback plans at every step. Stakeholder alignment across three countries was more work than the technical side.',
      impact:
        'Migration completed with zero downtime. Page load speed improved by 55%. The platform kept running without interruption for users across 15+ countries throughout the entire process.',
    },
    playergrade: {
      title: 'PlayerGrade',
      tagline:
        'Football scouting platform for clubs in Central & Eastern Europe',
      description:
        'I built PlayerGrade because I hold a UEFA A coaching licence and spent time doing performance analysis at club level — and I knew how broken the scouting workflow was for smaller clubs. Most teams were using spreadsheets and gut feel. PlayerGrade gives scouts a structured way to grade, compare, and shortlist players using a position-calibrated scoring engine. Currently in beta with 4 clubs across CEE.',
      status: 'Beta',
      url: 'https://playergrade.app/',
      challenge:
        "Smaller football clubs in CEE don't have the budget for tools like Wyscout. Their scouts rely on notebooks, spreadsheets, and memory. There was no lightweight, position-aware tool that could give them a consistent scoring framework without requiring expensive data subscriptions.",
      solution:
        "Built the platform from scratch as sole founder and PM. Designed a scoring engine (now on v6) that calibrates differently per position rather than using a one-size-fits-all model. Built multi-tenant architecture with DB-level isolation so clubs can't see each other's data. Added a shared Central & Eastern European player pool so clubs benefit from data they didn't have to collect themselves.",
      impact:
        '4 clubs onboarded in beta. 395 players profiled across the platform (239 private per club, 156 in the shared CEE pool). Scoring engine running natively across all 9 positions with 168 unit tests passing. The anchor tenant (MFK Ružomberok) is using it in their real scouting workflow.',
      technologies: [
        'React',
        'TypeScript',
        'Supabase',
        'PostgreSQL',
        'Tailwind CSS',
        'Lovable',
        'Row-Level Security',
        'Edge Functions',
      ],
      metrics: [
        { label: 'Live club tenants', value: '4' },
        { label: 'Players profiled', value: '395' },
        { label: 'Scoring engine version', value: 'v6' },
        { label: 'Positions calibrated', value: '9/9' },
        { label: 'Unit tests passing', value: '168/168' },
        { label: 'Shared CEE player pool', value: '156' },
      ],
    },
    professionalProjects: {
      title: 'Professional work',
      subtitle:
        'Products I managed at adidas across digital sports, e-commerce, and internal tools',
      projects: [
        {
          title: 'Runtastic website redesign',
          description:
            'Led the full redesign and tech stack migration of the Runtastic platform, a fitness app with 165M+ registered users. Teams were based in Colombia, Netherlands, and Germany. We moved to Next.js and React, ran the migration in stages, and kept everything live throughout. Managed the product backlog and sprint planning using Agile across three time zones.',
          technologies: [
            'Next.js',
            'TypeScript',
            'React',
            'Node.js',
            'AWS',
            'Docker',
          ],
          metrics: [
            { label: 'Users on the platform', value: '165M+' },
            { label: 'Page load improvement', value: '+55%' },
            { label: 'Team locations', value: '3 countries' },
            { label: 'Downtime during migration', value: 'Zero' },
          ],
        },
        {
          title: 'adidas internal admin application',
          description:
            'Managed the product lifecycle for the internal admin tool used by 1000+ people across the global adidas organisation. This was a less glamorous but important project — the kind of internal tooling that everyone relies on and nobody talks about until it breaks. Kept it stable, improved it incrementally, and managed the stakeholder communication across multiple business units.',
          technologies: [
            'Angular',
            'Java',
            'Spring Boot',
            'MySQL',
            'Redis',
            'Jenkins',
          ],
          metrics: [
            { label: 'Internal users', value: '1000+' },
            { label: 'Deployment scope', value: 'Global' },
            { label: 'Business units served', value: 'Multiple' },
            { label: 'Based in', value: 'Vienna, Austria' },
          ],
        },
        {
          title: 'Sprinklr & adiSCom social commerce platform',
          description:
            'Managed two products in parallel: Sprinklr (a €1M/year social media management licence) and adiSCom, an in-house social commerce engine we built internally. Led a team of 13, including external freelancers in different countries. The main challenge was getting adoption — we improved it by 30% by redesigning onboarding and rebuilding the customer support model from scratch.',
          technologies: [
            'Vue.js',
            'Node.js',
            'GraphQL',
            'MongoDB',
            'Sprinklr API',
            'Facebook Business Manager',
            'Instagram API',
          ],
          metrics: [
            { label: 'Sprinklr licence value', value: '€1M/yr' },
            { label: 'Monthly interactions', value: '500K+' },
            { label: 'Adoption increase', value: '+30%' },
            { label: 'Global market teams supported', value: '50+' },
          ],
        },
        {
          title: 'Product Information Management (PIM) tool',
          description:
            "Delivered a PIM tool with an external development team — my first major product as a Product Owner. We launched on schedule with 100% adoption on day one, which I'm still proud of. Also managed the broader social media tool ecosystem (Sprinklr, Facebook Business Manager, Instagram) for 50+ market teams. I went from intern to Product Owner in 18 months, which set the tone for everything that followed.",
          technologies: [
            'PIM systems',
            'Vendor management',
            'Facebook Business Manager',
            'Instagram API',
            'Sprinklr',
            'Enterprise integrations',
          ],
          metrics: [
            { label: 'Speed to market improvement', value: '+70%' },
            { label: 'Adoption at launch', value: '100%' },
            { label: 'Time from intern to PO', value: '18 months' },
            { label: 'Based in', value: 'Amsterdam, Netherlands' },
          ],
        },
      ],
    },
    personalProjects: {
      title: 'Side ventures',
      subtitle: 'Things I built outside of my day job',
      projects: [
        {
          title: 'StagStrat — algorithmic trading platform',
          description:
            'Running product for an algorithmic trading startup targeting institutional investors. Built the roadmap from scratch, launched the website, and cut feature lead time by 80% by tightening how we scope and prioritise work. Also ran the SEO strategy for the site, which grew organic traffic by 40%.',
          technologies: [
            'React',
            'Python',
            'FastAPI',
            'PostgreSQL',
            'WebSocket',
            'Docker',
          ],
          metrics: [
            { label: 'Feature lead time reduction', value: '80%' },
            { label: 'Organic traffic growth', value: '+40%' },
            { label: 'Ownership scope', value: 'Full product lifecycle' },
            { label: 'Based', value: 'Remote (Leeds, UK)' },
          ],
        },
      ],
    },
  },
}
