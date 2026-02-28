'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { InstagramConversation, InstagramStoredMessage, InstagramUser } from './types'

interface InstagramContextType {
  isConnected: boolean
  accessToken: string
  userId: string
  username: string
  conversations: InstagramConversation[]
  messages: Record<string, InstagramStoredMessage[]>
  contacts: Record<string, InstagramUser>
  connect: (token: string, userId: string, username: string) => void
  disconnect: () => void
  setConversations: (convs: InstagramConversation[]) => void
  addMessage: (conversationId: string, message: InstagramStoredMessage) => void
  getMessages: (conversationId: string) => InstagramStoredMessage[]
  sendMessage: (recipientId: string, message: string) => Promise<boolean>
}

const STORAGE_KEY = 'instagram-chat-state'

const defaultContext: InstagramContextType = {
  isConnected: false,
  accessToken: '',
  userId: '',
  username: '',
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

const InstagramContext = createContext<InstagramContextType>(defaultContext)

export function InstagramProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [conversations, setConversations] = useState<InstagramConversation[]>([])
  const [messages, setMessages] = useState<Record<string, InstagramStoredMessage[]>>({})
  const [contacts, setContacts] = useState<Record<string, InstagramUser>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const loadState = async () => {
      try {
        const res = await fetch('/api/instagram/auth')
        const data = await res.json()
        
        if (data.connected) {
          setUserId(data.userId || '')
          setUsername(data.username || '')
          setAccessToken(data.accessToken || '')
          setIsConnected(true)
        }
      } catch (e) {
        console.error('Error fetching Instagram credentials', e)
      }
    }
    
    loadState()
  }, [])

  useEffect(() => {
    setIsConnected(!!accessToken && !!userId)
  }, [accessToken, userId])

  const connect = useCallback((token: string, uid: string, user: string) => {
    setAccessToken(token)
    setUserId(uid)
    setUsername(user)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await fetch('/api/instagram/auth', { method: 'DELETE' })
    } catch (e) {
      console.error('Error disconnecting:', e)
    }
    setAccessToken('')
    setUserId('')
    setUsername('')
    setConversations([])
    setMessages({})
    setContacts({})
    setIsConnected(false)
  }, [])

  const addMessage = useCallback((conversationId: string, message: InstagramStoredMessage) => {
    setMessages(prev => {
      const existing = prev[conversationId] || []
      if (existing.some(m => m.id === message.id)) return prev
      return {
        ...prev,
        [conversationId]: [...existing, message]
      }
    })
  }, [])

  const getMessages = useCallback((conversationId: string): InstagramStoredMessage[] => {
    return messages[conversationId] || []
  }, [messages])

  const sendMessage = useCallback(async (recipientId: string, message: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/instagram/message', {
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
      
      const tempMessage: InstagramStoredMessage = {
        id: result.messageId || `temp_${Date.now()}`,
        conversationId: recipientId,
        senderId: 'business',
        text: message,
        timestamp: Date.now(),
        isFromMe: true
      }

      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), tempMessage].sort((a, b) => a.timestamp - b.timestamp)
      }))

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      return false
    }
  }, [])

  const fetchContactProfile = useCallback(async (userId: string) => {
    if (contacts[userId] || !accessToken) {
      return
    }

    try {
      const res = await fetch(`/api/instagram/message?userId=${userId}`)
      if (res.ok) {
        const profile = await res.json()
        setContacts(prev => ({
          ...prev,
          [userId]: {
            id: profile.id,
            username: profile.username || userId,
            accountType: profile.account_type || 'PERSONAL',
            mediaCount: profile.media_count,
            profilePicture: profile.profile_picture_url,
            name: profile.name
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
      const res = await fetch('/api/instagram/conversations')
      if (res.ok) {
        const data = await res.json()
        if (data.conversations && Array.isArray(data.conversations)) {
          const newContacts: Record<string, InstagramUser> = {}
          
          for (const conv of data.conversations) {
            for (const participant of conv.participants || []) {
              if (participant.id && !contacts[participant.id]) {
                newContacts[participant.id] = {
                  id: participant.id,
                  username: participant.username || participant.id,
                  accountType: participant.account_type || 'PERSONAL',
                  profilePicture: participant.profile_picture_url,
                  name: participant.name
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
        const res = await fetch('/api/webhooks/instagram/messages')
        const data = await res.json()
        
        const messagesArray = data.messages || []
        
        if (messagesArray.length > 0) {
          const grouped: Record<string, InstagramStoredMessage[]> = {}
          const convIds = new Set<string>()

          for (const msg of messagesArray) {
            const convId = msg.conversationId || msg.senderId
            if (!grouped[convId]) {
              grouped[convId] = []
            }
            if (!grouped[convId].some((m: InstagramStoredMessage) => m.id === msg.id)) {
              grouped[convId].push(msg)
              convIds.add(convId)
            }
          }
          
          setMessages(prev => {
            const updated = { ...prev }
            let hasNew = false
            for (const convId in grouped) {
              const existing = prev[convId] || []
              const newMsgs = grouped[convId].filter((m: InstagramStoredMessage) => !existing.some((e: InstagramStoredMessage) => e.id === m.id))
              if (newMsgs.length > 0) {
                updated[convId] = [...existing, ...newMsgs].sort((a: InstagramStoredMessage, b: InstagramStoredMessage) => a.timestamp - b.timestamp)
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
                .map(id => ({
                  id,
                  participants: [{ id, username: id.slice(0, 8), accountType: '' }],
                  lastMessage: null
                }))
              return newConvs.length > 0 ? [...prev, ...newConvs] : prev
            })
          }
        }
      } catch (e) {
        console.error('Error syncing messages:', e)
      }
    }

    syncMessages()
    const interval = setInterval(syncMessages, 5000)
    
    return () => clearInterval(interval)
  }, [accessToken, contacts, fetchContactProfile, syncContactsFromConversations])

  return (
    <InstagramContext.Provider value={{
      isConnected,
      accessToken,
      userId,
      username,
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
    </InstagramContext.Provider>
  )
}

export function useInstagram() {
  return useContext(InstagramContext)
}
