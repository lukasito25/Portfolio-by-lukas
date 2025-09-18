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
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Portfolio. Built with Next.js and
              Tailwind CSS.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {socialLinks.map(link => {
              const Icon = iconMap[link.icon as keyof typeof iconMap]
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                >
                  <Icon className="h-5 w-5" />
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
