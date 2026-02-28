export interface FacebookWebhookEntry {
  id: string
  time: number
  messaging?: FacebookMessaging[]
}

export interface FacebookMessaging {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message?: FacebookWebhookMessage
}

export interface FacebookMessage {
  id: string
  text?: string
  from: { id: string }
  to: { id: string }
  timestamp: number
  attachments?: FacebookAttachment[]
}

export interface FacebookWebhookMessage {
  mid: string
  text?: string
  attachments?: FacebookAttachment[]
  quick_reply?: {
    payload: string
  }
}

export interface FacebookAttachment {
  type: string
  payload: {
    url?: string
    sticker_id?: string
    coordinates?: {
      point: { latitude: number; longitude: number }
    }
  }
}

export interface FacebookWebhookPayload {
  object: 'page'
  entry: FacebookWebhookEntry[]
}

export interface FacebookWebhookChallenge {
  'hub.mode': 'subscribe'
  'hub.verify_token': string
  'hub.challenge': string
}

export interface FacebookUser {
  id: string
  firstName: string
  lastName: string
  profilePic: string
  name?: string
}

export interface FacebookConversation {
  id: string
  participants: FacebookUser[]
  lastMessage: {
    id: string
    text?: string
    from: { id: string }
    to: { id: string }
    timestamp: number
  } | null
  updatedTime?: number
}

export interface FacebookAPIMessage {
  id: string
  message?: string
  from: { id: string }
  to: { id: string }
  created_time: string
}

export interface FacebookStoredMessage {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: number
  isFromMe: boolean
  attachments?: {
    type: 'image' | 'audio' | 'video' | 'file'
    payload: {
      url: string
    }
  }[]
}

export interface FacebookChatState {
  accessToken: string
  pageId: string
  pageName: string
  conversations: FacebookConversation[]
  messages: Record<string, FacebookStoredMessage[]>
  lastUpdate: number
}

export interface FacebookCredentials {
  accessToken: string
  pageId: string
  pageName: string
  expiresAt?: number
}

export interface FacebookAppConfig {
  appId: string
  appSecret: string
  verifyToken: string
  redirectUri: string
}
