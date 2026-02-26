'use client'

import { Paper, Text, Group, ThemeIcon, Stack, SimpleGrid, Badge, RingProgress, Center } from '@mantine/core'
import { IoCheckmarkDone, IoHourglass, IoAlert, IoList } from 'react-icons/io5'

const tasks = {
  completed: 24,
  inProgress: 12,
  pending: 8,
  overdue: 3
}

const total = tasks.completed + tasks.inProgress + tasks.pending + tasks.overdue

export default function TasksOverview() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Tareas por Estado</Text>
        <ThemeIcon color="indigo" variant="light" size="lg" radius="md">
          <IoList size={20} />
        </ThemeIcon>
      </Group>

      <Center mb="md">
        <RingProgress
          size={160}
          thickness={16}
          roundCaps
          sections={[
            { value: (tasks.completed / total) * 100, color: 'teal' },
            { value: (tasks.inProgress / total) * 100, color: 'blue' },
            { value: (tasks.pending / total) * 100, color: 'orange' },
            { value: (tasks.overdue / total) * 100, color: 'red' }
          ]}
          label={
            <Center>
              <Stack gap={0} align="center">
                <Text fw={700} size="xl">{total}</Text>
                <Text size="xs" c="dimmed">Total</Text>
              </Stack>
            </Center>
          }
        />
      </Center>

      <SimpleGrid cols={2} spacing="sm">
        <Group gap="xs">
          <ThemeIcon color="teal" variant="light" size="sm" radius="xl">
            <IoCheckmarkDone size={12} />
          </ThemeIcon>
          <Text size="sm">Completadas: <strong>{tasks.completed}</strong></Text>
        </Group>
        <Group gap="xs">
          <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
            <IoHourglass size={12} />
          </ThemeIcon>
          <Text size="sm">En progreso: <strong>{tasks.inProgress}</strong></Text>
        </Group>
        <Group gap="xs">
          <ThemeIcon color="orange" variant="light" size="sm" radius="xl">
            <IoHourglass size={12} />
          </ThemeIcon>
          <Text size="sm">Pendientes: <strong>{tasks.pending}</strong></Text>
        </Group>
        <Group gap="xs">
          <ThemeIcon color="red" variant="light" size="sm" radius="xl">
            <IoAlert size={12} />
          </ThemeIcon>
          <Text size="sm">Vencidas: <strong>{tasks.overdue}</strong></Text>
        </Group>
      </SimpleGrid>
    </Paper>
  )
}