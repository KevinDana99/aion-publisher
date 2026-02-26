'use client'

import { Box, Paper, Text, Group, Avatar, Badge, Stack, SimpleGrid, ThemeIcon, Progress } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { IoPeople, IoChatbubble, IoCash, IoTrendingUp, IoArrowForward } from 'react-icons/io5'

const crmData = {
  totalLeads: 1284,
  leadsGrowth: 24,
  activeDeals: 23,
  dealsValue: 156000,
  unreadMessages: 5,
  conversionRate: 12.3
}

const recentLeads = [
  { id: '1', name: 'María González', platform: 'instagram', time: '2m' },
  { id: '2', name: 'Carlos Ruiz', platform: 'facebook', time: '15m' },
  { id: '3', name: 'Ana López', platform: 'instagram', time: '1h' }
]

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  whatsapp: '#25D366'
}

export default function CRMOverview() {
  const router = useRouter()

  return (
    <Paper p="md" radius="lg" shadow="sm">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">CRM</Text>
        <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => router.push('/crm')}>
          <Text size="sm" c="blue">Ver todo</Text>
          <IoArrowForward size={16} color="var(--mantine-color-blue-6)" />
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 2, md: 3 }} mb="md">
        <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-blue-light)' }}>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="white" color="blue" radius="xl">
              <IoPeople size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">Leads</Text>
          </Group>
          <Text fw={700} size="lg">{crmData.totalLeads.toLocaleString()}</Text>
          <Text size="xs" c="teal">+{crmData.leadsGrowth}%</Text>
        </Paper>

        <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-green-light)' }}>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="white" color="green" radius="xl">
              <IoCash size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">Deals</Text>
          </Group>
          <Text fw={700} size="lg">${(crmData.dealsValue / 1000).toFixed(0)}k</Text>
          <Text size="xs" c="dimmed">{crmData.activeDeals} activos</Text>
        </Paper>

        <Paper p="sm" radius="md" style={{ background: 'var(--mantine-color-pink-light)' }}>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="white" color="pink" radius="xl">
              <IoChatbubble size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">Mensajes</Text>
          </Group>
          <Text fw={700} size="lg">{crmData.unreadMessages}</Text>
          <Text size="xs" c="red">sin leer</Text>
        </Paper>
      </SimpleGrid>

      <Paper p="sm" radius="md" mb="md">
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500}>Conversión</Text>
          <Text size="sm" fw={700}>{crmData.conversionRate}%</Text>
        </Group>
        <Progress value={crmData.conversionRate} color="teal" size="sm" radius="xl" />
      </Paper>

      <Text size="sm" fw={500} mb="sm">Leads Recientes</Text>
      <Stack gap="xs">
        {recentLeads.map((lead) => (
          <Group key={lead.id} justify="space-between">
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color="blue">{lead.name.charAt(0)}</Avatar>
              <Box>
                <Text size="sm">{lead.name}</Text>
                <Badge size="xs" variant="light" color={platformColors[lead.platform]} tt="capitalize">
                  {lead.platform}
                </Badge>
              </Box>
            </Group>
            <Text size="xs" c="dimmed">{lead.time}</Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  )
}
