import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const KEYS = {
  instagramAppConfig: 'app_config:instagram',
  facebookAppConfig: 'app_config:facebook'
}

export interface InstagramAppConfig {
  clientId: string
  clientSecret: string
  verifyToken: string
  redirectUri: string
}

export interface FacebookAppConfig {
  appId: string
  appSecret: string
  verifyToken: string
  pageAccessToken: string
}

export async function getInstagramAppConfig(): Promise<InstagramAppConfig> {
  console.log('[Instagram App Config] Reading from Redis, key:', KEYS.instagramAppConfig)
  const config = await redis.get(KEYS.instagramAppConfig)
  console.log('[Instagram App Config] Read result:', JSON.stringify(config))
  return (config as InstagramAppConfig) || { clientId: '', clientSecret: '', verifyToken: '', redirectUri: '' }
}

export async function setInstagramAppConfig(config: InstagramAppConfig): Promise<void> {
  console.log('[Instagram App Config] Writing to Redis, key:', KEYS.instagramAppConfig, 'value:', JSON.stringify(config))
  await redis.set(KEYS.instagramAppConfig, config)
  console.log('[Instagram App Config] Write complete')
}

export async function getFacebookAppConfig(): Promise<FacebookAppConfig> {
  const config = await redis.get(KEYS.facebookAppConfig)
  return (config as FacebookAppConfig) || { appId: '', appSecret: '', verifyToken: '', pageAccessToken: '' }
}

export async function setFacebookAppConfig(config: FacebookAppConfig): Promise<void> {
  await redis.set(KEYS.facebookAppConfig, config)
}

export async function getVerifyToken(): Promise<string> {
  const config = await getInstagramAppConfig()
  return config.verifyToken || ''
}

export async function setVerifyToken(token: string): Promise<void> {
  const config = await getInstagramAppConfig()
  config.verifyToken = token
  await setInstagramAppConfig(config)
}

export function getClientId(): string {
  return process.env.INSTAGRAM_CLIENT_ID || ''
}

export function getClientSecret(): string {
  return process.env.INSTAGRAM_CLIENT_SECRET || ''
}

export function getRedirectUri(): string {
  return process.env.INSTAGRAM_REDIRECT_URI || ''
}
