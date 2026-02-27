import { NextRequest, NextResponse } from 'next/server'
import { getCredentials } from '@/lib/instagram/credentials'
import { createInstagramAPI } from '@/lib/instagram/api'

export async function GET(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Instagram not connected' },
        { status: 401 }
      )
    }

    const api = createInstagramAPI(credentials.accessToken)
    const conversations = await api.getConversations()

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('Error getting conversations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get conversations' },
      { status: 500 }
    )
  }
}
