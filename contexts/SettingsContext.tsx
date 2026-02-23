'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Integration {
  id: string
  name: string
  icon: string
  enabled: boolean
  token?: string
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
}

export interface Widget {
  id: string
  name: string
  category: string
  enabled: boolean
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  language: string
  twoFactor: boolean
  integrations: Integration[]
  widgets: Widget[]
}

const ENV_TOKENS: Record<string, { token?: string; webhookUrl?: string }> = {
  calendly: {
    token: process.env.NEXT_PUBLIC_CALENDLY_TOKEN || '',
    webhookUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || ''
  }
}

const defaultIntegrations: Integration[] = [
  { id: 'instagram', name: 'Instagram', icon: 'IoLogoInstagram', enabled: false },
  { id: 'facebook', name: 'Facebook', icon: 'IoLogoFacebook', enabled: false },
  { id: 'tiktok', name: 'TikTok', icon: 'IoLogoTiktok', enabled: false },
  { id: 'twitter', name: 'Twitter / X', icon: 'IoLogoTwitter', enabled: false },
  { id: 'linkedin', name: 'LinkedIn', icon: 'IoLogoLinkedin', enabled: false },
  { id: 'youtube', name: 'YouTube', icon: 'IoLogoYoutube', enabled: false },
  { id: 'pinterest', name: 'Pinterest', icon: 'IoLogoPinterest', enabled: false },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: 'IoLogoWhatsapp', enabled: false },
  { id: 'calendly', name: 'Calendly', icon: 'IoCalendar', enabled: true }
]

const defaultWidgets: Widget[] = [
  { id: 'statsGrid', name: 'Estadísticas Generales', category: 'general', enabled: true },
  { id: 'calendarWidget', name: 'Calendario', category: 'general', enabled: true },
  { id: 'campaignPerformance', name: 'Performance de Campañas', category: 'marketing', enabled: true },
  { id: 'upcomingPosts', name: 'Próximas Publicaciones', category: 'marketing', enabled: true },
  { id: 'pendingComments', name: 'Comentarios Pendientes', category: 'marketing', enabled: true },
  { id: 'realTimeVisitors', name: 'Visitantes en Tiempo Real', category: 'analytics', enabled: true },
  { id: 'topPages', name: 'Páginas Más Visitadas', category: 'analytics', enabled: true },
  { id: 'statsRing', name: 'Progreso de Objetivos', category: 'analytics', enabled: true },
  { id: 'activeProjects', name: 'Proyectos Activos', category: 'projects', enabled: true },
  { id: 'tasksOverview', name: 'Tareas por Estado', category: 'projects', enabled: true },
  { id: 'progressCard', name: 'Meta Mensual', category: 'projects', enabled: true },
  { id: 'onlineMembers', name: 'Miembros Online', category: 'team', enabled: true },
  { id: 'teamActivity', name: 'Actividad Reciente', category: 'team', enabled: true },
  { id: 'statsSegments', name: 'Distribución de Audiencia', category: 'team', enabled: true },
  { id: 'revenueOverview', name: 'Resumen Financiero', category: 'finance', enabled: true },
  { id: 'pendingInvoices', name: 'Facturas Recientes', category: 'finance', enabled: true },
  { id: 'cashFlow', name: 'Flujo de Caja', category: 'finance', enabled: true }
]

const defaultSettings: Settings = {
  theme: 'auto',
  notifications: true,
  language: 'es',
  twoFactor: false,
  integrations: defaultIntegrations,
  widgets: defaultWidgets
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  updateIntegration: (id: string, updates: Partial<Integration>) => void
  updateWidget: (id: string, updates: Partial<Widget>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'aion-settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSettings({
          ...defaultSettings,
          ...parsed,
          integrations: defaultIntegrations.map(int => {
            const storedInt = parsed.integrations?.find((i: Integration) => i.id === int.id)
            const envTokens = ENV_TOKENS[int.id]
            return {
              ...int,
              ...storedInt,
              token: envTokens?.token || storedInt?.token || '',
              webhookUrl: envTokens?.webhookUrl || storedInt?.webhookUrl || ''
            }
          }),
          widgets: defaultWidgets.map(widget => ({
            ...widget,
            ...(parsed.widgets?.find((w: Widget) => w.id === widget.id) || {})
          }))
        })
      } catch (e) {
        console.error('Error parsing settings from localStorage', e)
      }
    } else {
      setSettings({
        ...defaultSettings,
        integrations: defaultIntegrations.map(int => ({
          ...int,
          ...(ENV_TOKENS[int.id] || {})
        }))
      })
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const settingsToStore = {
        ...settings,
        integrations: settings.integrations.map(int => {
          const envTokens = ENV_TOKENS[int.id]
          return {
            ...int,
            token: envTokens?.token ? undefined : int.token,
            webhookUrl: envTokens?.webhookUrl ? undefined : int.webhookUrl
          }
        })
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore))
    }
  }, [settings, isLoaded])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const updateIntegration = (id: string, updates: Partial<Integration>) => {
    setSettings(prev => ({
      ...prev,
      integrations: prev.integrations.map(int => {
        if (int.id !== id) return int
        const envTokens = ENV_TOKENS[id]
        return {
          ...int,
          ...updates,
          token: envTokens?.token || updates.token || int.token,
          webhookUrl: envTokens?.webhookUrl || updates.webhookUrl || int.webhookUrl
        }
      })
    }))
  }

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setSettings(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === id ? { ...widget, ...updates } : widget
      )
    }))
  }

  const resetSettings = () => {
    setSettings({
      ...defaultSettings,
      integrations: defaultIntegrations.map(int => ({
        ...int,
        ...(ENV_TOKENS[int.id] || {})
      }))
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateIntegration, updateWidget, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
