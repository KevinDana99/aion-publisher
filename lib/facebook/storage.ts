import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const STORAGE_KEY = 'facebook_messages'

export interface StoredMessage {
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

interface StoredData {
  messages: StoredMessage[]
  lastUpdate: number
}

async function getStored(): Promise<StoredData> {
  const data = await redis.get(STORAGE_KEY)
  return (data as StoredData) || { messages: [], lastUpdate: 0 }
}

async function setStored(data: StoredData): Promise<void> {
  await redis.set(STORAGE_KEY, data)
}

export async function getMessages(): Promise<StoredData> {
  return await getStored()
}

export async function addMessage(message: StoredMessage): Promise<void> {
  const data = await getStored()
  const existing = data.messages.findIndex(m => m.id === message.id)
  if (existing === -1) {
    data.messages.push(message)
    data.lastUpdate = Date.now()
    await setStored(data)
  }
}

export async function getMessagesByConversation(conversationId: string): Promise<StoredMessage[]> {
  const data = await getStored()
  return data.messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp)
}

export async function clearMessages(): Promise<void> {
  await setStored({ messages: [], lastUpdate: 0 })
}
