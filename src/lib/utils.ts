import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe array utility to prevent map errors
export function safeArray<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : []
}

// Safe string utility to prevent undefined/null strings
export function safeString(str: string | undefined | null): string {
  return typeof str === 'string' ? str : ''
}
