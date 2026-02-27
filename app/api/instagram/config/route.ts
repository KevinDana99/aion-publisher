import { NextResponse } from 'next/server'
import { setInstagramAppConfig, getInstagramAppConfig } from '@/lib/instagram/app-config'

export async function GET() {
  const config = await getInstagramAppConfig()
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/instagram` : ''
  
  return NextResponse.json({
    clientId: config.clientId || '',
    clientSecret: config.clientSecret || '',
    verifyToken: config.verifyToken || '',
    redirectUri: redirectUri || ''
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { clientId, clientSecret, verifyToken, redirectUri } = body
    
    await setInstagramAppConfig({
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      verifyToken: verifyToken || '',
      redirectUri: redirectUri || ''
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
