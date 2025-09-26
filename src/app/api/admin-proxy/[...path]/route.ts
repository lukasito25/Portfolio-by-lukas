/**
 * Admin API Proxy
 * Proxies admin requests to Cloudflare API with server-side authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'
const API_SECRET = process.env.API_SECRET

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'GET', params.path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'POST', params.path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'PUT', params.path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'DELETE', params.path)
}

async function handleRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!API_SECRET) {
      console.error('API_SECRET not found in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Build the API path
    const apiPath = '/' + pathSegments.join('/')
    const url = `${API_BASE_URL}${apiPath}`

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_SECRET}`,
    }

    // Get request body if present
    let body
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text()
      } catch (error) {
        // No body is fine
      }
    }

    // Make the request to Cloudflare API
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || `HTTP ${response.status}` },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error('Admin proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
