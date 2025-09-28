/**
 * Comprehensive Error Handling Utilities
 * Provides standardized error types, handling, and user-friendly messages
 */

// ====================== Error Types ======================

export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  OFFLINE_ERROR = 'OFFLINE_ERROR',

  // API errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  DATABASE_TIMEOUT = 'DATABASE_TIMEOUT',

  // Form errors
  FORM_VALIDATION_ERROR = 'FORM_VALIDATION_ERROR',
  FORM_SUBMISSION_ERROR = 'FORM_SUBMISSION_ERROR',

  // Content errors
  CONTENT_LOADING_ERROR = 'CONTENT_LOADING_ERROR',
  CONTENT_NOT_FOUND = 'CONTENT_NOT_FOUND',
  PARTIAL_CONTENT_ERROR = 'PARTIAL_CONTENT_ERROR',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface AppError {
  code: ErrorCode
  message: string
  userMessage: string
  severity: ErrorSeverity
  timestamp: Date
  context?: Record<string, any>
  stack?: string
  recoverable: boolean
  retryable: boolean
  statusCode?: number
}

export interface ErrorRecoveryOptions {
  retry?: boolean
  fallback?: () => void
  redirect?: string
  showFallbackUI?: boolean
}

// ====================== Error Factory ======================

export class ErrorFactory {
  static createNetworkError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message,
      userMessage: 'Unable to connect to the server. Please check your internet connection.',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
    }
  }

  static createTimeoutError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.TIMEOUT_ERROR,
      message,
      userMessage: 'The request took too long to complete. Please try again.',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
    }
  }

  static createOfflineError(): AppError {
    return {
      code: ErrorCode.OFFLINE_ERROR,
      message: 'Device is offline',
      userMessage: 'You appear to be offline. Please check your internet connection and try again.',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      recoverable: true,
      retryable: true,
    }
  }

  static createValidationError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.VALIDATION_ERROR,
      message,
      userMessage: 'Please check your input and try again.',
      severity: ErrorSeverity.LOW,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: false,
      statusCode: 400,
    }
  }

  static createUnauthorizedError(): AppError {
    return {
      code: ErrorCode.UNAUTHORIZED,
      message: 'Unauthorized access',
      userMessage: 'Your session has expired. Please log in again.',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      recoverable: true,
      retryable: false,
      statusCode: 401,
    }
  }

  static createNotFoundError(
    resource: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.NOT_FOUND,
      message: `${resource} not found`,
      userMessage: `The requested ${resource.toLowerCase()} could not be found.`,
      severity: ErrorSeverity.LOW,
      timestamp: new Date(),
      context,
      recoverable: false,
      retryable: false,
      statusCode: 404,
    }
  }

  static createServerError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.SERVER_ERROR,
      message,
      userMessage: 'A server error occurred. Please try again later.',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
      statusCode: 500,
    }
  }

  static createDatabaseError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.DATABASE_ERROR,
      message,
      userMessage: 'A database error occurred. Please try again later.',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
    }
  }

  static createContentLoadingError(
    contentType: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.CONTENT_LOADING_ERROR,
      message: `Failed to load ${contentType}`,
      userMessage: `Unable to load ${contentType}. Please refresh the page or try again later.`,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
    }
  }

  static createFormError(
    message: string,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCode.FORM_SUBMISSION_ERROR,
      message,
      userMessage: 'Failed to submit the form. Please check your input and try again.',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      recoverable: true,
      retryable: true,
    }
  }

  static fromHttpResponse(response: Response, context?: Record<string, any>): AppError {
    const status = response.status
    const statusText = response.statusText

    switch (status) {
      case 400:
        return this.createValidationError(
          `HTTP ${status}: ${statusText}`,
          { ...context, status, statusText }
        )
      case 401:
        return this.createUnauthorizedError()
      case 403:
        return {
          code: ErrorCode.FORBIDDEN,
          message: `HTTP ${status}: ${statusText}`,
          userMessage: 'You do not have permission to perform this action.',
          severity: ErrorSeverity.MEDIUM,
          timestamp: new Date(),
          context: { ...context, status, statusText },
          recoverable: false,
          retryable: false,
          statusCode: status,
        }
      case 404:
        return this.createNotFoundError('Resource', { ...context, status, statusText })
      case 429:
        return {
          code: ErrorCode.RATE_LIMITED,
          message: `HTTP ${status}: ${statusText}`,
          userMessage: 'Too many requests. Please wait a moment and try again.',
          severity: ErrorSeverity.MEDIUM,
          timestamp: new Date(),
          context: { ...context, status, statusText },
          recoverable: true,
          retryable: true,
          statusCode: status,
        }
      case 500:
      case 502:
      case 503:
      case 504:
        return this.createServerError(
          `HTTP ${status}: ${statusText}`,
          { ...context, status, statusText }
        )
      default:
        return {
          code: ErrorCode.UNKNOWN_ERROR,
          message: `HTTP ${status}: ${statusText}`,
          userMessage: 'An unexpected error occurred. Please try again.',
          severity: ErrorSeverity.MEDIUM,
          timestamp: new Date(),
          context: { ...context, status, statusText },
          recoverable: true,
          retryable: true,
          statusCode: status,
        }
    }
  }

  static fromError(error: Error, context?: Record<string, any>): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return this.createNetworkError(error.message, { ...context, originalError: error })
    }

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return this.createTimeoutError(error.message, { ...context, originalError: error })
    }

    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      userMessage: 'An unexpected error occurred. Please try again.',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context: { ...context, originalError: error },
      stack: error.stack,
      recoverable: true,
      retryable: false,
    }
  }
}

