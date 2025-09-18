import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export default async function AnalyticsAdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnalyticsDashboard />
    </div>
  )
}
