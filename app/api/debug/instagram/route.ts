import { NextResponse } from 'next/server'
import { getInstagramAppConfig } from '@/lib/instagram/app-config'

export async function GET() {
  try {
    const config = await getInstagramAppConfig()
    return NextResponse.json({ 
      instagramConfig: config,
      verifyTokenStored: config.verifyToken ? 'YES: ' + config.verifyToken : 'NO'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}
