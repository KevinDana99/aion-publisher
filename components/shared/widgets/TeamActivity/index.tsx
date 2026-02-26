'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Timeline, Avatar } from '@mantine/core'
import { IoGitCommit, IoCreate, IoCheckmarkDone, IoChatbubble, IoDocumentText } from 'react-icons/io5'

const activities = [
  { user: 'Juan Pérez', avatar: 'JP', action: 'Completó tarea', detail: 'Diseño de landing page', time: 'Hace 5 min', icon: IoCheckmarkDone, color: 'teal' },
  { user: 'María García', avatar: 'MG', action: 'Creó campaña', detail: 'Black Friday 2024', time: 'Hace 15 min', icon: IoCreate, color: 'blue' },
  { user: 'Carlos López', avatar: 'CL', action: 'Actualizó proyecto', detail: 'API v2.0', time: 'Hace 32 min', icon: IoGitCommit, color: 'violet' },
  { user: 'Ana Martínez', avatar: 'AM', action: 'Respondió comentario', detail: 'Instagram - Post #45', time: 'Hace 1 hora', icon: IoChatbubble, color: 'orange' },
  { user: 'Pedro Sánchez', avatar: 'PS', action: 'Generó factura', detail: '#FAC-2024-089', time: 'Hace 2 horas', icon: IoDocumentText, color: 'indigo' }
]

export default function TeamActivity() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Actividad Reciente</Text>
        <ThemeIcon color="cyan" variant="light" size="lg" radius="md">
          <IoGitCommit size={20} />
        </ThemeIcon>
      </Group>

      <Stack gap="sm">
        {activities.map((activity, index) => (
          <Paper key={index} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group gap="sm">
            <Avatar color="blue" radius="xl" size="sm">{activity.avatar}</Avatar>
            <div style={{ flex: 1 }}>
              <Group gap="xs">
                <Text size="sm" fw={600}>{activity.user}</Text>
                <Text size="sm" c="dimmed">{activity.action}</Text>
              </Group>
              <Text size="xs" c="dimmed">{activity.detail}</Text>
            </div>
            <ThemeIcon color={activity.color} variant="light" size="sm" radius="md">
              <activity.icon size={14} />
            </ThemeIcon>
          </Group>
        </Paper>
        ))}
      </Stack>
    </Paper>
  )
}