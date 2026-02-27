import { NextRequest, NextResponse } from 'next/server'
import { getAppConfig, saveAppConfig } from '@/lib/facebook/app-config'

export async function GET() {
  try {
    const config = getAppConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error getting Facebook config:', error)
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appId, appSecret, verifyToken, redirectUri } = body

    const config = saveAppConfig({
      appId: appId || '',
      appSecret: appSecret || '',
      verifyToken: verifyToken || '',
      redirectUri: redirectUri || ''
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error saving Facebook config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
