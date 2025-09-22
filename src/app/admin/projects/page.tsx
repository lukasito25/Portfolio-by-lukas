'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
  RefreshCw,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  excerpt: string
  thumbnail: string
  demoUrl?: string
  githubUrl?: string
  category: string
  featured: boolean
  sortOrder: number
  views: number
  likes: number
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  publishedAt?: string
  technologies?: Array<{ name: string }>
}

const emptyProject: Partial<Project> = {
  title: '',
  slug: '',
  description: '',
  excerpt: '',
  thumbnail: '',
  demoUrl: '',
  githubUrl: '',
  category: '',
  featured: false,
  sortOrder: 0,
  status: 'DRAFT',
}

export default function ProjectsManagement() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    null
  )
  const [isSaving, setIsSaving] = useState(false)

  // Load projects
  useEffect(() => {
    loadProjects()
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

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const projectsData = await dataService.getAdminProjects()
      setProjects(projectsData || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = () => {
    setEditingProject(emptyProject)
    setIsDialogOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsDialogOpen(true)
  }

  const handleSaveProject = async () => {
    if (!editingProject || !editingProject.title) return

    setIsSaving(true)
    try {
      if (editingProject.id) {
        // Update existing project
        await dataService.updateProject(editingProject.id, editingProject)
      } else {
        // Create new project
        await dataService.createProject({
          ...editingProject,
          slug:
            editingProject.slug ||
            editingProject.title?.toLowerCase().replace(/\s+/g, '-'),
          authorId: session.user.id,
        })
      }

      setIsDialogOpen(false)
      setEditingProject(null)
      await loadProjects()
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await dataService.deleteProject(projectId)
      await loadProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  const updateEditingProject = (field: string, value: any) => {
    setEditingProject(prev => ({
      ...prev,
      [field]: value,
    }))
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
                  Projects Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your portfolio projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadProjects} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Projects ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects found</p>
                <Button onClick={handleCreateProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first project
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-gray-500">
                            {project.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === 'PUBLISHED'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.views}</TableCell>
                      <TableCell>
                        {project.featured && <Badge>Featured</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {project.demoUrl && (
                            <Button asChild size="sm" variant="outline">
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProject(project.id)}
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

        {/* Edit/Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject?.id ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={editingProject?.title || ''}
                    onChange={e =>
                      updateEditingProject('title', e.target.value)
                    }
                    placeholder="Project title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editingProject?.slug || ''}
                    onChange={e => updateEditingProject('slug', e.target.value)}
                    placeholder="project-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editingProject?.excerpt || ''}
                  onChange={e =>
                    updateEditingProject('excerpt', e.target.value)
                  }
                  placeholder="Brief project description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject?.description || ''}
                  onChange={e =>
                    updateEditingProject('description', e.target.value)
                  }
                  placeholder="Detailed project description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editingProject?.category || ''}
                    onChange={e =>
                      updateEditingProject('category', e.target.value)
                    }
                    placeholder="e.g., Full Stack, Frontend"
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={editingProject?.sortOrder || 0}
                    onChange={e =>
                      updateEditingProject(
                        'sortOrder',
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={editingProject?.thumbnail || ''}
                  onChange={e =>
                    updateEditingProject('thumbnail', e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    value={editingProject?.demoUrl || ''}
                    onChange={e =>
                      updateEditingProject('demoUrl', e.target.value)
                    }
                    placeholder="https://demo.example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={editingProject?.githubUrl || ''}
                    onChange={e =>
                      updateEditingProject('githubUrl', e.target.value)
                    }
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingProject?.featured || false}
                    onChange={e =>
                      updateEditingProject('featured', e.target.checked)
                    }
                  />
                  <span>Featured Project</span>
                </label>

                <div className="flex items-center space-x-2">
                  <Label>Status:</Label>
                  <select
                    value={editingProject?.status || 'DRAFT'}
                    onChange={e =>
                      updateEditingProject('status', e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProject}
                  disabled={!editingProject?.title || isSaving}
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingProject?.id ? 'Update' : 'Create'} Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
