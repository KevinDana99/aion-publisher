'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { Container, Stack, Title, Center, Loader, Paper, Text, Group, Button, SimpleGrid, Badge, ActionIcon, Box, Modal, TextInput, Select, Divider, ThemeIcon, Tabs, Anchor, Alert, Textarea, Grid } from '@mantine/core'
import { IoVideocam, IoAdd, IoTrash, IoLink, IoCalendar, IoTime, IoPerson, IoCheckmarkCircle, IoAlertCircle, IoOpen, IoSettings, IoRefresh } from 'react-icons/io5'
import { useSettings } from '@/contexts/SettingsContext'
import { CalendarWidget, type CalendarEvent } from '@/components/shared/Calendar'
import { parseCalendlyEvent, fetchCalendlyEvents } from '@/lib/calendly'
import type { CalendlyEvent } from '@/lib/calendly'
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
}

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Kick-off Proyecto Alpha',
    clientName: 'Cliente Alpha',
    clientEmail: 'alpha@email.com',
    date: '2026-02-25',
    time: '10:00',
    duration: 60,
    type: 'videocall',
    status: 'programada',
    calendlyLink: 'https://calendly.com/aion-publisher/60min',
    notes: 'Reunión inicial para definir alcances del proyecto'
  },
  {
    id: '2',
    title: 'Revisión de Avances Beta',
    clientName: 'Beta Corp',
    clientEmail: 'beta@corp.com',
    date: '2026-02-26',
    time: '15:30',
    duration: 30,
    type: 'videocall',
    status: 'programada',
    calendlyLink: 'https://calendly.com/aion-publisher/30min',
    notes: ''
  },
  {
    id: '3',
    title: 'Cierre de Proyecto Gamma',
    clientName: 'Gamma Studios',
    clientEmail: 'gamma@studios.com',
    date: '2026-02-20',
    time: '11:00',
    duration: 45,
    type: 'presencial',
    status: 'completada',
    notes: 'Entrega final de entregables'
  },
  {
    id: '4',
    title: 'Planning Sprint Q1',
    clientName: 'Delta Inc',
    clientEmail: 'delta@inc.com',
    date: '2026-02-28',
    time: '09:00',
    duration: 90,
    type: 'videocall',
    status: 'programada',
    notes: 'Planificación del primer trimestre'
  },
  {
    id: '5',
    title: 'Demo Producto',
    clientName: 'Epsilon Labs',
    clientEmail: 'epsilon@labs.com',
    date: '2026-03-03',
    time: '14:00',
    duration: 60,
    type: 'videocall',
    status: 'programada',
    notes: 'Demostración del producto final'
  }
]

