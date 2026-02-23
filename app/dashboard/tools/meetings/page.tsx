'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, Badge, ActionIcon, Box, Modal, TextInput, Select, Divider, ThemeIcon, Tabs, Anchor, Alert, Textarea, Grid } from '@mantine/core'
import { IoVideocam, IoAdd, IoTrash, IoLink, IoCalendar, IoTime, IoPerson, IoCheckmarkCircle, IoAlertCircle, IoOpen, IoSettings, IoRefresh } from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import CalendarWidget, { type CalendarEvent } from '@/components/shared/Calendar/CalendarWidget'
import { fetchCalendlyEvents } from '@/lib/calendly/actions'
import type { CalendlyEvent } from '@/lib/calendly/types'
import Link from 'next/link'
import dayjs from 'dayjs'

function MeetingsLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
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
  calendlyLink?: string
  notes: string
  isFromCalendly?: boolean
}

const initialMeetings: Meeting[] = []

function parseCalendlyEvent(event: CalendlyEvent): Meeting {
  const startStr = event.start_time
  const endStr = event.end_time
  
  const [datePart, timePart] = startStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  
  const localDate = new Date(year, month - 1, day + 1, hour, minute)
  const duration = Math.round((new Date(endStr).getTime() - new Date(startStr).getTime()) / 60000)
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
    notes: '',
    isFromCalendly: true
  }
}

