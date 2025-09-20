import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills & Expertise | Lukas Hosala',
  description:
    '8+ years of product management expertise across digital platforms, team leadership, and strategic implementation.',
  keywords: [
    'Product Management',
    'Team Leadership',
    'Digital Strategy',
    'Agile',
    'Strategic Management',
  ],
}

export default function SkillsPage() {
  const skillCategories = [
    {
      title: 'Product Management',
      icon: '🎯',
      skills: [
        { name: 'Product Strategy', level: 95 },
        { name: 'Roadmap Planning', level: 92 },
        { name: 'User Research & Analytics', level: 88 },
        { name: 'A/B Testing & Optimization', level: 85 },
        { name: 'Market Analysis', level: 90 },
        { name: 'Feature Prioritization', level: 95 },
      ],
    },
    {
      title: 'Leadership & Management',
      icon: '👥',
      skills: [
        { name: 'Team Leadership (13+ people)', level: 95 },
        { name: 'Cross-functional Collaboration', level: 92 },
        { name: 'Stakeholder Management', level: 90 },
        { name: 'International Team Coordination', level: 88 },
        { name: 'Freelancer Management', level: 85 },
        { name: 'Performance Management', level: 90 },
      ],
    },
    {
      title: 'Technical & Development',
      icon: '⚙️',
      skills: [
        { name: 'API Integration & Management', level: 85 },
        { name: 'Tech Stack Modernization', level: 82 },
        { name: 'Database Management', level: 78 },
        { name: 'System Architecture Planning', level: 80 },
        { name: 'Development Process Optimization', level: 88 },
        { name: 'Quality Assurance Oversight', level: 85 },
      ],
    },
    {
      title: 'Digital Marketing & SEO',
      icon: '📈',
      skills: [
        { name: 'SEO Strategy & Implementation', level: 90 },
        { name: 'Content Strategy', level: 85 },
        { name: 'Digital Campaign Management', level: 88 },
        { name: 'Analytics & Reporting', level: 92 },
        { name: 'Social Commerce Integration', level: 85 },
        { name: 'Performance Marketing', level: 82 },
      ],
    },
    {
      title: 'Business & Strategy',
      icon: '💼',
      skills: [
        { name: 'Strategic Planning', level: 95 },
        { name: 'Business Development', level: 88 },
        { name: 'Financial Modeling', level: 80 },
        { name: 'Risk Management', level: 85 },
        { name: 'International Market Expansion', level: 90 },
        { name: 'Competitive Analysis', level: 92 },
      ],
    },
    {
      title: 'Frameworks & Methodologies',
      icon: '🔄',
      skills: [
        { name: 'Agile/Scrum', level: 95 },
        { name: 'Design Thinking', level: 88 },
        { name: 'Lean Startup', level: 85 },
        { name: 'OKRs & KPI Management', level: 92 },
        { name: 'GDPR Compliance', level: 85 },
        { name: 'Strategic Management', level: 95 },
      ],
    },
  ]

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-green-500 to-emerald-600'
    if (level >= 80) return 'from-blue-500 to-indigo-600'
    if (level >= 70) return 'from-purple-500 to-violet-600'
    return 'from-orange-500 to-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            My Skills
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive toolkit built through 8+ years of product management
            experience, leading international teams and scaling digital
            platforms for 165M+ users
          </p>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getSkillColor(skill.level)} transition-all duration-500`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Summary */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Experience Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">8+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Years Experience
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">165M+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Users Served
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">13</div>
              <div className="text-gray-600 dark:text-gray-300">
                Max Team Size
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
