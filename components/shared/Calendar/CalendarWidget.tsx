'use client'

import { useState, forwardRef } from 'react'
import { Box, Paper, Text, Group, Badge, Indicator, Stack, ThemeIcon, Popover, UnstyledButton } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import type { DateStringValue } from '@mantine/dates'
import { IoCalendar, IoTime, IoPerson, IoVideocam, IoLocationOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5'
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

export interface CalendarWidgetProps {
  events?: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onMonthChange?: (date: Date) => void
  defaultDate?: Date
  selectedDate?: Date | null
  highlightToday?: boolean
  showWeekends?: boolean
  locale?: string
  minDate?: Date
  maxDate?: Date
  title?: string
  showLegend?: boolean
  viewType?: 'full' | 'compact'
  maxHeight?: number
}

const typeColors: Record<string, string> = {
  meeting: 'blue',
  task: 'green',
  reminder: 'yellow',
  campaign: 'violet',
  deadline: 'red',
  other: 'gray'
}

const typeIcons: Record<string, React.ReactNode> = {
  meeting: <IoVideocam size={14} />,
  task: <IoCalendar size={14} />,
  reminder: <IoTime size={14} />,
  campaign: <IoCalendar size={14} />,
  deadline: <IoCalendar size={14} />,
  other: <IoCalendar size={14} />
}

const statusColors: Record<string, string> = {
  pending: 'blue',
  completed: 'green',
  cancelled: 'red'
}

function getDateFromEvent(event: CalendarEvent): Date {
  return typeof event.date === 'string' ? new Date(event.date) : event.date
}

function formatDateToDateString(date: Date): DateStringValue {
  return dayjs(date).format('YYYY-MM-DD')
}

const CalendarWidget = forwardRef<HTMLDivElement, CalendarWidgetProps>(({
  events = [],
  onDateSelect,
  onEventClick,
  onMonthChange,
  defaultDate = new Date(),
  selectedDate,
  highlightToday: highlightTodayProp = true,
  showWeekends = true,
  locale = 'es',
  minDate,
  maxDate,
  title,
  showLegend = true,
  viewType = 'full',
  maxHeight
}, ref) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultDate)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(selectedDate || null)

  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = formatDateToDateString(getDateFromEvent(event))
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, CalendarEvent[]>)

  const handleDateChange = (dateString: DateStringValue) => {
    const date = new Date(dateString)
    setInternalSelectedDate(date)
    onDateSelect?.(date)
  }

  const handleMonthChange = (dateString: DateStringValue) => {
    const date = new Date(dateString)
    setCurrentMonth(date)
    onMonthChange?.(date)
  }

  const renderDay = (dateString: DateStringValue) => {
    const date = new Date(dateString)
    const dayEvents = eventsByDate[dateString] || []
    const isToday = dayjs(date).isSame(dayjs(), 'day')
    const isSelected = internalSelectedDate && dayjs(date).isSame(dayjs(internalSelectedDate), 'day')
    const isWeekend = [0, 6].includes(date.getDay())

    if (dayEvents.length === 0) {
      return (
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--mantine-radius-md)',
            backgroundColor: isSelected 
              ? 'var(--mantine-color-blue-filled)' 
              : isToday && highlightTodayProp
                ? 'var(--mantine-color-blue-light)'
                : 'transparent',
            color: isSelected 
              ? 'white' 
              : isToday && highlightTodayProp
                ? 'var(--mantine-color-blue-filled)'
                : isWeekend && !showWeekends
                  ? 'var(--mantine-color-gray-4)'
                  : undefined,
            fontWeight: isToday || isSelected ? 700 : 400
          }}
        >
          {date.getDate()}
        </Box>
      )
    }

    const primaryEvent = dayEvents[0]
    const eventColor = primaryEvent.color || typeColors[primaryEvent.type || 'other']

    return (
      <Popover position="bottom" withArrow shadow="md" withinPortal>
        <Popover.Target>
          <Indicator
            size={dayEvents.length > 1 ? 12 : 6}
            color={eventColor}
            offset={-4}
            withBorder
            label={dayEvents.length > 1 ? dayEvents.length : undefined}
          >
            <Box
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: isSelected 
                  ? 'var(--mantine-color-blue-filled)' 
                  : isToday && highlightTodayProp
                    ? 'var(--mantine-color-blue-light)'
                    : 'transparent',
                color: isSelected 
                  ? 'white' 
                  : isToday && highlightTodayProp
                    ? 'var(--mantine-color-blue-filled)'
                    : undefined,
                fontWeight: isToday || isSelected ? 700 : 400,
                cursor: 'pointer'
              }}
            >
              {date.getDate()}
            </Box>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack gap="xs">
            <Text fw={600} size="sm">{dayjs(date).format('dddd, DD MMMM')}</Text>
            <Stack gap="xs">
              {dayEvents.map((event) => (
                <UnstyledButton
                  key={event.id}
                  onClick={() => {
                    onEventClick?.(event)
                    event.onClick?.()
                  }}
                  style={{
                    padding: 'var(--mantine-spacing-xs)',
                    borderRadius: 'var(--mantine-radius-sm)',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Group gap="xs">
                    <ThemeIcon variant="light" color={event.color || typeColors[event.type || 'other']} size="sm">
                      {typeIcons[event.type || 'other']}
                    </ThemeIcon>
                    <Text size="sm" fw={500}>{event.title}</Text>
                    {event.status && (
                      <Badge color={statusColors[event.status]} variant="light" size="xs">
                        {event.status}
                      </Badge>
                    )}
                  </Group>
                  {event.time && (
                    <Text size="xs" c="dimmed" mt={4}>{event.time}</Text>
                  )}
                </UnstyledButton>
              ))}
            </Stack>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    )
  }

  const getDayProps = (dateString: DateStringValue) => {
    const date = new Date(dateString)
    const isSelected = internalSelectedDate && dayjs(date).isSame(dayjs(internalSelectedDate), 'day')
    const isToday = dayjs(date).isSame(dayjs(), 'day')
    
    return {
      selected: isSelected || false,
      style: {
        backgroundColor: isSelected 
          ? 'var(--mantine-color-blue-filled)' 
          : isToday && highlightTodayProp
            ? 'var(--mantine-color-blue-light)'
            : undefined,
        color: isSelected 
          ? 'white' 
          : isToday && highlightTodayProp
            ? 'var(--mantine-color-blue-filled)'
            : undefined,
        fontWeight: isToday || isSelected ? 700 : 400,
        borderRadius: 'var(--mantine-radius-md)'
      }
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
          </Group>
        )}

        <Box style={{ maxHeight, overflow: 'auto' }}>
          <Calendar
            date={formatDateToDateString(currentMonth)}
            onDateChange={handleMonthChange}
            getDayProps={getDayProps}
            renderDay={renderDay}
            size={viewType === 'compact' ? 'sm' : 'md'}
            locale={locale}
            minDate={minDate ? formatDateToDateString(minDate) : undefined}
            maxDate={maxDate ? formatDateToDateString(maxDate) : undefined}
            hideOutsideDates
            previousIcon={<IoChevronBack size={16} />}
            nextIcon={<IoChevronForward size={16} />}
            highlightToday={highlightTodayProp}
            styles={{
              calendarHeader: {
                marginBottom: 'var(--mantine-spacing-md)'
              },
              calendarHeaderControl: {
                borderRadius: 'var(--mantine-radius-md)'
              },
              day: {
                borderRadius: 'var(--mantine-radius-md)',
                width: viewType === 'compact' ? 32 : 40,
                height: viewType === 'compact' ? 32 : 40
              }
            }}
          />
        </Box>

        {showLegend && (
          <Group gap="md">
            {Object.entries(typeColors).slice(0, 4).map(([type, color]) => (
              <Group key={type} gap="xs">
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: `var(--mantine-color-${color}-6)`
                  }}
                />
                <Text size="xs" c="dimmed" tt="capitalize">{type}</Text>
              </Group>
            ))}
          </Group>
        )}
      </Stack>
    </Paper>
  )
})

CalendarWidget.displayName = 'CalendarWidget'

export default CalendarWidget
