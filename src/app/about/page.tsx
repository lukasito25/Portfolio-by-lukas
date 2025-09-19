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
  Users,
  TrendingUp,
  Brain,
  Target,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - Lukas Hosala | Senior Product Manager',
  description:
    'Senior Product Manager with 8+ years of international experience at adidas Digital Sports and fintech startups. MBA graduate specializing in digital product development and team leadership.',
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
                From Slovakia to Global Scale
              </h1>
              <div className="prose prose-lg dark:prose-invert mb-8">
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  I'm Lukas Hosala, a Senior Product Manager with 8+ years of international experience
                  spanning digital sports, e-commerce, and fintech. Based in Volterra, Italy, I've led
                  cross-functional teams of up to 13 personnel across multiple locations, delivering
                  products that serve 165M+ users globally at companies like adidas Digital Sports and
                  algorithmic trading startup StagStrat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Team Leadership</Badge>
                <Badge variant="secondary">Digital Product Management</Badge>
                <Badge variant="secondary">Agile Methodology</Badge>
                <Badge variant="secondary">Strategic Management</Badge>
                <Badge variant="secondary">SEO & Marketing</Badge>
                <Badge variant="secondary">Tech Stack Migration</Badge>
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
                    <span className="font-semibold">8+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Global Users Reached
                    </span>
                    <span className="font-semibold">165M+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Max Team Size
                    </span>
                    <span className="font-semibold">13</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Countries Worked
                    </span>
                    <span className="font-semibold">3</span>
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
              From managing teams of 13 across multiple countries to serving 165M+ users globally,
              I've learned that great products come from empowered teams with clear vision.
              My approach combines agile methodology with strategic thinking and international perspective.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>International Team Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Leading cross-functional teams of up to 13 personnel across multiple locations
                  and time zones. I focus on clear communication, cultural awareness, and
                  agile methodologies to deliver world-class products.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Strategic Product Thinking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  MBA-level strategic management combined with hands-on product experience.
                  I create comprehensive product roadmaps with integrated SEO optimization
                  and marketing strategies for maximum business impact.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Global Scale Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  From startup to enterprise scale - delivering products that serve 165M+ users
                  globally while managing complex technical migrations and maintaining
                  zero downtime for critical business operations.
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
                      Runtastic GmbH | adidas Digital Sports • 2022 - 2025 • Austria
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Led comprehensive website redesign and technology stack migration for adidas Digital Sports.
                  Managed cross-functional teams across multiple locations to deliver rebranded content,
                  new tech stack, and integrated SEO marketing strategy serving 165M+ global users.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      165M+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Global Users
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      13
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Team Size
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                      18mo
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Project Duration
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                      Zero
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Downtime
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
                    <CardTitle className="text-xl">Head of Product</CardTitle>
                    <CardDescription className="text-base">
                      StagStrat | Algorithmic Trading Startup • 2022 - Present • Remote
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Orchestrating development and product lifecycle of algorithmic trading platform.
                  Created comprehensive product roadmap, launched complete website, and implemented
                  SEO optimization plan for revolutionary trading solutions in the fintech space.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Product Strategy</Badge>
                  <Badge variant="outline">FinTech</Badge>
                  <Badge variant="outline">Website Launch</Badge>
                  <Badge variant="outline">SEO Optimization</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">
                      Product Manager
                    </CardTitle>
                    <CardDescription className="text-base">
                      adidas International Marketing B.V. • 2019 - 2022 • Netherlands
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Led development teams of up to 13 personnel including external freelancers.
                  Managed multiple products including third-party tool Sprinklr and in-house
                  developed social commerce engine (adiSCom) for global e-commerce operations.
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
