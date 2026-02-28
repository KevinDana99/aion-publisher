import { NextRequest, NextResponse } from 'next/server'
import { instagramWebhookService } from '@/lib/instagram/service'
import { getInstagramAppConfig } from '@/lib/instagram/app-config'
import { addMessage } from '@/lib/instagram/storage'
import type { InstagramWebhookPayload } from '@/lib/instagram/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    let storedToken = ''
    try {
      const config = await getInstagramAppConfig()
      storedToken = config.verifyToken
    } catch (e) {
      console.error('[Instagram Webhook] Error getting token from Redis:', e)
    }
    
    if (!storedToken) {
      return NextResponse.json(
        { error: 'Verify token not configured' },
        { status: 403 }
      )
    }
    
    instagramWebhookService.setVerifyToken(storedToken)

    if (!instagramWebhookService.verifyWebhookMode(mode || '', token || '')) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 403 }
      )
    }

    return new NextResponse(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  } catch (error) {
    console.error('Instagram webhook verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('========================================')
    console.log('📱 INSTAGRAM WEBHOOK - PAYLOAD COMPLETO')
    console.log('========================================')
    console.log(JSON.stringify(body, null, 2))
    console.log('========================================')

    const payload = body as InstagramWebhookPayload

    if (payload.object !== 'instagram') {
      return NextResponse.json(
        { error: 'Invalid payload object' },
        { status: 400 }
      )
    }

    const events = instagramWebhookService.processWebhookPayload(payload)

    console.log('[Instagram Webhook] Events processed:', events.length)
    
    const messages = []
    for (const event of events) {
      console.log('[Instagram Webhook] Event:', JSON.stringify(event))

      if (event.type === 'messages' && event.data.messageId) {
        messages.push({
          id: event.data.messageId,
          conversationId: event.userId,
          senderId: event.userId,
          text: event.data.message || '',
          timestamp: event.timestamp,
          isFromMe: false,
          attachments: event.data.attachments
        })
      }

      if (event.type === 'message_echoes' && event.data.messageId) {
        const recipientId = event.data.recipientId || event.userId
        messages.push({
          id: event.data.messageId,
          conversationId: recipientId,
          senderId: 'business',
          text: event.data.message || '',
          timestamp: event.timestamp,
          isFromMe: true,
          attachments: event.data.attachments
        })
      }
    }

    // Guardar mensajes en el storage
    for (const msg of messages) {
      try {
        console.log('[Instagram Webhook] Saving message:', JSON.stringify(msg))
        await addMessage({
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          text: msg.text,
          timestamp: msg.timestamp,
          isFromMe: msg.isFromMe,
          attachments: msg.attachments
        })
        console.log('[Instagram Webhook] Message saved successfully')
      } catch (e) {
        console.error('[Instagram Webhook] Error saving message:', e)
      }
    }

    console.log(`[Instagram Webhook] ✅ Processed ${events.length} event(s), saved ${messages.length} message(s)`)

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error('Instagram webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
