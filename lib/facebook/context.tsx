'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { FacebookConversation, FacebookStoredMessage, FacebookUser } from './types'

interface FacebookContextType {
  isConnected: boolean
  accessToken: string
  pageId: string
  pageName: string
  conversations: FacebookConversation[]
  messages: Record<string, FacebookStoredMessage[]>
  contacts: Record<string, FacebookUser>
  connect: (token: string, pageId: string, pageName: string) => void
  disconnect: () => void
  setConversations: (convs: FacebookConversation[]) => void
  addMessage: (conversationId: string, message: FacebookStoredMessage) => void
  getMessages: (conversationId: string) => FacebookStoredMessage[]
  sendMessage: (recipientId: string, message: string) => Promise<boolean>
}

const STORAGE_KEY = 'facebook-chat-state'

const defaultContext: FacebookContextType = {
  isConnected: false,
  accessToken: '',
  pageId: '',
  pageName: '',
  conversations: [],
  messages: {},
  contacts: {},
  connect: () => {},
  disconnect: () => {},
  setConversations: () => {},
  addMessage: () => {},
  getMessages: () => [],
  sendMessage: async () => false
}

const FacebookContext = createContext<FacebookContextType>(defaultContext)

export function FacebookProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState('')
  const [pageId, setPageId] = useState('')
  const [pageName, setPageName] = useState('')
  const [conversations, setConversations] = useState<FacebookConversation[]>([])
  const [messages, setMessages] = useState<Record<string, FacebookStoredMessage[]>>({})
  const [contacts, setContacts] = useState<Record<string, FacebookUser>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const loadState = async () => {
      console.log('[Facebook Context] Loading state...')
      
      // Siempre obtener credenciales del servidor primero
      try {
        const res = await fetch('/api/facebook/auth')
        const data = await res.json()
        console.log('[Facebook Context] Auth response:', data)
        
        if (data.connected) {
          setAccessToken(data.accessToken || '')
          setPageId(data.pageId || '')
          setPageName(data.pageName || '')
          console.log('[Facebook Context] Loaded from server. pageId:', data.pageId)
          
          // Guardar en localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            accessToken: data.accessToken,
            pageId: data.pageId,
            pageName: data.pageName,
            conversations: [],
            messages: {},
            contacts: {}
          }))
          return
        }
      } catch (e) {
        console.error('Error fetching Facebook credentials', e)
      }
      
      // Fallback a localStorage
      let stored = localStorage.getItem(STORAGE_KEY)
      let parsed = stored ? JSON.parse(stored) : {}

      setAccessToken(parsed.accessToken || '')
      setPageId(parsed.pageId || '')
      setPageName(parsed.pageName || '')
      setConversations(parsed.conversations || [])
      setMessages(parsed.messages || {})
      setContacts(parsed.contacts || {})
      console.log('[Facebook Context] Loaded from localStorage. pageId:', parsed.pageId)
    }

    loadState()
  }, [])

  // Sync cuando se carga el accessToken
  useEffect(() => {
    if (accessToken && pageId) {
      console.log('[Facebook Context] Token loaded, triggering sync...')
      const doSync = async () => {
        try {
          console.log('[Facebook] Starting sync from API...')
          const syncRes = await fetch('/api/facebook/sync')
          const syncData = await syncRes.json()
          console.log('[Facebook] Sync response:', syncData)
          if (syncData.success) {
            console.log('[Facebook] Synced from API:', syncData.messages, 'messages')
          } else {
            console.log('[Facebook] Sync error:', syncData.error)
          }
        } catch (e) {
          console.error('[Facebook] Error syncing from API:', e)
        }
      }
      doSync()
    }
  }, [accessToken, pageId])

  useEffect(() => {
    const state = { accessToken, pageId, pageName, conversations, messages, contacts }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    setIsConnected(!!accessToken && !!pageId)
  }, [accessToken, pageId, pageName, conversations, messages, contacts])

  const connect = useCallback((token: string, pid: string, pname: string) => {
    setAccessToken(token)
    setPageId(pid)
    setPageName(pname)
  }, [])

  const disconnect = useCallback(() => {
    setAccessToken('')
    setPageId('')
    setPageName('')
    setConversations([])
    setMessages({})
    setContacts({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const addMessage = useCallback((conversationId: string, message: FacebookStoredMessage) => {
    setMessages(prev => {
      const existing = prev[conversationId] || []
      if (existing.some(m => m.id === message.id)) return prev
      return {
        ...prev,
        [conversationId]: [...existing, message]
      }
    })
  }, [])

  const getMessages = useCallback((conversationId: string): FacebookStoredMessage[] => {
    return messages[conversationId] || []
  }, [messages])

  const sendMessage = useCallback(async (recipientId: string, message: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/facebook/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, message })
      })

      if (!res.ok) {
        const error = await res.json()
        console.error('Failed to send message:', error)
        return false
      }

      const result = await res.json()
      
      const tempMessage: FacebookStoredMessage = {
        id: result.messageId || `temp_${Date.now()}`,
        conversationId: recipientId,
        senderId: 'business',
        text: message,
        timestamp: Date.now(),
        isFromMe: true
      }

      // Guardar con recipientId
      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), tempMessage].sort((a, b) => a.timestamp - b.timestamp)
      }))

      // También buscar la conversación por recipientId y guardar ahí
      const conv = conversations.find(c => 
        c.participants?.some(p => p.id === recipientId)
      )
      if (conv) {
        setMessages(prev => ({
          ...prev,
          [conv.id]: [...(prev[conv.id] || []), tempMessage].sort((a, b) => a.timestamp - b.timestamp)
        }))
      }

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }, [conversations])

  const fetchContactProfile = useCallback(async (psid: string) => {
    if (contacts[psid] || !accessToken) {
      return
    }

    try {
      const res = await fetch(`/api/facebook/message?userId=${psid}`)
      if (res.ok) {
        const profile = await res.json()
        setContacts(prev => ({
          ...prev,
          [psid]: {
            id: profile.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            profilePic: profile.profile_pic || '',
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || psid
          }
        }))
      }
    } catch (e) {
      console.error('Error fetching contact profile:', e)
    }
  }, [accessToken, contacts])

  const syncContactsFromConversations = useCallback(async () => {
    if (!accessToken) return

    try {
      const res = await fetch('/api/facebook/conversations')
      if (res.ok) {
        const data = await res.json()
        if (data.conversations && Array.isArray(data.conversations)) {
          const newContacts: Record<string, FacebookUser> = {}
          
          for (const conv of data.conversations) {
            for (const participant of conv.participants || []) {
              if (participant.id && !contacts[participant.id]) {
                newContacts[participant.id] = {
                  id: participant.id,
                  firstName: participant.first_name || '',
                  lastName: participant.last_name || '',
                  profilePic: participant.profile_pic || '',
                  name: `${participant.first_name || ''} ${participant.last_name || ''}`.trim() || participant.id
                }
              }
            }
          }

          if (Object.keys(newContacts).length > 0) {
            setContacts(prev => ({ ...prev, ...newContacts }))
          }
        }
      }
    } catch (e) {
      console.error('Error syncing contacts from conversations:', e)
    }
  }, [accessToken, contacts])

  useEffect(() => {
    const syncMessages = async () => {
      try {
        const res = await fetch('/api/webhooks/facebook/messages')
        const data = await res.json()
        
        if (data.messages && Array.isArray(data.messages)) {
          const grouped: Record<string, FacebookStoredMessage[]> = {}
          const convIds = new Set<string>()

          for (const msg of data.messages) {
            const convId = msg.conversationId || msg.senderId
            if (!grouped[convId]) {
              grouped[convId] = []
            }
            if (!grouped[convId].some(m => m.id === msg.id)) {
              grouped[convId].push(msg)
              convIds.add(convId)
            }
          }
          
          setMessages(prev => {
            const updated = { ...prev }
            let hasNew = false
            for (const convId in grouped) {
              const existing = prev[convId] || []
              const newMsgs = grouped[convId].filter(m => !existing.some(e => e.id === m.id))
              if (newMsgs.length > 0) {
                updated[convId] = [...existing, ...newMsgs].sort((a, b) => a.timestamp - b.timestamp)
                hasNew = true
              }
            }
            return hasNew ? updated : prev
          })

          if (convIds.size > 0) {
            setConversations(prev => {
              const existingIds = new Set(prev.map(c => c.id))
              const newConvs = Array.from(convIds)
                .filter(id => !existingIds.has(id))
                .map(id => {
                  const contact = contacts[id]
                  return {
                    id,
                    participants: contact ? [contact] : [{ firstName: id, lastName: '', profilePic: '', id }],
                    lastMessage: grouped[id]?.[grouped[id].length - 1] ? {
                      id: grouped[id][grouped[id].length - 1].id,
                      text: grouped[id][grouped[id].length - 1].text,
                      from: { id: grouped[id][grouped[id].length - 1].senderId },
                      to: { id },
                      timestamp: grouped[id][grouped[id].length - 1].timestamp
                    } : null
                  }
                })
              return [...prev, ...newConvs]
            })

            if (accessToken) {
              convIds.forEach(convId => fetchContactProfile(convId))
              syncContactsFromConversations()
            }
          }
        }
      } catch (e) {
        console.error('Error syncing from webhook:', e)
      }

      if (accessToken) {
        try {
          console.log('[Facebook] Starting sync from API...')
          const syncRes = await fetch('/api/facebook/sync')
          const syncData = await syncRes.json()
          console.log('[Facebook] Sync response:', syncData)
          if (syncData.success) {
            console.log('[Facebook] Synced from API:', syncData.messages, 'messages')
            // Guardar mensajes en localStorage
            const stored = localStorage.getItem('facebook-messages')
            let existing = stored ? JSON.parse(stored) : { messages: [] }
            for (const msg of syncData.messages || []) {
              if (!existing.messages.some((m: any) => m.id === msg.id)) {
                existing.messages.push(msg)
              }
            }
            localStorage.setItem('facebook-messages', JSON.stringify(existing))
          } else {
            console.log('[Facebook] Sync error:', syncData.error)
          }
        } catch (e) {
          console.error('[Facebook] Error syncing from API:', e)
        }
      }
    }

    syncMessages()
    const interval = setInterval(syncMessages, 500)

    if (accessToken) {
      syncContactsFromConversations()
    }

    return () => clearInterval(interval)
  }, [accessToken, contacts, fetchContactProfile, syncContactsFromConversations])

  return (
    <FacebookContext.Provider value={{
      isConnected,
      accessToken,
      pageId,
      pageName,
      conversations,
      messages,
      contacts,
      connect,
      disconnect,
      setConversations,
      addMessage,
      getMessages,
      sendMessage
    }}>
      {children}
    </FacebookContext.Provider>
  )
}

export function useFacebook() {
  return useContext(FacebookContext)
}
