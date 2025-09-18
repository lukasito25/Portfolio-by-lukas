'use client'

import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Star,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent } from './card'

interface ProjectData {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  technologies: string[]
  metrics: {
    label: string
    value: string
    icon: React.ReactNode
    color: string
  }[]
  links: {
    demo?: string
    github?: string
    case_study?: string
  }
  category: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'concept'
}

const sampleProjects: ProjectData[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description:
      'Revolutionary analytics platform leveraging machine learning for predictive insights and automated decision-making.',
    longDescription:
      'Led the development of an enterprise-grade analytics platform that transforms raw data into actionable insights using advanced ML algorithms. The platform reduced manual analysis time by 85% and improved forecast accuracy by 40%.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    technologies: [
      'React',
      'TypeScript',
      'Python',
      'TensorFlow',
      'AWS',
      'PostgreSQL',
    ],
    metrics: [
      {
        label: 'Revenue Impact',
        value: '$15M ARR',
        icon: <DollarSign className="w-4 h-4" />,
        color: 'text-green-600',
      },
      {
        label: 'User Growth',
        value: '340%',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-blue-600',
      },
      {
        label: 'Active Users',
        value: '50K+',
        icon: <Users className="w-4 h-4" />,
        color: 'text-purple-600',
      },
    ],
    links: {
      demo: 'https://demo.example.com',
      case_study: '/work#ai-analytics',
    },
    category: 'AI/ML',
    featured: true,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Global E-commerce Marketplace',
    description:
      'Multi-vendor marketplace platform serving 15 international markets with advanced logistics and payment integration.',
    longDescription:
      'Architected and launched a comprehensive e-commerce solution supporting multiple currencies, languages, and payment methods. Achieved 200% revenue growth within 18 months of launch.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    technologies: [
      'Next.js',
      'Node.js',
      'Stripe',
      'MongoDB',
      'Redis',
      'Docker',
    ],
    metrics: [
      {
        label: 'Markets Served',
        value: '15',
        icon: <Star className="w-4 h-4" />,
        color: 'text-yellow-600',
      },
      {
        label: 'Revenue Growth',
        value: '200%',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600',
      },
      {
        label: 'Transactions',
        value: '1M+',
        icon: <DollarSign className="w-4 h-4" />,
        color: 'text-blue-600',
      },
    ],
    links: {
      demo: 'https://marketplace.example.com',
      github: 'https://github.com/example/marketplace',
    },
    category: 'E-commerce',
    featured: true,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Smart Workflow Automation',
    description:
      'Enterprise automation platform that streamlines business processes using AI-driven workflow optimization.',
    longDescription:
      'Developed an intelligent automation system that analyzes business processes and suggests optimizations. Delivered 60% efficiency improvements across Fortune 500 client operations.',
    image:
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
    technologies: [
      'Vue.js',
      'FastAPI',
      'scikit-learn',
      'PostgreSQL',
      'Kubernetes',
      'GCP',
    ],
    metrics: [
      {
        label: 'Efficiency Gain',
        value: '60%',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600',
      },
      {
        label: 'Enterprise Clients',
        value: '50+',
        icon: <Users className="w-4 h-4" />,
        color: 'text-purple-600',
      },
      {
        label: 'Cost Savings',
        value: '$5M+',
        icon: <DollarSign className="w-4 h-4" />,
        color: 'text-blue-600',
      },
    ],
    links: {
      case_study: '/work#workflow-automation',
    },
    category: 'Enterprise',
    featured: false,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Mobile-First Social Platform',
    description:
      'Next-generation social networking app focused on authentic connections and community building.',
    longDescription:
      'Led product strategy for a mobile-first social platform emphasizing genuine interactions over engagement metrics. Achieved 4.8/5 App Store rating and 100K+ downloads in first quarter.',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    technologies: [
      'React Native',
      'GraphQL',
      'Apollo',
      'Firebase',
      'Swift',
      'Kotlin',
    ],
    metrics: [
      {
        label: 'App Store Rating',
        value: '4.8/5',
        icon: <Star className="w-4 h-4" />,
        color: 'text-yellow-600',
      },
      {
        label: 'Downloads',
        value: '100K+',
        icon: <Users className="w-4 h-4" />,
        color: 'text-purple-600',
      },
      {
        label: 'Engagement',
        value: '85%',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'text-green-600',
      },
    ],
    links: {
      demo: 'https://apps.apple.com/app/example',
    },
    category: 'Mobile',
    featured: false,
    status: 'completed',
  },
]

export function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextProject = () => {
    setCurrentIndex(prev => (prev + 1) % sampleProjects.length)
  }

  const prevProject = () => {
    setCurrentIndex(
      prev => (prev - 1 + sampleProjects.length) % sampleProjects.length
    )
  }

  const goToProject = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextProject()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  const currentProject = sampleProjects[currentIndex]

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the products and platforms I&apos;ve built, from AI-powered
          analytics to global marketplaces. Each project demonstrates strategic
          thinking, technical execution, and measurable business impact.
        </p>
      </div>

      {/* Main Carousel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden cosmic-glow"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 z-10" />
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />

            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-20">
              <Badge
                variant={
                  currentProject.status === 'completed'
                    ? 'default'
                    : 'secondary'
                }
                className="bg-white/90 text-gray-900 backdrop-blur-sm"
              >
                {currentProject.status === 'completed'
                  ? '✅ Launched'
                  : currentProject.status === 'in-progress'
                    ? '🚧 In Progress'
                    : '💡 Concept'}
              </Badge>
            </div>

            {/* Featured Badge */}
            {currentProject.featured && (
              <div className="absolute top-6 right-6 z-20">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  ⭐ Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            {/* Category */}
            <Badge
              variant="outline"
              className="w-fit mb-4 text-purple-600 border-purple-200"
            >
              {currentProject.category}
            </Badge>

            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {currentProject.title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {currentProject.longDescription}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {currentProject.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className={`flex justify-center mb-2 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {currentProject.links.demo && (
                <Button className="cosmic-button text-white border-0">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Demo
                </Button>
              )}

              {currentProject.links.github && (
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </Button>
              )}

              {currentProject.links.case_study && (
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  📖 Case Study
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevProject}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all cosmic-float z-20"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextProject}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all cosmic-float z-20"
          aria-label="Next project"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center space-x-3 mt-8">
        {sampleProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToProject(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-purple-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {sampleProjects.length}
        </span>
      </div>
    </div>
  )
}
