'use client'

import { useMemo } from 'react'
import { Paper, Group, Text, ActionIcon, Box, Badge, Stack, ThemeIcon, ScrollArea, Divider, Button, SegmentedControl } from '@mantine/core'
import { IoCalendar, IoChevronBack, IoChevronForward, IoAdd, IoVideocam, IoSettings } from 'react-icons/io5'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { useSettings } from '@/contexts/SettingsContext'

dayjs.locale('es')

interface DashboardCalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  duration?: number
  type?: 'meeting' | 'task' | 'reminder' | 'deadline'
  status?: 'pending' | 'completed'
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

interface DashboardCalendarWidgetProps {
  onSettingsClick?: () => void
}

export default function DashboardCalendarWidget({ onSettingsClick }: DashboardCalendarWidgetProps) {
  const { settings } = useSettings()
  
  const mockEvents: DashboardCalendarEvent[] = useMemo(() => [
    { id: '1', title: 'Reunión con cliente', date: dayjs().format('YYYY-MM-DD'), time: '10:00', duration: 30, type: 'meeting', status: 'pending' },
    { id: '2', title: 'Demo producto', date: dayjs().add(1, 'day').format('YYYY-MM-DD'), time: '14:00', duration: 60, type: 'meeting', status: 'pending' },
    { id: '3', title: 'Deadline proyecto', date: dayjs().add(2, 'day').format('YYYY-MM-DD'), type: 'deadline', status: 'pending' },
  ], [])

  const today = dayjs()
  const daysInMonth = today.daysInMonth()
  const firstDayOfMonth = today.startOf('month').day()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getEventsForDay = (day: number) => {
    const dateStr = today.date(day).format('YYYY-MM-DD')
    return mockEvents.filter(e => e.date === dateStr)
  }

  const upcomingEvents = mockEvents
    .filter(e => dayjs(e.date).isAfter(today.subtract(1, 'day')))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)

  return (
    <Paper shadow="xs" p="md" radius="md" style={{ background: 'var(--mantine-color-body)' }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IoCalendar size={18} />
            <Text fw={600}>Calendario</Text>
          </Group>
          <ActionIcon variant="subtle" size="sm" onClick={onSettingsClick}>
            <IoSettings size={16} />
          </ActionIcon>
        </Group>

        <Group gap={0}>
          {WEEKDAYS.map((day) => (
            <Box key={day} style={{ flex: 1, textAlign: 'center' }}>
              <Text size="xs" c="dimmed" fw={500}>{day}</Text>
            </Box>
          ))}
        </Group>

        <Group gap={0}>
          {days.slice(0, 35).map((day, index) => {
            const isToday = day === today.date()
            const events = day ? getEventsForDay(day) : []
            
            return (
              <Box
                key={index}
                style={{
                  flex: 1,
                  minHeight: 40,
                  padding: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  cursor: day ? 'pointer' : 'default',
                  background: isToday ? 'var(--mantine-color-blue-1)' : 'transparent',
                }}
              >
                {day && (
                  <Stack gap={2} align="center">
                    <Text 
                      size="sm" 
                      fw={isToday ? 700 : 400}
                      c={isToday ? 'blue' : undefined}
                    >
                      {day}
                    </Text>
                    {events.length > 0 && (
                      <Box
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: isToday ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-violet-6)'
                        }}
                      />
                    )}
                  </Stack>
                )}
              </Box>
            )
          })}
        </Group>

        <Divider />

        <Group justify="space-between">
          <Text size="sm" c="dimmed">Próximos eventos</Text>
          <Badge variant="light" size="sm">{upcomingEvents.length}</Badge>
        </Group>

        <ScrollArea h={150}>
          <Stack gap="xs">
            {upcomingEvents.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center">No hay eventos próximos</Text>
            ) : (
              upcomingEvents.map((event) => (
                <Paper key={event.id} p="xs" radius="sm" style={{ background: 'var(--mantine-color-default)' }}>
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="blue" size="sm">
                      <IoVideocam size={12} />
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text size="sm" fw={500} truncate>{event.title}</Text>
                      <Text size="xs" c="dimmed">
                        {dayjs(event.date).format('DD MMM')}
                        {event.time && ` • ${event.time}`}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Stack>
    </Paper>
  )
}
