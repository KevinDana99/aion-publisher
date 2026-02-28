interface StoredMessage {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: number
  isFromMe: boolean
  attachments?: {
    type: 'image' | 'audio' | 'video' | 'file'
    url: string
  }[]
}

interface StoredData {
  messages: StoredMessage[]
  lastUpdate: number
}

const STORAGE_KEY = 'facebook-messages'

function getStored(): StoredData {
  if (typeof window === 'undefined') return { messages: [], lastUpdate: 0 }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return { messages: [], lastUpdate: 0 }
  try {
    return JSON.parse(stored)
  } catch {
    return { messages: [], lastUpdate: 0 }
  }
}

function setStored(data: StoredData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function getMessages(): StoredData {
  return getStored()
}

export function addMessage(message: StoredMessage): void {
  const data = getStored()
  const existing = data.messages.findIndex(m => m.id === message.id)
  if (existing === -1) {
    data.messages.push(message)
    data.lastUpdate = Date.now()
    setStored(data)
  }
}

export function getMessagesByConversation(conversationId: string): StoredMessage[] {
  const data = getStored()
  return data.messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp)
}

export function clearMessages(): void {
  setStored({ messages: [], lastUpdate: 0 })
}