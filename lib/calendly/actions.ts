'use server'

import type { CalendlyEvent, CalendlyEventsResponse } from '@/lib/calendly/types'

const CALENDLY_API_BASE = 'https://api.calendly.com'

export interface FetchCalendlyEventsParams {
  token: string
  minStartTime?: string
  maxStartTime?: string
  count?: number
}

export async function fetchCalendlyEvents({
  token,
  minStartTime,
  maxStartTime,
  count = 50
}: FetchCalendlyEventsParams): Promise<{
  success: boolean
  events?: CalendlyEvent[]
  pagination?: CalendlyEventsResponse['pagination']
  error?: string
}> {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    const params = new URLSearchParams({
      status: 'active',
      min_start_time: minStartTime || new Date().toISOString(),
      sort_by: 'start_time',
      count: String(count)
    })

    if (maxStartTime) {
      params.set('max_start_time', maxStartTime)
    }

    const response = await fetch(`${CALENDLY_API_BASE}/scheduled_events?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return { 
        success: false, 
        error: `Error de Calendly API: ${response.status}` 
      }
    }

    const data = await response.json()
    
    return {
      success: true,
      events: data.data || [],
      pagination: data.pagination || {}
    }
  } catch (error) {
    console.error('Error fetching Calendly events:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}

export async function fetchCalendlyUser(token: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    const response = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return { success: false, error: 'Error al obtener usuario' }
    }

    const data = await response.json()
    return { success: true, user: data.data }
  } catch (error) {
    console.error('Error fetching Calendly user:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}

export async function fetchCalendlyEventTypes(token: string, userUri?: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    const params = new URLSearchParams()
    if (userUri) {
      params.set('user', userUri)
    }

    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await fetch(`${CALENDLY_API_BASE}/event_types${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return { success: false, error: 'Error al obtener tipos de evento' }
    }

    const data = await response.json()
    return { success: true, eventTypes: data.data || [] }
  } catch (error) {
    console.error('Error fetching Calendly event types:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}

export async function cancelCalendlyEvent(token: string, eventUuid: string, reason?: string) {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    const response = await fetch(`${CALENDLY_API_BASE}/scheduled_events/${eventUuid}/cancellation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })

    if (!response.ok) {
      return { success: false, error: 'Error al cancelar evento' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error cancelling Calendly event:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}
