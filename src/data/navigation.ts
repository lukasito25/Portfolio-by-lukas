import { NavItem } from '@/types'

export const mainNavigation: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    description: 'Welcome to my portfolio',
  },
  {
    label: 'About',
    href: '/about',
    description: 'Learn more about me',
  },
  {
    label: 'Work',
    href: '/work',
    description: 'View my projects',
  },
  {
    label: 'Blog',
    href: '/blog',
    description: 'Read my thoughts',
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch',
  },
]

export const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: 'Github',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: 'Linkedin',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: 'Twitter',
  },
  {
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: 'Mail',
  },
]
