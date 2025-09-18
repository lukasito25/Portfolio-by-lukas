import { VisitorData, InteractionEvent, PageView } from './analytics'

// Visitor segments for personalization
export enum VisitorSegment {
  NEW_VISITOR = 'new_visitor',
  RETURNING_VISITOR = 'returning_visitor',
  ENGAGED_VISITOR = 'engaged_visitor',
  POTENTIAL_RECRUITER = 'potential_recruiter',
  POTENTIAL_CLIENT = 'potential_client',
  TECHNICAL_VISITOR = 'technical_visitor',
  PM_FOCUSED = 'pm_focused',
  HIGH_INTENT = 'high_intent',
}

// Content types for recommendations
export interface ContentRecommendation {
  type:
    | 'project'
    | 'blog_post'
    | 'case_study'
    | 'contact_cta'
    | 'skill_highlight'
  id: string
  title: string
  description: string
  relevanceScore: number
  reason: string
}

// Visitor behavior analysis
export interface VisitorProfile {
  segment: VisitorSegment[]
  interests: string[]
  engagement_level: 'low' | 'medium' | 'high'
  intent_signals: string[]
  preferred_content: string[]
  device_preference: 'mobile' | 'desktop' | 'tablet'
  visit_frequency: 'first_time' | 'returning' | 'frequent'
}

// Personalization rules engine
export class PersonalizationEngine {
  private visitorData: VisitorData
  private interactions: InteractionEvent[]
  private pageViews: PageView[]

  constructor(
    visitorData: VisitorData,
    interactions: InteractionEvent[],
    pageViews: PageView[]
  ) {
    this.visitorData = visitorData
    this.interactions = interactions
    this.pageViews = pageViews
  }

  // Analyze visitor behavior and create profile
  public analyzeVisitor(): VisitorProfile {
    const segments = this.determineSegments()
    const interests = this.extractInterests()
    const engagement_level = this.calculateEngagementLevel()
    const intent_signals = this.detectIntentSignals()
    const preferred_content = this.identifyContentPreferences()
    const device_preference = this.determineDevicePreference()
    const visit_frequency = this.determineVisitFrequency()

    return {
      segment: segments,
      interests,
      engagement_level,
      intent_signals,
      preferred_content,
      device_preference,
      visit_frequency,
    }
  }

  // Generate personalized content recommendations
  public generateRecommendations(
    profile: VisitorProfile
  ): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = []

    // Project recommendations based on interests
    if (
      profile.interests.includes('technical') ||
      profile.segment.includes(VisitorSegment.TECHNICAL_VISITOR)
    ) {
      recommendations.push({
        type: 'project',
        id: 'technical-architecture',
        title: 'System Architecture & API Design',
        description:
          'Deep dive into technical product management and system design',
        relevanceScore: 0.9,
        reason: 'Based on your technical interests',
      })
    }

    if (
      profile.interests.includes('product-management') ||
      profile.segment.includes(VisitorSegment.PM_FOCUSED)
    ) {
      recommendations.push({
        type: 'case_study',
        id: 'product-discovery',
        title: 'Product Discovery Process',
        description: 'How I approach user research and product validation',
        relevanceScore: 0.85,
        reason: 'Relevant to product management focus',
      })
    }

    // High-intent contact recommendations
    if (
      profile.segment.includes(VisitorSegment.HIGH_INTENT) ||
      profile.intent_signals.includes('contact_interest')
    ) {
      recommendations.push({
        type: 'contact_cta',
        id: 'consultation',
        title: 'Schedule a Consultation',
        description: "Let's discuss how I can help your product succeed",
        relevanceScore: 0.95,
        reason: 'You seem interested in getting in touch',
      })
    }

    // Recruiter-specific recommendations
    if (profile.segment.includes(VisitorSegment.POTENTIAL_RECRUITER)) {
      recommendations.push({
        type: 'skill_highlight',
        id: 'leadership-skills',
        title: 'Leadership & Team Management',
        description: 'Track record of leading cross-functional teams',
        relevanceScore: 0.8,
        reason: 'Relevant for recruitment evaluation',
      })
    }

