import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Portfolio',
  description: 'Get in touch with me for opportunities and collaborations.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Get In Touch</h1>
        <div className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            I&apos;m always interested in hearing about new opportunities and
            interesting projects. Let&apos;s connect!
          </p>
          {/* Contact form will be added here */}
        </div>
      </div>
    </div>
  )
}
