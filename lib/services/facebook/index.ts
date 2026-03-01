import { FacebookAPI } from '../../facebook/api'

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0'

export interface FacebookPost {
  id: string
  message: string
  createdTime: string
  permalink: string
  fullPicture?: string
  type: string
  statusType?: string
}

export interface FacebookComment {
  id: string
  message: string
  createdTime: string
  from: {
    id: string
    name: string
  }
  likeCount?: number
}

export class FacebookMessageService {
  private api: FacebookAPI

  constructor(accessToken?: string) {
    this.api = new FacebookAPI(accessToken)
  }

  setAccessToken(token: string) {
    this.api.setAccessToken(token)
  }

  async getConversations(pageId: string) {
    return this.api.getConversations(pageId)
  }

  async getMessages(conversationId: string, limit = 25) {
    return this.api.getConversationMessages(conversationId, limit)
  }

  async sendMessage(psid: string, message: string) {
    return this.api.sendMessage(psid, message)
  }
}

export class FacebookPostService {
  private accessToken: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken || ''
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Facebook access token not configured')
    }

    const searchParams = new URLSearchParams({
      access_token: this.accessToken,
      ...params
    })

    const response = await fetch(`${FACEBOOK_API_BASE}${endpoint}?${searchParams}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Facebook API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getPosts(pageId: string, limit = 25): Promise<FacebookPost[]> {
    try {
      const data = await this.request<any>(`/${pageId}/posts`, {
        fields: 'id,message,created_time,permalink_url,full_picture,type,status_type',
        limit: String(limit)
      })

      return data.data?.map((post: any) => ({
        id: post.id,
        message: post.message || '',
        createdTime: post.created_time,
        permalink: post.permalink_url,
        fullPicture: post.full_picture,
        type: post.type,
        statusType: post.status_type
      })) || []
    } catch (e) {
      console.error('Error fetching posts:', e)
      return []
    }
  }

  async getPost(postId: string): Promise<FacebookPost | null> {
    try {
      const data = await this.request<any>(`/${postId}`, {
        fields: 'id,message,created_time,permalink_url,full_picture,type,status_type'
      })

      return {
        id: data.id,
        message: data.message || '',
        createdTime: data.created_time,
        permalink: data.permalink_url,
        fullPicture: data.full_picture,
        type: data.type,
        statusType: data.status_type
      }
    } catch (e) {
      console.error('Error fetching post:', e)
      return null
    }
  }

  async createPost(pageId: string, message: string, attachedMediaId?: string): Promise<{ id: string }> {
    const params: Record<string, string> = { message }

    if (attachedMediaId) {
      params.attached_media = JSON.stringify([{ media_fbid: attachedMediaId }])
    }

    const data = await this.request<any>(`/${pageId}/feed`, params)
    return { id: data.id }
  }

  async createMedia(imageUrl: string): Promise<string> {
    const searchParams = new URLSearchParams({
      url: imageUrl,
      access_token: this.accessToken
    })

    const response = await fetch(`${FACEBOOK_API_BASE}/me/photos?${searchParams}`, {
      method: 'POST'
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to create media: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    return data.id
  }

  async deletePost(postId: string): Promise<void> {
    await this.request<any>(`/${postId}`, { method: 'DELETE' })
  }
}

export class FacebookCommentService {
  private accessToken: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken || ''
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Facebook access token not configured')
    }

    const searchParams = new URLSearchParams({
      access_token: this.accessToken,
      ...params
    })

    const response = await fetch(`${FACEBOOK_API_BASE}${endpoint}?${searchParams}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Facebook API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getComments(postId: string, limit = 50): Promise<FacebookComment[]> {
    try {
      const data = await this.request<any>(`/${postId}/comments`, {
        fields: 'id,message,created_time,from,like_count',
        limit: String(limit)
      })

      return data.data?.map((comment: any) => ({
        id: comment.id,
        message: comment.message,
        createdTime: comment.created_time,
        from: comment.from,
        likeCount: comment.like_count
      })) || []
    } catch (e) {
      console.error('Error fetching comments:', e)
      return []
    }
  }

  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    const data = await this.request<any>(`/${commentId}/comments`, {
      message
    })
    return { id: data.id }
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.request<any>(`/${commentId}`, { method: 'DELETE' })
  }

  async hideComment(commentId: string, hide: boolean = true): Promise<void> {
    await this.request<any>(`/${commentId}`, {
      is_hidden: String(hide),
      method: 'POST'
    })
  }

  async likeComment(commentId: string): Promise<void> {
    await this.request<any>(`/${commentId}/likes`, { method: 'POST' })
  }
}
