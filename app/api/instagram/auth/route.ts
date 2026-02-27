import { NextResponse } from 'next/server'
import { getInstagramCredentials, setInstagramCredentials, clearInstagramCredentials } from '@/lib/credentials/tokens'

export async function GET() {
  try {
    const credentials = await getInstagramCredentials()
    if (!credentials) {
      return NextResponse.json({ connected: false })
    }
    return NextResponse.json({
      connected: true,
      userId: credentials.userId,
      username: credentials.pageName,
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
    const { accessToken, userId, username, expiresAt } = body

    if (!accessToken || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await setInstagramCredentials({ accessToken, pageId: userId, pageName: username || '', expiresAt })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving credentials:', error)
    return NextResponse.json({ error: 'Failed to save credentials' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await clearInstagramCredentials()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing credentials:', error)
    return NextResponse.json({ error: 'Failed to clear credentials' }, { status: 500 })
  }
}
