'use client'

import { Box, Avatar, Group, Text, Paper, Badge, Stack, useMantineColorScheme } from '@mantine/core'
import useMounted from '@/hooks/useMounted'

interface Contact {
  id: string
  name: string
  avatar: string
  platform: 'instagram' | 'facebook' | 'whatsapp'
  lastMessage: string
  time: string
  status: 'new' | 'pending' | 'responded'
}

const contacts: Contact[] = [
  { id: '1', name: 'María González', avatar: 'MG', platform: 'instagram', lastMessage: 'Hola, tengo una consulta sobre...', time: '2m', status: 'new' },
  { id: '2', name: 'Carlos Ruiz', avatar: 'CR', platform: 'facebook', lastMessage: 'Gracias por la información', time: '15m', status: 'responded' },
  { id: '3', name: 'Ana López', avatar: 'AL', platform: 'instagram', lastMessage: '¿Tienen disponibilidad para...?', time: '1h', status: 'pending' },
  { id: '4', name: 'Pedro Sánchez', avatar: 'PS', platform: 'facebook', lastMessage: 'Me interesa el producto', time: '3h', status: 'new' }
]

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  whatsapp: '#25D366'
}

const statusColors: Record<string, string> = {
  new: 'blue',
  pending: 'yellow',
  responded: 'teal'
}

export default function RecentContacts() {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const mounted = useMounted()
  
  return (
    <Paper p="md" radius="lg" shadow="sm" style={{ background: !mounted || isDark ? 'var(--mantine-color-dark-6)' : 'white' }}>
      <Text fw={700} size="lg" mb="md">Contactos Recientes</Text>
      <Stack gap="sm">
        {contacts.map((contact) => (
          <Group key={contact.id} justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Avatar color="blue" radius="xl">{contact.avatar}</Avatar>
              <Box>
                <Text fw={500} size="sm">{contact.name}</Text>
                <Text c="dimmed" size="xs" lineClamp={1}>{contact.lastMessage}</Text>
              </Box>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <Badge size="xs" variant="light" color={platformColors[contact.platform]} tt="capitalize">
                {contact.platform}
              </Badge>
              <Badge size="xs" variant="filled" color={statusColors[contact.status]} tt="capitalize">
                {contact.status}
              </Badge>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  )
}
