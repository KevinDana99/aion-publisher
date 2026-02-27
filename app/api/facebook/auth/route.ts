import { NextResponse } from 'next/server'
import { getCredentials, saveCredentials, clearCredentials } from '@/lib/facebook/credentials'
import { createFacebookAPI } from '@/lib/facebook/api'

export async function GET() {
  try {
    const credentials = getCredentials()
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
      return NextResponse.json({ error: 'Missing accessToken' }, { status: 400 })
    }

    // Si pageId es 'me', obtener el ID real de la página
    if (pageId === 'me' || !pageId) {
      try {
        const api = createFacebookAPI(accessToken)
        const pageInfo = await api.getPageInfo('me')
        pageId = pageInfo.id
        pageName = pageInfo.name
        console.log('[Facebook Auth] Got page info:', pageId, pageName)
      } catch (e) {
        console.error('[Facebook Auth] Error getting page info:', e)
        // Usar un default si no se puede obtener
        pageId = pageId || 'unknown'
      }
    }

    saveCredentials({ accessToken, pageId, pageName: pageName || '', expiresAt })
    return NextResponse.json({ success: true, pageId, pageName })
  } catch (error) {
    console.error('Error saving credentials:', error)
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    clearCredentials()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing credentials:', error)
    return NextResponse.json({ error: 'Failed to clear credentials' }, { status: 500 })
  }
}
