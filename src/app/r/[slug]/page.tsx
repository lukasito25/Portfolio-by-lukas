import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { dataService } from '@/lib/data-service'
import { RecruiterPageView } from '@/components/recruiter/RecruiterPageView'
import { RecruiterPageAnalytics } from '@/components/recruiter/RecruiterPageAnalytics'

export const dynamic = 'force-dynamic'

interface RecruiterPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: RecruiterPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getRecruiterPage(slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: `${page.title} | Lukas Hosala - Product Manager`,
    description: `Personalized proposal for ${page.companyName} - Strategic product management solutions tailored for your organization`,
    openGraph: {
      title: page.title,
      description: `Strategic product management proposal for ${page.companyName}`,
      type: 'website',
    },
  }
}

async function getRecruiterPage(slug: string) {
  try {
    // This will be implemented in data-service
    return await dataService.getRecruiterPage(slug)
  } catch (error) {
    console.error('Failed to fetch recruiter page:', error)
    return null
  }
}

export default async function RecruiterPage({ params }: RecruiterPageProps) {
  const { slug } = await params
  const page = await getRecruiterPage(slug)

  if (!page || !page.isActive) {
    notFound()
  }

  // Track page view (will increment views counter)
  await dataService.trackRecruiterPageView(page.id, {
    // In a real implementation, you'd extract these from headers
    userAgent: '',
    ipAddress: '',
    referrer: '',
  })

  return (
    <>
      {/* Analytics tracking component */}
      <RecruiterPageAnalytics pageId={page.id} />

      {/* Main page content */}
      <RecruiterPageView page={page} />
    </>
  )
}
