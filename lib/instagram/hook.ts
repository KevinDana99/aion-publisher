'use client'

import { useState, useEffect, useCallback } from 'react'
import type { InstagramChatState, InstagramConversation, InstagramStoredMessage, InstagramUser } from './types'

const STORAGE_KEY = 'instagram-chat-state'

const defaultState: InstagramChatState = {
  accessToken: '',
  userId: '',
  username: '',
  conversations: [],
  messages: {},
  lastUpdate: 0
}

export function useInstagramChat() {
  const [state, setState] = useState<InstagramChatState>(defaultState)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setState(parsed)
        setIsConnected(!!parsed.accessToken && !!parsed.userId)
      } catch (e) {
        console.error('Error parsing Instagram chat state', e)
      }
    }
  }, [])

  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      setIsConnected(true)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      setIsConnected(false)
    }
  }, [state])

  const connect = useCallback((accessToken: string, userId: string, username: string) => {
    setState(prev => ({
      ...prev,
      accessToken,
      userId,
      username
    }))
  }, [])

  const disconnect = useCallback(() => {
    setState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const setConversations = useCallback((conversations: InstagramConversation[]) => {
    setState(prev => ({
      ...prev,
      conversations,
      lastUpdate: Date.now()
    }))
  }, [])

  const addMessage = useCallback((conversationId: string, message: InstagramStoredMessage) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [...(prev.messages[conversationId] || []), message]
      },
      lastUpdate: Date.now()
    }))
  }, [])

  const addMessages = useCallback((conversationId: string, messages: InstagramStoredMessage[]) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: messages
      },
      lastUpdate: Date.now()
    }))
  }, [])

  const getMessages = useCallback((conversationId: string): InstagramStoredMessage[] => {
    return state.messages[conversationId] || []
  }, [state.messages])

  const updateFromWebhook = useCallback((webhookData: {
    userId: string
    messageId: string
    message: string
    timestamp: number
  }) => {
    const conversationId = webhookData.userId
    
    const newMessage: InstagramStoredMessage = {
      id: webhookData.messageId,
      conversationId,
      senderId: webhookData.userId,
      text: webhookData.message,
      timestamp: webhookData.timestamp,
      isFromMe: false
    }

    setState(prev => {
      const existing = prev.messages[conversationId] || []
      const alreadyExists = existing.some(m => m.id === webhookData.messageId)
      
      if (alreadyExists) return prev

      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: {
              id: webhookData.messageId,
              text: webhookData.message,
              from: { id: webhookData.userId },
              to: { id: prev.userId },
              timestamp: webhookData.timestamp
            }
          }
        }
        return conv
      })

      return {
        ...prev,
        conversations: updatedConversations,
        messages: {
          ...prev.messages,
          [conversationId]: [...existing, newMessage]
        },
        lastUpdate: Date.now()
      }
    })
  }, [])

  return {
    state,
    isLoading,
    isConnected,
    connect,
    disconnect,
    setConversations,
    addMessage,
    addMessages,
    getMessages,
    updateFromWebhook
  }
}
