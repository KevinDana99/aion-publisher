import { NextRequest, NextResponse } from 'next/server'
import { getInstagramCredentials } from '@/lib/credentials/tokens'
import { createInstagramAPI } from '@/lib/instagram/api'

export async function POST(request: NextRequest) {
  try {
    const credentials = await getInstagramCredentials()
    
    console.log('[Instagram Message] Credentials:', credentials ? 'exists' : 'none')
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Instagram not connected. Complete OAuth first.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { recipientId, message } = body
    
    console.log('[Instagram Message] Sending to recipientId:', recipientId)
    console.log('[Instagram Message] Message:', message)

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: 'recipientId and message are required' },
        { status: 400 }
      )
    }

    const api = createInstagramAPI(credentials.accessToken)
    const result = await api.sendMessage(recipientId, message)

    return NextResponse.json({ success: true, messageId: result.message_id })
  } catch (error: any) {
    console.error('[Instagram Message] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const credentials = await getInstagramCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Instagram not connected' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const api = createInstagramAPI(credentials.accessToken)
    const profile = await api.getUserProfile(userId)

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get user profile' },
      { status: 500 }
    )
  }
}
