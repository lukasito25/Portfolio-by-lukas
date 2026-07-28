'use client'

import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

const CampaignsClient = dynamicImport(
  () => import('@/components/admin/CampaignsClient'),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Loading campaigns…
        </div>
      </div>
    ),
  }
)

export default function CampaignsPage() {
  return <CampaignsClient />
}
