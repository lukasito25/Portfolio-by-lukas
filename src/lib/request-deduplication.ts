/**
 * Request Deduplication System
 * Prevents infinite loops and duplicate requests by caching in-flight requests
 */

interface PendingRequest {
  promise: Promise<any>
  timestamp: number
}

class RequestDeduplicator {
  private pendingRequests = new Map<string, PendingRequest>()
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 30 * 1000 // 30 seconds
  private readonly MAX_PENDING_TIME = 60 * 1000 // 60 seconds

  /**
   * Creates a unique key for a request based on URL and options
   */
  private createRequestKey(url: string, options: RequestInit = {}): string {
    const method = options.method || 'GET'
    const body = options.body || ''
    const headers = JSON.stringify(options.headers || {})
    return `${method}:${url}:${headers}:${body}`
  }

  /**
   * Cleans up expired cache entries and stale pending requests
   */
  private cleanup(): void {
    const now = Date.now()

    // Clean expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL) {
        this.cache.delete(key)
      }
    }

    // Clean stale pending requests
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.MAX_PENDING_TIME) {
        this.pendingRequests.delete(key)
      }
    }
  }

  /**
   * Executes a deduplicated request
   */
  async request<T>(
    url: string,
    options: RequestInit = {},
    enableCaching: boolean = true
  ): Promise<T> {
    this.cleanup()

    const key = this.createRequestKey(url, options)

    // Check cache first (only for GET requests by default)
    if (enableCaching && (!options.method || options.method === 'GET')) {
      const cached = this.cache.get(key)
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data
      }
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key)
    if (pending) {
      return pending.promise
    }

    // Create new request
    const promise = this.executeRequest<T>(url, options, key, enableCaching)

    // Store pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    })

    return promise
  }

  /**
   * Executes the actual request and handles cleanup
   */
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    key: string,
    enableCaching: boolean
  ): Promise<T> {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Cache successful GET requests
      if (enableCaching && (!options.method || options.method === 'GET')) {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
        })
      }

      return data
    } catch (error) {
      // Don't cache errors
      throw error
    } finally {
      // Always remove from pending requests when done
      this.pendingRequests.delete(key)
    }
  }

  /**
   * Manually clear cache for specific patterns
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all pending requests (useful for cleanup on unmount)
   */
  clearPendingRequests(): void {
    this.pendingRequests.clear()
  }

  /**
   * Get cache and pending request stats for debugging
   */
  getStats(): { cacheSize: number; pendingSize: number } {
    return {
      cacheSize: this.cache.size,
      pendingSize: this.pendingRequests.size,
    }
  }
}

// Export singleton instance
export const requestDeduplicator = new RequestDeduplicator()

// Export class for custom instances
export { RequestDeduplicator }

/**
 * React hook for using deduplicated requests (Client-side only)
 * Import this separately in client components that need it
 */

/**
 * Utility function for deduplicated fetch requests
 */
export async function deduplicatedFetch<T>(
  url: string,
  options: RequestInit = {},
  enableCaching: boolean = true
): Promise<T> {
  return requestDeduplicator.request<T>(url, options, enableCaching)
}
