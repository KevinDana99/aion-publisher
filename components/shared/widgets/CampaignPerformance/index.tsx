'use client'

import { Paper, Text, Group, ThemeIcon, SimpleGrid, Progress, Stack } from '@mantine/core'
import { IoTrendingUp, IoTrendingDown, IoMegaphone } from 'react-icons/io5'

const campaigns = [
  { name: 'Black Friday', status: 'Activa', progress: 78, reach: '45.2K', engagement: '4.2%', trend: 12 },
  { name: 'Lanzamiento Q4', status: 'Activa', progress: 45, reach: '28.1K', engagement: '3.8%', trend: -3 },
  { name: 'Brand Awareness', status: 'Pausada', progress: 92, reach: '89.5K', engagement: '5.1%', trend: 8 },
  { name: 'Email Campaign', status: 'Activa', progress: 60, reach: '12.3K', engagement: '6.2%', trend: 15 }
]

export default function CampaignPerformance() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Performance de Campañas</Text>
        <ThemeIcon color="blue" variant="light" size="lg" radius="md">
          <IoMegaphone size={20} />
        </ThemeIcon>
      </Group>

      <Stack gap="md">
        {campaigns.map((campaign) => (
          <Paper key={campaign.name} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group justify="apart" mb="xs">
              <Group gap="xs">
                <Text fw={600} size="sm">{campaign.name}</Text>
                <Text size="xs" c={campaign.status === 'Activa' ? 'teal' : 'orange'} fw={500}>
                  {campaign.status}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="xs" c="dimmed">{campaign.reach}</Text>
                <Group gap={4}>
                  {campaign.trend > 0 ? (
                    <IoTrendingUp size={14} color="var(--mantine-color-teal-6)" />
                  ) : (
                    <IoTrendingDown size={14} color="var(--mantine-color-red-6)" />
                  )}
                  <Text size="xs" c={campaign.trend > 0 ? 'teal' : 'red'} fw={500}>
                    {campaign.trend > 0 ? '+' : ''}{campaign.trend}%
                  </Text>
                </Group>
              </Group>
            </Group>
            <Progress value={campaign.progress} size="sm" radius="xl" color={campaign.status === 'Activa' ? 'blue' : 'gray'} />
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">Engagement: {campaign.engagement}</Text>
              <Text size="xs" c="dimmed">{campaign.progress}% completado</Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  )
}