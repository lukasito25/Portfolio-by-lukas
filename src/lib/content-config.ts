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
      badge:
        'Senior Product Manager • 8+ Years Experience • Based in Volterra, Italy',
      headline: ['Building Digital', 'Products', 'That Scale Globally'],
      subheadline:
        'Senior Product Manager with 8+ years of international experience leading digital transformation at adidas Digital Sports and fintech startups. Currently based in Volterra, Italy, leading cross-functional teams of up to 13 personnel to deliver products that serve 165M+ users globally.',
      metrics: [
        { value: '8+', label: 'Years Experience' },
        { value: '165M+', label: 'Users Reached' },
        { value: '13', label: 'Max Team Size' },
        { value: '4', label: 'Countries' },
      ],
    },
    competencies: [
      {
        title: 'Team Leadership & Management',
        description:
          'Leading cross-functional teams of up to 13 personnel including external freelancers across multiple locations and time zones.',
      },
      {
        title: 'Digital Product Development',
        description:
          'Full product lifecycle management from conception to launch, including website redesigns, admin portals, and mobile applications.',
      },
      {
        title: 'Agile Methodology',
        description:
          'Expert in agile development processes, sprint planning, and iterative product delivery across international teams.',
      },
      {
        title: 'Strategic Management',
        description:
          'MBA-level strategic thinking with Level 7 Diploma in Strategic Management and Leadership, driving business outcomes.',
      },
      {
        title: 'SEO & Marketing Integration',
        description:
          'Creating product roadmaps with integrated SEO optimization and marketing strategies for maximum reach and engagement.',
      },
      {
        title: 'Tech Stack Modernization',
        description:
          'Managing complex website redesigns on new technology stacks, rebranding initiatives, and technical migration projects.',
      },
    ],
    cta: {
      title: 'Ready to Build Something Amazing?',
      description:
        "Let's discuss how we can transform your product vision into reality. From strategy to execution, I bring the expertise to drive meaningful results.",
    },
  },
  about: {
    hero: {
      title: 'From Slovakia to Global Scale',
      description:
        "I'm Lukáš Hošala, a Senior Product Manager with 8+ years of international experience spanning digital sports, e-commerce, and fintech. Based in Volterra, Italy, I've led cross-functional teams of up to 13 personnel across multiple locations, delivering products that serve 165M+ users globally at companies like adidas Digital Sports (Runtastic) and algorithmic trading startup StagStrat.",
      quickStats: [
        { label: 'Years of Experience', value: '8+' },
        { label: 'Global Users Reached', value: '165M+' },
        { label: 'Max Team Size', value: '13' },
        { label: 'Countries Worked', value: '4' },
      ],
    },
    philosophy: {
      title: 'Leadership Philosophy',
      description:
        "From managing teams of 13 across multiple countries to serving 165M+ users globally, I've learned that great products come from empowered teams with clear vision. My approach combines agile methodology with strategic thinking and international perspective.",
      cards: [
        {
          title: 'International Team Leadership',
          description:
            'Leading cross-functional teams of up to 13 personnel across multiple locations and time zones. I focus on clear communication, cultural awareness, and agile methodologies to deliver world-class products.',
        },
        {
          title: 'Strategic Product Thinking',
          description:
            'MBA-level strategic management combined with hands-on product experience. I create comprehensive product roadmaps with integrated SEO optimization and marketing strategies for maximum business impact.',
        },
        {
          title: 'Global Scale Execution',
          description:
            'From startup to enterprise scale - delivering products that serve 165M+ users globally while managing complex technical migrations and maintaining zero downtime for critical business operations.',
        },
      ],
    },
    journey: {
      title: 'Professional Journey',
      positions: [
        {
          title: 'Senior Product Manager',
          company: 'Runtastic GmbH | adidas Digital Sports',
          period: '2022 - 2025',
          location: 'Salzburg, Austria',
          description:
            'Led comprehensive website redesign and technology stack migration for adidas Digital Sports. Managed cross-functional teams across multiple locations to deliver rebranded content, new tech stack, and integrated SEO marketing strategy serving 165M+ global users.',
          metrics: [
            { label: 'Global Users', value: '165M+' },
            { label: 'Team Size', value: '13' },
            { label: 'Project Duration', value: '18mo' },
            { label: 'Downtime', value: 'Zero' },
          ],
        },
        {
          title: 'Head of Product',
          company: 'StagStrat | Algorithmic Trading Startup',
          period: '2022 - Present',
          location: 'Remote (Colorado, USA)',
          description:
            'Orchestrating development and product lifecycle of algorithmic trading platform. Created comprehensive product roadmap, launched complete website, and implemented SEO optimization plan for revolutionary trading solutions in the fintech space.',
        },
        {
          title: 'Product Manager',
          company: 'adidas International Marketing B.V.',
          period: '2019 - 2022',
          location: 'Amsterdam, Netherlands',
          description:
            'Led development teams of up to 13 personnel including external freelancers. Managed multiple products including third-party tool Sprinklr and in-house developed social commerce engine (adiSCom) for global e-commerce operations.',
        },
        {
          title: 'Education & Foundations',
          company: 'Strategic Management & Sport Management',
          period: '2015 - 2019',
          location: 'Multiple Locations',
          description:
            "MBA-level strategic management education with Level 7 Diploma in Strategic Management and Leadership. Bachelor's degree in Sport Management, building the foundation for digital sports and product management expertise.",
          metrics: [
            { label: 'MBA Level', value: 'L7' },
            { label: 'Strategic Mgmt', value: 'Diploma' },
            { label: 'Sport Mgmt', value: 'Bachelor' },
          ],
        },
      ],
    },
  },
  blog: {
    hero: {
      title: 'Insights from the Field',
      description:
        'Real stories and lessons learned from 8+ years managing international teams at adidas Digital Sports and fintech startups. Currently based in Volterra, Italy, sharing insights from leading teams of 13 across four countries while serving 165M+ users globally.',
    },
    featured: {
      title:
        'From Volterra to Global Impact: Managing International Teams Across Four Countries',
      description:
        'Real insights from my experience leading cross-functional teams of up to 13 personnel at adidas Digital Sports while based in Volterra, Italy. From managing external freelancers to coordinating complex website redesigns across Austria, Netherlands, Colorado, and Italy while serving 165M+ users globally.',
      keyInsights: [
        'Communication strategies across four countries and multiple time zones',
        'Managing cultural differences in distributed teams',
        'Coordinating complex technical migrations with zero downtime',
        'Building trust and accountability from a remote Italian hilltop town',
      ],
    },
    articles: [
      {
        title:
          'From Slovakia to Volterra: My Journey in International Product Management',
        description:
          'How I went from Sport Management graduate to leading international product teams at adidas Digital Sports serving 165M+ users, now based in medieval Tuscany.',
        content:
          "After leading teams across four countries from Slovakia to my current base in Volterra, Italy, I've learned that great collaboration isn't about processes—it's about people and cultural understanding. Here's how to build international teams that move fast and build together.",
        date: 'January 8, 2025',
        readTime: '6 min read',
        tags: ['Leadership', 'International Teams'],
      },
      {
        title:
          'Building StagStrat: From Concept to Algorithmic Trading Platform',
        description:
          'The journey of creating a fintech startup from scratch as Head of Product, including roadmap development and go-to-market strategy.',
        content:
          "As Head of Product at StagStrat, I orchestrated the complete product lifecycle of an algorithmic trading platform. From initial concept to production launch, here's how we built a revolutionary trading solution.",
        date: 'December 1, 2024',
        readTime: '10 min read',
        tags: ['FinTech', 'Startup'],
      },
      {
        title: 'Zero Downtime Migration: Lessons from adidas Digital Sports',
        description:
          'How we migrated a platform serving 165M+ users to a new tech stack without a single minute of downtime.',
        content:
          "Leading the technical migration of the Runtastic website while serving 165M+ global users taught me that successful migrations aren't about the technology—they're about risk management and team coordination.",
        date: 'November 24, 2024',
        readTime: '6 min read',
        tags: ['Tech Migration', 'Risk Management'],
      },
      {
        title: 'Managing External Teams: Insights from Leading 13 Personnel',
        description:
          'Real strategies for coordinating external freelancers and internal teams across multiple locations and time zones.',
        content:
          "At adidas, I managed teams of up to 13 personnel including external freelancers across multiple locations. Here's what I learned about building trust, maintaining quality, and delivering complex projects with distributed teams.",
        date: 'November 17, 2024',
        readTime: '9 min read',
        tags: ['Team Management', 'Remote Work'],
      },
    ],
    expertise: {
      title: 'Areas of Expertise',
      areas: [
        {
          title: 'International Team Leadership',
          description: 'Leading 13+ personnel across multiple countries',
        },
        {
          title: 'Digital Sports & E-commerce',
          description: '8+ years at adidas Digital Sports',
        },
        {
          title: 'FinTech & Algorithmic Trading',
          description: 'Head of Product at StagStrat startup',
        },
        {
          title: 'Tech Stack Migration',
          description: 'Zero downtime migrations for 165M+ users',
        },
        {
          title: 'SEO & Marketing Integration',
          description: 'Product roadmaps with marketing strategy',
        },
        {
          title: 'Agile & Strategic Management',
          description: 'MBA + Level 7 Strategic Management',
        },
      ],
    },
  },
  work: {
    hero: {
      title: 'Building Products That Scale Globally',
      description:
        '8+ years of international product management experience delivering digital solutions that serve millions of users globally, from my base in Volterra, Italy to teams across four countries.',
    },
    featured: {
      title: 'adidas Runtastic Website Redesign: Serving 165M+ Global Users',
      challenge:
        'Leading a comprehensive website redesign and technology stack migration for adidas Digital Sports while maintaining zero downtime for 165M+ active users across multiple countries and languages, coordinating from Volterra, Italy.',
      solution:
        'Orchestrated cross-functional teams of 13 personnel across Austria, Netherlands, and remote locations, implementing agile methodologies and strategic project management to deliver rebranded content, new technology stack, and integrated SEO marketing strategy.',
      impact:
        'Successfully migrated 165M+ users to new platform with zero downtime, improved site performance by 40%, and enhanced user experience across 15+ countries while maintaining business continuity from a medieval Tuscan hilltop town.',
    },
    professionalProjects: {
      title: 'Professional Projects',
      subtitle: 'Enterprise-scale products serving millions of users globally',
      projects: [
        {
          title: 'adidas Runtastic Website Redesign',
          description:
            'Led comprehensive website redesign and technology stack migration for adidas Digital Sports, serving 165M+ global users with zero downtime while coordinating from Volterra, Italy.',
          technologies: [
            'Next.js',
            'TypeScript',
            'React',
            'Node.js',
            'AWS',
            'Docker',
          ],
          metrics: [
            { label: 'Global Users', value: '165M+' },
            { label: 'Team Size', value: '13' },
            { label: 'Downtime', value: 'Zero' },
            { label: 'Performance', value: '+40%' },
          ],
        },
        {
          title: 'adidas Internal Admin Portal',
          description:
            'Product lifecycle management for internal administration portal, streamlining operations across international teams and multiple locations.',
          technologies: [
            'Angular',
            'Java',
            'Spring Boot',
            'MySQL',
            'Redis',
            'Jenkins',
          ],
          metrics: [
            { label: 'Internal Users', value: '1000+' },
            { label: 'Efficiency Gain', value: '+45%' },
            { label: 'Global Reach', value: '25+' },
          ],
        },
        {
          title: 'Social Commerce Engine (adiSCom)',
          description:
            'Product management for in-house social commerce engine and Sprinklr integration at adidas, managing teams of 13 personnel across multiple countries.',
          technologies: [
            'Vue.js',
            'Node.js',
            'GraphQL',
            'MongoDB',
            'Sprinklr API',
            'AWS',
          ],
          metrics: [
            { label: 'Social Platforms', value: '10+' },
            { label: 'Team Management', value: '13' },
            { label: 'Integration Success', value: '100%' },
          ],
        },
      ],
    },
    personalProjects: {
      title: 'Entrepreneurial Ventures',
      subtitle: 'Fintech startups and algorithmic trading solutions',
      projects: [
        {
          title: 'StagStrat Algorithmic Trading Platform',
          description:
            'Head of Product for fintech startup, orchestrating complete product lifecycle from concept to production launch. Revolutionary algorithmic trading platform with advanced risk management.',
          technologies: [
            'React',
            'Python',
            'FastAPI',
            'PostgreSQL',
            'WebSocket',
            'Docker',
          ],
          metrics: [
            { label: 'Platform Launch', value: '100%' },
            { label: 'Product Strategy', value: 'Full' },
            { label: 'Time to Market', value: '12mo' },
          ],
        },
      ],
    },
  },
}
