'use client'

import { useState } from 'react'
import {
  Box,
  Stack,
  Title,
  Group,
  Text,
  TextInput,
  Textarea,
  Button,
  Paper,
  SimpleGrid,
  Checkbox,
  ThemeIcon,
  Image,
  Badge,
  Tabs,
  ActionIcon,
  Divider,
  FileButton,
  Menu,
  ScrollArea,
  Grid,
  Modal,
  Avatar
} from '@mantine/core'
import {
  IoMegaphone,
  IoImageOutline,
  IoSend,
  IoCalendar,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoClose,
  IoAdd,
  IoCloudUpload,
  IoSparkles,
  IoTrash,
  IoCreate,
  IoEllipsisVertical,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoDocument,
  IoOpen,
  IoEye
} from 'react-icons/io5'
import CalendarWidget, {
  type CalendarEvent,
  type DisabledSlot
} from '@/components/shared/calendars/CalendarWidget'
import dayjs from 'dayjs'

interface MediaFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  connected: boolean
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <IoLogoInstagram size={18} />,
    color: 'violet',
    connected: true
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <IoLogoFacebook size={18} />,
    color: 'blue',
    connected: true
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <IoLogoTwitter size={18} />,
    color: 'cyan',
    connected: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <IoLogoLinkedin size={18} />,
    color: 'blue',
    connected: true
  }
]

interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  date: string
  time: string
  status: 'scheduled' | 'published' | 'failed' | 'draft'
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    content: 'Lanzamiento nuevo producto',
    platforms: ['instagram', 'facebook'],
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    status: 'scheduled'
  },
  {
    id: '2',
    content: 'Tip semanal de marketing',
    platforms: ['linkedin'],
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'scheduled'
  },
  {
    id: '3',
    content: 'Promo fin de semana',
    platforms: ['instagram', 'facebook', 'linkedin'],
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    time: '12:00',
    status: 'scheduled'
  }
]

const mockDraftPosts: ScheduledPost[] = [
  {
    id: 'd1',
    content: 'Borrador de campaña navidad',
    platforms: ['instagram', 'facebook'],
    date: '',
    time: '',
    status: 'draft'
  },
  {
    id: 'd2',
    content: 'Nueva promoción sin definir fecha',
    platforms: ['instagram'],
    date: '',
    time: '',
    status: 'draft'
  },
  {
    id: 'd3',
    content: 'Post para reel de producto',
    platforms: ['instagram'],
    date: '',
    time: '',
    status: 'draft'
  }
]

