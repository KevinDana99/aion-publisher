import type {
  CalendlyEvent,
  CalendlyEventType,
  CalendlyEventsResponse,
  CalendlyEventTypesResponse,
  CalendlyUserResponse,
  CalendlyFetchEventsParams
} from './types'

const CALENDLY_API_BASE = 'https://api.calendly.com'

export class CalendlyService {
  private accessToken: string | null = null

  constructor(accessToken?: string) {
    this.accessToken = accessToken || null
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Calendly access token not configured')
    }

    const response = await fetch(`${CALENDLY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Calendly API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    return response.json()
  }

  async getCurrentUser(): Promise<CalendlyUserResponse> {
    return this.request<CalendlyUserResponse>('/users/me')
  }

  async getEventTypes(userUri?: string): Promise<CalendlyEventTypesResponse> {
    const params = new URLSearchParams()
    if (userUri) {
      params.append('user', userUri)
    }
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<CalendlyEventTypesResponse>(`/event_types${query}`)
  }

  async getEvents(params: CalendlyFetchEventsParams = {}): Promise<CalendlyEventsResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<CalendlyEventsResponse>(`/scheduled_events${query}`)
  }

  async getEvent(eventUuid: string): Promise<{ resource: 'event'; data: CalendlyEvent }> {
    return this.request<{ resource: 'event'; data: CalendlyEvent }>(`/scheduled_events/${eventUuid}`)
  }

  async cancelEvent(eventUuid: string, reason?: string): Promise<void> {
    await this.request(`/scheduled_events/${eventUuid}/cancellation`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }

  async getUpcomingEvents(userUri: string, count = 10): Promise<CalendlyEventsResponse> {
    const now = new Date().toISOString()
    return this.getEvents({
      user: userUri,
      status: 'active',
      min_start_time: now,
      sort_by: 'start_time',
      count
    })
  }

  async getEventsByDateRange(
    userUri: string,
    startDate: Date,
    endDate: Date
  ): Promise<CalendlyEventsResponse> {
    return this.getEvents({
      user: userUri,
      status: 'active',
      min_start_time: startDate.toISOString(),
      max_start_time: endDate.toISOString(),
      sort_by: 'start_time'
    })
  }

  async getEventsForMonth(userUri: string, year: number, month: number): Promise<CalendlyEventsResponse> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    return this.getEventsByDateRange(userUri, startDate, endDate)
  }
}

export function parseCalendlyEvent(event: CalendlyEvent) {
  const startTime = new Date(event.start_time)
  const endTime = new Date(event.end_time)
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

  return {
    id: event.uri.split('/').pop() || event.uri,
    title: event.name,
    date: startTime,
    time: startTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    duration,
    status: (event.status === 'active' ? 'pending' : 'cancelled') as 'pending' | 'completed' | 'cancelled',
    location: event.location?.join_url || event.location?.location,
    attendees: event.event_guests?.map(g => g.name || g.email) || [],
    description: '',
    type: 'meeting' as const
  }
}

export function createCalendlyService(accessToken?: string): CalendlyService {
  return new CalendlyService(accessToken)
}

export const calendlyService = new CalendlyService()
