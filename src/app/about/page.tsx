'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Briefcase, Users, TrendingUp, Brain, Target, Loader2 } from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'

export default function AboutPage() {
  const [content, setContent] = useState(defaultContent.about)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        const aboutContent = await dataService.getContentSection('about')
        setContent(aboutContent || defaultContent.about)
      } catch (error) {
        console.error('Failed to fetch about content:', error)
        // Fallback to default content
        setContent(defaultContent.about)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/3">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {content.hero.title}
              </h1>
              <div className="prose prose-lg dark:prose-invert mb-8">
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {content.hero.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Team Leadership</Badge>
                <Badge variant="secondary">Digital Product Management</Badge>
                <Badge variant="secondary">Agile Methodology</Badge>
                <Badge variant="secondary">Strategic Management</Badge>
                <Badge variant="secondary">SEO & Marketing</Badge>
                <Badge variant="secondary">Tech Stack Migration</Badge>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-200">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.hero.quickStats.map((stat, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </span>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Philosophy */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{content.philosophy.title}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {content.philosophy.description}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.philosophy.cards.map((card, index) => {
              const iconConfig = [
                { icon: Users, bgColor: "bg-blue-100 dark:bg-blue-900", textColor: "text-blue-600 dark:text-blue-400" },
                { icon: Brain, bgColor: "bg-green-100 dark:bg-green-900", textColor: "text-green-600 dark:text-green-400" },
                { icon: Target, bgColor: "bg-purple-100 dark:bg-purple-900", textColor: "text-purple-600 dark:text-purple-400" }
              ]
              const config = iconConfig[index % iconConfig.length]
              const IconComponent = config.icon

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-6 w-6 ${config.textColor}`} />
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Professional Journey */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {content.journey.title}
          </h2>
          <div className="space-y-8">
            {content.journey.positions.map((position, index) => {
              const iconConfig = [
                { icon: Briefcase, bgColor: "bg-blue-100 dark:bg-blue-900", textColor: "text-blue-600 dark:text-blue-400" },
                { icon: TrendingUp, bgColor: "bg-green-100 dark:bg-green-900", textColor: "text-green-600 dark:text-green-400" },
                { icon: Briefcase, bgColor: "bg-purple-100 dark:bg-purple-900", textColor: "text-purple-600 dark:text-purple-400" }
              ]
              const config = iconConfig[index % iconConfig.length]
              const IconComponent = config.icon

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${config.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">
                          {position.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {position.company} • {position.period} • {position.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-slate-600 dark:text-slate-400">
                      {position.description}
                    </p>
                    {position.metrics && position.metrics.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {position.metrics.map((metric, metricIndex) => {
                          const colors = [
                            "text-blue-600 dark:text-blue-400",
                            "text-green-600 dark:text-green-400",
                            "text-purple-600 dark:text-purple-400",
                            "text-orange-600 dark:text-orange-400"
                          ]
                          return (
                            <div key={metricIndex} className="text-center">
                              <div className={`font-semibold text-lg ${colors[metricIndex % colors.length]}`}>
                                {metric.value}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {metric.label}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Core Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Core Competencies
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">Product & Strategy</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Strategic Management & Planning</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Team Leadership (13+ personnel)</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Product Roadmap & Lifecycle</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>International Market Expansion</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Technical & Digital
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>SEO Strategy & Implementation</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Tech Stack Modernization</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Agile/Scrum Methodology</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Digital Marketing Integration</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Side */}
        <section className="mb-16">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Beyond the Spreadsheets
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto text-center">
              <p>
                When I'm not leading cross-functional teams or architecting
                product roadmaps, you'll find me exploring the medieval streets
                of Volterra, Italy, where I'm currently based. From my Tuscan
                hillside home, I develop personal projects like fitness apps and
                productivity tools, bridging the gap between strategic product
                thinking and hands-on development.
              </p>
              <p>
                My journey from Slovakia to international product leadership has
                taught me that the best insights come from diverse perspectives
                and real user experiences. I'm passionate about building mental
                health platforms like VetWell, combining my product expertise
                with social impact initiatives. Whether it's algorithmic trading
                at StagStrat or wellness technology, I believe in creating
                products that genuinely improve people's lives.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