function MeetingsContent() {
  const { settings } = useSettings()
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [modalOpened, setModalOpened] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [calendlyError, setCalendlyError] = useState<string | null>(null)

  const calendlyIntegration = settings.integrations.find(i => i.id === 'calendly')
  const calendlyToken = calendlyIntegration?.token || ''
  const calendlyUrl = calendlyIntegration?.webhookUrl || ''
  const isCalendlyEnabled = calendlyIntegration?.enabled && !!calendlyToken

  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    clientName: '',
    clientEmail: '',
    date: '',
    time: '',
    duration: 30,
    type: 'videocall',
    notes: ''
  })

  useEffect(() => {
    if (isCalendlyEnabled) {
      loadCalendlyEvents()
    }
  }, [isCalendlyEnabled, calendlyToken])

  const loadCalendlyEvents = async () => {
    if (!calendlyToken) return
    
    setIsLoading(true)
    setCalendlyError(null)
    
    try {
      const result = await fetchCalendlyEvents({ 
        token: calendlyToken,
        count: 100
      })
      
      if (result.success && result.events) {
        const calendlyMeetings = result.events.map(parseCalendlyEvent)
        const localMeetings = meetings.filter(m => !m.isFromCalendly)
        setMeetings([...localMeetings, ...calendlyMeetings])
      } else if (result.error) {
        setCalendlyError(result.error)
      }
    } catch (error) {
      console.error('Error loading Calendly events:', error)
      setCalendlyError('Error al cargar eventos de Calendly')
    } finally {
      setIsLoading(false)
    }
  }

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return meetings
      .filter(m => m.status !== 'cancelada')
      .map(m => ({
        id: m.id,
        title: m.title,
        date: m.date,
        time: m.time,
        duration: m.duration,
        type: 'meeting' as const,
        status: m.status === 'programada' ? 'pending' : 'completed',
        description: m.notes,
        attendees: [m.clientName],
        location: m.type === 'videocall' ? 'Videollamada' : m.type === 'presencial' ? 'Presencial' : 'Telefónica'
      }))
  }, [meetings])

  const statusColors: Record<string, string> = {
    programada: 'blue',
    completada: 'green',
    cancelada: 'red'
  }

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

  const createMeeting = () => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title || '',
      clientName: newMeeting.clientName || '',
      clientEmail: newMeeting.clientEmail || '',
      date: newMeeting.date || '',
      time: newMeeting.time || '',
      duration: newMeeting.duration || 30,
      type: newMeeting.type || 'videocall',
      status: 'programada',
      calendlyLink: calendlyUrl ? `${calendlyUrl}/${newMeeting.duration || 30}min` : undefined,
      notes: newMeeting.notes || '',
      isFromCalendly: false
    }
    setMeetings([meeting, ...meetings])
    setModalOpened(false)
    setNewMeeting({
      title: '',
      clientName: '',
      clientEmail: '',
      date: '',
      time: '',
      duration: 30,
      type: 'videocall',
      notes: ''
    })
  }

  const deleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id))
  }

  const updateStatus = (id: string, status: 'programada' | 'completada' | 'cancelada') => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, status } : m))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleEventClick = (event: CalendarEvent) => {
    const meeting = meetings.find(m => m.id === event.id)
    if (meeting) {
      console.log('Selected meeting:', meeting)
    }
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    setNewMeeting({
      ...newMeeting,
      date: dayjs(date).format('YYYY-MM-DD'),
      time: time
    })
    setModalOpened(true)
  }

  const scheduledCount = meetings.filter(m => m.status === 'programada').length
  const completedCount = meetings.filter(m => m.status === 'completada').length
  const cancelledCount = meetings.filter(m => m.status === 'cancelada').length

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoVideocam size={28} />
            <Title order={2}>Reuniones</Title>
          </Group>
          <Group>
            {isCalendlyEnabled && (
              <Button 
                variant="subtle" 
                onClick={loadCalendlyEvents}
                loading={isLoading}
                leftSection={<IoRefresh size={16} />}
              >
                Sincronizar
              </Button>
            )}
            <Button 
              variant="light" 
              component={Link}
              href="/dashboard/settings/integrations"
              leftSection={<IoSettings size={16} />}
            >
              Configurar
            </Button>
            <Button leftSection={<IoAdd size={18} />} onClick={() => setModalOpened(true)}>
              Nueva Reunión
            </Button>
          </Group>
        </Group>

        {isCalendlyEnabled ? (
          <Alert icon={<IoCheckmarkCircle size={18} />} color="green">
            <Group justify="space-between">
              <Box>
                <Text size="sm" fw={500}>Calendly conectado</Text>
                <Text size="xs" c="dimmed">{calendlyUrl}</Text>
              </Box>
              <Text size="sm">{meetings.filter(m => m.isFromCalendly).length} eventos sincronizados</Text>
            </Group>
          </Alert>
        ) : (
          <Alert icon={<IoAlertCircle size={18} />} title="Calendly no configurado" color="yellow">
            <Group justify="space-between">
              <Text size="sm">Configura tu token de Calendly para sincronizar tus reuniones automáticamente.</Text>
              <Button 
                size="xs" 
                variant="light" 
                component={Link}
                href="/dashboard/settings/integrations"
              >
                Configurar
              </Button>
            </Group>
          </Alert>
        )}

        {calendlyError && (
          <Alert icon={<IoAlertCircle size={18} />} color="red">
            <Group justify="space-between">
              <Text size="sm">{calendlyError}</Text>
              <Button size="xs" variant="light" onClick={loadCalendlyEvents}>
                Reintentar
              </Button>
            </Group>
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg">
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Programadas</Text>
              <ThemeIcon variant="light" color="blue"><IoCalendar size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{scheduledCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Completadas</Text>
              <ThemeIcon variant="light" color="green"><IoCheckmarkCircle size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{completedCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Canceladas</Text>
              <ThemeIcon variant="light" color="red"><IoTrash size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{cancelledCount}</Text>
          </Paper>
          <Paper shadow="xs" p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Este mes</Text>
              <ThemeIcon variant="light" color="violet"><IoTime size={18} /></ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>{meetings.filter(m => m.date.startsWith(dayjs().format('YYYY-MM'))).length}</Text>
          </Paper>
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <CalendarWidget
              events={calendarEvents}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
              title="Calendario de Reuniones"
              highlightToday
              workingHours={{ start: 8, end: 20 }}
            />
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Tabs defaultValue="programadas">
              <Tabs.List>
                <Tabs.Tab value="programadas">Programadas ({meetings.filter(m => m.status === 'programada').length})</Tabs.Tab>
                <Tabs.Tab value="todas">Todas ({meetings.length})</Tabs.Tab>
                <Tabs.Tab value="completadas">Completadas</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="programadas" pt="md">
                <MeetingsList 
                  meetings={meetings.filter(m => m.status === 'programada')} 
                  statusColors={statusColors}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  onDelete={deleteMeeting}
                  onUpdateStatus={updateStatus}
                  isLoading={isLoading}
                />
              </Tabs.Panel>

              <Tabs.Panel value="todas" pt="md">
                <MeetingsList 
                  meetings={meetings} 
                  statusColors={statusColors}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  onDelete={deleteMeeting}
                  onUpdateStatus={updateStatus}
                  isLoading={isLoading}
                />
              </Tabs.Panel>

              <Tabs.Panel value="completadas" pt="md">
                <MeetingsList 
                  meetings={meetings.filter(m => m.status === 'completada')} 
                  statusColors={statusColors}
                  typeLabels={typeLabels}
                  typeIcons={typeIcons}
                  onDelete={deleteMeeting}
                  onUpdateStatus={updateStatus}
                  isLoading={isLoading}
                />
              </Tabs.Panel>
            </Tabs>
          </Grid.Col>
        </Grid>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={600} size="lg">Nueva Reunión</Text>}
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">Programa una nueva reunión con tu cliente</Text>
          
          <Divider label="Información de la Reunión" labelPosition="left" />
          
          <TextInput 
            label="Título de la reunión" 
            placeholder="Ej: Kick-off Proyecto Alpha"
            value={newMeeting.title || ''}
            onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
            required
          />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput 
              label="Cliente" 
              placeholder="Nombre del cliente"
              value={newMeeting.clientName || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, clientName: e.target.value })}
              required
            />
            <TextInput 
              label="Email del cliente" 
              placeholder="cliente@email.com"
              type="email"
              value={newMeeting.clientEmail || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, clientEmail: e.target.value })}
              required
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <TextInput 
              label="Fecha" 
              type="date"
              value={newMeeting.date || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
              required
            />
            <TextInput 
              label="Hora" 
              type="time"
              value={newMeeting.time || ''}
              onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
              required
            />
            <Select
              label="Duración"
              data={[
                { value: '15', label: '15 minutos' },
                { value: '30', label: '30 minutos' },
                { value: '45', label: '45 minutos' },
                { value: '60', label: '1 hora' },
                { value: '90', label: '1.5 horas' },
                { value: '120', label: '2 horas' }
              ]}
              value={String(newMeeting.duration || 30)}
              onChange={(value) => setNewMeeting({ ...newMeeting, duration: Number(value) })}
            />
          </SimpleGrid>

          <Select
            label="Tipo de reunión"
            data={[
              { value: 'videocall', label: 'Videollamada' },
              { value: 'presencial', label: 'Presencial' },
              { value: 'telefonica', label: 'Telefónica' }
            ]}
            value={newMeeting.type || 'videocall'}
            onChange={(value) => setNewMeeting({ ...newMeeting, type: value as 'videocall' | 'presencial' | 'telefonica' })}
          />

          {calendlyUrl && newMeeting.type === 'videocall' && (
            <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-blue-0)' }}>
              <Group gap="xs">
                <IoLink size={16} />
                <Text size="sm">Enlace Calendly: {calendlyUrl}/{newMeeting.duration || 30}min</Text>
              </Group>
            </Paper>
          )}

          <Textarea
            label="Notas"
            placeholder="Notas adicionales para la reunión..."
            value={newMeeting.notes || ''}
            onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
            rows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createMeeting}
              disabled={!newMeeting.title || !newMeeting.clientName || !newMeeting.date || !newMeeting.time}
            >
              Crear Reunión
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}

