import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work - Portfolio',
  description: 'Explore my latest projects and technical achievements.',
}

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Work</h1>
        <div className="grid gap-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Here you&apos;ll find a showcase of my latest projects,
            demonstrating my skills in web development, design, and
            problem-solving.
          </p>
          {/* Project grid will be added here */}
        </div>
      </div>
    </div>
  )
}
