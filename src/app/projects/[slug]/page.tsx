import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { dataService } from '@/lib/data-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  Star,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

interface Technology {
  id: string
  name: string
  color: string | null
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Lukáš Hošala - Portfolio`,
    description: project.excerpt || project.description,
    openGraph: {
      title: project.title,
      description: project.excerpt || project.description,
      type: 'website',
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
    },
  }
}

async function getProject(slug: string) {
  try {
    return await dataService.getProject(slug)
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project || project.status !== 'PUBLISHED') {
    notFound()
  }

  const publishedDate = project.publishedAt
    ? new Date(project.publishedAt)
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Project Image */}
            <div className="relative">
              <div className="aspect-video relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                {project.thumbnail && (
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="flex flex-col justify-center">
              {/* Category & Status */}
              <div className="flex gap-2 mb-6">
                <Badge
                  variant="outline"
                  className="text-purple-600 border-purple-200"
                >
                  {project.category || 'Portfolio Project'}
                </Badge>
                <Badge
                  variant={project.featured ? 'default' : 'secondary'}
                  className={
                    project.featured
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                      : ''
                  }
                >
                  {project.featured ? '⭐ Featured' : 'Project'}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {project.excerpt || project.description}
              </p>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {publishedDate
                      ? publishedDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>{project.views} views</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.demoUrl && (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    asChild
                  >
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live Demo
                    </Link>
                  </Button>
                )}

                {project.githubUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    asChild
                  >
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Source
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          {project.technologies && project.technologies.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Technologies Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech: Technology) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      className="px-3 py-1 text-sm"
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
              </CardContent>
            </Card>
          )}

          {/* Project Content */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {project.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: project.content.replace(/\n/g, '<br />'),
                    }}
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {project.views.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Views
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {project.likes}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Likes
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {project.technologies?.length || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Technologies
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {project.featured ? '⭐' : '📋'}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {project.featured ? 'Featured' : 'Regular'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Portfolio */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
