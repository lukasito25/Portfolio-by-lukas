'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
import { dataService } from '@/lib/data-service'
import { trackProjectView } from '@/lib/analytics'

interface ProjectData {
  id: string
  title: string
  description: string
  excerpt: string | null
  thumbnail: string | null
  technologies: {
    id: string
    name: string
    color: string | null
  }[]
  demoUrl: string | null
  githubUrl: string | null
  category: string | null
  featured: boolean
  status: string
  views: number
  likes: number
}

export function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const fetchedProjects = await dataService.getFeaturedProjects()
        setProjects(fetchedProjects)
        setError(null)
      } catch (err) {
        setError('Failed to load projects')
        console.error('Error fetching projects:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const nextProject = () => {
    setCurrentIndex(prev => {
      const newIndex = (prev + 1) % projects.length
      if (projects[newIndex]) {
        trackProjectView(projects[newIndex].title)
      }
      return newIndex
    })
  }

  const prevProject = () => {
    setCurrentIndex(prev => {
      const newIndex = (prev - 1 + projects.length) % projects.length
      if (projects[newIndex]) {
        trackProjectView(projects[newIndex].title)
      }
      return newIndex
    })
  }

  const goToProject = (index: number) => {
    if (projects[index]) {
      trackProjectView(projects[index].title)
    }
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return

    const interval = setInterval(() => {
      nextProject()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex, projects.length])

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Loading projects...
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden cosmic-glow min-h-[600px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-red-600 max-w-3xl mx-auto">{error}</p>
        </div>
      </div>
    )
  }

  // No projects found
  if (projects.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No featured projects found.
          </p>
        </div>
      </div>
    )
  }

  const currentProject = projects[currentIndex]

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
            <Image
              src={
                currentProject.thumbnail ||
                'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop'
              }
              alt={currentProject.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={currentIndex === 0}
            />

            {/* Status Badge */}
            <div className="absolute top-6 left-6 z-20">
              <Badge
                variant={
                  currentProject.status === 'PUBLISHED'
                    ? 'default'
                    : 'secondary'
                }
                className="bg-white/90 text-gray-900 backdrop-blur-sm"
              >
                {currentProject.status === 'PUBLISHED'
                  ? '✅ Published'
                  : currentProject.status === 'DRAFT'
                    ? '🚧 Draft'
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
              {currentProject.category || 'Portfolio Project'}
            </Badge>

            {/* Title */}
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {currentProject.title}
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {currentProject.excerpt || currentProject.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-center mb-2 text-purple-600">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {currentProject.views.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-center mb-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {currentProject.likes}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-center mb-2 text-blue-600">
                  <Star className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {currentProject.technologies.length}
                </div>
                <div className="text-sm text-gray-600">Technologies</div>
              </div>
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
                    style={
                      tech.color
                        ? {
                            backgroundColor: `${tech.color}20`,
                            color: tech.color,
                            borderColor: `${tech.color}40`,
                          }
                        : {}
                    }
                  >
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {currentProject.demoUrl && (
                <Button
                  className="cosmic-button text-white border-0"
                  onClick={() => {
                    trackProjectView(currentProject.title)
                    window.open(
                      currentProject.demoUrl!,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Demo
                </Button>
              )}

              {currentProject.githubUrl && (
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => {
                    trackProjectView(currentProject.title)
                    window.open(
                      currentProject.githubUrl!,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </Button>
              )}

              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                asChild
              >
                <Link href={`/projects/${currentProject.id}`}>
                  📖 Read More
                </Link>
              </Button>
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
        {projects.map((_, index) => (
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
          {currentIndex + 1} of {projects.length}
        </span>
      </div>
    </div>
  )
}
