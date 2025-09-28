'use client'

import React, { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  FileX,
  Clock,
  Info,
} from 'lucide-react'
import { useContentLoader, useErrorHandler } from '@/hooks/useErrorHandler'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { AppError, ErrorCode } from '@/lib/error-handling'

interface ContentLoaderProps<T> {
  loadContent: () => Promise<T>
  fallbackContent?: T
  children: (content: T, isLoading: boolean, hasFallback: boolean) => ReactNode
  errorFallback?: (error: AppError, retry: () => void) => ReactNode
  loadingFallback?: ReactNode
  emptyFallback?: ReactNode
  dependencies?: React.DependencyList
  contentName?: string
  showRetryButton?: boolean
  retryAttempts?: number
}

export function ContentLoader<T>({
  loadContent,
  fallbackContent,
  children,
  errorFallback,
  loadingFallback,
  emptyFallback,
  dependencies = [],
  contentName = 'content',
  showRetryButton = true,
  retryAttempts = 3,
}: ContentLoaderProps<T>) {
  const { content, loading, error, hasFallback, retry } = useContentLoader(
    loadContent,
    fallbackContent,
    dependencies
  )

  // Custom error fallback or default
  const renderError = (err: AppError) => {
    if (errorFallback) {
      return errorFallback(err, retry)
    }

    return (
      <ContentErrorFallback
        error={err}
        contentName={contentName}
        onRetry={showRetryButton ? retry : undefined}
        hasFallback={hasFallback}
        fallbackContent={fallbackContent}
      />
    )
  }

  // Loading state
  if (loading && !content) {
    return (
      <div>
        {loadingFallback || (
          <ContentLoadingFallback contentName={contentName} />
        )}
      </div>
    )
  }

  // Error state (without fallback)
  if (error && !hasFallback) {
    return <div>{renderError(error)}</div>
  }

  // Empty content state
  if (!content && !loading && !error) {
    return (
      <div>
        {emptyFallback || (
          <ContentEmptyFallback contentName={contentName} onRetry={retry} />
        )}
      </div>
    )
  }

  // Success state (with optional fallback notice)
  return (
    <div className="space-y-3">
      {error && hasFallback && (
        <ContentFallbackNotice
          error={error}
          contentName={contentName}
          onRetry={retry}
        />
      )}
      {children(content!, loading, hasFallback)}
    </div>
  )
}

// Loading fallback component
interface ContentLoadingFallbackProps {
  contentName: string
  variant?: 'card' | 'inline' | 'skeleton'
}

