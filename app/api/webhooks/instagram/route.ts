import { NextRequest, NextResponse } from 'next/server'
import { instagramWebhookService } from '@/lib/instagram/service'
import type { InstagramWebhookPayload } from '@/lib/instagram/types'
import { getVerifyToken } from '@/lib/instagram/app-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')
    const clientToken = searchParams.get('verify_token')

    const verifyToken = clientToken || getVerifyToken()
    instagramWebhookService.setVerifyToken(verifyToken)

    console.log('[Instagram Webhook] Verifying. Client token:', clientToken ? 'yes' : 'no', 'Got token from Meta:', token)

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
    
    const messages = []
    for (const event of events) {
      console.log('[Instagram Webhook] Event:', JSON.stringify(event))

      if (event.type === 'messages' && event.data.messageId && event.data.message) {
        messages.push({
          id: event.data.messageId,
          conversationId: event.userId,
          senderId: event.userId,
          text: event.data.message,
          timestamp: event.timestamp,
          isFromMe: false
        })
      }

      if (event.type === 'message_echoes' && event.data.messageId && event.data.message) {
        const recipientId = event.data.recipientId || event.userId
        messages.push({
          id: event.data.messageId,
          conversationId: recipientId,
          senderId: 'business',
          text: event.data.message,
          timestamp: event.timestamp,
          isFromMe: true
        })
      }
    }

    console.log(`[Instagram Webhook] ✅ Processed ${events.length} event(s)`)

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error('Instagram webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
