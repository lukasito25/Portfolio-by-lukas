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
  AlertTriangle,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { useFormErrorHandler, useErrorHandler } from '@/hooks/useErrorHandler'
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary'
import { apiClient } from '@/lib/api-client'
import { AppError, ErrorFactory } from '@/lib/error-handling'

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
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Error handling hooks
  const { formErrors, handleFormError, clearFormErrors, setFieldError } = useFormErrorHandler()
  const { handleError, clearError, retry } = useErrorHandler({
    onError: (error: AppError) => {
      setSubmitError(error.userMessage)
    }
  })

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
      setSubmitError(null)
      clearFormErrors()
      clearError()

      // Validate form data before submission
      try {
        recruiterPageSchema.parse(data)
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {}
          validationError.issues.forEach(issue => {
            if (issue.path.length > 0) {
              fieldErrors[issue.path[0] as string] = issue.message
            }
          })
          handleFormError(
            ErrorFactory.createValidationError('Please fix the errors below'),
            fieldErrors
          )
          return
        }
      }

      const submissionData = {
        ...data,
        authorId: 'current-user-id', // This should be replaced with actual user ID from session
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : null,
      }

      let result
      try {
        if (mode === 'create') {
          result = await apiClient.createRecruiterPage(submissionData)
        } else if (initialData?.id) {
          result = await apiClient.updateRecruiterPage(
            initialData.id,
            submissionData
          )
        }

        if (result?.success) {
          clearFormErrors()
          clearError()
          onSuccess?.(result)
        }
      } catch (apiError) {
        // Handle specific API errors
        if (apiError instanceof Error) {
          const appError = ErrorFactory.fromError(apiError, {
            formData: submissionData,
            mode,
            pageId: initialData?.id,
          })

          // Check for specific error types that need field-level handling
          if (appError.context?.details?.field) {
            setFieldError(appError.context.details.field, appError.userMessage)
          } else {
            handleFormError(appError)
          }
        } else {
          handleFormError(ErrorFactory.createFormError('Failed to save recruiter page'))
        }
      }
    } catch (error) {
      console.error('Unexpected error in form submission:', error)
      handleFormError(
        ErrorFactory.createFormError('An unexpected error occurred while saving the page')
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetrySubmit = async () => {
    if (retryCount >= 3) {
      setSubmitError('Maximum retry attempts reached. Please try again later.')
      return
    }

    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    try {
      await retry(async () => {
        const currentData = watch() as RecruiterPageFormData
        await onSubmit(currentData)
      }, {
        maxAttempts: 1, // Single retry attempt
        onRetry: (attempt) => {
          console.log(`Retrying form submission (attempt ${attempt})`)
        }
      })
    } catch (retryError) {
      console.error('Retry failed:', retryError)
    } finally {
      setIsRetrying(false)
    }
  }

  // Clear errors when form data changes
  useEffect(() => {
    if (submitError) {
      setSubmitError(null)
    }
  }, [watch()])

  // Validate slug uniqueness (debounced)
  useEffect(() => {
    const slug = watch('slug')
    if (slug && slugTouched && mode === 'create') {
      const timeoutId = setTimeout(async () => {
        try {
          // Check if slug already exists
          await apiClient.getRecruiterPage(slug)
          setFieldError('slug', 'This slug is already in use')
        } catch (error) {
          // If page not found, slug is available
          if (error instanceof Error && error.message.includes('404')) {
            clearFormErrors()
          }
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [watch('slug'), slugTouched, mode, setFieldError, clearFormErrors])

  const handlePreview = () => {
    // This would open a preview modal or navigate to preview page
    console.log('Preview functionality to be implemented')
  }

  const selectedTemplate = templates.find(t => t.value === watchedTemplateType)

  return (
    <ErrorBoundary
      level="section"
      fallback={(error, retry) => (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">
                Form Error
              </h3>
            </div>
            <p className="text-red-700 mb-4">
              {error.userMessage}
            </p>
            <div className="flex gap-3">
              <Button onClick={retry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              {onCancel && (
                <Button onClick={onCancel} variant="ghost" className="text-red-700 hover:bg-red-100">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    >
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <Building className="w-5 h-5 text-gray-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Page Title
                  <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Join Our Engineering Team"
                  className={`transition-colors ${errors.title || formErrors.title ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:border-blue-500'}`}
                  aria-describedby={errors.title || formErrors.title ? 'title-error' : undefined}
                  aria-invalid={!!(errors.title || formErrors.title)}
                />
                {(errors.title || formErrors.title) && (
                  <p id="title-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.title?.message || formErrors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Company Name
                  <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  placeholder="e.g., TechCorp Inc."
                  className={`transition-colors ${errors.companyName || formErrors.companyName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:border-blue-500'}`}
                  aria-describedby={errors.companyName || formErrors.companyName ? 'companyName-error' : undefined}
                  aria-invalid={!!(errors.companyName || formErrors.companyName)}
                />
                {(errors.companyName || formErrors.companyName) && (
                  <p id="companyName-error" className="text-sm text-red-600 mt-1" role="alert">
                    {errors.companyName?.message || formErrors.companyName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="slug"
                className="text-sm font-medium text-gray-700 flex items-center gap-1"
              >
                Page URL Slug
                <span className="text-red-500" aria-label="required">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-2 rounded-md border">/r/</span>
                <Input
                  id="slug"
                  value={watch('slug')}
                  onChange={e => handleSlugChange(e.target.value)}
                  placeholder="company-name"
                  className={`flex-1 font-mono ${errors.slug ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:border-blue-500'}`}
                  aria-describedby={errors.slug ? 'slug-error' : 'slug-help'}
                  aria-invalid={!!errors.slug}
                />
              </div>
              {errors.slug && (
                <p id="slug-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.slug.message}
                </p>
              )}
              {!errors.slug && (
                <p id="slug-help" className="text-xs text-gray-500 mt-1">
                  URL-friendly version of your company name (lowercase, hyphens only)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-sm font-medium text-gray-700">
                  Role Name <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="roleName"
                  {...register('roleName')}
                  placeholder="e.g., Senior Frontend Developer"
                  className="border-gray-300 focus-visible:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleLevel" className="text-sm font-medium text-gray-700">
                  Role Level
                </Label>
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
                      className="border-gray-300"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-medium text-gray-700">
                  Company Size
                </Label>
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
                      className="border-gray-300"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                  Industry
                </Label>
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
                      className="border-gray-300"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <Globe className="w-5 h-5 text-gray-600" />
              Template Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4">
              {templates.map(template => (
                <label
                  key={template.value}
                  className={`relative flex cursor-pointer rounded-lg border-2 p-5 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                    watchedTemplateType === template.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('templateType')}
                    value={template.value}
                    className="sr-only"
                    aria-describedby={`template-${template.value}-description`}
                  />
                  <div className="flex w-full items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-base font-semibold text-gray-900">
                          {template.label}
                        </div>
                        {watchedTemplateType === template.value && (
                          <Badge variant="default" className="text-xs bg-blue-600 text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </div>
                      <div
                        id={`template-${template.value}-description`}
                        className="text-xs text-gray-500 bg-gray-100/50 p-2 rounded border-l-2 border-gray-300"
                      >
                        <span className="font-medium">Preview:</span> {template.preview}
                      </div>
                    </div>
                    <div
                      className={`ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        watchedTemplateType === template.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {watchedTemplateType === template.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Selected Template: {selectedTemplate.label}
                    </p>
                    <p className="text-sm text-blue-700">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Customization */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              Content Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label htmlFor="keySkills" className="text-sm font-medium text-gray-700">
                Key Skills to Highlight
              </Label>
              <div className="space-y-3">
                <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 transition-colors hover:border-gray-300">
                  {watchedKeySkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {watchedKeySkills.map(skill => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            aria-label={`Remove ${skill} skill`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-12">
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        No skills selected yet
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="skillSearch"
                    placeholder="Search and add skills..."
                    value={skillSearch}
                    onChange={e => setSkillSearch(e.target.value)}
                    className="border-gray-300 focus-visible:border-blue-500"
                    aria-describedby="skills-help"
                  />
                  {skillSearch && availableSkillsFiltered.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                      {availableSkillsFiltered.slice(0, 8).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm transition-colors border-b border-gray-100 last:border-0 flex items-center justify-between group"
                        >
                          <span>{skill}</span>
                          <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                  {skillSearch && availableSkillsFiltered.length === 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-3">
                      <p className="text-sm text-gray-500 text-center">No matching skills found</p>
                    </div>
                  )}
                </div>
                <p id="skills-help" className="text-xs text-gray-500">
                  Type to search for skills or technologies to highlight on your page
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalMessage" className="text-sm font-medium text-gray-700">
                Personal Message/Intro <span className="text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                id="personalMessage"
                {...register('personalMessage')}
                placeholder="Add a personal touch to your page to make it more engaging..."
                rows={4}
                className={`transition-colors resize-none ${errors.personalMessage ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:border-blue-500'}`}
                aria-describedby={errors.personalMessage ? 'personalMessage-error' : 'personalMessage-help'}
                aria-invalid={!!errors.personalMessage}
              />
              {errors.personalMessage && (
                <p id="personalMessage-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.personalMessage.message}
                </p>
              )}
              {!errors.personalMessage && (
                <p id="personalMessage-help" className="text-xs text-gray-500 mt-1">
                  Share what excites you about this opportunity or your approach to work
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText" className="text-sm font-medium text-gray-700">
                Call-to-Action Text
              </Label>
              <Input
                id="ctaText"
                {...register('ctaText')}
                placeholder="e.g., Let's discuss opportunities"
                className={`transition-colors ${errors.ctaText ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:border-blue-500'}`}
                aria-describedby={errors.ctaText ? 'ctaText-error' : 'ctaText-help'}
                aria-invalid={!!errors.ctaText}
              />
              {errors.ctaText && (
                <p id="ctaText-error" className="text-sm text-red-600 mt-1" role="alert">
                  {errors.ctaText.message}
                </p>
              )}
              {!errors.ctaText && (
                <p id="ctaText-help" className="text-xs text-gray-500 mt-1">
                  The button text visitors will see to contact you
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Contact Preferences</Label>
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border">
                <p className="text-xs text-gray-600 mb-3">Choose how recruiters can reach out to you</p>
                <Controller
                  name="contactPreferences.email"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Email"
                      description="Allow contact via email address"
                      className="text-sm"
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
                      description="Allow contact via LinkedIn messaging"
                      className="text-sm"
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
                      description="Allow contact via phone number"
                      className="text-sm"
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <Settings className="w-5 h-5 text-gray-600" />
              Page Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Active Page</div>
                      <div className="text-xs text-gray-500">
                        {field.value ? 'Page is live and accessible to recruiters' : 'Page is hidden from public view'}
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="active-help"
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate" className="text-sm font-medium text-gray-700">
                Expiration Date <span className="text-gray-400">(Optional)</span>
              </Label>
              <Input
                id="expirationDate"
                type="date"
                {...register('expirationDate')}
                className="border-gray-300 focus-visible:border-blue-500"
                aria-describedby="expiration-help"
              />
              <p id="expiration-help" className="text-xs text-gray-500">
                Automatically hide the page after this date
              </p>
            </div>

            <div className="space-y-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <Controller
                name="passwordProtected"
                control={control}
                render={({ field }) => (
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-yellow-600" />
                        <div className="text-sm font-medium text-gray-700">Password Protection</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Add an extra layer of privacy by requiring a password
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="password-help"
                    />
                  </div>
                )}
              />

              {watchedPasswordProtected && (
                <div className="space-y-2 pt-2 border-t border-yellow-200">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Page Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Enter a secure password"
                    className="border-gray-300 focus-visible:border-blue-500"
                    aria-describedby="password-field-help"
                  />
                  <p id="password-field-help" className="text-xs text-gray-600">
                    Share this password only with trusted recruiters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Global Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Unable to save recruiter page
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  {submitError}
                </p>
                {retryCount < 3 && (
                  <Button
                    onClick={handleRetrySubmit}
                    disabled={isRetrying}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="bg-gray-50 -mx-4 -mb-4 p-6 rounded-b-lg border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isLoading || isRetrying}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading || isRetrying}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Page
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                type="submit"
                variant="outline"
                disabled={isLoading || isRetrying || !isDirty}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isRetrying}
                className={`bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-colors min-w-[140px] ${isLoading || isRetrying ? 'opacity-75' : ''}`}
              >
                {isLoading || isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {isRetrying ? 'Retrying...' : mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    {mode === 'create' ? 'Create Page' : 'Update Page'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {isDirty && !submitError && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                You have unsaved changes
              </p>
            </div>
          )}

          {Object.keys(formErrors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-700 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3" />
                Please fix the following errors:
              </p>
              <ul className="text-xs text-red-600 space-y-1">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        </form>
      </div>
    </ErrorBoundary>
  )
}
