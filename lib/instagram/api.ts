import type { InstagramMessage, InstagramUser, InstagramConversation } from './types'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com'

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
