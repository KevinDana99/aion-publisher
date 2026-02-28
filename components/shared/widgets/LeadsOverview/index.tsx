'use client'

import { IoPeople, IoCall, IoCheckmarkCircle, IoTrendingUp } from 'react-icons/io5'
import { Box, Group, Paper, SimpleGrid, Text, ThemeIcon, useMantineColorScheme } from '@mantine/core'

const data = [
  { title: 'Total Leads', value: '1,284', diff: 24, icon: IoPeople },
  { title: 'Llamadas Hoy', value: '47', diff: 12, icon: IoCall },
  { title: 'Cerrados', value: '156', diff: 8, icon: IoCheckmarkCircle },
  { title: 'Tasa Conversión', value: '12.3%', diff: 3, icon: IoTrendingUp }
]

export default function LeadsOverview() {
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  
  const stats = data.map((stat) => (
    <Paper p="md" radius="lg" shadow="sm" key={stat.title} style={{ background: isDark ? 'var(--mantine-color-dark-6)' : 'white' }}>
      <Group justify="apart" mb="xs">
        <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
          {stat.title}
        </Text>
        <ThemeIcon
          color="gray"
          variant="light"
          style={{
            color: stat.diff > 0 ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
            background: stat.diff > 0 ? (isDark ? 'rgba(64, 192, 87, 0.15)' : 'rgba(64, 192, 87, 0.1)') : (isDark ? 'rgba(250, 82, 82, 0.15)' : 'rgba(250, 82, 82, 0.1)')
          }}
          size={38}
          radius="md"
        >
          <stat.icon size={22} />
        </ThemeIcon>
      </Group>
      <Text fw={700} fz="xl" mb="xs">
        {stat.value}
      </Text>
      <Text c="dimmed" fz="sm">
        <Text component="span" c={stat.diff > 0 ? 'teal' : 'red'} fw={700}>
          {stat.diff > 0 ? '+' : ''}{stat.diff}%
        </Text>{' '}
        vs mes anterior
      </Text>
    </Paper>
  ))

  return (
    <Box p="md">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>{stats}</SimpleGrid>
    </Box>
  )
}
