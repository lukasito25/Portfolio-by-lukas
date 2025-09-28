'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
} from 'lucide-react'
import {
  AppError,
  ErrorHandler,
  ErrorFactory,
  getErrorSeverityColor,
  formatErrorForUser,
  createErrorBoundaryState,
  handleErrorBoundaryError,
  type ErrorBoundaryState,
} from '@/lib/error-handling'
import { ErrorSeverity } from '@/lib/error-constants'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: AppError, retry: () => void) => ReactNode
  onError?: (error: AppError, errorInfo: ErrorInfo) => void
  isolate?: boolean // If true, only catch errors from direct children
  level?: 'page' | 'section' | 'component' // For different error handling strategies
}

interface ErrorBoundaryComponentState extends ErrorBoundaryState {
  isRetrying: boolean
  retryCount: number
  showDetails: boolean
  errorId: string
}

class ErrorBoundaryComponent extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryComponentState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      ...createErrorBoundaryState(),
      isRetrying: false,
      retryCount: 0,
      showDetails: false,
      errorId: '',
    }
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ErrorBoundaryComponentState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return {
      ...handleErrorBoundaryError(error, { errorId }),
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = ErrorFactory.fromError(error, {
      errorInfo,
      boundary: this.props.level || 'component',
      retryCount: this.state.retryCount,
    })

    // Call custom error handler if provided
    this.props.onError?.(appError, errorInfo)

    // Update state with error details
    this.setState({
      error: appError,
      errorInfo,
    })
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleRetry = () => {
    if (this.state.isRetrying || this.state.retryCount >= 3) {
      return
    }

    this.setState({ isRetrying: true })

    // Add a small delay to prevent immediate re-rendering
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        retryCount: this.state.retryCount + 1,
      })
    }, 1000)
  }

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails })
  }

  copyErrorDetails = async () => {
    if (!this.state.error) return

    const errorDetails = {
      id: this.state.errorId,
      code: this.state.error.code,
      message: this.state.error.message,
      timestamp: this.state.error.timestamp,
      context: this.state.error.context,
      stack: this.state.error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      // You could show a toast here
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  renderErrorFallback() {
    const { error } = this.state

    if (!error) return null

    // Use custom fallback if provided
    if (this.props.fallback) {
      return this.props.fallback(error, this.handleRetry)
    }

    // Default fallback UI
    return this.renderDefaultFallback()
  }

  renderDefaultFallback() {
    const { error, isRetrying, retryCount, showDetails, errorId } = this.state
    const { level = 'component' } = this.props

    if (!error) return null

    const severityColor = getErrorSeverityColor(error.severity)
    const canRetry = error.recoverable && retryCount < 3

    // Different layouts based on error boundary level
    if (level === 'page') {
      return this.renderPageLevelError()
    }

    if (level === 'section') {
      return this.renderSectionLevelError()
    }

    // Component level error (default)
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Something went wrong
            <Badge variant="outline" className={severityColor}>
              {error.severity}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-700">{formatErrorForUser(error)}</p>

          <div className="flex flex-wrap gap-2">
            {canRetry && (
              <Button
                onClick={this.handleRetry}
                disabled={isRetrying}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={this.toggleDetails}
              size="sm"
              variant="ghost"
              className="text-red-700 hover:bg-red-100"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Details
                </>
              )}
            </Button>
          </div>

          {showDetails && this.renderErrorDetails()}
        </CardContent>
      </Card>
    )
  }

  renderPageLevelError() {
    const { error, isRetrying, retryCount } = this.state

    if (!error) return null

    const canRetry = error.recoverable && retryCount < 3

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">{formatErrorForUser(error)}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="min-w-[120px]"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="min-w-[120px]"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>

              <Button
                onClick={this.handleReload}
                variant="outline"
                className="min-w-[120px]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>

            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                <Bug className="w-4 h-4 inline mr-1" />
                Technical Details
              </summary>
              <div className="mt-3">{this.renderErrorDetails()}</div>
            </details>
          </CardContent>
        </Card>
      </div>
    )
  }

  renderSectionLevelError() {
    const { error, isRetrying, retryCount, showDetails } = this.state

    if (!error) return null

    const canRetry = error.recoverable && retryCount < 3

    return (
      <div className="border border-orange-200 bg-orange-50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-medium text-orange-800">
                This section couldn't load
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                {formatErrorForUser(error)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={this.toggleDetails}
                size="sm"
                variant="ghost"
                className="text-orange-700 hover:bg-orange-100"
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>

            {showDetails && (
              <div className="mt-3 pt-3 border-t border-orange-200">
                {this.renderErrorDetails()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderErrorDetails() {
    const { error, errorId } = this.state

    if (!error) return null

    return (
      <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Error Details</span>
          <Button
            onClick={this.copyErrorDetails}
            size="sm"
            variant="ghost"
            className="h-auto p-1 text-gray-500 hover:text-gray-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 text-gray-600">
          <div>
            <span className="font-medium">ID:</span> {errorId}
          </div>
          <div>
            <span className="font-medium">Code:</span> {error.code}
          </div>
          <div>
            <span className="font-medium">Time:</span>{' '}
            {error.timestamp.toLocaleString()}
          </div>
          {error.context && (
            <div>
              <span className="font-medium">Context:</span>
              <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(error.context, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorFallback()
    }

    return this.props.children
  }
}

// Higher-order component for easy error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const handleError = React.useCallback(
    (error: Error | AppError, context?: Record<string, any>) => {
      const appError =
        error instanceof Error ? ErrorFactory.fromError(error, context) : error

      ErrorHandler.getInstance().handleError(appError)

      // Re-throw to trigger error boundary
      throw appError
    },
    []
  )

  return { handleError }
}

// Main ErrorBoundary export
export const ErrorBoundary = ErrorBoundaryComponent

export default ErrorBoundary
