import { NextResponse } from 'next/server'
import { getAppConfig, saveAppConfig } from '@/lib/instagram/app-config'

export async function GET() {
  try {
    const config = getAppConfig()
    return NextResponse.json({
      clientId: config.clientId,
      clientSecret: config.clientSecret ? '***' : '',
      verifyToken: config.verifyToken ? '***' : '',
      redirectUri: config.redirectUri
    })
  } catch (error) {
    console.error('Error getting config:', error)
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId, clientSecret, verifyToken, redirectUri } = body

    const config = saveAppConfig({
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      verifyToken: verifyToken || '',
      redirectUri: redirectUri || ''
    })

    return NextResponse.json({
      success: true,
      clientId: config.clientId,
      redirectUri: config.redirectUri
    })
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
