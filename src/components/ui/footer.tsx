import Link from 'next/link'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { socialLinks } from '@/data/navigation'

const iconMap = {
  Github,
  Linkedin,
  Twitter,
  Mail,
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-display text-base font-semibold text-foreground">
              Lukáš Hošala<span className="text-(--accent)">.</span>
            </p>
            <p className="mt-1 text-sm text-tertiary-fg">
              Senior Product Manager · Based in Italy, working everywhere · ©{' '}
              {new Date().getFullYear()} ·{' '}
              <Link
                href="/privacy"
                className="underline transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map(link => {
              const Icon = iconMap[link.icon as keyof typeof iconMap]
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-secondary-fg transition-colors hover:border-(--accent) hover:text-(--accent)"
                >
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
