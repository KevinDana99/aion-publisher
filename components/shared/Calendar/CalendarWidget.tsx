'use client'

import { useState, forwardRef, useMemo } from 'react'
import { Box, Paper, Text, Group, Stack, UnstyledButton, SegmentedControl, ScrollArea, ActionIcon, Divider, Button, Badge, ThemeIcon } from '@mantine/core'
import { IoCalendar, IoChevronBack, IoChevronForward, IoAdd, IoVideocam, IoSettings } from 'react-icons/io5'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export interface CalendarEvent {
  id: string
  title: string
  date: Date | string
  time?: string
  duration?: number
  type?: 'meeting' | 'task' | 'reminder' | 'campaign' | 'deadline' | 'other'
  status?: 'pending' | 'completed' | 'cancelled'
  description?: string
  attendees?: string[]
  location?: string
  color?: string
  onClick?: () => void
}

export interface DisabledSlot {
  date: string
  time: string
  duration?: number
}

export interface CalendarWidgetProps {
  events?: CalendarEvent[]
  disabledSlots?: DisabledSlot[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onTimeSlotClick?: (date: Date, time: string) => void
  onMonthChange?: (date: Date) => void
  onSettingsClick?: () => void
  defaultDate?: Date
  selectedDate?: Date | null
  highlightToday?: boolean
  locale?: string
  title?: string
  workingHours?: { start: number; end: number }
  slotDuration?: number
}

const typeColors: Record<string, string> = {
  meeting: 'blue',
  task: 'green',
  reminder: 'yellow',
  campaign: 'violet',
  deadline: 'red',
  other: 'gray'
}

const statusColors: Record<string, string> = {
  pending: 'blue',
  completed: 'green',
  cancelled: 'red'
}

function getDateKeyFromEvent(event: CalendarEvent): string {
  if (typeof event.date === 'string') {
    return event.date
  }
  return dayjs(event.date).format('YYYY-MM-DD')
}

function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const WEEKDAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const CalendarWidget = forwardRef<HTMLDivElement, CalendarWidgetProps>(({
  events = [],
  disabledSlots = [],
  onDateSelect,
  onEventClick,
  onTimeSlotClick,
  onSettingsClick,
  defaultDate = new Date(),
  selectedDate,
  highlightToday = true,
  title,
  workingHours = { start: 8, end: 20 },
}, ref) => {
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate || null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach(event => {
      const key = getDateKeyFromEvent(event)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    })
    return map
  }, [events])

  const eventsByDateTime = useMemo(() => {
    const map = new Map<string, CalendarEvent>()
    events.forEach(event => {
      if (event.time) {
        const key = `${getDateKeyFromEvent(event)}-${event.time}`
        map.set(key, event)
      }
    })
    return map
  }, [events])

  const occupiedSlots = useMemo(() => {
    const set = new Set<string>()
    disabledSlots.forEach(slot => {
      const [hour, minute] = slot.time.split(':').map(Number)
      const duration = slot.duration || 30
      const slotsCount = Math.ceil(duration / 60)
      for (let i = 0; i < slotsCount; i++) {
        const slotHour = hour + i
        if (slotHour < workingHours.end) {
          set.add(`${slot.date}-${String(slotHour).padStart(2, '0')}:00`)
        }
      }
    })
    events.forEach(event => {
      if (event.time && event.duration) {
        const [hour, minute] = event.time.split(':').map(Number)
        const slotsCount = Math.ceil(event.duration / 60)
        for (let i = 0; i < slotsCount; i++) {
          const slotHour = hour + i
          if (slotHour < workingHours.end) {
            set.add(`${getDateKeyFromEvent(event)}-${String(slotHour).padStart(2, '0')}:00`)
          }
        }
      }
    })
    return set
  }, [disabledSlots, events, workingHours.end])

  const isSlotOccupied = (dateKey: string, time: string): boolean => {
    return occupiedSlots.has(`${dateKey}-${time}`)
  }

