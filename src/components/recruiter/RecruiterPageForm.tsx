'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Globe,
  Briefcase,
  Users,
  Tag,
  MessageSquare,
  Phone,
  Settings,
  Eye,
  Save,
  Plus,
  X,
  Calendar,
  Lock,
  RefreshCw,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'

// Form validation schema
const recruiterPageSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(100, 'Title too long'),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  roleName: z.string().max(100, 'Role name too long').optional(),
  roleLevel: z
    .enum(['Junior', 'Mid-level', 'Senior', 'Lead', 'Executive'])
    .optional(),
  companySize: z
    .enum([
      'Startup (<50)',
      'Scale-up (50-200)',
      'Mid-size (200-1000)',
      'Enterprise (1000+)',
    ])
    .optional(),
  industry: z
    .enum([
      'Tech',
      'Finance',
      'Healthcare',
      'E-commerce',
      'Manufacturing',
      'Education',
      'Consulting',
      'Other',
    ])
    .optional(),
  templateType: z.enum([
    'company-mirror',
    'day-one-impact',
    'executive-briefing',
  ]),
  keySkills: z.array(z.string()),
  personalMessage: z.string().max(1000, 'Personal message too long').optional(),
  ctaText: z.string().max(100, 'CTA text too long').optional(),
  contactPreferences: z.object({
    email: z.boolean(),
    linkedin: z.boolean(),
    phone: z.boolean(),
  }),
  isActive: z.boolean(),
  expirationDate: z.string().optional(),
  passwordProtected: z.boolean(),
  password: z.string().optional(),
})

type RecruiterPageFormData = z.infer<typeof recruiterPageSchema>

interface RecruiterPageFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<RecruiterPageFormData> & { id?: string }
  onSuccess?: (data: any) => void
  onCancel?: () => void
}

// Template configurations
const templates = [
  {
    value: 'company-mirror',
    label: 'Company Mirror',
    description: 'Focuses on company culture alignment and values match',
    preview: 'Emphasizes cultural fit, team dynamics, and shared values',
  },
  {
    value: 'day-one-impact',
    label: 'Day One Impact',
    description: 'Emphasizes immediate value delivery and quick wins',
    preview: 'Highlights skills, achievements, and immediate contributions',
  },
  {
    value: 'executive-briefing',
    label: 'Executive Briefing',
    description: 'Strategic leadership approach for senior roles',
    preview: 'Focuses on vision, leadership experience, and strategic thinking',
  },
]

// Predefined skills list
const availableSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'JavaScript',
  'Next.js',
  'Vue.js',
  'Angular',
  'PHP',
  'Laravel',
  'Django',
  'Flask',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'CI/CD',
  'GraphQL',
  'REST APIs',
  'Microservices',
  'DevOps',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'Agile',
  'Scrum',
  'Leadership',
  'Team Management',
  'Strategic Planning',
]

