'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  X,
} from 'lucide-react'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { NetworkStatusManager } from '@/lib/error-handling'
import { apiClient } from '@/lib/api-client'

interface NetworkStatusProps {
  showDetails?: boolean
  showOfflineOnly?: boolean
  position?: 'top' | 'bottom'
  className?: string
}

export function NetworkStatus({
  showDetails = false,
  showOfflineOnly = false,
  position = 'top',
  className = '',
}: NetworkStatusProps) {
  const { isOnline } = useErrorHandler()
  const [isVisible, setIsVisible] = useState(false)
  const [apiStatus, setApiStatus] = useState<'unknown' | 'healthy' | 'unhealthy'>('unknown')
  const [isCheckingApi, setIsCheckingApi] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Show/hide logic
  useEffect(() => {
    if (showOfflineOnly) {
      setIsVisible(!isOnline)
    } else {
      setIsVisible(true)
    }
  }, [isOnline, showOfflineOnly])

  // Auto-hide after coming back online
  useEffect(() => {
    if (isOnline && showOfflineOnly) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000) // Hide after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [isOnline, showOfflineOnly])

  // Check API health when coming back online
  useEffect(() => {
    if (isOnline && apiStatus !== 'healthy') {
      checkApiHealth()
    }
  }, [isOnline])

  const checkApiHealth = async () => {
    setIsCheckingApi(true)
    try {
      await apiClient.healthCheck()
      setApiStatus('healthy')
      setLastChecked(new Date())
    } catch (error) {
      setApiStatus('unhealthy')
      setLastChecked(new Date())
    } finally {
      setIsCheckingApi(false)
    }
  }

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (apiStatus === 'healthy') return 'bg-green-500'
    if (apiStatus === 'unhealthy') return 'bg-orange-500'
    return 'bg-gray-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (apiStatus === 'healthy') return 'Online'
    if (apiStatus === 'unhealthy') return 'Limited'
    return 'Checking...'
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />
    if (apiStatus === 'healthy') return <Wifi className="w-4 h-4" />
    if (apiStatus === 'unhealthy') return <AlertTriangle className="w-4 h-4" />
    return <RefreshCw className="w-4 h-4 animate-spin" />
  }

  if (!isVisible) return null

  const positionClasses = position === 'top'
    ? 'top-4 right-4'
    : 'bottom-4 right-4'

  const baseClasses = `fixed ${positionClasses} z-50 max-w-sm ${className}`

  if (!showDetails) {
    // Simple status indicator
    return (
      <div className={baseClasses}>
        <Badge
          variant="outline"
          className={`${getStatusColor()} text-white border-transparent shadow-lg`}
        >
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
        </Badge>
      </div>
    )
  }

  // Detailed status card
  return (
    <div className={baseClasses}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium text-gray-900">
              Network Status
            </span>
          </div>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
            className="h-auto p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {/* Network Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Internet</span>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">Disconnected</span>
                </>
              )}
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Service</span>
            <div className="flex items-center gap-2">
              {apiStatus === 'healthy' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700">Available</span>
                </>
              )}
              {apiStatus === 'unhealthy' && (
                <>
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-700">Limited</span>
                </>
              )}
              {apiStatus === 'unknown' && (
                <>
                  <RefreshCw className={`w-4 h-4 text-gray-500 ${isCheckingApi ? 'animate-spin' : ''}`} />
                  <span className="text-sm text-gray-700">Unknown</span>
                </>
              )}
            </div>
          </div>

          {/* Last Checked */}
          {lastChecked && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {isOnline && (
              <Button
                onClick={checkApiHealth}
                disabled={isCheckingApi}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                {isCheckingApi ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Test API
                  </>
                )}
              </Button>
            )}

            {!isOnline && (
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-500">
                  Check your internet connection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified offline banner
export function OfflineBanner() {
  const { isOnline } = useErrorHandler()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(!isOnline)
  }, [isOnline])

  // Auto-hide after coming back online
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOnline])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">
            You're offline
          </span>
          <span className="text-red-200">
            - Some features may not work
          </span>
        </div>
      </div>
    </div>
  )
}

// Connection quality indicator
export function ConnectionQuality() {
  const [quality, setQuality] = useState<'good' | 'fair' | 'poor' | 'unknown'>('unknown')
  const [isChecking, setIsChecking] = useState(false)
  const { isOnline } = useErrorHandler()

  const checkConnectionQuality = async () => {
    if (!isOnline) {
      setQuality('poor')
      return
    }

    setIsChecking(true)
    const startTime = Date.now()

    try {
      await apiClient.healthCheck()
      const duration = Date.now() - startTime

      if (duration < 500) {
        setQuality('good')
      } else if (duration < 2000) {
        setQuality('fair')
      } else {
        setQuality('poor')
      }
    } catch (error) {
      setQuality('poor')
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    if (isOnline) {
      checkConnectionQuality()
      const interval = setInterval(checkConnectionQuality, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    } else {
      setQuality('poor')
    }
  }, [isOnline])

  const getQualityColor = () => {
    switch (quality) {
      case 'good': return 'text-green-500'
      case 'fair': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getQualityIcon = () => {
    if (isChecking) return <RefreshCw className="w-3 h-3 animate-spin" />

    switch (quality) {
      case 'good': return <div className="w-3 h-3 bg-green-500 rounded-full" />
      case 'fair': return <div className="w-3 h-3 bg-yellow-500 rounded-full" />
      case 'poor': return <div className="w-3 h-3 bg-red-500 rounded-full" />
      default: return <div className="w-3 h-3 bg-gray-500 rounded-full" />
    }
  }

  return (
    <div className="flex items-center gap-1" title={`Connection quality: ${quality}`}>
      {getQualityIcon()}
      <span className={`text-xs ${getQualityColor()}`}>
        {isChecking ? '...' : quality}
      </span>
    </div>
  )
}

export default NetworkStatus