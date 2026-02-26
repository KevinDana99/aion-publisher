'use client'

import { useState, useEffect, useMemo } from 'react'
import { Paper, Group, Text, Box, Badge, Stack, ThemeIcon, ScrollArea, Center, Loader, Button } from '@mantine/core'
import { IoCalendar, IoVideocam, IoRefresh } from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import { fetchCalendlyEvents } from '@/lib/calendly/actions'
import type { CalendlyEvent } from '@/lib/calendly/types'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

interface Meeting {
  id: string
  title: string
  clientName: string
  date: string
  time: string
  duration: number
  type: 'videocall' | 'presencial'
  joinUrl?: string
}

function parseCalendlyEvent(event: CalendlyEvent): Meeting {
  const startStr = event.start_time
  const [datePart, timePart] = startStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  
  const duration = Math.round((new Date(event.end_time).getTime() - new Date(startStr).getTime()) / 60000)
  const guest = event.event_guests?.[0] || event.event_memberships?.[0]
  
  return {
    id: event.uri.split('/').pop() || event.uri,
    title: event.name,
    clientName: guest?.name || 'Cliente',
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    duration,
    type: event.location?.join_url ? 'videocall' : 'presencial',
    joinUrl: event.location?.join_url
  }
}

export default function DashboardCalendarWidget() {
  const { settings } = useSettings()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const calendlyIntegration = settings.integrations.find(i => i.id === 'calendly')
  const calendlyToken = calendlyIntegration?.token || ''
  const isCalendlyEnabled = calendlyIntegration?.enabled && !!calendlyToken

  const loadMeetings = async () => {
    if (!calendlyToken) return
    
    setIsLoading(true)
    try {
      const result = await fetchCalendlyEvents({ token: calendlyToken, count: 50 })
      if (result.success && result.events) {
        setMeetings(result.events.map(parseCalendlyEvent))
      }
    } catch {
      console.error('Error loading meetings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isCalendlyEnabled && calendlyToken) {
      loadMeetings()
    }
  }, [isCalendlyEnabled, calendlyToken])

  const today = dayjs()
  
  const upcomingMeetings = useMemo(() => {
    return meetings
      .filter(m => dayjs(`${m.date} ${m.time}`).isAfter(today.subtract(1, 'day')))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .slice(0, 6)
  }, [meetings, today])

  const scheduledCount = meetings.filter(m => dayjs(`${m.date} ${m.time}`).isAfter(today)).length

  return (
    <Paper shadow="xs" p="md" radius="md" style={{ background: 'var(--mantine-color-body)' }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IoCalendar size={18} />
            <Text fw={600}>Calendario</Text>
          </Group>
          <Group gap="xs">
            <Badge variant="light" size="sm">{scheduledCount} próximos</Badge>
            {isCalendlyEnabled && (
              <Box
                component="button"
                onClick={loadMeetings}
                disabled={isLoading}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: isLoading ? 0.5 : 1 }}
              >
                <IoRefresh size={14} />
              </Box>
            )}
          </Group>
        </Group>

        {!isCalendlyEnabled && (
          <Text size="sm" c="dimmed" ta="center">
            Configura Calendly para ver tus reuniones
          </Text>
        )}

        {isCalendlyEnabled && isLoading && (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        )}

        {isCalendlyEnabled && !isLoading && (
          <ScrollArea h={280}>
            <Stack gap="xs">
              {upcomingMeetings.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center">No hay reuniones próximas</Text>
              ) : (
                upcomingMeetings.map((meeting) => {
                  const isToday = dayjs(meeting.date).isSame(today, 'day')
                  const isTomorrow = dayjs(meeting.date).isSame(today.add(1, 'day'), 'day')
                  const dateLabel = isToday ? 'Hoy' : isTomorrow ? 'Mañana' : dayjs(meeting.date).format('DD MMM')
                  
                  return (
                    <Paper key={meeting.id} p="xs" radius="sm" style={{ background: 'var(--mantine-color-default)' }}>
                      <Stack gap="xs">
                        <Group gap="xs">
                          <ThemeIcon variant="light" color="blue" size="sm">
                            <IoVideocam size={12} />
                          </ThemeIcon>
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={500} truncate>{meeting.title}</Text>
                            <Text size="xs" c="dimmed">
                              {dateLabel}
                              {meeting.time && ` • ${meeting.time}`}
                              {meeting.duration && ` (${meeting.duration} min)`}
                            </Text>
                          </Box>
                          {isToday && (
                            <Badge color="blue" variant="filled" size="xs">Hoy</Badge>
                          )}
                        </Group>
                        {meeting.joinUrl && (
                          <Button
                            size="xs"
                            variant="light"
                            color="blue"
                            component="a"
                            href={meeting.joinUrl}
                            target="_blank"
                            leftSection={<IoVideocam size={12} />}
                            fullWidth
                          >
                            Unirse a la reunión
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  )
                })
              )}
            </Stack>
          </ScrollArea>
        )}
      </Stack>
    </Paper>
  )
}
