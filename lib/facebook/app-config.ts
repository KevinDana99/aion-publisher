import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const KEYS = {
  facebookAppConfig: 'app_config:facebook'
}

export interface FacebookAppConfigData {
  appId: string
  appSecret: string
  verifyToken: string
  pageAccessToken: string
}

export async function getFacebookAppConfig(): Promise<FacebookAppConfigData> {
  const config = await redis.get(KEYS.facebookAppConfig)
  return (config as FacebookAppConfigData) || { appId: '', appSecret: '', verifyToken: '', pageAccessToken: '' }
}

export async function setFacebookAppConfig(config: FacebookAppConfigData): Promise<void> {
  await redis.set(KEYS.facebookAppConfig, config)
}

export async function getVerifyToken(): Promise<string> {
  const config = await getFacebookAppConfig()
  return config.verifyToken || ''
}

export async function setVerifyToken(token: string): Promise<void> {
  const config = await getFacebookAppConfig()
  config.verifyToken = token
  await setFacebookAppConfig(config)
}

export function getAppId(): string {
  return process.env.FACEBOOK_APP_ID || ''
}

export function getAppSecret(): string {
  return process.env.FACEBOOK_APP_SECRET || ''
}

export function getRedirectUri(): string {
  return process.env.FACEBOOK_REDIRECT_URI || ''
}
