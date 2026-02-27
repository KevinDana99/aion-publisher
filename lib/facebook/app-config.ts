import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CONFIG_FILE = path.join(DATA_DIR, 'facebook-config.json')

interface FacebookAppConfig {
  appId: string
  appSecret: string
  verifyToken: string
  redirectUri: string
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function readConfig(): FacebookAppConfig {
  ensureDataDir()
  if (!fs.existsSync(CONFIG_FILE)) {
    return {
      appId: '',
      appSecret: '',
      verifyToken: '',
      redirectUri: ''
    }
  }
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      appId: '',
      appSecret: '',
      verifyToken: '',
      redirectUri: ''
    }
  }
}

export function getAppConfig(): FacebookAppConfig {
  return readConfig()
}

export function saveAppConfig(config: Partial<FacebookAppConfig>): FacebookAppConfig {
  ensureDataDir()
  const current = readConfig()
  const updated = { ...current, ...config }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2))
  return updated
}

export function getAppId(): string {
  return readConfig().appId
}

export function getAppSecret(): string {
  return readConfig().appSecret
}

export function getVerifyToken(): string {
  return readConfig().verifyToken || process.env.FACEBOOK_VERIFY_TOKEN || ''
}

export function getRedirectUri(): string {
  return readConfig().redirectUri
}
