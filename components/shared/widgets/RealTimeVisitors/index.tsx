'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Center, Badge } from '@mantine/core'
import { IoEye, IoPeople, IoTime, IoTrendingUp } from 'react-icons/io5'

export default function RealTimeVisitors() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Visitantes en Tiempo Real</Text>
        <Badge color="teal" variant="dot" size="lg">En vivo</Badge>
      </Group>

      <Center py="xl">
        <Stack align="center" gap="xs">
          <Text size="4rem" fw={700} c="blue">127</Text>
          <Text c="dimmed" size="sm">usuarios activos ahora</Text>
        </Stack>
      </Center>

      <SimpleGrid cols={3} mt="md">
        <Stack align="center" gap={4}>
          <ThemeIcon color="blue" variant="light" size="lg" radius="md">
            <IoEye size={20} />
          </ThemeIcon>
          <Text size="lg" fw={600}>2,456</Text>
          <Text size="xs" c="dimmed">Páginas vistas</Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon color="teal" variant="light" size="lg" radius="md">
            <IoTime size={20} />
          </ThemeIcon>
          <Text size="lg" fw={600}>4:32</Text>
          <Text size="xs" c="dimmed">Tiempo prom.</Text>
        </Stack>
        <Stack align="center" gap={4}>
          <ThemeIcon color="violet" variant="light" size="lg" radius="md">
            <IoTrendingUp size={20} />
          </ThemeIcon>
          <Text size="lg" fw={600}>+12%</Text>
          <Text size="xs" c="dimmed">vs ayer</Text>
        </Stack>
      </SimpleGrid>
    </Paper>
  )
}