import type {
  InstagramWebhookPayload,
  InstagramProcessedEvent,
  InstagramMessaging,
  InstagramChange,
  InstagramWebhookMessage
} from './types'

export class InstagramWebhookService {
  private verifyToken: string

  constructor(verifyToken?: string) {
    this.verifyToken = verifyToken || process.env.INSTAGRAM_VERIFY_TOKEN || ''
  }

  setVerifyToken(token: string) {
    this.verifyToken = token
  }

  verifyWebhookMode(mode: string, token: string): boolean {
    return mode === 'subscribe' && token === this.verifyToken
  }

  processWebhookPayload(payload: InstagramWebhookPayload): InstagramProcessedEvent[] {
    const events: InstagramProcessedEvent[] = []

    for (const entry of payload.entry) {
      if (entry.messaging) {
        for (const messaging of entry.messaging) {
          const event = this.processMessagingEvent(messaging, entry.time)
          if (event) {
            events.push(event)
          }
        }
      }

      if (entry.changes) {
        for (const change of entry.changes) {
          const event = this.processChangeEvent(change, entry.time)
          if (event) {
            events.push(event)
          }
        }
      }
    }

    return events
  }

  private processMessagingEvent(
    messaging: InstagramMessaging,
    entryTime: number
  ): InstagramProcessedEvent | null {
    const { sender, recipient, message, message_edit } = messaging

    if (message_edit) {
      return null
    }

    const msgData = message as unknown as InstagramWebhookMessage
    
    if (!msgData) {
      console.log('[Instagram Webhook] No message data found')
      return null
    }

    const isEcho = msgData.is_echo === true

    console.log('[Instagram Webhook] Message data:', { mid: msgData.mid, text: msgData.text, is_echo: msgData.is_echo, isEcho, attachments: msgData.attachments })

    if (isEcho) {
      return {
        type: 'message_echoes',
        userId: sender.id,
        timestamp: entryTime,
        data: {
          messageId: msgData.mid,
          message: msgData.text,
          recipientId: recipient?.id
        }
      }
    }

    return {
      type: 'messages',
      userId: sender.id,
      timestamp: entryTime,
      data: {
        messageId: msgData.mid,
        message: msgData.text,
        attachments: msgData.attachments?.map(a => ({
          type: a.type as 'image' | 'audio' | 'video' | 'file',
          url: a.payload?.url || ''
        })).filter(a => a.url)
      }
    }
  }

  private processChangeEvent(
    change: InstagramChange,
    entryTime: number
  ): InstagramProcessedEvent | null {
    const { field, value } = change

    switch (field) {
      case 'messages':
        return {
          type: 'messages',
          userId: value.message ? 'unknown' : 'unknown',
          timestamp: entryTime,
          data: {
            message: value.message,
            messageId: value.comment_id
          }
        }

      case 'comments':
        return {
          type: 'comments',
          userId: 'unknown',
          timestamp: entryTime,
          data: {
            commentId: value.comment_id,
            message: value.message
          }
        }

      case 'mentions':
        return {
          type: 'mentions',
          userId: 'unknown',
          timestamp: entryTime,
          data: {
            message: value.mention,
            mediaId: value.media_id
          }
        }

      case 'story_insights':
        return {
          type: 'story_insights',
          userId: 'unknown',
          timestamp: entryTime,
          data: {
            mediaId: value.media_id
          }
        }

      default:
        return null
    }
  }

  formatEventForLogging(event: InstagramProcessedEvent): string {
    const timestamp = new Date(event.timestamp * 1000).toISOString()

    switch (event.type) {
      case 'messages':
        return `[${timestamp}] New message from ${event.userId}: ${event.data.message || '(no text)'}`

      case 'message_echoes':
        return `[${timestamp}] Message sent (echo): ${event.data.messageId}`

      case 'comments':
        return `[${timestamp}] New comment: ${event.data.commentId} - ${event.data.message || ''}`

      case 'mentions':
        return `[${timestamp}] New mention: ${event.data.message || ''}`

      case 'story_insights':
        return `[${timestamp}] Story insight received: ${event.data.mediaId}`

      default:
        return `[${timestamp}] Event: ${event.type}`
    }
  }
}

export function createInstagramWebhookService(verifyToken?: string): InstagramWebhookService {
  return new InstagramWebhookService(verifyToken)
}

export const instagramWebhookService = new InstagramWebhookService()
