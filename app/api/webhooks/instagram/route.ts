import { NextRequest, NextResponse } from 'next/server'
import { instagramWebhookService } from '@/lib/instagram/service'
import type { InstagramWebhookPayload } from '@/lib/instagram/types'
import { addMessage } from '@/lib/instagram/storage'
import { getVerifyToken } from '@/lib/instagram/app-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const verifyToken = getVerifyToken() || 'instagram_verify_token'

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
    console.log('📱 INSTAGRAM WEBHOOK RECIBIDO')
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
    for (const event of events) {
      console.log('[Instagram Webhook] Event:', JSON.stringify(event))

      if (event.type === 'messages' && event.data.messageId && event.data.message) {
        const messageId = event.data.messageId
        const text = event.data.message
        const timestamp = event.timestamp * 1000
        const conversationId = event.userId

        addMessage({
          id: messageId,
          conversationId,
          senderId: event.userId,
          text,
          timestamp,
          isFromMe: false
        })

        console.log(`[Instagram Webhook] 💾 Message saved: ${messageId} from ${conversationId}`)
      }

      if (event.type === 'message_echoes' && event.data.messageId && event.data.message) {
        const messageId = event.data.messageId
        const text = event.data.message
        const timestamp = event.timestamp * 1000
        const recipientId = event.data.recipientId || event.userId

        if (recipientId) {
          addMessage({
            id: messageId,
            conversationId: recipientId,
            senderId: 'business',
            text,
            timestamp,
            isFromMe: true
          })

          console.log(`[Instagram Webhook] 💾 Echo saved: ${messageId} to ${recipientId}`)
        }
      }
    }

    console.log(`[Instagram Webhook] ✅ Processed ${events.length} event(s)`)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Instagram webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
