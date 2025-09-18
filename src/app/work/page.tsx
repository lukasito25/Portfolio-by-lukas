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
  ArrowUpRight,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Brain,
  Globe,
  Smartphone,
  Building2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Case Studies - Product Leadership Portfolio',
  description:
    'Detailed case studies showcasing strategic product management, technical leadership, and measurable business impact across diverse industries.',
}

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Product Leadership in Action
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Explore detailed case studies that demonstrate how strategic
            thinking, technical expertise, and user-centered design come
            together to create products that drive real business impact.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">B2B SaaS</Badge>
            <Badge variant="secondary">AI/ML Products</Badge>
            <Badge variant="secondary">Mobile Apps</Badge>
            <Badge variant="secondary">Enterprise Solutions</Badge>
            <Badge variant="secondary">0→1 Products</Badge>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Featured Case Study
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  AI-Powered Analytics Platform: From Concept to $15M ARR
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  Led the complete product development of an AI-driven analytics
                  platform that transformed how enterprise clients understand
                  their data. Through strategic ML implementation and
                  user-centric design, we achieved 340% increase in user
                  engagement and 65% reduction in CAC.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">340% Engagement Growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">65% CAC Reduction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">$15M ARR</span>
                  </div>
                </div>
                <Button size="lg" className="group">
                  View Full Case Study
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Enterprise clients struggled with fragmented data insights
                      and manual reporting processes, leading to delayed
                      decision-making and missed opportunities.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Built an AI-powered analytics platform with predictive
                      capabilities, automated insights generation, and intuitive
                      visualization tools.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Reduced time-to-insight by 85%, increased user engagement
                      by 340%, and generated $15M in new annual recurring
                      revenue.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">More Case Studies</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Each project represents a unique challenge solved through
              strategic product thinking and technical execution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Case Study 2: Mobile App */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  Mobile-First B2C Product Launch
                </CardTitle>
                <CardDescription className="text-base">
                  From 0→1 Mobile App • Consumer Finance • 2019-2021
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Launched a mobile-first personal finance app that achieved
                  100K+ downloads in first 6 months. Led product strategy, user
                  research, and cross-platform development coordination.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      100K+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Downloads
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      4.8/5
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      App Rating
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Mobile Strategy</Badge>
                  <Badge variant="outline">UX Research</Badge>
                  <Badge variant="outline">Growth Marketing</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 3: Enterprise SaaS */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  Enterprise Workflow Automation
                </CardTitle>
                <CardDescription className="text-base">
                  B2B SaaS Platform • Enterprise • 2020-2022
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Redesigned enterprise workflow platform serving 50+ Fortune
                  500 companies. Improved user efficiency by 60% and reduced
                  customer support tickets by 40% through better UX design.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                      60%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Efficiency Gain
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                      50+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Enterprise Clients
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Enterprise UX</Badge>
                  <Badge variant="outline">Workflow Design</Badge>
                  <Badge variant="outline">Customer Success</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 4: AI Integration */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  AI-Powered Content Personalization
                </CardTitle>
                <CardDescription className="text-base">
                  Machine Learning Integration • EdTech • 2021-2023
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Integrated ML-driven personalization engine that improved
                  learning outcomes by 45% and increased user session duration
                  by 120% through adaptive content delivery.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      45%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Better Outcomes
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      120%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Session Increase
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Machine Learning</Badge>
                  <Badge variant="outline">Personalization</Badge>
                  <Badge variant="outline">EdTech</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 5: Global Platform */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  Global Marketplace Expansion
                </CardTitle>
                <CardDescription className="text-base">
                  International Growth • E-commerce • 2018-2020
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Led international expansion of e-commerce platform to 15 new
                  markets. Developed localization strategy that increased global
                  revenue by 200% while maintaining product consistency.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-red-600 dark:text-red-400">
                      15
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      New Markets
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      200%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Revenue Growth
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">International</Badge>
                  <Badge variant="outline">Localization</Badge>
                  <Badge variant="outline">Market Entry</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-16">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                My Product Development Process
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                A systematic approach that combines user research, data
                analysis, and technical expertise to build products that users
                love and businesses rely on.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Discovery</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deep user research, market analysis, and problem validation
                  through interviews and data analysis.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Strategy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Define clear objectives, success metrics, and roadmap
                  priorities based on business goals and user needs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Execution</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Iterative development with continuous testing, feedback loops,
                  and cross-functional collaboration.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Optimization</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Data-driven iteration, A/B testing, and continuous improvement
                  based on user behavior and business metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Let's Build Your Next Success Story
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Ready to transform your product vision into measurable business
              impact? I'd love to discuss how my strategic approach and
              technical expertise can help your team succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Schedule a Strategy Call</Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn About My Process</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
