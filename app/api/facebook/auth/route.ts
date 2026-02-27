import { NextResponse } from 'next/server'
import { getCredentials, saveCredentials, clearCredentials } from '@/lib/facebook/credentials'

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
    const { accessToken, pageId, pageName, expiresAt } = body

    if (!accessToken || !pageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    saveCredentials({ accessToken, pageId, pageName, expiresAt })
    return NextResponse.json({ success: true })
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
