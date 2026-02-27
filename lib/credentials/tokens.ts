import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const KEYS = {
  facebookCredentials: 'credentials:facebook',
  instagramCredentials: 'credentials:instagram',
  facebookVerifyToken: 'verify_token:facebook',
  instagramVerifyToken: 'verify_token:instagram'
}

export interface StoredCredentials {
  accessToken: string
  pageId: string
  pageName: string
  userId?: string
  expiresAt?: number
}

export async function getFacebookCredentials(): Promise<StoredCredentials | null> {
  const data = await redis.get(KEYS.facebookCredentials)
  return data as StoredCredentials | null
}

export async function setFacebookCredentials(credentials: StoredCredentials): Promise<void> {
  await redis.set(KEYS.facebookCredentials, credentials)
}

export async function clearFacebookCredentials(): Promise<void> {
  await redis.del(KEYS.facebookCredentials)
}

export async function getInstagramCredentials(): Promise<StoredCredentials | null> {
  const data = await redis.get(KEYS.instagramCredentials)
  return data as StoredCredentials | null
}

export async function setInstagramCredentials(credentials: StoredCredentials): Promise<void> {
  await redis.set(KEYS.instagramCredentials, credentials)
}

export async function clearInstagramCredentials(): Promise<void> {
  await redis.del(KEYS.instagramCredentials)
}

export async function getFacebookVerifyToken(): Promise<string> {
  return (await redis.get(KEYS.facebookVerifyToken)) as string || ''
}

export async function setFacebookVerifyToken(token: string): Promise<void> {
  await redis.set(KEYS.facebookVerifyToken, token)
}

export async function getInstagramVerifyToken(): Promise<string> {
  return (await redis.get(KEYS.instagramVerifyToken)) as string || ''
}

export async function setInstagramVerifyToken(token: string): Promise<void> {
  await redis.set(KEYS.instagramVerifyToken, token)
}
