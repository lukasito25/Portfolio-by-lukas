'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  RefreshCw,
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

const projectTypes = [
  'Product Strategy Consulting',
  'Team Leadership & Management',
  'Growth Strategy Development',
  'International Market Expansion',
  'Product Management Advisory',
  'Strategic Planning',
  'Other',
]

const budgetRanges = [
  'Under $10K',
  '$10K - $25K',
  '$25K - $50K',
  '$50K - $100K',
  '$100K+',
  'Prefer to discuss',
]

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
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(
        'Failed to send message. Please try again or email me directly.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Let&apos;s Connect
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to scale your product, build world-class teams, or expand into
            new markets? Let&apos;s discuss how my experience leading 165M+ user
            products can help accelerate your growth.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Get In Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>lukas.hosala@example.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span>Available upon request</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span>Available for remote & international projects</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expertise Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Product Strategy</Badge>
                      <Badge variant="secondary">Team Leadership</Badge>
                      <Badge variant="secondary">International Expansion</Badge>
                      <Badge variant="secondary">Growth Strategy</Badge>
                      <Badge variant="secondary">Scale Operations</Badge>
                      <Badge variant="secondary">Strategic Advisory</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      I typically respond to inquiries within 24 hours. For
                      urgent matters, please mention it in your message subject
                      line.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Me a Message</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tell me about your project or opportunity. I&apos;d love to
                    learn how I can help.
                  </p>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800">{submitMessage}</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-800">{submitMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={e =>
                            handleInputChange('name', e.target.value)
                          }
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e =>
                            handleInputChange('email', e.target.value)
                          }
                          placeholder="your.email@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={e =>
                            handleInputChange('company', e.target.value)
                          }
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e =>
                            handleInputChange('phone', e.target.value)
                          }
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={e =>
                          handleInputChange('subject', e.target.value)
                        }
                        placeholder="Brief subject line"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <select
                          id="projectType"
                          value={formData.projectType}
                          onChange={e =>
                            handleInputChange('projectType', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="budgetRange">Budget Range</Label>
                        <select
                          id="budgetRange"
                          value={formData.budgetRange}
                          onChange={e =>
                            handleInputChange('budgetRange', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={e =>
                          handleInputChange('message', e.target.value)
                        }
                        placeholder="Tell me about your project, challenges, goals, or how I can help..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
