import { z } from 'zod'

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .optional(),
})

export type NewsletterData = z.infer<typeof newsletterSchema>

// Project filters validation
export const projectFiltersSchema = z.object({
  category: z.string().optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export type ProjectFilters = z.infer<typeof projectFiltersSchema>

// Blog post filters validation
export const blogFiltersSchema = z.object({
  tag: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export type BlogFilters = z.infer<typeof blogFiltersSchema>

// Pagination validation
export const paginationSchema = z.object({
  page: z
    .string()
    .nullable()
    .default('1')
    .transform(val => (val ? Number(val) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .nullable()
    .default('10')
    .transform(val => (val ? Number(val) : 10))
    .pipe(z.number().int().min(1).max(100)),
})

export type Pagination = z.infer<typeof paginationSchema>

// Search validation
export const searchSchema = z.object({
  q: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z
    .string()
    .nullable()
    .transform(val => val as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null)
    .optional(),
  featured: z
    .string()
    .nullable()
    .transform(val => val === 'true' || val === '1')
    .optional(),
})

export type Search = z.infer<typeof searchSchema>

// Create project validation
export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
  excerpt: z.string().min(1).max(300),
  thumbnail: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  category: z.string().min(1).max(100),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  technologies: z.array(z.string()).optional(),
})

export type CreateProject = z.infer<typeof createProjectSchema>