    // Mobile-optimized content for mobile users
    if (profile.device_preference === 'mobile') {
      recommendations.push({
        type: 'blog_post',
        id: 'mobile-pm-tips',
        title: 'Product Management on the Go',
        description: 'Quick insights for busy product managers',
        relevanceScore: 0.7,
        reason: 'Optimized for mobile reading',
      })
    }

    // Sort by relevance score
    return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  // Determine visitor segments
  private determineSegments(): VisitorSegment[] {
    const segments: VisitorSegment[] = []

    // New vs returning visitor
    if (this.pageViews.length === 1) {
      segments.push(VisitorSegment.NEW_VISITOR)
    } else {
      segments.push(VisitorSegment.RETURNING_VISITOR)
    }

    // Engagement level
    const totalInteractions = this.interactions.length
    if (totalInteractions > 10) {
      segments.push(VisitorSegment.ENGAGED_VISITOR)
    }

    // Check for recruiter signals
    const recruiterSignals = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'jobs',
      'career',
      'hiring',
    ]

    const referrerMatches = recruiterSignals.some(signal =>
      this.visitorData.referrer?.toLowerCase().includes(signal)
    )

    if (referrerMatches) {
      segments.push(VisitorSegment.POTENTIAL_RECRUITER)
    }

    // Check for client signals
    const clientSignals = this.interactions.filter(
      i =>
        i.element?.includes('contact') ||
        i.element?.includes('hire') ||
        i.element?.includes('consult')
    )

    if (clientSignals.length > 0) {
      segments.push(VisitorSegment.POTENTIAL_CLIENT)
    }

    // Technical visitor detection
    const technicalPages = this.pageViews.filter(
      pv =>
        pv.path.includes('work') ||
        pv.path.includes('projects') ||
        pv.title.toLowerCase().includes('technical')
    )

    if (technicalPages.length > 0) {
      segments.push(VisitorSegment.TECHNICAL_VISITOR)
    }

    // PM-focused detection
    const pmInteractions = this.interactions.filter(
      i =>
        i.element?.toLowerCase().includes('product') ||
        i.element?.toLowerCase().includes('management') ||
        i.value?.toLowerCase().includes('pm')
    )

    if (pmInteractions.length > 0) {
      segments.push(VisitorSegment.PM_FOCUSED)
    }

    // High intent signals
    const highIntentActions = this.interactions.filter(
      i =>
        i.type === 'chat_open' ||
        i.type === 'form_submit' ||
        i.type === 'email_click' ||
        (i.type === 'click' && i.element?.includes('contact'))
    )

    if (highIntentActions.length > 0) {
      segments.push(VisitorSegment.HIGH_INTENT)
    }

