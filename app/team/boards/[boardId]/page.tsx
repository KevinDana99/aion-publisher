'use client'

import { Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container, Stack, Title, Group, Loader, Center, ActionIcon, Paper } from '@mantine/core'
import { IoGitBranch, IoArrowBack } from 'react-icons/io5'
import KanbanBoard from '@/components/shared/boards/KanbanBoard'

const projectInfo: Record<string, { name: string; color: string }> = {
  website: { name: 'Website Redesign', color: '#228be6' },
  api: { name: 'API Development', color: '#15aabf' },
  marketing: { name: 'Marketing Campaign', color: '#be4bdb' },
  devops: { name: 'DevOps Infrastructure', color: '#fd7e14' },
  docs: { name: 'Documentation', color: '#40c057' },
  ux: { name: 'UX Research', color: '#fab005' }
}

function BoardLoader() {
  return (
    <Center h={400}>
      <Loader size="lg" />
    </Center>
  )
}

function BoardContent() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.boardId as string
  const project = projectInfo[boardId] || { name: boardId, color: '#228be6' }

  return (
    <Container size="xl" py="xl" fluid>
      <Stack gap="lg">
        <Group gap="xs">
          <Paper shadow="xs" radius="xl" style={{ background: 'var(--mantine-color-default)' }}>
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => router.push('/dashboard/team/boards')}
              aria-label="Volver a tableros"
            >
              <IoArrowBack size={20} />
            </ActionIcon>
          </Paper>
          <IoGitBranch size={28} color={project.color} />
          <Title order={2}>{project.name}</Title>
        </Group>

        <Suspense fallback={<BoardLoader />}>
          <KanbanBoard project={boardId} />
        </Suspense>
      </Stack>
    </Container>
  )
}

export default function BoardDetailPage() {
  return (
    <Suspense fallback={<BoardLoader />}>
      <BoardContent />
    </Suspense>
  )
}
