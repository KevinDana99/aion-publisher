'use client'

import { IoTrendingUp, IoTrendingDown, IoEye, IoDocumentText, IoPeople, IoHeart } from 'react-icons/io5'
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core'
import classes from './StatsGrid.module.css'

const data = [
  { title: 'Ingresos', value: '$13,456', diff: 34, icon: IoTrendingUp },
  { title: 'Publicaciones', value: '128', diff: 12, icon: IoDocumentText },
  { title: 'Suscriptores', value: '2,847', diff: 18, icon: IoPeople },
  { title: 'Engagement', value: '4.8%', diff: -5, icon: IoHeart }
]

export default function StatsGrid() {
  const stats = data.map((stat) => {
    const DiffIcon = stat.diff > 0 ? IoTrendingUp : IoTrendingDown

    return (
      <Paper p="md" radius="lg" shadow="sm" key={stat.title} style={{ background: 'var(--mantine-color-body)' }}>
        <Group justify="apart" mb="xs">
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
            {stat.title}
          </Text>
          <ThemeIcon
            color="gray"
            variant="light"
            style={{
              color: stat.diff > 0 ? 'var(--mantine-color-teal-6)' : 'var(--mantine-color-red-6)',
              background: stat.diff > 0 ? 'rgba(64, 192, 87, 0.1)' : 'rgba(250, 82, 82, 0.1)'
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
    )
  })

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>{stats}</SimpleGrid>
    </div>
  )
}
