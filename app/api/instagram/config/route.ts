import { NextResponse } from 'next/server'
import { getClientId, getVerifyToken, getRedirectUri } from '@/lib/instagram/app-config'

export async function GET() {
  const clientId = getClientId()
  const verifyToken = getVerifyToken()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    clientId: clientId || '',
    verifyToken: verifyToken ? '***' : '',
    redirectUri: redirectUri || ''
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { verifyToken: token } = body
    
    if (token) {
      const { setVerifyToken } = await import('@/lib/instagram/app-config')
      setVerifyToken(token)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
