'use client'

/**
 * React hook for using deduplicated requests (Client-side only)
 */
import { useEffect, useRef } from 'react'
import { RequestDeduplicator } from '@/lib/request-deduplication'

export function useRequestDeduplication() {
  const deduplicatorRef = useRef<RequestDeduplicator | null>(null)

  if (!deduplicatorRef.current) {
    deduplicatorRef.current = new RequestDeduplicator()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deduplicatorRef.current) {
        deduplicatorRef.current.clearPendingRequests()
      }
    }
  }, [])

  return deduplicatorRef.current
}
