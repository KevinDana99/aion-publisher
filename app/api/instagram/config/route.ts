import { NextResponse } from 'next/server'
import { getClientId, getRedirectUri } from '@/lib/instagram/app-config'
import { setInstagramVerifyToken } from '@/lib/credentials/tokens'

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
      await setInstagramVerifyToken(token)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
