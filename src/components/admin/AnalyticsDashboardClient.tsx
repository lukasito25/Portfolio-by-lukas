'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Eye,
  Users,
  FileText,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  BarChart,
  PieChart,
  Activity,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

interface AnalyticsData {
  totalViews: number
  totalProjects: number
  totalBlogPosts: number
  totalVisitors: number
  recentViews: Array<{
    id: string
    path: string
    views: number
    timestamp: string
  }>
  popularProjects: Array<{
    id: string
    title: string
    views: number
    likes: number
  }>
  popularBlogPosts: Array<{
    id: string
    title: string
    views: number
    likes: number
  }>
  viewsOverTime: Array<{
    date: string
    views: number
  }>
}

export default function AnalyticsDashboardClient() {
  const { data: session, status } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load analytics data
  useEffect(() => {
    if (session && session.user.role === 'ADMIN') {
      loadAnalytics()
    }
  }, [session])

  // Handle authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
    return null
  }

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)

      // Load data from multiple sources
      const [projects, blogPosts] = await Promise.all([
        dataService.getAdminProjects(),
        dataService.getBlogPosts(),
      ])

      // Calculate analytics (mock data for now, would be replaced with real analytics)
      const totalProjects = projects?.length || 0
      const totalBlogPosts = blogPosts?.length || 0
      const totalViews =
        (projects?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) ||
          0) +
        (blogPosts?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) ||
          0)

      const mockAnalytics: AnalyticsData = {
        totalViews,
        totalProjects,
        totalBlogPosts,
        totalVisitors: Math.floor(totalViews * 0.7), // Mock visitor calculation
        recentViews: [
          {
            id: '1',
            path: '/',
            views: 156,
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            path: '/projects',
            views: 89,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            path: '/blog',
            views: 67,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: '4',
            path: '/contact',
            views: 34,
            timestamp: new Date(Date.now() - 10800000).toISOString(),
          },
        ],
        popularProjects:
          projects?.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title,
            views: p.views || 0,
            likes: p.likes || 0,
          })) || [],
        popularBlogPosts:
          blogPosts?.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title,
            views: p.views || 0,
            likes: p.likes || 0,
          })) || [],
        viewsOverTime: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(),
          views: Math.floor(Math.random() * 100) + 50,
        })),
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor your portfolio performance and visitor engagement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadAnalytics} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mr-3" />
            Loading analytics data...
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Views
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {analytics.totalViews.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Unique Visitors
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {analytics.totalVisitors.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <BarChart className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Projects
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {analytics.totalProjects}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Blog Posts
                        </dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {analytics.totalBlogPosts}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Views Over Time (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.viewsOverTime.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600">
                          {item.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(item.views / 150) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">
                            {item.views}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Page Views */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Page Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.recentViews.map(view => (
                      <div
                        key={view.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-sm">{view.path}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(view.timestamp)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4" />
                          {view.views}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Popular Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.popularProjects.length > 0 ? (
                      analytics.popularProjects.map(project => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-medium text-sm truncate flex-1">
                            {project.title}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {project.views}
                            </span>
                            <span className="flex items-center gap-1">
                              ❤️ {project.likes}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No projects found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Blog Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Popular Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.popularBlogPosts.length > 0 ? (
                      analytics.popularBlogPosts.map(post => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="font-medium text-sm truncate flex-1">
                            {post.title}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              ❤️ {post.likes}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No blog posts found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Note */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Analytics Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    About This Dashboard
                  </h4>
                  <p className="text-blue-800 text-sm">
                    This analytics dashboard displays basic metrics derived from
                    your portfolio data. For comprehensive analytics including
                    real-time visitor tracking, conversion rates, and detailed
                    user behavior, consider integrating with services like
                    Google Analytics, Plausible, or Vercel Analytics.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href="https://analytics.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Google Analytics
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href="https://vercel.com/analytics"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Vercel Analytics
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load analytics data</p>
            <Button onClick={loadAnalytics} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
