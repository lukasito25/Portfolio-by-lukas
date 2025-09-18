'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackChatbotInteraction } from '@/lib/analytics'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content:
      "Hi! I'm Lukas's AI assistant. I can help you learn more about his experience, skills, and approach to product management. What would you like to know?",
    role: 'assistant',
    timestamp: new Date(),
  },
]

const PREDEFINED_RESPONSES: Record<string, string> = {
  experience:
    "Lukas has 10+ years of product management experience, leading teams at companies like TechCorp Inc. and GrowthTech Solutions. He's launched 15+ products and generated over $50M in revenue.",
  skills:
    "His core skills include product strategy, AI/ML integration, data analytics, cross-functional leadership, and technical architecture. He's particularly strong in data-driven decision making and growth optimization.",
  ai: "Lukas specializes in AI-powered product strategy, leveraging machine learning to identify market opportunities and build intelligent features. He's led teams to integrate AI that improved user engagement by 340%.",
  leadership:
    'Lukas believes in people-first leadership, creating psychological safety and clear communication. He focuses on evidence-based decisions and impact-driven execution, aligning teams around clear metrics and business objectives.',
  contact:
    "You can reach out to Lukas through the contact form on this website, or connect with him on LinkedIn. He's always open to discussing product strategy, AI implementation, or potential collaborations.",
  projects:
    "Some of Lukas's notable projects include building a B2B SaaS platform from 0 to $2M ARR, leading AI integration that reduced churn by 45%, and implementing analytics frameworks that drove 340% engagement growth.",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    // Check for keywords in the message
    if (
      message.includes('experience') ||
      message.includes('background') ||
      message.includes('career')
    ) {
      return PREDEFINED_RESPONSES.experience
    }
    if (
      message.includes('skill') ||
      message.includes('expertise') ||
      message.includes('competenc')
    ) {
      return PREDEFINED_RESPONSES.skills
    }
    if (
      message.includes('ai') ||
      message.includes('ml') ||
      message.includes('machine learning') ||
      message.includes('artificial intelligence')
    ) {
      return PREDEFINED_RESPONSES.ai
    }
    if (
      message.includes('leadership') ||
      message.includes('manage') ||
      message.includes('team') ||
      message.includes('philosophy')
    ) {
      return PREDEFINED_RESPONSES.leadership
    }
    if (
      message.includes('contact') ||
      message.includes('reach') ||
      message.includes('connect') ||
      message.includes('hire')
    ) {
      return PREDEFINED_RESPONSES.contact
    }
    if (
      message.includes('project') ||
      message.includes('work') ||
      message.includes('portfolio') ||
      message.includes('case study')
    ) {
      return PREDEFINED_RESPONSES.projects
    }

    // Default responses
    const defaultResponses = [
      "That's a great question! Lukas has extensive experience in product management, particularly in AI/ML integration and data-driven decision making. Would you like to know more about his specific skills or experience?",
      "I'd be happy to help you learn more about Lukas! You can ask me about his experience, skills, leadership approach, AI expertise, or notable projects. What interests you most?",
      'Lukas specializes in bridging the gap between technical complexity and business value. Feel free to ask about his approach to product strategy, team leadership, or specific achievements!',
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Track the user message
    trackChatbotInteraction('message_sent', input)

    // Simulate API delay
    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(input),
          role: 'assistant',
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      },
      1000 + Math.random() * 1000
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          trackChatbotInteraction('open')
        }}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">
          Chat with Lukas&apos;s AI Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false)
            trackChatbotInteraction('close')
          }}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-3 space-y-3">
        <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[200px] px-3 py-2 rounded-lg text-sm',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                )}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Ask about Lukas..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-2"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
