'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  ArrowRight,
  Calculator,
  Download,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface CompanyMirrorTemplateProps {
  page: {
    id: string
    companyName: string
    roleName?: string
    roleLevel?: string
    companySize?: string
    industry?: string
    customContent?: any
    companyInfo?: any
    challenges?: any
    solutions?: any
  }
}

export function CompanyMirrorTemplate({ page }: CompanyMirrorTemplateProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [roiCalculatorOpen, setRoiCalculatorOpen] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Default content structure
  const challenges = page.challenges || [
    {
      title: 'Product-Market Fit Optimization',
      description:
        'Struggling to identify the highest-impact features that drive user retention and expansion revenue.',
      impact: 'High',
      urgency: 'Critical',
    },
    {
      title: 'Cross-Functional Team Alignment',
      description:
        'Engineering, Design, and Marketing teams working in silos, leading to conflicting priorities and delayed releases.',
      impact: 'High',
      urgency: 'High',
    },
    {
      title: 'Data-Driven Decision Making',
      description:
        'Limited product analytics infrastructure making it difficult to measure feature success and user behavior.',
      impact: 'Medium',
      urgency: 'High',
    },
  ]

  const solutions = page.solutions || [
    {
      title: 'Strategic Product Roadmap',
      description:
        'Develop a data-driven product strategy aligned with business objectives and user needs.',
      timeframe: '30 days',
      impact: '15-25% increase in user engagement',
    },
    {
      title: 'Cross-Functional Process Framework',
      description:
        'Implement agile methodologies and communication protocols to break down silos.',
      timeframe: '60 days',
      impact: '40% reduction in time-to-market',
    },
    {
      title: 'Analytics & Measurement System',
      description:
        'Deploy comprehensive product analytics to track KPIs and optimize user experience.',
      timeframe: '90 days',
      impact: '30% improvement in feature adoption',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-8 h-8 text-blue-400" />
              <span className="text-blue-400 font-semibold text-lg">
                {page.companyName}
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Strategic Product Leadership
              <br />
              <span className="text-blue-400">
                Tailored for {page.companyName}
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              A comprehensive proposal from Lukas Hosala demonstrating how
              strategic product management can accelerate {page.companyName}'s
              growth through proven methodologies that have scaled platforms to
              165M+ users and managed 13+ cross-functional teams.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Mail className="w-5 h-5 mr-2" />
                Schedule Discussion
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Executive Summary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Intelligence Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Understanding {page.companyName}'s Landscape
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Based on comprehensive research into your industry position,
            competitive landscape, and growth trajectory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-lg">Company Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry:</span>
                  <Badge variant="secondary">
                    {page.industry || 'Technology'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Size:</span>
                  <span className="font-medium">
                    {page.companySize || '500-1000'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Stage:</span>
                  <span className="font-medium">Scale-Up</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <CardTitle className="text-lg">Market Position</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share:</span>
                  <span className="font-medium text-green-600">Growing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competitive Edge:</span>
                  <span className="font-medium">Innovation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-medium text-green-600">+45% YoY</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                <CardTitle className="text-lg">Strategic Goals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Market Expansion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Product Innovation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Team Scalability</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Analysis */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Identified Strategic Challenges
          </h3>

          <div className="space-y-4">
            {challenges.map((challenge: any, index: number) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader
                  onClick={() => toggleSection(`challenge-${index}`)}
                  className="pb-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {challenge.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            variant={
                              challenge.impact === 'High'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {challenge.impact} Impact
                          </Badge>
                          <Badge
                            variant={
                              challenge.urgency === 'Critical'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {challenge.urgency} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {expandedSection === `challenge-${index}` ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </CardHeader>

                {expandedSection === `challenge-${index}` && (
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      {challenge.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Solutions Framework */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Proposed Solutions & Impact
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((solution: any, index: number) => (
              <Card
                key={index}
                className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{solution.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {solution.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Timeline:</span>
                      </div>
                      <Badge variant="outline">{solution.timeframe}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">
                          Expected Impact:
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium pl-6">
                      {solution.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ROI Calculator Section */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Calculator className="w-6 h-6" />
              ROI Calculator: Investment in Strategic Product Leadership
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Calculate the potential return on investment for strategic product
              management
            </p>
          </CardHeader>

          <CardContent className="text-center">
            <Button
              size="lg"
              onClick={() => setRoiCalculatorOpen(!roiCalculatorOpen)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calculator className="w-5 h-5 mr-2" />
              {roiCalculatorOpen ? 'Hide Calculator' : 'Open Calculator'}
            </Button>

            {roiCalculatorOpen && (
              <div className="mt-8 p-6 bg-white rounded-lg border max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Potential Benefits (Annual)
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Revenue Growth (15%):
                        </span>
                        <span className="font-medium text-green-600">
                          $2.5M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Cost Reduction (25%):
                        </span>
                        <span className="font-medium text-green-600">
                          $800K
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Time to Market (40% faster):
                        </span>
                        <span className="font-medium text-green-600">
                          $1.2M
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Investment Comparison
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Strategic PM Hire:
                        </span>
                        <span className="font-medium">$180K/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Potential ROI:</span>
                        <span className="font-medium text-green-600">
                          2,450%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payback Period:</span>
                        <span className="font-medium text-blue-600">
                          1.5 months
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform {page.companyName}'s Product Strategy?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how these strategic initiatives can be implemented
              to drive measurable growth and competitive advantage.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule 30-Min Strategy Call
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>

            <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">165M+</div>
                <div className="text-sm text-gray-400">Users Scaled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">13+</div>
                <div className="text-sm text-gray-400">Teams Led</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">40%</div>
                <div className="text-sm text-gray-400">
                  Avg Time-to-Market Improvement
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
