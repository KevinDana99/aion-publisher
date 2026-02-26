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
  IoFilter
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isFromUser: boolean
}

interface Conversation {
  id: string
  contactName: string
  contactAvatar: string
  platform: 'instagram' | 'facebook' | 'whatsapp'
  messages: Message[]
  lastMessage: string
  unread: number
}

const FIXED_DATE = new Date('2026-02-26T12:00:00Z')

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactName: 'María González',
    contactAvatar: 'MG',
    platform: 'instagram',
    unread: 2,
    lastMessage: 'Hola, tengo una consulta sobre sus servicios',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: 'Hola! Vi su publicidad',
        timestamp: new Date(FIXED_DATE.getTime() - 3600000),
        isFromUser: false
      },
      {
        id: '2',
        senderId: 'contact',
        text: 'Hola, tengo una consulta sobre sus servicios',
        timestamp: new Date(FIXED_DATE.getTime() - 120000),
        isFromUser: false
      }
    ]
  },
  {
    id: '2',
    contactName: 'Carlos Ruiz',
    contactAvatar: 'CR',
    platform: 'facebook',
    unread: 0,
    lastMessage: 'Gracias por la información',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: 'Hola, estoy interesado en el producto',
        timestamp: new Date(FIXED_DATE.getTime() - 7200000),
        isFromUser: false
      },
      {
        id: '2',
        senderId: 'user',
        text: 'Claro, con gusto te ayudo. ¿Qué información necesitas?',
        timestamp: new Date(FIXED_DATE.getTime() - 7000000),
        isFromUser: true
      },
      {
        id: '3',
        senderId: 'contact',
        text: 'Gracias por la información',
        timestamp: new Date(FIXED_DATE.getTime() - 900000),
        isFromUser: false
      }
    ]
  },
  {
    id: '3',
    contactName: 'Ana López',
    contactAvatar: 'AL',
    platform: 'instagram',
    unread: 1,
    lastMessage: '¿Tienen disponibilidad para la próxima semana?',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: '¿Tienen disponibilidad para la próxima semana?',
        timestamp: new Date(FIXED_DATE.getTime() - 600000),
        isFromUser: false
      }
    ]
  },
  {
    id: '4',
    contactName: 'Pedro Sánchez',
    contactAvatar: 'PS',
    platform: 'facebook',
    unread: 0,
    lastMessage: 'Me gustaría conocer más sobre los planes',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: 'Buenas tardes',
        timestamp: new Date(FIXED_DATE.getTime() - 10800000),
        isFromUser: false
      },
      {
        id: '2',
        senderId: 'contact',
        text: 'Me gustaría conocer más sobre los planes',
        timestamp: new Date(FIXED_DATE.getTime() - 14400000),
        isFromUser: false
      }
    ]
  },
  {
    id: '5',
    contactName: 'Laura Martínez',
    contactAvatar: 'LM',
    platform: 'whatsapp',
    unread: 3,
    lastMessage: 'Hola, quiero información sobre...',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: 'Hola! Buenos días',
        timestamp: new Date(FIXED_DATE.getTime() - 1800000),
        isFromUser: false
      },
      {
        id: '2',
        senderId: 'contact',
        text: 'Hola, quiero información sobre...',
        timestamp: new Date(FIXED_DATE.getTime() - 900000),
        isFromUser: false
      }
    ]
  },
  {
    id: '6',
    contactName: 'Jorge Torres',
    contactAvatar: 'JT',
    platform: 'whatsapp',
    unread: 0,
    lastMessage: 'Perfecto, muchas gracias',
    messages: [
      {
        id: '1',
        senderId: 'contact',
        text: 'Buenas, tengo una duda sobre el servicio',
        timestamp: new Date(FIXED_DATE.getTime() - 86400000),
        isFromUser: false
      },
      {
        id: '2',
        senderId: 'user',
        text: 'Claro, con gusto te resuelvo',
        timestamp: new Date(FIXED_DATE.getTime() - 86000000),
        isFromUser: true
      },
      {
        id: '3',
        senderId: 'contact',
        text: 'Perfecto, muchas gracias',
        timestamp: new Date(FIXED_DATE.getTime() - 82800000),
        isFromUser: false
      }
    ]
  }
]

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

  const [conversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] || null)
  const [newMessage, setNewMessage] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [platformFilters, setPlatformFilters] = useState<
    Record<string, boolean>
  >({
    instagram: true,
    facebook: true,
    whatsapp: true
  })

  const [messages, setMessages] = useState<Record<string, Message[]>>(
    mockConversations.reduce(
      (acc, conv) => ({ ...acc, [conv.id]: conv.messages }),
      {}
    )
  )

  const enabledIntegrations = settings.integrations
    .filter((i) => i.enabled)
    .map((i) => i.id)

  const filteredConversations = useMemo(() => {
    const availablePlatforms = allPlatforms.filter((p) =>
      enabledIntegrations.includes(p)
    )
    const activePlatforms = allPlatforms.filter(
      (p) => platformFilters[p] && enabledIntegrations.includes(p)
    )

    if (activePlatforms.length === 0) {
      return conversations.filter((c) =>
        availablePlatforms.includes(c.platform)
      )
    }

    return conversations.filter((c) => activePlatforms.includes(c.platform))
  }, [conversations, platformFilters, enabledIntegrations])

  const activePlatformsCount = allPlatforms.filter(
    (p) => platformFilters[p] && enabledIntegrations.includes(p)
  ).length
  const totalUnread = filteredConversations.reduce(
    (acc, conv) => acc + conv.unread,
    0
  )

  const handleTogglePlatform = (platform: string) => {
    setPlatformFilters((prev) => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: newMessage,
      timestamp: new Date(),
      isFromUser: true
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        message
      ]
    }))
    setNewMessage('')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const sidebarBg = isDark
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-gray-0)'
  const borderColor = isDark
    ? 'var(--mantine-color-dark-4)'
    : 'var(--mantine-color-gray-3)'
  const selectedBg = isDark
    ? 'var(--mantine-color-dark-5)'
    : 'var(--mantine-color-blue-light)'
  const chatBubbleUser = 'var(--mantine-color-blue-6) !important'
  const chatBubbleContact = isDark ? theme.colors.dark[5] : theme.colors.gray[1]
  const filterPanelBg = isDark
    ? 'var(--mantine-color-dark-6)'
    : 'var(--mantine-color-gray-0)'
  const chatTextUser = 'white !important'
  const chatTextContact = isDark ? theme.colors.dark[0] : 'inherit'

  return (
    <Box
      style={{
        width: '100%',
        height: 'calc(100vh - 180px)',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      <Box
        style={{
          width: 320,
          borderRight: `1px solid ${borderColor}`,
          background: sidebarBg,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box p='md' style={{ borderBottom: `1px solid ${borderColor}` }}>
          <Group justify='space-between' mb='xs'>
            <Group gap='xs'>
              <Text fw={700} size='lg'>
                Mensajes
              </Text>
              {totalUnread > 0 && (
                <Badge size='sm' color='red' variant='filled'>
                  {totalUnread}
                </Badge>
              )}
            </Group>
            <ActionIcon
              variant={showFilters ? 'filled' : 'subtle'}
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'blue' : 'gray'}
            >
              <IoFilter size={18} />
            </ActionIcon>
          </Group>

          {showFilters && (
            <Paper
              p='sm'
              radius='md'
              mt='sm'
              style={{ background: filterPanelBg }}
            >
              <Text size='xs' fw={500} mb='xs' c='dimmed'>
                FILTRAR POR PLATAFORMA
              </Text>
              <Stack gap='xs'>
                {allPlatforms.map((platform) => {
                  const Icon = platformIcons[platform]
                  const isEnabled = enabledIntegrations.includes(platform)
                  return (
                    <Group key={platform} justify='space-between'>
                      <Group gap='xs'>
                        <Icon
                          size={16}
                          color={isEnabled ? platformColors[platform] : '#666'}
                        />
                        <Text
                          size='sm'
                          tt='capitalize'
                          c={isEnabled ? (isDark ? 'gray' : 'dark') : 'dimmed'}
                        >
                          {platform}
                        </Text>
                      </Group>
                      <Switch
                        size='sm'
                        checked={platformFilters[platform]}
                        onChange={() => handleTogglePlatform(platform)}
                        disabled={!isEnabled}
                        color='blue'
                      />
                    </Group>
                  )
                })}
              </Stack>
              <Divider my='sm' />
              <Group justify='space-between'>
                <Text size='xs' c='dimmed'>
                  {activePlatformsCount} de {enabledIntegrations.length} activas
                </Text>
                <Text
                  size='xs'
                  c='blue'
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setPlatformFilters({
                      instagram: true,
                      facebook: true,
                      whatsapp: true
                    })
                  }
                >
                  Todas
                </Text>
              </Group>
            </Paper>
          )}

          {!showFilters && (
            <Group gap='xs'>
              {allPlatforms
                .filter(
                  (p) => enabledIntegrations.includes(p) && platformFilters[p]
                )
                .map((platform) => {
                  const Icon = platformIcons[platform]
                  const count = filteredConversations.filter(
                    (c) => c.platform === platform
                  ).length
                  return (
                    <Badge
                      key={platform}
                      leftSection={<Icon size={12} />}
                      variant='light'
                      color={platformColors[platform]}
                      tt='capitalize'
                    >
                      {count}
                    </Badge>
                  )
                })}
            </Group>
          )}
        </Box>

        <ScrollArea style={{ flex: 1 }}>
          <Stack gap={0}>
            {filteredConversations.length === 0 ? (
              <Box p='xl' ta='center'>
                <Text c='dimmed' size='sm'>
                  No hay conversaciones
                </Text>
              </Box>
            ) : (
              filteredConversations.map((conv) => {
                const Icon = platformIcons[conv.platform]
                return (
                  <Box
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    p='md'
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        selectedConversation?.id === conv.id
                          ? selectedBg
                          : 'transparent',
                      borderLeft:
                        selectedConversation?.id === conv.id
                          ? '3px solid var(--mantine-color-blue-6)'
                          : '3px solid transparent'
                    }}
                  >
                    <Group justify='space-between' wrap='nowrap'>
                      <Group gap='sm' wrap='nowrap'>
                        <Box pos='relative'>
                          <Avatar color='blue' radius='xl'>
                            {conv.contactAvatar}
                          </Avatar>
                          {conv.unread > 0 && (
                            <Badge
                              size='xs'
                              circle
                              color='red'
                              style={{
                                position: 'absolute',
                                top: -4,
                                right: -4
                              }}
                            >
                              {conv.unread}
                            </Badge>
                          )}
                        </Box>
                        <Box>
                          <Text fw={500} size='sm'>
                            {conv.contactName}
                          </Text>
                          <Text c='dimmed' size='xs' lineClamp={1}>
                            {conv.lastMessage}
                          </Text>
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

      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: isDark ? 'var(--mantine-color-dark-7)' : 'white'
        }}
      >
        {selectedConversation ? (
          <>
            <Box p='md' style={{ borderBottom: `1px solid ${borderColor}` }}>
              <Group gap='sm'>
                <Avatar color='blue' radius='xl'>
                  {selectedConversation.contactAvatar}
                </Avatar>
                <Box>
                  <Text fw={500}>{selectedConversation.contactName}</Text>
                  <Group gap='xs'>
                    {(() => {
                      const Icon = platformIcons[selectedConversation.platform]
                      return (
                        <Icon
                          size={14}
                          color={platformColors[selectedConversation.platform]}
                        />
                      )
                    })()}
                    <Text c='dimmed' size='xs' tt='capitalize'>
                      {selectedConversation.platform}
                    </Text>
                  </Group>
                </Box>
              </Group>
            </Box>
            <ScrollArea flex={1} p='md'>
              <Stack gap='sm'>
                {messages[selectedConversation.id]?.map((msg) => (
                  <Box
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isFromUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Paper
                      p='sm'
                      radius='lg'
                      style={{
                        maxWidth: '70%',
                        backgroundColor: msg.isFromUser
                          ? chatBubbleUser
                          : chatBubbleContact,
                        color: msg.isFromUser ? chatTextUser : chatTextContact
                      }}
                    >
                      <Text size='sm'>{msg.text}</Text>
                      <Text
                        size='xs'
                        c={
                          msg.isFromUser
                            ? isDark
                              ? 'gray-4'
                              : 'gray-3'
                            : 'dimmed'
                        }
                        ta='right'
                        mt={4}
                      >
                        {formatTime(msg.timestamp)}
                      </Text>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
            <Box p='md' style={{ borderTop: `1px solid ${borderColor}` }}>
              <Group gap='sm'>
                <TextInput
                  placeholder='Escribe un mensaje...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  size='lg'
                  variant='filled'
                  onClick={handleSendMessage}
                >
                  <IoSend size={18} />
                </ActionIcon>
              </Group>
            </Box>
          </>
        ) : (
          <Box
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text c='dimmed'>Selecciona una conversación</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
