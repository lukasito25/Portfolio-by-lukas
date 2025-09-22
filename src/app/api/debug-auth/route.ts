import { NextResponse } from 'next/server'
import { dataService } from '@/lib/data-service'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Debug the authentication process
    const serviceInfo = await dataService.getServiceInfo()

    // Attempt authentication with detailed logging
    console.log('Auth attempt:', { email, serviceInfo })

    const user = await dataService.verifyAdminCredentials(email, password)

    return NextResponse.json({
      success: !!user,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      serviceInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
