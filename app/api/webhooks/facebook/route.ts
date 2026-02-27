import { NextRequest, NextResponse } from 'next/server'
import { facebookWebhookService } from '@/lib/facebook/service'
import type { FacebookWebhookPayload } from '@/lib/facebook/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const verifyToken = process.env.FACEBOOK_VERIFY_TOKEN || 'facebook_verify_token'
    facebookWebhookService.setVerifyToken(verifyToken)

    console.log('[Facebook Webhook] Verifying with token:', verifyToken, 'Got token:', token)

    if (!facebookWebhookService.verifyWebhookMode(mode || '', token || '')) {
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
    console.error('Facebook webhook verification error:', error)
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
    console.log('📘 FACEBOOK WEBHOOK RECIBIDO')
    console.log('========================================')
    console.log(JSON.stringify(body, null, 2))
    console.log('========================================')

    const payload = body as FacebookWebhookPayload

    if (payload.object !== 'page') {
      console.log('[Facebook Webhook] Invalid object:', payload.object)
      return NextResponse.json(
        { error: 'Invalid payload object' },
        { status: 400 }
      )
    }

    console.log('[Facebook Webhook] Entries:', payload.entry?.length || 0)

    const events = facebookWebhookService.processWebhookPayload(payload)

    console.log('[Facebook Webhook] Events processed:', events.length)
    
    const messages = []
    for (const event of events) {
      console.log('[Facebook Webhook] Event:', JSON.stringify(event))

      if (event.type === 'messages' && event.data.messageId && event.data.message) {
        messages.push({
          id: event.data.messageId,
          conversationId: event.userId,
          senderId: event.userId,
          text: event.data.message,
          timestamp: event.timestamp,
          isFromMe: false
        })

        console.log(`[Facebook Webhook] Message: ${event.data.messageId} from ${event.userId}`)
      }
    }

    console.log(`[Facebook Webhook] ✅ Processed ${events.length} event(s)`)

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error('Facebook webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
