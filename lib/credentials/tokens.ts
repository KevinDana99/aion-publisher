import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const KEYS = {
  facebookVerifyToken: 'verify_token:facebook',
  instagramVerifyToken: 'verify_token:instagram'
}

export async function getFacebookVerifyToken(): Promise<string> {
  return await redis.get(KEYS.facebookVerifyToken) || ''
}

export async function setFacebookVerifyToken(token: string): Promise<void> {
  await redis.set(KEYS.facebookVerifyToken, token)
}

export async function getInstagramVerifyToken(): Promise<string> {
  return await redis.get(KEYS.instagramVerifyToken) || ''
}

export async function setInstagramVerifyToken(token: string): Promise<void> {
  await redis.set(KEYS.instagramVerifyToken, token)
}
