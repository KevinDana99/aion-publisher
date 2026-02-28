import { NextResponse } from 'next/server'
import { getMessages, addMessage, getMessagesByConversation } from '@/lib/facebook/storage'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')

  try {
    if (conversationId) {
      const messages = getMessagesByConversation(conversationId)
      return NextResponse.json({ messages })
    }
    
    const data = getMessages()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, conversationId, senderId, text, timestamp, isFromMe, attachments } = body

    if (!id || !conversationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    addMessage({
      id,
      conversationId,
      senderId,
      text: text || '',
      timestamp: timestamp || Date.now(),
      isFromMe: isFromMe || false,
      attachments
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