const mockHistoryPosts: ScheduledPost[] = [
  {
    id: 'h1',
    content: 'Nueva colección de verano',
    platforms: ['instagram', 'facebook'],
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'published'
  },
  {
    id: 'h2',
    content: 'Consejos para tu negocio',
    platforms: ['linkedin'],
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    time: '09:00',
    status: 'published'
  },
  {
    id: 'h3',
    content: 'Promoción especial lunes',
    platforms: ['instagram'],
    date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    status: 'published'
  },
  {
    id: 'h4',
    content: 'Video testimonial cliente',
    platforms: ['instagram', 'facebook', 'linkedin'],
    date: dayjs().subtract(4, 'day').format('YYYY-MM-DD'),
    time: '16:00',
    status: 'failed'
  },
  {
    id: 'h5',
    content: 'Black Friday',
    platforms: ['instagram', 'facebook'],
    date: dayjs().subtract(5, 'day').format('YYYY-MM-DD'),
    time: '08:00',
    status: 'published'
  },
  {
    id: 'h6',
    content: 'Nuevo servicio de consulting',
    platforms: ['linkedin'],
    date: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    time: '11:00',
    status: 'published'
  },
  {
    id: 'h7',
    content: 'Post de agradecimiento',
    platforms: ['instagram'],
    date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    time: '15:00',
    status: 'failed'
  },
  {
    id: 'h8',
    content: 'Caso de éxito empresa X',
    platforms: ['facebook', 'linkedin'],
    date: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
    time: '12:00',
    status: 'published'
  },
  {
    id: 'h9',
    content: 'Tips productividad',
    platforms: ['instagram'],
    date: dayjs().subtract(9, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'published'
  },
  {
    id: 'h10',
    content: 'Evento próximo mes',
    platforms: ['instagram', 'facebook'],
    date: dayjs().subtract(10, 'day').format('YYYY-MM-DD'),
    time: '09:00',
    status: 'published'
  },
  {
    id: 'h11',
    content: 'Encuesta comunidad',
    platforms: ['instagram'],
    date: dayjs().subtract(11, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    status: 'published'
  },
  {
    id: 'h12',
    content: 'Nuevo producto beta',
    platforms: ['linkedin'],
    date: dayjs().subtract(12, 'day').format('YYYY-MM-DD'),
    time: '11:00',
    status: 'failed'
  }
]

const scheduledEvents: CalendarEvent[] = mockScheduledPosts.map((post) => ({
  id: post.id,
  title: post.content,
  date: post.date,
  time: post.time,
  duration: 30,
  type: 'campaign' as const,
  status: post.status === 'scheduled' ? 'pending' : 'completed',
  attendees: post.platforms,
  location: post.platforms
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(', ')
}))

export default function PublisherPage() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'instagram',
    'facebook'
  ])
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [scheduledDateTime, setScheduledDateTime] = useState<string | null>(
    null
  )
  const [activeTab, setActiveTab] = useState<string | null>('create')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [scheduledPosts, setScheduledPosts] =
    useState<ScheduledPost[]>(mockScheduledPosts)
  const [draftPosts, setDraftPosts] = useState<ScheduledPost[]>(mockDraftPosts)
  const [historyPosts, setHistoryPosts] =
    useState<ScheduledPost[]>(mockHistoryPosts)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<
    string | null
  >(null)
  const [historyFilter, setHistoryFilter] = useState<string>('all')
  const [historyPage, setHistoryPage] = useState(1)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewPlatform, setPreviewPlatform] = useState<string>('instagram')
  const postsPerPage = 5

  const selectedPost = scheduledPosts.find((p) => p.id === selectedPostId)

  const filteredHistoryPosts = historyPosts.filter((post) => {
    if (historyFilter === 'all') return true
    return post.status === historyFilter
  })

  const totalHistoryPages = Math.ceil(
    filteredHistoryPosts.length / postsPerPage
  )
  const paginatedHistoryPosts = filteredHistoryPosts.slice(
    (historyPage - 1) * postsPerPage,
    historyPage * postsPerPage
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge color='green' variant='light'>
            Publicado
          </Badge>
        )
      case 'failed':
        return (
          <Badge color='yellow' variant='light'>
            Fallido
          </Badge>
        )
      case 'draft':
        return (
          <Badge color='gray' variant='light'>
            Borrador
          </Badge>
        )
      default:
        return (
          <Badge color='blue' variant='light'>
            Programado
          </Badge>
        )
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'published':
        return '3px solid var(--mantine-color-green-5)'
      case 'failed':
        return '3px solid var(--mantine-color-yellow-5)'
      case 'draft':
        return '3px solid var(--mantine-color-gray-5)'
      default:
        return '1px solid var(--mantine-color-gray-3)'
    }
  }

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId === selectedPostId ? null : postId)
    setCalendarSelectedDate(null)
  }

  const handleCalendarEventClick = (event: CalendarEvent) => {
    setSelectedPostId(event.id)
    setCalendarSelectedDate(null)
  }

  const handleCalendarDateSelect = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const postsInDate = scheduledPosts.filter((p) => p.date === dateStr)
    if (postsInDate.length > 0) {
      setSelectedPostId(postsInDate[0].id)
    } else {
      setSelectedPostId(null)
      setCalendarSelectedDate(dateStr)
    }
  }

  const handleDeletePost = (postId: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== postId))
    if (selectedPostId === postId) {
      setSelectedPostId(null)
    }
  }

  const handleSaveAsDraft = () => {
    const newDraft: ScheduledPost = {
      id: `draft-${Date.now()}`,
      content,
      platforms: selectedPlatforms,
      date: '',
      time: '',
      status: 'draft'
    }
    setDraftPosts((prev) => [...prev, newDraft])
    setContent('')
    setSelectedPlatforms(['instagram', 'facebook'])
    setMediaFiles([])
    setScheduledDateTime(null)
  }

  const handleEditDraft = (post: ScheduledPost) => {
    setContent(post.content)
    setSelectedPlatforms(post.platforms)
    setScheduledDateTime(null)
    setMediaFiles([])
    setActiveTab('create')
    setSelectedPostId(null)
  }

  const handleDeleteDraft = (postId: string) => {
    setDraftPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const handlePublishDraft = (post: ScheduledPost) => {
    setContent(post.content)
    setSelectedPlatforms(post.platforms)
    setScheduledDateTime(getDefaultScheduleDateTime())
    setMediaFiles([])
    setActiveTab('create')
    setSelectedPostId(null)
  }

  const handleEditPost = (post: ScheduledPost) => {
    setContent(post.content)
    setSelectedPlatforms(post.platforms)
    const [date, time] = [post.date, post.time]
    const dateTime = `${date}T${time}`
    setScheduledDateTime(dateTime)
    setActiveTab('create')
    setSelectedPostId(null)
  }

  const handleCreateFromScheduled = () => {
    setContent('')
    setSelectedPlatforms(['instagram', 'facebook'])
    setScheduledDateTime(null)
    setMediaFiles([])
    setActiveTab('create')
    setSelectedPostId(null)
    setCalendarSelectedDate(null)
  }

  const handleCreateFromCalendarDate = () => {
    if (calendarSelectedDate) {
      setContent('')
      setSelectedPlatforms(['instagram', 'facebook'])
      setScheduledDateTime(`${calendarSelectedDate}T12:00`)
      setMediaFiles([])
      setActiveTab('create')
      setSelectedPostId(null)
      setCalendarSelectedDate(null)
    }
  }

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleMediaAdd = (files: File[]) => {
    const newMedia: MediaFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }))
    setMediaFiles((prev) => [...prev, ...newMedia])
  }

  const handleMediaRemove = (id: string) => {
    setMediaFiles((prev) => {
      const media = prev.find((m) => m.id === id)
      if (media) URL.revokeObjectURL(media.preview)
      return prev.filter((m) => m.id !== id)
    })
  }

  const handlePublish = () => {
    console.log('Publishing to:', selectedPlatforms)
    console.log('Content:', content)
    console.log('Media:', mediaFiles)
    console.log('Scheduled:', scheduledDateTime)
  }

  const handleSchedule = () => {
    console.log('Scheduling for:', scheduledDateTime)
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setContent(`${aiPrompt}\n\n✨ Contenido generado por IA`)
      setIsGenerating(false)
    }, 1500)
  }

  const getDefaultScheduleDateTime = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(12, 0, 0, 0)
    return tomorrow.toISOString().slice(0, 16)
  }

  return (
    <Box p='xl' style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group gap='xs' mb='sm' justify='space-between'>
          <Group gap='xs'>
            <IoMegaphone size={28} />
            <Title order={2}>Publicador Multiplataforma</Title>
          </Group>
          <Button
            variant='light'
            leftSection={<IoOpen size={16} />}
            component='a'
            href='https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=308458716498232&filter_set=campaign.impressions-NUMBER%1EGREATER_THAN%1E%220%22&nav_source=business_manager'
            target='_blank'
          >
            Meta Business
          </Button>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value='create' leftSection={<IoAdd size={16} />}>
              Crear Publicación
            </Tabs.Tab>
            <Tabs.Tab value='drafts' leftSection={<IoDocument size={16} />}>
              Borradores ({draftPosts.length})
            </Tabs.Tab>
            <Tabs.Tab value='schedule' leftSection={<IoCalendar size={16} />}>
              Programados
            </Tabs.Tab>
            <Tabs.Tab value='history' leftSection={<IoCloudUpload size={16} />}>
              Historial
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='create' pt='md'>
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing='lg'>
              <Stack gap='lg'>
                <Paper p='lg' radius='lg' shadow='sm'>
                  <Stack gap='md'>
                    <Text fw={600} size='lg'>
                      Contenido
                    </Text>

                    <Textarea
                      placeholder='¿Qué quieres publicar?'
                      minRows={6}
                      maxRows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      autosize
                    />

                    <Group justify='space-between'>
                      <Text size='sm' c='dimmed'>
                        {content.length} / 2200 caracteres
                      </Text>
                      <Text size='xs' c='dimmed'>
                        Twitter: 280
                      </Text>
                    </Group>

                    <Divider label='Medios' labelPosition='left' />

                    <Group gap='md'>
                      <FileButton
                        onChange={handleMediaAdd}
                        accept='image/*,video/*'
                        multiple
                      >
                        {(props) => (
                          <Button
                            {...props}
                            variant='light'
                            leftSection={<IoImageOutline size={18} />}
                            disabled={mediaFiles.length >= 4}
                          >
                            Añadir Imagen/Video
                          </Button>
                        )}
                      </FileButton>
                      <Text size='sm' c='dimmed'>
                        Máx 4 archivos
                      </Text>
                    </Group>

                    {mediaFiles.length > 0 && (
                      <SimpleGrid cols={4} spacing='sm'>
                        {mediaFiles.map((media) => (
                          <Box key={media.id} pos='relative'>
                            {media.type === 'image' ? (
                              <Image
                                src={media.preview}
                                alt='Preview'
                                h={80}
                                fit='cover'
                                radius='md'
                              />
                            ) : (
                              <Box
                                h={80}
                                style={{
                                  background: 'var(--mantine-color-dark-5)',
                                  borderRadius: 'var(--mantine-radius-md)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Text size='xs' c='dimmed'>
                                  Video
                                </Text>
                              </Box>
                            )}
                            <ActionIcon
                              size='sm'
                              color='red'
                              variant='filled'
                              pos='absolute'
                              top={4}
                              right={4}
                              onClick={() => handleMediaRemove(media.id)}
                            >
                              <IoClose size={12} />
                            </ActionIcon>
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}

                    <Button
                      variant='light'
                      leftSection={<IoEye size={18} />}
                      onClick={() => setPreviewModalOpen(true)}
                      disabled={!content.trim()}
                      fullWidth
                    >
                      Ver Preview
                    </Button>
                  </Stack>
                </Paper>

                <Paper p='lg' radius='lg' shadow='sm'>
                  <Stack gap='md'>
                    <Text fw={600} size='lg'>
                      Plataformas
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Selecciona dónde publicar
                    </Text>

                    <Stack gap='sm'>
                      {platforms.map((platform) => (
                        <Paper
                          key={platform.id}
                          p='sm'
                          radius='md'
                          style={{
                            border: selectedPlatforms.includes(platform.id)
                              ? '2px solid var(--mantine-color-blue-5)'
                              : '1px solid var(--mantine-color-gray-4)',
                            cursor: platform.connected
                              ? 'pointer'
                              : 'not-allowed',
                            opacity: platform.connected ? 1 : 0.5
                          }}
                          onClick={() =>
                            platform.connected &&
                            handlePlatformToggle(platform.id)
                          }
                        >
                          <Group justify='space-between'>
                            <Group gap='sm'>
                              <Checkbox
                                checked={selectedPlatforms.includes(
                                  platform.id
                                )}
                                onChange={() => {}}
                                disabled={!platform.connected}
                                styles={{
                                  input: {
                                    cursor: platform.connected
                                      ? 'pointer'
                                      : 'not-allowed'
                                  }
                                }}
                              />
                              <ThemeIcon
                                color={platform.color}
                                variant='light'
                                size='md'
                                radius='md'
                              >
                                {platform.icon}
                              </ThemeIcon>
                              <Text fw={500}>{platform.name}</Text>
                            </Group>
                            {!platform.connected && (
                              <Badge color='gray' variant='light' size='sm'>
                                No conectado
                              </Badge>
                            )}
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>

              <Stack gap='lg'>
                <Paper
                  p='lg'
                  radius='lg'
                  shadow='sm'
                  style={{
                    background:
                      'linear-gradient(135deg, var(--mantine-color-violet-0) 0%, var(--mantine-color-blue-0) 100%)'
                  }}
                >
                  <Stack gap='md'>
                    <Group gap='xs'>
                      <IoSparkles
                        size={20}
                        color='var(--mantine-color-violet-6)'
                      />
                      <Text fw={600} size='lg'>
                        Asistente IA
                      </Text>
                    </Group>
                    <Text size='sm' c='dimmed'>
                      Describe qué quieres publicar y la IA te ayudará a crear
                      el contenido
                    </Text>

                    <Textarea
                      placeholder='Ej: Crea una publicación para Instagram sobre nuestro nuevo servicio de marketing digital...'
                      minRows={3}
                      maxRows={5}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      autosize
                    />

                    <Button
                      variant='gradient'
                      gradient={{ from: 'violet', to: 'blue', deg: 45 }}
                      leftSection={<IoSparkles size={18} />}
                      onClick={handleAiGenerate}
                      disabled={!aiPrompt.trim() || isGenerating}
                      loading={isGenerating}
                    >
                      {isGenerating ? 'Generando...' : 'Generar Contenido'}
                    </Button>
                  </Stack>
                </Paper>

                <Paper p='lg' radius='lg' shadow='sm'>
                  <Stack gap='md'>
                    <Text fw={600} size='lg'>
                      Programar
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Publicar ahora o programar para después
                    </Text>

                    <Group grow>
                      <Button
                        variant={!scheduledDateTime ? 'filled' : 'light'}
                        onClick={() => setScheduledDateTime(null)}
                      >
                        Publicar Ahora
                      </Button>
                      <Button
                        variant={scheduledDateTime ? 'filled' : 'light'}
                        leftSection={<IoCalendar size={18} />}
                        onClick={() => {
                          setScheduledDateTime(getDefaultScheduleDateTime())
                        }}
                      >
                        Programar
                      </Button>
                    </Group>

                    {scheduledDateTime && (
                      <TextInput
                        type='datetime-local'
                        label='Fecha y hora de publicación'
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                      />
                    )}
                  </Stack>
                </Paper>

                <Group grow>
                  <Button
                    size='lg'
                    variant='light'
                    leftSection={<IoDocument size={18} />}
                    onClick={handleSaveAsDraft}
                    disabled={!content.trim() || selectedPlatforms.length === 0}
                  >
                    Guardar Borrador
                  </Button>
                  <Button
                    size='lg'
                    leftSection={<IoSend size={20} />}
                    onClick={scheduledDateTime ? handleSchedule : handlePublish}
                    disabled={!content.trim() || selectedPlatforms.length === 0}
                  >
                    {scheduledDateTime
                      ? 'Programar Publicación'
                      : 'Publicar Ahora'}
                  </Button>
                </Group>
              </Stack>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value='drafts' pt='md'>
            <Paper p='lg' radius='lg' shadow='sm'>
              <Stack gap='md'>
                <Group justify='space-between'>
                  <Text fw={600} size='lg'>
                    Borradores
                  </Text>
                  <Button
                    size='xs'
                    variant='light'
                    leftSection={<IoAdd size={14} />}
                    onClick={() => setActiveTab('create')}
                  >
                    Nuevo Borrador
                  </Button>
                </Group>

                {draftPosts.length === 0 ? (
                  <Stack align='center' gap='md' py='xl'>
                    <ThemeIcon
                      size={64}
                      radius='xl'
                      variant='light'
                      color='gray'
                    >
                      <IoDocument size={32} />
                    </ThemeIcon>
                    <Text size='lg' fw={500}>
                      No hay borradores
                    </Text>
                    <Text c='dimmed'>
                      Crea una publicación y guárdala como borrador
                    </Text>
                  </Stack>
                ) : (
                  <Stack gap='sm'>
                    {draftPosts.map((post) => (
                      <Paper
                        key={post.id}
                        p='md'
                        radius='md'
                        style={{ borderLeft: getStatusBorder(post.status) }}
                      >
                        <Group justify='space-between'>
                          <Group gap='sm'>
                            <Group gap={4}>
                              {post.platforms.includes('instagram') && (
                                <IoLogoInstagram
                                  size={14}
                                  color='var(--mantine-color-violet-6)'
                                />
                              )}
                              {post.platforms.includes('facebook') && (
                                <IoLogoFacebook
                                  size={14}
                                  color='var(--mantine-color-blue-6)'
                                />
                              )}
                              {post.platforms.includes('linkedin') && (
                                <IoLogoLinkedin
                                  size={14}
                                  color='var(--mantine-color-blue-7)'
                                />
                              )}
                              {post.platforms.includes('twitter') && (
                                <IoLogoTwitter
                                  size={14}
                                  color='var(--mantine-color-cyan-6)'
                                />
                              )}
                            </Group>
                            <Box>
                              <Text size='sm' fw={500} lineClamp={1}>
                                {post.content}
                              </Text>
                              <Text size='xs' c='dimmed'>
                                Sin fecha definida
                              </Text>
                            </Box>
                          </Group>

                          <Group gap='xs'>
                            <Button
                              size='xs'
                              variant='light'
                              leftSection={<IoCreate size={12} />}
                              onClick={() => handleEditDraft(post)}
                            >
                              Editar
                            </Button>
                            <Button
                              size='xs'
                              variant='light'
                              color='blue'
                              leftSection={<IoCalendar size={12} />}
                              onClick={() => handlePublishDraft(post)}
                            >
                              Programar
                            </Button>
                            <Button
                              size='xs'
                              variant='light'
                              color='red'
                              leftSection={<IoTrash size={12} />}
                              onClick={() => handleDeleteDraft(post.id)}
                            >
                              Eliminar
                            </Button>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value='schedule' pt='md'>
            <Stack gap='lg'>
              <Paper p='lg' radius='lg' shadow='sm'>
                <Stack gap='md'>
                  <Group justify='space-between'>
                    <Text fw={600} size='lg'>
                      Próximas Publicaciones
                    </Text>
                    <Button
                      size='xs'
                      variant='light'
                      leftSection={<IoAdd size={14} />}
                      onClick={handleCreateFromScheduled}
                    >
                      Nueva Publicación
                    </Button>
                  </Group>

                  {scheduledPosts.length === 0 ? (
                    <Text c='dimmed' ta='center' py='md'>
                      No hay publicaciones programadas
                    </Text>
                  ) : (
                    <Stack gap='sm'>
                      {scheduledPosts.slice(0, 5).map((post) => (
                        <Paper
                          key={post.id}
                          p='sm'
                          radius='md'
                          style={{
                            border:
                              selectedPostId === post.id
                                ? '2px solid var(--mantine-color-blue-5)'
                                : '1px solid var(--mantine-color-gray-3)',
                            cursor: 'pointer',
                            background:
                              selectedPostId === post.id
                                ? 'var(--mantine-color-blue-light)'
                                : undefined
                          }}
                          onClick={() => handleSelectPost(post.id)}
                        >
                          <Group justify='space-between'>
                            <Group gap='sm'>
                              <Group gap={4}>
                                {post.platforms.includes('instagram') && (
                                  <IoLogoInstagram
                                    size={14}
                                    color='var(--mantine-color-violet-6)'
                                  />
                                )}
                                {post.platforms.includes('facebook') && (
                                  <IoLogoFacebook
                                    size={14}
                                    color='var(--mantine-color-blue-6)'
                                  />
                                )}
                                {post.platforms.includes('linkedin') && (
                                  <IoLogoLinkedin
                                    size={14}
                                    color='var(--mantine-color-blue-7)'
                                  />
                                )}
                                {post.platforms.includes('twitter') && (
                                  <IoLogoTwitter
                                    size={14}
                                    color='var(--mantine-color-cyan-6)'
                                  />
                                )}
                              </Group>
                              <Box>
                                <Text size='sm' fw={500} lineClamp={1}>
                                  {post.content}
                                </Text>
                                <Group gap='xs'>
                                  <Text size='xs' c='dimmed'>
                                    {post.date}
                                  </Text>
                                  <Text size='xs' c='dimmed'>
                                    •
                                  </Text>
                                  <Text size='xs' c='dimmed'>
                                    {post.time}
                                  </Text>
                                </Group>
                              </Box>
                            </Group>

                            {selectedPostId === post.id && (
                              <Group gap='xs'>
                                <Button
                                  size='xs'
                                  variant='light'
                                  leftSection={<IoCreate size={12} />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditPost(post)
                                  }}
                                >
                                  Modificar
                                </Button>
                                <Button
                                  size='xs'
                                  variant='light'
                                  color='red'
                                  leftSection={<IoTrash size={12} />}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePost(post.id)
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </Group>
                            )}
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Paper>

              <CalendarWidget
                events={scheduledEvents}
                onDateSelect={handleCalendarDateSelect}
                onEventClick={handleCalendarEventClick}
                onTimeSlotClick={() => {}}
                title='Calendario de Publicaciones'
                highlightToday
                workingHours={{ start: 8, end: 22 }}
              />

              {calendarSelectedDate && (
                <Paper
                  p='lg'
                  radius='lg'
                  shadow='sm'
                  style={{
                    border: '2px solid var(--mantine-color-blue-5)',
                    position: 'sticky',
                    width: '100%',
                    bottom: 20
                  }}
                >
                  <Group justify='space-between' align='flex-start'>
                    <Stack gap='md' style={{ flex: 1 }}>
                      <Text fw={600} size='lg'>
                        {dayjs(calendarSelectedDate).format(
                          'DD [de] MMMM [de] YYYY'
                        )}
                      </Text>
                      <Text c='dimmed'>No hay publicaciones en esta fecha</Text>
                      <Button
                        leftSection={<IoAdd size={16} />}
                        onClick={handleCreateFromCalendarDate}
                      >
                        Crear publicación
                      </Button>
                    </Stack>
                    <ActionIcon
                      variant='subtle'
                      onClick={() => setCalendarSelectedDate(null)}
                    >
                      <IoClose size={18} />
                    </ActionIcon>
                  </Group>
                </Paper>
              )}

              {selectedPost && (
                <Paper
                  p='lg'
                  radius='lg'
                  shadow='sm'
                  style={{
                    border: '2px solid var(--mantine-color-blue-5)',
                    position: 'sticky',
                    width: '100%',
                    bottom: 20
                  }}
                >
                  <Group justify='space-between' align='flex-start'>
                    <Stack gap='md' style={{ flex: 1 }}>
                      <Text fw={600} size='lg'>
                        Publicación seleccionada
                      </Text>
                      <Text lineClamp={2}>{selectedPost.content}</Text>
                      <Group gap='xs'>
                        {selectedPost.platforms.includes('instagram') && (
                          <IoLogoInstagram
                            size={16}
                            color='var(--mantine-color-violet-6)'
                          />
                        )}
                        {selectedPost.platforms.includes('facebook') && (
                          <IoLogoFacebook
                            size={16}
                            color='var(--mantine-color-blue-6)'
                          />
                        )}
                        {selectedPost.platforms.includes('linkedin') && (
                          <IoLogoLinkedin
                            size={16}
                            color='var(--mantine-color-blue-7)'
                          />
                        )}
                        <Text size='sm' c='dimmed'>
                          {selectedPost.date} • {selectedPost.time}
                        </Text>
                      </Group>
                      <Group grow>
                        <Button
                          leftSection={<IoCreate size={16} />}
                          onClick={() => handleEditPost(selectedPost)}
                        >
                          Modificar
                        </Button>
                        <Button
                          color='red'
                          leftSection={<IoTrash size={16} />}
                          onClick={() => handleDeletePost(selectedPost.id)}
                        >
                          Eliminar
                        </Button>
                      </Group>
                    </Stack>
                    <ActionIcon
                      variant='subtle'
                      onClick={() => setSelectedPostId(null)}
                    >
                      <IoClose size={18} />
                    </ActionIcon>
                  </Group>
                </Paper>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value='history' pt='md'>
            <Stack gap='lg'>
              <Tabs defaultValue='all'>
                <Tabs.List>
                  <Tabs.Tab
                    value='all'
                    onClick={() => {
                      setHistoryFilter('all')
                      setHistoryPage(1)
                    }}
                  >
                    Todas ({historyPosts.length})
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='published'
                    onClick={() => {
                      setHistoryFilter('published')
                      setHistoryPage(1)
                    }}
                  >
                    Publicadas (
                    {
                      historyPosts.filter((p) => p.status === 'published')
                        .length
                    }
                    )
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='scheduled'
                    onClick={() => {
                      setHistoryFilter('scheduled')
                      setHistoryPage(1)
                    }}
                  >
                    Programadas (
                    {
                      historyPosts.filter((p) => p.status === 'scheduled')
                        .length
                    }
                    )
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='failed'
                    onClick={() => {
                      setHistoryFilter('failed')
                      setHistoryPage(1)
                    }}
                  >
                    Fallidas (
                    {historyPosts.filter((p) => p.status === 'failed').length})
                  </Tabs.Tab>
                </Tabs.List>

                <Paper p='lg' radius='lg' shadow='sm' mt='md'>
                  {paginatedHistoryPosts.length === 0 ? (
                    <Stack align='center' gap='md' py='xl'>
                      <ThemeIcon
                        size={64}
                        radius='xl'
                        variant='light'
                        color='gray'
                      >
                        <IoCloudUpload size={32} />
                      </ThemeIcon>
                      <Text size='lg' fw={500}>
                        No hay publicaciones
                      </Text>
                      <Text c='dimmed'>
                        No se encontraron publicaciones con este filtro
                      </Text>
                    </Stack>
                  ) : (
                    <Stack gap='sm'>
                      {paginatedHistoryPosts.map((post) => (
                        <Paper
                          key={post.id}
                          p='md'
                          radius='md'
                          style={{ borderLeft: getStatusBorder(post.status) }}
                        >
                          <Group justify='space-between'>
                            <Group gap='sm'>
                              <Group gap={4}>
                                {post.platforms.includes('instagram') && (
                                  <IoLogoInstagram
                                    size={14}
                                    color='var(--mantine-color-violet-6)'
                                  />
                                )}
                                {post.platforms.includes('facebook') && (
                                  <IoLogoFacebook
                                    size={14}
                                    color='var(--mantine-color-blue-6)'
                                  />
                                )}
                                {post.platforms.includes('linkedin') && (
                                  <IoLogoLinkedin
                                    size={14}
                                    color='var(--mantine-color-blue-7)'
                                  />
                                )}
                                {post.platforms.includes('twitter') && (
                                  <IoLogoTwitter
                                    size={14}
                                    color='var(--mantine-color-cyan-6)'
                                  />
                                )}
                              </Group>
                              <Box>
                                <Group gap='xs'>
                                  <Text size='sm' fw={500} lineClamp={1}>
                                    {post.content}
                                  </Text>
                                  {getStatusBadge(post.status)}
                                </Group>
                                <Group gap='xs'>
                                  <Text size='xs' c='dimmed'>
                                    {post.date}
                                  </Text>
                                  <Text size='xs' c='dimmed'>
                                    •
                                  </Text>
                                  <Text size='xs' c='dimmed'>
                                    {post.time}
                                  </Text>
                                </Group>
                              </Box>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}

                  {totalHistoryPages > 1 && (
                    <Group justify='center' mt='lg' gap='xs'>
                      <Button
                        variant='subtle'
                        size='xs'
                        disabled={historyPage === 1}
                        onClick={() => setHistoryPage((p) => p - 1)}
                      >
                        Anterior
                      </Button>
                      <Text size='sm' c='dimmed'>
                        {historyPage} / {totalHistoryPages}
                      </Text>
                      <Button
                        variant='subtle'
                        size='xs'
                        disabled={historyPage === totalHistoryPages}
                        onClick={() => setHistoryPage((p) => p + 1)}
                      >
                        Siguiente
                      </Button>
                    </Group>
                  )}
                </Paper>
              </Tabs>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <Modal
        opened={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={
          <Group gap='sm'>
            <Text fw={600} size='lg'>
              Preview
            </Text>
            <Badge>
              {previewPlatform === 'instagram'
                ? 'Instagram'
                : previewPlatform === 'facebook'
                  ? 'Facebook'
                  : previewPlatform === 'twitter'
                    ? 'Twitter/X'
                    : 'LinkedIn'}
            </Badge>
          </Group>
        }
        size='md'
        centered
      >
        <Stack gap='md'>
          <Group justify='center' gap='xs'>
            {selectedPlatforms.map((platform) => (
              <Button
                key={platform}
                size='xs'
                variant={previewPlatform === platform ? 'filled' : 'light'}
                onClick={() => setPreviewPlatform(platform)}
                leftSection={
                  platform === 'instagram' ? (
                    <IoLogoInstagram size={14} />
                  ) : platform === 'facebook' ? (
                    <IoLogoFacebook size={14} />
                  ) : platform === 'twitter' ? (
                    <IoLogoTwitter size={14} />
                  ) : (
                    <IoLogoLinkedin size={14} />
                  )
                }
              >
                {platform === 'instagram'
                  ? 'Instagram'
                  : platform === 'facebook'
                    ? 'Facebook'
                    : platform === 'twitter'
                      ? 'Twitter/X'
                      : 'LinkedIn'}
              </Button>
            ))}
          </Group>

          {previewPlatform === 'instagram' && (
            <Paper
              p='md'
              radius='md'
              style={{
                background: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap='sm'>
                <Group gap='xs'>
                  <Avatar color='violet' radius='xl' size='sm'>
                    A
                  </Avatar>
                  <Box>
                    <Text size='sm' fw={600}>
                      Tu Empresa
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Ahora
                    </Text>
                  </Box>
                </Group>
                <Text size='sm'>{content}</Text>
                {mediaFiles.length > 0 && (
                  <Image
                    src={mediaFiles[0].preview}
                    alt='Preview'
                    radius='md'
                  />
                )}
                <Group gap='lg' pt='xs'>
                  <Text size='sm' c='dimmed'>
                    ❤️
                  </Text>
                  <Text size='sm' c='dimmed'>
                    💬
                  </Text>
                  <Text size='sm' c='dimmed'>
                    ✈️
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          {previewPlatform === 'facebook' && (
            <Paper
              p='md'
              radius='md'
              style={{
                background: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap='sm'>
                <Group gap='xs'>
                  <Avatar color='blue' radius='xl' size='sm'>
                    A
                  </Avatar>
                  <Box>
                    <Text size='sm' fw={600}>
                      Tu Empresa
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Ahora · 🌎
                    </Text>
                  </Box>
                </Group>
                <Text size='sm'>{content}</Text>
                {mediaFiles.length > 0 && (
                  <Image
                    src={mediaFiles[0].preview}
                    alt='Preview'
                    radius='md'
                  />
                )}
                <Divider />
                <Group justify='center' gap='xl' pt='xs'>
                  <Text size='sm' c='dimmed'>
                    👍 Me gusta
                  </Text>
                  <Text size='sm' c='dimmed'>
                    💬 Comentar
                  </Text>
                  <Text size='sm' c='dimmed'>
                    ↗️ Compartir
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}

          {previewPlatform === 'twitter' && (
            <Paper
              p='md'
              radius='md'
              style={{
                background: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap='sm'>
                <Group gap='xs'>
                  <Avatar color='cyan' radius='xl' size='sm'>
                    A
                  </Avatar>
                  <Box>
                    <Group gap='xs'>
                      <Text size='sm' fw={600}>
                        Tu Empresa
                      </Text>
                      <Text size='sm' c='dimmed'>
                        @tuempresa
                      </Text>
                    </Group>
                  </Box>
                </Group>
                <Text size='sm'>
                  {content.length > 280
                    ? content.slice(0, 280) + '...'
                    : content}
                </Text>
                {mediaFiles.length > 0 && (
                  <Image
                    src={mediaFiles[0].preview}
                    alt='Preview'
                    radius='md'
                  />
                )}
                <Group gap='xl' pt='xs'>
                  <Text size='sm' c='dimmed'>
                    💬
                  </Text>
                  <Text size='sm' c='dimmed'>
                    🔁
                  </Text>
                  <Text size='sm' c='dimmed'>
                    ❤️
                  </Text>
                  <Text size='sm' c='dimmed'>
                    📊
                  </Text>
                </Group>
                <Text size='xs' c={content.length > 280 ? 'red' : 'dimmed'}>
                  {content.length}/280
                </Text>
              </Stack>
            </Paper>
          )}

          {previewPlatform === 'linkedin' && (
            <Paper
              p='md'
              radius='md'
              style={{
                background: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap='sm'>
                <Group gap='xs'>
                  <Avatar color='blue' radius='xl' size='sm'>
                    A
                  </Avatar>
                  <Box>
                    <Text size='sm' fw={600}>
                      Tu Empresa
                    </Text>
                    <Text size='xs' c='dimmed'>
                      1.234 seguidores
                    </Text>
                    <Text size='xs' c='dimmed'>
                      Ahora · 🌐
                    </Text>
                  </Box>
                </Group>
                <Text size='sm'>{content}</Text>
                {mediaFiles.length > 0 && (
                  <Image
                    src={mediaFiles[0].preview}
                    alt='Preview'
                    radius='md'
                  />
                )}
                <Divider />
                <Group justify='center' gap='xl' pt='xs'>
                  <Text size='sm' c='dimmed'>
                    👍 Me gusta
                  </Text>
                  <Text size='sm' c='dimmed'>
                    💬 Comentar
                  </Text>
                  <Text size='sm' c='dimmed'>
                    ↗️ Compartir
                  </Text>
                  <Text size='sm' c='dimmed'>
                    ✈️ Enviar
                  </Text>
                </Group>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Modal>
    </Box>
  )
}
