'use client'

import { Container, Stack, Title, SimpleGrid, Group } from '@mantine/core'
import { IoFolder, IoWallet } from 'react-icons/io5'
import { 
  ActiveProjects, 
  TasksOverview, 
  ProgressCard
} from '@/components/dashboard'

export default function ProjectsPage() {
  const today = new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="xl">
        <Group gap="xs" mb="sm">
          <IoFolder size={28} />
          <Title order={2}>Gestión de Proyectos</Title>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          <ActiveProjects />
          <TasksOverview />
          <ProgressCard
            title="Meta mensual"
            icon={<IoWallet size={20} />}
            current={5431}
            target={10000}
            daysLeft={daysLeft}
            color="blue"
          />
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
