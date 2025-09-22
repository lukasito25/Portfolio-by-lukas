'use client'

import dynamicImport from 'next/dynamic'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Dynamically import the client component with no SSR
const AnalyticsDashboardClient = dynamicImport(
  () => import('@/components/admin/AnalyticsDashboardClient'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Loading Analytics...
        </div>
      </div>
    ),
  }
)

export default function AnalyticsPage() {
  return <AnalyticsDashboardClient />
}
