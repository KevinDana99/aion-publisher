'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Paper,
  Text,
  Avatar,
  Group,
  Stack,
  TextInput,
  ActionIcon,
  ScrollArea,
  Badge,
  Switch,
  Divider,
  useMantineColorScheme,
  useMantineTheme
} from '@mantine/core'
import {
  IoSend,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoWhatsapp,
  IoFilter,
  IoMusicalNotes,
  IoImage
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import { useInstagram } from '@/lib/instagram/context'
import { useFacebook } from '@/lib/facebook/context'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isFromUser: boolean
  attachments?: {
    type: 'image' | 'audio' | 'video' | 'file'
    url: string
  }[]
}

interface Conversation {
  id: string
  recipientId?: string
  contactName: string
  contactAvatar: string | null
  platform: 'instagram' | 'facebook' | 'whatsapp'
  messages: Message[]
  lastMessage: string
  unread: number
}

const platformIcons: Record<string, typeof IoLogoInstagram> = {
  instagram: IoLogoInstagram,
  facebook: IoLogoFacebook,
  whatsapp: IoLogoWhatsapp
}

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  whatsapp: '#25D366'
}

const allPlatforms = ['instagram', 'facebook', 'whatsapp'] as const

export default function MessagesWidget() {
  const { settings } = useSettings()
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const isDark = colorScheme === 'dark'
  const instagram = useInstagram()
  const facebook = useFacebook()

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [platformFilters, setPlatformFilters] = useState<Record<string, boolean>>({
    instagram: true,
    facebook: true,
    whatsapp: true
  })

  const conversations: Conversation[] = useMemo(() => {
    const allConvs: Conversation[] = []
    
    if (instagram.isConnected || instagram.conversations.length > 0 || Object.keys(instagram.messages).length > 0) {
      const igConvs = instagram.conversations.map(conv => {
        const contact = instagram.contacts[conv.id]
        const msgs = instagram.messages[conv.id] || []
        return {
          id: conv.id,
          contactName: contact?.username || conv.participants[0]?.username || conv.id.slice(0, 8),
          contactAvatar: contact?.profilePicture || contact?.username?.slice(0, 2).toUpperCase() || conv.participants[0]?.username?.slice(0, 2).toUpperCase() || conv.id.slice(0, 2).toUpperCase(),
          platform: 'instagram' as const,
          messages: msgs.map(m => ({
            id: m.id,
            senderId: m.senderId,
            text: m.text,
            timestamp: new Date(m.timestamp),
            isFromUser: m.isFromMe,
            attachments: m.attachments
          })),
          lastMessage: msgs.length > 0 ? msgs[msgs.length - 1].text : '',
          unread: 0
        }
      })

      const igFromMessages = Object.entries(instagram.messages).map(([convId, msgs]) => {
        const hasIncoming = msgs.some(m => !m.isFromMe)
        if (!hasIncoming) return null
        const contact = instagram.contacts[convId]
        return {
          id: convId,
          contactName: contact?.username || convId.slice(0, 8),
          contactAvatar: contact?.profilePicture || contact?.username?.slice(0, 2).toUpperCase() || convId.slice(0, 2).toUpperCase(),
          platform: 'instagram' as const,
          messages: msgs.map(m => ({
            id: m.id,
            senderId: m.senderId,
            text: m.text,
            timestamp: new Date(m.timestamp),
            isFromUser: m.isFromMe,
            attachments: m.attachments
          })),
          lastMessage: msgs.length > 0 ? msgs[msgs.length - 1].text : '',
          unread: 0
        }
      }).filter(Boolean) as Conversation[]

      allConvs.push(...igConvs, ...igFromMessages)
    }
    
    if (facebook.isConnected || facebook.conversations.length > 0 || Object.keys(facebook.messages).length > 0) {
      const fbConvs = facebook.conversations.map(conv => {
        const contact = facebook.contacts[conv.id]
        const msgs = facebook.messages[conv.id] || []
        const pageId = facebook.pageId || '548959081641341'
        const recipient = conv.participants?.find(p => p.id !== pageId)
        return {
          id: conv.id,
          recipientId: recipient?.id || conv.participants?.[0]?.id,
          contactName: contact?.name || conv.participants[0]?.name || conv.id.slice(0, 8),
          contactAvatar: contact?.profilePic || contact?.firstName?.slice(0, 2).toUpperCase() || conv.participants[0]?.firstName?.slice(0, 2).toUpperCase() || conv.id.slice(0, 2).toUpperCase(),
          platform: 'facebook' as const,
          messages: msgs.map(m => ({
            id: m.id,
            senderId: m.senderId,
            text: m.text,
            timestamp: new Date(m.timestamp),
            isFromUser: m.isFromMe,
            attachments: m.attachments
          })),
          lastMessage: msgs.length > 0 ? msgs[msgs.length - 1].text : '',
          unread: 0
        }
      })

      const fbFromMessages = Object.entries(facebook.messages).map(([convId, msgs]) => {
        const hasIncoming = msgs.some(m => !m.isFromMe)
        if (!hasIncoming) return null
        const contact = facebook.contacts[convId]
        const senderId = msgs.find(m => !m.isFromMe)?.senderId
        return {
          id: convId,
          recipientId: senderId,
          contactName: contact?.name || senderId?.slice(0, 8) || convId.slice(0, 8),
          contactAvatar: contact?.profilePic || contact?.firstName?.slice(0, 2).toUpperCase() || convId.slice(0, 2).toUpperCase(),
          platform: 'facebook' as const,
          messages: msgs.map(m => ({
            id: m.id,
            senderId: m.senderId,
            text: m.text,
            timestamp: new Date(m.timestamp),
            isFromUser: m.isFromMe,
            attachments: m.attachments
          })),
          lastMessage: msgs.length > 0 ? msgs[msgs.length - 1].text : '',
          unread: 0
        }
      }).filter(Boolean) as Conversation[]

      allConvs.push(...fbConvs, ...fbFromMessages)
    }

    const unique = Array.from(new Map(allConvs.map(c => [c.id + c.platform, c])).values())
    
    return unique
  }, [instagram.isConnected, instagram.conversations, instagram.messages, instagram.contacts, facebook.isConnected, facebook.conversations, facebook.messages, facebook.contacts])

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return conversations[0] || null
    return conversations.find(c => c.id === selectedConversationId) || null
  }, [selectedConversationId, conversations])

  const filteredConversations = useMemo(() => {
    const enabledPlatforms = settings.integrations
      .filter(i => i.enabled)
      .map(i => i.id)
    
    const activePlatforms = allPlatforms.filter(
      p => platformFilters[p] && enabledPlatforms.includes(p)
    )

    return conversations.filter(c => activePlatforms.includes(c.platform))
  }, [conversations, platformFilters, settings.integrations])

  const totalUnread = filteredConversations.reduce((acc, conv) => acc + conv.unread, 0)

  const handleTogglePlatform = (platform: string) => {
    setPlatformFilters(prev => ({ ...prev, [platform]: !prev[platform] }))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return
    
    let success = false
    if (selectedConversation.platform === 'instagram') {
      success = await instagram.sendMessage(selectedConversation.id, newMessage)
    } else if (selectedConversation.platform === 'facebook') {
      const recipientId = selectedConversation.recipientId || selectedConversation.id
      console.log('[MessagesWidget] Sending FB message to recipientId:', recipientId)
      success = await facebook.sendMessage(recipientId, newMessage)
    }
    
    if (success) {
      setNewMessage('')
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const sidebarBg = isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)'
  const borderColor = isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'
  const selectedBg = isDark ? 'var(--mantine-color-dark-5)' : 'var(--mantine-color-blue-light)'
  const chatBubbleUser = 'var(--mantine-color-blue-6) !important'
  const chatBubbleContact = isDark ? theme.colors.dark[5] : theme.colors.gray[1]
  const filterPanelBg = isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)'
  const chatTextUser = 'white !important'
  const chatTextContact = isDark ? theme.colors.dark[0] : 'inherit'

  const enabledIntegrations = settings.integrations.filter(i => i.enabled).map(i => i.id)
  const activePlatformsCount = allPlatforms.filter(p => platformFilters[p] && enabledIntegrations.includes(p)).length

  return (
    <Box style={{ width: '100%', height: 'calc(100vh - 180px)', display: 'flex', overflow: 'hidden' }}>
      <Box style={{ width: 320, borderRight: `1px solid ${borderColor}`, background: sidebarBg, display: 'flex', flexDirection: 'column' }}>
        <Box p='md' style={{ borderBottom: `1px solid ${borderColor}` }}>
          <Group justify='space-between' mb='xs'>
            <Group gap='xs'>
              <Text fw={700} size='lg'>Mensajes</Text>
              {totalUnread > 0 && <Badge size='sm' color='red' variant='filled'>{totalUnread}</Badge>}
            </Group>
            <ActionIcon variant={showFilters ? 'filled' : 'subtle'} onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'blue' : 'gray'}>
              <IoFilter size={18} />
            </ActionIcon>
          </Group>

          {showFilters && (
            <Paper p='sm' radius='md' mt='sm' style={{ background: filterPanelBg }}>
              <Text size='xs' fw={500} mb='xs' c='dimmed'>FILTRAR POR PLATAFORMA</Text>
              <Stack gap='xs'>
                {allPlatforms.map(platform => {
                  const Icon = platformIcons[platform]
                  const isEnabled = enabledIntegrations.includes(platform)
                  return (
                    <Group key={platform} justify='space-between'>
                      <Group gap='xs'>
                        <Icon size={16} color={isEnabled ? platformColors[platform] : '#666'} />
                        <Text size='sm' tt='capitalize' c={isEnabled ? (isDark ? 'gray' : 'dark') : 'dimmed'}>{platform}</Text>
                      </Group>
                      <Switch size='sm' checked={platformFilters[platform]} onChange={() => handleTogglePlatform(platform)} disabled={!isEnabled} color='blue' />
                    </Group>
                  )
                })}
              </Stack>
              <Divider my='sm' />
              <Group justify='space-between'>
                <Text size='xs' c='dimmed'>{activePlatformsCount} de {enabledIntegrations.length} activas</Text>
                <Text size='xs' c='blue' style={{ cursor: 'pointer' }} onClick={() => setPlatformFilters({ instagram: true, facebook: true, whatsapp: true })}>Todas</Text>
              </Group>
            </Paper>
          )}

          {!showFilters && (
            <Group gap='xs'>
              {allPlatforms.filter(p => enabledIntegrations.includes(p) && platformFilters[p]).map(platform => {
                const Icon = platformIcons[platform]
                const count = filteredConversations.filter(c => c.platform === platform).length
                return <Badge key={platform} leftSection={<Icon size={12} />} variant='light' color={platformColors[platform]} tt='capitalize'>{count}</Badge>
              })}
            </Group>
          )}
        </Box>

        <ScrollArea style={{ flex: 1 }}>
          <Stack gap={0}>
            {filteredConversations.length === 0 ? (
              <Box p='xl' ta='center'>
                <Text c='dimmed' size='sm'>No hay conversaciones</Text>
              </Box>
            ) : (
              filteredConversations.map(conv => {
                const Icon = platformIcons[conv.platform]
                return (
                  <Box key={conv.id} onClick={() => setSelectedConversationId(conv.id)} p='md' style={{ cursor: 'pointer', backgroundColor: selectedConversation?.id === conv.id ? selectedBg : 'transparent', borderLeft: selectedConversation?.id === conv.id ? '3px solid var(--mantine-color-blue-6)' : '3px solid transparent' }}>
                    <Group justify='space-between' wrap='nowrap'>
                      <Group gap='sm' wrap='nowrap'>
                        <Box pos='relative'>
                          <Avatar color='blue' radius='xl' src={conv.contactAvatar || undefined}>{!conv.contactAvatar?.startsWith('http') ? conv.contactAvatar : ''}</Avatar>
                          {conv.unread > 0 && <Badge size='xs' circle color='red' style={{ position: 'absolute', top: -4, right: -4 }}>{conv.unread}</Badge>}
                        </Box>
                        <Box>
                          <Text fw={500} size='sm'>{conv.contactName}</Text>
                          <Text c='dimmed' size='xs' lineClamp={1}>{conv.lastMessage}</Text>
                        </Box>
                      </Group>
                      <Icon size={16} color={platformColors[conv.platform]} />
                    </Group>
                  </Box>
                )
              })
            )}
          </Stack>
        </ScrollArea>
      </Box>

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', background: isDark ? 'var(--mantine-color-dark-7)' : 'white' }}>
        {selectedConversation ? (
          <>
            <Box p='md' style={{ borderBottom: `1px solid ${borderColor}` }}>
              <Group gap='sm'>
                <Avatar color='blue' radius='xl' src={selectedConversation.contactAvatar || undefined}>{!selectedConversation.contactAvatar?.startsWith('http') ? selectedConversation.contactAvatar : ''}</Avatar>
                <Box>
                  <Text fw={500}>{selectedConversation.contactName}</Text>
                  <Group gap='xs'>
                    {(() => {
                      const Icon = platformIcons[selectedConversation.platform]
                      return <><Icon size={14} color={platformColors[selectedConversation.platform]} /><Text c='dimmed' size='xs' tt='capitalize'>{selectedConversation.platform}</Text></>
                    })()}
                  </Group>
                </Box>
              </Group>
            </Box>
            <ScrollArea flex={1} p='md'>
              <Stack gap='sm'>
                {selectedConversation.messages
                  .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                  .map(msg => (
                  <Box key={msg.id} style={{ display: 'flex', justifyContent: msg.isFromUser ? 'flex-end' : 'flex-start' }}>
                    <Paper p='sm' radius='lg' style={{ maxWidth: '70%', backgroundColor: msg.isFromUser ? chatBubbleUser : chatBubbleContact, color: msg.isFromUser ? chatTextUser : chatTextContact }}>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <Box mb='xs'>
                          {msg.attachments.map((attachment, idx) => (
                            <Box key={idx} mb='xs'>
                              {attachment.type === 'image' && (
                                <Box style={{ borderRadius: 8, overflow: 'hidden' }}>
                                  <img src={attachment.url} alt="imagen" style={{ maxWidth: '100%', maxHeight: 300, display: 'block' }} />
                                </Box>
                              )}
                              {attachment.type === 'audio' && (
                                <Box style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                                  <Group gap='xs'>
                                    <IoMusicalNotes size={20} />
                                    <audio controls src={attachment.url} style={{ height: 32, maxWidth: 200 }} />
                                  </Group>
                                </Box>
                              )}
                              {attachment.type === 'video' && (
                                <video controls src={attachment.url} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
                              )}
                              {attachment.type === 'file' && (
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                  <Group gap='xs'>
                                    <IoImage size={16} />
                                    <Text size='sm'>Archivo</Text>
                                  </Group>
                                </a>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}
                      {msg.text && <Text size='sm'>{msg.text}</Text>}
                      <Text size='xs' c={msg.isFromUser ? (isDark ? 'gray-4' : 'gray-3') : 'dimmed'} ta='right' mt={4}>{formatTime(msg.timestamp)}</Text>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
            <Box p='md' style={{ borderTop: `1px solid ${borderColor}` }}>
              <Group gap='sm'>
                <TextInput placeholder='Escribe un mensaje...' value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1 }} />
                <ActionIcon size='lg' variant='filled' onClick={handleSendMessage}><IoSend size={18} /></ActionIcon>
              </Group>
            </Box>
          </>
        ) : (
          <Box style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text c='dimmed'>Selecciona una conversación</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
