import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProjectCarousel } from '@/components/ui/project-carousel'
import {
  ArrowRight,
  TrendingUp,
  Users,
  Brain,
  Target,
  BarChart3,
  Lightbulb,
  Sparkles,
  Rocket,
  Star,
  Zap,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Cosmic Background */}
      <section className="relative py-32 overflow-hidden">
        {/* Cosmic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent)] cosmic-pulse"></div>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent)] cosmic-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="mb-8 cosmic-float">
            <span className="inline-flex items-center px-6 py-3 bg-white/70 backdrop-blur-sm border border-purple-200 text-purple-800 text-sm font-medium rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Senior Product Manager • Technical Leader • AI Strategist
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="gradient-text cosmic-glow">
              Driving Product Innovation
            </span>
            <br />
            <span className="text-gray-900">Through Data & Technology</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transforming complex technical challenges into user-centric
            solutions that scale. I&apos;ve led cross-functional teams to
            deliver products that increased user engagement by{' '}
            <span className="font-bold text-purple-600 cosmic-pulse">340%</span>{' '}
            and reduced customer acquisition costs by{' '}
            <span className="font-bold text-green-600 cosmic-pulse">65%</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              asChild
              size="lg"
              className="cosmic-button text-white border-0 px-8 py-4 text-lg"
            >
              <Link href="/work">
                <Rocket className="mr-2 h-5 w-5" />
                View Case Studies
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 py-4 text-lg border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Link href="/contact">
                <Zap className="mr-2 h-5 w-5" />
                Let&apos;s Build Together
              </Link>
            </Button>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                value: '15+',
                label: 'Products Launched',
                icon: <Rocket className="w-6 h-6" />,
                color: 'text-blue-600',
              },
              {
                value: '$50M+',
                label: 'Revenue Generated',
                icon: <TrendingUp className="w-6 h-6" />,
                color: 'text-green-600',
              },
              {
                value: '2M+',
                label: 'Users Impacted',
                icon: <Users className="w-6 h-6" />,
                color: 'text-purple-600',
              },
              {
                value: '95%',
                label: 'Team Satisfaction',
                icon: <Star className="w-6 h-6" />,
                color: 'text-orange-600',
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-2xl cosmic-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`flex justify-center mb-3 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Carousel Section */}
      <section className="py-24 bg-gray-50">
        <ProjectCarousel />
      </section>

      {/* Core Competencies */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core <span className="gradient-text">Competencies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A unique blend of strategic product thinking, technical depth, and
              leadership experience that drives measurable business outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-Powered Product Strategy',
                description:
                  'Leveraging machine learning and data science to build intelligent products that adapt and evolve with user behavior.',
                color: 'from-purple-500 to-blue-500',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Data-Driven Decision Making',
                description:
                  'Converting complex analytics into actionable insights that drive 40%+ improvements in key product metrics.',
                color: 'from-blue-500 to-teal-500',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Cross-Functional Leadership',
                description:
                  'Building and scaling high-performing teams across engineering, design, marketing, and data science disciplines.',
                color: 'from-teal-500 to-green-500',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Market Strategy & Positioning',
                description:
                  'Identifying market opportunities and positioning products for maximum competitive advantage and growth.',
                color: 'from-green-500 to-yellow-500',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Growth & Optimization',
                description:
                  'Implementing growth frameworks that consistently deliver 200%+ user acquisition and retention improvements.',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Innovation & Future Vision',
                description:
                  'Anticipating market trends and building products that define the next generation of user experiences.',
                color: 'from-orange-500 to-red-500',
              },
            ].map((competency, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 cosmic-float border-0 bg-white/70 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${competency.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {competency.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {competency.title}
                  </CardTitle>
                </CardHeader>
                <CardDescription className="text-gray-600 leading-relaxed px-6 pb-6">
                  {competency.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Let&apos;s discuss how we can transform your product vision into
            reality. From strategy to execution, I bring the expertise to drive
            meaningful results.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/contact" className="flex items-center">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start a Conversation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <Link href="/about" className="flex items-center">
                Learn More About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
