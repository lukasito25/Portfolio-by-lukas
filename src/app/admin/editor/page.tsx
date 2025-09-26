'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  Edit3,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Database,
  CheckCircle,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { SiteContent, defaultContent } from '@/lib/content-config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function ContentEditor() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('homepage')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load content from database on mount
  useEffect(() => {
    loadContentFromDatabase()
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

  const loadContentFromDatabase = async () => {
    try {
      setIsLoadingContent(true)
      setError(null)
      const allContent = await dataService.getAllContent()

      if (allContent && Object.keys(allContent).length > 0) {
        setContent(allContent as SiteContent)
      } else {
        // If no content in database, use default content
        setContent(defaultContent)
      }
    } catch (error) {
      console.error('Failed to load content from database:', error)
      setError('Failed to load content from database. Using default content.')
      setContent(defaultContent)
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Save content to database
  const saveContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Save each section separately
      const sections = ['homepage', 'about', 'blog', 'work'] as const
      let totalUpdated = 0

      for (const section of sections) {
        if (content[section]) {
          const result = await dataService.updateContentSection(
            section,
            content[section]
          )
          if (result.success && result.itemsUpdated) {
            totalUpdated += result.itemsUpdated
          }
        }
      }

      setHasChanges(false)
      setLastSaved(new Date())

      // Show success message
      const message = `Successfully updated ${totalUpdated} content items!`
      console.log(message)

      // Optional: Show a toast notification here
      alert(message)
    } catch (error) {
      console.error('Failed to save content:', error)
      setError('Failed to save content to database')
      alert('Failed to save content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Export content as JSON (from database, not local state)
  const exportContent = async () => {
    try {
      const freshContent = await dataService.getAllContent()
      const dataStr = JSON.stringify(freshContent, null, 2)
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

      const exportFileDefaultName = `site-content-${new Date().toISOString().split('T')[0]}.json`
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error('Failed to export content:', error)
      alert('Failed to export content')
    }
  }

  // Import content from JSON file
  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const importedContent = JSON.parse(e.target?.result as string)
          setContent(importedContent)
          setHasChanges(true)
          alert(
            'Content imported successfully! Remember to save to apply changes.'
          )
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  // Reset to default content
  const resetContent = () => {
    if (
      confirm(
        'Are you sure you want to reset all content to defaults? This cannot be undone.'
      )
    ) {
      setContent(defaultContent)
      setHasChanges(true)
    }
  }

  // Reload from database
  const reloadFromDatabase = () => {
    if (hasChanges) {
      const confirmed = confirm(
        'You have unsaved changes. Are you sure you want to reload from database? Your changes will be lost.'
      )
      if (!confirmed) return
    }
    loadContentFromDatabase()
    setHasChanges(false)
  }

  // Update content helper
  const updateContent = (path: string[], value: any) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      let current = newContent
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newContent
    })
    setHasChanges(true)
  }

  // Add array item helper
  const addArrayItem = (path: string[], template: any) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      let current = newContent
      for (const key of path) {
        current = current[key]
      }
      current.push(template)
      return newContent
    })
    setHasChanges(true)
  }

  // Remove array item helper
  const removeArrayItem = (path: string[], index: number) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev))
      let current = newContent
      for (const key of path) {
        current = current[key]
      }
      current.splice(index, 1)
      return newContent
    })
    setHasChanges(true)
  }

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading content from database...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Database Content Editor
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Edit your portfolio content with live database updates
                  {lastSaved && (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Database Error
                </Badge>
              )}
              {hasChanges && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={saveContent}
                disabled={isLoading || !hasChanges}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save to Database
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={reloadFromDatabase} variant="outline" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Reload from Database
            </Button>
            <Button onClick={exportContent} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import JSON
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importContent}
                className="hidden"
              />
            </label>
            <Button onClick={resetContent} variant="destructive" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Preview Site
              </a>
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Content Editor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
          </TabsList>

          {/* Homepage Tab */}
          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Hero Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-badge">Hero Badge</Label>
                  <Input
                    id="hero-badge"
                    value={content.homepage.hero.badge}
                    onChange={e =>
                      updateContent(
                        ['homepage', 'hero', 'badge'],
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <Label>Headlines</Label>
                  {content.homepage.hero.headline.map((line, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={line}
                        onChange={e => {
                          const newHeadlines = [
                            ...content.homepage.hero.headline,
                          ]
                          newHeadlines[index] = e.target.value
                          updateContent(
                            ['homepage', 'hero', 'headline'],
                            newHeadlines
                          )
                        }}
                        placeholder={`Headline ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHeadlines =
                            content.homepage.hero.headline.filter(
                              (_, i) => i !== index
                            )
                          updateContent(
                            ['homepage', 'hero', 'headline'],
                            newHeadlines
                          )
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const newHeadlines = [
                        ...content.homepage.hero.headline,
                        'New Line',
                      ]
                      updateContent(
                        ['homepage', 'hero', 'headline'],
                        newHeadlines
                      )
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line
                  </Button>
                </div>

                <div>
                  <Label htmlFor="hero-subheadline">Subheadline</Label>
                  <Textarea
                    id="hero-subheadline"
                    value={content.homepage.hero.subheadline}
                    onChange={e =>
                      updateContent(
                        ['homepage', 'hero', 'subheadline'],
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Metrics</Label>
                  {content.homepage.hero.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={metric.value}
                        onChange={e => {
                          const newMetrics = [...content.homepage.hero.metrics]
                          newMetrics[index].value = e.target.value
                          updateContent(
                            ['homepage', 'hero', 'metrics'],
                            newMetrics
                          )
                        }}
                        placeholder="Value"
                        className="w-24"
                      />
                      <Input
                        value={metric.label}
                        onChange={e => {
                          const newMetrics = [...content.homepage.hero.metrics]
                          newMetrics[index].label = e.target.value
                          updateContent(
                            ['homepage', 'hero', 'metrics'],
                            newMetrics
                          )
                        }}
                        placeholder="Label"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem(
                            ['homepage', 'hero', 'metrics'],
                            index
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      addArrayItem(['homepage', 'hero', 'metrics'], {
                        value: '0',
                        label: 'New Metric',
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Metric
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Core Competencies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.homepage.competencies.map((competency, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={competency.title}
                        onChange={e => {
                          const newCompetencies = [
                            ...content.homepage.competencies,
                          ]
                          newCompetencies[index].title = e.target.value
                          updateContent(
                            ['homepage', 'competencies'],
                            newCompetencies
                          )
                        }}
                        placeholder="Title"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem(['homepage', 'competencies'], index)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={competency.description}
                      onChange={e => {
                        const newCompetencies = [
                          ...content.homepage.competencies,
                        ]
                        newCompetencies[index].description = e.target.value
                        updateContent(
                          ['homepage', 'competencies'],
                          newCompetencies
                        )
                      }}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    addArrayItem(['homepage', 'competencies'], {
                      title: 'New Competency',
                      description: 'Description',
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Competency
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call to Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cta-title">Title</Label>
                  <Input
                    id="cta-title"
                    value={content.homepage.cta.title}
                    onChange={e =>
                      updateContent(
                        ['homepage', 'cta', 'title'],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cta-description">Description</Label>
                  <Textarea
                    id="cta-description"
                    value={content.homepage.cta.description}
                    onChange={e =>
                      updateContent(
                        ['homepage', 'cta', 'description'],
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title">Title</Label>
                  <Input
                    id="about-title"
                    value={content.about.hero.title}
                    onChange={e =>
                      updateContent(['about', 'hero', 'title'], e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="about-description">Description</Label>
                  <Textarea
                    id="about-description"
                    value={content.about.hero.description}
                    onChange={e =>
                      updateContent(
                        ['about', 'hero', 'description'],
                        e.target.value
                      )
                    }
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Quick Stats</Label>
                  {content.about.hero.quickStats.map((stat, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={stat.label}
                        onChange={e => {
                          const newStats = [...content.about.hero.quickStats]
                          newStats[index].label = e.target.value
                          updateContent(
                            ['about', 'hero', 'quickStats'],
                            newStats
                          )
                        }}
                        placeholder="Label"
                      />
                      <Input
                        value={stat.value}
                        onChange={e => {
                          const newStats = [...content.about.hero.quickStats]
                          newStats[index].value = e.target.value
                          updateContent(
                            ['about', 'hero', 'quickStats'],
                            newStats
                          )
                        }}
                        placeholder="Value"
                        className="w-24"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem(
                            ['about', 'hero', 'quickStats'],
                            index
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      addArrayItem(['about', 'hero', 'quickStats'], {
                        label: 'New Stat',
                        value: '0',
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leadership Philosophy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="philosophy-title">Title</Label>
                  <Input
                    id="philosophy-title"
                    value={content.about.philosophy.title}
                    onChange={e =>
                      updateContent(
                        ['about', 'philosophy', 'title'],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="philosophy-description">Description</Label>
                  <Textarea
                    id="philosophy-description"
                    value={content.about.philosophy.description}
                    onChange={e =>
                      updateContent(
                        ['about', 'philosophy', 'description'],
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Philosophy Cards</Label>
                  {content.about.philosophy.cards.map((card, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={card.title}
                          onChange={e => {
                            const newCards = [...content.about.philosophy.cards]
                            newCards[index].title = e.target.value
                            updateContent(
                              ['about', 'philosophy', 'cards'],
                              newCards
                            )
                          }}
                          placeholder="Card Title"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeArrayItem(
                              ['about', 'philosophy', 'cards'],
                              index
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={card.description}
                        onChange={e => {
                          const newCards = [...content.about.philosophy.cards]
                          newCards[index].description = e.target.value
                          updateContent(
                            ['about', 'philosophy', 'cards'],
                            newCards
                          )
                        }}
                        placeholder="Description"
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      addArrayItem(['about', 'philosophy', 'cards'], {
                        title: 'New Philosophy',
                        description: 'Description',
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Philosophy Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    value={content.blog.hero.title}
                    onChange={e =>
                      updateContent(['blog', 'hero', 'title'], e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="blog-description">Description</Label>
                  <Textarea
                    id="blog-description"
                    value={content.blog.hero.description}
                    onChange={e =>
                      updateContent(
                        ['blog', 'hero', 'description'],
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featured-title">Title</Label>
                  <Input
                    id="featured-title"
                    value={content.blog.featured.title}
                    onChange={e =>
                      updateContent(
                        ['blog', 'featured', 'title'],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="featured-description">Description</Label>
                  <Textarea
                    id="featured-description"
                    value={content.blog.featured.description}
                    onChange={e =>
                      updateContent(
                        ['blog', 'featured', 'description'],
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Key Insights</Label>
                  {content.blog.featured.keyInsights.map((insight, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={insight}
                        onChange={e => {
                          const newInsights = [
                            ...content.blog.featured.keyInsights,
                          ]
                          newInsights[index] = e.target.value
                          updateContent(
                            ['blog', 'featured', 'keyInsights'],
                            newInsights
                          )
                        }}
                        placeholder="Key Insight"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem(
                            ['blog', 'featured', 'keyInsights'],
                            index
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      addArrayItem(
                        ['blog', 'featured', 'keyInsights'],
                        'New insight'
                      )
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Insight
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Tab */}
          <TabsContent value="work" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="work-title">Title</Label>
                  <Input
                    id="work-title"
                    value={content.work.hero.title}
                    onChange={e =>
                      updateContent(['work', 'hero', 'title'], e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="work-description">Description</Label>
                  <Textarea
                    id="work-description"
                    value={content.work.hero.description}
                    onChange={e =>
                      updateContent(
                        ['work', 'hero', 'description'],
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featured-project-title">Title</Label>
                  <Input
                    id="featured-project-title"
                    value={content.work.featured.title}
                    onChange={e =>
                      updateContent(
                        ['work', 'featured', 'title'],
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="featured-challenge">Challenge</Label>
                  <Textarea
                    id="featured-challenge"
                    value={content.work.featured.challenge}
                    onChange={e =>
                      updateContent(
                        ['work', 'featured', 'challenge'],
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-solution">Solution</Label>
                  <Textarea
                    id="featured-solution"
                    value={content.work.featured.solution}
                    onChange={e =>
                      updateContent(
                        ['work', 'featured', 'solution'],
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-impact">Impact</Label>
                  <Textarea
                    id="featured-impact"
                    value={content.work.featured.impact}
                    onChange={e =>
                      updateContent(
                        ['work', 'featured', 'impact'],
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
