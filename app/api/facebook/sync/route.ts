import { NextRequest, NextResponse } from 'next/server'
import { getCredentials } from '@/lib/facebook/credentials'
import { createFacebookAPI } from '@/lib/facebook/api'
import { addMessage } from '@/lib/facebook/storage'

export async function GET(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Facebook not connected. Please connect first.' },
        { status: 401 }
      )
    }

    const api = createFacebookAPI(credentials.accessToken)
    console.log('[Facebook Sync] Fetching conversations for page:', credentials.pageId)
    
    const conversations = await api.getConversations(credentials.pageId)
    console.log('[Facebook Sync] Got', conversations.length, 'conversations')

    const allMessages: any[] = []

    for (const conv of conversations) {
      console.log('[Facebook Sync] Getting messages for conversation:', conv.id)
      const messages = await api.getConversationMessages(conv.id, 50)
      
      for (const msg of messages) {
        allMessages.push({
          id: msg.id,
          conversationId: conv.id,
          senderId: msg.from?.id || conv.id,
          text: msg.message || '',
          timestamp: new Date(msg.created_time).getTime(),
          isFromMe: msg.from?.id === credentials.pageId
        })
      }
    }

    console.log('[Facebook Sync] Total messages fetched:', allMessages.length)

    for (const msg of allMessages) {
      addMessage(msg)
    }

    return NextResponse.json({ 
      success: true, 
      conversations: conversations.length,
      messages: allMessages.length 
    })
  } catch (error: any) {
    console.error('[Facebook Sync] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to sync messages' },
      { status: 500 }
    )
  }
}
