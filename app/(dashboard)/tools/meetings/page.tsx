'use client'

import { Suspense, useState, useEffect, useMemo, useCallback } from 'react'
import {
  Box,
  Stack,
  Title,
  Center,
  Loader,
  Paper,
  Text,
  Group,
  Button,
  SimpleGrid,
  Badge,
  ActionIcon,
  ThemeIcon,
  Tabs,
  Alert,
  Grid
} from '@mantine/core'
import {
  IoVideocam,
  IoCalendar,
  IoTime,
  IoPerson,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoSettings,
  IoRefresh,
  IoOpen
} from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import CalendarWidget, {
  type CalendarEvent,
  type DisabledSlot
} from '@/components/shared/calendars/CalendarWidget'
import { fetchCalendlyEvents } from '@/lib/calendly/actions'
import type { CalendlyEvent } from '@/lib/calendly/types'
import Link from 'next/link'
import dayjs from 'dayjs'

function MeetingsLoader() {
  return (
    <Center h={400}>
      <Loader size='lg' />
    </Center>
  )
}

interface Meeting {
  id: string
  title: string
  clientName: string
  clientEmail: string
  date: string
  time: string
  duration: number
  type: 'videocall' | 'presencial' | 'telefonica'
  status: 'programada' | 'completada' | 'cancelada'
  isFromCalendly?: boolean
  joinUrl?: string
}

function parseCalendlyEvent(event: CalendlyEvent): Meeting {
  const startStr = event.start_time
  const endStr = event.end_time

  const [datePart, timePart] = startStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)

  const duration = Math.round(
    (new Date(endStr).getTime() - new Date(startStr).getTime()) / 60000
  )
  const guest = event.event_guests?.[0] || event.event_memberships?.[0]

  return {
    id: event.uri.split('/').pop() || event.uri,
    title: event.name,
    clientName: guest?.name || 'Cliente',
    clientEmail: guest?.email || '',
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    duration,
    type: event.location?.join_url ? 'videocall' : 'presencial',
    status: event.status === 'active' ? 'programada' : 'cancelada',
    isFromCalendly: true,
    joinUrl: event.location?.join_url
  }
}

function requestNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }
}

function showMeetingNotification(meeting: Meeting) {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    new Notification('Reunión próxima', {
      body: `${meeting.title} con ${meeting.clientName} en 10 minutos`,
      icon: '/favicon.ico',
      tag: meeting.id
    })
  }
}

