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
    console.log('[Instagram Config] Received form data:', JSON.stringify(body))
    
    const { clientId, clientSecret, verifyToken, redirectUri } = body
    
    console.log('[Instagram Config] Saving to Redis - clientId:', clientId ? 'yes' : 'no', 'clientSecret:', clientSecret ? 'yes' : 'no', 'verifyToken:', verifyToken)
    
    await setInstagramAppConfig({
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      verifyToken: verifyToken || '',
      redirectUri: redirectUri || ''
    })
    
    // Verify it was saved
    const saved = await getInstagramAppConfig()
    console.log('[Instagram Config] Verified in Redis:', JSON.stringify(saved))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Instagram Config] Error:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