// ====================== Error Handler ======================

export interface ErrorHandlerOptions {
  showToast?: boolean
  logError?: boolean
  recovery?: ErrorRecoveryOptions
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorListeners: Array<(error: AppError) => void> = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  addErrorListener(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener)
    return () => {
      const index = this.errorListeners.indexOf(listener)
      if (index > -1) {
        this.errorListeners.splice(index, 1)
      }
    }
  }

  handleError(error: AppError, options: ErrorHandlerOptions = {}): void {
    // Log error if requested (default: true)
    if (options.logError !== false) {
      this.logError(error)
    }

    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(error)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })

    // Handle recovery options
    if (options.recovery) {
      this.handleRecovery(error, options.recovery)
    }
  }

  private logError(error: AppError): void {
    const logData = {
      code: error.code,
      message: error.message,
      severity: error.severity,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.stack,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    }

    // Console logging based on severity
    switch (error.severity) {
      case ErrorSeverity.LOW:
        console.info('AppError (LOW):', logData)
        break
      case ErrorSeverity.MEDIUM:
        console.warn('AppError (MEDIUM):', logData)
        break
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        console.error('AppError (HIGH/CRITICAL):', logData)
        break
    }

    // In production, you would send this to your error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // window.errorMonitoringService?.captureError(logData)
    }
  }

  private handleRecovery(error: AppError, recovery: ErrorRecoveryOptions): void {
    if (recovery.fallback) {
      try {
        recovery.fallback()
      } catch (fallbackError) {
        console.error('Error in recovery fallback:', fallbackError)
      }
    }

    if (recovery.redirect && typeof window !== 'undefined') {
      window.location.href = recovery.redirect
    }
  }
}

// ====================== Retry Logic ======================

export interface RetryOptions {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
  shouldRetry?: (error: AppError) => boolean
}

export class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      shouldRetry = (error: AppError) => error.retryable,
    } = options

    let lastError: AppError

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        const appError = error instanceof Error
          ? ErrorFactory.fromError(error, { attempt })
          : error as AppError

        lastError = appError

        // Don't retry if this is the last attempt or error is not retryable
        if (attempt === maxAttempts || !shouldRetry(appError)) {
          throw appError
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt - 1),
          maxDelay
        )

        console.info(`Retrying operation (attempt ${attempt + 1}/${maxAttempts}) after ${delay}ms`)
        await this.delay(delay)
      }
    }

    throw lastError!
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ====================== Network Status Detection ======================

export class NetworkStatusManager {
  private static instance: NetworkStatusManager
  private isOnline: boolean = true
  private listeners: Array<(isOnline: boolean) => void> = []

  static getInstance(): NetworkStatusManager {
    if (!NetworkStatusManager.instance) {
      NetworkStatusManager.instance = new NetworkStatusManager()
    }
    return NetworkStatusManager.instance
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine
      window.addEventListener('online', this.handleOnline.bind(this))
      window.addEventListener('offline', this.handleOffline.bind(this))
    }
  }

  private handleOnline(): void {
    this.isOnline = true
    this.notifyListeners()
  }

  private handleOffline(): void {
    this.isOnline = false
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.isOnline)
      } catch (error) {
        console.error('Error in network status listener:', error)
      }
    })
  }

  getIsOnline(): boolean {
    return this.isOnline
  }

  addListener(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// ====================== Utility Functions ======================

export function isRecoverableError(error: AppError): boolean {
  return error.recoverable
}

export function isRetryableError(error: AppError): boolean {
  return error.retryable
}

export function getErrorSeverityColor(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 'text-yellow-600 bg-yellow-50'
    case ErrorSeverity.MEDIUM:
      return 'text-orange-600 bg-orange-50'
    case ErrorSeverity.HIGH:
      return 'text-red-600 bg-red-50'
    case ErrorSeverity.CRITICAL:
      return 'text-red-800 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function formatErrorForUser(error: AppError): string {
  return error.userMessage
}

// ====================== Error Boundary Helpers ======================

export interface ErrorBoundaryState {
  hasError: boolean
  error: AppError | null
  errorInfo: any
}

export function createErrorBoundaryState(): ErrorBoundaryState {
  return {
    hasError: false,
    error: null,
    errorInfo: null,
  }
}

export function handleErrorBoundaryError(
  error: Error,
  errorInfo: any
): ErrorBoundaryState {
  const appError = ErrorFactory.fromError(error, { errorInfo })
  ErrorHandler.getInstance().handleError(appError)

  return {
    hasError: true,
    error: appError,
    errorInfo,
  }
}