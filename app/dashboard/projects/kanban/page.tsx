'use client'

import { Container, Stack, Title, Group } from '@mantine/core'
import { IoGitBranch } from 'react-icons/io5'
import KanbanBoard from '@/components/projects/KanbanBoard'

export default function KanbanPage() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="lg">
        <Group gap="xs" mb="sm">
          <IoGitBranch size={28} />
          <Title order={2}>Tablero Kanban</Title>
        </Group>

        <KanbanBoard />
      </Stack>
    </Container>
  )
}
