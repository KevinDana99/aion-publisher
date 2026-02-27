import { NextResponse } from 'next/server'
import { getClientId, getClientSecret, getVerifyToken, getRedirectUri } from '@/lib/instagram/app-config'

export async function GET() {
  const clientId = getClientId()
  const clientSecret = getClientSecret()
  const verifyToken = getVerifyToken()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    clientId: clientId || '',
    clientSecret: clientSecret ? '***' : '',
    verifyToken: verifyToken ? '***' : '',
    redirectUri: redirectUri || ''
  })
}

export async function POST() {
  return NextResponse.json({
    error: 'Config is now read-only. Set environment variables in Vercel.',
    clientId: getClientId() || '',
    redirectUri: getRedirectUri() || ''
  }, { status: 400 })
}
