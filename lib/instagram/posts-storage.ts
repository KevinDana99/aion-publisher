import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const STORAGE_KEY = 'instagram_posts'

export interface StoredInstagramPost {
  id: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  caption?: string
  timestamp: number
  likeCount?: number
  commentsCount?: number
  saveCount?: number
  shareCount?: number
  fetchedAt: number
}

export interface StoredInstagramComment {
  id: string
  postId: string
  text: string
  userId: string
  username: string
  profilePictureUrl?: string
  timestamp: number
  likeCount?: number
  fetchedAt: number
}

interface StoredPostsData {
  posts: StoredInstagramPost[]
  comments: Record<string, StoredInstagramComment[]>
  lastUpdate: number
}

async function getStored(): Promise<StoredPostsData> {
  const data = await redis.get(STORAGE_KEY)
  return (data as StoredPostsData) || { posts: [], comments: {}, lastUpdate: 0 }
}

async function setStored(data: StoredPostsData): Promise<void> {
  await redis.set(STORAGE_KEY, data)
}

export async function getPosts(): Promise<StoredInstagramPost[]> {
  const data = await getStored()
  return data.posts
}

export async function savePosts(posts: StoredInstagramPost[]): Promise<void> {
  const data = await getStored()
  const newPosts = posts.map(post => ({
    ...post,
    fetchedAt: Date.now()
  }))
  data.posts = newPosts
  data.lastUpdate = Date.now()
  await setStored(data)
}

export async function getCommentsByPost(postId: string): Promise<StoredInstagramComment[]> {
  const data = await getStored()
  return data.comments[postId] || []
}

export async function saveComments(postId: string, comments: StoredInstagramComment[]): Promise<void> {
  const data = await getStored()
  data.comments[postId] = comments.map(comment => ({
    ...comment,
    fetchedAt: Date.now()
  }))
  await setStored(data)
}

export async function clearPosts(): Promise<void> {
  await setStored({ posts: [], comments: {}, lastUpdate: 0 })
}

export async function getLastUpdate(): Promise<number> {
  const data = await getStored()
  return data.lastUpdate
}
