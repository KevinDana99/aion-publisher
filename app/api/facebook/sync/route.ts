import { NextRequest, NextResponse } from 'next/server'
import { getCredentials } from '@/lib/facebook/credentials'
import { createFacebookAPI } from '@/lib/facebook/api'
import { addMessage } from '@/lib/facebook/storage'

export async function GET(request: NextRequest) {
  try {
    const credentials = getCredentials()
    
    console.log('[Facebook Sync] Credentials:', credentials)
    
    if (!credentials?.accessToken) {
      return NextResponse.json(
        { error: 'Facebook not connected. Please connect first.' },
        { status: 401 }
      )
    }

    const api = createFacebookAPI(credentials.accessToken)
    
    // Obtener page ID correcto usando 'me'
    let pageIdToUse = credentials.pageId
    try {
      console.log('[Facebook Sync] Getting page info with me...')
      const pageInfo = await api.getPageInfo('me')
      console.log('[Facebook Sync] Page info:', pageInfo)
      pageIdToUse = pageInfo.id
    } catch (e) {
      console.log('[Facebook Sync] Error getting page info:', e)
    }
    
    console.log('[Facebook Sync] Fetching conversations for page:', pageIdToUse)
    
    const conversations = await api.getConversations(pageIdToUse)
    console.log('[Facebook Sync] Got', conversations.length, 'conversations')
    console.log('[Facebook Sync] Conversations:', JSON.stringify(conversations))

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
          isFromMe: msg.from?.id === pageIdToUse
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
