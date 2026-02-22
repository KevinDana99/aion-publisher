'use client'

import { Suspense } from 'react'
import { Container, Stack, Title, Group, Loader, Center } from '@mantine/core'
import { IoGitBranch } from 'react-icons/io5'
import KanbanBoard from '@/components/team/KanbanBoard'

function KanbanLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

export default function TeamKanbanPage() {
  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="lg">
        <Group gap="xs" mb="sm">
          <IoGitBranch size={28} />
          <Title order={2}>Tablero de Equipo</Title>
        </Group>

        <Suspense fallback={<KanbanLoader />}>
          <KanbanBoard />
        </Suspense>
      </Stack>
    </Container>
  )
}
