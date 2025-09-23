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
  Save,
  X,
  RefreshCw,
  Award,
  TrendingUp,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Technology {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  category?: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  createdAt: string
  updatedAt: string
}

const emptyTechnology: Partial<Technology> = {
  name: '',
  slug: '',
  description: '',
  category: '',
  level: 'INTERMEDIATE',
  color: '#3B82F6',
  icon: '',
}

const skillLevels = [
  {
    value: 'BEGINNER',
    label: 'Beginner',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermediate',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'ADVANCED',
    label: 'Advanced',
    color: 'bg-purple-100 text-purple-800',
  },
  { value: 'EXPERT', label: 'Expert', color: 'bg-green-100 text-green-800' },
]

const skillCategories = [
  'Product Management',
  'Leadership',
  'Technical',
  'Analytics',
  'Strategy',
  'Research',
  'Growth',
  'Communication',
  'Methodologies',
  'Business',
]

export default function SkillsManagement() {
  const { data: session, status } = useSession()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTechnology, setEditingTechnology] =
    useState<Partial<Technology> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Load technologies
  useEffect(() => {
    loadTechnologies()
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

  const loadTechnologies = async () => {
    try {
      setIsLoading(true)
      const technologiesData = await dataService.getTechnologies()
      setTechnologies(technologiesData || [])
    } catch (error) {
      console.error('Failed to load technologies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTechnology = () => {
    setEditingTechnology(emptyTechnology)
    setIsDialogOpen(true)
  }

  const handleEditTechnology = (technology: Technology) => {
    setEditingTechnology(technology)
    setIsDialogOpen(true)
  }

  const handleSaveTechnology = async () => {
    if (!editingTechnology || !editingTechnology.name) return

    setIsSaving(true)
    try {
      const techData = {
        ...editingTechnology,
        slug:
          editingTechnology.slug ||
          editingTechnology.name
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
      }

      if (editingTechnology.id) {
        // Update existing technology
        await dataService.updateTechnology(editingTechnology.id, techData)
      } else {
        // Create new technology
        await dataService.createTechnology(techData)
      }

      setIsDialogOpen(false)
      setEditingTechnology(null)
      await loadTechnologies()
    } catch (error) {
      console.error('Failed to save technology:', error)
      alert('Failed to save skill. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTechnology = async (technologyId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      await dataService.deleteTechnology(technologyId)
      await loadTechnologies()
    } catch (error) {
      console.error('Failed to delete technology:', error)
      alert('Failed to delete skill. Please try again.')
    }
  }

  const updateEditingTechnology = (field: string, value: any) => {
    setEditingTechnology(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const getSkillLevelInfo = (level: string) => {
    return skillLevels.find(l => l.value === level) || skillLevels[1]
  }

  const filteredTechnologies =
    selectedCategory === 'all'
      ? technologies
      : technologies.filter(tech => tech.category === selectedCategory)

  const categoryCounts = skillCategories.reduce(
    (acc, category) => {
      acc[category] = technologies.filter(
        tech => tech.category === category
      ).length
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
                  Skills Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your skills and expertise areas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadTechnologies} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleCreateTechnology}>
                <Plus className="w-4 h-4 mr-2" />
                New Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Skill Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Skills ({technologies.length})
              </Button>
              {skillCategories.map(category => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({categoryCounts[category] || 0})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Skills ({filteredTechnologies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Loading skills...
              </div>
            ) : filteredTechnologies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {selectedCategory === 'all'
                    ? 'No skills found'
                    : `No skills found in ${selectedCategory}`}
                </p>
                <Button onClick={handleCreateTechnology}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first skill
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnologies.map(technology => {
                    const levelInfo = getSkillLevelInfo(technology.level)
                    return (
                      <TableRow key={technology.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {technology.color && (
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: technology.color }}
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {technology.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {technology.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {technology.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={levelInfo.color}>
                            {levelInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-gray-600">
                            {technology.description || 'No description'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTechnology(technology)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDeleteTechnology(technology.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
                {editingTechnology?.id ? 'Edit Skill' : 'Create New Skill'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={editingTechnology?.name || ''}
                    onChange={e =>
                      updateEditingTechnology('name', e.target.value)
                    }
                    placeholder="Skill name"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editingTechnology?.slug || ''}
                    onChange={e =>
                      updateEditingTechnology('slug', e.target.value)
                    }
                    placeholder="skill-slug"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingTechnology?.description || ''}
                  onChange={e =>
                    updateEditingTechnology('description', e.target.value)
                  }
                  placeholder="Brief description of the skill"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={editingTechnology?.category || ''}
                    onChange={e =>
                      updateEditingTechnology('category', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {skillCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <select
                    id="level"
                    value={editingTechnology?.level || 'INTERMEDIATE'}
                    onChange={e =>
                      updateEditingTechnology('level', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {skillLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={editingTechnology?.color || '#3B82F6'}
                      onChange={e =>
                        updateEditingTechnology('color', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={editingTechnology?.color || '#3B82F6'}
                      onChange={e =>
                        updateEditingTechnology('color', e.target.value)
                      }
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={editingTechnology?.icon || ''}
                    onChange={e =>
                      updateEditingTechnology('icon', e.target.value)
                    }
                    placeholder="icon-name"
                  />
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
                  onClick={handleSaveTechnology}
                  disabled={!editingTechnology?.name || isSaving}
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingTechnology?.id ? 'Update' : 'Create'} Skill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
