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
  title: 'Work & Case Studies - Lukas Hosala | Senior Product Manager',
  description:
    'Real case studies from 8+ years at adidas Digital Sports and fintech startups. Product management experience serving 165M+ users globally.',
}

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Real Projects, Real Impact
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Explore authentic case studies from my 8+ years in product management at adidas Digital Sports,
            fintech startups, and international teams. Real projects serving 165M+ users globally.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Digital Sports</Badge>
            <Badge variant="secondary">FinTech</Badge>
            <Badge variant="secondary">Website Redesigns</Badge>
            <Badge variant="secondary">Team Leadership</Badge>
            <Badge variant="secondary">International Teams</Badge>
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
                  adidas Runtastic Website Redesign: Serving 165M+ Global Users
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                  Led the comprehensive website redesign and technology stack migration for adidas Digital Sports.
                  Managed cross-functional teams across multiple locations to deliver rebranded content, new tech stack,
                  and integrated SEO marketing strategy for one of the world's largest fitness platforms.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">165M+ Global Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-medium">13-Person Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Multiple Locations</span>
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
                      Complete website redesign and migration to new technology stack for adidas Digital Sports,
                      while maintaining service for 165M+ global users and ensuring zero downtime during the transition.
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
                      Led cross-functional teams across multiple locations, coordinated rebranded content delivery,
                      managed technical migration, and implemented integrated SEO marketing strategies.
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
                      Successfully launched new platform serving 165M+ users globally, improved site performance,
                      enhanced SEO visibility, and delivered seamless user experience migration.
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
            <h2 className="text-3xl font-bold mb-4">Additional Projects</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Real projects from my experience at adidas International Marketing B.V.,
              StagStrat, and enterprise product management roles.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Case Study 2: StagStrat */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  StagStrat Algorithmic Trading Platform
                </CardTitle>
                <CardDescription className="text-base">
                  Head of Product • FinTech Startup • 2022-Present
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Orchestrated complete product lifecycle for algorithmic trading startup.
                  Led website launch, product roadmap creation, and SEO optimization
                  strategy for revolutionary trading solutions.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-green-600 dark:text-green-400">
                      100%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Platform Launch
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      12mo
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Time to Market
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Product Strategy</Badge>
                  <Badge variant="outline">SEO Marketing</Badge>
                  <Badge variant="outline">FinTech</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Case Study 3: adidas Admin Portal */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
                <CardTitle className="text-xl">
                  adidas Internal Admin Portal
                </CardTitle>
                <CardDescription className="text-base">
                  Enterprise Software • adidas • 2022-2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Product lifecycle management for adidas internal administration portal.
                  Enhanced operational efficiency and user experience for internal
                  stakeholders across global teams.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                      1000+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Internal Users
                    </div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                      25+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Countries
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Enterprise Software</Badge>
                  <Badge variant="outline">Global Teams</Badge>
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
