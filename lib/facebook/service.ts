import type {
  FacebookWebhookPayload,
  FacebookMessaging,
  FacebookWebhookMessage
} from './types'

export interface FacebookProcessedEvent {
  type: 'messages' | 'message_echoes'
  userId: string
  timestamp: number
  data: {
    messageId?: string
    message?: string
    recipientId?: string
  }
}

export class FacebookWebhookService {
  private verifyToken: string

  constructor(verifyToken?: string) {
    this.verifyToken = verifyToken || process.env.FACEBOOK_VERIFY_TOKEN || ''
  }

  setVerifyToken(token: string) {
    this.verifyToken = token
  }

  verifyWebhookMode(mode: string, token: string): boolean {
    return mode === 'subscribe' && token === this.verifyToken
  }

  processWebhookPayload(payload: FacebookWebhookPayload): FacebookProcessedEvent[] {
    const events: FacebookProcessedEvent[] = []

    if (payload.object !== 'page') {
      console.log('[Facebook Webhook] Invalid object type:', payload.object)
      return events
    }

    for (const entry of payload.entry) {
      if (entry.messaging) {
        for (const messaging of entry.messaging) {
          const event = this.processMessagingEvent(messaging, entry.time)
          if (event) {
            events.push(event)
          }
        }
      }
    }

    return events
  }

  private processMessagingEvent(
    messaging: FacebookMessaging,
    entryTime: number
  ): FacebookProcessedEvent | null {
    const { sender, recipient, message } = messaging

    if (!message) {
      return null
    }

    const msgData = message as unknown as FacebookWebhookMessage
    
    if (!msgData || !msgData.mid) {
      console.log('[Facebook Webhook] No message data found')
      return null
    }

    return {
      type: 'messages',
      userId: sender.id,
      timestamp: entryTime,
      data: {
        messageId: msgData.mid,
        message: msgData.text,
        recipientId: recipient.id
      }
    }
  }

  formatEventForLogging(event: FacebookProcessedEvent): string {
    const timestamp = new Date(event.timestamp).toISOString()

    switch (event.type) {
      case 'messages':
        return `[${timestamp}] New message from ${event.userId}: ${event.data.message || '(no text)'}`

      case 'message_echoes':
        return `[${timestamp}] Message sent (echo): ${event.data.messageId}`

      default:
        return `[${timestamp}] Event: ${event.type}`
    }
  }
}

export function createFacebookWebhookService(verifyToken?: string): FacebookWebhookService {
  return new FacebookWebhookService(verifyToken)
}

export const facebookWebhookService = new FacebookWebhookService()
