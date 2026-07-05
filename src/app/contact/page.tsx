'use client'

import { useState } from 'react'
import { trackFormSubmission } from '@/lib/analytics'
import { Reveal } from '@/components/motion/reveal'
import {
  Send,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Linkedin,
} from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  company?: string
  subject?: string
  message: string
  phone?: string
  projectType?: string
  budgetRange?: string
}

const inquiryTypes = [
  'Hiring for a senior PM role',
  'Advisory / consulting project',
  'Product conversation / something else',
]

const expertiseAreas = [
  'Product Strategy',
  'Team Leadership',
  'International Expansion',
  'Growth Strategy',
  'Scale Operations',
  'Strategic Advisory',
]

const fieldClass =
  'w-full rounded-xl border border-line bg-(--surface) px-4 py-3 text-sm text-foreground placeholder:text-tertiary-fg transition-colors focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent-soft)'

const labelClass = 'mb-2 block text-sm font-medium text-secondary-fg'

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    phone: '',
    projectType: '',
    budgetRange: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error')
      setSubmitMessage('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact-page',
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(
          "Thank you for your message! I'll get back to you within 24 hours."
        )

        trackFormSubmission('contact_form', true)

        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          phone: '',
          projectType: '',
          budgetRange: '',
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch {
      setSubmitStatus('error')
      setSubmitMessage(
        'Failed to send message. Please try again or email me directly.'
      )

      trackFormSubmission('contact_form', false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      {/* Hero */}
      <Reveal as="section" className="mb-16 max-w-3xl">
        <p className="section-label mb-4">Contact</p>
        <h1 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Get in touch
        </h1>
        <p className="text-lg leading-relaxed text-secondary-fg md:text-xl">
          Whether you&apos;re hiring for a senior PM role, looking for advisory
          help on a product, or just want to talk shop — drop me a message and
          I&apos;ll get back to you within 24 hours.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-6 lg:col-span-1">
          <Reveal>
            <div className="panel p-7">
              <p className="section-label mb-6 !text-[0.6875rem]">
                Direct lines
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:lukas.hosala@icloud.com"
                  className="flex items-center gap-3 text-sm text-secondary-fg transition-colors hover:text-foreground"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                    <Mail className="h-4 w-4 text-(--accent)" />
                  </span>
                  lukas.hosala@icloud.com
                </a>
                <a
                  href="tel:+393793110473"
                  className="flex items-center gap-3 text-sm text-secondary-fg transition-colors hover:text-foreground"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                    <Phone className="h-4 w-4 text-(--accent)" />
                  </span>
                  +39 379 3110473
                </a>
                <a
                  href="https://linkedin.com/in/hosala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-secondary-fg transition-colors hover:text-foreground"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                    <Linkedin className="h-4 w-4 text-(--accent)" />
                  </span>
                  linkedin.com/in/hosala
                </a>
                <div className="flex items-center gap-3 text-sm text-secondary-fg">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                    <MapPin className="h-4 w-4 text-(--accent)" />
                  </span>
                  Italy, EU
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel p-7">
              <p className="section-label mb-6 !text-[0.6875rem]">
                Expertise areas
              </p>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map(area => (
                  <span key={area} className="chip text-xs">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="panel p-7">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-(--accent)" />
                <p className="section-label !text-[0.6875rem]">Response time</p>
              </div>
              <p className="text-sm leading-relaxed text-secondary-fg">
                I typically respond to inquiries within 24 hours. For urgent
                matters, please mention it in your message subject line.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Contact form */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="panel p-7 md:p-10">
            <h2 className="font-display mb-2 text-2xl font-semibold">
              Send me a message
            </h2>
            <p className="mb-8 text-sm text-secondary-fg">
              Tell me about your project or opportunity. I&apos;d love to learn
              how I can help.
            </p>

            {submitStatus === 'success' && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {submitMessage}
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  {submitMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="your.email@company.com"
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className={labelClass}>
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={e => handleInputChange('company', e.target.value)}
                    placeholder="Your company name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className={labelClass}>
                    I&apos;m reaching out about
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={e =>
                      handleInputChange('projectType', e.target.value)
                    }
                    className={fieldClass}
                  >
                    <option value="">Select one (optional)</option>
                    {inquiryTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  placeholder="Tell me about your project, challenges, goals, or how I can help..."
                  rows={6}
                  required
                  className={fieldClass}
                />
              </div>

              <p className="text-xs leading-relaxed text-tertiary-fg">
                Your details are used only to reply to your message. See the{' '}
                <a href="/privacy" className="underline hover:text-foreground">
                  privacy policy
                </a>{' '}
                for how data is handled.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
