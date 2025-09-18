'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  MessageSquare,
  Target,
} from 'lucide-react'

interface AnalyticsData {
  analytics: any[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    topPages: Array<{
      path: string
      _count: { id: number }
      _avg: { duration: number | null }
    }>
    topSources: Array<{
      source: string
      _count: { id: number }
    }>
    totalViews: number
    timeframe: string
  }
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

function MetricCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
}: MetricCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-green-600'
      : trend === 'down'
        ? 'text-red-600'
        : 'text-gray-600'

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${trendColor} flex items-center mt-1`}>
              {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
              {change}
            </p>
          )}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (selectedTimeframe: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/analytics?timeframe=${selectedTimeframe}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(timeframe)
  }, [timeframe])

  const formatDuration = (duration: number | null): string => {
    if (!duration) return '0s'
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics Error
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchAnalytics(timeframe)}>Try Again</Button>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">
            Analytics data will appear here once visitors start browsing your
            portfolio.
          </p>
        </Card>
      </div>
    )
  }

  const avgTimeOnSite =
    data.stats.topPages.reduce((acc, page) => {
      return acc + (page._avg.duration || 0)
    }, 0) / (data.stats.topPages.length || 1)

  const uniqueSources = data.stats.topSources.length
  const totalSessions = Math.floor(data.stats.totalViews * 0.7) // Estimate sessions as 70% of views

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {['1d', '7d', '30d', '90d'].map(period => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Page Views"
          value={formatNumber(data.stats.totalViews)}
          icon={<Eye className="h-8 w-8" />}
          trend="up"
        />
        <MetricCard
          title="Unique Visitors"
          value={formatNumber(totalSessions)}
          icon={<Users className="h-8 w-8" />}
          trend="up"
        />
        <MetricCard
          title="Avg. Time on Site"
          value={formatDuration(avgTimeOnSite)}
          icon={<Clock className="h-8 w-8" />}
          trend="neutral"
        />
        <MetricCard
          title="Traffic Sources"
          value={uniqueSources}
          icon={<Globe className="h-8 w-8" />}
          trend="neutral"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Top Pages
          </h3>
          <div className="space-y-4">
            {data.stats.topPages.slice(0, 5).map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {page.path === '/' ? 'Home' : page.path.replace('/', '')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Avg. time: {formatDuration(page._avg.duration)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {page._count.id}
                  </p>
                  <p className="text-sm text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {data.stats.topSources.slice(0, 5).map((source, index) => {
              const percentage = (
                (source._count.id / data.stats.totalViews) *
                100
              ).toFixed(1)
              return (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 capitalize">
                      {source.source || 'Direct'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-gray-900">
                      {source._count.id}
                    </p>
                    <p className="text-sm text-gray-500">{percentage}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {data.analytics.slice(0, 10).map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.path === '/'
                    ? 'Home Page'
                    : activity.title || activity.path}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.source && `from ${activity.source}`} •{' '}
                  {activity.userAgent?.includes('Mobile')
                    ? 'Mobile'
                    : 'Desktop'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
