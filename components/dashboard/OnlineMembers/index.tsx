'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Badge, Avatar, Indicator } from '@mantine/core'
import { IoPeople, IoEllipse } from 'react-icons/io5'

const members = [
  { name: 'Juan Pérez', avatar: 'JP', role: 'CEO', status: 'online' },
  { name: 'María García', avatar: 'MG', role: 'Marketing', status: 'online' },
  { name: 'Carlos López', avatar: 'CL', role: 'Desarrollo', status: 'online' },
  { name: 'Ana Martínez', avatar: 'AM', role: 'Diseño', status: 'away' },
  { name: 'Pedro Sánchez', avatar: 'PS', role: 'Ventas', status: 'offline' },
  { name: 'Laura Torres', avatar: 'LT', role: 'Soporte', status: 'online' }
]

const statusColors: Record<string, string> = {
  online: 'teal',
  away: 'orange',
  offline: 'gray'
}

export default function OnlineMembers() {
  const onlineCount = members.filter(m => m.status === 'online').length

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Miembros Online</Text>
        <Badge color="teal" size="lg">
          <Group gap={4}>
            <IoEllipse size={8} fill="currentColor" />
            {onlineCount} activos
          </Group>
        </Badge>
      </Group>

      <Stack gap="sm">
        {members.map((member) => (
          <Group key={member.name} justify="space-between">
            <Group gap="sm">
              <Indicator 
                color={statusColors[member.status]} 
                size={10} 
                offset={3} 
                position="bottom-end"
                withBorder
              >
                <Avatar color="blue" radius="xl" size="sm">{member.avatar}</Avatar>
              </Indicator>
              <div>
                <Text size="sm" fw={500}>{member.name}</Text>
                <Text size="xs" c="dimmed">{member.role}</Text>
              </div>
            </Group>
            <Badge 
              color={statusColors[member.status]} 
              variant="light" 
              size="sm"
            >
              {member.status === 'online' ? 'Activo' : member.status === 'away' ? 'Ausente' : 'Offline'}
            </Badge>
          </Group>
        ))}
      </Stack>
    </Paper>
  )
}