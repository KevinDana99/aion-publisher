'use client'

import { IoTrendingUp, IoTrendingDown, IoEye, IoPeople, IoCart } from 'react-icons/io5'
import { Center, Group, Paper, RingProgress, SimpleGrid, Text } from '@mantine/core'

const icons = {
  up: IoTrendingUp,
  down: IoTrendingDown
}

const data = [
  { label: 'Vistas', stats: '456,578', progress: 65, color: 'blue', icon: 'up' as const },
  { label: 'Nuevos usuarios', stats: '2,550', progress: 72, color: 'teal', icon: 'up' as const },
  { label: 'Conversiones', stats: '4,735', progress: 52, color: 'violet', icon: 'up' as const }
]

export default function StatsRing() {
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon]
    return (
      <Paper radius="lg" p="lg" key={stat.label} shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon size={20} style={{ color: `var(--mantine-color-${stat.color}-6)` }} />
              </Center>
            }
          />
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    )
  })

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
}
