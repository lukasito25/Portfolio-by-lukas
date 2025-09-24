'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft } from 'lucide-react'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export default function AnalyticsDashboardClient() {
  const { data: session, status } = useSession()

  // Handle authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor your portfolio performance and visitor engagement
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
