'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
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
  Save,
  X,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  thumbnail: string
  category: string
  featured: boolean
  readTime: number
  views: number
  likes: number
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  publishedAt?: string
  tags?: Array<{ name: string }>
}

const emptyPost: Partial<BlogPost> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  category: '',
  featured: false,
  readTime: 5,
  status: 'DRAFT',
}

export default function BlogManagement() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load blog posts
  useEffect(() => {
    loadPosts()
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

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const postsData = await dataService.getBlogPosts()
      setPosts(postsData || [])
    } catch (error) {
      console.error('Failed to load blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = () => {
    setEditingPost(emptyPost)
    setIsDialogOpen(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setIsDialogOpen(true)
  }

  const handleSavePost = async () => {
    if (!editingPost || !editingPost.title) return

    setIsSaving(true)
    try {
      const postData = {
        ...editingPost,
        slug:
          editingPost.slug ||
          editingPost.title?.toLowerCase().replace(/\s+/g, '-'),
        authorId: session.user.id,
        publishedAt:
          editingPost.status === 'PUBLISHED'
            ? new Date().toISOString()
            : undefined,
      }

      if (editingPost.id) {
        // Update existing post
        // Note: This would need to be implemented in the data service
        console.log('Update post:', postData)
        alert(
          'Blog update functionality will be available once the backend API supports it.'
        )
      } else {
        // Create new post
        // Note: This would need to be implemented in the data service
        console.log('Create post:', postData)
        alert(
          'Blog creation functionality will be available once the backend API supports it.'
        )
      }

      setIsDialogOpen(false)
      setEditingPost(null)
      await loadPosts()
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      // Note: This would need to be implemented in the data service
      console.log('Delete post:', postId)
      alert(
        'Blog deletion functionality will be available once the backend API supports it.'
      )
      await loadPosts()
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete blog post. Please try again.')
    }
  }

  const updateEditingPost = (field: string, value: any) => {
    setEditingPost(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
                  Blog Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your blog articles and content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadPosts} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreatePost}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts ({posts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading blog posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No blog posts found</p>
                <Button onClick={handleCreatePost}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first article
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
                    <TableHead>Read Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-500">
                            {post.slug}
                          </div>
                          {post.featured && (
                            <Badge variant="default" className="mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post.status === 'PUBLISHED'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          👁️ {post.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          📅 {formatDate(post.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePost(post.id)}
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost?.id ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={editingPost?.title || ''}
                    onChange={e => updateEditingPost('title', e.target.value)}
                    placeholder="Blog post title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editingPost?.slug || ''}
                    onChange={e => updateEditingPost('slug', e.target.value)}
                    placeholder="blog-post-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={editingPost?.excerpt || ''}
                  onChange={e => updateEditingPost('excerpt', e.target.value)}
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editingPost?.content || ''}
                  onChange={e => updateEditingPost('content', e.target.value)}
                  placeholder="Blog post content (supports Markdown)"
                  rows={10}
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={editingPost?.category || ''}
                    onChange={e =>
                      updateEditingPost('category', e.target.value)
                    }
                    placeholder="e.g., Tutorial, Tech"
                  />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    value={editingPost?.readTime || 5}
                    onChange={e =>
                      updateEditingPost(
                        'readTime',
                        parseInt(e.target.value) || 5
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPost?.featured || false}
                      onChange={e =>
                        updateEditingPost('featured', e.target.checked)
                      }
                    />
                    <span>Featured Post</span>
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={editingPost?.thumbnail || ''}
                  onChange={e => updateEditingPost('thumbnail', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label>Status:</Label>
                  <select
                    value={editingPost?.status || 'DRAFT'}
                    onChange={e => updateEditingPost('status', e.target.value)}
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
                  onClick={handleSavePost}
                  disabled={!editingPost?.title || isSaving}
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingPost?.id ? 'Update' : 'Create'} Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
