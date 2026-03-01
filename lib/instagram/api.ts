import type { InstagramMessage, InstagramUser, InstagramConversation } from './types'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com'

export interface InstagramMedia {
  id: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  mediaUrl: string
  thumbnailUrl?: string
  permalink: string
  caption?: string
  timestamp: string
  likeCount?: number
  commentsCount?: number
  saveCount?: number
  shareCount?: number
}

export interface InstagramComment {
  id: string
  text: string
  user: {
    id: string
    username: string
    profilePictureUrl?: string
  }
  timestamp: string
  likeCount?: number
  replies?: InstagramComment[]
}

export class InstagramAPI {
  private accessToken: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken || ''
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Instagram access token not configured')
    }

    const searchParams = new URLSearchParams({
      access_token: this.accessToken,
      ...params
    })

    const response = await fetch(`${INSTAGRAM_API_BASE}${endpoint}?${searchParams}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Instagram API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getUserProfile(userId: string): Promise<InstagramUser> {
    const data = await this.request<any>(`/${userId}`, {
      fields: 'id,username,account_type,media_count,profile_picture_url,name'
    })

    return {
      id: data.id,
      username: data.username,
      accountType: data.account_type,
      mediaCount: data.media_count,
      profilePicture: data.profile_picture_url,
      name: data.name
    }
  }

  async getMedia(userId: string, limit = 25): Promise<InstagramMedia[]> {
    try {
      const data = await this.request<any>(`/${userId}/media`, {
        fields: 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count,save_count,share_count',
        limit: String(limit)
      })

      return data.data?.map((media: any) => ({
        id: media.id,
        mediaType: media.media_type,
        mediaUrl: media.media_url || media.thumbnail_url,
        thumbnailUrl: media.thumbnail_url,
        permalink: media.permalink,
        caption: media.caption,
        timestamp: media.timestamp,
        likeCount: media.like_count,
        commentsCount: media.comments_count,
        saveCount: media.save_count,
        shareCount: media.share_count
      })) || []
    } catch (e) {
      console.error('Error fetching media:', e)
      return []
    }
  }

  async getMediaComments(mediaId: string, limit = 50): Promise<InstagramComment[]> {
    try {
      const data = await this.request<any>(`/${mediaId}/comments`, {
        fields: 'id,text,user, timestamp,like_count',
        limit: String(limit)
      })

      return data.data?.map((comment: any) => ({
        id: comment.id,
        text: comment.text,
        user: {
          id: comment.user?.id || '',
          username: comment.user?.username || '',
          profilePictureUrl: comment.user?.profile_picture_url
        },
        timestamp: comment.timestamp,
        likeCount: comment.like_count
      })) || []
    } catch (e) {
      console.error('Error fetching comments:', e)
      return []
    }
  }

  async getMediaInsights(mediaId: string): Promise<any> {
    try {
      const data = await this.request<any>(`/${mediaId}/insights`, {
        fields: 'id,like_count,comment_count,share_count,save_count,reach,taps_forward,taps_back'
      })
      
      const insights: Record<string, number> = {}
      data.data?.forEach((metric: any) => {
        insights[metric.name] = metric.values[0]?.value || 0
      })
      
      return insights
    } catch (e) {
      console.error('Error fetching insights:', e)
      return {}
    }
  }

  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    const response = await fetch(`${INSTAGRAM_API_BASE}/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        access_token: this.accessToken
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to reply to comment: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async hideComment(commentId: string, hide: boolean = true): Promise<void> {
    const response = await fetch(`${INSTAGRAM_API_BASE}/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hide,
        access_token: this.accessToken
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to hide comment: ${JSON.stringify(error)}`)
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const response = await fetch(`${INSTAGRAM_API_BASE}/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: this.accessToken
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to delete comment: ${JSON.stringify(error)}`)
    }
  }

  async getConversations(): Promise<InstagramConversation[]> {
    try {
      const data = await this.request<any>('/me/conversations', {
        fields: 'id,participants{messaging_accounts{id,username,name,profile_picture_url}}'
      })

      return data.data?.map((conv: any) => ({
        id: conv.id,
        participants: conv.participants?.messaging_accounts?.data || [],
        lastMessage: null
      })) || []
    } catch (e) {
      console.error('Error fetching conversations:', e)
      return []
    }
  }

  async getConversationMessages(conversationId: string, limit = 25): Promise<InstagramMessage[]> {
    try {
      const data = await this.request<any>(`/${conversationId}/messages`, {
        fields: 'id,message,from,to,created_time',
        limit: String(limit)
      })

      return data.data?.map((msg: any) => ({
        id: msg.id,
        text: msg.message,
        from: msg.from,
        to: msg.to,
        timestamp: new Date(msg.created_time).getTime()
      })) || []
    } catch (e) {
      console.error('Error fetching messages:', e)
      return []
    }
  }

  async getMessages(conversationId: string, limit = 25): Promise<InstagramMessage[]> {
    const data = await this.request<any>(`/${conversationId}/messages`, {
      fields: 'id,message,from,to,created_time',
      limit: String(limit)
    })

    return data.data?.map((msg: any) => ({
      id: msg.id,
      text: msg.message,
      from: msg.from,
      to: msg.to,
      timestamp: new Date(msg.created_time).getTime()
    })) || []
  }

  async sendMessage(userId: string, message: string): Promise<{ message_id: string }> {
    const response = await fetch(`${INSTAGRAM_API_BASE}/me/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: userId },
        message: { text: message },
        access_token: this.accessToken
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to send message: ${JSON.stringify(error)}`)
    }

    return response.json()
  }
}

export function createInstagramAPI(accessToken?: string): InstagramAPI {
  return new InstagramAPI(accessToken)
}

export const instagramAPI = new InstagramAPI()
