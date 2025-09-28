/**
 * Global Error Monitoring and Logging System
 * Provides comprehensive error tracking, reporting, and analytics
 */

import React from 'react'
import { AppError } from './error-handling'
import {
  ErrorCode,
  ErrorSeverity,
  type ErrorCodeType,
  type ErrorSeverityType,
} from './error-constants'

// ====================== Error Monitoring Configuration ======================

export interface ErrorMonitoringConfig {
  enabled: boolean
  environment: 'development' | 'staging' | 'production'
  apiEndpoint?: string
  apiKey?: string
  maxErrorsPerSession: number
  sampleRate: number // 0-1, percentage of errors to report
  enableConsoleLogging: boolean
  enableLocalStorage: boolean
  enablePerformanceTracking: boolean
  enableUserContext: boolean
}

const defaultConfig: ErrorMonitoringConfig = {
  enabled: typeof window !== 'undefined',
  environment: (process.env.NODE_ENV as any) || 'development',
  maxErrorsPerSession: 50,
  sampleRate: 1.0, // Report all errors by default
  enableConsoleLogging: true,
  enableLocalStorage: true,
  enablePerformanceTracking: true,
  enableUserContext: true,
}

// ====================== Error Context ======================

export interface ErrorContext {
  userId?: string
  sessionId: string
  userAgent: string
  url: string
  timestamp: Date
  viewport: { width: number; height: number }
  performance?: PerformanceMetrics
  userActions?: UserAction[]
  breadcrumbs?: Breadcrumb[]
  customData?: Record<string, any>
}

export interface PerformanceMetrics {
  loadTime: number
  memoryUsage?: number
  connectionType?: string
  effectiveType?: string
}

export interface UserAction {
  type: 'click' | 'navigation' | 'form_submit' | 'api_call' | 'custom'
  element?: string
  timestamp: Date
  data?: Record<string, any>
}

export interface Breadcrumb {
  level: 'info' | 'warning' | 'error' | 'debug'
  category: string
  message: string
  timestamp: Date
  data?: Record<string, any>
}

export interface ErrorReport {
  id: string
  error: AppError
  context: ErrorContext
  stack?: string
  reproductionSteps?: string[]
  similarErrors?: string[]
}

// ====================== Error Monitoring Service ======================

export class ErrorMonitoringService {
  private static instance: ErrorMonitoringService
  private config: ErrorMonitoringConfig
  private sessionId: string
  private errorCount: number = 0
  private userActions: UserAction[] = []
  private breadcrumbs: Breadcrumb[] = []
  private errorQueue: ErrorReport[] = []
  private isOnline: boolean = true

