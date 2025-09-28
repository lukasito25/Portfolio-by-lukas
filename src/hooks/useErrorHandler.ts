'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AppError,
  ErrorHandler,
  ErrorFactory,
  NetworkStatusManager,
} from '@/lib/error-handling'
import { ErrorCode } from '@/lib/error-constants'

export interface UseErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  onError?: (error: AppError) => void
}

export interface ErrorState {
  error: AppError | null
  isOnline: boolean
  hasError: boolean
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isOnline: true,
    hasError: false,
  })

  const errorHandler = ErrorHandler.getInstance()
  const networkManager = NetworkStatusManager.getInstance()

  // Handle errors
  const handleError = useCallback(
    (error: Error | AppError, context?: Record<string, any>) => {
      const appError =
        error instanceof Error ? ErrorFactory.fromError(error, context) : error

      // Update local state
      setErrorState(prev => ({
        ...prev,
        error: appError,
        hasError: true,
      }))

      // Handle error globally
      errorHandler.handleError(appError, {
        showToast: options.showToast,
        logError: options.logError,
      })

      // Call custom error handler
      options.onError?.(appError)
    },
    [errorHandler, options]
  )

  // Clear error
  const clearError = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      error: null,
      hasError: false,
    }))
  }, [])

  // Retry mechanism
  const retry = useCallback(
    async (
      operation: () => Promise<any>,
      retryOptions?: {
        maxAttempts?: number
        delay?: number
        onRetry?: (attempt: number) => void
      }
    ) => {
      const { maxAttempts = 3, delay = 1000, onRetry } = retryOptions || {}

      let lastError: AppError | null = null

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await operation()
          clearError() // Clear any previous errors on success
          return result
        } catch (error) {
          lastError =
            error instanceof Error
              ? ErrorFactory.fromError(error, { attempt, maxAttempts })
              : (error as AppError)

          if (attempt < maxAttempts) {
            onRetry?.(attempt)
            await new Promise(resolve => setTimeout(resolve, delay * attempt))
          }
        }
      }

      if (lastError) {
        handleError(lastError)
        throw lastError
      }
    },
    [handleError, clearError]
  )

  // Monitor network status
  useEffect(() => {
    const unsubscribe = networkManager.addListener(isOnline => {
      setErrorState(prev => {
        const newState = {
          ...prev,
          isOnline,
        }

        // Clear network-related errors when coming back online
        if (isOnline && prev.error?.code === ErrorCode.OFFLINE_ERROR) {
          clearError()
        }

        // Add offline error when going offline
        if (!isOnline) {
          handleError(ErrorFactory.createOfflineError())
        }

        return newState
      })
    })

    // Set initial network status
    setErrorState(prev => ({
      ...prev,
      isOnline: networkManager.getIsOnline(),
    }))

    return unsubscribe
  }, [networkManager, handleError, clearError])

  // Listen to global errors
  useEffect(() => {
    const unsubscribe = errorHandler.addErrorListener(error => {
      setErrorState(prev => ({
        ...prev,
        error,
        hasError: true,
      }))
    })

    return unsubscribe
  }, [errorHandler])

  return {
    ...errorState,
    handleError,
    clearError,
    retry,
  }
}

// Hook for async operations with built-in error handling
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = useState<{
    data: T | null
    loading: boolean
    error: AppError | null
  }>({
    data: null,
    loading: false,
    error: null,
  })

  const { handleError } = useErrorHandler()

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const result = await operation()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      const appError =
        error instanceof Error
          ? ErrorFactory.fromError(error)
          : (error as AppError)

      setState(prev => ({ ...prev, loading: false, error: appError }))
      handleError(appError)
      throw appError
    }
  }, [operation, handleError])

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    execute()
  }, dependencies)

  const retry = useCallback(() => {
    return execute()
  }, [execute])

  return {
    ...state,
    execute,
    retry,
  }
}

// Hook for form error handling
export function useFormErrorHandler() {
  const { handleError } = useErrorHandler()
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleFormError = useCallback(
    (error: Error | AppError, fieldErrors?: Record<string, string>) => {
      // Set field-specific errors
      if (fieldErrors) {
        setFormErrors(fieldErrors)
      }

      // Handle the main error
      handleError(error, { formErrors: fieldErrors })
    },
    [handleError]
  )

  const clearFormErrors = useCallback(() => {
    setFormErrors({})
  }, [])

  const setFieldError = useCallback((field: string, message: string) => {
    setFormErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFormErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    formErrors,
    handleFormError,
    clearFormErrors,
    setFieldError,
    clearFieldError,
  }
}

// Hook for content loading with fallbacks
export function useContentLoader<T>(
  loadContent: () => Promise<T>,
  fallbackContent?: T,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = useState<{
    content: T | null
    loading: boolean
    error: AppError | null
    hasFallback: boolean
  }>({
    content: fallbackContent || null,
    loading: false,
    error: null,
    hasFallback: Boolean(fallbackContent),
  })

  const { handleError } = useErrorHandler()

  const loadWithFallback = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const content = await loadContent()
      setState(prev => ({
        ...prev,
        content,
        loading: false,
        hasFallback: false,
      }))
      return content
    } catch (error) {
      const appError = ErrorFactory.createContentLoadingError('content', {
        originalError: error,
      })

      setState(prev => ({
        ...prev,
        loading: false,
        error: appError,
        content: fallbackContent || prev.content,
        hasFallback: Boolean(fallbackContent),
      }))

      // Only throw if no fallback content
      if (!fallbackContent) {
        handleError(appError)
        throw appError
      }

      // Log error but don't throw since we have fallback
      console.warn('Content loading failed, using fallback:', appError)
      return fallbackContent
    }
  }, [loadContent, fallbackContent, handleError])

  useEffect(() => {
    loadWithFallback()
  }, dependencies)

  const retry = useCallback(() => {
    return loadWithFallback()
  }, [loadWithFallback])

  return {
    ...state,
    retry,
  }
}
