'use client'

import { useState, useEffect } from 'react'
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
  ArrowUpRight,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Brain,
  Globe,
  Building2,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'

const personalProjectColors = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-teal-600',
  'from-indigo-500 to-blue-600',
]

const personalProjectIcons = [Target, BarChart3, Users]

const professionalProjectColors = [
  'bg-green-100 dark:bg-green-900',
  'bg-purple-100 dark:bg-purple-900',
  'bg-blue-100 dark:bg-blue-900',
  'bg-red-100 dark:bg-red-900',
]

const professionalProjectIconColors = [
  'text-green-600 dark:text-green-400',
  'text-purple-600 dark:text-purple-400',
  'text-blue-600 dark:text-blue-400',
  'text-red-600 dark:text-red-400',
]

const professionalProjectIcons = [TrendingUp, Building2, Brain, Globe]

export default function WorkPage() {
  const [content, setContent] = useState(defaultContent.work)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const workContent = await dataService.getContentSection('work')
        if (workContent) {
          setContent(workContent)
        }
      } catch (fetchError) {
        console.error('Failed to fetch work content, using fallback:', fetchError)
        // Keep default content as fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading work content...</p>
            </div>
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
            {content.hero.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            {content.hero.description}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Digital Sports</Badge>
            <Badge variant="secondary">FinTech</Badge>
            <Badge variant="secondary">Website Redesigns</Badge>
            <Badge variant="secondary">Team Leadership</Badge>
            <Badge variant="secondary">International Teams</Badge>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Featured Case Study
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  {content.featured.title}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  {content.featured.challenge}
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">165M+ Global Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-medium">13-Person Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Multiple Locations</span>
                  </div>
                </div>
                <Button size="lg" className="group">
                  View Full Case Study
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {content.featured.challenge}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {content.featured.solution}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {content.featured.impact}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Projects Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Personal Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Side projects showcasing full-stack development, wellness
              technology, and social impact initiatives I've built and launched.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {content.projects.map((project, index) => {
              const Icon = personalProjectIcons[index % personalProjectIcons.length]

              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`relative h-48 bg-gradient-to-br ${personalProjectColors[index % personalProjectColors.length]} overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold">{project.title}</h3>
                        <p className="text-sm opacity-90">{project.description}</p>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {project.metrics.slice(0, 2).map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Professional Projects Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Professional Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Enterprise projects from my experience at adidas International
              Marketing B.V., StagStrat, and international product management
              roles.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {content.projects.slice(0, 4).map((project, index) => {
              const Icon = professionalProjectIcons[index % professionalProjectIcons.length]

              return (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${professionalProjectColors[index % professionalProjectColors.length]} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`h-6 w-6 ${professionalProjectIconColors[index % professionalProjectIconColors.length]}`} />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                    </div>
                    <CardTitle className="text-xl">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {project.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {project.metrics.slice(0, 2).map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className={`font-semibold text-lg ${professionalProjectIconColors[index % professionalProjectIconColors.length]}`}>
                            {metric.value}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-16">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                My Product Development Process
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A systematic approach that combines user research, data
                analysis, and technical expertise to build products that users
                love and businesses rely on.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Discovery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deep user research, market analysis, and problem validation
                  through interviews and data analysis.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Strategy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Define clear objectives, success metrics, and roadmap
                  priorities based on business goals and user needs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Execution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Iterative development with continuous testing, feedback loops,
                  and cross-functional collaboration.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Optimization</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Data-driven iteration, A/B testing, and continuous improvement
                  based on user behavior and business metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Let's Build Your Next Success Story
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Ready to transform your product vision into measurable business
              impact? I'd love to discuss how my strategic approach and
              technical expertise can help your team succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Schedule a Strategy Call</Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn About My Process</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
