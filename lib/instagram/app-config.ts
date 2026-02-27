import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONFIG_FILE = path.join(DATA_DIR, 'instagram-config.json')

interface InstagramAppConfig {
  clientId: string
  clientSecret: string
  verifyToken: string
  redirectUri: string
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readConfig(): InstagramAppConfig {
  ensureDataDir()
  if (!fs.existsSync(CONFIG_FILE)) {
    return {
      clientId: '',
      clientSecret: '',
      verifyToken: '',
      redirectUri: ''
    }
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      clientId: '',
      clientSecret: '',
      verifyToken: '',
      redirectUri: ''
    }
  }
}

export function getAppConfig(): InstagramAppConfig {
  return readConfig()
}

export function saveAppConfig(config: Partial<InstagramAppConfig>): InstagramAppConfig {
  ensureDataDir()
  const current = readConfig()
  const updated = { ...current, ...config }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2))
  return updated
}

export function getClientId(): string {
  return readConfig().clientId
}

export function getClientSecret(): string {
  return readConfig().clientSecret
}

export function getVerifyToken(): string {
  return readConfig().verifyToken || process.env.INSTAGRAM_VERIFY_TOKEN || ''
}

export function getRedirectUri(): string {
  return readConfig().redirectUri
}
