import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CREDENTIALS_FILE = path.join(DATA_DIR, 'instagram-credentials.json')

interface InstagramCredentials {
  accessToken: string
  userId: string
  username: string
  expiresAt?: number
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readCredentials(): InstagramCredentials | null {
  ensureDataDir()
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    return null
  }
  try {
    const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function saveCredentials(credentials: InstagramCredentials): void {
  ensureDataDir()
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
}

export function getCredentials(): InstagramCredentials | null {
  return readCredentials()
}

export function clearCredentials(): void {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    fs.unlinkSync(CREDENTIALS_FILE)
  }
}
