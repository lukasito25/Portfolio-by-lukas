'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import { mainNavigation } from '@/data/navigation'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-line backdrop-blur-xl"
      style={{ background: 'var(--nav-bg)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Lukáš Hošala
            <span className="text-(--accent)">.</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {mainNavigation.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-accent-soft text-(--accent)'
                      : 'text-secondary-fg hover:bg-(--surface) hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-secondary-fg transition-colors hover:text-foreground md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-line pb-4 pt-2 md:hidden">
            <nav className="space-y-1">
              {mainNavigation.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-xl px-4 py-3 text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-accent-soft text-(--accent)'
                      : 'text-secondary-fg hover:bg-(--surface) hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
