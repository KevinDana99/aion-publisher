export interface InstagramWebhookEntry {
  id: string
  time: number
  messaging?: InstagramMessaging[]
  changes?: InstagramChange[]
}

export interface InstagramMessaging {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message?: InstagramWebhookMessage
  message_edit?: {
    mid: string
    text?: string
    num_edit: number
  }
}

export interface InstagramMessage {
  id: string
  text?: string
  from: { id: string; username?: string }
  to: { id: string; username?: string }
  timestamp: number
  attachments?: InstagramAttachment[]
}

export interface InstagramWebhookMessage {
  mid: string
  text?: string
  attachments?: InstagramAttachment[]
  is_echo?: boolean
}

export interface InstagramAttachment {
  type: string
  payload: {
    url?: string
    sticker_id?: string
  }
}

export interface InstagramChange {
  field: string
  value: InstagramChangeValue
}

export interface InstagramChangeValue {
  message?: string
  comment_id?: string
  media_id?: string
  like?: boolean
  mention?: string
}

export interface InstagramWebhookPayload {
  object: 'instagram'
  entry: InstagramWebhookEntry[]
}

export interface InstagramWebhookChallenge {
  'hub.mode': 'subscribe'
  'hub.verify_token': string
  'hub.challenge': string
}

export type InstagramEventType =
  | 'messages'
  | 'messages_reactions'
  | 'message_echoes'
  | 'story_insights'
  | 'comments'
  | 'mentions'
  | 'follows'
  | 'likes'

export interface InstagramProcessedEvent {
  type: InstagramEventType
  userId: string
  timestamp: number
  data: {
    messageId?: string
    message?: string
    mediaId?: string
    commentId?: string
    storyId?: string
    reaction?: string
    recipientId?: string
    attachments?: {
      type: 'image' | 'audio' | 'video' | 'file'
      url: string
    }[]
  }
}

export interface InstagramUser {
  id: string
  username: string
  accountType: string
  mediaCount?: number
  profilePicture?: string
  name?: string
}

export interface InstagramConversation {
  id: string
  participants: InstagramUser[]
  lastMessage: {
    id: string
    text?: string
    from: { id: string; username?: string }
    to: { id: string; username?: string }
    timestamp: number
  } | null
  updatedTime?: number
}

export interface InstagramAPIMessage {
  id: string
  text?: string
  from: { id: string; username?: string }
  to: { id: string; username?: string }
  timestamp: number
  attachments?: InstagramAttachment[]
}

export interface InstagramStoredMessage {
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

export interface InstagramChatState {
  accessToken: string
  userId: string
  username: string
  conversations: InstagramConversation[]
  messages: Record<string, InstagramStoredMessage[]>
  lastUpdate: number
}
