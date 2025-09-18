import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Briefcase,
  GraduationCap,
  Users,
  TrendingUp,
  Brain,
  Target,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - Product Leader & Technical Strategist',
  description:
    'Senior Product Manager with deep technical expertise, specializing in AI/ML products, data-driven decision making, and cross-functional team leadership.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/3">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Building Products That Matter
              </h1>
              <div className="prose prose-lg dark:prose-invert mb-8">
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  I'm a Senior Product Manager who bridges the gap between
                  ambitious vision and technical reality. With a unique
                  combination of deep technical expertise and strategic business
                  acumen, I've spent the last decade transforming complex
                  challenges into elegant solutions that users love and
                  businesses thrive on.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Product Strategy</Badge>
                <Badge variant="secondary">AI/ML Integration</Badge>
                <Badge variant="secondary">Data Analytics</Badge>
                <Badge variant="secondary">Team Leadership</Badge>
                <Badge variant="secondary">Growth Optimization</Badge>
                <Badge variant="secondary">Technical Architecture</Badge>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-800 dark:text-blue-200">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Years of Experience
                    </span>
                    <span className="font-semibold">10+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Products Launched
                    </span>
                    <span className="font-semibold">15+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Teams Led
                    </span>
                    <span className="font-semibold">50+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Revenue Impact
                    </span>
                    <span className="font-semibold">$50M+</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Philosophy */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Philosophy</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Product management is about empowering people to build something
              meaningful together. My approach combines data-driven insights
              with human empathy to create products that solve real problems.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>People-First Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Great products come from great teams. I focus on creating
                  psychological safety, clear communication, and shared
                  ownership that empowers everyone to do their best work.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Evidence-Based Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Every decision is backed by data, user research, and market
                  insights. I build robust measurement frameworks that turn
                  assumptions into validated learnings.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Impact-Driven Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Features don't matter—outcomes do. I align teams around clear
                  metrics and business objectives, ensuring every effort drives
                  measurable value for users and the company.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Professional Journey */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Professional Journey
          </h2>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      Senior Product Manager
                    </CardTitle>
                    <CardDescription className="text-base">
                      TechCorp Inc. • 2021 - Present • San Francisco, CA
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Leading product strategy for AI-powered analytics platform
                  serving 500K+ users. Spearheaded the integration of machine
                  learning algorithms that improved user engagement by 340% and
                  reduced churn by 45%.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      340%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Engagement Increase
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      $15M
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      ARR Growth
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                      45%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Churn Reduction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                      12
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Team Members
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">Product Manager</CardTitle>
                    <CardDescription className="text-base">
                      GrowthTech Solutions • 2019 - 2021 • Austin, TX
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Built and launched a B2B SaaS marketing automation platform
                  from 0 to 1. Led cross-functional team of 8 through product
                  discovery, MVP development, and initial market penetration,
                  achieving $2M ARR within 18 months.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">0 to 1 Product</Badge>
                  <Badge variant="outline">B2B SaaS</Badge>
                  <Badge variant="outline">Marketing Automation</Badge>
                  <Badge variant="outline">Go-to-Market Strategy</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      Technical Product Analyst
                    </CardTitle>
                    <CardDescription className="text-base">
                      DataDriven Inc. • 2017 - 2019 • Seattle, WA
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Started my product career analyzing user behavior and building
                  data pipelines for a consumer fintech app. Developed expertise
                  in SQL, Python, and statistical analysis while working closely
                  with engineering teams to implement A/B testing frameworks.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Core Competencies
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">Product Management</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Product Strategy & Roadmapping</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>User Research & Customer Development</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Data Analysis & A/B Testing</span>
                    <span className="text-sm text-slate-500">Expert</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Go-to-Market Strategy</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Technical Skills</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>SQL & Database Design</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Python & Machine Learning</span>
                    <span className="text-sm text-slate-500">Intermediate</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>API Design & System Architecture</span>
                    <span className="text-sm text-slate-500">Advanced</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Cloud Platforms (AWS, GCP)</span>
                    <span className="text-sm text-slate-500">Intermediate</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Side */}
        <section className="mb-16">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Beyond the Spreadsheets
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto text-center">
              <p>
                When I'm not optimizing conversion funnels or analyzing cohort
                data, you'll find me exploring emerging technologies, mentoring
                aspiring product managers, or hiking the beautiful trails around
                the Bay Area. I believe the best product insights often come
                from stepping away from the screen and experiencing the world
                from our users' perspective.
              </p>
              <p>
                I'm passionate about the intersection of AI and human-centered
                design, and I regularly contribute to product management
                communities through speaking engagements and blog posts. I also
                volunteer with local coding bootcamps, helping career-changers
                navigate the tech landscape.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
