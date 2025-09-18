import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  TrendingUp,
  Users,
  Brain,
  Target,
  BarChart3,
  Lightbulb,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full mb-4">
              Senior Product Manager • Technical Leader • AI Strategist
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300">
            Driving Product Innovation Through Data & Technology
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Transforming complex technical challenges into user-centric
            solutions that scale. I've led cross-functional teams to deliver
            products that increased user engagement by
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {' '}
              340%
            </span>{' '}
            and reduced customer acquisition costs by{' '}
            <span className="font-semibold text-green-600 dark:text-green-400">
              65%
            </span>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/work">
                View Case Studies <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Let's Build Together</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                15+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Products Launched
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                $50M+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Revenue Generated
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                2M+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Users Impacted
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                95%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Team Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Strategic Product Leadership
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12 max-w-3xl mx-auto">
            Bridging the gap between business strategy and technical execution
            with deep expertise in AI/ML, data analytics, and modern development
            practices.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>AI-Powered Product Strategy</CardTitle>
                <CardDescription>
                  Leveraging machine learning and AI to identify market
                  opportunities, optimize user experiences, and build
                  intelligent features that scale.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Data-Driven Decision Making</CardTitle>
                <CardDescription>
                  Building robust analytics frameworks and experimentation
                  platforms to validate hypotheses and measure product impact
                  with precision.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Cross-Functional Leadership</CardTitle>
                <CardDescription>
                  Orchestrating engineering, design, marketing, and sales teams
                  to deliver cohesive product experiences that exceed user
                  expectations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Market Strategy & Positioning</CardTitle>
                <CardDescription>
                  Conducting deep market research and competitive analysis to
                  identify white space opportunities and develop winning
                  go-to-market strategies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Growth & Optimization</CardTitle>
                <CardDescription>
                  Implementing systematic growth frameworks, from acquisition
                  funnels to retention strategies, with a focus on sustainable,
                  profitable growth.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle>Innovation & Future Vision</CardTitle>
                <CardDescription>
                  Staying ahead of technology trends and emerging markets to
                  build products that not only meet today's needs but anticipate
                  tomorrow's.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Product Vision?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Whether you're launching a new product, scaling existing solutions,
            or integrating AI capabilities, I bring the strategic thinking and
            technical expertise to turn ambitious ideas into market-leading
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Schedule a Strategy Call</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn About My Approach</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
