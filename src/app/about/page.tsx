import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Portfolio',
  description: 'Learn more about my background, skills, and experience.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>
            Welcome to my about page. This is where I share my journey, skills,
            and passion for web development.
          </p>
          <p>
            I&apos;m a passionate developer with expertise in modern web
            technologies, always eager to learn and create amazing digital
            experiences.
          </p>
        </div>
      </div>
    </div>
  )
}
