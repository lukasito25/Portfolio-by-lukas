'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import { dataService } from '@/lib/data-service'
import { RefreshCw } from 'lucide-react'

interface DashboardCounts {
  projects: number
  blogPosts: number
  totalViews: number
  contactSubmissions: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [counts, setCounts] = useState<DashboardCounts | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load dashboard counts
  useEffect(() => {
    loadDashboardData()
  }, [])

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

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      const [projects, blogPosts] = await Promise.all([
        dataService.getAdminProjects(),
        dataService.getBlogPosts(),
      ])

      const totalViews =
        (projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0) +
        (blogPosts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0)

      setCounts({
        projects: projects?.length || 0,
        blogPosts: blogPosts?.length || 0,
        totalViews,
        contactSubmissions: 0, // Would be loaded from contact API when available
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
          <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                      Admin Dashboard
                    </h1>
                  </div>
                  <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                    <dt className="sr-only">Account status</dt>
                    <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                      Welcome, {session.user.email}
                    </dd>
                    {counts && (
                      <dd className="flex items-center text-sm text-gray-500 font-medium sm:mr-6">
                        {counts.projects} Projects • {counts.blogPosts} Articles
                        • {counts.totalViews} Total Views
                      </dd>
                    )}
                  </dl>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Content Editor Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Content Editor
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Edit Site Content
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/editor"
                    className="font-medium text-purple-700 hover:text-purple-900"
                  >
                    Open Editor →
                  </Link>
                </div>
              </div>
            </div>
            {/* Projects Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Projects
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin inline" />
                        ) : (
                          `${counts?.projects || 0} Projects`
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/projects"
                    className="font-medium text-indigo-700 hover:text-indigo-900"
                  >
                    Manage Projects →
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Blog
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin inline" />
                        ) : (
                          `${counts?.blogPosts || 0} Articles`
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/blog"
                    className="font-medium text-green-700 hover:text-green-900"
                  >
                    Manage Blog →
                  </Link>
                </div>
              </div>
            </div>

            {/* Technologies Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Technologies
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage Skills
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a
                    href="/api/technologies"
                    className="font-medium text-yellow-700 hover:text-yellow-900"
                  >
                    View API →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Contact
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Form Submissions
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-purple-700">API Ready</span>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Analytics
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin inline" />
                        ) : (
                          `${counts?.totalViews || 0} Total Views`
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/analytics"
                    className="font-medium text-red-700 hover:text-red-900"
                  >
                    View Dashboard →
                  </Link>
                </div>
              </div>
            </div>

            {/* Database Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Database
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Prisma Studio
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-blue-700">
                    Run: npm run db:studio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quick Start Guide
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Your backend infrastructure is ready! Here&apos;s what you can
                  do next:
                </p>
              </div>
              <div className="mt-5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>
                    <strong>Explore the API:</strong> Visit the API endpoints
                    above to see your data
                  </li>
                  <li>
                    <strong>Manage Database:</strong> Run{' '}
                    <code className="bg-gray-100 px-1 rounded">
                      npm run db:studio
                    </code>{' '}
                    to open Prisma Studio
                  </li>
                  <li>
                    <strong>Test Contact Form:</strong> Try the{' '}
                    <code className="bg-gray-100 px-1 rounded">
                      POST /api/contact
                    </code>{' '}
                    endpoint
                  </li>
                  <li>
                    <strong>Check Analytics:</strong> Page views are
                    automatically tracked when enabled
                  </li>
                  <li>
                    <strong>Customize Content:</strong> Edit seed data in{' '}
                    <code className="bg-gray-100 px-1 rounded">
                      prisma/seed.ts
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
