'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  BarChart3,
  Users,
  Clock,
  Building,
  Target,
  Copy,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

interface RecruiterPage {
  id: string
  title: string
  slug: string
  companyName: string
  companySlug: string
  isActive: boolean
  roleName?: string
  roleLevel?: string
  companySize?: string
  industry?: string
  templateType: string
  views: number
  uniqueViews: number
  timeOnPage?: number
  responses: number
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  _count?: {
    analytics: number
    interactions: number
  }
}

export default function RecruiterPageManagement() {
  const { data: session, status } = useSession()
  const [pages, setPages] = useState<RecruiterPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<RecruiterPage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'view' | 'create' | 'edit'>(
    'view'
  )

  // Load recruiter pages
  useEffect(() => {
    loadPages()
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

  const loadPages = async () => {
    try {
      setIsLoading(true)
      const pagesData = await dataService.getAdminRecruiterPages()
      setPages(pagesData || [])
    } catch (error) {
      console.error('Failed to load recruiter pages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePage = () => {
    setSelectedPage(null)
    setDialogType('create')
    setIsDialogOpen(true)
  }

  const handleViewPage = (page: RecruiterPage) => {
    setSelectedPage(page)
    setDialogType('view')
    setIsDialogOpen(true)
  }

  const handleEditPage = (page: RecruiterPage) => {
    setSelectedPage(page)
    setDialogType('edit')
    setIsDialogOpen(true)
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this recruiter page?')) {
      return
    }

    try {
      await dataService.deleteRecruiterPage(pageId)
      await loadPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const copyPageUrl = (slug: string) => {
    const url = `${window.location.origin}/r/${slug}`
    navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  const getTemplateColor = (templateType: string) => {
    switch (templateType) {
      case 'company-mirror':
        return 'bg-blue-100 text-blue-800'
      case 'day-one-impact':
        return 'bg-green-100 text-green-800'
      case 'executive-briefing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                  Recruiter Pages
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage personalized landing pages for recruiters and companies
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadPages} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreatePage}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Page
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Building className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages.length}</div>
              <p className="text-xs text-muted-foreground">
                {pages.filter(p => p.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.reduce((sum, p) => sum + p.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                All-time page views
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Responses</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.reduce((sum, p) => sum + p.responses, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Contact responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pages.length > 0
                  ? Math.round(
                      pages.reduce((sum, p) => sum + (p.timeOnPage || 0), 0) /
                        pages.length
                    )
                  : 0}
                s
              </div>
              <p className="text-xs text-muted-foreground">Time on page</p>
            </CardContent>
          </Card>
        </div>

        {/* Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Pages ({pages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading recruiter pages...
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No recruiter pages found</p>
                <Button onClick={handleCreatePage}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Page
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Analytics</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map(page => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {page.companyName}
                            {page.roleName && ` • ${page.roleName}`}
                          </div>
                          <div className="text-xs text-blue-600 font-mono">
                            /r/{page.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTemplateColor(page.templateType)}>
                          {page.templateType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(page.isActive)}>
                          {page.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{page.views} views</div>
                          <div className="text-gray-500">
                            {page.responses} responses
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(page.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyPageUrl(page.slug)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/r/${page.slug}`} target="_blank">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPage(page)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPage(page)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePage(page.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'create' && 'Create New Recruiter Page'}
                {dialogType === 'edit' && 'Edit Recruiter Page'}
                {dialogType === 'view' && 'Recruiter Page Details'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Dialog content will be implemented in a separate component */}
              <div className="p-6 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  {dialogType === 'create' &&
                    'Create page form will be implemented next'}
                  {dialogType === 'edit' &&
                    'Edit page form will be implemented next'}
                  {dialogType === 'view' && selectedPage && (
                    <>
                      <strong>{selectedPage.title}</strong>
                      <br />
                      Company: {selectedPage.companyName}
                      <br />
                      Template: {selectedPage.templateType}
                      <br />
                      Views: {selectedPage.views}
                      <br />
                      Status: {selectedPage.isActive ? 'Active' : 'Inactive'}
                    </>
                  )}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
