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
      badge: 'Senior Product Manager • 8+ Years Experience • Italy, EU',
      headline: ['Building Digital', 'Products', 'That Scale Globally'],
      subheadline:
        'Senior Product Manager with 8+ years of international experience leading digital transformation at adidas Digital Sports and fintech startups. Expert in leading cross-functional teams of up to 13 personnel across multiple locations and time zones to deliver products that serve 165M+ users globally.',
      metrics: [
        { value: '8+', label: 'Years Experience' },
        { value: '165M+', label: 'Users Reached' },
        { value: '13', label: 'Max Team Size' },
        { value: '3', label: 'Countries' },
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
        "I'm Lukáš Hošala, a Senior Product Manager with 8+ years of international experience spanning digital sports, e-commerce, and fintech. Currently based in Italy, I've led cross-functional teams of up to 13 personnel across multiple locations and time zones, delivering products that serve 165M+ users globally at companies like adidas Digital Sports (Runtastic) and algorithmic trading startup StagStrat.",
      quickStats: [
        { label: 'Years of Experience', value: '8+' },
        { label: 'Global Users Reached', value: '165M+' },
        { label: 'Max Team Size', value: '13' },
        { label: 'Countries Worked', value: '3' },
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
          period: '2025 - Present',
          location: 'Remote (Leeds, UK)',
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
        'Real stories and lessons learned from 8+ years managing international teams at adidas Digital Sports and fintech startups. Insights from leading teams of 13 across three countries while serving 165M+ users globally.',
    },
    featured: {
      title:
        'From Slovakia to Global Impact: Leading International Teams Across Three Countries',
      description:
        'Real insights from my experience leading cross-functional teams of up to 13 personnel at adidas Digital Sports. From managing external freelancers to coordinating complex website redesigns across Austria, Netherlands, and UK while serving 165M+ users globally.',
      keyInsights: [
        'Communication strategies across three countries and multiple time zones',
        'Managing cultural differences in distributed teams',
        'Coordinating complex technical migrations with zero downtime',
        'Building trust and accountability across distributed teams',
      ],
    },
    articles: [
      {
        title:
          'From Slovakia to Global Scale: My Journey in International Product Management',
        description:
          'How I went from Sport Management graduate to leading international product teams at adidas Digital Sports serving 165M+ users globally.',
        content:
          "After leading teams across three countries, I've learned that great collaboration isn't about location—it's about people and cultural understanding. Here's how to build international teams that move fast and build together.",
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
        '8+ years of international product management experience delivering digital solutions that serve millions of users globally, leading teams across three countries.',
    },
    featured: {
      title:
        'adidas Digital Sports: Global Platform Transformation Serving 165M+ Users',
      challenge:
        'Leading the most critical technology transformation in adidas Digital Sports history - migrating a platform serving 165+ million global users to a modern tech stack while maintaining zero downtime across multiple countries and languages. Required coordination across three international locations (Colombia, Netherlands, Germany) with diverse cultural and technical challenges while ensuring seamless user experience for millions of daily active users.',
      solution:
        'Orchestrated cross-functional teams of 10+ members using agile methodologies and strategic project management. Implemented Next.js and React technology migration with comprehensive testing and staged deployment approach. Developed integrated SEO marketing strategy while managing complex international stakeholder alignment and ensuring robust performance optimization throughout the transition.',
      impact:
        "Achieved zero-downtime migration for 165+ million users globally with remarkable 55% improvement in page load speed. Enhanced user experience across 15+ countries while maintaining seamless business continuity for one of the world's largest fitness platforms. Established new performance benchmarks and modern technical foundation for continued global expansion.",
    },
    professionalProjects: {
      title: 'Professional Projects',
      subtitle: 'Enterprise-scale products serving millions of users globally',
      projects: [
        {
          title: 'adidas Runtastic Website Redesign',
          description:
            "Spearheaded a critical technology transformation for one of the world's largest fitness platforms serving 165+ million users globally. Led cross-functional teams across three countries (Colombia, Netherlands, Germany) through a complete website redesign and modern tech stack migration using Next.js and React. Implemented agile methodologies and strategic project management to deliver zero-downtime deployment while significantly improving user experience and platform performance.",
          technologies: [
            'Next.js',
            'TypeScript',
            'React',
            'Node.js',
            'AWS',
            'Docker',
          ],
          metrics: [
            { label: 'Global Users Served', value: '165M+' },
            { label: 'Page Load Speed Improvement', value: '+55%' },
            { label: 'Cross-Country Teams', value: '3 Countries' },
            { label: 'Platform Downtime', value: 'Zero' },
          ],
        },
        {
          title: 'adidas Global Admin Application',
          description:
            'Managed the complete product lifecycle for a mission-critical internal administration platform serving 1000+ stakeholders across adidas global organization. Streamlined operations and governance processes for international teams spanning multiple business units and geographic regions. Built robust enterprise-grade solution using Java ecosystem with high availability and scalability requirements for global deployment.',
          technologies: [
            'Angular',
            'Java',
            'Spring Boot',
            'MySQL',
            'Redis',
            'Jenkins',
          ],
          metrics: [
            { label: 'Global Stakeholders', value: '1000+' },
            { label: 'Enterprise Deployment', value: 'Global Scale' },
            { label: 'Business Units Served', value: 'Multiple' },
            { label: 'Location', value: 'Salzburg, Austria' },
          ],
        },
        {
          title: 'Enterprise Social Commerce Platform & Sprinklr Integration',
          description:
            'Led product management for high-value enterprise initiatives including a 1 Million EUR annual Sprinklr license and in-house social commerce engine (adiSCom) processing 500K+ monthly interactions. Managed development teams of 13+ personnel including external freelancers, coordinating across multiple countries. Drove 30% increase in platform adoption through strategic onboarding improvements and enhanced customer care initiatives. Supported 50+ global market teams through integrated social media tool ecosystem.',
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
            { label: 'Platform License Value', value: '1M EUR' },
            { label: 'Monthly Interactions', value: '500K+' },
            { label: 'Platform Adoption Increase', value: '+30%' },
            { label: 'Global Market Teams', value: '50+' },
          ],
        },
        {
          title: 'Product Information Management (PIM) System',
          description:
            'Delivered enterprise-grade Product Information Management tool working with external development teams during rapid career progression from Intern to Product Owner within 18 months. Achieved remarkable 70% improvement in speed to market through streamlined product data workflows and enhanced operational efficiency. Successfully launched comprehensive PIM solution on schedule with 100% user adoption rate, managing global social media tool ecosystem supporting 50+ market teams across Facebook Business Manager, Instagram, and Sprinklr platforms.',
          technologies: [
            'PIM Systems',
            'External Vendor Management',
            'Facebook Business Manager',
            'Instagram API',
            'Sprinklr Platform',
            'Enterprise Integration',
          ],
          metrics: [
            { label: 'Speed to Market Improvement', value: '+70%' },
            { label: 'User Adoption Rate', value: '100%' },
            { label: 'Career Progression', value: '18 Months' },
            { label: 'Location', value: 'Amsterdam, Netherlands' },
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
            'Leading product development for a cutting-edge fintech startup targeting institutional investors. Owned complete product lifecycle from conception to production launch, establishing market credibility through strategic product roadmap and user-centric API integrations. Implemented SEO optimization strategy that significantly boosted organic visibility while streamlining development processes for maximum efficiency.',
          technologies: [
            'React',
            'Python',
            'FastAPI',
            'PostgreSQL',
            'WebSocket',
            'Docker',
          ],
          metrics: [
            { label: 'Lead Time Reduction', value: '80%' },
            { label: 'Organic Traffic Growth', value: '+40%' },
            { label: 'Product Lifecycle Ownership', value: 'End-to-End' },
            { label: 'Location', value: 'Remote (Leeds, UK)' },
          ],
        },
      ],
    },
  },
}
