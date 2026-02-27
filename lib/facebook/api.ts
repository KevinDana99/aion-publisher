import type { FacebookUser, FacebookConversation, FacebookAPIMessage } from './types'

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0'

export class FacebookAPI {
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

  async getUserProfile(psid: string): Promise<FacebookUser> {
    const data = await this.request<any>(`/${psid}`, {
      fields: 'first_name,last_name,profile_pic'
    })

    return {
      id: data.id,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      profilePic: data.profile_pic || '',
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
    }
  }

  async getConversations(pageId: string): Promise<FacebookConversation[]> {
    try {
      const data = await this.request<any>(`/${pageId}/conversations`, {
        fields: 'id,participants,updated_time'
      })

      return data.data?.map((conv: any) => ({
        id: conv.id,
        participants: conv.participants?.data || [],
        lastMessage: null,
        updatedTime: conv.updated_time ? new Date(conv.updated_time).getTime() : undefined
      })) || []
    } catch (e) {
      console.error('Error fetching conversations:', e)
      return []
    }
  }

  async getConversationMessages(conversationId: string, limit = 25): Promise<FacebookAPIMessage[]> {
    try {
      const data = await this.request<any>(`/${conversationId}/messages`, {
        fields: 'id,message,from,to,created_time',
        limit: String(limit)
      })

      return data.data?.map((msg: any) => ({
        id: msg.id,
        message: msg.message,
        from: msg.from,
        to: msg.to,
        created_time: msg.created_time
      })) || []
    } catch (e) {
      console.error('Error fetching messages:', e)
      return []
    }
  }

  async sendMessage(psid: string, message: string): Promise<{ message_id: string }> {
    const response = await fetch(`${FACEBOOK_API_BASE}/me/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id: psid },
        message: { text: message },
        messaging_type: 'RESPONSE',
        access_token: this.accessToken
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to send message: ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getPageInfo(pageId: string): Promise<{ id: string; name: string }> {
    const data = await this.request<any>(`/${pageId}`, {
      fields: 'id,name'
    })
    return {
      id: data.id,
      name: data.name
    }
  }
}

export function createFacebookAPI(accessToken?: string): FacebookAPI {
  return new FacebookAPI(accessToken)
}

export const facebookAPI = new FacebookAPI()
