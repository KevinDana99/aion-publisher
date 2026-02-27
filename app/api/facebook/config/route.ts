import { NextResponse } from 'next/server'
import { getAppId, getAppSecret, getVerifyToken, getRedirectUri } from '@/lib/facebook/app-config'

export async function GET() {
  const appId = getAppId()
  const appSecret = getAppSecret()
  const verifyToken = getVerifyToken()
  const redirectUri = getRedirectUri()
  
  return NextResponse.json({
    appId: appId || '',
    appSecret: appSecret ? '***' : '',
    verifyToken: verifyToken ? '***' : '',
    redirectUri: redirectUri || ''
  })
}

export async function POST() {
  return NextResponse.json({
    error: 'Config is now read-only. Set environment variables in Vercel.',
    appId: getAppId() || '',
    redirectUri: getRedirectUri() || ''
  }, { status: 400 })
}