    return segments
  }

  // Extract visitor interests from behavior
  private extractInterests(): string[] {
    const interests: string[] = []

    // Page-based interests
    const technicalPages = this.pageViews.filter(
      pv => pv.path.includes('work') || pv.path.includes('projects')
    )
    if (technicalPages.length > 0) interests.push('technical')

    const aboutPages = this.pageViews.filter(pv => pv.path.includes('about'))
    if (aboutPages.length > 0) interests.push('background')

    const blogPages = this.pageViews.filter(pv => pv.path.includes('blog'))
    if (blogPages.length > 0) interests.push('insights')

    // Interaction-based interests
    const pmInteractions = this.interactions.filter(
      i =>
        i.value?.toLowerCase().includes('product') ||
        i.value?.toLowerCase().includes('management')
    )
    if (pmInteractions.length > 0) interests.push('product-management')

    const leadershipInteractions = this.interactions.filter(
      i =>
        i.value?.toLowerCase().includes('leadership') ||
        i.value?.toLowerCase().includes('team')
    )
    if (leadershipInteractions.length > 0) interests.push('leadership')

    return interests
  }

  // Calculate engagement level
  private calculateEngagementLevel(): 'low' | 'medium' | 'high' {
    const totalInteractions = this.interactions.length
    const uniquePages = new Set(this.pageViews.map(pv => pv.path)).size
    const averageTimeOnPage =
      this.pageViews.reduce((acc, pv) => acc + (pv.timeOnPage || 0), 0) /
      this.pageViews.length

    let score = 0

    // Interaction score
    if (totalInteractions > 15) score += 3
    else if (totalInteractions > 5) score += 2
    else if (totalInteractions > 0) score += 1

    // Page diversity score
    if (uniquePages > 3) score += 2
    else if (uniquePages > 1) score += 1

    // Time on site score
    if (averageTimeOnPage > 120)
      score += 2 // 2+ minutes
    else if (averageTimeOnPage > 60) score += 1 // 1+ minute

    if (score >= 6) return 'high'
    if (score >= 3) return 'medium'
    return 'low'
  }

  // Detect intent signals
  private detectIntentSignals(): string[] {
    const signals: string[] = []

    // Contact interest
    const contactActions = this.interactions.filter(
      i => i.element?.includes('contact') || i.type === 'email_click'
    )
    if (contactActions.length > 0) signals.push('contact_interest')

    // Chat engagement
    const chatActions = this.interactions.filter(
      i => i.type === 'chat_open' || i.type === 'chat_message'
    )
    if (chatActions.length > 0) signals.push('information_seeking')

    // Deep engagement
    const deepEngagement = this.pageViews.filter(
      pv => (pv.timeOnPage || 0) > 180 || (pv.scrollDepth || 0) > 75
    )
    if (deepEngagement.length > 0) signals.push('deep_interest')

    // Multiple visits
    if (this.pageViews.length > 3) signals.push('serious_consideration')

    return signals
  }

  // Identify content preferences
  private identifyContentPreferences(): string[] {
    const preferences: string[] = []

    const pageTypes = this.pageViews.map(pv => {
      if (pv.path.includes('work')) return 'portfolio'
      if (pv.path.includes('about')) return 'personal'
      if (pv.path.includes('blog')) return 'insights'
      if (pv.path.includes('contact')) return 'communication'
      return 'general'
    })

    const preferenceCount = pageTypes.reduce(
      (acc, type) => {
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return Object.entries(preferenceCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type)
  }

  // Determine device preference
  private determineDevicePreference(): 'mobile' | 'desktop' | 'tablet' {
    return this.visitorData.device.type === 'mobile'
      ? 'mobile'
      : this.visitorData.device.type === 'tablet'
        ? 'tablet'
        : 'desktop'
  }

  // Determine visit frequency
  private determineVisitFrequency(): 'first_time' | 'returning' | 'frequent' {
    if (this.pageViews.length === 1) return 'first_time'
    if (this.pageViews.length < 5) return 'returning'
    return 'frequent'
  }
}

// Helper function to get personalized content for a visitor
export async function getPersonalizedContent(visitorId: string): Promise<{
  profile: VisitorProfile
  recommendations: ContentRecommendation[]
}> {
  // This would typically fetch from your database
  // For now, return mock data structure
  const mockVisitorData: VisitorData = {
    id: visitorId,
    sessionId: 'session_123',
    timestamp: new Date(),
    userAgent: 'Mock User Agent',
    device: {
      type: 'desktop',
      browser: 'Chrome',
      os: 'macOS',
      screenResolution: '1920x1080',
    },
    location: {
      timezone: 'America/New_York',
    },
  }

  const mockInteractions: InteractionEvent[] = []
  const mockPageViews: PageView[] = []

  const engine = new PersonalizationEngine(
    mockVisitorData,
    mockInteractions,
    mockPageViews
  )
  const profile = engine.analyzeVisitor()
  const recommendations = engine.generateRecommendations(profile)

  return { profile, recommendations }
}