interface MeetingsListProps {
  meetings: Meeting[]
  statusColors: Record<string, string>
  typeLabels: Record<string, string>
  typeIcons: Record<string, React.ReactNode>
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: 'programada' | 'completada' | 'cancelada') => void
  isLoading?: boolean
}

function MeetingsList({ meetings, statusColors, typeLabels, typeIcons, onDelete, onUpdateStatus, isLoading }: MeetingsListProps) {
  if (isLoading) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Center>
          <Loader size="sm" />
          <Text c="dimmed" ml="sm">Cargando reuniones...</Text>
        </Center>
      </Paper>
    )
  }

  if (meetings.length === 0) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Text c="dimmed" ta="center">No hay reuniones en esta categoría</Text>
      </Paper>
    )
  }

  return (
    <Stack gap="sm" style={{ maxHeight: 500, overflow: 'auto' }}>
      {meetings.map((meeting) => (
        <Paper key={meeting.id} shadow="xs" p="md" radius="md" style={{ 
          borderLeft: meeting.isFromCalendly ? '4px solid var(--mantine-color-green-6)' : undefined 
        }}>
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue">
                  {typeIcons[meeting.type]}
                </ThemeIcon>
                <Box>
                  <Group gap="xs">
                    <Text fw={600}>{meeting.title}</Text>
                    {meeting.isFromCalendly && (
                      <Badge color="green" variant="light" size="xs">Calendly</Badge>
                    )}
                  </Group>
                  <Group gap="xs">
                    <IoPerson size={12} style={{ opacity: 0.6 }} />
                    <Text size="xs" c="dimmed">{meeting.clientName}</Text>
                  </Group>
                </Box>
              </Group>
              <Badge color={statusColors[meeting.status]} variant="light" size="sm">
                {meeting.status}
              </Badge>
            </Group>

            <Group gap="md">
              <Group gap="xs">
                <IoCalendar size={14} style={{ opacity: 0.6 }} />
                <Text size="sm" c="dimmed">{meeting.date}</Text>
              </Group>
              <Group gap="xs">
                <IoTime size={14} style={{ opacity: 0.6 }} />
                <Text size="sm" c="dimmed">{meeting.time}</Text>
              </Group>
              <Badge variant="outline" size="sm">{typeLabels[meeting.type]}</Badge>
              <Text size="xs" c="dimmed">{meeting.duration} min</Text>
            </Group>

            {meeting.notes && (
              <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                {meeting.notes}
              </Text>
            )}

            {!meeting.isFromCalendly && (
              <>
                <Divider />
                <Group justify="flex-end" gap="xs">
                  {meeting.status === 'programada' && (
                    <>
                      <Button 
                        size="xs" 
                        variant="light" 
                        color="green"
                        onClick={() => onUpdateStatus(meeting.id, 'completada')}
                      >
                        Completar
                      </Button>
                      <Button 
                        size="xs" 
                        variant="light" 
                        color="red"
                        onClick={() => onUpdateStatus(meeting.id, 'cancelada')}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  <ActionIcon variant="subtle" color="red" onClick={() => onDelete(meeting.id)}>
                    <IoTrash size={16} />
                  </ActionIcon>
                </Group>
              </>
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