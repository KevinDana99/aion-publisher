'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
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
  useMantineTheme,
  Modal,
  Tooltip
} from '@mantine/core'
import {
  IoSend,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoWhatsapp,
  IoFilter,
  IoMusicalNotes,
  IoImage,
  IoAttach,
  IoMic,
  IoStop,
  IoClose,
  IoDocument
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import { useInstagram } from '@/lib/instagram/context'
import { useFacebook } from '@/lib/facebook/context'
import Image from 'next/image'
import Link from 'next/link'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isFromUser: boolean
  attachments?: {
    type: 'image' | 'audio' | 'video' | 'file'
    payload: {
      url: string
    }
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [newMessage, setNewMessage] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [platformFilters, setPlatformFilters] = useState<
    Record<string, boolean>
  >({
    instagram: true,
    facebook: true,
    whatsapp: true
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Error al grabar:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`El archivo es muy grande. Máximo 25MB.`)
        return
      }
      setAttachmentFile(file)
    }
    e.target.value = ''
  }

  const removeAttachment = () => {
    setAttachmentFile(null)
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const conversations: Conversation[] = useMemo(() => {
    const allConvs: Conversation[] = []

    if (
      instagram.isConnected ||
      instagram.conversations.length > 0 ||
      Object.keys(instagram.messages).length > 0
    ) {
      const igConvs = instagram.conversations.map((conv) => {
        const contact = instagram.contacts[conv.id]
        const msgs = instagram.messages[conv.id] || []
        return {
          id: conv.id,
          contactName:
            contact?.username ||
            conv.participants[0]?.username ||
            conv.id.slice(0, 8),
          contactAvatar:
            contact?.profilePicture ||
            contact?.username?.slice(0, 2).toUpperCase() ||
            conv.participants[0]?.username?.slice(0, 2).toUpperCase() ||
            conv.id.slice(0, 2).toUpperCase(),
          platform: 'instagram' as const,
          messages: msgs.map((m) => ({
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

      const igFromMessages = Object.entries(instagram.messages)
        .map(([convId, msgs]) => {
          const hasIncoming = msgs.some((m) => !m.isFromMe)
          if (!hasIncoming) return null
          const contact = instagram.contacts[convId]
          return {
            id: convId,
            contactName: contact?.username || convId.slice(0, 8),
            contactAvatar:
              contact?.profilePicture ||
              contact?.username?.slice(0, 2).toUpperCase() ||
              convId.slice(0, 2).toUpperCase(),
            platform: 'instagram' as const,
            messages: msgs.map((m) => ({
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
        .filter(Boolean) as Conversation[]

      allConvs.push(...igConvs, ...igFromMessages)
    }

    if (
      facebook.isConnected ||
      facebook.conversations.length > 0 ||
      Object.keys(facebook.messages).length > 0
    ) {
      const fbConvs = facebook.conversations.map((conv) => {
        const contact = facebook.contacts[conv.id]
        const msgs = facebook.messages[conv.id] || []
        const pageId = facebook.pageId || '548959081641341'
        const recipient = conv.participants?.find((p) => p.id !== pageId)
        return {
          id: conv.id,
          recipientId: recipient?.id || conv.participants?.[0]?.id,
          contactName:
            contact?.name || conv.participants[0]?.name || conv.id.slice(0, 8),
          contactAvatar:
            contact?.profilePic ||
            contact?.firstName?.slice(0, 2).toUpperCase() ||
            conv.participants[0]?.firstName?.slice(0, 2).toUpperCase() ||
            conv.id.slice(0, 2).toUpperCase(),
          platform: 'facebook' as const,
          messages: msgs.map((m) => ({
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

      const fbFromMessages = Object.entries(facebook.messages)
        .map(([convId, msgs]) => {
          const hasIncoming = msgs.some((m) => !m.isFromMe)
          if (!hasIncoming) return null
          const contact = facebook.contacts[convId]
          const senderId = msgs.find((m) => !m.isFromMe)?.senderId
          return {
            id: convId,
            recipientId: senderId,
            contactName:
              contact?.name || senderId?.slice(0, 8) || convId.slice(0, 8),
            contactAvatar:
              contact?.profilePic ||
              contact?.firstName?.slice(0, 2).toUpperCase() ||
              convId.slice(0, 2).toUpperCase(),
            platform: 'facebook' as const,
            messages: msgs.map((m) => ({
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
        .filter(Boolean) as Conversation[]

      allConvs.push(...fbConvs, ...fbFromMessages)
    }

    const unique = Array.from(
      new Map(allConvs.map((c) => [c.id + c.platform, c])).values()
    )

    return unique
  }, [
    instagram.isConnected,
    instagram.conversations,
    instagram.messages,
    instagram.contacts,
    facebook.isConnected,
    facebook.conversations,
    facebook.messages,
    facebook.contacts
  ])

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId) return conversations[0] || null
    return conversations.find((c) => c.id === selectedConversationId) || null
  }, [selectedConversationId, conversations])

  const filteredConversations = useMemo(() => {
    const enabledPlatforms = settings.integrations
      .filter((i) => i.enabled)
      .map((i) => i.id)

    const activePlatforms = allPlatforms.filter(
      (p) => platformFilters[p] && enabledPlatforms.includes(p)
    )

    return conversations.filter((c) => activePlatforms.includes(c.platform))
  }, [conversations, platformFilters, settings.integrations])

  const totalUnread = filteredConversations.reduce(
    (acc, conv) => acc + conv.unread,
    0
  )

  const handleTogglePlatform = (platform: string) => {
    setPlatformFilters((prev) => ({ ...prev, [platform]: !prev[platform] }))
  }

  const handleGetFile = async (url: string) => {
    try {
      const req = await fetch(url)
      const disposition = req.headers.get('Content-Disposition')
      const filename =
        disposition && disposition.includes('filename=')
          ? disposition.split('filename=')[1].split(';')[0].replace(/['"]/g, '')
          : ''
      const blob = await req.blob()
      const blobUrl = URL.createObjectURL(blob)
      return {
        url: blobUrl ?? '',
        type: req.headers.get('Content-Type')?.split('/')[1] ?? '',
        name: filename ?? ''
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message)
        throw Error(err.message)
      }
    }
  }
  type FileType = {
    url: string | null
    type: string | null
    name: string | null
  }

  const FileMessage = ({ url }: { url: string }) => {
    const [file, setFile] = useState<FileType>({
      url: null,
      type: null,
      name: null
    })
    useEffect(() => {
      const callFn = async () => {
        const tempFile = await handleGetFile(url)
        if (tempFile) setFile(tempFile)
      }
      callFn()
    }, [url])
    return (
      <Link
        href={(file?.url && file.url) ?? ''}
        download={`${file?.name}.${file?.type}`}
        style={{
          color: 'inherit',
          textDecoration: 'underline'
        }}
      >
        <Group gap='xs'>
          <IoDocument size={16} />
          <Text size='sm'>{`${file?.name}.${file?.type}`}</Text>
        </Group>
      </Link>
    )
  }

  const handleSendMessage = async () => {
    if (!selectedConversation) return

    // Handle audio recording
    if (audioBlob) {
      alert('Envío de audio: requiere integración con servidor de archivos')
      setAudioBlob(null)
      return
    }

    // Handle file attachment
    if (attachmentFile) {
      alert('Envío de archivos: requiere integración con servidor de archivos')
      setAttachmentFile(null)
      return
    }

    // Handle text message
    if (!newMessage.trim()) return

    let success = false
    if (selectedConversation.platform === 'instagram') {
      success = await instagram.sendMessage(selectedConversation.id, newMessage)
    } else if (selectedConversation.platform === 'facebook') {
      const recipientId =
        selectedConversation.recipientId || selectedConversation.id
      console.log(
        '[MessagesWidget] Sending FB message to recipientId:',
        recipientId
      )
      success = await facebook.sendMessage(recipientId, newMessage)
    }

    if (success) {
      setNewMessage('')
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const sidebarBg = !mounted || isDark
    ? 'var(--mantine-color-dark-7)'
    : 'var(--mantine-color-gray-0)'
  const borderColor = !mounted || isDark
    ? 'var(--mantine-color-dark-4)'
    : 'var(--mantine-color-gray-3)'
  const selectedBg = !mounted || isDark
    ? 'var(--mantine-color-dark-5)'
    : 'var(--mantine-color-blue-light)'
  const chatBubbleUser = 'var(--mantine-color-blue-6) !important'
  const chatBubbleContact = !mounted || isDark ? theme.colors.dark[5] : theme.colors.gray[1]
  const filterPanelBg = !mounted || isDark
    ? 'var(--mantine-color-dark-6)'
    : 'var(--mantine-color-gray-0)'
  const chatTextUser = 'white !important'
  const chatTextContact = !mounted || isDark ? theme.colors.dark[0] : 'inherit'

  const enabledIntegrations = settings.integrations
    .filter((i) => i.enabled)
    .map((i) => i.id)
  const activePlatformsCount = allPlatforms.filter(
    (p) => platformFilters[p] && enabledIntegrations.includes(p)
  ).length

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
                    onClick={() => setSelectedConversationId(conv.id)}
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
                          <Avatar
                            color='blue'
                            radius='xl'
                            src={conv.contactAvatar || undefined}
                          >
                            {!conv.contactAvatar?.startsWith('http')
                              ? conv.contactAvatar
                              : ''}
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
                <Avatar
                  color='blue'
                  radius='xl'
                  src={selectedConversation.contactAvatar || undefined}
                >
                  {!selectedConversation.contactAvatar?.startsWith('http')
                    ? selectedConversation.contactAvatar
                    : ''}
                </Avatar>
                <Box>
                  <Text fw={500}>{selectedConversation.contactName}</Text>
                  <Group gap='xs'>
                    {(() => {
                      const Icon = platformIcons[selectedConversation.platform]
                      return (
                        <>
                          <Icon
                            size={14}
                            color={
                              platformColors[selectedConversation.platform]
                            }
                          />
                          <Text c='dimmed' size='xs' tt='capitalize'>
                            {selectedConversation.platform}
                          </Text>
                        </>
                      )
                    })()}
                  </Group>
                </Box>
              </Group>
            </Box>
            <ScrollArea flex={1} p='md'>
              <Stack gap='sm'>
                {selectedConversation.messages
                  .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                  .map((msg) => {
                    if (msg.attachments && msg.attachments.length > 0) {
                      console.log(
                        '[MessagesWidget] attachments:',
                        JSON.stringify(msg.attachments)
                      )
                    }
                    return (
                      <Box
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: msg.isFromUser
                            ? 'flex-end'
                            : 'flex-start'
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
                            color: msg.isFromUser
                              ? chatTextUser
                              : chatTextContact
                          }}
                        >
                          {msg.attachments && msg.attachments.length > 0 && (
                            <Box mb='xs'>
                              {msg.attachments.map((attachment, idx) => (
                                <Box key={idx} mb='xs'>
                                  {attachment.type === 'image' && (
                                    <Box
                                      style={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        width: 200,
                                        position: 'relative',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() =>
                                        setImagePreview(attachment.payload.url)
                                      }
                                    >
                                      <Image
                                        src={attachment.payload.url}
                                        alt='imagen'
                                        width={200}
                                        style={{
                                          objectFit: 'contain',
                                          width: '100%',
                                          height: 'auto'
                                        }}
                                      />
                                    </Box>
                                  )}
                                  {attachment.type === 'audio' && (
                                    <Box
                                      style={{
                                        background: isDark
                                          ? 'var(--mantine-color-dark-5)'
                                          : 'var(--mantine-color-gray-1)',
                                        borderRadius: 8,
                                        padding: '8px 12px'
                                      }}
                                    >
                                      <audio
                                        controls
                                        src={attachment.payload.url}
                                        style={{
                                          height: 32,
                                          maxWidth: 200
                                        }}
                                      />
                                    </Box>
                                  )}
                                  {attachment.type === 'video' && (
                                    <video
                                      controls
                                      src={attachment.payload.url}
                                      style={{
                                        maxWidth: '100%',
                                        maxHeight: 300,
                                        borderRadius: 8
                                      }}
                                    />
                                  )}
                                  {attachment.type === 'file' && (
                                    <FileMessage url={attachment.payload.url} />
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}
                          {msg.text && <Text size='sm'>{msg.text}</Text>}
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
                    )
                  })}
              </Stack>
            </ScrollArea>
            <Box p='md' style={{ borderTop: `1px solid ${borderColor}` }}>
              <Group gap='sm'>
                {!isRecording && !audioBlob && (
                  <>
                    <Tooltip label='Próximamente' position='top' withArrow>
                      <ActionIcon
                        variant='subtle'
                        disabled
                        style={{ pointerEvents: 'none', opacity: 0.5 }}
                      >
                        <IoAttach size={20} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label='Próximamente' position='top' withArrow>
                      <ActionIcon
                        variant='subtle'
                        color='red'
                        disabled
                        style={{ pointerEvents: 'none', opacity: 0.5 }}
                      >
                        <IoMic size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                )}

                {isRecording && (
                  <Group gap='xs'>
                    <Box
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: 'red',
                        animation: 'pulse 1s infinite'
                      }}
                    />
                    <Text size='sm' fw={500}>
                      {formatRecordingTime(recordingTime)}
                    </Text>
                    <ActionIcon
                      variant='filled'
                      color='red'
                      onClick={stopRecording}
                    >
                      <IoStop size={18} />
                    </ActionIcon>
                    <ActionIcon variant='subtle' onClick={cancelRecording}>
                      <IoClose size={20} />
                    </ActionIcon>
                  </Group>
                )}

                {audioBlob && !isRecording && (
                  <Group gap='xs'>
                    <audio
                      src={URL.createObjectURL(audioBlob)}
                      controls
                      style={{ height: 32, maxWidth: 200 }}
                    />
                    <ActionIcon
                      variant='subtle'
                      onClick={() => setAudioBlob(null)}
                    >
                      <IoClose size={20} />
                    </ActionIcon>
                  </Group>
                )}

                {attachmentFile && !isRecording && !audioBlob && (
                  <Group gap='xs'>
                    <Text size='sm'>{attachmentFile.name}</Text>
                    <ActionIcon variant='subtle' onClick={removeAttachment}>
                      <IoClose size={20} />
                    </ActionIcon>
                  </Group>
                )}

                {!isRecording && (
                  <TextInput
                    placeholder='Escribe un mensaje...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{ flex: 1 }}
                    disabled={!!audioBlob}
                  />
                )}

                <ActionIcon
                  size='lg'
                  variant='filled'
                  onClick={handleSendMessage}
                  disabled={isRecording}
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

        <Modal
          opened={!!imagePreview}
          onClose={() => setImagePreview(null)}
          centered
          withCloseButton
          size={700}
          styles={{
            body: {
              background: 'transparent',
              padding: 0,
              width: 700,
              height: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            content: { background: 'transparent', boxShadow: 'none' }
          }}
        >
          {imagePreview && (
            <Box
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                src={imagePreview}
                alt='imagen preview'
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          )}
        </Modal>
      </Box>
    </Box>
  )
}
