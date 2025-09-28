'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProjectCarousel } from '@/components/ui/project-carousel'
import {
  ArrowRight,
  TrendingUp,
  Users,
  Brain,
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  Rocket,
  Star,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'

export default function Home() {
  const [content, setContent] = useState(defaultContent.homepage)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const homepageContent = await dataService.getContentSection('homepage')
        if (homepageContent && Object.keys(homepageContent).length > 0) {
          setContent(homepageContent)
        }
      } catch (error) {
        console.error('Failed to load homepage content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Cosmic Background */}
      <section className="relative py-32 overflow-hidden">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent)] cosmic-pulse"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent)] cosmic-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="mb-8 cosmic-float">
            <span className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm border border-purple-200 text-purple-800 text-sm font-medium rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              {content.hero?.badge || ''}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
            {(content.hero.headline || []).map((line, index) => (
              <span key={index} className="block mb-2">
                <span
                  className={
                    index < (content.hero.headline || []).length - 1
                      ? 'gradient-text cosmic-glow'
                      : 'text-gray-900 dark:text-gray-100'
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            {(content.hero?.subheadline || '')
              .replace(/13 personnel/g, '')
              .replace(/165M\+ users/g, '')}
            <span className="font-bold text-purple-600 cosmic-pulse">
              13 personnel
            </span>
            {' to deliver products that serve '}
            <span className="font-bold text-green-600 cosmic-pulse">
              165M+ users
            </span>
            {' globally.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="cosmic-button text-white border-0 px-8 py-4 text-lg"
            >
              <Link href="/work">
                <Rocket className="mr-2 h-5 w-5" />
                View Case Studies
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 py-4 text-lg border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Link href="/contact">
                <Zap className="mr-2 h-5 w-5" />
                Let&apos;s Build Together
              </Link>
            </Button>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {(content.hero.metrics || []).map((metric, index) => {
              const icons = [
                <Rocket key={`rocket-${index}`} className="w-6 h-6" />,
                <Users key={`users-${index}`} className="w-6 h-6" />,
                <Target key={`target-${index}`} className="w-6 h-6" />,
                <Star key={`star-${index}`} className="w-6 h-6" />,
              ]
              const colors = [
                'text-blue-600',
                'text-purple-600',
                'text-green-600',
                'text-orange-600',
              ]
              return (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl cosmic-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`flex justify-center mb-3 ${colors[index]}`}>
                    {icons[index]}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {metric?.value || ''}
                  </div>
                  <div className="text-sm text-gray-600">{metric?.label || ''}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Project Carousel Section */}
      <section className="py-24 bg-gray-50">
        <ProjectCarousel />
      </section>

      {/* Core Competencies */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core <span className="gradient-text">Competencies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              8+ years of international product management experience across
              digital sports, e-commerce, and fintech, with expertise in agile
              methodologies and team leadership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content.competencies || []).map((competency, index) => {
              const icons = [
                <Users key={`users-comp-${index}`} className="w-8 h-8" />,
                <BarChart3 key={`chart-${index}`} className="w-8 h-8" />,
                <Target key={`target-comp-${index}`} className="w-8 h-8" />,
                <Brain key={`brain-${index}`} className="w-8 h-8" />,
                <TrendingUp key={`trending-${index}`} className="w-8 h-8" />,
                <Lightbulb key={`lightbulb-${index}`} className="w-8 h-8" />,
              ]
              const colors = [
                'from-purple-500 to-blue-500',
                'from-blue-500 to-teal-500',
                'from-teal-500 to-green-500',
                'from-green-500 to-yellow-500',
                'from-yellow-500 to-orange-500',
                'from-orange-500 to-red-500',
              ]
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-300 cosmic-float border-0 bg-white/70 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${colors[index]} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {icons[index]}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {competency?.title || ''}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-gray-600 leading-relaxed px-6 pb-6">
                    {competency?.description || ''}
                  </CardDescription>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {content.cta?.title || ''}
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            {content.cta?.description || ''}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/contact" className="flex items-center">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start a Conversation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <Link href="/about" className="flex items-center">
                Learn More About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