export function RecruiterPageForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: RecruiterPageFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [availableSkillsFiltered, setAvailableSkillsFiltered] =
    useState(availableSkills)
  const [skillSearch, setSkillSearch] = useState('')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<RecruiterPageFormData>({
    resolver: zodResolver(recruiterPageSchema),
    defaultValues: {
      title: '',
      companyName: '',
      slug: '',
      roleName: '',
      templateType: 'company-mirror',
      keySkills: [],
      personalMessage: '',
      ctaText: 'Get in touch',
      contactPreferences: { email: true, linkedin: false, phone: false },
      isActive: true,
      passwordProtected: false,
      ...initialData,
    },
  })

  const watchedCompanyName = watch('companyName')
  const watchedTemplateType = watch('templateType')
  const watchedKeySkills = watch('keySkills')
  const watchedPasswordProtected = watch('passwordProtected')

  // Auto-generate slug from company name
  useEffect(() => {
    if (!slugTouched && watchedCompanyName) {
      const generatedSlug = watchedCompanyName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', generatedSlug)
    }
  }, [watchedCompanyName, slugTouched, setValue])

  // Filter available skills
  useEffect(() => {
    if (skillSearch) {
      setAvailableSkillsFiltered(
        availableSkills.filter(
          skill =>
            skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
            !watchedKeySkills.includes(skill)
        )
      )
    } else {
      setAvailableSkillsFiltered(
        availableSkills.filter(skill => !watchedKeySkills.includes(skill))
      )
    }
  }, [skillSearch, watchedKeySkills])

  const addSkill = (skill: string) => {
    if (!watchedKeySkills.includes(skill)) {
      setValue('keySkills', [...watchedKeySkills, skill], { shouldDirty: true })
    }
    setSkillSearch('')
  }

  const removeSkill = (skillToRemove: string) => {
    setValue(
      'keySkills',
      watchedKeySkills.filter(skill => skill !== skillToRemove),
      { shouldDirty: true }
    )
  }

  const handleSlugChange = (value: string) => {
    setSlugTouched(true)
    setValue('slug', value)
  }

  const onSubmit = async (data: RecruiterPageFormData) => {
    try {
      setIsLoading(true)

      const submissionData = {
        ...data,
        authorId: 'current-user-id', // This should be replaced with actual user ID from session
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : null,
      }

      let result
      if (mode === 'create') {
        result = await dataService.createRecruiterPage(submissionData)
      } else if (initialData?.id) {
        result = await dataService.updateRecruiterPage(
          initialData.id,
          submissionData
        )
      }

      if (result?.success) {
        onSuccess?.(result)
      }
    } catch (error) {
      console.error('Failed to save recruiter page:', error)
      // Handle error display here
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // This would open a preview modal or navigate to preview page
    console.log('Preview functionality to be implemented')
  }

  const selectedTemplate = templates.find(t => t.value === watchedTemplateType)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Join Our Engineering Team"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...register('companyName')}
                placeholder="e.g., TechCorp Inc."
                className={errors.companyName ? 'border-red-500' : ''}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="slug">Page URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/r/</span>
              <Input
                id="slug"
                value={watch('slug')}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="company-name"
                className={errors.slug ? 'border-red-500' : ''}
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roleName">Role Name (Optional)</Label>
              <Input
                id="roleName"
                {...register('roleName')}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div>
              <Label htmlFor="roleLevel">Role Level</Label>
              <Controller
                name="roleLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    options={[
                      { value: 'Junior', label: 'Junior' },
                      { value: 'Mid-level', label: 'Mid-level' },
                      { value: 'Senior', label: 'Senior' },
                      { value: 'Lead', label: 'Lead' },
                      { value: 'Executive', label: 'Executive' },
                    ]}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder="Select role level"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companySize">Company Size</Label>
              <Controller
                name="companySize"
                control={control}
                render={({ field }) => (
                  <Select
                    options={[
                      { value: 'Startup (<50)', label: 'Startup (<50)' },
                      {
                        value: 'Scale-up (50-200)',
                        label: 'Scale-up (50-200)',
                      },
                      {
                        value: 'Mid-size (200-1000)',
                        label: 'Mid-size (200-1000)',
                      },
                      {
                        value: 'Enterprise (1000+)',
                        label: 'Enterprise (1000+)',
                      },
                    ]}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder="Select company size"
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select
                    options={[
                      { value: 'Tech', label: 'Technology' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'Healthcare', label: 'Healthcare' },
                      { value: 'E-commerce', label: 'E-commerce' },
                      { value: 'Manufacturing', label: 'Manufacturing' },
                      { value: 'Education', label: 'Education' },
                      { value: 'Consulting', label: 'Consulting' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder="Select industry"
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Template Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {templates.map(template => (
              <label
                key={template.value}
                className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  watchedTemplateType === template.value
                    ? 'border-primary bg-primary/5 ring-2 ring-primary'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  {...register('templateType')}
                  value={template.value}
                  className="sr-only"
                />
                <div className="flex w-full items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900">
                        {template.label}
                      </div>
                      {watchedTemplateType === template.value && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {template.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {template.preview}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedTemplate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {selectedTemplate.label} -{' '}
                {selectedTemplate.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Content Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="keySkills">Key Skills to Highlight</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {watchedKeySkills.map(skill => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {watchedKeySkills.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    No skills selected
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  placeholder="Search and add skills..."
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                />
                {skillSearch && availableSkillsFiltered.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {availableSkillsFiltered.slice(0, 5).map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="personalMessage">Personal Message/Intro</Label>
            <Textarea
              id="personalMessage"
              {...register('personalMessage')}
              placeholder="Add a personal touch to your page..."
              rows={4}
              className={errors.personalMessage ? 'border-red-500' : ''}
            />
            {errors.personalMessage && (
              <p className="text-sm text-red-500 mt-1">
                {errors.personalMessage.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ctaText">Call-to-Action Text</Label>
            <Input
              id="ctaText"
              {...register('ctaText')}
              placeholder="e.g., Let's discuss opportunities"
              className={errors.ctaText ? 'border-red-500' : ''}
            />
            {errors.ctaText && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ctaText.message}
              </p>
            )}
          </div>

          <div>
            <Label>Contact Preferences</Label>
            <div className="space-y-2 mt-2">
              <Controller
                name="contactPreferences.email"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Email"
                    description="Allow contact via email"
                  />
                )}
              />
              <Controller
                name="contactPreferences.linkedin"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="LinkedIn"
                    description="Allow contact via LinkedIn"
                  />
                )}
              />
              <Controller
                name="contactPreferences.phone"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Phone"
                    description="Allow contact via phone"
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Page Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Active Page"
                description="Enable or disable this recruiter page"
              />
            )}
          />

          <div>
            <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
            <Input
              id="expirationDate"
              type="date"
              {...register('expirationDate')}
            />
          </div>

          <Controller
            name="passwordProtected"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Password Protection"
                description="Require a password to view this page"
              />
            )}
          />

          {watchedPasswordProtected && (
            <div>
              <Label htmlFor="password">Page Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter page password"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t">
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="button" variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={isLoading || !isDirty}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Create Page' : 'Update Page'}
          </Button>
        </div>
      </div>
    </form>
  )
}
