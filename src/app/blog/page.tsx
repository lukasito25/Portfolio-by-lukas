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
  title: 'Product Management Insights - Leadership Blog',
  description:
    'Strategic insights on product management, AI integration, team leadership, and building products that scale. Practical advice from a seasoned PM.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Product Leadership Insights
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Strategic thinking, technical insights, and practical lessons from
            building products that users love and businesses depend on. Join
            10,000+ product professionals who read my weekly insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Subscribe to Weekly Insights</Button>
            <Button variant="outline" size="lg">
              View All Posts
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
                  The AI Product Manager's Playbook: From Strategy to Execution
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  A comprehensive guide to building AI-powered products that
                  deliver real business value. Learn how to navigate technical
                  complexity, manage stakeholder expectations, and measure
                  success in the age of machine learning.
                </p>
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>December 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>12 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>2.3K views</span>
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
                        • How to build AI features that users actually want
                      </li>
                      <li>• Managing technical debt in ML-powered products</li>
                      <li>
                        • Measuring success beyond traditional product metrics
                      </li>
                      <li>
                        • Building data-driven feedback loops for AI products
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
                  <span>December 8, 2024</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Building Cross-Functional Teams That Actually Work
                </CardTitle>
                <CardDescription className="text-base">
                  The practical guide to creating high-performing product teams
                  across engineering, design, and business.
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
                  The Product-Market Fit Framework for B2B SaaS
                </CardTitle>
                <CardDescription className="text-base">
                  A systematic approach to finding and measuring product-market
                  fit in complex B2B environments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Product-market fit in B2B is different from B2C. Here's a
                  framework I've used to achieve PMF for three different B2B
                  products, including the metrics that actually matter.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Product Strategy</Badge>
                    <Badge variant="outline">B2B SaaS</Badge>
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
                  Why Most A/B Tests Fail (And How to Fix Them)
                </CardTitle>
                <CardDescription className="text-base">
                  Common mistakes that invalidate your experiments and a
                  checklist for running tests that actually matter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  85% of A/B tests I've reviewed had fundamental flaws that made
                  their results meaningless. Here's how to avoid the most common
                  pitfalls and build a testing culture that drives real growth.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Data Analysis</Badge>
                    <Badge variant="outline">Growth</Badge>
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
                  From 0 to Product-Market Fit: The Complete Playbook
                </CardTitle>
                <CardDescription className="text-base">
                  Step-by-step guide to building your first product, from
                  initial hypothesis to sustainable growth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  I've taken three products from idea to PMF. This playbook
                  covers the frameworks, processes, and mindset shifts that made
                  the difference between failure and breakthrough success.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">0→1 Products</Badge>
                    <Badge variant="outline">Startup</Badge>
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
            Popular Topics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>AI & Product Management</CardTitle>
                <CardDescription>12 articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Team Leadership</CardTitle>
                <CardDescription>8 articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Growth Strategy</CardTitle>
                <CardDescription>15 articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Product Strategy</CardTitle>
                <CardDescription>18 articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Data & Analytics</CardTitle>
                <CardDescription>10 articles</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle>Innovation</CardTitle>
                <CardDescription>7 articles</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="text-center">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Join 10,000+ product leaders who get my weekly insights on
              building products that matter. Real strategies, practical
              frameworks, and lessons learned from the trenches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Subscribe to Weekly Insights</Button>
              <Button variant="outline" size="lg">
                Browse Archive
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
