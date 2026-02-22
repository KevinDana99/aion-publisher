'use client'

import { Paper, Text, Group, ThemeIcon, Stack, Progress, Badge, SimpleGrid } from '@mantine/core'
import { IoFolder, IoCheckmarkCircle, IoTime, IoAlertCircle } from 'react-icons/io5'

const projects = [
  { name: 'Rediseño Web', progress: 75, status: 'En progreso', dueDate: '15 Dic' },
  { name: 'App Mobile', progress: 45, status: 'En progreso', dueDate: '20 Dic' },
  { name: 'CRM Integration', progress: 90, status: 'En revisión', dueDate: '10 Dic' },
  { name: 'API v2', progress: 30, status: 'En progreso', dueDate: '28 Dic' }
]

export default function ActiveProjects() {
  return (
    <Paper p="lg" radius="lg" shadow="sm" style={{ background: 'var(--mantine-color-body)' }}>
      <Group justify="apart" mb="md">
        <Text fw={700} size="lg">Proyectos Activos</Text>
        <Badge color="blue" size="lg">{projects.length} activos</Badge>
      </Group>

      <Stack gap="md">
        {projects.map((project) => (
          <Paper key={project.name} p="sm" radius="md" style={{ background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))' }}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={600}>{project.name}</Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">Vence: {project.dueDate}</Text>
                <ThemeIcon 
                  color={project.progress >= 80 ? 'teal' : project.progress >= 50 ? 'blue' : 'orange'} 
                  variant="light" 
                  size="sm" 
                  radius="xl"
                >
                  {project.progress >= 80 ? <IoCheckmarkCircle size={14} /> : <IoTime size={14} />}
                </ThemeIcon>
              </Group>
            </Group>
            <Progress 
              value={project.progress} 
              size="sm" 
              radius="xl" 
              color={project.progress >= 80 ? 'teal' : project.progress >= 50 ? 'blue' : 'orange'}
            />
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">{project.status}</Text>
              <Text size="xs" fw={500}>{project.progress}%</Text>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  )
}