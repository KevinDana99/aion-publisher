'use client'

import { IoTrendingUp, IoPhonePortrait, IoLaptop, IoTabletPortrait } from 'react-icons/io5'
import { Box, Group, Paper, Progress, SimpleGrid, Text } from '@mantine/core'

const data = [
  { label: 'Mobile', count: '204,001', part: 59, color: '#228BE6', icon: IoPhonePortrait },
  { label: 'Desktop', count: '121,017', part: 35, color: '#7950F2', icon: IoLaptop },
  { label: 'Tablet', count: '31,118', part: 6, color: '#15AABF', icon: IoTabletPortrait }
]

export default function StatsSegments() {
  const segments = data.map((segment) => (
    <Progress.Section
      value={segment.part}
      color={segment.color}
      key={segment.color}
      aria-label={segment.label}
    >
      {segment.part > 10 && <Progress.Label>{segment.part}%</Progress.Label>}
    </Progress.Section>
  ))

  const descriptions = data.map((stat) => (
    <Box 
      key={stat.label} 
      py="xs" 
      style={{ borderBottom: '3px solid transparent', borderBottomColor: stat.color }}
    >
      <Group justify="space-between" mb={4}>
        <Group gap="xs">
          <stat.icon size={16} style={{ color: stat.color }} />
          <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
            {stat.label}
          </Text>
        </Group>
        <Text c={stat.color} fw={700} size="sm">
          {stat.part}%
        </Text>
      </Group>
      <Text fw={700} size="lg">
        {stat.count}
      </Text>
    </Box>
  ))

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="space-between" mb="md">
        <div>
          <Group align="flex-end" gap="xs">
            <Text fz="xl" fw={700}>
              356,136
            </Text>
            <Text c="teal" fz="sm" fw={700}>
              <span>18%</span>
              <IoTrendingUp size={16} style={{ marginBottom: 4, marginLeft: 4 }} />
            </Text>
          </Group>
          <Text c="dimmed" fz="sm">
            Visitas totales este mes
          </Text>
        </div>
      </Group>

      <Progress.Root size={24} mt="xl" mb="lg">
        {segments}
      </Progress.Root>
      
      <SimpleGrid cols={{ base: 1, xs: 3 }} mt="md">
        {descriptions}
      </SimpleGrid>
    </Paper>
  )
}
