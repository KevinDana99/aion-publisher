import { NextResponse } from 'next/server'
import { getClientId, getRedirectUri, setVerifyToken as setAppVerifyToken } from '@/lib/instagram/app-config'

export async function GET() {
  const clientId = getClientId()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    clientId: clientId || '',
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
    
    const response = NextResponse.json({ success: true })
    response.cookies.set('ig_verify_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
