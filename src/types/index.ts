// Portfolio content types
export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  category: ProjectCategory
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  published: boolean
  publishedAt?: Date
  image?: string
  tags: string[]
  readTime: number
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: Date
  endDate?: Date
  current: boolean
  technologies: string[]
  location: string
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  featured: boolean
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
  replied: boolean
}

// Enums
export enum ProjectCategory {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  DESKTOP_APP = 'desktop_app',
  LIBRARY = 'library',
  OTHER = 'other',
}

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  DESIGN = 'design',
  OTHER = 'other',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

// Navigation
export interface NavItem {
  label: string
  href: string
  description?: string
}

// API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}
