'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

// Force dynamic rendering for all admin routes
export const dynamic = 'force-dynamic'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <SessionProvider>{children}</SessionProvider>
}
