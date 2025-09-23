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
  Eye,
  CheckCircle,
  Clock,
  Archive,
  RefreshCw,
  Mail,
  Phone,
  Building,
  DollarSign,
  Calendar,
  MapPin,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
  company?: string
  projectType?: string
  budgetRange?: string
  source?: string
  status: 'NEW' | 'READ' | 'RESPONDED' | 'ARCHIVED'
  responded: boolean
  respondedAt?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-800', icon: Clock },
  READ: { label: 'Read', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
  RESPONDED: {
    label: 'Responded',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  ARCHIVED: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-800',
    icon: Archive,
  },
}

export default function ContactSubmissionsManagement() {
  const { data: session, status } = useSession()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load contact submissions
  useEffect(() => {
    loadSubmissions()
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

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const submissionsData = await dataService.getContactSubmissions()
      setSubmissions(submissionsData || [])
    } catch (error) {
      console.error('Failed to load contact submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission)
    setIsDialogOpen(true)

    // Mark as read if it's new
    if (submission.status === 'NEW') {
      try {
        await dataService.updateContactSubmission(submission.id, {
          status: 'READ',
        })
        await loadSubmissions() // Refresh the list
      } catch (error) {
        console.error('Failed to mark submission as read:', error)
      }
    }
  }

  const handleUpdateStatus = async (
    submissionId: string,
    newStatus: string
  ) => {
    try {
      await dataService.updateContactSubmission(submissionId, {
        status: newStatus,
        respondedAt:
          newStatus === 'RESPONDED' ? new Date().toISOString() : undefined,
      })
      await loadSubmissions()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to update submission status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredSubmissions =
    statusFilter === 'all'
      ? submissions
      : submissions.filter(sub => sub.status === statusFilter)

  const statusCounts = submissions.reduce(
    (acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

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
                  Contact Submissions
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and respond to contact form submissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadSubmissions} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Submission Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All Submissions ({submissions.length})
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {config.label} ({statusCounts[status] || 0})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Contact Submissions ({filteredSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading contact submissions...
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {statusFilter === 'all'
                    ? 'No contact submissions found'
                    : `No ${statusConfig[statusFilter as keyof typeof statusConfig]?.label.toLowerCase()} submissions`}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map(submission => {
                    const config = statusConfig[submission.status]
                    const StatusIcon = config.icon
                    return (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{submission.name}</div>
                            <div className="text-sm text-gray-500">
                              {submission.email}
                            </div>
                            {submission.company && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {submission.company}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">
                              {submission.subject || 'No subject'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {submission.message.substring(0, 50)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.projectType ? (
                            <Badge variant="secondary" className="text-xs">
                              {submission.projectType}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={config.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(submission.createdAt)}</div>
                            {submission.source && (
                              <div className="text-gray-500">
                                via {submission.source}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSubmission(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Submission Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Submission Details</DialogTitle>
            </DialogHeader>

            {selectedSubmission && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">
                          {selectedSubmission.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>
                      {selectedSubmission.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <a
                            href={`tel:${selectedSubmission.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-purple-600" />
                          <span>{selectedSubmission.company}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedSubmission.projectType && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {selectedSubmission.projectType}
                          </Badge>
                        </div>
                      )}
                      {selectedSubmission.budgetRange && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{selectedSubmission.budgetRange}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          Submitted {formatDate(selectedSubmission.createdAt)}
                        </span>
                      </div>
                      {selectedSubmission.ipAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {selectedSubmission.ipAddress}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Subject and Message */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedSubmission.subject || 'Message'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedSubmission.message}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Update Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(statusConfig).map(([status, config]) => {
                        const StatusIcon = config.icon
                        return (
                          <Button
                            key={status}
                            variant={
                              selectedSubmission.status === status
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(selectedSubmission.id, status)
                            }
                            disabled={selectedSubmission.status === status}
                          >
                            <StatusIcon className="w-4 h-4 mr-2" />
                            Mark as {config.label}
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
