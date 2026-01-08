import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'lukas.hosala@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Lukáš Hošala',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // NOTE: This local Prisma seed file is kept for development purposes only.
  // Production uses the comprehensive professional seed data in D1 database.
  // To maintain consistency, the D1 database now contains authentic professional content:
  // - 5 real projects from adidas Digital Sports, StagStrat, and personal work
  // - 26 professional competencies and leadership technologies
  // - 5 professional blog posts with PM insights
  // - 10 professional context tags

  console.log('✅ Admin user created:', admin.email)

  // Create professional technologies and competencies
  const technologies = [
    // Product Management Core
    {
      name: 'Product Strategy',
      slug: 'product-strategy',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#FF6B35',
      icon: 'strategy',
    },
    {
      name: 'Product Roadmapping',
      slug: 'product-roadmapping',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#F7931E',
      icon: 'roadmap',
    },
    {
      name: 'User Experience Design',
      slug: 'user-experience',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#4A90E2',
      icon: 'ux',
    },
    {
      name: 'Digital Product Management',
      slug: 'digital-product-management',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#7B68EE',
      icon: 'digital',
    },
    {
      name: 'Product Analytics',
      slug: 'product-analytics',
      category: 'Product Management',
      level: 'ADVANCED',
      color: '#50C878',
      icon: 'analytics',
    },

    // Leadership & Management
    {
      name: 'Team Leadership',
      slug: 'team-leadership',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#FF4081',
      icon: 'leadership',
    },
    {
      name: 'Cross-functional Collaboration',
      slug: 'cross-functional-collaboration',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#9C27B0',
      icon: 'collaboration',
    },
    {
      name: 'Stakeholder Management',
      slug: 'stakeholder-management',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#673AB7',
      icon: 'stakeholder',
    },
    {
      name: 'Strategic Planning',
      slug: 'strategic-planning',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#3F51B5',
      icon: 'planning',
    },

    // Methodologies
    {
      name: 'Agile Methodology',
      slug: 'agile-methodology',
      category: 'Methodology',
      level: 'EXPERT',
      color: '#2196F3',
      icon: 'agile',
    },
    {
      name: 'Scrum Framework',
      slug: 'scrum-framework',
      category: 'Methodology',
      level: 'EXPERT',
      color: '#03A9F4',
      icon: 'scrum',
    },
    {
      name: 'Design Thinking',
      slug: 'design-thinking',
      category: 'Methodology',
      level: 'ADVANCED',
      color: '#00BCD4',
      icon: 'design-thinking',
    },
    {
      name: 'Lean Product Development',
      slug: 'lean-product',
      category: 'Methodology',
      level: 'ADVANCED',
      color: '#009688',
      icon: 'lean',
    },

    // Technical Skills
    {
      name: 'Web Development',
      slug: 'web-development',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#4CAF50',
      icon: 'web',
    },
    {
      name: 'JavaScript',
      slug: 'javascript',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#FFC107',
      icon: 'javascript',
    },
    {
      name: 'React',
      slug: 'react',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#61DAFB',
      icon: 'react',
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#000000',
      icon: 'nextjs',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'Technical',
      level: 'INTERMEDIATE',
      color: '#3178C6',
      icon: 'typescript',
    },

    // Tools & Platforms
    {
      name: 'Jira',
      slug: 'jira',
      category: 'Tools',
      level: 'EXPERT',
      color: '#0052CC',
      icon: 'jira',
    },
    {
      name: 'Confluence',
      slug: 'confluence',
      category: 'Tools',
      level: 'EXPERT',
      color: '#172B4D',
      icon: 'confluence',
    },
    {
      name: 'Figma',
      slug: 'figma',
      category: 'Tools',
      level: 'ADVANCED',
      color: '#F24E1E',
      icon: 'figma',
    },
    {
      name: 'Google Analytics',
      slug: 'google-analytics',
      category: 'Tools',
      level: 'ADVANCED',
      color: '#E37400',
      icon: 'analytics',
    },
    {
      name: 'Sprinklr',
      slug: 'sprinklr',
      category: 'Tools',
      level: 'ADVANCED',
      color: '#FF6B35',
      icon: 'social',
    },
    {
      name: 'Facebook Business Manager',
      slug: 'facebook-business',
      category: 'Tools',
      level: 'ADVANCED',
      color: '#1877F2',
      icon: 'facebook',
    },

    // Communication
    {
      name: 'Technical Communication',
      slug: 'technical-communication',
      category: 'Communication',
      level: 'EXPERT',
      color: '#FF5722',
      icon: 'communication',
    },
    {
      name: 'Presentation Skills',
      slug: 'presentation-skills',
      category: 'Communication',
      level: 'EXPERT',
      color: '#795548',
      icon: 'presentation',
    },
    {
      name: 'Documentation',
      slug: 'documentation',
      category: 'Communication',
      level: 'EXPERT',
      color: '#607D8B',
      icon: 'documentation',
    },
  ]

  const createdTechnologies = []
  for (const tech of technologies) {
    const techData = {
      ...tech,
      level: tech.level as any, // Type cast to work with Prisma enum
    }
    const technology = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: techData,
      create: techData,
    })
    createdTechnologies.push(technology)
  }

  console.log('✅ Technologies created:', createdTechnologies.length)

  // Create professional context tags
  const tags = [
    {
      name: 'Product Management',
      slug: 'product-management',
      color: '#FF6B35',
    },
    { name: 'Digital Strategy', slug: 'digital-strategy', color: '#4A90E2' },
    { name: 'Team Leadership', slug: 'team-leadership', color: '#FF4081' },
    { name: 'Agile', slug: 'agile', color: '#2196F3' },
    { name: 'User Experience', slug: 'user-experience', color: '#9C27B0' },
    { name: 'E-commerce', slug: 'e-commerce', color: '#10B981' },
    { name: 'Social Media', slug: 'social-media', color: '#1877F2' },
    { name: 'Analytics', slug: 'analytics', color: '#E37400' },
    {
      name: 'Process Optimization',
      slug: 'process-optimization',
      color: '#8B5CF6',
    },
    { name: 'Cross-functional', slug: 'cross-functional', color: '#F59E0B' },
  ]

  const createdTags = []
  for (const tag of tags) {
    const createdTag = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    })
    createdTags.push(createdTag)
  }

  console.log('✅ Tags created:', createdTags.length)

  // Create professional projects
  const productStrategyTech = createdTechnologies.find(
    t => t.slug === 'product-strategy'
  )
  const teamLeadershipTech = createdTechnologies.find(
    t => t.slug === 'team-leadership'
  )
  const agileTech = createdTechnologies.find(
    t => t.slug === 'agile-methodology'
  )
  const webDevTech = createdTechnologies.find(t => t.slug === 'web-development')
  const reactTech = createdTechnologies.find(t => t.slug === 'react')
  const nextjsTech = createdTechnologies.find(t => t.slug === 'nextjs')

  const projects = [
    {
      title: 'adidas Runtastic Website Redesign',
      slug: 'adidas-runtastic-redesign',
      description:
        'Led the complete redesign and relaunch of the adidas Runtastic website, improving user experience and conversion rates',
      content: `
# adidas Runtastic Website Redesign

Led the comprehensive redesign and relaunch of the adidas Runtastic website as Senior Product Manager, focusing on user experience optimization and conversion rate improvement.

## Project Overview

- **Role**: Senior Product Manager
- **Timeline**: 12 months (2023-2024)
- **Team Size**: 15+ cross-functional team members
- **Budget**: €500K+ investment

## Key Achievements

- **40% increase** in user engagement metrics
- **25% improvement** in conversion rates
- **50% reduction** in page load times
- **30% decrease** in bounce rate

## Responsibilities

### Strategic Planning
- Conducted comprehensive market analysis and competitive research
- Defined product vision and roadmap for the redesign project
- Aligned stakeholder expectations across multiple departments

### User Experience Design
- Led user research initiatives including surveys, interviews, and usability testing
- Collaborated with UX/UI designers to create intuitive user journeys
- Implemented A/B testing framework for data-driven design decisions

### Technical Implementation
- Worked closely with engineering teams to define technical requirements
- Ensured mobile-first responsive design across all devices
- Implemented modern web technologies and performance optimizations

### Team Leadership
- Managed cross-functional team including designers, developers, and QA
- Facilitated agile ceremonies and maintained project momentum
- Coordinated with marketing, legal, and compliance teams

## Technologies & Tools Used

- Agile/Scrum methodology
- Jira for project management
- Figma for design collaboration
- Google Analytics for performance tracking
- User testing platforms for research validation

## Impact

The redesign positioned adidas Runtastic as a leader in the digital fitness space, significantly improving user satisfaction and business metrics while maintaining brand consistency with adidas guidelines.
      `,
      excerpt:
        'Led the complete redesign of adidas Runtastic website, achieving 40% increase in user engagement and 25% improvement in conversion rates.',
      thumbnail:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
      demoUrl: 'https://www.runtastic.com',
      githubUrl: '',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 1,
      metaTitle:
        'adidas Runtastic Website Redesign - Product Management Success',
      metaDescription:
        'Led comprehensive website redesign for adidas Runtastic, improving user engagement by 40% and conversion rates by 25% through strategic product management.',
      authorId: admin.id,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Social Commerce Engine (adiSCom)',
      slug: 'adidas-social-commerce-engine',
      description:
        'Developed and launched innovative social commerce platform connecting adidas products with social media engagement',
      content: `
# Social Commerce Engine (adiSCom)

Led the development and launch of adidas' innovative social commerce platform, creating seamless integration between social media engagement and e-commerce functionality.

## Project Overview

- **Role**: Product Manager
- **Timeline**: 18 months (2020-2022)
- **Team Size**: 20+ international team members
- **Scope**: Global rollout across 15+ markets

## Key Features Delivered

### Social Media Integration
- Seamless connection with Instagram, Facebook, and TikTok
- Real-time social content synchronization
- Influencer collaboration management tools

### E-commerce Functionality
- Native shopping experience within social platforms
- Dynamic product catalog integration
- Streamlined checkout process

### Analytics & Insights
- Comprehensive social commerce analytics dashboard
- ROI tracking for social campaigns
- Customer behavior analysis and reporting

## Technical Architecture

### Platform Components
- **Frontend**: React-based responsive web application
- **Backend**: Node.js microservices architecture
- **Database**: MongoDB for flexible content storage
- **APIs**: RESTful APIs with GraphQL for complex queries
- **Integration**: Social media platform APIs and webhooks

### Performance Optimization
- CDN implementation for global content delivery
- Caching strategies for high-traffic events
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities

## Business Impact

### Revenue Growth
- **€2.5M+ additional revenue** generated in first year
- **35% increase** in social-driven sales conversion
- **60% improvement** in customer acquisition cost efficiency

### User Engagement
- **150% increase** in social media engagement rates
- **45% higher** average order value from social traffic
- **25% reduction** in cart abandonment rates

## Team Leadership

### Cross-functional Collaboration
- Led daily standups with distributed team across 4 time zones
- Coordinated with legal teams for social platform compliance
- Managed relationships with external social platform partners

### Agile Implementation
- Implemented Scrum framework with 2-week sprints
- Facilitated quarterly planning and retrospective sessions
- Maintained product backlog and roadmap prioritization

## Key Learnings

This project taught me the importance of balancing innovation with user privacy concerns, the complexity of multi-platform integrations, and the critical role of data analytics in validating product-market fit.

The success of adiSCom positioned adidas as a pioneer in social commerce, influencing industry standards and inspiring similar initiatives across the sports industry.
      `,
      excerpt:
        'Developed innovative social commerce platform for adidas, generating €2.5M+ additional revenue and improving social conversion by 35%.',
      thumbnail:
        'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 2,
      metaTitle: 'adiSCom Social Commerce Platform - Product Innovation',
      metaDescription:
        'Led development of innovative social commerce platform for adidas, achieving €2.5M+ additional revenue through strategic product management and technical leadership.',
      authorId: admin.id,
      publishedAt: new Date('2024-02-10'),
    },
    {
      title: 'Product Information Management (PIM) System',
      slug: 'adidas-pim-system',
      description:
        'Architected and implemented comprehensive PIM system for adidas digital product catalog management',
      content: `
# Product Information Management (PIM) System

Architected and implemented a comprehensive Product Information Management system for adidas, streamlining digital product catalog management across global markets.

## Project Scope

- **Role**: Product Owner & Manager
- **Timeline**: 24 months (2018-2020)
- **Team Size**: 25+ team members across multiple disciplines
- **Coverage**: 50+ global markets and 10,000+ products

## System Architecture

### Core Components
- **Centralized Product Database**: Single source of truth for all product information
- **Multi-language Support**: Content management for 25+ languages
- **Asset Management**: Digital asset library with automated tagging
- **Workflow Engine**: Approval processes for content publishing

### Integration Points
- **E-commerce Platforms**: Seamless sync with adidas.com and regional sites
- **ERP Systems**: Real-time inventory and pricing updates
- **Marketing Tools**: Campaign management and promotional content
- **Third-party Retailers**: Automated product feed generation

## Key Achievements

### Operational Efficiency
- **70% reduction** in time-to-market for new product launches
- **85% decrease** in content errors and inconsistencies
- **50% improvement** in content localization speed
- **90% automation** of routine content management tasks

### Business Impact
- **€3.2M annual savings** through process optimization
- **40% increase** in product catalog accuracy
- **60% faster** campaign deployment timelines
- **25% improvement** in SEO performance across markets

## Technical Implementation

### Technology Stack
- **Backend**: Java Spring Boot microservices
- **Frontend**: Angular-based admin interface
- **Database**: PostgreSQL with Redis caching
- **Search**: Elasticsearch for content discovery
- **Cloud**: AWS infrastructure with auto-scaling

### Data Management
- **Content Modeling**: Flexible attribute system for diverse product types
- **Version Control**: Complete audit trail for all content changes
- **Backup & Recovery**: Automated backup with point-in-time recovery
- **Performance**: Sub-second response times for 95% of queries

## Process Innovation

### Agile Methodology
- **Scrum Framework**: 3-week sprints with continuous delivery
- **User Stories**: Business-focused requirements gathering
- **Retrospectives**: Continuous improvement culture
- **Stakeholder Engagement**: Regular demo sessions and feedback loops

### Quality Assurance
- **Automated Testing**: 85% code coverage with unit and integration tests
- **User Acceptance Testing**: Comprehensive testing protocols
- **Performance Testing**: Load testing for peak traffic scenarios
- **Security Audits**: Regular penetration testing and vulnerability assessments

## Team Leadership

### Cross-functional Coordination
- **Product Team**: 8 product managers and analysts
- **Engineering Team**: 12 full-stack developers
- **QA Team**: 5 quality assurance specialists
- **UX Team**: 3 user experience designers

### Stakeholder Management
- Regular reporting to C-level executives
- Coordination with regional marketing teams
- Vendor relationship management for third-party integrations
- Training program development for end users

## Lessons Learned

This project highlighted the critical importance of data governance in large-scale systems and the value of user-centered design in B2B software development. The success of the PIM system became a template for other product management initiatives across adidas.

The system continues to serve as the backbone of adidas' digital product strategy, enabling rapid market expansion and consistent brand experience globally.
      `,
      excerpt:
        'Architected comprehensive PIM system for adidas, achieving 70% reduction in time-to-market and €3.2M annual savings through process optimization.',
      thumbnail:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 3,
      metaTitle: 'adidas PIM System - Digital Product Architecture',
      metaDescription:
        'Architected comprehensive Product Information Management system for adidas, reducing time-to-market by 70% and saving €3.2M annually through strategic product management.',
      authorId: admin.id,
      publishedAt: new Date('2024-03-05'),
    },
    {
      title: 'StagStrat Brand Website Launch',
      slug: 'stagstrat-website-launch',
      description:
        'Led full-stack development and strategic launch of StagStrat company website as Head of Product',
      content: `
# StagStrat Brand Website Launch

Led the complete design, development, and strategic launch of StagStrat's corporate website, establishing strong digital brand presence and lead generation platform.

## Project Overview

- **Role**: Head of Product & Lead Developer
- **Timeline**: 6 months (2023)
- **Team**: Solo full-stack development with design collaboration
- **Technologies**: Next.js, TypeScript, Tailwind CSS

## Technical Architecture

### Frontend Development
- **Framework**: Next.js 13+ with App Router for optimal performance
- **Styling**: Tailwind CSS for responsive, modern design
- **TypeScript**: Type-safe development for maintainable codebase
- **Performance**: Lighthouse scores of 95+ across all metrics

### Backend & Infrastructure
- **API Routes**: Next.js API routes for contact forms and analytics
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Vercel with global CDN for optimal speed
- **Analytics**: Custom analytics implementation with privacy compliance

## Key Features Implemented

### Modern Web Technologies
- **Server-Side Rendering**: Optimized SEO and initial page load
- **Static Generation**: Pre-built pages for maximum performance
- **Progressive Enhancement**: Functional without JavaScript
- **Mobile-First Design**: Responsive across all device sizes

### Business Functionality
- **Lead Generation**: Optimized contact forms with CRM integration
- **Content Management**: Admin panel for blog and case studies
- **SEO Optimization**: Technical SEO implementation and schema markup
- **Performance Monitoring**: Real-time analytics and error tracking

## Business Impact

### Digital Presence
- **350% increase** in organic search visibility
- **180% improvement** in lead generation conversion
- **45% reduction** in bounce rate compared to previous site
- **Top 3 ranking** for target keywords within 3 months

### Technical Performance
- **98 Lighthouse Performance Score** consistently maintained
- **<1 second** average page load time globally
- **99.9% uptime** since launch
- **Zero critical security vulnerabilities**

## Development Process

### Strategic Planning
- **Market Research**: Competitive analysis and user journey mapping
- **Technical Architecture**: Scalable foundation for future growth
- **Content Strategy**: SEO-optimized content structure
- **Brand Guidelines**: Consistent visual identity implementation

### Agile Development
- **Sprint Planning**: 1-week development cycles
- **Continuous Integration**: Automated testing and deployment
- **Code Review**: Quality assurance for all commits
- **Performance Monitoring**: Real-time performance tracking

## Product Management Excellence

### Cross-functional Leadership
- **Design Collaboration**: Worked with external design agency
- **Stakeholder Management**: Regular updates to executive team
- **Quality Assurance**: Comprehensive testing protocols
- **Launch Strategy**: Coordinated go-to-market activities

### Innovation & Best Practices
- **Modern Development Stack**: Cutting-edge technologies for competitive advantage
- **Accessibility Compliance**: WCAG 2.1 AA standards implementation
- **Security Implementation**: Best practices for data protection
- **Scalable Architecture**: Foundation for future product expansions

## Technical Highlights

### Code Quality
- **100% TypeScript coverage** for type safety
- **95% test coverage** with Jest and Playwright
- **ESLint & Prettier** for code consistency
- **Git workflow** with automated CI/CD

### Performance Optimization
- **Image optimization** with next-generation formats
- **Code splitting** for optimal bundle sizes
- **Caching strategy** at multiple levels
- **Database optimization** for fast query performance

## Results & Recognition

The StagStrat website launch exceeded all initial KPIs and established the company as a technology leader in the consulting space. The project demonstrated my ability to combine strategic product thinking with hands-on technical execution.

### Key Achievements
- **Zero post-launch critical issues**
- **Positive stakeholder feedback** from all levels
- **Industry recognition** for technical implementation
- **Template for future** StagStrat digital initiatives

This project showcased my unique ability to bridge product strategy with technical implementation, delivering business value through both strategic thinking and hands-on development expertise.
      `,
      excerpt:
        'Led full-stack development of StagStrat website, achieving 350% increase in organic visibility and 180% improvement in lead conversion.',
      thumbnail:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      demoUrl: 'https://stagstrat.com',
      githubUrl: 'https://github.com/lukashosala/stagstrat-website',
      category: 'Full Stack',
      status: 'PUBLISHED' as const,
      featured: true,
      sortOrder: 4,
      metaTitle: 'StagStrat Website Launch - Full-Stack Product Development',
      metaDescription:
        'Led full-stack development and strategic launch of StagStrat website, combining product management with technical expertise for exceptional business results.',
      authorId: admin.id,
      publishedAt: new Date('2024-04-10'),
    },
    {
      title: 'Social Media Management Platform Integration',
      slug: 'social-media-management-platform',
      description:
        'Integrated and optimized Sprinklr, Facebook Business Manager, and Instagram tools for unified social media operations',
      content: `
# Social Media Management Platform Integration

Led the integration and optimization of multiple social media management platforms including Sprinklr, Facebook Business Manager, and Instagram Creator Studio for unified adidas social media operations.

## Project Scope

- **Role**: Product Manager - Digital Operations
- **Timeline**: 15 months (2019-2021)
- **Team Size**: 12 cross-functional team members
- **Coverage**: Global social media operations across 40+ markets

## Platform Integration

### Sprinklr Implementation
- **Enterprise Social Listening**: Real-time brand monitoring across all platforms
- **Content Management**: Centralized content creation and approval workflows
- **Campaign Management**: Cross-platform campaign orchestration
- **Analytics Dashboard**: Unified reporting across all social channels

### Facebook Business Manager Optimization
- **Ad Account Structure**: Optimized account hierarchy for global campaigns
- **Audience Segmentation**: Advanced targeting for different product lines
- **Creative Management**: Streamlined asset organization and approval
- **Performance Tracking**: Real-time ROI monitoring and optimization

### Instagram Creator Tools
- **Content Planning**: Strategic content calendar management
- **Influencer Collaboration**: Streamlined partnership workflows
- **Story Optimization**: Data-driven story content strategies
- **Shopping Integration**: Native product tagging and e-commerce links

## Key Achievements

### Operational Efficiency
- **65% reduction** in content publishing time
- **80% improvement** in cross-platform consistency
- **50% decrease** in manual reporting tasks
- **90% automation** of routine social media operations

### Business Impact
- **€1.8M increase** in social commerce revenue
- **125% improvement** in engagement rates
- **35% reduction** in customer response times
- **40% increase** in user-generated content volume

## Technical Implementation

### Integration Architecture
- **API Connections**: Custom middleware for platform synchronization
- **Data Pipeline**: Real-time data flow between platforms
- **Automation Rules**: Smart content distribution algorithms
- **Security Protocol**: Enterprise-grade security and compliance

### Workflow Optimization
- **Content Approval**: Multi-stage approval process with role-based permissions
- **Brand Guidelines**: Automated brand consistency checking
- **Performance Alerts**: Real-time notifications for campaign optimization
- **Asset Library**: Centralized digital asset management system

## Process Innovation

### Agile Social Operations
- **Sprint Planning**: 2-week sprint cycles for campaign development
- **Daily Standups**: Cross-functional team alignment
- **Retrospectives**: Continuous improvement of social processes
- **Stakeholder Reviews**: Regular strategic alignment sessions

### Data-Driven Decision Making
- **A/B Testing Framework**: Scientific approach to content optimization
- **Predictive Analytics**: AI-powered performance forecasting
- **ROI Measurement**: Comprehensive attribution modeling
- **Competitive Analysis**: Automated competitor monitoring

## Team Leadership

### Cross-functional Coordination
- **Social Media Team**: 6 content creators and community managers
- **Marketing Team**: 4 campaign strategists and brand managers
- **IT Team**: 2 systems administrators and developers
- **External Vendors**: Managed relationships with platform representatives

### Training & Development
- **Platform Training**: Comprehensive onboarding for new tools
- **Best Practices**: Documentation of optimized workflows
- **Knowledge Sharing**: Regular team knowledge transfer sessions
- **Certification Programs**: Team certification in platform expertise

## Innovation Highlights

### Custom Development
- **Dashboard Integration**: Single-pane view of all social metrics
- **Automated Reporting**: Daily, weekly, and monthly automated insights
- **Content Suggestions**: AI-powered content optimization recommendations
- **Crisis Management**: Real-time alert system for brand protection

### Industry Leadership
- **Platform Partnerships**: Strategic relationships with social media platforms
- **Beta Testing**: Early access to new platform features and capabilities
- **Speaking Engagements**: Industry conference presentations on social innovation
- **Case Studies**: Published success stories adopted by industry peers

## Results & Impact

The social media platform integration became a benchmark for other brands, demonstrating the power of unified social operations. The project established adidas as a leader in social commerce and customer engagement.

### Long-term Benefits
- **Scalable Operations**: Foundation for rapid market expansion
- **Data Intelligence**: Rich insights for strategic decision making
- **Brand Protection**: Proactive reputation management capabilities
- **Innovation Pipeline**: Framework for adopting new social technologies

This project highlighted my ability to orchestrate complex technical integrations while maintaining focus on business outcomes and team productivity. The success led to industry recognition and influenced social media strategies across the sports apparel sector.
      `,
      excerpt:
        'Integrated Sprinklr, Facebook Business Manager, and Instagram tools, achieving 65% reduction in publishing time and €1.8M increase in social commerce revenue.',
      thumbnail:
        'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: false,
      sortOrder: 5,
      metaTitle: 'Social Media Platform Integration - Digital Operations',
      metaDescription:
        'Led integration of multiple social media platforms for adidas, reducing publishing time by 65% and increasing social commerce revenue by €1.8M.',
      authorId: admin.id,
      publishedAt: new Date('2024-05-15'),
    },
  ]

  const createdProjects = []
  for (const project of projects) {
    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: {
        ...project,
        technologies: {
          connect: [
            { id: productStrategyTech?.id },
            { id: teamLeadershipTech?.id },
            { id: agileTech?.id },
            { id: webDevTech?.id },
            { id: reactTech?.id },
            { id: nextjsTech?.id },
          ].filter(Boolean),
        },
      },
    })
    createdProjects.push(createdProject)
  }

  console.log('✅ Projects created:', createdProjects.length)

  // Create professional blog posts
  const productManagementTag = createdTags.find(
    t => t.slug === 'product-management'
  )
  const digitalStrategyTag = createdTags.find(
    t => t.slug === 'digital-strategy'
  )
  const teamLeadershipTag = createdTags.find(t => t.slug === 'team-leadership')
  const agileTag = createdTags.find(t => t.slug === 'agile')
  const uxTag = createdTags.find(t => t.slug === 'user-experience')

  const blogPosts = [
    {
      title: 'Product Strategy in the Digital Age: Lessons from adidas',
      slug: 'product-strategy-digital-age-adidas',
      content: `
# Product Strategy in the Digital Age: Lessons from adidas

After leading multiple product initiatives at adidas Digital Sports and adidas International Marketing, I've learned that successful digital product strategy requires a unique blend of user-centricity, business acumen, and technological understanding.

## The Evolution of Product Management

### From Feature Factory to Strategic Partner

In my early days as a Product Manager at adidas International Marketing, I quickly learned that product management isn't just about shipping features. It's about solving real business problems through thoughtful product decisions.

**Key realization**: The most successful product managers act as strategic partners to the business, not just executors of requirements.

### Understanding Your Ecosystem

At adidas, we operated in a complex ecosystem:
- **Multiple brands** (adidas, Reebok, Runtastic)
- **Global markets** with different cultural preferences
- **Various channels** (e-commerce, retail, mobile apps)
- **Diverse stakeholders** (athletes, casual users, retailers)

**Learning**: Success requires deep understanding of how your product fits into the broader business ecosystem.

## Strategic Frameworks That Work

### 1. Jobs-to-be-Done (JTBD) in Sports Tech

When redesigning the Runtastic website, we used JTBD to understand what users were really trying to accomplish:

- **Functional Job**: Track fitness progress
- **Emotional Job**: Feel motivated and accomplished
- **Social Job**: Share achievements with community

**Result**: 40% increase in user engagement by focusing on the emotional and social jobs, not just functional tracking.

### 2. OKRs for Cross-functional Alignment

Leading the social commerce initiative, we implemented OKRs to align multiple teams:

**Objective**: Increase social-driven revenue
- **KR1**: Achieve €2M in social commerce sales (achieved €2.5M)
- **KR2**: Improve social conversion rate by 25% (achieved 35%)
- **KR3**: Launch in 15 markets by Q4 (achieved 17 markets)

**Learning**: OKRs work best when they're ambitious but achievable, and when the entire organization understands how their work contributes to the objectives.

## Building Products at Scale

### The Challenge of Global Products

Creating products that work across 50+ markets taught me:

1. **Start with core functionality** that works everywhere
2. **Build flexibility** for local adaptations
3. **Invest in solid infrastructure** from day one
4. **Never underestimate localization** complexity

### Technical Product Management

As Head of Product at StagStrat, I've taken a hands-on approach to technical implementation. This dual perspective has been invaluable:

**Technical skills enhance product decisions**:
- Better estimation and planning
- More credible leadership of engineering teams
- Ability to spot technical debt early
- Understanding of what's actually possible vs. what sounds good in theory

### Data-Driven Decision Making

At adidas, we had access to incredible amounts of data. The challenge wasn't getting data—it was getting the right insights:

**Framework for product analytics**:
1. **Define success metrics** before building features
2. **Create hypothesis-driven** development cycles
3. **Implement comprehensive tracking** from day one
4. **Regularly review and adjust** based on learnings

## Team Leadership in Product

### Building High-Performing Product Teams

Leading teams across adidas taught me that great product teams share common characteristics:

- **Clear purpose** and understanding of business impact
- **Psychological safety** to experiment and fail
- **Strong communication** across disciplines
- **Shared ownership** of outcomes, not just outputs

### Cross-functional Collaboration

Product management is inherently collaborative. Success requires:

**With Engineering**: Build trust through technical competence and realistic planning
**With Design**: Champion user needs while balancing business constraints
**With Marketing**: Ensure product capabilities align with market positioning
**With Sales**: Understand customer feedback and competitive pressures

## Agile at Enterprise Scale

### Adapting Agile for Large Organizations

At adidas, we adapted Agile practices for enterprise scale:

- **Quarterly planning** for strategic alignment
- **Two-week sprints** for execution
- **Cross-team dependencies** managed through Program Increment planning
- **Regular retrospectives** for continuous improvement

**Key insight**: Agile frameworks are guides, not rules. Adapt them to your organization's needs.

## Looking Forward: The Future of Product Management

### Emerging Trends

Based on my experience across sports tech, e-commerce, and consulting:

1. **AI-driven personalization** will become table stakes
2. **Privacy-first design** will reshape how we build products
3. **Sustainability** will become a key product differentiator
4. **Voice and conversational interfaces** will expand beyond smart speakers

### Skills for Tomorrow's Product Managers

- **Technical fluency** (you don't need to code, but you need to understand technology)
- **Data literacy** (ability to derive insights from complex datasets)
- **Systems thinking** (understanding interconnections and unintended consequences)
- **Cultural intelligence** (building products for global audiences)

## Conclusion

Product management in large organizations like adidas taught me that success comes from balancing strategic thinking with hands-on execution, data-driven decisions with intuitive understanding of user needs, and technical feasibility with business viability.

The future belongs to product managers who can navigate complexity while maintaining clarity of purpose. Whether you're building the next fitness app or launching a global e-commerce platform, the fundamentals remain the same: understand your users, align with business objectives, and execute with excellence.

*What challenges are you facing in your product management journey? I'd love to hear about your experiences in the comments below.*
      `,
      excerpt:
        'Strategic insights from leading digital product initiatives at adidas, covering frameworks, team leadership, and lessons learned from global product launches.',
      thumbnail:
        'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=600&fit=crop',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: true,
      metaTitle:
        'Product Strategy in Digital Age - adidas Product Management Insights',
      metaDescription:
        'Strategic product management insights from adidas Digital Sports initiatives, covering frameworks, team leadership, and global product strategy.',
      readTime: 10,
      authorId: admin.id,
      publishedAt: new Date('2024-01-25'),
    },
    {
      title: "Leading Cross-functional Teams: A Product Manager's Guide",
      slug: 'leading-cross-functional-teams-product-manager',
      content: `
# Leading Cross-functional Teams: A Product Manager's Guide

Leading the development of adidas' social commerce platform taught me that success in product management isn't just about having great ideas—it's about mobilizing diverse teams to execute those ideas effectively.

## The Cross-functional Reality

### Beyond the Product Team

When I joined adidas as Product Manager, I quickly realized that "product team" was a misnomer. Success required collaboration with:

- **Engineering teams** (backend, frontend, mobile, DevOps)
- **Design teams** (UX research, visual design, content design)
- **Marketing teams** (brand, performance, content)
- **Business teams** (finance, legal, compliance, analytics)
- **External partners** (agencies, vendors, platform partners)

**Reality check**: You're not managing a team—you're orchestrating an ecosystem.

## Building Trust Across Disciplines

### Speaking Everyone's Language

One of my early mistakes was using product terminology with everyone. I learned to adapt:

**With Engineers**: Focus on technical feasibility, scalability, and maintainability
**With Designers**: Emphasize user outcomes, accessibility, and design system consistency
**With Marketers**: Connect features to customer acquisition, retention, and revenue
**With Finance**: Translate features into ROI, cost savings, and business impact

### Establishing Credibility

**With Technical Teams**: During the PIM system project, I invested time learning the technical architecture. This enabled better estimation discussions and earned respect from engineering leadership.

**With Creative Teams**: I participated in user research sessions and design critiques, showing genuine interest in craft quality beyond just shipping features.

**With Business Teams**: I created business cases that connected product decisions to revenue impact, demonstrating clear ROI thinking.

## Communication Strategies That Work

### The Right Cadence for Each Audience

Different stakeholders need different communication rhythms:

**Daily**: Engineering stand-ups, design check-ins
**Weekly**: Cross-functional team syncs, stakeholder updates
**Monthly**: Business reviews, strategic planning sessions
**Quarterly**: OKR reviews, roadmap planning

### Documentation as a Product

I treat documentation like a product with specific user needs:

**Engineering**: Detailed technical specifications with clear acceptance criteria
**Marketing**: Feature summaries with benefits, target audiences, and positioning
**Leadership**: Executive summaries with business impact and key metrics
**Support**: User-facing documentation with troubleshooting guides

### Managing Up, Down, and Across

**Managing Up**: Regular updates on progress, early flagging of risks, clear requests for support
**Managing Across**: Collaborative planning, shared OKRs, regular relationship building
**Managing Down**: Clear context, decision transparency, growth opportunities

## Conflict Resolution in Product Teams

### Common Sources of Tension

In my experience leading the Runtastic redesign, typical conflicts included:

- **Engineering vs. Design**: Technical constraints vs. user experience ideals
- **Marketing vs. Product**: Feature requests vs. strategic roadmap
- **Business vs. Engineering**: Timeline pressure vs. technical debt
- **Different teams**: Resource allocation and priority conflicts

### Resolution Framework

1. **Understand underlying needs** (not just stated positions)
2. **Find shared objectives** (what success looks like for everyone)
3. **Explore creative solutions** (beyond either/or choices)
4. **Make data-driven decisions** (objective criteria when possible)
5. **Communicate decisions clearly** (rationale and next steps)

**Example**: When marketing wanted faster feature delivery and engineering needed technical debt reduction, we created "technical debt sprints" that improved both code quality and delivery speed.

## Agile Leadership in Practice

### Adapting Ceremonies for Cross-functional Teams

Standard Scrum works well for homogeneous teams, but cross-functional teams need adaptation:

**Sprint Planning**: Include capacity planning across all disciplines
**Daily Standups**: Async updates for distributed teams, sync sessions for blockers
**Sprint Reviews**: Stakeholder demos with business context
**Retrospectives**: Rotate focus across different team functions

### Making Decisions with Incomplete Information

Product managers constantly face decisions with incomplete data. My framework:

1. **Define decision criteria** upfront (what would change your mind?)
2. **Set decision deadlines** (prevent analysis paralysis)
3. **Make reversible decisions** quickly (vs. irreversible ones carefully)
4. **Communicate assumptions** clearly (what you're betting on)
5. **Plan learning cycles** (how you'll validate decisions)

## Scaling Team Performance

### Building a Learning Culture

At adidas, we implemented practices that enhanced team learning:

**Failure post-mortems**: What went wrong, why, and how to prevent recurrence
**Success analysis**: What went right and how to replicate it
**Knowledge sharing**: Regular tech talks, design critiques, and strategy sessions
**External learning**: Conference attendance, industry meetups, online courses

### Measuring Team Health

Beyond delivery metrics, I track team health indicators:

- **Psychological safety**: Team members feel safe to take risks and make mistakes
- **Purpose clarity**: Everyone understands how their work contributes to larger goals
- **Autonomy**: Teams have authority to make decisions within their domain
- **Mastery**: Team members are growing in their craft and capabilities

## Remote and Hybrid Team Leadership

### Lessons from COVID and Beyond

The pandemic forced rapid adaptation to remote work. Key learnings:

**Over-communicate context**: Remote teams need more background information
**Document everything**: Async communication requires better documentation
**Intentional relationship building**: Schedule informal interaction time
**Flexible meeting structures**: Accommodate different time zones and work styles

### Tools and Processes for Distributed Teams

**Communication**: Slack for daily coordination, Zoom for face-to-face connection
**Documentation**: Confluence for knowledge management, Notion for collaborative planning
**Design collaboration**: Figma for real-time design iteration
**Project management**: Jira for development tracking, Asana for cross-functional coordination

## Continuous Improvement

### Regular Team Retrospectives

Every quarter, I facilitate comprehensive team retrospectives:

1. **What's working well?** (strengths to amplify)
2. **What's not working?** (pain points to address)
3. **What should we try?** (experiments for next quarter)
4. **What should we stop?** (practices that aren't adding value)

### Personal Leadership Development

Leading cross-functional teams is an ongoing learning journey. I regularly:

- **Seek 360-degree feedback** from peers, direct reports, and managers
- **Study leadership frameworks** and adapt them to product contexts
- **Find mentors** from different disciplines and seniority levels
- **Experiment with new approaches** and measure their effectiveness

## Conclusion

Leading cross-functional teams in product management is both art and science. It requires technical competence, emotional intelligence, communication skills, and strategic thinking.

The most important lesson I've learned: Your success is entirely dependent on your team's success. Invest in relationships, create psychological safety, communicate clearly, and always remember that diverse teams with good collaboration outperform homogeneous teams with individual brilliance.

*How do you approach cross-functional team leadership? What challenges have you encountered, and what solutions have worked for you?*
      `,
      excerpt:
        'Practical insights on leading diverse, cross-functional product teams based on experience managing global initiatives at adidas and StagStrat.',
      thumbnail:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      category: 'Leadership',
      status: 'PUBLISHED' as const,
      featured: true,
      metaTitle:
        'Leading Cross-functional Teams - Product Manager Leadership Guide',
      metaDescription:
        'Practical guide to leading cross-functional product teams, covering communication strategies, conflict resolution, and building high-performance teams.',
      readTime: 12,
      authorId: admin.id,
      publishedAt: new Date('2024-02-15'),
    },
    {
      title: 'Data-Driven Product Decisions: Analytics That Actually Matter',
      slug: 'data-driven-product-decisions-analytics',
      content: `
# Data-Driven Product Decisions: Analytics That Actually Matter

During my time managing the Product Information Management system at adidas, I learned that having access to data and making data-driven decisions are two entirely different challenges. Here's what I've learned about building analytics frameworks that actually drive product success.

## The Data Paradox in Product Management

### Information Overload vs. Insight Scarcity

At adidas, we had access to massive amounts of data:
- **User behavior analytics** from multiple touchpoints
- **Business metrics** across 50+ global markets
- **Technical performance** data from various systems
- **Market research** from external agencies

The challenge wasn't getting data—it was extracting actionable insights that could inform product decisions.

**Key learning**: More data doesn't automatically lead to better decisions. Focus on the metrics that directly influence your ability to improve the product.

## Building Your Analytics Foundation

### The Three-Layer Analytics Architecture

**Layer 1: Business Health Metrics**
- Revenue and conversion rates
- User acquisition and retention
- Market share and competitive position
- Customer satisfaction scores

**Layer 2: Product Performance Metrics**
- Feature adoption and usage patterns
- User journey completion rates
- Technical performance (speed, reliability, errors)
- Content effectiveness metrics

**Layer 3: Leading Indicators**
- User engagement depth
- Support ticket trends
- A/B test results
- User feedback sentiment

### Choosing the Right Metrics

When launching the social commerce platform, we established a hierarchy:

**North Star Metric**: Social-driven revenue per user
**Primary Metrics**: Conversion rate from social channels, average order value
**Secondary Metrics**: Social engagement rate, time spent on product pages
**Guardrail Metrics**: Overall conversion rate, customer satisfaction

**Framework**: Choose metrics that are (1) actionable, (2) directly influenced by product decisions, and (3) aligned with business objectives.

## Analytics in Practice: Real Examples

### Case Study 1: Runtastic Website Redesign

**Challenge**: Improving user engagement on fitness tracking platform

**Hypothesis**: Simplified navigation and personalized content recommendations would increase session depth and return visits.

**Metrics Setup**:
- Primary: Average session duration, pages per session
- Secondary: Feature discovery rate, content engagement
- Guardrail: Overall conversion to premium subscriptions

**Results**:
- 40% increase in session duration
- 60% improvement in feature discovery
- 25% increase in premium conversion

**Key insight**: The biggest impact came from personalized workout recommendations, not navigation improvements—data helped us identify which hypothesis was actually correct.

### Case Study 2: Social Commerce Attribution

**Challenge**: Understanding which social platforms drove the highest quality customers

**Approach**: Implemented multi-touch attribution modeling to track customer journeys across platforms.

**Metrics Framework**:
- **Acquisition**: Cost per acquisition by channel
- **Engagement**: Time from first touch to conversion
- **Quality**: Customer lifetime value by acquisition channel
- **Retention**: Repeat purchase rate by channel

**Surprising finding**: Instagram drove higher volume but lower lifetime value customers compared to Facebook. This led to a strategic shift in budget allocation and content strategy.

## Advanced Analytics Techniques

### Cohort Analysis for Product Insights

Instead of looking at aggregate metrics, cohort analysis reveals how user behavior changes over time:

**Example**: New user retention for the PIM system
- **Week 1**: 85% of users return
- **Month 1**: 60% of users are still active
- **Month 3**: 40% of users are power users

**Insight**: Users who adopted advanced search features in their first week had 3x higher retention rates. This led to improved onboarding focused on search functionality.

### A/B Testing Framework

**Test Design Principles**:
1. **Single variable**: Change one thing at a time
2. **Sufficient sample size**: Use statistical power calculations
3. **Appropriate duration**: Run tests long enough to capture user behavior patterns
4. **Segment analysis**: Look at results across different user groups

**Example**: Testing checkout flow optimization
- **Variant A**: Traditional multi-step checkout
- **Variant B**: Single-page checkout with progressive disclosure
- **Primary metric**: Conversion rate
- **Secondary metrics**: Time to completion, error rate
- **Segment**: New vs. returning customers

**Result**: Single-page checkout improved conversion by 15% for new customers but decreased it by 8% for returning customers. Solution: Adaptive checkout based on user type.

### Predictive Analytics

**Customer Churn Prediction**: Using machine learning to identify users at risk of churning
- **Input features**: Usage patterns, support interactions, feature adoption
- **Model output**: Churn probability score
- **Action**: Targeted retention campaigns for high-risk users

**Result**: 35% reduction in churn rate through proactive intervention.

## Common Analytics Pitfalls

### Vanity Metrics vs. Actionable Metrics

**Vanity metrics** look good but don't drive decisions:
- Total page views (without context)
- Number of downloads (without engagement data)
- Social media followers (without conversion data)

**Actionable metrics** directly inform product decisions:
- Conversion rate by traffic source
- Feature adoption rate over time
- Customer lifetime value by acquisition channel

### Correlation vs. Causation

**Example**: During the Runtastic redesign, we noticed that users with profile photos had higher engagement rates.

**Wrong conclusion**: Adding profile photos increases engagement
**Right conclusion**: Highly engaged users are more likely to complete their profiles

**Solution**: Look for causal relationships through controlled experiments, not just correlational data.

### Data Quality Issues

**Common problems**:
- **Tracking gaps**: Missing data from certain user flows
- **Definition inconsistencies**: Different teams measuring the same metric differently
- **Sampling bias**: Data that doesn't represent your full user base

**Solutions**:
- Regular data audits and validation
- Clear metric definitions shared across teams
- Representative sampling and segment analysis

## Building a Data-Driven Culture

### Making Data Accessible

**Self-service analytics**: Enable non-technical team members to access key metrics
**Regular reporting**: Automated dashboards with key insights
**Data storytelling**: Present insights in context with clear recommendations

### Education and Training

At adidas, we implemented:
- **Analytics workshops** for product teams
- **Data literacy training** for stakeholders
- **Regular metric reviews** to discuss insights and implications

### Balancing Data with Intuition

Data should inform decisions, not make them. The best product managers combine:
- **Quantitative insights** (what is happening)
- **Qualitative understanding** (why it's happening)
- **Strategic context** (what we should do about it)
- **User empathy** (how this affects real people)

## Tools and Technology

### Analytics Stack at Scale

**Data Collection**: Google Analytics, Mixpanel, custom event tracking
**Data Storage**: Data warehouse with ETL pipelines
**Analysis**: SQL, Python, R for advanced analysis
**Visualization**: Tableau, Looker for dashboards
**Experimentation**: Optimizely, custom A/B testing framework

### Getting Started with Limited Resources

**Minimum viable analytics setup**:
1. **Google Analytics 4** for basic user behavior
2. **Simple event tracking** for key user actions
3. **Weekly metric reviews** with your team
4. **Spreadsheet-based cohort analysis** to start

## Conclusion

Effective product analytics isn't about having the most sophisticated tools or the largest datasets. It's about asking the right questions, measuring what matters, and creating a feedback loop that continuously improves your product decisions.

The goal isn't to eliminate uncertainty—it's to make better decisions under uncertainty. Use data to validate assumptions, uncover unexpected insights, and build products that truly serve your users' needs.

*What analytics challenges are you facing in your product work? How do you balance data-driven insights with other decision-making factors?*
      `,
      excerpt:
        'Framework for building analytics that drive product decisions, with real examples from adidas digital product initiatives and practical implementation guidance.',
      thumbnail:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      category: 'Product Management',
      status: 'PUBLISHED' as const,
      featured: false,
      metaTitle: 'Data-Driven Product Decisions - Analytics Framework Guide',
      metaDescription:
        'Complete guide to building analytics frameworks for product management, with real examples from adidas and practical implementation strategies.',
      readTime: 15,
      authorId: admin.id,
      publishedAt: new Date('2024-03-10'),
    },
  ]

  const createdBlogPosts = []
  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: {
        ...post,
        tags: {
          connect: [
            { id: productManagementTag?.id },
            { id: digitalStrategyTag?.id },
            { id: teamLeadershipTag?.id },
            { id: agileTag?.id },
            { id: uxTag?.id },
          ].filter(Boolean),
        },
      },
    })
    createdBlogPosts.push(createdPost)
  }

  console.log('✅ Blog posts created:', createdBlogPosts.length)

  // Create professional recruiter page sample
  const sampleRecruiterPage = await prisma.recruiterPage.upsert({
    where: { slug: 'adidas-head-of-product' },
    update: {},
    create: {
      title: 'Head of Product - Digital Innovation at adidas',
      slug: 'adidas-head-of-product',
      companyName: 'adidas',
      companySlug: 'adidas',
      isActive: true,
      roleName: 'Head of Product',
      roleLevel: 'Director',
      companySize: '10000+',
      industry: 'Sports & E-commerce',
      templateType: 'company-mirror',
      authorId: admin.id,
      customContent: JSON.stringify({
        heroMessage:
          'Scale digital product innovation with proven e-commerce and sports tech expertise',
        valueProposition:
          'Drive €10M+ revenue growth through strategic product leadership and technical excellence',
      }),
      companyInfo: JSON.stringify({
        stage: 'Enterprise',
        marketPosition: 'Market Leader',
        growthRate: '+12% YoY',
        primaryGoals: [
          'Digital Transformation',
          'Global Market Expansion',
          'Customer Experience Excellence',
          'Technology Innovation',
        ],
      }),
      challenges: JSON.stringify([
        {
          title: 'Global Product Scalability',
          description:
            'Need to build products that work seamlessly across 50+ markets with different user behaviors, regulations, and infrastructure requirements.',
          impact: 'Critical',
          urgency: 'High',
        },
        {
          title: 'Cross-Platform Integration',
          description:
            'Integrating multiple digital touchpoints (web, mobile, social commerce, retail) into cohesive user experiences while maintaining brand consistency.',
          impact: 'High',
          urgency: 'High',
        },
        {
          title: 'Technical Debt Management',
          description:
            'Balancing rapid feature delivery with technical infrastructure improvements to maintain performance at enterprise scale.',
          impact: 'High',
          urgency: 'Medium',
        },
        {
          title: 'Data-Driven Personalization',
          description:
            'Implementing sophisticated analytics and ML systems to deliver personalized experiences while maintaining privacy compliance.',
          impact: 'Medium',
          urgency: 'High',
        },
      ]),
      solutions: JSON.stringify([
        {
          title: 'Global Product Architecture Framework',
          description:
            'Implement scalable product architecture with localization capabilities, leveraging microservices and cloud infrastructure for 50+ markets.',
          timeframe: '90 days',
          impact: '70% reduction in time-to-market for new market launches',
        },
        {
          title: 'Omnichannel Integration Strategy',
          description:
            'Develop unified customer experience across web, mobile, social, and retail touchpoints with consistent data and personalization.',
          timeframe: '120 days',
          impact: '40% improvement in customer journey completion rates',
        },
        {
          title: 'Technical Excellence Program',
          description:
            'Balance feature development with infrastructure improvements through dedicated technical debt sprints and performance optimization.',
          timeframe: '60 days',
          impact:
            '50% improvement in system performance and developer productivity',
        },
        {
          title: 'Advanced Analytics Implementation',
          description:
            'Deploy enterprise-scale analytics platform with real-time personalization, A/B testing framework, and privacy-compliant data collection.',
          timeframe: '180 days',
          impact:
            '25% increase in conversion rates and customer lifetime value',
        },
      ]),
      views: 0,
      uniqueViews: 0,
      responses: 0,
    },
  })

  console.log('✅ Sample recruiter page created:', sampleRecruiterPage.slug)

  console.log('🎉 Database seed completed successfully!')
  console.log(`
📊 Summary:
- Admin user: ${admin.email}
- Technologies: ${createdTechnologies.length}
- Tags: ${createdTags.length}
- Projects: ${createdProjects.length}
- Blog posts: ${createdBlogPosts.length}

🔑 Admin credentials:
Email: ${adminEmail}
Password: ${adminPassword}

Make sure to change the admin password in production!
  `)
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
