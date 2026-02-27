import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const MESSAGES_FILE = path.join(DATA_DIR, 'instagram-messages.json')

interface StoredMessage {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: number
  isFromMe: boolean
}

interface StoredData {
  messages: StoredMessage[]
  lastUpdate: number
}

const defaultData: StoredData = {
  messages: [],
  lastUpdate: 0
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readMessages(): StoredData {
  ensureDataDir()
  if (!fs.existsSync(MESSAGES_FILE)) {
    return defaultData
  }
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8')
    return { ...defaultData, ...JSON.parse(data) }
  } catch {
    return defaultData
  }
}

function writeMessages(data: StoredData): void {
  ensureDataDir()
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2))
}

export function getMessages(): StoredData {
  return readMessages()
}

export function addMessage(message: StoredMessage): void {
  const data = readMessages()
  const existing = data.messages.findIndex(m => m.id === message.id)
  if (existing === -1) {
    data.messages.push(message)
    data.lastUpdate = Date.now()
    writeMessages(data)
  }
}

export function getMessagesByConversation(conversationId: string): StoredMessage[] {
  const data = readMessages()
  return data.messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp)
}

export function clearMessages(): void {
  writeMessages(defaultData)
}
