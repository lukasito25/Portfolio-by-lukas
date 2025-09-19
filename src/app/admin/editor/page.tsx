'use client'

import { useState, useEffect } from 'react'
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
  ArrowLeft
} from 'lucide-react'
import { SiteContent, defaultContent } from '@/lib/content-config'
import Link from 'next/link'

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('homepage')

  // Load content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('site-content')
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent))
      } catch (error) {
        console.error('Failed to load saved content:', error)
      }
    }
  }, [])

  // Save content to localStorage
  const saveContent = async () => {
    setIsLoading(true)
    try {
      localStorage.setItem('site-content', JSON.stringify(content))
      setHasChanges(false)
      // You could also save to a backend here
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate save delay
      alert('Content saved successfully!')
    } catch (error) {
      console.error('Failed to save content:', error)
      alert('Failed to save content')
    } finally {
      setIsLoading(false)
    }
  }

  // Export content as JSON
  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = 'site-content.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import content from JSON file
  const importContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedContent = JSON.parse(e.target?.result as string)
          setContent(importedContent)
          setHasChanges(true)
          alert('Content imported successfully!')
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  // Reset to default content
  const resetContent = () => {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      setContent(defaultContent)
      setHasChanges(true)
    }
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
                  Content Editor
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Edit your portfolio content in real-time
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
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
                Save Changes
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
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
                    onChange={(e) => updateContent(['homepage', 'hero', 'badge'], e.target.value)}
                  />
                </div>

                <div>
                  <Label>Headlines</Label>
                  {content.homepage.hero.headline.map((line, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={line}
                        onChange={(e) => {
                          const newHeadlines = [...content.homepage.hero.headline]
                          newHeadlines[index] = e.target.value
                          updateContent(['homepage', 'hero', 'headline'], newHeadlines)
                        }}
                        placeholder={`Headline ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHeadlines = content.homepage.hero.headline.filter((_, i) => i !== index)
                          updateContent(['homepage', 'hero', 'headline'], newHeadlines)
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
                      const newHeadlines = [...content.homepage.hero.headline, "New Line"]
                      updateContent(['homepage', 'hero', 'headline'], newHeadlines)
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
                    onChange={(e) => updateContent(['homepage', 'hero', 'subheadline'], e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Metrics</Label>
                  {content.homepage.hero.metrics.map((metric, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={metric.value}
                        onChange={(e) => {
                          const newMetrics = [...content.homepage.hero.metrics]
                          newMetrics[index].value = e.target.value
                          updateContent(['homepage', 'hero', 'metrics'], newMetrics)
                        }}
                        placeholder="Value"
                        className="w-24"
                      />
                      <Input
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...content.homepage.hero.metrics]
                          newMetrics[index].label = e.target.value
                          updateContent(['homepage', 'hero', 'metrics'], newMetrics)
                        }}
                        placeholder="Label"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['homepage', 'hero', 'metrics'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => addArrayItem(['homepage', 'hero', 'metrics'], { value: "0", label: "New Metric" })}
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
                        onChange={(e) => {
                          const newCompetencies = [...content.homepage.competencies]
                          newCompetencies[index].title = e.target.value
                          updateContent(['homepage', 'competencies'], newCompetencies)
                        }}
                        placeholder="Title"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['homepage', 'competencies'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={competency.description}
                      onChange={(e) => {
                        const newCompetencies = [...content.homepage.competencies]
                        newCompetencies[index].description = e.target.value
                        updateContent(['homepage', 'competencies'], newCompetencies)
                      }}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(['homepage', 'competencies'], { title: "New Competency", description: "Description" })}
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
                    onChange={(e) => updateContent(['homepage', 'cta', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cta-description">Description</Label>
                  <Textarea
                    id="cta-description"
                    value={content.homepage.cta.description}
                    onChange={(e) => updateContent(['homepage', 'cta', 'description'], e.target.value)}
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
                    onChange={(e) => updateContent(['about', 'hero', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="about-description">Description</Label>
                  <Textarea
                    id="about-description"
                    value={content.about.hero.description}
                    onChange={(e) => updateContent(['about', 'hero', 'description'], e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Quick Stats</Label>
                  {content.about.hero.quickStats.map((stat, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.about.hero.quickStats]
                          newStats[index].label = e.target.value
                          updateContent(['about', 'hero', 'quickStats'], newStats)
                        }}
                        placeholder="Label"
                      />
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...content.about.hero.quickStats]
                          newStats[index].value = e.target.value
                          updateContent(['about', 'hero', 'quickStats'], newStats)
                        }}
                        placeholder="Value"
                        className="w-24"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['about', 'hero', 'quickStats'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => addArrayItem(['about', 'hero', 'quickStats'], { label: "New Stat", value: "0" })}
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
                    onChange={(e) => updateContent(['about', 'philosophy', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="philosophy-description">Description</Label>
                  <Textarea
                    id="philosophy-description"
                    value={content.about.philosophy.description}
                    onChange={(e) => updateContent(['about', 'philosophy', 'description'], e.target.value)}
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
                          onChange={(e) => {
                            const newCards = [...content.about.philosophy.cards]
                            newCards[index].title = e.target.value
                            updateContent(['about', 'philosophy', 'cards'], newCards)
                          }}
                          placeholder="Card Title"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem(['about', 'philosophy', 'cards'], index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={card.description}
                        onChange={(e) => {
                          const newCards = [...content.about.philosophy.cards]
                          newCards[index].description = e.target.value
                          updateContent(['about', 'philosophy', 'cards'], newCards)
                        }}
                        placeholder="Description"
                        rows={3}
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addArrayItem(['about', 'philosophy', 'cards'], { title: "New Philosophy", description: "Description" })}
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
                    onChange={(e) => updateContent(['blog', 'hero', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="blog-description">Description</Label>
                  <Textarea
                    id="blog-description"
                    value={content.blog.hero.description}
                    onChange={(e) => updateContent(['blog', 'hero', 'description'], e.target.value)}
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
                    onChange={(e) => updateContent(['blog', 'featured', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-description">Description</Label>
                  <Textarea
                    id="featured-description"
                    value={content.blog.featured.description}
                    onChange={(e) => updateContent(['blog', 'featured', 'description'], e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Key Insights</Label>
                  {content.blog.featured.keyInsights.map((insight, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={insight}
                        onChange={(e) => {
                          const newInsights = [...content.blog.featured.keyInsights]
                          newInsights[index] = e.target.value
                          updateContent(['blog', 'featured', 'keyInsights'], newInsights)
                        }}
                        placeholder="Key Insight"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['blog', 'featured', 'keyInsights'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => addArrayItem(['blog', 'featured', 'keyInsights'], "New insight")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Insight
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.blog.articles.map((article, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={article.title}
                        onChange={(e) => {
                          const newArticles = [...content.blog.articles]
                          newArticles[index].title = e.target.value
                          updateContent(['blog', 'articles'], newArticles)
                        }}
                        placeholder="Article Title"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['blog', 'articles'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={article.description}
                      onChange={(e) => {
                        const newArticles = [...content.blog.articles]
                        newArticles[index].description = e.target.value
                        updateContent(['blog', 'articles'], newArticles)
                      }}
                      placeholder="Description"
                      rows={2}
                      className="mb-2"
                    />
                    <Textarea
                      value={article.content}
                      onChange={(e) => {
                        const newArticles = [...content.blog.articles]
                        newArticles[index].content = e.target.value
                        updateContent(['blog', 'articles'], newArticles)
                      }}
                      placeholder="Content"
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={article.date}
                        onChange={(e) => {
                          const newArticles = [...content.blog.articles]
                          newArticles[index].date = e.target.value
                          updateContent(['blog', 'articles'], newArticles)
                        }}
                        placeholder="Date"
                      />
                      <Input
                        value={article.readTime}
                        onChange={(e) => {
                          const newArticles = [...content.blog.articles]
                          newArticles[index].readTime = e.target.value
                          updateContent(['blog', 'articles'], newArticles)
                        }}
                        placeholder="Read Time"
                      />
                    </div>
                    <div className="mt-2">
                      <Input
                        value={article.tags.join(', ')}
                        onChange={(e) => {
                          const newArticles = [...content.blog.articles]
                          newArticles[index].tags = e.target.value.split(', ').filter(tag => tag.trim())
                          updateContent(['blog', 'articles'], newArticles)
                        }}
                        placeholder="Tags (comma separated)"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(['blog', 'articles'], {
                    title: "New Article",
                    description: "Article description",
                    content: "Article content",
                    date: "January 1, 2025",
                    readTime: "5 min read",
                    tags: ["Tag1", "Tag2"]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
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
                    onChange={(e) => updateContent(['work', 'hero', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="work-description">Description</Label>
                  <Textarea
                    id="work-description"
                    value={content.work.hero.description}
                    onChange={(e) => updateContent(['work', 'hero', 'description'], e.target.value)}
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
                    onChange={(e) => updateContent(['work', 'featured', 'title'], e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-challenge">Challenge</Label>
                  <Textarea
                    id="featured-challenge"
                    value={content.work.featured.challenge}
                    onChange={(e) => updateContent(['work', 'featured', 'challenge'], e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-solution">Solution</Label>
                  <Textarea
                    id="featured-solution"
                    value={content.work.featured.solution}
                    onChange={(e) => updateContent(['work', 'featured', 'solution'], e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="featured-impact">Impact</Label>
                  <Textarea
                    id="featured-impact"
                    value={content.work.featured.impact}
                    onChange={(e) => updateContent(['work', 'featured', 'impact'], e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.work.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={project.title}
                        onChange={(e) => {
                          const newProjects = [...content.work.projects]
                          newProjects[index].title = e.target.value
                          updateContent(['work', 'projects'], newProjects)
                        }}
                        placeholder="Project Title"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem(['work', 'projects'], index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...content.work.projects]
                        newProjects[index].description = e.target.value
                        updateContent(['work', 'projects'], newProjects)
                      }}
                      placeholder="Description"
                      rows={2}
                      className="mb-2"
                    />
                    <div>
                      <Label>Technologies</Label>
                      <Input
                        value={project.technologies.join(', ')}
                        onChange={(e) => {
                          const newProjects = [...content.work.projects]
                          newProjects[index].technologies = e.target.value.split(', ').filter(tech => tech.trim())
                          updateContent(['work', 'projects'], newProjects)
                        }}
                        placeholder="Technologies (comma separated)"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addArrayItem(['work', 'projects'], {
                    title: "New Project",
                    description: "Project description",
                    technologies: ["React", "TypeScript"],
                    metrics: [{ label: "Metric", value: "100%" }]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}