function MeetingsContent() {
  const { settings, updateIntegration } = useSettings()
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [modalOpened, setModalOpened] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendlyEvents, setCalendlyEvents] = useState<CalendlyEvent[]>([])
  const [isLoadingCalendly, setIsLoadingCalendly] = useState(false)

  const calendlyIntegration = settings.integrations.find(i => i.id === 'calendly')
  const calendlyToken = calendlyIntegration?.token || ''
  const calendlyUrl = calendlyIntegration?.webhookUrl || ''

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
    if (calendlyToken && calendlyIntegration?.enabled) {
      loadCalendlyEvents()
    }
  }, [calendlyToken, calendlyIntegration?.enabled])

  const loadCalendlyEvents = async () => {
    if (!calendlyToken) return
    
    setIsLoadingCalendly(true)
    try {
      const result = await fetchCalendlyEvents({ token: calendlyToken })
      
      if (result.success && result.events) {
        setCalendlyEvents(result.events)
      }
    } catch (error) {
      console.error('Error fetching Calendly events:', error)
    } finally {
      setIsLoadingCalendly(false)
    }
  }

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const localMeetings: CalendarEvent[] = meetings.map(m => ({
      id: m.id,
      title: m.title,
      date: m.date,
      time: m.time,
      duration: m.duration,
      type: 'meeting' as const,
      status: m.status === 'programada' ? 'pending' : m.status === 'completada' ? 'completed' : 'cancelled',
      description: m.notes,
      attendees: [m.clientName],
      location: m.type === 'videocall' ? 'Videollamada' : m.type === 'presencial' ? 'Presencial' : 'Telefónica'
    }))

    const calendlyMeetings: CalendarEvent[] = calendlyEvents.map(e => parseCalendlyEvent(e))

    return [...localMeetings, ...calendlyMeetings]
  }, [meetings, calendlyEvents])

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
      notes: newMeeting.notes || ''
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

  const scheduledCount = meetings.filter(m => m.status === 'programada').length
  const completedCount = meetings.filter(m => m.status === 'completada').length
  const cancelledCount = meetings.filter(m => m.status === 'cancelada').length

  const todayMeetings = selectedDate
    ? meetings.filter(m => dayjs(m.date).isSame(selectedDate, 'day') && m.status === 'programada')
    : []

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <IoVideocam size={28} />
            <Title order={2}>Reuniones</Title>
          </Group>
          <Group>
            {calendlyIntegration?.enabled && (
              <Button 
                variant="subtle" 
                onClick={() => loadCalendlyEvents()}
                loading={isLoadingCalendly}
                leftSection={<IoRefresh size={16} />}
              >
                Sincronizar Calendly
              </Button>
            )}
            <Button 
              variant="light" 
              component={Link}
              href="/dashboard/settings/integrations"
              leftSection={<IoSettings size={16} />}
            >
              Configurar Calendly
            </Button>
            <Button leftSection={<IoAdd size={18} />} onClick={() => setModalOpened(true)}>
              Nueva Reunión
            </Button>
          </Group>
        </Group>

        {!calendlyToken && (
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
            <Text size="xl" fw={700}>{meetings.filter(m => m.date.startsWith('2026-02')).length}</Text>
          </Paper>
        </SimpleGrid>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <CalendarWidget
              events={calendarEvents}
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
              title="Calendario de Reuniones"
              highlightToday
            />
            
            {selectedDate && todayMeetings.length > 0 && (
              <Paper shadow="xs" p="md" radius="md" mt="md">
                <Text fw={600} mb="sm">
                  Reuniones del {dayjs(selectedDate).format('DD/MM/YYYY')}
                </Text>
                <Stack gap="xs">
                  {todayMeetings.map(m => (
                    <Group key={m.id} justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon variant="light" color="blue" size="sm">
                          {typeIcons[m.type]}
                        </ThemeIcon>
                        <Text size="sm">{m.time} - {m.title}</Text>
                      </Group>
                      <Text size="xs" c="dimmed">{m.duration} min</Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Tabs defaultValue="programadas">
              <Tabs.List>
                <Tabs.Tab value="programadas">Programadas</Tabs.Tab>
                <Tabs.Tab value="todas">Todas</Tabs.Tab>
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
}

function MeetingsList({ meetings, statusColors, typeLabels, typeIcons, onDelete, onUpdateStatus }: MeetingsListProps) {
  if (meetings.length === 0) {
    return (
      <Paper shadow="xs" p="xl" radius="md">
        <Text c="dimmed" ta="center">No hay reuniones en esta categoría</Text>
      </Paper>
    )
  }

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      {meetings.map((meeting) => (
        <Paper key={meeting.id} shadow="xs" p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue">
                  {typeIcons[meeting.type]}
                </ThemeIcon>
                <Text fw={600}>{meeting.title}</Text>
              </Group>
              <Badge color={statusColors[meeting.status]} variant="light" size="sm">
                {meeting.status}
              </Badge>
            </Group>

            <Group gap="xl">
              <Group gap="xs">
                <IoPerson size={14} style={{ opacity: 0.6 }} />
                <Text size="sm" c="dimmed">{meeting.clientName}</Text>
              </Group>
              <Group gap="xs">
                <IoCalendar size={14} style={{ opacity: 0.6 }} />
                <Text size="sm" c="dimmed">{meeting.date}</Text>
              </Group>
              <Group gap="xs">
                <IoTime size={14} style={{ opacity: 0.6 }} />
                <Text size="sm" c="dimmed">{meeting.time} ({meeting.duration} min)</Text>
              </Group>
            </Group>

            <Group gap="xs">
              <Badge variant="outline" size="sm">{typeLabels[meeting.type]}</Badge>
              {meeting.calendlyLink && (
                <Anchor 
                  href={meeting.calendlyLink} 
                  target="_blank" 
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <IoLink size={14} />
                  Calendly
                  <IoOpen size={12} />
                </Anchor>
              )}
            </Group>

            {meeting.notes && (
              <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                {meeting.notes}
              </Text>
            )}

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
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  )
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<MeetingsLoader />}>
      <MeetingsContent />
    </Suspense>
  )
}
