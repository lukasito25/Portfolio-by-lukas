'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyWrapperProps {
  children: React.ReactNode
}

export function ClientOnlyWrapper({ children }: ClientOnlyWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  return <>{children}</>
}
