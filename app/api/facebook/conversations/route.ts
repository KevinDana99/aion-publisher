import { NextRequest, NextResponse } from 'next/server'
import { getCredentials } from '@/lib/facebook/credentials'
import { createFacebookAPI } from '@/lib/facebook/api'

export async function GET(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Facebook not connected' },
        { status: 401 }
      )
    }

    const api = createFacebookAPI(credentials.accessToken)
    const conversations = await api.getConversations(credentials.pageId)

    return NextResponse.json({ conversations })
  } catch (error: any) {
    console.error('Error getting conversations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get conversations' },
      { status: 500 }
    )
  }
}