export function ContentLoadingFallback({
  contentName,
  variant = 'card',
}: ContentLoadingFallbackProps) {
  if (variant === 'skeleton') {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading {contentName}...</span>
      </div>
    )
  }

  return (
    <Card className="border-dashed border-gray-300">
      <CardContent className="py-8">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
          <p className="text-gray-500">Loading {contentName}...</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Error fallback component
interface ContentErrorFallbackProps {
  error: AppError
  contentName: string
  onRetry?: () => void
  hasFallback?: boolean
  fallbackContent?: any
}

export function ContentErrorFallback({
  error,
  contentName,
  onRetry,
  hasFallback,
  fallbackContent,
}: ContentErrorFallbackProps) {
  const getErrorIcon = () => {
    switch (error.code) {
      case ErrorCode.OFFLINE_ERROR:
      case ErrorCode.NETWORK_ERROR:
        return <WifiOff className="w-8 h-8 text-red-500" />
      case ErrorCode.NOT_FOUND:
        return <FileX className="w-8 h-8 text-orange-500" />
      case ErrorCode.TIMEOUT_ERROR:
        return <Clock className="w-8 h-8 text-yellow-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-red-500" />
    }
  }

  const getErrorColor = () => {
    switch (error.code) {
      case ErrorCode.OFFLINE_ERROR:
      case ErrorCode.NETWORK_ERROR:
        return 'border-red-200 bg-red-50'
      case ErrorCode.NOT_FOUND:
        return 'border-orange-200 bg-orange-50'
      case ErrorCode.TIMEOUT_ERROR:
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-red-200 bg-red-50'
    }
  }

  const getButtonColor = () => {
    switch (error.code) {
      case ErrorCode.OFFLINE_ERROR:
      case ErrorCode.NETWORK_ERROR:
        return 'border-red-300 text-red-700 hover:bg-red-100'
      case ErrorCode.NOT_FOUND:
        return 'border-orange-300 text-orange-700 hover:bg-orange-100'
      case ErrorCode.TIMEOUT_ERROR:
        return 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
      default:
        return 'border-red-300 text-red-700 hover:bg-red-100'
    }
  }

  return (
    <Card className={`border-dashed ${getErrorColor()}`}>
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          {getErrorIcon()}

          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">
              Unable to load {contentName}
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {error.userMessage}
            </p>
          </div>

          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className={getButtonColor()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}

          {hasFallback && fallbackContent && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Showing cached content
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty content fallback
interface ContentEmptyFallbackProps {
  contentName: string
  onRetry?: () => void
  message?: string
}

export function ContentEmptyFallback({
  contentName,
  onRetry,
  message,
}: ContentEmptyFallbackProps) {
  return (
    <Card className="border-dashed border-gray-300">
      <CardContent className="py-8">
        <div className="text-center space-y-4">
          <FileX className="w-8 h-8 text-gray-400 mx-auto" />

          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">
              No {contentName} found
            </h3>
            <p className="text-sm text-gray-500">
              {message || `There is no ${contentName} to display.`}
            </p>
          </div>

          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Fallback notice for when using cached content
interface ContentFallbackNoticeProps {
  error: AppError
  contentName: string
  onRetry: () => void
}

export function ContentFallbackNotice({
  error,
  contentName,
  onRetry,
}: ContentFallbackNoticeProps) {
  const isNetworkError = [
    ErrorCode.OFFLINE_ERROR,
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
  ].includes(error.code)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isNetworkError ? (
            <WifiOff className="w-4 h-4 text-blue-600" />
          ) : (
            <Info className="w-4 h-4 text-blue-600" />
          )}
          <div className="text-sm">
            <span className="font-medium text-blue-800">
              Showing cached {contentName}
            </span>
            <span className="text-blue-700 ml-1">
              - {error.userMessage}
            </span>
          </div>
        </div>

        <Button
          onClick={onRetry}
          size="sm"
          variant="ghost"
          className="text-blue-700 hover:bg-blue-100 h-auto py-1 px-2"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  )
}

// Higher-order component for wrapping components with content loading
export function withContentLoader<P extends object, T>(
  Component: React.ComponentType<P & { content: T }>,
  loadContent: () => Promise<T>,
  options?: {
    fallbackContent?: T
    contentName?: string
    showRetryButton?: boolean
  }
) {
  const WrappedComponent = (props: P) => (
    <ContentLoader
      loadContent={loadContent}
      fallbackContent={options?.fallbackContent}
      contentName={options?.contentName}
      showRetryButton={options?.showRetryButton}
    >
      {(content, loading, hasFallback) => (
        <Component
          {...props}
          content={content}
          isLoading={loading}
          hasFallback={hasFallback}
        />
      )}
    </ContentLoader>
  )

  WrappedComponent.displayName = `withContentLoader(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Wrapper for sections that may fail to load
export function ContentSection({
  children,
  title,
  subtitle,
  fallbackContent,
}: {
  children: ReactNode
  title?: string
  subtitle?: string
  fallbackContent?: ReactNode
}) {
  return (
    <ErrorBoundary
      level="section"
      fallback={(error, retry) => (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            {title && (
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                {title}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              This section couldn't load: {error.userMessage}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={retry}
                size="sm"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
            {fallbackContent && (
              <div className="mt-4 p-3 bg-orange-100 rounded border">
                <p className="text-xs text-orange-700 mb-2">Fallback content:</p>
                {fallbackContent}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    >
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}