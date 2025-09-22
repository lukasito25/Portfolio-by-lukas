import { NextResponse } from 'next/server'

export async function GET() {
  // Debug environment variables in production
  const debug = {
    nodeEnv: process.env.NODE_ENV,
    useApi: process.env.NEXT_PUBLIC_USE_API,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasApiSecret: !!process.env.API_SECRET,
    apiUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://portfolio-api.hosala-lukas.workers.dev',
    isDevelopment: process.env.NODE_ENV === 'development',
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(debug)
}
