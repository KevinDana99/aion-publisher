export interface CalendlyEvent {
  uri: string
  name: string
  status: 'active' | 'canceled'
  tracking: {
    utm_campaign?: string
    utm_source?: string
    utm_medium?: string
    utm_content?: string
    utm_term?: string
  }
  created_at: string
  updated_at: string
  event_memberships: Array<{
    user: string
    user_email: string
    user_name: string
    user_type: string
  }>
  event_guests: Array<{
    email: string
    name: string
    status: string
    created_at: string
    updated_at: string
  }>
  start_time: string
  end_time: string
  location?: {
    type: string
    location?: string
    join_url?: string
    status?: string
  }
  canceled?: boolean
  cancel_reason?: string
  canceler_name?: string
  canceled_at?: string
  event_type: string
  uri_url: string
}

export interface CalendlyEventType {
  uri: string
  name: string
  active: boolean
  duration: number
  kind: string
  pooling_type?: string
  type: string
  scheduling_url: string
  created_at: string
  updated_at: string
  secret: boolean
  color: string
  profile: {
    type: string
    name: string
    owner: string
  }
  owner: string
  owner_type: string
  description_html?: string
  description_plain?: string
}

export interface CalendlyUser {
  uri: string
  name: string
  slug: string
  email: string
  scheduling_url: string
  timezone: string
  avatar_url: string
  created_at: string
  updated_at: string
}

export interface CalendlyWebhook {
  uri: string
  callback_url: string
  created_at: string
  updated_at: string
  state: 'active' | 'disabled'
  events: string[]
  scope: string
  organization: string
  user?: string
  signing_key: string
}

export interface CalendlyPagination {
  count: number
  next_page?: string
  previous_page?: string
  next_page_token?: string
  previous_page_token?: string
}

export interface CalendlyEventsResponse {
  resource: 'events'
  pagination: CalendlyPagination
  data: CalendlyEvent[]
}

export interface CalendlyEventTypesResponse {
  resource: 'event_types'
  pagination: CalendlyPagination
  data: CalendlyEventType[]
}

export interface CalendlyUserResponse {
  resource: 'user'
  data: CalendlyUser
}

export interface CalendlyWebhookResponse {
  resource: 'webhook_subscription'
  data: CalendlyWebhook[]
}

export interface CalendlyConfig {
  accessToken?: string
  refreshToken?: string
  organizationUri?: string
  userUri?: string
}

export interface CalendlyFetchEventsParams {
  user?: string
  organization?: string
  invitee_email?: string
  status?: 'active' | 'canceled'
  sort_by?: 'start_time' | 'created_at'
  min_start_time?: string
  max_start_time?: string
  count?: number
  page_token?: string
}
