'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement
    const body = document.body

    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Add new theme class
    root.classList.add(newTheme)
    body.classList.add(newTheme)

    // Update CSS custom properties for comprehensive theming
    if (newTheme === 'dark') {
      root.style.setProperty('--background', '#0a0a0f')
      root.style.setProperty('--foreground', '#f8fafc')
      root.style.setProperty('--primary', '#a78bfa')
      root.style.setProperty('--primary-light', '#c4b5fd')
      root.style.setProperty('--primary-dark', '#8b5cf6')
      root.style.setProperty('--accent', '#c084fc')
      root.style.setProperty('--accent-light', '#ddd6fe')
      root.style.setProperty('--accent-dark', '#a855f7')
      root.style.setProperty('--gradient-cosmic', 'linear-gradient(135deg, #4c1d95 0%, #581c87 100%)')
      root.style.setProperty('--gradient-aurora', 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)')
      root.style.setProperty('--gradient-subtle', 'linear-gradient(135deg, #1f2937 0%, #374151 100%)')
    } else {
      root.style.setProperty('--background', '#faf8ff')
      root.style.setProperty('--foreground', '#1e1b2e')
      root.style.setProperty('--primary', '#6366f1')
      root.style.setProperty('--primary-light', '#a5b4fc')
      root.style.setProperty('--primary-dark', '#4338ca')
      root.style.setProperty('--accent', '#8b5cf6')
      root.style.setProperty('--accent-light', '#c4b5fd')
      root.style.setProperty('--accent-dark', '#7c3aed')
      root.style.setProperty('--gradient-cosmic', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
      root.style.setProperty('--gradient-aurora', 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)')
      root.style.setProperty('--gradient-subtle', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)')
    }

    // Force repaint to ensure theme changes are applied immediately
    setTimeout(() => {
      document.dispatchEvent(new Event('themechange'))
    }, 0)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('portfolio-theme', newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 hover:bg-purple-100"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 hover:bg-purple-100 dark:hover:bg-gray-800 transition-all duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        }`}
      />
    </Button>
  )
}