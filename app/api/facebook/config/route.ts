import { NextResponse } from 'next/server'
import { getAppId, getVerifyToken, getRedirectUri, setVerifyToken as setAppVerifyToken } from '@/lib/facebook/app-config'

export async function GET() {
  const appId = getAppId()
  const verifyToken = getVerifyToken()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    appId: appId || '',
    verifyToken: verifyToken ? '***' : '',
    redirectUri: redirectUri || ''
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { verifyToken: token } = body
    
    if (token) {
      setAppVerifyToken(token)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
