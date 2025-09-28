/**
 * Error Constants Module
 * Provides standardized error codes and severity levels as const objects
 * This module is standalone to prevent circular dependencies and hoisting issues
 */

// Error codes as const object to prevent hoisting issues
export const ErrorCode = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  OFFLINE_ERROR: 'OFFLINE_ERROR',

  // API errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',

  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  DATABASE_TIMEOUT: 'DATABASE_TIMEOUT',

  // Form errors
  FORM_VALIDATION_ERROR: 'FORM_VALIDATION_ERROR',
  FORM_SUBMISSION_ERROR: 'FORM_SUBMISSION_ERROR',

  // Content errors
  CONTENT_LOADING_ERROR: 'CONTENT_LOADING_ERROR',
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  PARTIAL_CONTENT_ERROR: 'PARTIAL_CONTENT_ERROR',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const

// Error severity levels as const object to prevent hoisting issues
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

// Type definitions for TypeScript support
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]
export type ErrorSeverityType =
  (typeof ErrorSeverity)[keyof typeof ErrorSeverity]

// Helper functions for error constants
export function isValidErrorCode(code: string): code is ErrorCodeType {
  return Object.values(ErrorCode).includes(code as ErrorCodeType)
}

export function isValidErrorSeverity(
  severity: string
): severity is ErrorSeverityType {
  return Object.values(ErrorSeverity).includes(severity as ErrorSeverityType)
}

// Severity mapping for error codes
export function getDefaultSeverityForErrorCode(
  code: ErrorCodeType
): ErrorSeverityType {
  switch (code) {
    case ErrorCode.UNAUTHORIZED:
    case ErrorCode.FORBIDDEN:
    case ErrorCode.DATABASE_CONNECTION_ERROR:
    case ErrorCode.CONFIGURATION_ERROR:
      return ErrorSeverity.CRITICAL

    case ErrorCode.SERVER_ERROR:
    case ErrorCode.DATABASE_ERROR:
    case ErrorCode.FORM_SUBMISSION_ERROR:
      return ErrorSeverity.HIGH

    case ErrorCode.NETWORK_ERROR:
    case ErrorCode.TIMEOUT_ERROR:
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.CONTENT_LOADING_ERROR:
      return ErrorSeverity.MEDIUM

    case ErrorCode.CONNECTION_ERROR:
    case ErrorCode.OFFLINE_ERROR:
    case ErrorCode.NOT_FOUND:
    case ErrorCode.RATE_LIMITED:
    case ErrorCode.DATABASE_TIMEOUT:
    case ErrorCode.FORM_VALIDATION_ERROR:
    case ErrorCode.CONTENT_NOT_FOUND:
    case ErrorCode.PARTIAL_CONTENT_ERROR:
    case ErrorCode.UNKNOWN_ERROR:
    default:
      return ErrorSeverity.LOW
  }
}
