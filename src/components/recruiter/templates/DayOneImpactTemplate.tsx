interface DayOneImpactTemplateProps {
  page: any
}

export function DayOneImpactTemplate({ page }: DayOneImpactTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Day-One Impact Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">for {page.companyName}</p>
          <div className="bg-green-100 border border-green-200 rounded-lg p-8">
            <p className="text-green-800">
              This template will showcase immediate actions and 30/60/90 day
              impact plans. Coming soon - this template is currently under
              development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
