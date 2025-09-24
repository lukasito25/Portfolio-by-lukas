import { CompanyMirrorTemplate } from './templates/CompanyMirrorTemplate'
import { DayOneImpactTemplate } from './templates/DayOneImpactTemplate'
import { ExecutiveBriefingTemplate } from './templates/ExecutiveBriefingTemplate'

interface RecruiterPageData {
  id: string
  title: string
  slug: string
  companyName: string
  companySlug: string
  roleName: string | null
  roleLevel: string | null
  companySize: string | null
  industry: string | null
  templateType: string
  customContent: any
  companyInfo: any
  challenges: any
  solutions: any
  views: number
  uniqueViews: number
  timeOnPage: number | null
  responses: number
  author: {
    id: string
    name: string | null
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

interface RecruiterPageViewProps {
  page: RecruiterPageData
}

export function RecruiterPageView({ page }: RecruiterPageViewProps) {
  // Parse JSON fields
  const customContent = page.customContent
    ? typeof page.customContent === 'string'
      ? JSON.parse(page.customContent)
      : page.customContent
    : null

  const companyInfo = page.companyInfo
    ? typeof page.companyInfo === 'string'
      ? JSON.parse(page.companyInfo)
      : page.companyInfo
    : null

  const challenges = page.challenges
    ? typeof page.challenges === 'string'
      ? JSON.parse(page.challenges)
      : page.challenges
    : null

  const solutions = page.solutions
    ? typeof page.solutions === 'string'
      ? JSON.parse(page.solutions)
      : page.solutions
    : null

  const templateProps = {
    page: {
      ...page,
      customContent,
      companyInfo,
      challenges,
      solutions,
    },
  }

  // Render the appropriate template based on templateType
  switch (page.templateType) {
    case 'company-mirror':
      return <CompanyMirrorTemplate {...templateProps} />

    case 'day-one-impact':
      return <DayOneImpactTemplate {...templateProps} />

    case 'executive-briefing':
      return <ExecutiveBriefingTemplate {...templateProps} />

    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Template Not Found
            </h1>
            <p className="text-gray-600">
              The template type "{page.templateType}" is not supported.
            </p>
          </div>
        </div>
      )
  }
}
