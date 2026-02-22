'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Progress } from '@mantine/core'
import { IoDocumentText, IoTrendingUp } from 'react-icons/io5'

const pages = [
  { name: '/home', views: '12,456', percentage: 100, change: '+15%' },
  { name: '/productos', views: '8,234', percentage: 66, change: '+8%' },
  { name: '/precios', views: '6,123', percentage: 49, change: '-2%' },
  { name: '/contacto', views: '4,892', percentage: 39, change: '+22%' },
  { name: '/blog', views: '3,456', percentage: 28, change: '+5%' }
]

export default function TopPages() {
  const maxViews = 12456

  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Páginas Más Visitadas</Text>
        <ThemeIcon color="violet" variant="light" size="lg" radius="md">
          <IoDocumentText size={20} />
        </ThemeIcon>
      </Group>

      <Stack gap="md">
        {pages.map((page, index) => (
          <div key={page.name}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>{page.name}</Text>
              <Group gap="xs">
                <Text size="sm" fw={600}>{page.views}</Text>
                <Text size="xs" c={page.change.startsWith('+') ? 'teal' : 'red'} fw={500}>
                  {page.change}
                </Text>
              </Group>
            </Group>
            <Progress 
              value={page.percentage} 
              size="sm" 
              radius="xl" 
              color={index === 0 ? 'blue' : index === 1 ? 'teal' : index === 2 ? 'violet' : 'gray'}
            />
          </div>
        ))}
      </Stack>
    </Paper>
  )
}