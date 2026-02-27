import { NextResponse } from 'next/server'
import { getAppId, getRedirectUri } from '@/lib/facebook/app-config'
import { setFacebookVerifyToken } from '@/lib/credentials/tokens'

export async function GET() {
  const appId = getAppId()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    appId: appId || '',
    redirectUri: redirectUri || ''
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { verifyToken: token } = body
    
    if (token) {
      await setFacebookVerifyToken(token)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
