'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Badge, Progress } from '@mantine/core'
import { IoTrendingUp, IoTrendingDown, IoWallet, IoCard } from 'react-icons/io5'

export default function RevenueOverview() {
  const data = [
    { label: 'Ingresos', value: '$45,231', change: '+12%', trend: 'up' },
    { label: 'Egresos', value: '$12,450', change: '+5%', trend: 'up' },
    { label: 'Ganancia', value: '$32,781', change: '+18%', trend: 'up' }
  ]

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Resumen Financiero</Text>
        <ThemeIcon color="green" variant="light" size="lg" radius="md">
          <IoWallet size={20} />
        </ThemeIcon>
      </Group>

      <Stack gap="lg">
        {data.map((item) => (
          <Group key={item.label} justify="space-between">
            <div>
              <Text size="sm" c="dimmed">{item.label}</Text>
              <Text size="xl" fw={700}>{item.value}</Text>
            </div>
            <Group gap="xs">
              {item.trend === 'up' ? (
                <IoTrendingUp size={20} color="var(--mantine-color-teal-6)" />
              ) : (
                <IoTrendingDown size={20} color="var(--mantine-color-red-6)" />
              )}
              <Text c={item.trend === 'up' ? 'teal' : 'red'} fw={600}>
                {item.change}
              </Text>
            </Group>
          </Group>
        ))}

        <Progress.Root size="lg" radius="xl">
          <Progress.Section value={60} color="teal">
            <Progress.Label>Ingresos</Progress.Label>
          </Progress.Section>
          <Progress.Section value={13} color="red">
            <Progress.Label>Egresos</Progress.Label>
          </Progress.Section>
        </Progress.Root>
        <Text size="xs" c="dimmed" ta="center">73% margen de ganancia</Text>
      </Stack>
    </Paper>
  )
}