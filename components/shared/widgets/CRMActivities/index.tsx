'use client'

import { Box, Paper, Text, Group, Avatar, Stack, ThemeIcon, useMantineColorScheme } from '@mantine/core'
import { IoCall, IoMail, IoCheckmarkCircle, IoChatbubble, IoPersonAdd, IoCash } from 'react-icons/io5'
import useMounted from '@/hooks/useMounted'

interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'message' | 'deal' | 'contact'
  description: string
  user: { name: string; avatar: string }
  timestamp: Date
}

const FIXED_DATE = new Date('2026-02-26T12:00:00Z')

const activities: Activity[] = [
  { id: '1', type: 'message', description: 'Nuevo mensaje de María González (Instagram)', user: { name: 'Juan Pérez', avatar: 'JP' }, timestamp: new Date(FIXED_DATE.getTime() - 120000) },
  { id: '2', type: 'deal', description: 'Deal cerrado: Plan Enterprise - $12,000', user: { name: 'María García', avatar: 'MG' }, timestamp: new Date(FIXED_DATE.getTime() - 3600000) },
  { id: '3', type: 'call', description: 'Llamada completada con Carlos Ruiz', user: { name: 'Juan Pérez', avatar: 'JP' }, timestamp: new Date(FIXED_DATE.getTime() - 7200000) },
  { id: '4', type: 'contact', description: 'Nuevo lead agregado: Pedro Sánchez', user: { name: 'Carlos López', avatar: 'CL' }, timestamp: new Date(FIXED_DATE.getTime() - 14400000) },
  { id: '5', type: 'email', description: 'Email enviado a Ana López', user: { name: 'María García', avatar: 'MG' }, timestamp: new Date(FIXED_DATE.getTime() - 21600000) },
  { id: '6', type: 'meeting', description: 'Reunión programada con TechCorp', user: { name: 'Juan Pérez', avatar: 'JP' }, timestamp: new Date(FIXED_DATE.getTime() - 43200000) },
  { id: '7', type: 'deal', description: 'Nueva propuesta enviada a RetailMax', user: { name: 'Ana Martínez', avatar: 'AM' }, timestamp: new Date(FIXED_DATE.getTime() - 86400000) }
]

const activityConfig: Record<string, { icon: typeof IoCall; color: string }> = {
  call: { icon: IoCall, color: 'teal' },
  email: { icon: IoMail, color: 'blue' },
  meeting: { icon: IoCheckmarkCircle, color: 'grape' },
  message: { icon: IoChatbubble, color: 'pink' },
  contact: { icon: IoPersonAdd, color: 'green' },
  deal: { icon: IoCash, color: 'orange' }
}

const formatTimestamp = (date: Date) => {
  const diff = FIXED_DATE.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${days}d`
}

export default function CRMActivities() {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const mounted = useMounted()

  return (
    <Paper p="md" radius="lg" shadow="sm" style={{ height: '100%', background: !mounted || isDark ? 'var(--mantine-color-dark-6)' : 'white' }}>
      <Text fw={700} size="lg" mb="md">Actividad Reciente</Text>
      <Stack gap="sm">
        {activities.map((activity) => {
          const config = activityConfig[activity.type]
          const Icon = config.icon

          return (
            <Group key={activity.id} gap="sm" wrap="nowrap">
              <Avatar color="blue" radius="xl">{activity.user.avatar}</Avatar>
              <Box style={{ flex: 1 }}>
                <Group gap="xs" mb={2}>
                  <ThemeIcon size="sm" variant="light" color={config.color} radius="xl">
                    <Icon size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>{activity.user.name}</Text>
                </Group>
                <Text size="xs" c="dimmed" lineClamp={1}>{activity.description}</Text>
              </Box>
              <Text size="xs" c="dimmed">{formatTimestamp(activity.timestamp)}</Text>
            </Group>
          )
        })}
      </Stack>
    </Paper>
  )
}
