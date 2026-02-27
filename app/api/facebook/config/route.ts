import { NextResponse } from 'next/server'
import { setFacebookAppConfig, getFacebookAppConfig } from '@/lib/facebook/app-config'

export async function GET() {
  const config = await getFacebookAppConfig()
  
  return NextResponse.json({
    appId: config.appId || '',
    appSecret: config.appSecret || '',
    verifyToken: config.verifyToken || '',
    pageAccessToken: config.pageAccessToken || ''
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { appId, appSecret, verifyToken, pageAccessToken } = body
    
    await setFacebookAppConfig({
      appId: appId || '',
      appSecret: appSecret || '',
      verifyToken: verifyToken || '',
      pageAccessToken: pageAccessToken || ''
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
