import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    portfolio: 'Lukas Portfolio - Professional Product Manager',
  })
}
