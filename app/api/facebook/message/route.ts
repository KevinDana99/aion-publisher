import { NextRequest, NextResponse } from 'next/server'
import { getCredentials } from '@/lib/facebook/credentials'
import { createFacebookAPI } from '@/lib/facebook/api'

export async function POST(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Facebook not connected. Complete OAuth first.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { recipientId, message } = body

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: 'recipientId and message are required' },
        { status: 400 }
      )
    }

    const api = createFacebookAPI(credentials.accessToken)
    const result = await api.sendMessage(recipientId, message)

    return NextResponse.json({ success: true, messageId: result.message_id })
  } catch (error: any) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Facebook not connected' },
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

    const api = createFacebookAPI(credentials.accessToken)
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
