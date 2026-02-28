import { NextRequest, NextResponse } from 'next/server'
import { facebookWebhookService } from '@/lib/facebook/service'
import { getVerifyToken } from '@/lib/facebook/app-config'
import { addMessage } from '@/lib/facebook/storage'
import type { FacebookWebhookPayload } from '@/lib/facebook/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const storedToken = await getVerifyToken()
    
    console.log('========================================')
    console.log('🔵 FACEBOOK WEBHOOK GET - VERIFICATION')
    console.log('========================================')
    console.log('Token from Redis (EXPECTED):', storedToken)
    console.log('Token from Meta (RECEIVED):', token)
    console.log('Mode:', mode, '| Challenge:', challenge)
    console.log('========================================')
    
    if (!storedToken) {
      console.log('[Facebook Webhook] No verify token configured - returning 403')
      console.log('[Facebook Webhook] No verify token configured')
      return NextResponse.json(
        { error: 'Verify token not configured' },
        { status: 403 }
      )
    }
    
    facebookWebhookService.setVerifyToken(storedToken)

    if (!facebookWebhookService.verifyWebhookMode(mode || '', token || '')) {
      console.log('[Facebook Webhook] Verification FAILED')
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 403 }
      )
    }

    console.log('[Facebook Webhook] Verification SUCCESS')
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
    console.log('📘 FACEBOOK WEBHOOK - PAYLOAD COMPLETO')
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

      if (event.type === 'messages' && event.data.messageId) {
        messages.push({
          id: event.data.messageId,
          conversationId: event.userId,
          senderId: event.userId,
          text: event.data.message || '',
          timestamp: event.timestamp,
          isFromMe: false,
          attachments: event.data.attachments?.map(a => ({
            type: a.type,
            payload: { url: a.url }
          }))
        })

        console.log(`[Facebook Webhook] Message: ${event.data.messageId} from ${event.userId}`)
      }
    }

    console.log(`[Facebook Webhook] ✅ Processed ${events.length} event(s)`)

    // Guardar mensajes en Redis
    for (const msg of messages) {
      try {
        console.log('[Facebook Webhook] Saving message:', JSON.stringify(msg))
        await addMessage({
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          text: msg.text,
          timestamp: msg.timestamp,
          isFromMe: msg.isFromMe,
          attachments: msg.attachments
        })
        console.log('[Facebook Webhook] Message saved successfully')
      } catch (e) {
        console.error('[Facebook Webhook] Error saving message:', e)
      }
    }

    console.log(`[Facebook Webhook] ✅ Processed ${events.length} event(s), saved ${messages.length} message(s)`)

    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    console.error('Facebook webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
