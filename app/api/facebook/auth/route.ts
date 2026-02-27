import { NextResponse } from 'next/server'
import { createFacebookAPI } from '@/lib/facebook/api'
import { getFacebookCredentials, setFacebookCredentials, clearFacebookCredentials } from '@/lib/credentials/tokens'

export async function GET() {
  try {
    const credentials = await getFacebookCredentials()
    
    if (!credentials) {
      return NextResponse.json({ connected: false })
    }
    return NextResponse.json({
      connected: true,
      pageId: credentials.pageId,
      pageName: credentials.pageName,
      accessToken: credentials.accessToken
    })
  } catch (error) {
    console.error('Error getting credentials:', error)
    return NextResponse.json({ error: 'Failed to get credentials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { accessToken, pageId, pageName, expiresAt } = body

    if (!accessToken) {
      accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing accessToken' }, { status: 400 })
    }

    if (pageId === 'me' || !pageId) {
      try {
        const api = createFacebookAPI(accessToken)
        const pageInfo = await api.getPageInfo('me')
        pageId = pageInfo.id
        pageName = pageInfo.name
        console.log('[Facebook Auth] Got page info:', pageId, pageName)
      } catch (e) {
        console.error('[Facebook Auth] Error getting page info:', e)
        pageId = pageId || 'unknown'
      }
    }

    await setFacebookCredentials({ accessToken, pageId, pageName: pageName || '', expiresAt })
    return NextResponse.json({ success: true, pageId, pageName })
  } catch (error) {
    console.error('Error saving credentials:', error)
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await clearFacebookCredentials()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing credentials:', error)
    return NextResponse.json({ error: 'Failed to clear credentials' }, { status: 500 })
  }
}
