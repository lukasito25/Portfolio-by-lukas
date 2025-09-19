import { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Users,
  BarChart3,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - Lukas Hosala | Product Management Insights',
  description:
    'Real insights from 8+ years at adidas Digital Sports and fintech startups. International team leadership, digital product management, and scaling to 165M+ users.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Insights from the Field
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Real stories and lessons learned from 8+ years managing international teams
            at adidas Digital Sports and fintech startups. From leading teams of 13
            across multiple countries to serving 165M+ users globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Latest Articles</Button>
            <Button variant="outline" size="lg">
              About My Experience
            </Button>
          </div>
        </section>

        {/* Featured Article */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Featured Article
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Managing International Teams: Lessons from Leading 13 People Across Multiple Time Zones
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  Real insights from my experience leading cross-functional teams of up to 13 personnel
                  at adidas Digital Sports. From managing external freelancers to coordinating complex
                  website redesigns across multiple locations while serving 165M+ users globally.
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>January 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>From personal experience</span>
                  </div>
                </div>
                <Button size="lg" className="group">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                      <li>
                        • Communication strategies across multiple time zones
                      </li>
                      <li>• Managing external freelancers and internal teams</li>
                      <li>
                        • Coordinating complex technical migrations with zero downtime
                      </li>
                      <li>
                        • Building trust and accountability in distributed teams
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link href="/blog/all">View All Posts</Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Article 2 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>January 8, 2025</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>6 min read</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  From Slovakia to Global Scale: My Journey in Product Management
                </CardTitle>
                <CardDescription className="text-base">
                  How I went from Sport Management graduate to leading international
                  product teams at adidas Digital Sports serving 165M+ users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  After leading 15+ cross-functional teams, I've learned that
                  great collaboration isn't about processes—it's about people.
                  Here's how to build teams that move fast and build together.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Leadership</Badge>
                    <Badge variant="outline">Team Building</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            {/* Article 3 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 1, 2024</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>10 min read</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Building StagStrat: From Concept to Algorithmic Trading Platform
                </CardTitle>
                <CardDescription className="text-base">
                  The journey of creating a fintech startup from scratch as Head of Product,
                  including roadmap development and go-to-market strategy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  As Head of Product at StagStrat, I orchestrated the complete product lifecycle
                  of an algorithmic trading platform. From initial concept to production launch,
                  here's how we built a revolutionary trading solution.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">FinTech</Badge>
                    <Badge variant="outline">Startup</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            {/* Article 4 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>November 24, 2024</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>6 min read</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Zero Downtime Migration: Lessons from adidas Digital Sports
                </CardTitle>
                <CardDescription className="text-base">
                  How we migrated a platform serving 165M+ users to a new tech stack
                  without a single minute of downtime.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Leading the technical migration of the Runtastic website while serving
                  165M+ global users taught me that successful migrations aren't about
                  the technology—they're about risk management and team coordination.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Tech Migration</Badge>
                    <Badge variant="outline">Risk Management</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            {/* Article 5 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>November 17, 2024</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>9 min read</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Managing External Teams: Insights from Leading 13 Personnel
                </CardTitle>
                <CardDescription className="text-base">
                  Real strategies for coordinating external freelancers and
                  internal teams across multiple locations and time zones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  At adidas, I managed teams of up to 13 personnel including external freelancers
                  across multiple locations. Here's what I learned about building trust,
                  maintaining quality, and delivering complex projects with distributed teams.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Team Management</Badge>
                    <Badge variant="outline">Remote Work</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Areas of Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>International Team Leadership</CardTitle>
                <CardDescription>Leading 13+ personnel across multiple countries</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Digital Sports & E-commerce</CardTitle>
                <CardDescription>8+ years at adidas Digital Sports</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>FinTech & Algorithmic Trading</CardTitle>
                <CardDescription>Head of Product at StagStrat startup</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Tech Stack Migration</CardTitle>
                <CardDescription>Zero downtime migrations for 165M+ users</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>SEO & Marketing Integration</CardTitle>
                <CardDescription>Product roadmaps with marketing strategy</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle>Agile & Strategic Management</CardTitle>
                <CardDescription>MBA + Level 7 Strategic Management</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Connect CTA */}
        <section className="text-center">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Interested in discussing international team leadership, product strategy, or digital transformation?
              I'd love to share insights from my 8+ years of experience at adidas Digital Sports and fintech startups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/about">Learn About My Experience</Link>
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Based in Volterra, Italy • Available for consulting and collaboration
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
