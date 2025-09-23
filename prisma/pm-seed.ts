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

  // Create Product Management technologies/skills
  const technologies = [
    // Product Management Core
    {
      name: 'Product Strategy',
      slug: 'product-strategy',
      category: 'Product Management',
      level: 'EXPERT',
      color: '#8B5CF6',
      icon: 'strategy',
      description: 'Strategic product planning and roadmap development',
    },
    {
      name: 'Agile/Scrum',
      slug: 'agile-scrum',
      category: 'Methodologies',
      level: 'EXPERT',
      color: '#10B981',
      icon: 'agile',
      description: 'Agile product development and team leadership',
    },
    {
      name: 'OKRs & KPIs',
      slug: 'okrs-kpis',
      category: 'Metrics',
      level: 'EXPERT',
      color: '#F59E0B',
      icon: 'metrics',
      description: 'Objectives and Key Results framework implementation',
    },
    {
      name: 'User Research',
      slug: 'user-research',
      category: 'Research',
      level: 'ADVANCED',
      color: '#3B82F6',
      icon: 'research',
      description: 'User interview, surveys, and behavioral analysis',
    },
    {
      name: 'A/B Testing',
      slug: 'ab-testing',
      category: 'Analytics',
      level: 'ADVANCED',
      color: '#EC4899',
      icon: 'testing',
      description: 'Experimentation and conversion optimization',
    },

    // Leadership & Management
    {
      name: 'Team Leadership',
      slug: 'team-leadership',
      category: 'Leadership',
      level: 'EXPERT',
      color: '#EF4444',
      icon: 'leadership',
      description: 'Managing cross-functional teams of 13+ people',
    },
    {
      name: 'Stakeholder Management',
      slug: 'stakeholder-management',
      category: 'Communication',
      level: 'EXPERT',
      color: '#06B6D4',
      icon: 'stakeholder',
      description: 'Executive and cross-functional stakeholder alignment',
    },
    {
      name: 'International Markets',
      slug: 'international-markets',
      category: 'Business',
      level: 'EXPERT',
      color: '#0891B2',
      icon: 'global',
      description: 'Global market expansion and localization strategy',
    },

    // Technical & Systems
    {
      name: 'API Strategy',
      slug: 'api-strategy',
      category: 'Technical',
      level: 'ADVANCED',
      color: '#6366F1',
      icon: 'api',
      description: 'Platform and API product development',
    },
    {
      name: 'Data Analytics',
      slug: 'data-analytics',
      category: 'Analytics',
      level: 'ADVANCED',
      color: '#F97316',
      icon: 'analytics',
      description: 'Product analytics and business intelligence',
    },
    {
      name: 'Growth Strategy',
      slug: 'growth-strategy',
      category: 'Growth',
      level: 'EXPERT',
      color: '#7C3AED',
      icon: 'growth',
      description: 'User acquisition and retention optimization',
    },
    {
      name: 'SEO & Performance',
      slug: 'seo-performance',
      category: 'Marketing',
      level: 'ADVANCED',
      color: '#059669',
      icon: 'seo',
      description: 'Search optimization and site performance',
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
  const strategyTech = createdTechnologies.find(
    t => t.slug === 'product-strategy'
  )
  const leadershipTech = createdTechnologies.find(
    t => t.slug === 'team-leadership'
  )
  const growthTech = createdTechnologies.find(t => t.slug === 'growth-strategy')
  const internationalTech = createdTechnologies.find(
    t => t.slug === 'international-markets'
  )
  const agileTech = createdTechnologies.find(t => t.slug === 'agile-scrum')

  const projects = [
    {
      title: 'Global E-Commerce Platform Scale-Up',
      slug: 'global-ecommerce-platform-scale',
      description:
        'Led product strategy for scaling an e-commerce platform from 15M to 165M+ users across 12 international markets.',
      content: `# Global E-Commerce Platform Scale-Up

## Executive Summary
Led the strategic transformation of a mid-scale e-commerce platform, scaling from 15M to 165M+ users while expanding across 12 international markets. Managed a cross-functional team of 13+ people including product managers, engineers, designers, and analysts.

## Challenge
The platform faced critical scalability challenges:
- Performance degradation at 15M+ concurrent users
- Market expansion blocked by infrastructure limitations
- Customer acquisition costs increasing 40% YoY
- International markets showing 60% cart abandonment rates

## Strategic Approach

### Phase 1: Infrastructure & Performance (Months 1-6)
- **Database Optimization**: Implemented horizontal scaling and read replicas
- **CDN Strategy**: Global content delivery network reducing page load times by 65%
- **API Restructuring**: Microservices architecture supporting 10x traffic growth
- **Results**: Platform stability improved from 94% to 99.8% uptime

### Phase 2: International Market Expansion (Months 6-18)
- **Localization Strategy**: Payment methods, currency, and cultural customization for 12 markets
- **Team Scaling**: Built international product teams in 4 regions
- **Regulatory Compliance**: GDPR, local tax systems, and payment regulations
- **Results**: Successfully launched in 8 new markets, achieving 34% market share in key regions

### Phase 3: Growth & Optimization (Months 18-30)
- **User Experience Redesign**: Mobile-first approach increasing conversion by 28%
- **Personalization Engine**: AI-driven recommendations boosting AOV by 45%
- **Retention Strategy**: Loyalty program increasing repeat purchases by 52%
- **Results**: User base grew from 15M to 165M+ with 23% improvement in LTV

## Key Metrics & Impact

### User Growth
- **165M+ Active Users**: 11x growth from initial 15M users
- **12 International Markets**: Successful expansion across 4 continents
- **23% LTV Improvement**: Through enhanced user experience and retention

### Performance & Scale
- **99.8% Uptime**: Infrastructure reliability supporting massive scale
- **65% Faster Load Times**: Global CDN and performance optimization
- **10x Traffic Capacity**: Architecture supporting future growth

### Business Impact
- **$340M+ Revenue Growth**: Direct attribution to product improvements
- **28% Conversion Rate Increase**: Through UX optimization and personalization
- **45% AOV Improvement**: Via recommendation engine and cross-selling
- **52% Retention Increase**: Loyalty program and user engagement features

## Team Leadership Highlights
- **Cross-functional Team**: 13+ people across product, engineering, design, analytics
- **International Coordination**: Teams across US, Europe, Asia, and Latin America
- **Stakeholder Management**: Regular alignment with C-suite and board members
- **Methodology Implementation**: Agile/Scrum processes improving delivery speed by 35%

## Technologies & Skills Applied
- Product Strategy & Roadmap Planning
- International Market Research & Analysis
- Cross-functional Team Leadership
- Agile/Scrum Methodology
- Data Analytics & Performance Metrics
- Stakeholder Management & Communication

## Lessons Learned
1. **Infrastructure First**: Scalability must precede feature development at high growth stages
2. **Cultural Localization**: Technical localization alone isn't sufficient for international success
3. **Team Autonomy**: Regional teams need decision-making authority for market responsiveness
4. **Data-Driven Decisions**: A/B testing and analytics critical for optimizing at scale`,
      excerpt:
        'Strategic leadership scaling e-commerce platform from 15M to 165M+ users across 12 international markets, managing cross-functional team of 13+ people.',
      thumbnail:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      demoUrl: '',
      githubUrl: '',
      category: 'Strategic Leadership',
      featured: true,
      sortOrder: 1,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
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
      sortOrder: 2,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
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
      sortOrder: 3,
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date(),
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
            { id: strategyTech?.id },
            { id: leadershipTech?.id },
            { id: growthTech?.id },
            { id: internationalTech?.id },
            { id: agileTech?.id },
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
            { id: strategyTech?.id },
            { id: leadershipTech?.id },
            { id: growthTech?.id },
            { id: internationalTech?.id },
            { id: agileTech?.id },
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
        ...post,
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