function MeetingsContent() {
  const { settings } = useSettings()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [calendlyError, setCalendlyError] = useState<string | null>(null)

  const calendlyIntegration = settings.integrations.find(
    (i) => i.id === 'calendly'
  )
  const calendlyToken = calendlyIntegration?.token || ''
  const calendlyUrl = calendlyIntegration?.webhookUrl || ''
  const isCalendlyEnabled = calendlyIntegration?.enabled && !!calendlyToken

  const loadCalendlyEvents = useCallback(async () => {
    if (!calendlyToken) return

    setIsLoading(true)
    setCalendlyError(null)

    try {
      const result = await fetchCalendlyEvents({
        token: calendlyToken,
        count: 100
      })

      if (result.success && result.events) {
        setMeetings(result.events.map(parseCalendlyEvent))
      } else if (result.error) {
        setCalendlyError(result.error)
      }
    } catch {
      setCalendlyError('Error al cargar eventos de Calendly')
    } finally {
      setIsLoading(false)
    }
  }, [calendlyToken])

  useEffect(() => {
    if (isCalendlyEnabled && calendlyToken) {
      loadCalendlyEvents()
      requestNotificationPermission()
    }
  }, [isCalendlyEnabled, calendlyToken, loadCalendlyEvents])

  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const now = dayjs()
      meetings.forEach((meeting) => {
        if (meeting.status === 'cancelada') return
        const meetingTime = dayjs(`${meeting.date} ${meeting.time}`)
        const diffMinutes = meetingTime.diff(now, 'minute')
        if (diffMinutes === 10) {
          showMeetingNotification(meeting)
        }
      })
    }

    const interval = setInterval(checkUpcomingMeetings, 60000)
    return () => clearInterval(interval)
  }, [meetings])

  const isMeetingPast = useCallback((meeting: Meeting): boolean => {
    return dayjs(`${meeting.date} ${meeting.time}`).isBefore(dayjs())
  }, [])

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return meetings
      .filter((m) => m.status !== 'cancelada')
      .map((m) => ({
        id: m.id,
        title: m.title,
        date: m.date,
        time: m.time,
        duration: m.duration,
        type: 'meeting' as const,
        status: isMeetingPast(m) ? 'completed' : 'pending',
        attendees: [m.clientName],
        location: m.type === 'videocall' ? 'Videollamada' : 'Presencial'
      }))
  }, [meetings, isMeetingPast])

  const disabledSlots: DisabledSlot[] = useMemo(() => {
    return meetings
      .filter((m) => m.status !== 'cancelada')
      .map((m) => ({ date: m.date, time: m.time, duration: m.duration }))
  }, [meetings])

  const typeLabels: Record<string, string> = {
    videocall: 'Videollamada',
    presencial: 'Presencial',
    telefonica: 'Telefónica'
  }

  const typeIcons: Record<string, React.ReactNode> = {
    videocall: <IoVideocam size={16} />,
    presencial: <IoPerson size={16} />,
    telefonica: <IoTime size={16} />
  }

  const scheduledCount = meetings.filter(
    (m) => m.status !== 'cancelada' && !isMeetingPast(m)
  ).length
  const completedCount = meetings.filter(
    (m) => m.status !== 'cancelada' && isMeetingPast(m)
  ).length
  const cancelledCount = meetings.filter((m) => m.status === 'cancelada').length

  return (
    <Box style={{ width: '100%' }}>
      <Stack gap='xl'>
        <Group justify='space-between'>
          <Group>
            <IoVideocam size={28} />
            <Title order={2}>Reuniones</Title>
          </Group>
          <Group>
            {isCalendlyEnabled && (
              <>
                <Button
                  variant='subtle'
                  onClick={loadCalendlyEvents}
                  loading={isLoading}
                  leftSection={<IoRefresh size={16} />}
                >
                  Sincronizar
                </Button>
                <Button
                  component='a'
                  href={calendlyUrl}
                  target='_blank'
                  leftSection={<IoOpen size={16} />}
                >
                  Nueva Reunión
                </Button>
              </>
            )}
            <Button
              variant='light'
              component={Link}
              href='/settings/integrations'
              leftSection={<IoSettings size={16} />}
            >
              Configurar
            </Button>
          </Group>
        </Group>

        {isCalendlyEnabled ? (
          <Alert icon={<IoCheckmarkCircle size={18} />} color='green'>
            <Group justify='space-between'>
              <Box>
                <Text size='sm' fw={500}>
                  Calendly conectado
                </Text>
                <Text size='xs' c='dimmed'>
                  {calendlyUrl}
                </Text>
              </Box>
              <Text size='sm'>{meetings.length} eventos sincronizados</Text>
            </Group>
          </Alert>
        ) : (
          <Alert
            icon={<IoAlertCircle size={18} />}
            title='Calendly no configurado'
            color='yellow'
          >
            <Group justify='space-between'>
              <Text size='sm'>
                Configura tu token de Calendly para sincronizar tus reuniones
                automáticamente.
              </Text>
              <Button
                size='xs'
                variant='light'
                component={Link}
                href='/settings/integrations'
              >
                Configurar
              </Button>
            </Group>
          </Alert>
        )}

        {calendlyError && (
          <Alert icon={<IoAlertCircle size={18} />} color='red'>
            <Group justify='space-between'>
              <Text size='sm'>{calendlyError}</Text>
              <Button size='xs' variant='light' onClick={loadCalendlyEvents}>
                Reintentar
              </Button>
            </Group>
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing='lg'>
          <Paper shadow='xs' p='md' radius='md'>
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Programadas
              </Text>
              <ThemeIcon variant='light' color='blue'>
                <IoCalendar size={18} />
              </ThemeIcon>
            </Group>
            <Text size='xl' fw={700}>
              {scheduledCount}
            </Text>
          </Paper>
          <Paper shadow='xs' p='md' radius='md'>
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Completadas
              </Text>
              <ThemeIcon variant='light' color='green'>
                <IoCheckmarkCircle size={18} />
              </ThemeIcon>
            </Group>
            <Text size='xl' fw={700}>
              {completedCount}
            </Text>
          </Paper>
          <Paper shadow='xs' p='md' radius='md'>
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Canceladas
              </Text>
              <ThemeIcon variant='light' color='red'>
                <IoCalendar size={18} />
              </ThemeIcon>
            </Group>
            <Text size='xl' fw={700}>
              {cancelledCount}
            </Text>
          </Paper>
          <Paper shadow='xs' p='md' radius='md'>
            <Group justify='space-between'>
              <Text size='sm' c='dimmed'>
                Este mes
              </Text>
              <ThemeIcon variant='light' color='violet'>
                <IoTime size={18} />
              </ThemeIcon>
            </Group>
            <Text size='xl' fw={700}>
              {
                meetings.filter((m) =>
                  m.date.startsWith(dayjs().format('YYYY-MM'))
                ).length
              }
            </Text>
          </Paper>
        </SimpleGrid>

        <Grid gutter='lg'>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <CalendarWidget
              events={calendarEvents}
              disabledSlots={disabledSlots}
              onDateSelect={() => {}}
              onEventClick={() => {}}
              onTimeSlotClick={() => {}}
              title='Calendario de Reuniones'
              highlightToday
              workingHours={{ start: 8, end: 20 }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Tabs defaultValue='programadas'>
              <Tabs.List>
                <Tabs.Tab value='programadas'>
                  Programadas ({scheduledCount})
                </Tabs.Tab>
                <Tabs.Tab value='todas'>Todas ({meetings.length})</Tabs.Tab>
                <Tabs.Tab value='completadas'>
                  Completadas ({completedCount})
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value='programadas' pt='md'>
                <MeetingsList
                  meetings={meetings.filter(
                    (m) => m.status !== 'cancelada' && !isMeetingPast(m)
                  )}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  isLoading={isLoading}
                  isMeetingPast={isMeetingPast}
                />
              </Tabs.Panel>

              <Tabs.Panel value='todas' pt='md'>
                <MeetingsList
                  meetings={meetings}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  isLoading={isLoading}
                  isMeetingPast={isMeetingPast}
                />
              </Tabs.Panel>

              <Tabs.Panel value='completadas' pt='md'>
                <MeetingsList
                  meetings={meetings.filter(
                    (m) => m.status !== 'cancelada' && isMeetingPast(m)
                  )}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  isLoading={isLoading}
                  isMeetingPast={isMeetingPast}
                />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  )
}

interface MeetingsListProps {
  meetings: Meeting[]
  typeLabels: Record<string, string>
  typeIcons: Record<string, React.ReactNode>
  isLoading?: boolean
  isMeetingPast: (meeting: Meeting) => boolean
}

function MeetingsList({
  meetings,
  typeLabels,
  typeIcons,
  isLoading,
  isMeetingPast
}: MeetingsListProps) {
  if (isLoading) {
    return (
      <Paper shadow='xs' p='xl' radius='md'>
        <Center>
          <Loader size='sm' />
          <Text c='dimmed' ml='sm'>
            Cargando reuniones...
          </Text>
        </Center>
      </Paper>
    )
  }

  if (meetings.length === 0) {
    return (
      <Paper shadow='xs' p='xl' radius='md'>
        <Text c='dimmed' ta='center'>
          No hay reuniones en esta categoría
        </Text>
      </Paper>
    )
  }

  return (
    <Stack gap='sm' style={{ maxHeight: 500, overflow: 'auto' }}>
      {meetings.map((meeting) => (
        <Paper
          key={meeting.id}
          shadow='xs'
          p='md'
          radius='md'
          style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}
        >
          <Stack gap='sm'>
            <Group justify='space-between'>
              <Group gap='xs'>
                <ThemeIcon variant='light' color='blue'>
                  {typeIcons[meeting.type]}
                </ThemeIcon>
                <Box>
                  <Group gap='xs'>
                    <Text fw={600}>{meeting.title}</Text>
                    <Badge color='green' variant='light' size='xs'>
                      Calendly
                    </Badge>
                  </Group>
                  <Group gap='xs'>
                    <IoPerson size={12} style={{ opacity: 0.6 }} />
                    <Text size='xs' c='dimmed'>
                      {meeting.clientName}
                    </Text>
                  </Group>
                </Box>
              </Group>
              <Badge
                color={
                  meeting.status === 'cancelada'
                    ? 'red'
                    : isMeetingPast(meeting)
                      ? 'green'
                      : 'blue'
                }
                variant='light'
                size='sm'
              >
                {meeting.status === 'cancelada'
                  ? 'Cancelada'
                  : isMeetingPast(meeting)
                    ? 'Completada'
                    : 'Programada'}
              </Badge>
            </Group>

            <Group gap='md'>
              <Group gap='xs'>
                <IoCalendar size={14} style={{ opacity: 0.6 }} />
                <Text size='sm' c='dimmed'>
                  {meeting.date}
                </Text>
              </Group>
              <Group gap='xs'>
                <IoTime size={14} style={{ opacity: 0.6 }} />
                <Text size='sm' c='dimmed'>
                  {meeting.time}
                </Text>
              </Group>
              <Badge variant='outline' size='sm'>
                {typeLabels[meeting.type]}
              </Badge>
              <Text size='xs' c='dimmed'>
                {meeting.duration} min
              </Text>
            </Group>

            {meeting.joinUrl &&
              !isMeetingPast(meeting) &&
              meeting.status !== 'cancelada' && (
                <Button
                  size='xs'
                  variant='light'
                  color='blue'
                  component='a'
                  href={meeting.joinUrl}
                  target='_blank'
                  leftSection={<IoVideocam size={14} />}
                  fullWidth
                >
                  Unirse a la reunión
                </Button>
              )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<MeetingsLoader />}>
      <MeetingsContent />
    </Suspense>
  )
}
