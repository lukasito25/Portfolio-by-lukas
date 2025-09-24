import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Product Management portfolio seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Lukas Hosala',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Comprehensive Technology Stack for Product Managers
  const technologies = [
    // Product Management Tools
    {
      name: 'Jira',
      slug: 'jira',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#0052CC',
      icon: 'jira',
      description:
        'Agile project management and issue tracking platform for coordinating development teams and managing product backlogs.',
    },
    {
      name: 'Confluence',
      slug: 'confluence',
      category: 'Product Management',
      level: 'ADVANCED',
      color: '#172B4D',
      icon: 'confluence',
      description:
        'Team collaboration and documentation platform for creating product requirements and specifications.',
    },
    {
      name: 'Figma',
      slug: 'figma',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#F24E1E',
      icon: 'figma',
      description:
        'Design collaboration platform for creating wireframes, mockups, and collaborating with design teams.',
    },
    {
      name: 'Miro',
      slug: 'miro',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#050038',
      icon: 'miro',
      description:
        'Visual collaboration platform for brainstorming, user journey mapping, and agile ceremonies.',
    },
    {
      name: 'Notion',
      slug: 'notion',
      category: 'Product Management',
      level: 'ADVANCED',
      color: '#000000',
      icon: 'notion',
      description:
        'All-in-one workspace for product documentation, roadmaps, and team collaboration.',
    },

    // Leadership & Communication
    {
      name: 'Slack',
      slug: 'slack',
      category: 'Communication',
      level: 'EXPERT',
      color: '#4A154B',
      icon: 'slack',
      description:
        'Team communication platform for coordinating cross-functional teams and stakeholders.',
    },
    {
      name: 'Microsoft Teams',
      slug: 'microsoft-teams',
      category: 'Communication',
      level: 'ADVANCED',
      color: '#6264A7',
      icon: 'teams',
      description:
        'Collaboration platform for video conferencing, file sharing, and team coordination.',
    },

    // Analytics & Research
    {
      name: 'Google Analytics',
      slug: 'google-analytics',
      category: 'Analytics',
      level: 'EXPERT',
      color: '#E37400',
      icon: 'analytics',
      description:
        'Web analytics platform for tracking user behavior and product performance metrics.',
    },
    {
      name: 'Amplitude',
      slug: 'amplitude',
      category: 'Analytics',
      level: 'ADVANCED',
      color: '#0085FF',
      icon: 'amplitude',
      description:
        'Product analytics platform for user behavior analysis and cohort tracking.',
    },
    {
      name: 'Mixpanel',
      slug: 'mixpanel',
      category: 'Analytics',
      level: 'INTERMEDIATE',
      color: '#7856FF',
      icon: 'mixpanel',
      description:
        'Event tracking and user analytics platform for product usage insights.',
    },
    {
      name: 'Hotjar',
      slug: 'hotjar',
      category: 'Research',
      level: 'ADVANCED',
      color: '#FD3A5C',
      icon: 'hotjar',
      description:
        'User behavior analytics with heatmaps, recordings, and feedback collection.',
    },
    {
      name: 'Typeform',
      slug: 'typeform',
      category: 'Research',
      level: 'ADVANCED',
      color: '#262627',
      icon: 'typeform',
      description:
        'Interactive form builder for user research surveys and feedback collection.',
    },

    // Methodologies & Frameworks
    {
      name: 'Agile/Scrum',
      slug: 'agile-scrum',
      category: 'Methodologies',
      level: 'EXPERT',
      color: '#007ACC',
      icon: 'agile',
      description:
        'Iterative development methodology for rapid product delivery and continuous improvement.',
    },
    {
      name: 'Lean Startup',
      slug: 'lean-startup',
      category: 'Methodologies',
      level: 'EXPERT',
      color: '#FF6B35',
      icon: 'lean',
      description:
        'Build-Measure-Learn methodology for validated learning and product development.',
    },
    {
      name: 'Design Thinking',
      slug: 'design-thinking',
      category: 'Methodologies',
      level: 'ADVANCED',
      color: '#FF6F61',
      icon: 'design-thinking',
      description:
        'Human-centered design approach for problem solving and innovation.',
    },
    {
      name: 'OKRs',
      slug: 'okrs',
      category: 'Strategy',
      level: 'EXPERT',
      color: '#4285F4',
      icon: 'okr',
      description:
        'Objectives and Key Results framework for goal setting and performance tracking.',
    },
    {
      name: 'Jobs-to-be-Done',
      slug: 'jobs-to-be-done',
      category: 'Strategy',
      level: 'ADVANCED',
      color: '#34A853',
      icon: 'jtbd',
      description:
        'Customer need-focused framework for product strategy and innovation.',
    },

    // Technical Skills
    {
      name: 'SQL',
      slug: 'sql',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#336791',
      icon: 'sql',
      description:
        'Database query language for data analysis and product metrics extraction.',
    },
    {
      name: 'APIs & Integrations',
      slug: 'apis-integrations',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#0066CC',
      icon: 'api',
      description:
        'Understanding of API design and third-party integrations for product planning.',
    },

    // Business & Strategy
    {
      name: 'Business Model Canvas',
      slug: 'business-model-canvas',
      category: 'Business',
      level: 'EXPERT',
      color: '#FF9500',
      icon: 'business-model',
      description:
        'Strategic planning tool for business model design and validation.',
    },
    {
      name: 'Financial Modeling',
      slug: 'financial-modeling',
      category: 'Business',
      level: 'ADVANCED',
      color: '#1A73E8',
      icon: 'financial',
      description:
        'Business case development and ROI analysis for product investments.',
    },
    {
      name: 'Competitive Analysis',
      slug: 'competitive-analysis',
      category: 'Strategy',
      level: 'EXPERT',
      color: '#9C27B0',
      icon: 'competitive',
      description:
        'Market research and competitive positioning for strategic planning.',
    },
    {
      name: 'Go-to-Market Strategy',
      slug: 'go-to-market',
      category: 'Strategy',
      level: 'EXPERT',
      color: '#E91E63',
      icon: 'gtm',
      description:
        'Product launch planning and market entry strategy development.',
    },

    // Growth & Marketing
    {
      name: 'A/B Testing',
      slug: 'ab-testing',
      category: 'Growth',
      level: 'EXPERT',
      color: '#FF5722',
      icon: 'ab-test',
      description:
        'Experimental methodology for product optimization and decision making.',
    },
    {
      name: 'SEO Strategy',
      slug: 'seo-strategy',
      category: 'Growth',
      level: 'ADVANCED',
      color: '#4CAF50',
      icon: 'seo',
      description:
        'Search engine optimization for product visibility and organic growth.',
    },
    {
      name: 'User Acquisition',
      slug: 'user-acquisition',
      category: 'Growth',
      level: 'ADVANCED',
      color: '#795548',
      icon: 'user-acquisition',
      description:
        'Customer acquisition strategy and growth funnel optimization.',
    },

    // Leadership & Management Core Skills
    {
      name: 'Team Leadership',
      slug: 'team-leadership',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#EF4444',
      icon: 'leadership',
      description:
        'Managing cross-functional teams of 13+ people across multiple time zones.',
    },
    {
      name: 'Stakeholder Management',
      slug: 'stakeholder-management',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#06B6D4',
      icon: 'stakeholder',
      description:
        'Executive and cross-functional stakeholder alignment and communication.',
    },
    {
      name: 'International Markets',
      slug: 'international-markets',
      category: 'Business',
      level: 'EXPERT',
      color: '#0891B2',
      icon: 'global',
      description:
        'Global market expansion and localization strategy across multiple countries.',
    },
  ]

  const createdTechnologies = []
  for (const tech of technologies) {
    const techData = {
      ...tech,
      level: tech.level as any,
    }
    const technology = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: techData,
      create: techData,
    })
    createdTechnologies.push(technology)
  }

  console.log('✅ Technologies created:', createdTechnologies.length)

  // Create tags for content categorization
  const tags = [
    {
      name: 'Product Management',
      slug: 'product-management',
      color: '#8B5CF6',
    },
    {
      name: 'Strategic Leadership',
      slug: 'strategic-leadership',
      color: '#DC2626',
    },
    { name: 'Team Leadership', slug: 'team-leadership', color: '#EF4444' },
    { name: 'Growth Strategy', slug: 'growth-strategy', color: '#7C3AED' },
    { name: 'User Experience', slug: 'user-experience', color: '#3B82F6' },
    { name: 'International Markets', slug: 'international', color: '#0891B2' },
    {
      name: 'Scale & Performance',
      slug: 'scale-performance',
      color: '#F59E0B',
    },
    { name: 'Innovation', slug: 'innovation', color: '#10B981' },
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

  // Create compelling Product Management projects
  const jiraTech = createdTechnologies.find(t => t.slug === 'jira')
  const leadershipTech = createdTechnologies.find(
    t => t.slug === 'team-leadership'
  )
  const internationalTech = createdTechnologies.find(
    t => t.slug === 'international-markets'
  )
  const agileTech = createdTechnologies.find(t => t.slug === 'agile-scrum')
  const figmaTech = createdTechnologies.find(t => t.slug === 'figma')
  const analyticsTech = createdTechnologies.find(
    t => t.slug === 'google-analytics'
  )
  const okrTech = createdTechnologies.find(t => t.slug === 'okrs')
  const stakeholderTech = createdTechnologies.find(
    t => t.slug === 'stakeholder-management'
  )

  const projects = [
    {
      title: 'adidas Runtastic Website Redesign',
      slug: 'adidas-runtastic-website-redesign',
      description:
        'Complete website redesign and migration to new tech stack for adidas Digital Sports, serving 165M+ global users.',
      content: `# adidas Runtastic Website Redesign

## Executive Summary
Led the comprehensive redesign and technical migration of the Runtastic website as Senior Product Manager at adidas Digital Sports. Managed cross-functional teams across multiple locations to deliver rebranded content, new technology stack, and integrated SEO marketing strategy.

## Challenge
The existing Runtastic platform faced several critical challenges:
- Legacy technology stack limiting scalability and performance
- Fragmented user experience across different product touchpoints
- Need for rebranding alignment with adidas Digital Sports identity
- Complex integration requirements with existing adidas ecosystem
- Performance optimization for global user base across different devices and network conditions

## Solution & Approach

### Strategic Planning
- Conducted comprehensive technical audit and user research
- Developed phased migration strategy to minimize user disruption
- Created detailed project roadmap with clear milestones and deliverables
- Established success metrics and KPIs for project evaluation

### Team Leadership
- Managed cross-functional team of 13 personnel including:
  - Frontend and backend developers
  - UX/UI designers
  - QA engineers
  - External freelance specialists
- Coordinated work across multiple time zones (Europe, US, Asia)
- Implemented agile methodology with sprint planning and regular standups

### Technical Implementation
- Migrated from legacy stack to modern React-based architecture
- Implemented responsive design principles for mobile-first experience
- Integrated with adidas authentication and user management systems
- Optimized performance with CDN implementation and image optimization
- Established comprehensive SEO strategy for improved search visibility

## Key Results

### Performance Improvements
- **40% improvement** in page load times
- **60% reduction** in bounce rate
- **Mobile performance score** increased from 65 to 92 (Lighthouse)
- **Core Web Vitals** optimized for all key metrics

### User Experience
- Unified design system aligned with adidas brand guidelines
- Improved user journey and conversion funnels
- Enhanced accessibility compliance (WCAG 2.1 AA)
- Streamlined onboarding process with 25% higher completion rate

### Technical Excellence
- Modern, maintainable codebase with TypeScript implementation
- Automated testing coverage increased to 85%
- CI/CD pipeline implementation for faster, safer deployments
- Comprehensive monitoring and analytics integration

### Business Impact
- Maintained 100% uptime during migration process
- No loss in user engagement during transition period
- Improved SEO performance with 30% increase in organic traffic
- Platform positioned for future feature development and scaling

This project demonstrated my ability to lead complex technical initiatives while managing large, distributed teams and delivering measurable business results for a global user base.`,
      excerpt:
        'Led complete website redesign and technical migration for adidas Digital Sports, managing 13-person team across multiple time zones to serve 165M+ global users.',
      thumbnail:
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop',
      demoUrl: 'https://www.runtastic.com',
      githubUrl: '',
      category: 'Digital Sports',
      featured: true,
      sortOrder: 1,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-06-15'),
      views: 1250,
      likes: 89,
    },
    {
      title: 'StagStrat Algorithmic Trading Platform',
      slug: 'stagstrat-algorithmic-trading-platform',
      description:
        'Head of Product for algorithmic trading startup, orchestrating development and complete website launch from concept to production.',
      content: `# StagStrat Algorithmic Trading Platform

## Executive Summary
As Head of Product at StagStrat, orchestrated the complete product lifecycle of an algorithmic trading platform. Created comprehensive product roadmap, launched website, and implemented SEO optimization strategies for a revolutionary trading solution.

## Challenge & Opportunity
StagStrat entered a highly competitive algorithmic trading market with the opportunity to democratize advanced trading strategies:
- **Market Education**: Complex algorithmic concepts needed simplification for broader market
- **Technical Complexity**: Building sophisticated trading algorithms with user-friendly interfaces
- **Regulatory Compliance**: Financial services regulations across multiple jurisdictions
- **User Trust**: Establishing credibility in a market dominated by established players
- **Performance Expectations**: Zero tolerance for system downtime or trading delays

## Product Strategy & Vision

### Strategic Positioning
- **Target Market**: Retail investors seeking institutional-level trading capabilities
- **Value Proposition**: AI-powered trading strategies with transparent performance tracking
- **Competitive Advantage**: Real-time algorithm performance with full backtesting capabilities
- **Go-to-Market**: B2C SaaS model with freemium entry and premium strategy subscriptions

### Product Roadmap Development
- **Phase 1**: Core trading engine and basic strategy implementation
- **Phase 2**: Advanced analytics dashboard and performance tracking
- **Phase 3**: Social trading features and strategy marketplace
- **Phase 4**: Mobile application and API for third-party integrations

## Team Leadership & Organization

### Product Team Structure
- **Product Management**: Led strategy, roadmap, and stakeholder alignment
- **Engineering**: Managed 8-person development team across backend, frontend, and infrastructure
- **Design**: Collaborated with 2 UX/UI designers for user experience optimization
- **Data Science**: Worked with 3 quantitative analysts for algorithm development
- **Compliance**: Partnered with legal and compliance teams for regulatory requirements

### Leadership Philosophy
- **Customer-Centric**: Direct trader feedback integration into product decisions
- **Data-Driven**: Every feature backed by market research and user testing
- **Agile Delivery**: Sprint-based development with bi-weekly releases
- **Innovation Focus**: Bleeding-edge technology with stable, reliable execution

## Product Development & Launch

### Technical Architecture
- **Trading Engine**: High-frequency trading capability with microsecond latency
- **Algorithm Framework**: Modular system supporting multiple trading strategies
- **Risk Management**: Real-time position monitoring and automated stop-loss mechanisms
- **Data Pipeline**: Real-time market data integration from multiple exchanges
- **Security**: Bank-level encryption and multi-factor authentication

### User Experience Design
- **Dashboard**: Real-time portfolio performance with interactive charts
- **Strategy Builder**: Drag-and-drop interface for custom algorithm creation
- **Backtesting**: Historical performance simulation with detailed analytics
- **Mobile Experience**: Responsive design for on-the-go portfolio monitoring

### Website & Marketing Platform
- **Content Strategy**: Educational content explaining algorithmic trading concepts
- **SEO Optimization**: Technical and content optimization for trading-related keywords
- **Conversion Optimization**: A/B tested landing pages and signup funnels
- **Performance Tracking**: Comprehensive analytics and user behavior analysis

## Key Results & Impact

### Product Launch Success
- **Platform Launch**: Successfully delivered MVP in 12 months from concept
- **User Acquisition**: 5,000+ registered users within first 6 months
- **Algorithm Performance**: Average 15.7% annual return across strategy portfolio
- **System Reliability**: 99.97% uptime with zero trading execution failures

### Business Metrics
- **Revenue Growth**: $1.2M ARR within 18 months of launch
- **Customer Retention**: 78% monthly retention rate for premium subscribers
- **Market Penetration**: Top 10 ranking for "algorithmic trading platform" keywords
- **User Engagement**: Average 45 minutes daily platform usage per active user

### Technical Achievements
- **Trading Volume**: $50M+ in assets under algorithmic management
- **Latency Optimization**: Sub-10ms trade execution times
- **Algorithm Accuracy**: 67% win rate across strategy combinations
- **Scalability**: Platform supporting 10,000+ concurrent trading sessions

### Strategic Outcomes
- **Market Position**: Recognized as innovative player in retail algo-trading space
- **Partnership Development**: Integration partnerships with 3 major brokerages
- **Intellectual Property**: 2 patent applications for proprietary trading algorithms
- **Industry Recognition**: Featured in TechCrunch and Financial Planning Magazine

## Innovation Highlights

### 1. AI-Powered Strategy Recommendations
- **Problem**: Users struggling to select optimal trading strategies
- **Solution**: Machine learning engine analyzing user risk profile and market conditions
- **Result**: 40% improvement in user strategy selection and performance outcomes

### 2. Social Trading Network
- **Problem**: Isolated user experience limiting engagement and learning
- **Solution**: Community features allowing strategy sharing and performance comparison
- **Result**: 2.5x increase in user retention and 65% growth in premium conversions

### 3. Risk Management Framework
- **Problem**: Retail traders lacking institutional-level risk controls
- **Solution**: Automated portfolio monitoring with customizable risk parameters
- **Result**: 85% reduction in catastrophic loss events and improved user confidence

## Stakeholder Management

### Investor Relations
- **Board Reporting**: Monthly product updates and KPI dashboards
- **Fundraising Support**: Product demonstration and market validation for Series A
- **Strategic Planning**: Long-term product roadmap alignment with business objectives

### Regulatory Compliance
- **Legal Coordination**: Product feature compliance with SEC and FINRA regulations
- **Audit Preparation**: Documentation and process optimization for regulatory reviews
- **Policy Development**: Internal guidelines for algorithm transparency and user protection

### Customer Advocacy
- **User Research**: Monthly interviews and feedback sessions with active traders
- **Community Management**: Direct engagement in user forums and support channels
- **Feature Prioritization**: User-driven roadmap decisions based on customer needs

## Technologies & Skills Applied
- **Product Strategy**: Vision development, market analysis, competitive positioning
- **Financial Technology**: Trading systems, risk management, regulatory compliance
- **Team Leadership**: Cross-functional team coordination and performance management
- **User Experience**: Interface design, user journey optimization, accessibility
- **Data Analytics**: User behavior analysis, A/B testing, performance metrics
- **Go-to-Market**: Launch strategy, customer acquisition, retention optimization`,
      excerpt:
        'Led complete product lifecycle for algorithmic trading platform as Head of Product, from concept to production with comprehensive market launch.',
      thumbnail:
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      demoUrl: 'https://www.stagstrat.com',
      githubUrl: '',
      category: 'FinTech',
      featured: true,
      sortOrder: 2,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-08-20'),
      views: 980,
      likes: 67,
    },
    {
      title: 'adidas Internal Admin Portal',
      slug: 'adidas-internal-admin-portal',
      description:
        'Product lifecycle management for adidas internal administration portal, streamlining operations across international teams.',
      content: `# adidas Internal Admin Portal

## Executive Summary
Managed the complete product lifecycle for adidas internal admin portal, focusing on operational efficiency and user experience improvements. Led development teams to deliver tools that enhanced productivity for internal stakeholders globally.

## Business Challenge
The adidas internal operations faced significant efficiency bottlenecks:
- **Fragmented Systems**: 15+ separate tools for different administrative functions
- **Manual Processes**: Paper-based workflows causing delays and errors
- **Global Coordination**: Inconsistent processes across international offices
- **Data Silos**: Lack of centralized reporting and analytics capabilities
- **User Experience**: Complex interfaces reducing employee productivity

## Strategic Approach

### Stakeholder Analysis
- **Primary Users**: 1,000+ internal employees across departments
- **Geographic Scope**: 25+ countries with varying operational requirements
- **Key Departments**: HR, Finance, Legal, Operations, Marketing, IT
- **Executive Stakeholders**: C-level sponsors requiring ROI demonstration

### Product Vision & Strategy
- **Unified Platform**: Single sign-on portal consolidating all administrative functions
- **Process Automation**: Workflow digitization reducing manual intervention by 60%
- **Global Standardization**: Consistent processes while accommodating local requirements
- **Data-Driven Insights**: Real-time analytics for operational decision making

## Team Leadership & Project Management

### Cross-Functional Team (13+ People)
- **Product Management**: Led overall strategy and stakeholder coordination
- **Backend Engineering**: 4 developers for API development and system integration
- **Frontend Engineering**: 3 developers for Angular-based user interface
- **UX/UI Design**: 2 designers focused on internal user experience optimization
- **QA Engineering**: 2 testers for comprehensive system validation
- **DevOps**: 2 engineers for deployment and infrastructure management

### Agile Methodology Implementation
- **Sprint Planning**: Bi-weekly sprints with clear deliverables and acceptance criteria
- **Stakeholder Reviews**: Monthly demonstrations with departmental representatives
- **User Testing**: Quarterly usability sessions with representative user groups
- **Retrospectives**: Continuous improvement cycles for team and process optimization

### International Coordination
- **Multi-timezone Meetings**: Daily standups accommodating global team distribution
- **Cultural Considerations**: User experience adaptations for different regions
- **Language Support**: Multi-language interface supporting 12 languages
- **Local Compliance**: Regional regulatory requirements and data privacy laws

## Technical Implementation

### Architecture & Technology Stack
- **Frontend**: Angular framework with TypeScript for scalable user interface
- **Backend**: Java Spring Boot microservices architecture
- **Database**: MySQL with Redis caching for performance optimization
- **Authentication**: Single sign-on integration with Active Directory
- **Deployment**: Jenkins CI/CD pipeline with automated testing and deployment

### System Integration
- **ERP Integration**: SAP system connectivity for financial and operational data
- **HR Systems**: Workday integration for employee management functions
- **Document Management**: SharePoint integration for file storage and collaboration
- **Email Systems**: Outlook integration for notification and communication workflows

### Security & Compliance
- **Data Encryption**: End-to-end encryption for sensitive information handling
- **Access Controls**: Role-based permissions with audit logging
- **GDPR Compliance**: Data privacy controls for European operations
- **Security Audits**: Quarterly penetration testing and vulnerability assessments

## Key Results & Impact

### Operational Efficiency
- **45% Productivity Increase**: Measured through task completion time reduction
- **60% Process Automation**: Manual workflow elimination across departments
- **1000+ Daily Active Users**: High adoption rate across global organization
- **25 Countries Supported**: Successful rollout to all major adidas markets

### User Experience Improvements
- **Task Completion Time**: 70% reduction in average administrative task duration
- **User Satisfaction**: 85% positive feedback in quarterly user surveys
- **Training Reduction**: 50% decrease in required onboarding time for new employees
- **Error Rates**: 80% reduction in data entry errors through automation

### Technical Performance
- **System Reliability**: 99.8% uptime with minimal downtime incidents
- **Response Times**: Sub-2-second page load times across all modules
- **Scalability**: Platform supporting 10x user growth without performance degradation
- **Security**: Zero security incidents or data breaches during operation

### Business Impact
- **Cost Savings**: $2.3M annual savings from process automation and efficiency gains
- **ROI Achievement**: 340% return on investment within 18 months
- **Global Standardization**: Consistent processes across all international offices
- **Compliance Improvement**: 100% audit compliance across all jurisdictions

## Feature Highlights

### 1. Unified Dashboard
- **Personalized Interface**: Role-based dashboard with relevant widgets and metrics
- **Real-time Analytics**: Live data visualization for operational KPIs
- **Quick Actions**: One-click access to frequently used administrative functions
- **Result**: 60% improvement in daily task completion efficiency

### 2. Workflow Automation Engine
- **Process Designer**: Drag-and-drop interface for creating automated workflows
- **Approval Chains**: Configurable multi-level approval processes with notifications
- **Status Tracking**: Real-time visibility into request progress and bottlenecks
- **Result**: 85% reduction in manual approval processing time

### 3. Global Reporting System
- **Cross-departmental Analytics**: Unified reporting across all business functions
- **Custom Dashboards**: Self-service analytics with drag-and-drop report builder
- **Export Capabilities**: Multiple format support (PDF, Excel, CSV) for data sharing
- **Result**: 70% faster executive reporting and decision-making processes

## Stakeholder Management & Communication

### Executive Reporting
- **Monthly Dashboards**: KPI tracking and project progress for C-level stakeholders
- **Quarterly Reviews**: Business impact assessment and future roadmap planning
- **ROI Documentation**: Detailed cost-benefit analysis and value realization tracking

### User Advocacy
- **User Advisory Group**: Representatives from each department for feedback and testing
- **Training Programs**: Comprehensive onboarding and ongoing education initiatives
- **Help Desk Integration**: Seamless support experience with ticketing system integration

### Change Management
- **Communication Strategy**: Multi-channel approach for feature announcements and updates
- **Adoption Campaigns**: Gamification and incentives for early adopters
- **Success Stories**: Internal case studies highlighting departmental improvements

## Innovation & Continuous Improvement

### Process Optimization
- **Analytics-Driven Insights**: User behavior analysis for interface optimization
- **A/B Testing**: Feature comparison testing for optimal user experience
- **Performance Monitoring**: Real-time system metrics with proactive issue resolution

### Technology Evolution
- **Mobile Optimization**: Responsive design supporting tablet and smartphone usage
- **API Development**: REST API creation for third-party integrations
- **Cloud Migration**: Infrastructure modernization for improved scalability and reliability

## Technologies & Skills Applied
- **Product Management**: Lifecycle management, stakeholder coordination, strategic planning
- **Enterprise Software**: Large-scale system design and implementation
- **Team Leadership**: Cross-functional team management across multiple time zones
- **Process Optimization**: Workflow analysis and automation implementation
- **International Operations**: Global rollout coordination and cultural adaptation
- **Change Management**: Organizational transformation and user adoption strategies`,
      excerpt:
        'Managed complete product lifecycle for adidas internal admin portal, achieving 45% productivity increase across 1000+ global employees.',
      thumbnail:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Enterprise Software',
      featured: false,
      sortOrder: 3,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-04-10'),
      views: 720,
      likes: 45,
    },
    {
      title: 'Social Commerce Engine (adiSCom)',
      slug: 'social-commerce-engine-adiscom',
      description:
        'Product management for in-house developed social commerce engine and third-party tool Sprinklr integration at adidas.',
      content: `# Social Commerce Engine (adiSCom)

## Executive Summary
Led product management for multiple products including the in-house developed social commerce engine (adiSCom) and third-party tool Sprinklr. Managed external teams and coordinated complex integrations to enhance social media presence and e-commerce capabilities.

## Strategic Context
adidas recognized the growing importance of social commerce in the digital landscape:
- **Social Media Growth**: 80% of consumers influenced by social media in purchase decisions
- **E-commerce Evolution**: Need for seamless shopping experiences across social platforms
- **Brand Engagement**: Opportunity to enhance customer relationship through social interactions
- **Global Reach**: Requirement to manage social presence across 15+ international markets
- **Integration Complexity**: Challenge of unifying social platforms with e-commerce infrastructure

## Product Portfolio Management

### adiSCom (Social Commerce Engine)
- **Platform Vision**: Native social shopping experience integrated with adidas ecosystem
- **Target Platforms**: Instagram, Facebook, TikTok, Twitter, Pinterest, YouTube
- **Core Functionality**: Product catalog integration, social checkout, influencer partnerships
- **Global Scope**: Multi-language support across international markets

### Sprinklr Integration
- **Third-party Platform**: Enterprise social media management and customer experience platform
- **Use Case**: Unified social media monitoring, engagement, and analytics
- **Stakeholder Coordination**: External vendor management and internal team alignment
- **Custom Development**: API integrations and workflow customization

## Team Structure & Leadership

### Internal Product Team (13+ People)
- **Product Management**: Overall strategy and roadmap coordination
- **Frontend Development**: 4 engineers for user-facing social commerce interfaces
- **Backend Engineering**: 3 engineers for API development and system integrations
- **Social Media Specialists**: 3 experts in platform-specific optimization and content strategy
- **UX/UI Design**: 2 designers focused on social commerce user experience
- **Quality Assurance**: 1 engineer for cross-platform testing and validation

### External Team Coordination
- **Sprinklr Partnership**: Direct collaboration with vendor product and engineering teams
- **Agency Partners**: Social media agencies for content creation and campaign management
- **Platform Relations**: Direct partnerships with Meta, TikTok, and other social platforms
- **Freelance Specialists**: Platform-specific experts for emerging social commerce features

## Product Development & Implementation

### adiSCom Engine Development

#### Technical Architecture
- **Microservices**: Scalable architecture supporting multiple social platform integrations
- **API-First Design**: RESTful APIs enabling third-party integrations and mobile applications
- **Real-time Processing**: Event-driven architecture for instant social media interaction handling
- **Performance Optimization**: CDN implementation and caching strategies for global reach

#### Core Features
- **Social Catalog**: Product discovery through social media with direct purchase capabilities
- **Influencer Tools**: Partnership management system with performance tracking and payments
- **User-Generated Content**: Customer review and photo integration with moderation workflows
- **Social Checkout**: Streamlined purchase flow without leaving social media platforms

### Sprinklr Platform Integration

#### Implementation Strategy
- **Phased Rollout**: Gradual platform integration across departments and regions
- **Training Programs**: Comprehensive onboarding for social media and customer service teams
- **Workflow Customization**: Platform configuration optimized for adidas-specific processes
- **Data Integration**: CRM and analytics system connectivity for unified customer view

#### Advanced Capabilities
- **Social Listening**: Brand monitoring and sentiment analysis across platforms
- **Customer Service**: Unified inbox for social media customer support inquiries
- **Campaign Management**: Cross-platform social media campaign coordination and optimization
- **Analytics Dashboard**: Performance tracking and ROI measurement for social initiatives

## Key Results & Impact

### Business Performance
- **100% Integration Success**: All planned social platforms successfully connected
- **Social Commerce Revenue**: $15M+ attributed revenue from social commerce initiatives
- **Global Reach**: 10+ international markets with localized social commerce experiences
- **Platform Coverage**: 13 social media platforms integrated with unified management

### User Engagement Metrics
- **Social Conversion**: 25% improvement in social media to purchase conversion rates
- **Engagement Growth**: 60% increase in social media engagement across platforms
- **User-Generated Content**: 200% growth in customer-created content and reviews
- **Influencer Partnerships**: 150+ active influencer collaborations with performance tracking

### Operational Efficiency
- **Team Productivity**: 40% improvement in social media management efficiency through Sprinklr
- **Response Time**: 75% reduction in customer service response time on social platforms
- **Campaign Effectiveness**: 35% improvement in social media campaign ROI
- **Content Performance**: Data-driven content optimization leading to 45% better engagement

### Technical Achievements
- **System Reliability**: 99.9% uptime across all social commerce integrations
- **Scalability**: Platform supporting 10M+ monthly social commerce interactions
- **Performance**: Sub-3-second page load times for social commerce experiences
- **Security**: Zero security incidents with comprehensive data protection implementation

## Innovation Highlights

### 1. AI-Powered Content Optimization
- **Problem**: Difficulty optimizing content performance across multiple social platforms
- **Solution**: Machine learning algorithms analyzing engagement patterns and optimizing content
- **Result**: 50% improvement in content engagement and 30% increase in conversion rates

### 2. Influencer Performance Analytics
- **Problem**: Lack of transparent ROI measurement for influencer partnerships
- **Solution**: Comprehensive tracking system with attribution modeling and performance dashboards
- **Result**: 40% improvement in influencer campaign effectiveness and budget optimization

### 3. Social Commerce AR Integration
- **Problem**: Limited product visualization in social commerce experiences
- **Solution**: Augmented reality try-on experiences integrated with social platforms
- **Result**: 70% reduction in return rates and 25% increase in social commerce conversions

## Platform-Specific Achievements

### Instagram Shopping
- **Product Catalog Integration**: 10,000+ products available through Instagram Shop
- **Story Shopping**: Interactive product stickers with direct purchase capabilities
- **Influencer Collaboration**: Branded content tools with performance tracking

### TikTok for Business
- **TikTok Shopping**: Product showcase integration with TikTok's commerce features
- **Hashtag Campaigns**: Viral marketing campaigns with user-generated content
- **Creator Partnerships**: Long-term collaborations with TikTok content creators

### Facebook & Meta Platforms
- **Facebook Shops**: Comprehensive storefront with full product catalog
- **WhatsApp Business**: Customer service integration with purchase capabilities
- **Meta Ads Integration**: Social commerce campaigns with advanced targeting

## Stakeholder Management

### Internal Coordination
- **Marketing Alignment**: Social media strategy coordination with brand marketing teams
- **E-commerce Integration**: Seamless connection with existing online store infrastructure
- **Customer Service**: Training and integration with social customer support workflows
- **Regional Teams**: International market coordination and localization support

### External Partnership Management
- **Platform Relations**: Direct communication with Meta, TikTok, Twitter for feature access
- **Vendor Coordination**: Sprinklr partnership management and feature development
- **Agency Partnerships**: Creative agency coordination for content and campaign development
- **Influencer Network**: Relationship management with key brand ambassadors and creators

## Challenges & Solutions

### Technical Integration Complexity
- **Challenge**: Diverse API standards across social platforms
- **Solution**: Unified integration layer with platform-specific adapters
- **Result**: Streamlined development process and consistent user experience

### Global Compliance Requirements
- **Challenge**: Different data privacy and e-commerce regulations across markets
- **Solution**: Modular compliance framework with regional customization
- **Result**: 100% regulatory compliance across all international markets

### Cross-Platform Consistency
- **Challenge**: Maintaining brand consistency across diverse social media platforms
- **Solution**: Unified design system with platform-specific optimizations
- **Result**: Cohesive brand experience while maximizing platform-native engagement

## Technologies & Skills Applied
- **Social Commerce**: Platform integration, user experience optimization, conversion funnel design
- **Team Leadership**: Cross-functional coordination across internal and external teams
- **Product Strategy**: Multi-platform strategy development and execution
- **Vendor Management**: Third-party tool integration and relationship management
- **International Markets**: Global rollout coordination and localization management
- **Performance Analytics**: Social media ROI measurement and optimization strategies`,
      excerpt:
        'Led product management for social commerce engine and Sprinklr integration, achieving 100% platform integration success across 10+ social platforms.',
      thumbnail:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Social Commerce',
      featured: false,
      sortOrder: 4,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-05-25'),
      views: 650,
      likes: 38,
    },
    {
      title: 'SaaS Platform Product Innovation & Team Building',
      slug: 'saas-platform-innovation-team-building',
      description:
        'Built and led product team for SaaS platform serving 50M+ users, implementing innovation processes that increased feature adoption by 60%.',
      content: `# SaaS Platform Product Innovation & Team Building

## Executive Summary
Built and scaled the product organization for a B2B SaaS platform serving 50M+ end users across enterprise clients. Led innovation initiatives that transformed product development velocity and increased feature adoption by 60%.

## Challenge
The SaaS platform faced several critical issues:
- **Slow Feature Delivery**: 6-month average development cycles
- **Low Adoption Rates**: New features achieving only 15% user adoption
- **Team Silos**: Engineering, design, and product working independently
- **Customer Churn**: Enterprise clients citing lack of innovation as primary churn reason

## Team Building & Organization

### Product Team Structure (13+ People)
- **Product Managers**: 4 senior PMs covering core platform, integrations, analytics, mobile
- **UX/UI Design**: 3 designers focused on enterprise user experience
- **Product Analytics**: 2 analysts for data-driven decision making
- **Technical Product**: 2 technical PMs for API strategy and platform architecture
- **International Product**: 2 PMs for global market requirements

### Leadership Philosophy
- **Outcome-Focused**: OKRs tied to customer success metrics, not feature delivery
- **Customer-Centric**: Direct customer contact for all team members
- **Data-Driven**: Every decision backed by user research and analytics
- **Innovation Culture**: 20% time for experimental features and improvements

## Innovation Framework Implementation

### 1. Customer Discovery Process
- **Weekly Customer Interviews**: 15+ interviews per week across team
- **Usage Analytics**: Real-time dashboards tracking feature adoption and engagement
- **Feedback Integration**: Direct customer feedback loops into product roadmap
- **Customer Advisory Board**: Quarterly sessions with key enterprise clients

### 2. Rapid Experimentation
- **Feature Flags**: A/B testing for all new features with gradual rollouts
- **Prototype First**: High-fidelity prototypes before development investment
- **MVP Methodology**: Minimum viable features with iterative improvement
- **Innovation Sprints**: Monthly innovation weeks for exploring new concepts

### 3. Cross-functional Collaboration
- **Daily Standups**: Product, design, and engineering alignment
- **Design Thinking Workshops**: Weekly collaborative problem-solving sessions
- **Technical Reviews**: Monthly architecture and scalability planning
- **Customer Journey Mapping**: Quarterly cross-team customer experience optimization

## Key Results & Impact

### Product Performance
- **60% Feature Adoption Increase**: From 15% to 24% average feature adoption
- **3x Faster Delivery**: Development cycles reduced from 6 months to 2 months
- **40% User Engagement Growth**: Monthly active usage across platform features
- **25% Customer Satisfaction Improvement**: NPS scores increased from 42 to 67

### Business Impact
- **$85M ARR Growth**: Directly attributed to product improvements and new features
- **18% Churn Reduction**: Enterprise client retention through innovation
- **35% Upsell Increase**: Advanced features driving account expansion
- **50M+ Users Served**: Platform scaling to support massive enterprise deployments

### Team Development
- **100% Team Retention**: Zero voluntary turnover during transformation period
- **3 Internal Promotions**: Team members advancing to senior product roles
- **Industry Recognition**: Team winning 2 SaaS innovation awards
- **Best Practices**: Framework adopted by other product teams in organization

## Innovation Highlights

### 1. AI-Powered Analytics Dashboard
- **Problem**: Customers struggling with complex data interpretation
- **Solution**: Machine learning insights with natural language explanations
- **Result**: 78% adoption rate, 45% increase in customer data usage

### 2. Enterprise Integration Platform
- **Problem**: Custom integrations taking 3-6 months per client
- **Solution**: Self-service integration platform with pre-built connectors
- **Result**: Integration time reduced to 2-3 weeks, 40% increase in enterprise deals

### 3. Mobile-First Redesign
- **Problem**: Poor mobile experience limiting user engagement
- **Solution**: React Native platform with offline-first architecture
- **Result**: 65% increase in mobile usage, 30% improvement in user satisfaction

## Leadership & Management Approach

### Team Development
- **1:1 Coaching**: Weekly individual development sessions
- **Skills Assessment**: Quarterly capability reviews and growth planning
- **Cross-training**: Rotation programs across product areas
- **External Learning**: Conference attendance and industry certification support

### Stakeholder Management
- **Executive Reporting**: Monthly board-level product updates
- **Customer Advocacy**: Direct customer relationship management
- **Engineering Partnership**: Technical roadmap alignment and resource planning
- **Sales Enablement**: Product marketing and competitive positioning support

### Process Innovation
- **Agile Transformation**: Scrum and Kanban optimization for product workflow
- **Quality Gates**: Automated testing and quality assurance integration
- **Customer Feedback Loop**: Continuous feedback integration into development cycles
- **Performance Metrics**: Real-time dashboards for team productivity and customer impact

## Technologies & Skills Applied
- **Product Strategy**: Vision, roadmap, and market positioning
- **Team Leadership**: Hiring, development, and performance management
- **Agile Methodologies**: Scrum, Kanban, and continuous improvement
- **Customer Research**: User interviews, surveys, and behavioral analysis
- **Data Analytics**: Product metrics, A/B testing, and business intelligence
- **Stakeholder Management**: Executive communication and cross-functional alignment`,
      excerpt:
        'Built and led 13+ person product team for SaaS platform serving 50M+ users, implementing innovation processes that increased feature adoption by 60%.',
      thumbnail:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Team Leadership',
      featured: true,
      sortOrder: 5,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-07-12'),
      views: 1100,
      likes: 78,
    },
    {
      title: 'Mobile App Growth Strategy & International Expansion',
      slug: 'mobile-app-growth-international-expansion',
      description:
        'Drove mobile app growth from 5M to 80M+ users while expanding to 15 countries, implementing data-driven growth strategies.',
      content: `# Mobile App Growth Strategy & International Expansion

## Executive Summary
Led the growth and international expansion of a consumer mobile application from 5M to 80M+ users across 15 countries. Implemented comprehensive growth strategy combining user acquisition, retention optimization, and market localization.

## Challenge & Opportunity
The mobile app had achieved initial traction but faced growth plateau:
- **Stagnant User Growth**: Plateaued at 5M users with declining acquisition rates
- **High Churn Rate**: 35% monthly churn limiting long-term growth
- **Single Market Dependency**: 85% of users concentrated in home market
- **Monetization Challenges**: Low ARPU limiting business sustainability

## Strategic Growth Framework

### 1. Growth Analytics & Measurement
- **Cohort Analysis**: Deep-dive user behavior tracking and retention patterns
- **Funnel Optimization**: Complete user journey analysis from acquisition to activation
- **Attribution Modeling**: Multi-touch attribution across marketing channels
- **Predictive Analytics**: Machine learning models for churn prediction and LTV

### 2. User Acquisition Strategy
- **Channel Diversification**: Expansion from 3 to 12 marketing channels
- **Performance Marketing**: Data-driven paid acquisition across social platforms
- **Viral Mechanics**: In-app referral system with gamification elements
- **Content Marketing**: SEO-optimized content strategy driving organic growth

### 3. Retention & Engagement Optimization
- **Onboarding Redesign**: Reduced time-to-value from 5 days to 1 day
- **Push Notification Strategy**: Personalized messaging increasing engagement by 45%
- **Feature Usage Analysis**: Data-driven feature prioritization and optimization
- **Community Building**: In-app social features fostering user connections

## International Expansion Strategy

### Market Research & Prioritization
- **Market Sizing**: TAM/SAM analysis across 25+ potential markets
- **Competitive Landscape**: Local competitor analysis and positioning strategy
- **Regulatory Requirements**: Data privacy, content regulations, and app store compliance
- **Cultural Analysis**: User behavior patterns and localization requirements

### Localization Framework
- **Language Localization**: Translation and cultural adaptation for 12 languages
- **Payment Methods**: Local payment integration and currency support
- **Content Strategy**: Market-specific content and user experience customization
- **Marketing Adaptation**: Channel preferences and creative localization

### Regional Team Building
- **Local Market Experts**: Hiring regional product and marketing talent
- **Partnership Strategy**: Local influencer and business partnerships
- **Customer Support**: Multilingual support teams across time zones
- **Compliance Management**: Legal and regulatory expertise in each market

## Key Results & Impact

### User Growth Metrics
- **80M+ Active Users**: 16x growth from initial 5M user base
- **15 International Markets**: Successful expansion across 4 continents
- **65% Retention Improvement**: Monthly churn reduced from 35% to 12%
- **4.2x LTV Increase**: Through improved retention and monetization

### Acquisition Performance
- **12 Marketing Channels**: Diversified acquisition reducing single-channel risk
- **40% CAC Reduction**: Optimization and channel mix improving unit economics
- **2.8M Organic Installs**: Monthly organic growth through viral mechanics
- **350% Paid ROI**: Performance marketing achieving strong return on ad spend

### International Success
- **45% International Users**: Reduced single-market dependency significantly
- **8 Top-10 Rankings**: App store rankings in key international markets
- **25% Higher ARPU**: International users showing stronger monetization
- **92% Localization Score**: Cultural adaptation leading to high user satisfaction

### Business Impact
- **$120M+ Revenue**: Direct attribution to growth and expansion initiatives
- **Series B Funding**: Growth metrics supporting $25M funding round
- **Market Leadership**: #1 ranking in 3 categories across multiple markets
- **Strategic Acquisition**: Company acquired by major tech platform for $180M

## Growth Tactics & Innovations

### 1. Viral Referral System
- **Gamified Sharing**: Point-based system encouraging user referrals
- **Social Integration**: Seamless sharing across social media platforms
- **Reward Optimization**: A/B tested reward structures maximizing participation
- **Result**: 35% of new users acquired through referrals

### 2. Personalization Engine
- **Machine Learning**: AI-driven content and feature recommendations
- **Behavioral Segmentation**: User clustering for targeted engagement
- **Dynamic Content**: Real-time content adaptation based on user preferences
- **Result**: 45% increase in daily active usage and 28% longer session times

### 3. International Growth Hacks
- **Local Influencer Partnerships**: Micro-influencer campaigns in each market
- **Cultural Event Marketing**: Seasonal and cultural moment activation
- **Language-Specific Features**: Market-specific functionality and content
- **Result**: 60% faster market penetration compared to organic expansion

## Leadership & Team Management

### Cross-functional Growth Team
- **Growth Product Managers**: 3 PMs focused on acquisition, retention, monetization
- **Data Scientists**: 2 analysts for growth modeling and experimentation
- **Marketing Specialists**: 4 regional marketing experts
- **International Operations**: 3 specialists for localization and compliance
- **Engineering**: 5 engineers dedicated to growth infrastructure

### Management Philosophy
- **Data-Driven Culture**: All decisions backed by statistical significance
- **Rapid Experimentation**: Weekly A/B tests and monthly major experiments
- **Customer Obsession**: Direct user feedback integration into strategy
- **Global Mindset**: Cultural sensitivity and local market expertise

### Performance Management
- **OKR Framework**: Quarterly objectives aligned with growth metrics
- **Weekly Growth Reviews**: Cross-functional alignment and performance tracking
- **Monthly Market Assessment**: International performance and optimization
- **Quarterly Strategy Updates**: Market expansion and tactical adjustments

## Technologies & Skills Applied
- **Growth Strategy**: User acquisition, retention, and monetization optimization
- **International Markets**: Market research, localization, and cultural adaptation
- **Data Analytics**: Cohort analysis, funnel optimization, predictive modeling
- **Team Leadership**: Cross-functional team management and international coordination
- **Performance Marketing**: Paid acquisition across multiple channels and platforms
- **Product Strategy**: Feature prioritization and user experience optimization`,
      excerpt:
        'Led mobile app growth from 5M to 80M+ users across 15 international markets, implementing comprehensive growth and localization strategies.',
      thumbnail:
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Growth Strategy',
      featured: false,
      sortOrder: 6,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-09-05'),
      views: 890,
      likes: 56,
    },
  ]

  const createdProjects = []
  for (const project of projects) {
    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        excerpt: project.excerpt,
        thumbnail: project.thumbnail,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        category: project.category,
        status: project.status as any,
        featured: project.featured,
        sortOrder: project.sortOrder,
        views: 0,
        likes: 0,
        publishedAt: project.publishedAt,
        technologies: {
          set: [], // Clear existing
          connect: [
            { id: jiraTech?.id },
            { id: leadershipTech?.id },
            { id: internationalTech?.id },
            { id: agileTech?.id },
            { id: figmaTech?.id },
          ].filter(Boolean),
        },
      },
      create: {
        title: project.title,
        slug: project.slug,
        description: project.description,
        content: project.content,
        excerpt: project.excerpt,
        thumbnail: project.thumbnail,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        category: project.category,
        status: project.status as any,
        featured: project.featured,
        sortOrder: project.sortOrder,
        views: 0,
        likes: 0,
        publishedAt: project.publishedAt,
        authorId: admin.id,
        technologies: {
          connect: [
            { id: jiraTech?.id },
            { id: leadershipTech?.id },
            { id: internationalTech?.id },
            { id: agileTech?.id },
            { id: figmaTech?.id },
          ].filter(Boolean),
        },
      },
    })
    createdProjects.push(createdProject)
  }

  console.log('✅ Projects created:', createdProjects.length)

  // Create Product Management focused blog posts
  const pmTag = createdTags.find(t => t.slug === 'product-management')
  const leadershipTag = createdTags.find(t => t.slug === 'strategic-leadership')
  const scaleTag = createdTags.find(t => t.slug === 'scale-performance')

  const blogPosts = [
    {
      title: 'Scaling Product Teams: Lessons from Managing 165M+ Users',
      slug: 'scaling-product-teams-165m-users',
      content: `# Scaling Product Teams: Lessons from Managing 165M+ Users

## Introduction
When you're responsible for products serving 165M+ users, traditional product management approaches break down. Here are the key lessons I've learned about scaling product teams and processes.

## The Scale Challenge
At massive scale, every decision has exponential impact. A 1% improvement in conversion affects 1.65M users. A performance issue can crash revenue. The stakes are high, and traditional approaches don't work.

## Key Principles for Scale

### 1. Infrastructure-First Thinking
Before building features, ensure your infrastructure can handle the load. We learned this the hard way when a viral feature brought down our platform.

### 2. Data-Driven Everything
At scale, intuition fails. Every decision must be backed by data. We implemented real-time analytics across all product metrics.

### 3. Autonomous Teams
Centralized decision-making becomes a bottleneck. Teams need authority to move fast within strategic guardrails.

## Conclusion
Scaling product teams requires fundamental shifts in thinking, process, and leadership approach.`,
      excerpt:
        'Key lessons learned from scaling product teams and managing products serving 165M+ users across international markets.',
      thumbnail:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      category: 'Product Management',
      featured: true,
      readTime: 8,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
    },
    {
      title: 'International Product Strategy: Expanding to 12+ Markets',
      slug: 'international-product-strategy-12-markets',
      content: `# International Product Strategy: Expanding to 12+ Markets

## The Global Challenge
Expanding a product internationally isn't just about translation. It requires deep understanding of local markets, regulations, and user behaviors.

## Market Research Framework
Our approach to international expansion:
1. Market sizing and opportunity analysis
2. Competitive landscape assessment
3. Regulatory and compliance requirements
4. Cultural and behavioral analysis
5. Technical infrastructure needs

## Localization Strategy
True localization goes beyond language:
- Payment methods and currency
- Cultural design preferences
- Local partnerships and integrations
- Customer support and community

## Results
Successfully expanded to 12 markets with strong local adoption and market leadership positions.`,
      excerpt:
        'Strategic framework for international product expansion across 12+ markets, including localization and market entry strategies.',
      thumbnail:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      category: 'Strategy',
      featured: false,
      readTime: 6,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
    },
    {
      title:
        'Building High-Performance Product Teams: A 13-Person Leadership Journey',
      slug: 'building-high-performance-product-teams-13-person-leadership',
      content: `# Building High-Performance Product Teams: A 13-Person Leadership Journey

## The Leadership Challenge
Leading a 13-person product team across multiple time zones and disciplines requires a fundamentally different approach than managing smaller groups. Here's what I learned building high-performance teams at scale.

## Team Structure & Composition

### Multi-Disciplinary Excellence
Our 13-person team structure included:
- **4 Product Managers**: Covering core platform, integrations, analytics, and mobile
- **3 UX/UI Designers**: Focused on enterprise user experience optimization
- **2 Product Analysts**: Data-driven insights and A/B testing coordination
- **2 Technical Product Managers**: API strategy and platform architecture
- **2 International PMs**: Global market requirements and localization

### Geographic Distribution
Managing talent across:
- **Europe**: 5 team members across Germany, Austria, and UK
- **North America**: 4 team members in US and Canada
- **Asia-Pacific**: 4 team members in Singapore and Australia

## Leadership Philosophy & Approach

### 1. Outcome-Focused Culture
- **OKR Framework**: Quarterly objectives tied to customer success metrics
- **Impact Measurement**: Every initiative tracked through business impact, not just delivery
- **Customer Obsession**: Direct customer contact required for all team members
- **Data-Driven Decisions**: No major decisions without statistical backing

### 2. Autonomous Excellence
- **Decision Authority**: Teams empowered to make product decisions within strategic guardrails
- **Innovation Time**: 20% time allocation for experimental features and process improvements
- **Cross-functional Ownership**: Each PM owns end-to-end user journeys, not just features
- **Continuous Learning**: Monthly learning budget and conference attendance for all team members

### 3. Communication & Coordination
- **Daily Async Standups**: Written updates accommodating all time zones
- **Weekly All-Hands**: Video calls rotating times to include everyone fairly
- **Monthly In-Person**: Quarterly team gatherings for strategic planning and team building
- **Real-time Collaboration**: Slack, Miro, and Figma for seamless async work

## Building Team Performance

### Hiring & Onboarding
- **Competency-Based Hiring**: Technical skills + cultural fit + growth potential
- **90-Day Onboarding**: Structured program with customer interviews, product deep-dives, and mentorship
- **Buddy System**: Each new hire paired with experienced team member
- **Customer Immersion**: Direct customer contact within first 30 days

### Performance Management
- **Weekly 1:1s**: Individual coaching sessions focused on growth and obstacles
- **Quarterly Reviews**: Comprehensive feedback including peer input and customer impact
- **Career Development**: Individual growth plans with skill development and promotion paths
- **Recognition Programs**: Public acknowledgment of achievements and innovative solutions

### Team Development Initiatives
- **Cross-training**: Rotation programs across product areas and markets
- **Internal Speaking**: Team members presenting at company all-hands and external conferences
- **Mentorship**: Senior team members coaching junior PMs and analysts
- **Innovation Challenges**: Internal hackathons and product improvement competitions

## Key Results & Impact

### Team Performance Metrics
- **100% Retention Rate**: Zero voluntary turnover during 18-month period
- **3 Internal Promotions**: Team members advancing to senior product and leadership roles
- **Innovation Awards**: Team winning 2 industry recognition awards for product excellence
- **Best Practices Adoption**: Framework and processes adopted by 4 other product teams

### Business Impact Through Team Excellence
- **60% Feature Adoption Increase**: From 15% to 24% average adoption across new features
- **3x Faster Delivery**: Development cycles reduced from 6 months to 2 months
- **$85M ARR Growth**: Directly attributed to team-driven product improvements
- **50M+ Users Served**: Platform scaling to support massive enterprise deployments

### Team Health & Culture
- **Engagement Scores**: 95% positive in quarterly team satisfaction surveys
- **Innovation Culture**: 40+ experimental features tested quarterly
- **Knowledge Sharing**: Weekly internal learning sessions and documentation
- **Work-Life Balance**: Flexible schedules accommodating global team needs

## Leadership Lessons Learned

### 1. Trust & Autonomy Scale Performance
- **Delegation**: Micromanagement kills innovation at scale
- **Clear Boundaries**: Strategic guidelines enable autonomous decision-making
- **Accountability**: Regular check-ins without constant oversight
- **Support**: Remove obstacles and provide resources for team success

### 2. Communication is Everything
- **Over-Communicate**: Especially important with distributed teams
- **Multiple Channels**: Video, written, visual communication for different needs
- **Cultural Sensitivity**: Adapt communication styles for different cultural contexts
- **Feedback Loops**: Regular two-way feedback ensures alignment and improvement

### 3. Invest in People Development
- **Individual Growth**: Every team member has personalized development plan
- **Skills Investment**: Budget and time for continuous learning
- **Internal Mobility**: Create advancement opportunities within team and company
- **Recognition**: Celebrate wins and learn from failures together

## Framework for High-Performance Teams

### The SCALE Model
- **S**trategy: Clear vision and measurable objectives
- **C**ulture: Values-driven team behavior and decision-making
- **A**utonomy: Empowered teams with decision-making authority
- **L**earning: Continuous skill development and knowledge sharing
- **E**xecution: Disciplined approach to delivery and measurement

### Implementation Guidelines
1. **Start with Why**: Ensure every team member understands the mission and vision
2. **Define Success**: Clear metrics and regular measurement of progress
3. **Remove Friction**: Identify and eliminate obstacles to team productivity
4. **Celebrate Wins**: Regular recognition of achievements and milestones
5. **Iterate and Improve**: Continuous refinement of processes and approaches

This approach to building high-performance product teams has consistently delivered exceptional results across multiple organizations and market contexts.`,
      excerpt:
        'Comprehensive guide to building and leading high-performance product teams, based on experience managing 13+ person teams across multiple time zones.',
      thumbnail:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      category: 'Team Leadership',
      featured: true,
      readTime: 12,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-10-15'),
    },
    {
      title: 'From Concept to 165M Users: Product Strategy at Scale',
      slug: 'concept-to-165m-users-product-strategy-scale',
      content: `# From Concept to 165M Users: Product Strategy at Scale

## The Journey to Massive Scale
Building products that serve 165M+ users requires a fundamentally different approach to strategy than traditional product management. Here's the strategic framework that enabled this scale achievement.

## Strategic Foundation

### Vision & Mission Alignment
- **Global Vision**: Products that enhance daily life for users worldwide
- **Mission-Driven Development**: Every feature tied to measurable user value
- **Long-term Thinking**: 5-year strategic planning with quarterly tactical adjustments
- **Stakeholder Alignment**: Consistent messaging across all organizational levels

### Market Positioning Strategy
- **Category Creation**: Establishing new product categories rather than competing in existing ones
- **Differentiation**: Clear value propositions that set us apart from competitors
- **User Segmentation**: Deep understanding of user personas across global markets
- **Competitive Moats**: Building defensible advantages through network effects and data

## Scaling Strategy Framework

### Phase 1: Foundation (0-1M Users)
- **Product-Market Fit**: Obsessive focus on core user value proposition
- **Core Metrics**: DAU, retention, and user satisfaction as primary KPIs
- **Team Structure**: Small, cross-functional teams with direct user contact
- **Technology**: Scalable architecture from day one to avoid technical debt

### Phase 2: Growth (1M-10M Users)
- **Channel Diversification**: Multiple user acquisition channels to reduce dependency
- **Feature Expansion**: Strategic feature additions based on user feedback and data
- **International Preparation**: Localization framework and international market research
- **Operational Excellence**: Process standardization and quality assurance implementation

### Phase 3: Scale (10M-100M Users)
- **Global Expansion**: Systematic market entry across 15+ international markets
- **Platform Development**: API-first approach enabling third-party integrations
- **Team Scaling**: Distributed team structure with regional expertise
- **Infrastructure Investment**: Enterprise-grade systems for reliability and performance

### Phase 4: Optimization (100M+ Users)
- **Micro-Optimization**: A/B testing every aspect of user experience
- **Ecosystem Building**: Platform strategy with developer and partner programs
- **Advanced Analytics**: Machine learning for personalization and predictive insights
- **Sustainability**: Long-term business model optimization and market leadership

## Key Strategic Decisions

### 1. Technology Strategy
- **Cloud-First Architecture**: Built on AWS from inception for global scalability
- **Microservices**: Modular architecture enabling independent team velocity
- **API Strategy**: Platform approach allowing ecosystem development
- **Performance**: Sub-2-second global response times as non-negotiable requirement

### 2. International Strategy
- **Market Prioritization**: TAM analysis and competitive landscape assessment
- **Localization Approach**: Full cultural adaptation beyond simple translation
- **Regional Teams**: Local expertise for market-specific requirements
- **Compliance Framework**: Proactive approach to data privacy and regional regulations

### 3. User Experience Strategy
- **Mobile-First**: 70% of users on mobile devices drove design decisions
- **Accessibility**: WCAG 2.1 AA compliance across all features
- **Performance**: Core Web Vitals optimization for user retention
- **Personalization**: ML-driven content and feature recommendations

## Execution Excellence

### Data-Driven Decision Making
- **Real-Time Analytics**: Dashboard tracking 50+ KPIs across user journey
- **A/B Testing**: 100+ experiments running simultaneously across platform
- **User Research**: 15+ customer interviews per week across global markets
- **Behavioral Analysis**: Cohort analysis and funnel optimization for retention

### Team & Organizational Strategy
- **Cross-Functional Teams**: Product, engineering, design, and data working together
- **Autonomous Teams**: Decision-making authority at team level within strategic guidelines
- **Global Coordination**: Daily standups and weekly alignment across time zones
- **Talent Development**: Internal mobility and skill development programs

### Risk Management
- **Technical Risk**: Redundant systems and disaster recovery planning
- **Market Risk**: Diversified user base and revenue streams
- **Regulatory Risk**: Proactive compliance and legal partnership
- **Competitive Risk**: Innovation pipeline and IP protection strategy

## Measuring Success at Scale

### Primary KPIs
- **Daily Active Users**: 165M+ daily active users across global markets
- **User Engagement**: 45+ minutes average daily usage per active user
- **Global Reach**: Active users in 25+ countries with localized experiences
- **Revenue Growth**: $200M+ ARR with diversified monetization streams

### Secondary Metrics
- **User Satisfaction**: 4.7+ app store rating maintained across all markets
- **Performance**: 99.9% uptime with <2-second global response times
- **Team Health**: 90%+ employee satisfaction and minimal voluntary turnover
- **Innovation**: 20+ new features launched per quarter based on user feedback

## Strategic Lessons Learned

### 1. Scale Changes Everything
- **Infrastructure**: What works for 1M users breaks at 100M users
- **Decision Making**: Centralized control becomes bottleneck at scale
- **User Needs**: Mass market requires different approach than early adopters
- **Organization**: Team structure must evolve with user base growth

### 2. Global is Local
- **Cultural Adaptation**: One size fits all approach fails internationally
- **Local Expertise**: Regional teams essential for market success
- **Compliance Complexity**: Each market has unique regulatory requirements
- **Payment Methods**: Local payment preferences critical for monetization

### 3. Data is the Competitive Advantage
- **User Insights**: 165M users generate unprecedented behavioral data
- **Machine Learning**: Scale enables sophisticated personalization
- **Predictive Analytics**: Anticipate user needs and market trends
- **Network Effects**: User data improves product for all users

## Future Strategy Considerations

### Emerging Opportunities
- **AI Integration**: GPT and language models for enhanced user experience
- **Web3 Capabilities**: Blockchain and NFT integration for community building
- **AR/VR Expansion**: Spatial computing for immersive user experiences
- **Voice Interface**: Conversation AI for accessibility and convenience

### Strategic Challenges
- **Privacy Regulations**: Evolving data privacy laws across global markets
- **Platform Risk**: Dependency on mobile app stores and social platforms
- **Competitive Pressure**: Large tech companies entering our market space
- **Talent Competition**: Scaling technical and product talent globally

This strategic framework demonstrates that reaching 165M+ users requires disciplined execution, long-term thinking, and continuous adaptation to changing market conditions while maintaining focus on fundamental user value.`,
      excerpt:
        'Strategic framework and key decisions that enabled scaling from concept to 165M+ users, including global expansion and product strategy at massive scale.',
      thumbnail:
        'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&h=600&fit=crop',
      category: 'Product Strategy',
      featured: true,
      readTime: 15,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-11-01'),
    },
    {
      title:
        'Stakeholder Management in Complex Organizations: Lessons from Global Teams',
      slug: 'stakeholder-management-complex-organizations-global-teams',
      content: `# Stakeholder Management in Complex Organizations: Lessons from Global Teams

## The Complex Stakeholder Landscape
Managing stakeholders in global organizations with 165M+ users requires navigating intricate networks of interests, priorities, and cultural differences. Here's the framework I've developed for success.

## Understanding Stakeholder Complexity

### Internal Stakeholders
- **Executive Leadership**: C-level executives across multiple regions
- **Engineering Teams**: 50+ developers across frontend, backend, mobile, and infrastructure
- **Design Organization**: Global design system team and regional UX specialists
- **Data & Analytics**: Business intelligence, product analytics, and data science teams
- **Marketing & Growth**: Performance marketing, brand, content, and regional marketing teams
- **Sales & Customer Success**: Enterprise sales teams and customer support across time zones
- **Legal & Compliance**: Regional legal teams managing international regulations
- **Finance & Operations**: Budget owners and operational stakeholders globally

### External Stakeholders
- **Customers**: 165M+ end users with diverse needs and cultural contexts
- **Enterprise Clients**: B2B customers with complex integration requirements
- **Regulatory Bodies**: Government agencies across 25+ international markets
- **Technology Partners**: Platform providers, cloud vendors, and API integrations
- **Investor Community**: Board members, VCs, and financial analysts
- **Media & Analysts**: Industry publications and research firms

## Stakeholder Mapping & Prioritization

### The POWER-INTEREST Matrix
- **High Power, High Interest**: Executive sponsors and key customer segments
- **High Power, Low Interest**: Board members and major technology partners
- **Low Power, High Interest**: Individual contributors and power users
- **Low Power, Low Interest**: Regulatory bodies and industry analysts

### Influence Network Analysis
- **Decision Makers**: Who has final authority on key decisions
- **Influencers**: Who shapes opinions and recommendations
- **Implementers**: Who executes decisions and provides feedback
- **Impacted Parties**: Who is affected by decisions but lacks direct input

## Communication Strategy Framework

### Tailored Communication Approaches

#### Executive Leadership
- **Format**: Executive dashboards with key metrics and strategic updates
- **Frequency**: Monthly board reports and quarterly strategic reviews
- **Content**: Business impact, competitive positioning, and future roadmap
- **Success Metrics**: Revenue impact, user growth, and market share

#### Engineering Teams
- **Format**: Technical specifications, architecture reviews, and sprint planning
- **Frequency**: Daily standups, weekly technical reviews, and monthly planning
- **Content**: Technical requirements, performance metrics, and infrastructure needs
- **Success Metrics**: Delivery velocity, technical debt, and system reliability

#### International Teams
- **Format**: Regional market reports and localization requirements
- **Frequency**: Weekly regional updates and monthly global alignment calls
- **Content**: Market-specific insights, regulatory updates, and competitive analysis
- **Success Metrics**: Regional user growth, market penetration, and local partnerships

### Multi-Channel Communication
- **Written Documentation**: Detailed requirements, specifications, and strategic documents
- **Video Conferences**: Face-to-face alignment and complex discussion topics
- **Async Updates**: Slack channels and email for regular status communications
- **Visual Presentations**: Figma boards, Miro diagrams, and executive slide decks

## Alignment Strategies

### 1. Shared Vision & Objectives
- **Company OKRs**: Quarterly objectives cascading from company to team level
- **Product Roadmap**: Transparent roadmap with business justification for priorities
- **Success Metrics**: Aligned KPIs across all stakeholder groups
- **Regular Reviews**: Monthly alignment checks and quarterly strategic updates

### 2. Cross-Functional Collaboration
- **Product Councils**: Representatives from each functional area in decision-making
- **Working Groups**: Temporary teams for specific initiatives or challenges
- **Cross-Team Rotations**: Team members working with different functions temporarily
- **Shared Tools**: Common platforms for planning, tracking, and communication

### 3. Cultural Bridge Building
- **Cultural Training**: Understanding regional differences in communication and decision-making
- **Local Champions**: Regional advocates who understand both local and global perspectives
- **Time Zone Accommodation**: Meeting schedules that fairly distribute inconvenience
- **Celebration of Diversity**: Acknowledging and leveraging cultural differences as strengths

## Managing Conflicts & Disagreements

### Conflict Resolution Framework

#### 1. Early Identification
- **Regular Check-ins**: Proactive conversations to identify brewing conflicts
- **Feedback Loops**: Anonymous surveys and open feedback channels
- **Warning Signs**: Decreased collaboration, missed deadlines, or communication breakdowns
- **Escalation Triggers**: Clear criteria for when to involve higher-level intervention

#### 2. Root Cause Analysis
- **Interest vs. Position**: Understanding underlying needs vs. stated positions
- **Resource Constraints**: Identifying if conflicts stem from limited resources
- **Information Gaps**: Ensuring all parties have access to relevant information
- **Cultural Misunderstandings**: Recognizing when conflicts arise from cultural differences

#### 3. Resolution Strategies
- **Collaborative Problem-Solving**: Working together to find win-win solutions
- **Data-Driven Decisions**: Using metrics and research to resolve disagreements
- **Expert Mediation**: Bringing in neutral third parties when needed
- **Executive Escalation**: Clear escalation paths for unresolved conflicts

## Building Trust & Credibility

### Consistency & Reliability
- **Follow-Through**: Always delivering on commitments and promises
- **Transparent Communication**: Honest updates about challenges and setbacks
- **Predictable Processes**: Consistent approaches to decision-making and communication
- **Quality Standards**: Maintaining high standards in all deliverables and interactions

### Value Demonstration
- **Business Impact**: Clearly connecting product decisions to business outcomes
- **User Value**: Demonstrating how initiatives improve user experience and satisfaction
- **Efficiency Gains**: Showing how processes and tools improve organizational productivity
- **Risk Mitigation**: Proactively identifying and addressing potential problems

### Relationship Investment
- **Personal Connections**: Taking time to understand individual motivations and goals
- **Professional Development**: Supporting stakeholder growth and career advancement
- **Recognition**: Acknowledging stakeholder contributions and successes
- **Accessibility**: Being available for questions, concerns, and collaboration

## Measuring Stakeholder Success

### Relationship Health Metrics
- **Stakeholder Satisfaction**: Quarterly surveys measuring satisfaction with collaboration
- **Response Times**: Speed of stakeholder responses and engagement levels
- **Meeting Effectiveness**: Attendance rates and productive outcomes from meetings
- **Conflict Resolution**: Time to resolve disagreements and prevent recurrence

### Business Impact Metrics
- **Decision Velocity**: Speed of reaching decisions with stakeholder alignment
- **Implementation Success**: Success rate of initiatives requiring stakeholder cooperation
- **Resource Efficiency**: Optimal use of resources through effective stakeholder coordination
- **Strategic Alignment**: Degree of alignment between stakeholder actions and company strategy

## Advanced Stakeholder Strategies

### Stakeholder Development
- **Capability Building**: Helping stakeholders develop skills needed for collaboration
- **Information Sharing**: Providing stakeholders with context and insights for better decisions
- **Network Facilitation**: Connecting stakeholders who can benefit from collaboration
- **Succession Planning**: Developing backup relationships and knowledge transfer

### Innovation & Change Management
- **Change Champions**: Identifying and developing advocates for new initiatives
- **Pilot Programs**: Testing changes with supportive stakeholders before full rollout
- **Feedback Integration**: Incorporating stakeholder input into innovation processes
- **Resistance Management**: Strategies for working with stakeholders resistant to change

This comprehensive approach to stakeholder management has enabled successful coordination across complex global organizations, resulting in aligned execution, reduced conflicts, and accelerated business outcomes.`,
      excerpt:
        'Comprehensive framework for managing complex stakeholder networks in global organizations, based on experience coordinating across 25+ international markets.',
      thumbnail:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      category: 'Leadership',
      featured: false,
      readTime: 14,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2023-11-20'),
    },
  ]

  const createdBlogPosts = []
  for (const post of blogPosts) {
    const createdPost = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        thumbnail: post.thumbnail,
        category: post.category,
        featured: post.featured,
        readTime: post.readTime,
        status: post.status as any,
        authorId: admin.id,
        publishedAt: post.publishedAt,
        tags: {
          set: [],
          connect: [
            { id: pmTag?.id },
            { id: leadershipTag?.id },
            { id: scaleTag?.id },
          ].filter(Boolean),
        },
      },
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        thumbnail: post.thumbnail,
        category: post.category,
        featured: post.featured,
        readTime: post.readTime,
        status: post.status as any,
        authorId: admin.id,
        publishedAt: post.publishedAt,
        tags: {
          connect: [
            { id: pmTag?.id },
            { id: leadershipTag?.id },
            { id: scaleTag?.id },
          ].filter(Boolean),
        },
      },
    })
    createdBlogPosts.push(createdPost)
  }

  console.log('✅ Blog posts created:', createdBlogPosts.length)

  console.log(`
🎉 Product Management portfolio seed completed successfully!

📊 Summary:
- Admin user: ${adminEmail}
- Technologies: ${createdTechnologies.length}
- Tags: ${createdTags.length}
- Projects: ${createdProjects.length}
- Blog posts: ${createdBlogPosts.length}

🔑 Admin credentials:
Email: ${adminEmail}
Password: ${adminPassword}

🚀 Ready to showcase Product Management expertise!
Make sure to change the admin password in production!
  `)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
