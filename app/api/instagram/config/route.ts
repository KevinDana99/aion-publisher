import { NextRequest, NextResponse } from 'next/server'
import { setInstagramAppConfig, getInstagramAppConfig } from '@/lib/instagram/app-config'

export async function GET(request: NextRequest) {
  const config = await getInstagramAppConfig()
  const { protocol, host } = request.nextUrl
  const redirectUri = `${protocol}//${host}/api/auth/callback/instagram`
  
  return NextResponse.json({
    clientId: config.clientId || '',
    clientSecret: config.clientSecret || '',
    verifyToken: config.verifyToken || '',
    redirectUri: redirectUri
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
