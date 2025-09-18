import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Portfolio',
  description: 'Read my thoughts on web development, technology, and more.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="space-y-8">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome to my blog where I share insights about web development,
            emerging technologies, and my journey as a developer.
          </p>
          {/* Blog posts will be added here */}
        </div>
      </div>
    </div>
  )
}