  const handleDateClick = (date: Date) => {
    setInternalSelectedDate(date)
    onDateSelect?.(date)
    if (view === 'month') {
      setView('day')
    }
  }

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
    setInternalSelectedDate(new Date())
  }

  const getWeekDates = () => {
    const start = dayjs(currentDate).startOf('week').toDate()
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const renderMonthView = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const weeks = []
    let currentWeekDate = new Date(startDate)

    while (currentWeekDate <= lastDay || weeks.length < 6) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentWeekDate))
        currentWeekDate.setDate(currentWeekDate.getDate() + 1)
      }
      weeks.push(week)
      if (currentWeekDate > lastDay && weeks.length >= 4) break
    }

    return (
      <Stack gap="sm">
        <Group gap={0}>
          {WEEKDAYS.map((day) => (
            <Box key={day} style={{ flex: 1, textAlign: 'center' }}>
              <Text size="sm" c="dimmed" fw={500}>{day}</Text>
            </Box>
          ))}
        </Group>

        {weeks.map((week, weekIndex) => (
          <Group key={weekIndex} gap={0}>
            {week.map((date) => {
              const dateKey = dayjs(date).format('YYYY-MM-DD')
              const dayEvents = eventsByDate.get(dateKey) || []
              const isCurrentMonth = date.getMonth() === month
              const isToday = dayjs(date).isSame(dayjs(), 'day')
              const isSelected = internalSelectedDate && dayjs(date).isSame(dayjs(internalSelectedDate), 'day')

              return (
                <UnstyledButton
                  key={dateKey}
                  onClick={() => handleDateClick(date)}
                  style={{
                    flex: 1,
                    minHeight: 60,
                    padding: 4,
                    borderRadius: 8,
                    backgroundColor: isSelected 
                      ? 'var(--mantine-color-blue-filled)' 
                      : isToday && highlightToday
                        ? 'rgba(34, 139, 230, 0.15)'
                        : 'transparent',
                    border: isSelected ? '2px solid var(--mantine-color-blue-6)' : '2px solid transparent',
                    cursor: 'pointer',
                    opacity: isCurrentMonth ? 1 : 0.4
                  }}
                >
                  <Stack gap={4} align="center">
                    <Text 
                      size="sm" 
                      fw={isToday ? 700 : 400}
                      c={isToday ? 'blue' : undefined}
                      ta="center"
                    >
                      {date.getDate()}
                    </Text>
                    {dayEvents.length > 0 && (
                      <Group gap={4}>
                        {dayEvents.length <= 3 ? (
                          dayEvents.map((event) => (
                            <Box
                              key={event.id}
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: `var(--mantine-color-${event.color || typeColors[event.type || 'other']}-6)`
                              }}
                            />
                          ))
                        ) : (
                          <>
                            <Box
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: 'var(--mantine-color-blue-6)'
                              }}
                            />
                            <Text size="xs" c="dimmed" fw={500}>+{dayEvents.length}</Text>
                          </>
                        )}
                      </Group>
                    )}
                  </Stack>
                </UnstyledButton>
              )
            })}
          </Group>
        ))}
      </Stack>
    )
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates()
    const hours: number[] = []
    for (let h = workingHours.start; h < workingHours.end; h++) {
      hours.push(h)
    }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: 600 }}>
      <Group gap={0} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Box style={{ width: 60 }} />
        {weekDates.map((date) => {
          const isToday = dayjs(date).isSame(dayjs(), 'day')
          const dateKey = dayjs(date).format('YYYY-MM-DD')
          const dayEvents = eventsByDate.get(dateKey) || []
          
          return (
            <Box key={date.toISOString()} style={{ flex: 1, textAlign: 'center', padding: '8px 4px' }}>
              <Text size="xs" c="dimmed">{WEEKDAYS[date.getDay()]}</Text>
              <Text size="lg" fw={isToday ? 700 : 400} c={isToday ? 'blue' : undefined}>
                {date.getDate()}
              </Text>
              {dayEvents.length > 0 && (
                <Group gap={4} justify="center" mt={2}>
                  {dayEvents.slice(0, 3).map((event) => (
                    <Box
                      key={event.id}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: `var(--mantine-color-${event.color || typeColors[event.type || 'other']}-6)`
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Text size="xs" c="dimmed">+{dayEvents.length - 3}</Text>
                  )}
                </Group>
              )}
            </Box>
          )
        })}
      </Group>

      <ScrollArea flex={1}>
        <Group gap={0} align="flex-start">
          <Box style={{ width: 60 }}>
            {hours.map((hour) => (
              <Box key={hour} style={{ height: 60 }}>
                <Text size="xs" c="dimmed" ta="right" pr={8}>
                  {formatTime(hour)}
                </Text>
              </Box>
            ))}
          </Box>

          {weekDates.map((date) => {
            const dateKey = dayjs(date).format('YYYY-MM-DD')

            return (
              <Box key={dateKey} style={{ flex: 1, position: 'relative' }}>
                {hours.map((hour) => {
                  const timeKey = `${dateKey}-${formatTime(hour)}`
                  const event = eventsByDateTime.get(timeKey)
                  const slotTime = formatTime(hour)
                  const isOccupied = isSlotOccupied(dateKey, slotTime)

                  return (
                    <UnstyledButton
                      key={hour}
                      onClick={() => !isOccupied && !event && onTimeSlotClick?.(date, slotTime)}
                      disabled={isOccupied && !event}
                      style={{
                        width: '100%',
                        height: 60,
                        borderTop: '1px solid var(--mantine-color-default-border)',
                        borderLeft: '1px solid var(--mantine-color-default-border)',
                        padding: 4,
                        textAlign: 'left',
                        cursor: isOccupied && !event ? 'not-allowed' : 'pointer',
                        opacity: isOccupied && !event ? 0.4 : 1,
                        backgroundColor: isOccupied && !event ? 'var(--mantine-color-gray-1)' : 'transparent'
                      }}
                    >
                        {event ? (
                          <Box
                            style={{
                              padding: '4px 6px',
                              borderRadius: 4,
                              backgroundColor: `var(--mantine-color-${event.color || typeColors[event.type || 'other']}-1)`,
                              borderLeft: `2px solid var(--mantine-color-${event.color || typeColors[event.type || 'other']}-6)`,
                              height: '100%'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick?.(event)
                            }}
                          >
                            <Text size="xs" fw={600} truncate>{event.title}</Text>
                          </Box>
                        ) : isOccupied ? (
                          <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>Ocupado</Text>
                        ) : null}
                      </UnstyledButton>
                    )
                  })}
                </Box>
              )
            })}
          </Group>
        </ScrollArea>
      </Box>
    )
  }

  const renderDayView = () => {
    const hours: number[] = []
    for (let h = workingHours.start; h < workingHours.end; h++) {
      hours.push(h)
    }

    const dateKey = dayjs(currentDate).format('YYYY-MM-DD')
    const dayEvents = eventsByDate.get(dateKey) || []
    const dayName = WEEKDAYS_FULL[currentDate.getDay()]
    const formattedDate = dayjs(currentDate).format('DD MMMM YYYY')

    return (
      <Stack gap="md">
        <Box>
          <Text fw={600}>{dayName}</Text>
          <Text c="dimmed">{formattedDate}</Text>
        </Box>

        <ScrollArea h={500}>
          <Group gap={0} align="flex-start">
            <Box style={{ width: 60 }}>
              {hours.map((hour) => (
                <Box key={hour} style={{ height: 60 }}>
                  <Text size="xs" c="dimmed" ta="right" pr={8}>
                    {formatTime(hour)}
                  </Text>
                </Box>
              ))}
            </Box>

            <Box style={{ flex: 1, position: 'relative' }}>
              {hours.map((hour) => {
                const timeKey = `${dateKey}-${formatTime(hour)}`
                const event = eventsByDateTime.get(timeKey)
                const slotTime = formatTime(hour)
                const isOccupied = isSlotOccupied(dateKey, slotTime)

                return (
                  <UnstyledButton
                    key={hour}
                    onClick={() => !isOccupied && !event && onTimeSlotClick?.(currentDate, slotTime)}
                    disabled={isOccupied && !event}
                    style={{
                      width: '100%',
                      height: 60,
                      borderTop: '1px solid var(--mantine-color-default-border)',
                      borderLeft: '1px solid var(--mantine-color-default-border)',
                      padding: 4,
                      textAlign: 'left',
                      cursor: isOccupied && !event ? 'not-allowed' : 'pointer',
                      opacity: isOccupied && !event ? 0.4 : 1,
                      backgroundColor: isOccupied && !event ? 'var(--mantine-color-gray-1)' : 'transparent'
                    }}
                  >
                    {event ? (
                      <Box
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          backgroundColor: `var(--mantine-color-${event.color || typeColors[event.type || 'other']}-1)`,
                          borderLeft: `4px solid var(--mantine-color-${event.color || typeColors[event.type || 'other']}-6)`,
                          height: '100%'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                      >
                        <Group gap="xs">
                          <ThemeIcon variant="light" color={event.color || typeColors[event.type || 'other']} size="sm">
                            <IoVideocam size={14} />
                          </ThemeIcon>
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={600}>{event.title}</Text>
                            <Group gap="xs">
                              <Text size="xs" c="dimmed">{event.time}</Text>
                              <Text size="xs" c="dimmed">•</Text>
                              <Text size="xs" c="dimmed">{event.duration} min</Text>
                            </Group>
                            {event.attendees && event.attendees.length > 0 && (
                              <Text size="xs" c="dimmed">{event.attendees.join(', ')}</Text>
                            )}
                          </Box>
                          {event.status && (
                            <Badge color={statusColors[event.status]} variant="light" size="xs">
                              {event.status}
                            </Badge>
                          )}
                        </Group>
                      </Box>
                    ) : isOccupied ? (
                      <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>Ocupado</Text>
                    ) : (
                      <Group gap="xs" style={{ opacity: 0.5 }}>
                        <IoAdd size={16} />
                        <Text size="xs" c="dimmed">Disponible</Text>
                      </Group>
                    )}
                  </UnstyledButton>
                )
              })}
            </Box>
          </Group>
        </ScrollArea>

        {dayEvents.length > 0 && (
          <Box>
            <Divider label="Resumen del día" labelPosition="left" my="sm" />
            <Group gap="xs">
              {dayEvents.map((event) => (
                <Badge
                  key={event.id}
                  color={event.color || typeColors[event.type || 'other']}
                  variant="light"
                >
                  {event.time} - {event.title}
                </Badge>
              ))}
            </Group>
          </Box>
        )}
      </Stack>
    )
  }

  const getViewTitle = () => {
    if (view === 'month') {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    } else if (view === 'week') {
      const weekDates = getWeekDates()
      const start = weekDates[0]
      const end = weekDates[6]
      return `${dayjs(start).format('DD MMM')} - ${dayjs(end).format('DD MMM YYYY')}`
    } else {
      return dayjs(currentDate).format('dddd, DD MMMM YYYY')
    }
  }

  return (
    <Paper ref={ref} shadow="sm" p="md" radius="md" style={{ background: 'var(--mantine-color-body)' }}>
      <Stack gap="md">
        {title && (
          <Group justify="space-between">
            <Group gap="xs">
              <IoCalendar size={20} />
              <Text fw={600} size="lg">{title}</Text>
            </Group>
            {onSettingsClick && (
              <ActionIcon variant="subtle" size="sm" onClick={onSettingsClick}>
                <IoSettings size={16} />
              </ActionIcon>
            )}
          </Group>
        )}

        <Group justify="space-between">
          <Group gap="xs">
            <ActionIcon variant="subtle" onClick={handlePrev}>
              <IoChevronBack size={18} />
            </ActionIcon>
            <ActionIcon variant="subtle" onClick={handleNext}>
              <IoChevronForward size={18} />
            </ActionIcon>
            <Button variant="subtle" size="compact-sm" onClick={handleToday}>
              Hoy
            </Button>
            <Text fw={600} ml="sm">{getViewTitle()}</Text>
          </Group>

          <SegmentedControl
            value={view}
            onChange={(value) => setView(value as 'month' | 'week' | 'day')}
            data={[
              { label: 'Mes', value: 'month' },
              { label: 'Semana', value: 'week' },
              { label: 'Día', value: 'day' }
            ]}
            size="sm"
            styles={{
              root: { background: 'var(--mantine-color-dark-6)' },
              indicator: { background: 'var(--mantine-color-dark-4)' }
            }}
          />
        </Group>

        <Divider />

        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}

        <Group gap="md">
          {Object.entries(typeColors).slice(0, 5).map(([type, color]) => (
            <Group key={type} gap="xs">
              <Box
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 4,
                  backgroundColor: `var(--mantine-color-${color}-6)`
                }}
              />
              <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>{type}</Text>
            </Group>
          ))}
        </Group>
      </Stack>
    </Paper>
  )
})

CalendarWidget.displayName = 'CalendarWidget'

export default CalendarWidget