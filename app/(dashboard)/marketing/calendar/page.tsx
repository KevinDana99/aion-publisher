'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Title,
  Group,
  Text,
  Paper,
  ThemeIcon,
  Badge,
  Button,
  ActionIcon,
  SegmentedControl
} from '@mantine/core'
import {
  IoCalendar,
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoLinkedin,
  IoAdd,
  IoClose,
  IoCreate,
  IoTrash,
  IoMegaphone,
  IoOpen
} from 'react-icons/io5'
import CalendarWidget, {
  type CalendarEvent
} from '@/components/shared/calendars/CalendarWidget'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  date: string
  time: string
  status: 'scheduled' | 'published' | 'failed' | 'draft'
  eventType: 'post' | 'campaign'
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: '1',
    content: 'Lanzamiento nuevo producto',
    platforms: ['instagram', 'facebook'],
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '14:00',
    status: 'scheduled',
    eventType: 'post'
  },
  {
    id: '2',
    content: 'Tip semanal de marketing',
    platforms: ['linkedin'],
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'scheduled',
    eventType: 'post'
  },
  {
    id: '3',
    content: 'Promo fin de semana',
    platforms: ['instagram', 'facebook', 'linkedin'],
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    time: '12:00',
    status: 'scheduled',
    eventType: 'post'
  }
]

const mockCampaigns: ScheduledPost[] = [
  {
    id: 'c1',
    content: 'Campaña Black Friday',
    platforms: ['instagram', 'facebook', 'linkedin'],
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    time: '08:00',
    status: 'scheduled',
    eventType: 'campaign'
  },
  {
    id: 'c2',
    content: 'Campaña Navidad',
    platforms: ['instagram', 'facebook'],
    date: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'scheduled',
    eventType: 'campaign'
  },
  {
    id: 'c3',
    content: 'Campaña Reyes Magos',
    platforms: ['instagram'],
    date: dayjs().add(15, 'day').format('YYYY-MM-DD'),
    time: '12:00',
    status: 'scheduled',
    eventType: 'campaign'
  }
]

const mockHistoryPosts: ScheduledPost[] = [
  {
    id: 'h1',
    content: 'Nueva colección de verano',
    platforms: ['instagram', 'facebook'],
    date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'published',
    eventType: 'post'
  },
  {
    id: 'h2',
    content: 'Consejos para tu negocio',
    platforms: ['linkedin'],
    date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    time: '09:00',
    status: 'published',
    eventType: 'post'
  }
]

const allEvents = [...mockScheduledPosts, ...mockCampaigns, ...mockHistoryPosts]

const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case 'campaign':
      return 'violet'
    case 'post':
    default:
      return 'blue'
  }
}

