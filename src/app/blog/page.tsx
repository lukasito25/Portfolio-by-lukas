'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Users,
  BarChart3,
  Zap,
  Loader2,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'

export default function BlogPage() {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const blogContent = await dataService.getContentSection('blog')
        setContent(blogContent)
      } catch (error) {
        console.error('Failed to load blog content:', error)
        // Fallback to default content
        setContent(defaultContent.blog)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-slate-600 dark:text-slate-400">
                Loading blog content...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Failed to load blog content.
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            {content.hero?.title || 'Insights from the Field'}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            {content.hero?.description ||
              'Real stories and lessons learned from 8+ years managing international teams at adidas Digital Sports and fintech startups.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Latest Articles</Button>
            <Button variant="outline" size="lg">
              About My Experience
            </Button>
          </div>
        </section>

        {/* Featured Article */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Featured Article
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  {content.featured?.title ||
                    'Managing International Teams: Lessons from Leading 13 People Across Multiple Time Zones'}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  {content.featured?.description ||
                    'Real insights from my experience leading cross-functional teams of up to 13 personnel at adidas Digital Sports.'}
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>January 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>From personal experience</span>
                  </div>
                </div>
                <Button size="lg" className="group">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                      {content.featured?.keyInsights?.map(
                        (insight: string, index: number) => (
                          <li key={index}>• {insight}</li>
                        )
                      ) || [
                        <li key="1">
                          • Communication strategies across multiple time zones
                        </li>,
                        <li key="2">
                          • Managing external freelancers and internal teams
                        </li>,
                        <li key="3">
                          • Coordinating complex technical migrations with zero
                          downtime
                        </li>,
                        <li key="4">
                          • Building trust and accountability in distributed
                          teams
                        </li>,
                      ]}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {content.articles?.map((article: any, index: number) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article?.date || ''}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{article?.readTime || ''}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article?.title || ''}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {article?.description || ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {article?.content || ''}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {(article.tags || []).map(
                        (tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="outline">
                            {tag}
                          </Badge>
                        )
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            )) || [
              // Fallback content
              <Card
                key="fallback-1"
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>January 8, 2025</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>6 min read</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    From Slovakia to Global Scale: My Journey in Product
                    Management
                  </CardTitle>
                  <CardDescription className="text-base">
                    How I went from Sport Management graduate to leading
                    international product teams at adidas Digital Sports serving
                    165M+ users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    After leading 15+ cross-functional teams, I've learned that
                    great collaboration isn't about processes—it's about people.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline">Leadership</Badge>
                      <Badge variant="outline">Team Building</Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>,
            ]}
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {content.expertise?.title || 'Areas of Expertise'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {content.expertise?.areas?.map((area: any, index: number) => {
              // Icon mapping based on area title
              const getIcon = (title: string) => {
                if (
                  title.toLowerCase().includes('team') ||
                  title.toLowerCase().includes('leadership')
                ) {
                  return (
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )
                }
                if (
                  title.toLowerCase().includes('sports') ||
                  title.toLowerCase().includes('commerce')
                ) {
                  return (
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  )
                }
                if (
                  title.toLowerCase().includes('fintech') ||
                  title.toLowerCase().includes('trading')
                ) {
                  return (
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  )
                }
                if (
                  title.toLowerCase().includes('tech') ||
                  title.toLowerCase().includes('migration')
                ) {
                  return (
                    <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  )
                }
                if (
                  title.toLowerCase().includes('seo') ||
                  title.toLowerCase().includes('marketing')
                ) {
                  return (
                    <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  )
                }
                if (
                  title.toLowerCase().includes('agile') ||
                  title.toLowerCase().includes('strategic')
                ) {
                  return (
                    <Lightbulb className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  )
                }
                return (
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                )
              }

              const getBgColor = (title: string) => {
                if (
                  title.toLowerCase().includes('team') ||
                  title.toLowerCase().includes('leadership')
                ) {
                  return 'bg-blue-100 dark:bg-blue-900'
                }
                if (
                  title.toLowerCase().includes('sports') ||
                  title.toLowerCase().includes('commerce')
                ) {
                  return 'bg-green-100 dark:bg-green-900'
                }
                if (
                  title.toLowerCase().includes('fintech') ||
                  title.toLowerCase().includes('trading')
                ) {
                  return 'bg-purple-100 dark:bg-purple-900'
                }
                if (
                  title.toLowerCase().includes('tech') ||
                  title.toLowerCase().includes('migration')
                ) {
                  return 'bg-orange-100 dark:bg-orange-900'
                }
                if (
                  title.toLowerCase().includes('seo') ||
                  title.toLowerCase().includes('marketing')
                ) {
                  return 'bg-red-100 dark:bg-red-900'
                }
                if (
                  title.toLowerCase().includes('agile') ||
                  title.toLowerCase().includes('strategic')
                ) {
                  return 'bg-teal-100 dark:bg-teal-900'
                }
                return 'bg-blue-100 dark:bg-blue-900'
              }

              return (
                <Card
                  key={index}
                  className="text-center group hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${getBgColor(area?.title || '')} rounded-lg flex items-center justify-center mx-auto mb-4`}
                    >
                      {getIcon(area?.title || '')}
                    </div>
                    <CardTitle>{area?.title || ''}</CardTitle>
                    <CardDescription>{area?.description || ''}</CardDescription>
                  </CardHeader>
                </Card>
              )
            }) || [
              // Fallback content
              <Card
                key="fallback-1"
                className="text-center group hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>International Team Leadership</CardTitle>
                  <CardDescription>
                    Leading 13+ personnel across multiple countries
                  </CardDescription>
                </CardHeader>
              </Card>,
            ]}
          </div>
        </section>

        {/* Connect CTA */}
        <section className="text-center">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Interested in discussing international team leadership, product
              strategy, or digital transformation? I'd love to share insights
              from my 8+ years of experience at adidas Digital Sports and
              fintech startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/about">Learn About My Experience</Link>
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Based in Volterra, Italy • Available for consulting and
              collaboration
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