  static getInstance(
    config?: Partial<ErrorMonitoringConfig>
  ): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService(config)
    }
    return ErrorMonitoringService.instance
  }

  private constructor(config?: Partial<ErrorMonitoringConfig>) {
    this.config = { ...defaultConfig, ...config }
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private initialize(): void {
    if (!this.config.enabled || typeof window === 'undefined') {
      return
    }

    // Set up global error handlers
    this.setupGlobalErrorHandlers()

    // Set up user action tracking
    if (this.config.enableUserContext) {
      this.setupUserActionTracking()
    }

    // Set up network status monitoring
    this.setupNetworkStatusMonitoring()

    // Set up periodic error queue flushing
    this.setupErrorQueueFlushing()

    // Load persisted data
    this.loadPersistedData()
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      const error = this.createErrorFromRejection(event)
      this.captureError(error, { unhandled: true })
    })

    // Handle global JavaScript errors
    window.addEventListener('error', event => {
      const error = this.createErrorFromEvent(event)
      this.captureError(error, { unhandled: true })
    })

    // Handle resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          const error = this.createResourceError(event)
          this.captureError(error, { resource: true })
        }
      },
      true
    )
  }

  private setupUserActionTracking(): void {
    // Track clicks
    document.addEventListener('click', event => {
      this.addUserAction({
        type: 'click',
        element: this.getElementSelector(event.target as Element),
        timestamp: new Date(),
        data: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    })

    // Track navigation
    window.addEventListener('popstate', () => {
      this.addUserAction({
        type: 'navigation',
        timestamp: new Date(),
        data: { url: window.location.href },
      })
    })
  }

  private setupNetworkStatusMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.addBreadcrumb('info', 'network', 'Connection restored')
      this.flushErrorQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.addBreadcrumb('warning', 'network', 'Connection lost')
    })
  }

  private setupErrorQueueFlushing(): void {
    // Flush errors every 30 seconds if online
    setInterval(() => {
      if (this.isOnline && this.errorQueue.length > 0) {
        this.flushErrorQueue()
      }
    }, 30000)

    // Flush errors before page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrorQueue()
    })
  }

  // ====================== Public API ======================

  captureError(error: AppError, customContext?: Record<string, any>): string {
    if (
      !this.config.enabled ||
      this.errorCount >= this.config.maxErrorsPerSession
    ) {
      return ''
    }

    // Sample rate check
    if (Math.random() > this.config.sampleRate) {
      return ''
    }

    const errorId = this.generateErrorId()
    const context = this.buildErrorContext(customContext)
    const report: ErrorReport = {
      id: errorId,
      error,
      context,
      stack: error.stack,
      reproductionSteps: this.generateReproductionSteps(),
      similarErrors: this.findSimilarErrors(error),
    }

    this.errorCount++
    this.addToErrorQueue(report)

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(report)
    }

    // Local storage for offline support
    if (this.config.enableLocalStorage) {
      this.saveToLocalStorage(report)
    }

    // Add breadcrumb
    this.addBreadcrumb('error', 'error', error.message, {
      errorId,
      code: error.code,
      severity: error.severity,
    })

    // Try to send immediately if online
    if (this.isOnline) {
      this.sendErrorReport(report)
    }

    return errorId
  }

  addBreadcrumb(
    level: Breadcrumb['level'],
    category: string,
    message: string,
    data?: Record<string, any>
  ): void {
    const breadcrumb: Breadcrumb = {
      level,
      category,
      message,
      timestamp: new Date(),
      data,
    }

    this.breadcrumbs.push(breadcrumb)

    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs = this.breadcrumbs.slice(-50)
    }
  }

  addUserAction(action: UserAction): void {
    this.userActions.push(action)

    // Keep only last 100 actions
    if (this.userActions.length > 100) {
      this.userActions = this.userActions.slice(-100)
    }
  }

  setUserContext(userId: string, userData?: Record<string, any>): void {
    this.addBreadcrumb('info', 'user', `User context set: ${userId}`, userData)
  }

  setCustomContext(key: string, value: any): void {
    this.addBreadcrumb('info', 'context', `Custom context: ${key}`, {
      [key]: value,
    })
  }

  // ====================== Private Methods ======================

  private buildErrorContext(customContext?: Record<string, any>): ErrorContext {
    const context: ErrorContext = {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      userActions: [...this.userActions],
      breadcrumbs: [...this.breadcrumbs],
      customData: customContext,
    }

    if (this.config.enablePerformanceTracking) {
      context.performance = this.getPerformanceMetrics()
    }

    return context
  }

  private getPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming
    const memory = (performance as any).memory

    return {
      loadTime: navigation
        ? navigation.loadEventEnd - navigation.loadEventStart
        : 0,
      memoryUsage: memory ? memory.usedJSHeapSize : undefined,
      connectionType: (navigator as any).connection?.type,
      effectiveType: (navigator as any).connection?.effectiveType,
    }
  }

  private generateReproductionSteps(): string[] {
    return this.userActions
      .slice(-10) // Last 10 actions
      .map(action => {
        switch (action.type) {
          case 'click':
            return `Clicked on ${action.element || 'unknown element'}`
          case 'navigation':
            return `Navigated to ${action.data?.url || 'unknown page'}`
          case 'form_submit':
            return `Submitted form: ${action.element || 'unknown form'}`
          case 'api_call':
            return `Made API call: ${action.data?.endpoint || 'unknown endpoint'}`
          default:
            return `${action.type}: ${action.element || 'unknown'}`
        }
      })
  }

  private findSimilarErrors(error: AppError): string[] {
    // Simple similarity check based on error code and message
    return this.errorQueue
      .filter(
        report =>
          report.error.code === error.code &&
          report.error.message.includes(error.message.split(' ')[0])
      )
      .slice(-5) // Last 5 similar errors
      .map(report => report.id)
  }

  private createErrorFromRejection(event: PromiseRejectionEvent): AppError {
    const reason = event.reason
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: reason?.message || 'Unhandled promise rejection',
      userMessage: 'An unexpected error occurred',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      stack: reason?.stack,
      context: { type: 'unhandled_rejection', reason },
      recoverable: false,
      retryable: false,
    }
  }

  private createErrorFromEvent(event: ErrorEvent): AppError {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: event.message,
      userMessage: 'An unexpected error occurred',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      stack: event.error?.stack,
      context: {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      recoverable: false,
      retryable: false,
    }
  }

  private createResourceError(event: Event): AppError {
    const target = event.target as HTMLElement
    return {
      code: ErrorCode.CONTENT_LOADING_ERROR,
      message: `Failed to load resource: ${target.tagName}`,
      userMessage: 'A resource failed to load',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context: {
        type: 'resource_error',
        tagName: target.tagName,
        src: (target as any).src || (target as any).href,
      },
      recoverable: true,
      retryable: true,
    }
  }

  private getElementSelector(element: Element): string {
    if (!element) return 'unknown'

    // Try to get a meaningful selector
    if (element.id) return `#${element.id}`
    if (element.className) return `.${element.className.split(' ')[0]}`
    return element.tagName.toLowerCase()
  }

  private addToErrorQueue(report: ErrorReport): void {
    this.errorQueue.push(report)

    // Keep queue size manageable
    if (this.errorQueue.length > 100) {
      this.errorQueue = this.errorQueue.slice(-100)
    }
  }

  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    try {
      await this.sendErrorBatch(errors)
    } catch (error) {
      // Re-queue errors if sending failed
      this.errorQueue.unshift(...errors)
      console.warn('Failed to send error batch:', error)
    }
  }

  private async sendErrorReport(report: ErrorReport): Promise<void> {
    if (!this.config.apiEndpoint) {
      return // No endpoint configured
    }

    try {
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify({
          type: 'error_report',
          report,
          environment: this.config.environment,
        }),
      })
    } catch (error) {
      // Silent fail - error will remain in queue for retry
      console.warn('Failed to send error report:', error)
    }
  }

  private async sendErrorBatch(reports: ErrorReport[]): Promise<void> {
    if (!this.config.apiEndpoint) {
      return
    }

    try {
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify({
          type: 'error_batch',
          reports,
          environment: this.config.environment,
        }),
      })
    } catch (error) {
      throw error // Let caller handle retry
    }
  }

  private logToConsole(report: ErrorReport): void {
    const { error, context } = report

    console.group(`🚨 Error Report [${error.severity}] - ${error.code}`)
    console.error('Message:', error.message)
    console.error('User Message:', error.userMessage)
    console.error('Context:', error.context)
    console.error('Error ID:', report.id)
    console.error('Session ID:', context.sessionId)

    if (error.stack) {
      console.error('Stack Trace:', error.stack)
    }

    if (report.reproductionSteps && report.reproductionSteps.length > 0) {
      console.group('Reproduction Steps:')
      report.reproductionSteps.forEach((step, i) => {
        console.log(`${i + 1}. ${step}`)
      })
      console.groupEnd()
    }

    if (context.breadcrumbs && context.breadcrumbs.length > 0) {
      console.group('Recent Breadcrumbs:')
      context.breadcrumbs.slice(-10).forEach(breadcrumb => {
        console.log(
          `[${breadcrumb.level}] ${breadcrumb.category}: ${breadcrumb.message}`
        )
      })
      console.groupEnd()
    }

    console.groupEnd()
  }

  private saveToLocalStorage(report: ErrorReport): void {
    try {
      const stored = localStorage.getItem('error_reports') || '[]'
      const reports = JSON.parse(stored)
      reports.push({
        ...report,
        // Stringify dates for storage
        error: {
          ...report.error,
          timestamp: report.error.timestamp.toISOString(),
        },
        context: {
          ...report.context,
          timestamp: report.context.timestamp.toISOString(),
        },
      })

      // Keep only last 50 reports
      const trimmed = reports.slice(-50)
      localStorage.setItem('error_reports', JSON.stringify(trimmed))
    } catch (error) {
      // Storage might be full or unavailable
      console.warn('Failed to save error to localStorage:', error)
    }
  }

  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('error_reports')
      if (stored) {
        const reports = JSON.parse(stored)
        // Add to queue for retry
        this.errorQueue.push(
          ...reports.map((report: any) => ({
            ...report,
            error: {
              ...report.error,
              timestamp: new Date(report.error.timestamp),
            },
            context: {
              ...report.context,
              timestamp: new Date(report.context.timestamp),
            },
          }))
        )

        // Clear localStorage after loading
        localStorage.removeItem('error_reports')
      }
    } catch (error) {
      console.warn('Failed to load persisted errors:', error)
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// ====================== React Hook ======================

export function useErrorMonitoring(config?: Partial<ErrorMonitoringConfig>) {
  const [monitoring] = React.useState(() =>
    ErrorMonitoringService.getInstance(config)
  )

  const captureError = React.useCallback(
    (error: AppError, context?: Record<string, any>) => {
      return monitoring.captureError(error, context)
    },
    [monitoring]
  )

  const addBreadcrumb = React.useCallback(
    (
      level: Breadcrumb['level'],
      category: string,
      message: string,
      data?: Record<string, any>
    ) => {
      monitoring.addBreadcrumb(level, category, message, data)
    },
    [monitoring]
  )

  const setUserContext = React.useCallback(
    (userId: string, userData?: Record<string, any>) => {
      monitoring.setUserContext(userId, userData)
    },
    [monitoring]
  )

  const setCustomContext = React.useCallback(
    (key: string, value: any) => {
      monitoring.setCustomContext(key, value)
    },
    [monitoring]
  )

  return {
    captureError,
    addBreadcrumb,
    setUserContext,
    setCustomContext,
  }
}

export default ErrorMonitoringService
