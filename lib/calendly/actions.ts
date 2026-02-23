'use server'

import type { CalendlyEvent, CalendlyUser } from '@/lib/calendly/types'

const CALENDLY_API_BASE = 'https://api.calendly.com'

export interface FetchCalendlyEventsParams {
  token: string
  minStartTime?: string
  maxStartTime?: string
  count?: number
}

export async function fetchCalendlyUser(token: string): Promise<{
  success: boolean
  user?: CalendlyUser
  error?: string
}> {
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
      const errorData = await response.json().catch(() => ({}))
      console.error('Calendly API error:', errorData)
      return { success: false, error: `Error ${response.status}: ${errorData?.message || 'Error al obtener usuario'}` }
    }

    const data = await response.json()
    return { success: true, user: data.resource }
  } catch (error) {
    console.error('Error fetching Calendly user:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}

export async function fetchCalendlyEvents({
  token,
  minStartTime,
  maxStartTime,
  count = 50
}: FetchCalendlyEventsParams): Promise<{
  success: boolean
  events?: CalendlyEvent[]
  error?: string
}> {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    // First get the user to get the user URI
    const userResult = await fetchCalendlyUser(token)
    if (!userResult.success || !userResult.user) {
      return { success: false, error: userResult.error || 'No se pudo obtener el usuario' }
    }

    const userUri = userResult.user.uri

    // Now fetch events with the user URI
    const params = new URLSearchParams({
      user: userUri,
      status: 'active',
      min_start_time: minStartTime || new Date().toISOString(),
      sort_by: 'start_time',
      count: String(count)
    })

    if (maxStartTime) {
      params.set('max_start_time', maxStartTime)
    }

    console.log('Fetching Calendly events with params:', params.toString())

    const response = await fetch(`${CALENDLY_API_BASE}/scheduled_events?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Calendly API error:', errorData)
      return { 
        success: false, 
        error: `Error ${response.status}: ${errorData?.message || 'Error al obtener eventos'}` 
      }
    }

    const data = await response.json()
    console.log('Calendly events response:', data)
    
    return {
      success: true,
      events: data.collection || []
    }
  } catch (error) {
    console.error('Error fetching Calendly events:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}

export async function fetchCalendlyEventTypes(token: string): Promise<{
  success: boolean
  eventTypes?: Array<{
    uri: string
    name: string
    duration: number
    scheduling_url: string
  }>
  error?: string
}> {
  try {
    if (!token) {
      return { success: false, error: 'Token de acceso requerido' }
    }

    // First get the user to get the user URI
    const userResult = await fetchCalendlyUser(token)
    if (!userResult.success || !userResult.user) {
      return { success: false, error: userResult.error || 'No se pudo obtener el usuario' }
    }

    const userUri = userResult.user.uri

    const response = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { success: false, error: `Error ${response.status}: ${errorData?.message || 'Error al obtener tipos de evento'}` }
    }

    const data = await response.json()
    return { 
      success: true, 
      eventTypes: (data.collection || []).map((et: any) => ({
        uri: et.uri,
        name: et.name,
        duration: et.duration,
        scheduling_url: et.scheduling_url
      }))
    }
  } catch (error) {
    console.error('Error fetching Calendly event types:', error)
    return { success: false, error: 'Error al conectar con Calendly' }
  }
}