export default function CalendarPage() {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [scheduledPosts, setScheduledPosts] =
    useState<ScheduledPost[]>(mockScheduledPosts)
  const [eventFilter, setEventFilter] = useState<string>('all')

  const filteredEvents = useMemo(() => {
    return allEvents.filter((post) => {
      if (eventFilter === 'all') return true
      return post.eventType === eventFilter
    })
  }, [eventFilter])

  const calendarEvents: CalendarEvent[] = filteredEvents.map((post) => ({
    id: post.id,
    title: post.content,
    date: post.date,
    time: post.time,
    duration: 30,
    type: post.eventType === 'campaign' ? 'campaign' : 'other',
    status: post.status === 'published' ? 'completed' : 'pending',
    attendees: post.platforms,
    location: post.platforms
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(', ')
  }))

  const selectedPost = useMemo(() => {
    if (!selectedEvent) return null
    return [...scheduledPosts, ...mockCampaigns, ...mockHistoryPosts].find(
      (p) => p.id === selectedEvent.id
    )
  }, [selectedEvent, scheduledPosts])

  const handleDeletePost = (postId: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== postId))
    setSelectedEvent(null)
  }

  return (
    <Box p='xl' style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group gap='xs'>
            <IoCalendar size={28} />
            <Title order={2}>Calendario de Publicaciones</Title>
          </Group>
          <Group>
            <Button
              variant='light'
              leftSection={<IoOpen size={16} />}
              component='a'
              href='https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=308458716498232&filter_set=campaign.impressions-NUMBER%1EGREATER_THAN%1E%220%22&nav_source=business_manager'
              target='_blank'
            >
              Meta Business
            </Button>
            <Button
              leftSection={<IoAdd size={18} />}
              onClick={() => router.push('/marketing/publisher')}
            >
              Nueva Publicación
            </Button>
          </Group>
        </Group>

        <SegmentedControl
          value={eventFilter}
          onChange={setEventFilter}
          data={[
            { label: 'Todas', value: 'all' },
            { label: 'Publicaciones', value: 'post' },
            { label: 'Campañas', value: 'campaign' }
          ]}
        />

        <Group align='flex-start' gap='lg'>
          <Box style={{ flex: 1 }}>
            <CalendarWidget
              events={calendarEvents}
              onDateSelect={() => {}}
              onEventClick={(event) => setSelectedEvent(event)}
              onTimeSlotClick={() => {}}
              title='Calendario'
              highlightToday
              workingHours={{ start: 8, end: 22 }}
            />
          </Box>

          {selectedPost && (
            <Paper p='lg' radius='lg' shadow='sm' w={350}>
              <Stack gap='md'>
                <Group justify='space-between'>
                  <Text fw={600} size='lg'>
                    Detalle
                  </Text>
                  <Group gap='xs'>
                    <ActionIcon
                      variant='subtle'
                      onClick={() => setSelectedEvent(null)}
                    >
                      <IoClose size={18} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Group gap='xs'>
                  <Badge
                    color={
                      selectedPost.eventType === 'campaign' ? 'violet' : 'blue'
                    }
                    variant='light'
                  >
                    {selectedPost.eventType === 'campaign'
                      ? 'Campaña'
                      : 'Publicación'}
                  </Badge>
                  <Badge
                    color={
                      selectedPost.status === 'published'
                        ? 'green'
                        : selectedPost.status === 'failed'
                          ? 'yellow'
                          : selectedPost.status === 'draft'
                            ? 'gray'
                            : 'blue'
                    }
                  >
                    {selectedPost.status === 'published'
                      ? 'Publicado'
                      : selectedPost.status === 'failed'
                        ? 'Fallido'
                        : selectedPost.status === 'draft'
                          ? 'Borrador'
                          : 'Programado'}
                  </Badge>
                </Group>

                <Text>{selectedPost.content}</Text>

                <Group gap='xs'>
                  {selectedPost.platforms.includes('instagram') && (
                    <ThemeIcon color='violet' variant='light' size='sm'>
                      <IoLogoInstagram size={14} />
                    </ThemeIcon>
                  )}
                  {selectedPost.platforms.includes('facebook') && (
                    <ThemeIcon color='blue' variant='light' size='sm'>
                      <IoLogoFacebook size={14} />
                    </ThemeIcon>
                  )}
                  {selectedPost.platforms.includes('linkedin') && (
                    <ThemeIcon color='blue' variant='light' size='sm'>
                      <IoLogoLinkedin size={14} />
                    </ThemeIcon>
                  )}
                  {selectedPost.platforms.includes('twitter') && (
                    <ThemeIcon color='cyan' variant='light' size='sm'>
                      <IoLogoTwitter size={14} />
                    </ThemeIcon>
                  )}
                </Group>

                {selectedPost.date && (
                  <Text size='sm' c='dimmed'>
                    {dayjs(selectedPost.date).format('DD [de] MMMM [de] YYYY')}{' '}
                    • {selectedPost.time}
                  </Text>
                )}

                <Group grow>
                  <Button
                    variant='light'
                    leftSection={<IoCreate size={16} />}
                    onClick={() => router.push('/marketing/publisher')}
                  >
                    Editar
                  </Button>
                  {selectedPost.status !== 'published' && (
                    <Button
                      variant='light'
                      color='red'
                      leftSection={<IoTrash size={16} />}
                      onClick={() => handleDeletePost(selectedPost.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </Group>
              </Stack>
            </Paper>
          )}
        </Group>
      </Stack>
    </Box>
  )
}
